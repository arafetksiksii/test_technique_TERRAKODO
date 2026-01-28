import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const addTask = createAction('[Task] Add', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update', props<{ task: Task }>());
export const deleteTask = createAction('[Task] Delete', props<{ id: number }>());
export const toggleTask = createAction('[Task] Toggle', props<{ id: number }>());
export const clearTasks = createAction('[Task] Clear'); // on logout
