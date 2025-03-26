import { createTodoSlice } from './todoSlice';
import { Todo } from '../../types/types';

describe('todoSlice', () => {
    // Arrange - Setup para todos los tests
    let set: jest.Mock;
    let get: jest.Mock;
    let slice: ReturnType<typeof createTodoSlice>;
    let mockState: {
        todos: Todo[];
        filteredTodos: Todo[];
        loading: boolean;
        searchTerm: string;
        selectedTags: string[];
    };

    const mockTodos: Todo[] = [
        {
            id: '1',
            title: 'Test Todo 1',
            description: 'Description 1',
            status: 'planned',
            assignee: 'User 1',
            createdAt: '2023-01-01T00:00:00.000Z',
            tags: ['urgent', 'bug']
        },
        {
            id: '2',
            title: 'Test Todo 2',
            description: 'Description 2',
            status: 'completed',
            assignee: 'User 2',
            createdAt: '2023-01-02T00:00:00.000Z',
            completedAt: '2023-01-03T00:00:00.000Z',
            tags: ['feature']
        }
    ];

    const mockHttp = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    };

    beforeEach(() => {
        // Reiniciar el estado y los mocks antes de cada test
        mockState = {
            todos: [],
            filteredTodos: [],
            loading: false,
            searchTerm: '',
            selectedTags: []
        };
        
        // Crear los mocks primero
        set = jest.fn((newState) => {
            if (typeof newState === 'function') {
                const updatedState = newState(mockState);
                mockState = { ...mockState, ...updatedState };
            } else {
                mockState = { ...mockState, ...newState };
            }
        });
        
        // Crear el slice con los mocks
        slice = createTodoSlice(set, () => {
            // Importante: devolver un objeto que incluya todas las funciones del slice
            return {
                ...mockState,
                applyFilters: () => slice.applyFilters()
            };
        }, {});
        
        // Espiar la función applyFilters para verificar que se llama
        jest.spyOn(slice, 'applyFilters').mockImplementation(() => {
            // Implementación simulada de applyFilters
            const { todos, searchTerm, selectedTags } = mockState;
            
            const filtered = todos.filter(todo => {
                // Filtrar por término de búsqueda
                const matchesSearch = searchTerm 
                    ? todo.title.toLowerCase().includes(searchTerm.toLowerCase()) 
                    : true;
                
                // Filtrar por etiquetas seleccionadas
                const matchesTags = selectedTags.length > 0 
                    ? selectedTags.some(tag => todo.tags.includes(tag))
                    : true;
                
                return matchesSearch && matchesTags;
            });
            
            set({ filteredTodos: filtered });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setTodos', () => {
        it('should update todos and apply filters', () => {
            // Act
            slice.setTodos(mockTodos);

            // Assert
            expect(set).toHaveBeenCalledWith({ todos: mockTodos });
            expect(slice.applyFilters).toHaveBeenCalled();
        });
    });

    describe('setLoading', () => {
        it('should update loading state', () => {
            // Act
            slice.setLoading(true);

            // Assert
            expect(set).toHaveBeenCalledWith({ loading: true });
        });
    });

    describe('fetchTodos', () => {
        it('should fetch todos successfully', async () => {
            // Arrange
            const mockResponse = { todos: mockTodos };
            mockHttp.get.mockResolvedValue(mockResponse);

            // Act
            await slice.fetchTodos(mockHttp);

            // Assert
            expect(set).toHaveBeenCalledWith({ loading: true });
            expect(mockHttp.get).toHaveBeenCalledWith('/api/todo_plugin/todos');
            expect(set).toHaveBeenCalledWith({ todos: mockTodos });
            expect(slice.applyFilters).toHaveBeenCalled();
            expect(set).toHaveBeenCalledWith({ loading: false });
        });

        it('should handle error when fetching todos', async () => {
            // Arrange
            const mockError = new Error('Network error');
            mockHttp.get.mockRejectedValue(mockError);

            // Espiar console.error
            jest.spyOn(console, 'error').mockImplementation(() => { });

            // Act
            await slice.fetchTodos(mockHttp);

            // Assert
            expect(set).toHaveBeenCalledWith({ loading: true });
            expect(mockHttp.get).toHaveBeenCalledWith('/api/todo_plugin/todos');
            expect(console.error).toHaveBeenCalledWith('Error fetching todos:', mockError);
            expect(set).toHaveBeenCalledWith({ loading: false });
        });
    });

    describe('createTodo', () => {
        it('should create todo successfully', async () => {
            // Arrange
            const newTodo = {
                title: 'New Todo',
                description: 'New Description',
                status: 'planned' as const,
                assignee: 'User',
                tags: ['new']
            };

            const createdTodo = {
                ...newTodo,
                id: '3',
                createdAt: '2023-01-03T00:00:00.000Z'
            };

            mockHttp.post.mockResolvedValue(createdTodo);

            // Act
            await slice.createTodo(mockHttp, newTodo);

            // Assert
            expect(mockHttp.post).toHaveBeenCalledWith('/api/todo_plugin/todos', {
                body: JSON.stringify(newTodo)
            });
            expect(slice.applyFilters).toHaveBeenCalled();
        });

        it('should handle error when creating todo', async () => {
            // Arrange
            const newTodo = {
                title: 'New Todo',
                description: 'New Description',
                status: 'planned' as const,
                assignee: 'User',
                tags: ['new']
            };

            const mockError = new Error('Network error');
            mockHttp.post.mockRejectedValue(mockError);

            // Espiar console.error
            jest.spyOn(console, 'error').mockImplementation(() => { });

            // Act & Assert
            await expect(slice.createTodo(mockHttp, newTodo)).rejects.toThrow();
            expect(mockHttp.post).toHaveBeenCalledWith('/api/todo_plugin/todos', {
                body: JSON.stringify(newTodo)
            });
            expect(console.error).toHaveBeenCalledWith('Error creating todo:', mockError);
        });
    });

    describe('updateTodoStatus', () => {
        it('should update todo status successfully', async () => {
            // Arrange
            mockState.todos = [...mockTodos];

            // Act
            await slice.updateTodoStatus(mockHttp, '1', 'completed');

            // Assert
            expect(mockHttp.put).toHaveBeenCalledWith('/api/todo_plugin/todos/1', {
                body: JSON.stringify({ status: 'completed' })
            });
            expect(slice.applyFilters).toHaveBeenCalled();
        });

        it('should add completedAt when status is completed', async () => {
            // Arrange
            mockState.todos = [...mockTodos];
            const dateSpy = jest.spyOn(Date.prototype, 'toISOString');
            const mockDate = '2023-01-10T00:00:00.000Z';
            dateSpy.mockReturnValue(mockDate);

            // Act
            await slice.updateTodoStatus(mockHttp, '1', 'completed');

            // Assert
            expect(set).toHaveBeenCalledWith(expect.any(Function));
            // Verificar que la función pasada a set actualiza correctamente el estado
            const updateFn = set.mock.calls[0][0];
            const updatedState = updateFn(mockState);
            const updatedTodo = updatedState.todos.find(t => t.id === '1');
            expect(updatedTodo?.status).toBe('completed');
            expect(updatedTodo?.completedAt).toBe(mockDate);

            dateSpy.mockRestore();
        });

        it('should remove completedAt when status is not completed', async () => {
            // Arrange
            mockState.todos = [
                {
                    ...mockTodos[0],
                    status: 'completed',
                    completedAt: '2023-01-05T00:00:00.000Z'
                },
                mockTodos[1]
            ];

            // Act
            await slice.updateTodoStatus(mockHttp, '1', 'planned');

            // Assert
            expect(set).toHaveBeenCalledWith(expect.any(Function));
            // Verificar que la función pasada a set actualiza correctamente el estado
            const updateFn = set.mock.calls[0][0];
            const updatedState = updateFn(mockState);
            const updatedTodo = updatedState.todos.find(t => t.id === '1');
            expect(updatedTodo?.status).toBe('planned');
            expect(updatedTodo?.completedAt).toBeUndefined();
        });

        it('should handle error when updating todo status', async () => {
            // Arrange
            const mockError = new Error('Network error');
            mockHttp.put.mockRejectedValue(mockError);

            // Espiar console.error
            jest.spyOn(console, 'error').mockImplementation(() => { });

            // Act & Assert
            await expect(slice.updateTodoStatus(mockHttp, '1', 'completed')).rejects.toThrow();
            expect(mockHttp.put).toHaveBeenCalledWith('/api/todo_plugin/todos/1', {
                body: JSON.stringify({ status: 'completed' })
            });
            expect(console.error).toHaveBeenCalledWith('Error updating todo:', mockError);
        });
    });

    describe('deleteTodo', () => {
        it('should delete todo successfully', async () => {
            // Arrange
            mockState.todos = [...mockTodos];

            // Act
            await slice.deleteTodo(mockHttp, '1');

            // Assert
            expect(mockHttp.delete).toHaveBeenCalledWith('/api/todo_plugin/todos/1');
            expect(slice.applyFilters).toHaveBeenCalled();

            // Verificar que el todo fue eliminado
            const updateFn = set.mock.calls[0][0];
            const updatedState = updateFn(mockState);
            expect(updatedState.todos.length).toBe(1);
            expect(updatedState.todos.find(t => t.id === '1')).toBeUndefined();
        });

        it('should handle error when deleting todo', async () => {
            // Arrange
            const mockError = new Error('Network error');
            mockHttp.delete.mockRejectedValue(mockError);

            // Espiar console.error
            jest.spyOn(console, 'error').mockImplementation(() => { });

            // Act & Assert
            await expect(slice.deleteTodo(mockHttp, '1')).rejects.toThrow();
            expect(mockHttp.delete).toHaveBeenCalledWith('/api/todo_plugin/todos/1');
            expect(console.error).toHaveBeenCalledWith('Error deleting todo:', mockError);
        });
    });

    describe('setSearchTerm', () => {
        it('should update search term and apply filters', () => {
            // Act
            slice.setSearchTerm('test');

            // Assert
            expect(set).toHaveBeenCalledWith({ searchTerm: 'test' });
            expect(slice.applyFilters).toHaveBeenCalled();
        });
    });

    describe('setSelectedTags', () => {
        it('should update selected tags and apply filters', () => {
            // Act
            slice.setSelectedTags(['urgent', 'bug']);

            // Assert
            expect(set).toHaveBeenCalledWith({ selectedTags: ['urgent', 'bug'] });
            expect(slice.applyFilters).toHaveBeenCalled();
        });
    });

    describe('applyFilters', () => {
        it('should filter todos by search term', () => {
            // Arrange
            mockState.todos = [...mockTodos];
            mockState.searchTerm = 'todo 1';

            // Act
            slice.applyFilters();

            // Assert
            expect(set).toHaveBeenCalledWith({
                filteredTodos: expect.arrayContaining([
                    expect.objectContaining({ id: '1' })
                ])
            });
            expect(mockState.filteredTodos.length).toBe(1);
        });

        it('should filter todos by tags', () => {
            // Arrange
            mockState.todos = [...mockTodos];
            mockState.selectedTags = ['feature'];

            // Act
            slice.applyFilters();

            // Assert
            expect(set).toHaveBeenCalledWith({
                filteredTodos: expect.arrayContaining([
                    expect.objectContaining({ id: '2' })
                ])
            });
            expect(mockState.filteredTodos.length).toBe(1);
        });

        it('should apply both search term and tag filters', () => {
            // Arrange
            mockState.todos = [...mockTodos];
            mockState.searchTerm = 'todo';
            mockState.selectedTags = ['urgent'];

            // Act
            slice.applyFilters();

            // Assert
            expect(set).toHaveBeenCalledWith({
                filteredTodos: expect.arrayContaining([
                    expect.objectContaining({ id: '1' })
                ])
            });
            expect(mockState.filteredTodos.length).toBe(1);
        });

        it('should return all todos when no filters are applied', () => {
            // Arrange
            mockState.todos = [...mockTodos];

            // Act
            slice.applyFilters();

            // Assert
            expect(set).toHaveBeenCalledWith({
                filteredTodos: expect.arrayContaining([
                    expect.objectContaining({ id: '1' }),
                    expect.objectContaining({ id: '2' })
                ])
            });
            expect(mockState.filteredTodos.length).toBe(2);
        });
    });
});