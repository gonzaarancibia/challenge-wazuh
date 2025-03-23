import { StateCreator } from 'zustand';
import { Todo } from '../../../types/todo';

export interface TodoSlice {
  todos: Todo[];
  loading: boolean;
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  fetchTodos: (http: any) => Promise<void>;
  updateTodoStatus: (http: any, id: string, status: Todo['status']) => Promise<void>;
  createTodo: (http: any, todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<void>;
  deleteTodo: (http: any, id: string) => Promise<void>;
}

export const createTodoSlice: StateCreator<TodoSlice> = (set, get) => ({
  todos: [],
  loading: false,
  setTodos: (todos) => set({ todos }),
  setLoading: (loading) => set({ loading }),

  fetchTodos: async (http) => {
    set({ loading: true });
    try {
      const response = await http.get('/api/todo_plugin/todos');
      set({ todos: response.todos || [], loading: false });
    } catch (error) {
      console.error('Error fetching todos:', error);
      set({ loading: false });
    }
  },

  createTodo: async (http, todo) => {
    try {
      const response = await http.post('/api/todo_plugin/todos', {
        body: JSON.stringify(todo)
      });
      set(state => ({
        todos: [response, ...state.todos]
      }));
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  updateTodoStatus: async (http, id, status) => {
    try {
      await http.put(`/api/todo_plugin/todos/${id}`, {
        body: JSON.stringify({ status })
      });
      set(state => ({
        todos: state.todos.map(todo =>
          todo.id === id
            ? { ...todo, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined }
            : todo
        )
      }));
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (http, id) => {
    try {
      await http.delete(`/api/todo_plugin/todos/${id}`);
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
});