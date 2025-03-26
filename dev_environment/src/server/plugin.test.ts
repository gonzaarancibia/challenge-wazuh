import { TodoPlugin } from './plugin';
import { OpenSearchService } from './services/opensearchService';
import { defineRoutes } from './routes';

jest.mock('./services/opensearchService');
jest.mock('./routes');

describe('TodoPlugin', () => {
    let plugin: TodoPlugin;
    let mockInitializerContext: any;
    let mockCoreSetup: any;
    let mockCoreStart: any;
    let mockLogger: any;
    let mockOpenSearchService: any;

    beforeEach(() => {
        mockLogger = {
            get: jest.fn().mockReturnValue({
                debug: jest.fn(),
                error: jest.fn(),
            }),
        };

        mockInitializerContext = {
            logger: mockLogger,
        };

        mockCoreSetup = {
            http: {
                createRouter: jest.fn().mockReturnValue('mockRouter'),
            },
        };

        mockCoreStart = {};

        mockOpenSearchService = {
            initialize: jest.fn(),
        };
        (OpenSearchService.getInstance as jest.Mock).mockReturnValue(mockOpenSearchService);

        plugin = new TodoPlugin(mockInitializerContext);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize logger', () => {
            // Assert
            expect(mockLogger.get).toHaveBeenCalled();
        });
    });

    describe('setup', () => {
        it('should initialize OpenSearchService and define routes', async () => {
            // Act
            await plugin.setup(mockCoreSetup);

            // Assert
            expect(OpenSearchService.getInstance).toHaveBeenCalled();
            expect(mockOpenSearchService.initialize).toHaveBeenCalledWith(mockCoreSetup);
            expect(mockCoreSetup.http.createRouter).toHaveBeenCalled();
            expect(defineRoutes).toHaveBeenCalledWith('mockRouter');
        });

        it('should log debug message on setup', async () => {
            // Act
            await plugin.setup(mockCoreSetup);

            // Assert
            expect(mockLogger.get().debug).toHaveBeenCalledWith('todo_plugin: Setup');
        });

        it('should handle and rethrow errors', async () => {
            // Arrange
            const mockError = new Error('Setup error');
            mockOpenSearchService.initialize.mockImplementation(() => {
                throw mockError;
            });

            // Act & Assert
            await expect(plugin.setup(mockCoreSetup)).rejects.toThrow('Setup error');
            expect(mockLogger.get().error).toHaveBeenCalledWith('Failed to setup plugin:', mockError);
        });
    });

    describe('start', () => {
        it('should log debug message on start', () => {
            // Act
            plugin.start(mockCoreStart);

            // Assert
            expect(mockLogger.get().debug).toHaveBeenCalledWith('todo_plugin: Started');
        });

        it('should return an empty object', () => {
            // Act
            const result = plugin.start(mockCoreStart);

            // Assert
            expect(result).toEqual({});
        });
    });

    describe('stop', () => {
        it('should not throw errors', () => {
            // Act & Assert
            expect(() => plugin.stop()).not.toThrow();
        });
    });
});