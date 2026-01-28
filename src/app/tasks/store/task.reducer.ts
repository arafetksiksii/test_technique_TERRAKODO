import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task.model';
import * as TaskActions from './task.actions';
import {logout} from '../../auth/store/auth.actions'

export const initialState: Task[] = [];

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.addTask, (state, { task }) => [...state, task]),
  on(TaskActions.updateTask, (state, { task }) =>
    state.map(t => t.id === task.id ? { ...t, ...task } : t)
  ),
  on(TaskActions.deleteTask, (state, { id }) => state.filter(t => t.id !== id)),
  on(TaskActions.toggleTask, (state, { id }) =>
    state.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  ),
  on(TaskActions.clearTasks, state => []),
  on(logout, () => []) // <-- clear tasks on logout

);
