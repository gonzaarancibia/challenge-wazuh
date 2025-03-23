import { useState, useCallback, useEffect, useRef } from 'react';
import { CoreStart } from '../../../../src/core/public';
import { debounce } from 'lodash';


export interface Todo {
    id: string;
    title: string;
    status: 'planned' | 'completed' | 'error';
    createdAt: string;
    completedAt?: string;
    errorAt?: string;
    assignee?: string;
    description?: string;
    tags?: string[];
}

export const useTodos = (http: CoreStart['http']) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const lastFetchTime = useRef<number>(0);

    const fetchTodos = useCallback(async (force = false) => {
        const now = Date.now();
        // Prevent multiple fetches within 2 seconds unless forced
        if (!force && now - lastFetchTime.current < 2000) {
            return;
        }
        
        setLoading(true);
        try {
            const response = await http.get('/api/todo_plugin/todos');
            setTodos(prev => {
                // Only update if data actually changed
                if (JSON.stringify(prev) !== JSON.stringify(response.todos)) {
                    return response.todos;
                }
                return prev;
            });
            lastFetchTime.current = now;
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    }, [http]);

    // Remove the automatic refresh interval and only fetch when needed
    useEffect(() => {
        fetchTodos(true);
    }, [fetchTodos]);

    const updateTodoStatus = useCallback(async (id: string, status: Todo['status']) => {
        try {
            await http.put(`/api/todo_plugin/todos/${id}`, { body: JSON.stringify({ status }) });
            await fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }, [http, fetchTodos]);

    const createTodo = useCallback(async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
        try {
            await http.post('/api/todo_plugin/todos', {
                body: JSON.stringify(todo)
            });
            await fetchTodos(); // This will now trigger updates everywhere
        } catch (error) {
            throw new Error('Failed to create todo');
        }
    }, [http, fetchTodos]);

    const debouncedSearch = useCallback(
        debounce(async (query: string, tags: string[]) => {
            setLoading(true);
            try {
                const response = await http.get('/api/todo_plugin/todos/search', {
                    query: { q: query, tags }
                });
                setTodos(response.todos);
            } catch (error) {
                console.error('Error searching todos:', error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [http]
    );

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm, selectedTags);
        } else {
            fetchTodos();
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, selectedTags, debouncedSearch, fetchTodos]);

    return {
        todos,
        loading,
        fetchTodos: () => fetchTodos(true), // Force refresh when manually called
        updateTodoStatus,
        createTodo,
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
    };
};