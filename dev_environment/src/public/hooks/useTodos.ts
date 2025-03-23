import { useState, useCallback, useEffect } from 'react';
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

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/todo_plugin/todos');
            setTodos(response.todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    }, [http]);

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
            await fetchTodos();
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
        fetchTodos,
        updateTodoStatus,
        createTodo,
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
    };
};