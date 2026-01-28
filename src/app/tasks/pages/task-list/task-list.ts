import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as TaskActions from '../../../tasks/store/task.actions';
import { Observable, map, firstValueFrom } from 'rxjs';
import { Task } from '../../models/task.model';

@Component({
  selector: 'task-list-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  form!: FormGroup;
  editId: number | null = null;
  editCompleted: boolean = false;
  currentUserEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store<{ tasks: Task[]; auth: { email: string | null } }>
  ) {}

  async ngOnInit(): Promise<void> {
    // get logged-in user email
    const auth = await firstValueFrom(this.store.pipe(select('auth')));
    this.currentUserEmail = auth.email || '';

    // filter tasks by current user
    this.tasks$ = this.store.pipe(
      select('tasks'),
      map(tasks => tasks.filter(t => t.userEmail === this.currentUserEmail))
    );

    // reactive form with validation
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100), this.noScriptsValidator]],
      description: ['', [Validators.maxLength(500), this.noScriptsValidator]],
      priority: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      dueDate: ['', Validators.required]
    });
  }

  // Custom validator to prevent <script> injection
  noScriptsValidator(control: AbstractControl) {
    const forbidden = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
    return forbidden.test(control.value) ? { scriptsNotAllowed: true } : null;
  }

  submit(): void {
    if (!this.form.valid) return;

    const value = this.sanitizeForm(this.form.value);

    if (this.editId !== null) {
      // update existing task, preserve completed status
      this.store.dispatch(TaskActions.updateTask({
        task: { ...value, id: this.editId, completed: this.editCompleted, userEmail: this.currentUserEmail }
      }));
    } else {
      const id = Date.now(); // simple unique id
      this.store.dispatch(TaskActions.addTask({
        task: { ...value, id, completed: false, userEmail: this.currentUserEmail }
      }));
    }

    this.form.reset({ priority: 1 });
    this.editId = null;
    this.editCompleted = false;
  }

  edit(task: Task) {
    this.editId = task.id;
    this.editCompleted = task.completed;

    this.form.setValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    });
  }

  delete(id: number) {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  toggle(id: number) {
    this.store.dispatch(TaskActions.toggleTask({ id }));
  }

  // Simple sanitization to remove any <script> tags
  sanitizeForm(value: any) {
    const sanitize = (str: string) => (str ? str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') : '');
    return {
      title: sanitize(value.title),
      description: sanitize(value.description),
      priority: value.priority,
      dueDate: value.dueDate
    };
  }
}
