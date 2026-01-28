import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  login(): void {
    if (this.form.valid) {
      this.store.dispatch(AuthActions.login({ email: this.form.value['email'] }));
    } else {
      this.form.markAllAsTouched(); // show errors if invalid
    }
  }

  // ✅ All getters MUST be inside the class
  get emailInvalid(): boolean {
    const control = this.form.get('email');
    return !!control && control.touched && control.invalid;
  }

  get emailRequired(): boolean {
    const control = this.form.get('email');
    return !!control && control.touched && control.hasError('required');
  }

  get emailFormatInvalid(): boolean {
    const control = this.form.get('email');
    return !!control && control.touched && control.hasError('email');
  }
}
