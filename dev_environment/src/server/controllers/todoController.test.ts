import { TodoController } from './todoController';
import { OpenSearchService } from '../services/opensearchService';

jest.mock('../services/opensearchService', () => {
    return {
        OpenSearchService: {
            getInstance: jest.fn().mockReturnValue({
                getClient: jest.fn(),
            }),
        },
    };
});

describe('TodoController', () => {
    let todoController: TodoController;
    let mockContext: any;
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            search: jest.fn(),
            index: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        // Mock del contexto de la solicitud
        mockContext = {
            core: {
                opensearch: {
                    client: {
                        asCurrentUser: mockClient,
                    },
                },
            },
        };

        // Configurar OpenSearchService para devolver el cliente mock
        (OpenSearchService.getInstance as jest.Mock).mockReturnValue({
            getClient: jest.fn().mockReturnValue(mockClient),
        });

        todoController = new TodoController();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTodos', () => {
        it('should return todos from OpenSearch', async () => {
            // Arrange
            const mockHits = [
                {
                    _id: '1',
                    _source: {
                        title: 'Test Todo',
                        status: 'planned',
                        createdAt: '2023-01-01T00:00:00.000Z',
                    },
                },
                {
                    _id: '2',
                    _source: {
                        title: 'Another Todo',
                        status: 'completed',
                        createdAt: '2023-01-02T00:00:00.000Z',
                        completedAt: '2023-01-03T00:00:00.000Z',
                    },
                },
            ];

            mockClient.search.mockResolvedValue({
                body: {
                    hits: {
                        hits: mockHits,
                    },
                },
            });

            // Act
            const result = await todoController.getTodos(mockContext);

            // Assert
            expect(mockClient.search).toHaveBeenCalledWith({
                index: 'todos',
                body: {
                    sort: [{ createdAt: { order: 'desc' } }],
                },
            });

            expect(result).toEqual([
                {
                    id: '1',
                    title: 'Test Todo',
                    status: 'planned',
                    createdAt: '2023-01-01T00:00:00.000Z',
                },
                {
                    id: '2',
                    title: 'Another Todo',
                    status: 'completed',
                    createdAt: '2023-01-02T00:00:00.000Z',
                    completedAt: '2023-01-03T00:00:00.000Z',
                },
            ]);
        });

        it('should handle errors when fetching todos', async () => {
            // Arrange
            const mockError = new Error('OpenSearch error');
            mockClient.search.mockRejectedValue(mockError);

            // Act & Assert
            await expect(todoController.getTodos(mockContext)).rejects.toThrow('OpenSearch error');
        });
    });

    describe('createTodo', () => {
        it('should create a new todo in OpenSearch', async () => {
            // Arrange
            const mockTodoData = {
                title: 'New Todo',
                description: 'Todo description',
                assignee: 'User',
                tags: ['urgent'],
            };

            const mockDate = '2023-01-10T00:00:00.000Z';
            jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

            mockClient.index.mockResolvedValue({
                body: {
                    _id: '123',
                },
            });

            // Act
            const result = await todoController.createTodo(mockContext, mockTodoData);

            // Assert
            expect(mockClient.index).toHaveBeenCalledWith({
                index: 'todos',
                body: {
                    ...mockTodoData,
                    status: 'planned',
                    createdAt: mockDate,
                },
            });

            expect(result).toEqual({
                id: '123',
                ...mockTodoData,
                status: 'planned',
                createdAt: mockDate,
            });
        });

        it('should handle errors when creating a todo', async () => {
            // Arrange
            const mockTodoData = {
                title: 'New Todo',
            };

            const mockError = new Error('OpenSearch error');
            mockClient.index.mockRejectedValue(mockError);

            // Act & Assert
            await expect(todoController.createTodo(mockContext, mockTodoData)).rejects.toThrow('OpenSearch error');
        });
    });

    describe('updateTodoStatus', () => {
        it('should update todo status to completed and add completedAt', async () => {
            // Arrange
            const todoId = '123';
            const newStatus = 'completed';
            const mockDate = '2023-01-10T00:00:00.000Z';

            jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);
            mockClient.update.mockResolvedValue({ body: { result: 'updated' } });

            // Act
            const result = await todoController.updateTodoStatus(mockContext, todoId, newStatus);

            // Assert
            expect(mockClient.update).toHaveBeenCalledWith({
                index: 'todos',
                id: todoId,
                body: {
                    doc: {
                        status: newStatus,
                        completedAt: mockDate,
                    },
                },
            });

            expect(result).toBe(true);
        });

        it('should update todo status to planned and remove completedAt', async () => {
            // Arrange
            const todoId = '123';
            const newStatus = 'planned';

            mockClient.update.mockResolvedValue({ body: { result: 'updated' } });

            // Act
            const result = await todoController.updateTodoStatus(mockContext, todoId, newStatus);

            // Assert
            expect(mockClient.update).toHaveBeenCalledWith({
                index: 'todos',
                id: todoId,
                body: {
                    doc: {
                        status: newStatus,
                        completedAt: null,
                    },
                },
            });

            expect(result).toBe(true);
        });

        it('should handle errors when updating todo status', async () => {
            // Arrange
            const todoId = '123';
            const newStatus = 'completed';

            const mockError = new Error('OpenSearch error');
            mockClient.update.mockRejectedValue(mockError);

            // Act & Assert
            await expect(todoController.updateTodoStatus(mockContext, todoId, newStatus)).rejects.toThrow('OpenSearch error');
        });
    });

    describe('deleteTodo', () => {
        it('should delete a todo from OpenSearch', async () => {
            // Arrange
            const todoId = '123';
            mockClient.delete.mockResolvedValue({ body: { result: 'deleted' } });

            // Act
            const result = await todoController.deleteTodo(mockContext, todoId);

            // Assert
            expect(mockClient.delete).toHaveBeenCalledWith({
                index: 'todos',
                id: todoId,
            });

            expect(result).toBe(true);
        });

        it('should handle errors when deleting a todo', async () => {
            // Arrange
            const todoId = '123';
            const mockError = new Error('OpenSearch error');
            mockClient.delete.mockRejectedValue(mockError);

            // Act & Assert
            await expect(todoController.deleteTodo(mockContext, todoId)).rejects.toThrow('OpenSearch error');
        });
    });
});