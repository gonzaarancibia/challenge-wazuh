import create from 'zustand';
import { TodoSlice, createTodoSlice } from './slices/todoSlice';

export const useStore = create<TodoSlice>()((...args) => ({
    ...createTodoSlice(...args),
}));