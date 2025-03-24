import { StateCreator } from 'zustand';
import { Todo } from '../../../types/todo';

export interface TodoSlice {
  todos: Todo[];
  filteredTodos: Todo[];
  loading: boolean;
  searchTerm: string;
  selectedTags: string[];
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  fetchTodos: (http: any) => Promise<void>;
  updateTodoStatus: (http: any, id: string, status: Todo['status']) => Promise<void>;
  createTodo: (http: any, todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<void>;
  deleteTodo: (http: any, id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedTags: (tags: string[]) => void;
  applyFilters: () => void;
}

export const createTodoSlice: StateCreator<TodoSlice> = (set, get) => ({
  todos: [],
  filteredTodos: [],
  loading: false,
  searchTerm: '',
  selectedTags: [],
  setTodos: (todos) => {
    set({ todos });
    get().applyFilters();
  },
  setLoading: (loading) => set({ loading }),

  fetchTodos: async (http) => {
    set({ loading: true });
    try {
      const response = await http.get('/api/todo_plugin/todos');
      set({ todos: response.todos || [] });
      get().applyFilters();
      set({ loading: false });
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
      get().applyFilters();
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
      get().applyFilters();
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
      get().applyFilters();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    get().applyFilters();
  },

  setSelectedTags: (tags: string[]) => {
    set({ selectedTags: tags });
    get().applyFilters();
  },

  applyFilters: () => {
    const { todos, searchTerm, selectedTags } = get();
    let filtered = [...todos];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(todo =>
        todo.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    set({ filteredTodos: filtered });
  }
});