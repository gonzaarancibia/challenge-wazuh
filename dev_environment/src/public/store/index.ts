import create from 'zustand';
import { TodoSlice, createTodoSlice } from './slices/todoSlice';
import { FilterSlice, createFilterSlice } from './slices/filterSlice';

export const useStore = create<TodoSlice & FilterSlice>()((...args) => ({
    ...createTodoSlice(...args),
    // ...createFilterSlice(...args),
}));