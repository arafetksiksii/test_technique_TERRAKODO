import { Component } from '@angular/core';
import { LoginComponent } from './auth/pages/login/login';
import { TaskListComponent } from './tasks/pages/task-list/task-list';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {logout} from '../app/auth/store/auth.actions'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, TaskListComponent],
  template: `
    <!-- Show login form if not logged in -->
    <app-login *ngIf="!(isLoggedIn$ | async)"></app-login>

    <!-- Show tasks and logout button if logged in -->
    <div *ngIf="isLoggedIn$ | async">
      <button (click)="logout()" style="margin-bottom: 1rem;">Logout</button>
      <task-list-component></task-list-component>
    </div>
  `
})
export class App {
  isLoggedIn$!: Observable<boolean>;

  constructor(private store: Store<{ auth: { email: string | null } }>) {
    this.isLoggedIn$ = this.store.pipe(select(state => !!state.auth.email));
  }
    logout() {
    this.store.dispatch(logout());
  }
}
