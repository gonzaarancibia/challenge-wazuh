import { defineRoutes } from './index';
import { TodoController } from '../controllers/todoController';

jest.mock('../controllers/todoController');

describe('API Routes', () => {
    let mockRouter: any;
    let mockTodoController: jest.Mocked<TodoController>;
    let routeHandlers: Record<string, Function> = {};

    beforeEach(() => {
        mockRouter = {
            get: jest.fn((config, handler) => {
                routeHandlers[`GET ${config.path}`] = handler;
            }),
            post: jest.fn((config, handler) => {
                routeHandlers[`POST ${config.path}`] = handler;
            }),
            put: jest.fn((config, handler) => {
                routeHandlers[`PUT ${config.path}`] = handler;
            }),
            delete: jest.fn((config, handler) => {
                routeHandlers[`DELETE ${config.path}`] = handler;
            }),
        };

        // Configurar mock de TodoController
        mockTodoController = new TodoController() as jest.Mocked<TodoController>;
        (TodoController as jest.Mock).mockImplementation(() => mockTodoController);

        defineRoutes(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/todo_plugin/todos', () => {
        it('should return todos successfully', async () => {
            // Arrange
            const mockTodos = [
                { id: '1', title: 'Test Todo' },
                { id: '2', title: 'Another Todo' },
            ];

            mockTodoController.getTodos = jest.fn().mockResolvedValue(mockTodos);

            const mockContext = {};
            const mockRequest = {};
            const mockResponse = {
                ok: jest.fn().mockReturnValue('success'),
                custom: jest.fn(),
            };

            // Act
            const handler = routeHandlers['GET /api/todo_plugin/todos'];
            const result = await handler(mockContext, mockRequest, mockResponse);

            // Assert
            expect(mockTodoController.getTodos).toHaveBeenCalledWith(mockContext);
            expect(mockResponse.ok).toHaveBeenCalledWith({
                body: { todos: mockTodos },
            });
            expect(result).toBe('success');
        });

        it('should handle errors', async () => {
            // Arrange
            const mockError = new Error('Failed to fetch todos');
            mockTodoController.getTodos = jest.fn().mockRejectedValue(mockError);

            const mockContext = {};
            const mockRequest = {};
            const mockResponse = {
                ok: jest.fn(),
                custom: jest.fn().mockReturnValue('error'),
            };

            // Act
            const handler = routeHandlers['GET /api/todo_plugin/todos'];
            const result = await handler(mockContext, mockRequest, mockResponse);

            // Assert
            expect(mockTodoController.getTodos).toHaveBeenCalledWith(mockContext);
            expect(mockResponse.custom).toHaveBeenCalledWith({
                statusCode: 500,
                body: { message: 'Failed to fetch todos' },
            });
            expect(result).toBe('error');
        });
    });

    describe('POST /api/todo_plugin/todos', () => {
        it('should create todo successfully', async () => {
            // Arrange
            const mockTodoData = {
                title: 'New Todo',
                status: 'planned',
                assignee: 'User',
            };

            const mockCreatedTodo = {
                id: '123',
                ...mockTodoData,
                createdAt: '2023-01-01T00:00:00.000Z',
            };

            mockTodoController.createTodo = jest.fn().mockResolvedValue(mockCreatedTodo);

            const mockContext = {};
            const mockRequest = {
                body: mockTodoData,
            };
            const mockResponse = {
                ok: jest.fn().mockReturnValue('success'),
                custom: jest.fn(),
            };

            // Act
            const handler = routeHandlers['POST /api/todo_plugin/todos'];
            const result = await handler(mockContext, mockRequest, mockResponse);

            // Assert
            expect(mockTodoController.createTodo).toHaveBeenCalledWith(mockContext, mockTodoData);
            expect(mockResponse.ok).toHaveBeenCalledWith({
                body: mockCreatedTodo,
            });
            expect(result).toBe('success');
        });
    });

    describe('PUT /api/todo_plugin/todos/{id}', () => {
        it('should update todo status successfully', async () => {
            // Arrange
            mockTodoController.updateTodoStatus = jest.fn().mockResolvedValue(true);

            const mockContext = {};
            const mockRequest = {
                params: { id: '123' },
                body: { status: 'completed' },
            };
            const mockResponse = {
                ok: jest.fn().mockReturnValue('success'),
                custom: jest.fn(),
            };

            // Act
            const handler = routeHandlers['PUT /api/todo_plugin/todos/{id}'];
            const result = await handler(mockContext, mockRequest, mockResponse);

            // Assert
            expect(mockTodoController.updateTodoStatus).toHaveBeenCalledWith(
                mockContext,
                '123',
                'completed'
            );
            expect(mockResponse.ok).toHaveBeenCalledWith({
                body: { success: true },
            });
            expect(result).toBe('success');
        });
    });

    describe('DELETE /api/todo_plugin/todos/{id}', () => {
        it('should delete todo successfully', async () => {
            // Arrange
            mockTodoController.deleteTodo = jest.fn().mockResolvedValue(true);

            const mockContext = {};
            const mockRequest = {
                params: { id: '123' },
            };
            const mockResponse = {
                ok: jest.fn().mockReturnValue('success'),
                customError: jest.fn(),
            };

            // Act
            const handler = routeHandlers['DELETE /api/todo_plugin/todos/{id}'];
            const result = await handler(mockContext, mockRequest, mockResponse);

            // Assert
            expect(mockTodoController.deleteTodo).toHaveBeenCalledWith(mockContext, '123');
            expect(mockResponse.ok).toHaveBeenCalledWith({
                body: { success: true },
            });
            expect(result).toBe('success');
        });
    });
});