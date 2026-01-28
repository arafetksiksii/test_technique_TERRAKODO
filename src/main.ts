import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { App } from './app/app';
import { authReducer } from './app/auth/store/auth.reducer';
import { taskReducer } from './app/tasks/store/task.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideStore({ auth: authReducer, tasks: taskReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
});
