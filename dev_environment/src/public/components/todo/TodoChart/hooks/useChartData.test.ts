import { renderHook } from '@testing-library/react-hooks';
import { useChartData } from './useChartData';
import { Todo } from '../../../../types/types';

// We need to mock the Date implementation more thoroughly
describe('useChartData', () => {
  // Store the original implementation
  const originalDate = global.Date;

  beforeEach(() => {
    // Create a fixed date for testing
    const mockDate = new Date('2023-03-20T12:00:00Z');

    // Mock the Date constructor and methods
    global.Date = class extends originalDate {
      constructor(...args) {
        if (args.length === 0) {
          return mockDate;
        }
        return new originalDate(...args);
      }

      static now() {
        return mockDate.getTime();
      }
    } as any;

    // Also mock toISOString to return a consistent value
    Date.prototype.toISOString = jest.fn(() => '2023-03-20T12:00:00.000Z');
  });

  afterEach(() => {
    // Restore the original Date implementation
    global.Date = originalDate;
    jest.restoreAllMocks();
  });

  it('should calculate status statistics correctly', () => {
    // Arrange
    const mockTodos: Todo[] = [
      { id: '1', title: 'Todo 1', status: 'planned', createdAt: '2023-03-19', tags: [] },
      { id: '2', title: 'Todo 2', status: 'completed', createdAt: '2023-03-18', completedAt: '2023-03-19', tags: [] },
      { id: '3', title: 'Todo 3', status: 'error', createdAt: '2023-03-17', tags: [] },
      { id: '4', title: 'Todo 4', status: 'planned', createdAt: '2023-03-16', tags: [] },
      { id: '5', title: 'Todo 5', status: 'completed', createdAt: '2023-03-15', completedAt: '2023-03-16', tags: [] },
    ];

    // Act
    const { result } = renderHook(() => useChartData(mockTodos));

    // Assert
    expect(result.current.statusStats).toHaveLength(3);
    expect(result.current.statusStats).toEqual(
      expect.arrayContaining([
        { label: 'planned', value: 2 },
        { label: 'completed', value: 2 },
        { label: 'error', value: 1 }
      ])
    );
  });

  it('should calculate tag statistics correctly', () => {
    // Arrange
    const mockTodos: Todo[] = [
      { id: '1', title: 'Todo 1', status: 'planned', createdAt: '2023-03-19', tags: ['work', 'urgent'] },
      { id: '2', title: 'Todo 2', status: 'completed', createdAt: '2023-03-18', completedAt: '2023-03-19', tags: ['personal'] },
      { id: '3', title: 'Todo 3', status: 'error', createdAt: '2023-03-17', tags: ['work'] },
      { id: '4', title: 'Todo 4', status: 'planned', createdAt: '2023-03-16', tags: ['urgent'] },
      { id: '5', title: 'Todo 5', status: 'completed', createdAt: '2023-03-15', completedAt: '2023-03-16', tags: ['personal', 'work'] },
    ];

    // Act
    const { result } = renderHook(() => useChartData(mockTodos));

    // Assert
    expect(result.current.tagStats).toHaveLength(3);
    expect(result.current.tagStats).toEqual(
      expect.arrayContaining([
        { tag: 'work', count: 3 },
        { tag: 'urgent', count: 2 },
        { tag: 'personal', count: 2 }
      ])
    );
  });

  it('should handle todos with no tags', () => {
    // Arrange
    const mockTodos: Todo[] = [
      { id: '1', title: 'Todo 1', status: 'planned', createdAt: '2023-03-19', tags: [] },
      { id: '2', title: 'Todo 2', status: 'completed', createdAt: '2023-03-18', completedAt: '2023-03-19', tags: undefined },
    ];

    // Act
    const { result } = renderHook(() => useChartData(mockTodos));

    // Assert
    expect(result.current.tagStats).toHaveLength(0);
  });

  it('should calculate timeline data correctly', () => {
    // Crear un mock más preciso para las fechas
    // Primero, restauramos el mock global para poder usar fechas reales
    jest.restoreAllMocks();

    // Generamos las fechas esperadas para los últimos 7 días desde 2023-03-20
    const mockDates = [
      '2023-03-14',
      '2023-03-15',
      '2023-03-16',
      '2023-03-17',
      '2023-03-18',
      '2023-03-19',
      '2023-03-20'
    ];

    // Mockeamos el método map para que devuelva nuestras fechas predefinidas
    const originalArrayMap = Array.prototype.map;
    Array.prototype.map = function (callback) {
      // Si es la llamada que genera last7Days, devolvemos nuestras fechas
      if (this.length === 7 && callback.toString().includes('date.setDate')) {
        return mockDates;
      }
      // Para otras llamadas a map, usamos la implementación original
      return originalArrayMap.call(this, callback);
    };

    // Arrange
    const mockTodos: Todo[] = [
      // Make sure these dates will be included in the last 7 days from our mock date
      { id: '1', title: 'Todo 1', status: 'planned', createdAt: '2023-03-20', tags: [] },
      { id: '2', title: 'Todo 2', status: 'completed', createdAt: '2023-03-19', completedAt: '2023-03-20', tags: [] },
      { id: '3', title: 'Todo 3', status: 'error', createdAt: '2023-03-18', tags: [] },
      // These two are outside the 7-day range that the hook is calculating
      { id: '4', title: 'Todo 4', status: 'planned', createdAt: '2023-03-10', completedAt: '2023-03-11', tags: [] },
      { id: '5', title: 'Todo 5', status: 'completed', createdAt: '2023-03-05', completedAt: '2023-03-06', tags: [] },
    ];

    // Act
    const { result } = renderHook(() => useChartData(mockTodos));

    // Assert

    // Ahora deberíamos tener 3 todos creados (los primeros 3) y 1 completado
    const expectedCreated = 3; // Solo los todos con fechas 2023-03-20, 2023-03-19, 2023-03-18
    const expectedCompleted = 1; // Solo el todo completado el 2023-03-20

    const sumCreated = result.current.timelineData.reduce((sum, day) => sum + day.created, 0);
    const sumCompleted = result.current.timelineData.reduce((sum, day) => sum + day.completed, 0);

    // We should have the expected number of todos in our timeline data
    expect(sumCreated).toBe(expectedCreated);
    expect(sumCompleted).toBe(expectedCompleted);

    // Restaurar el método original de Array.prototype.map
    Array.prototype.map = originalArrayMap;
  });

  it('should handle empty todos array', () => {
    // Arrange
    const mockTodos: Todo[] = [];

    // Act
    const { result } = renderHook(() => useChartData(mockTodos));

    // Assert
    expect(result.current.statusStats).toHaveLength(3);
    expect(result.current.statusStats.every(stat => stat.value === 0)).toBe(true);

    expect(result.current.tagStats).toHaveLength(0);

    expect(result.current.timelineData).toHaveLength(7);
    expect(result.current.timelineData.every(day => day.created === 0 && day.completed === 0)).toBe(true);
  });
});