import { OpenSearchService } from './opensearchService';

describe('OpenSearchService', () => {
    let service: OpenSearchService;
    let mockCoreSetup: any;
    let mockContext: any;
    let mockClient: any;

    beforeEach(() => {
        // Resetear la instancia singleton para cada test
        // @ts-ignore - Accediendo a una propiedad privada para testing
        OpenSearchService.instance = undefined;

        mockClient = { search: jest.fn() };
        mockCoreSetup = { http: {} };
        mockContext = {
            core: {
                opensearch: {
                    client: {
                        asCurrentUser: mockClient,
                    },
                },
            },
        };

        service = OpenSearchService.getInstance();
    });

    it('should be a singleton', () => {
        // Act
        const instance1 = OpenSearchService.getInstance();
        const instance2 = OpenSearchService.getInstance();

        // Assert
        expect(instance1).toBe(instance2);
    });

    it('should initialize with core setup', () => {
        // Act
        service.initialize(mockCoreSetup);

        // Assert - No hay una forma directa de verificar esto, pero podemos comprobar
        // que no lanza error al inicializar
        expect(() => service.initialize(mockCoreSetup)).not.toThrow();
    });

    it('should get client from context', () => {
        // Arrange
        service.initialize(mockCoreSetup);

        // Act
        const client = service.getClient(mockContext);

        // Assert
        expect(client).toBe(mockClient);
    });

    it('should throw error if not initialized', () => {
        // Act & Assert
        expect(() => service.getClient(mockContext)).toThrow('OpenSearchService not initialized');
    });
});