import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models/auth-state.model';

export const selectAuthState =
  createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectUserEmail = createSelector(
  selectAuthState,
  (state) => state.userEmail
);
