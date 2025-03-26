import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoChartContainer } from '../TodoChartContainer';
import { useStore } from '../../../../store';
import { useChartData } from '../hooks/useChartData';
import TodoChart from '../TodoChart';

// Mock dependencies
jest.mock('../../../../store', () => ({
  useStore: jest.fn()
}));

jest.mock('../hooks/useChartData', () => ({
  useChartData: jest.fn()
}));

jest.mock('../TodoChart', () => {
  return jest.fn(() => <div data-testid="todo-chart" />);
});

describe('TodoChartContainer', () => {
  const mockTodos = [
    { id: '1', title: 'Todo 1', status: 'planned', createdAt: '2023-03-19', tags: [] },
    { id: '2', title: 'Todo 2', status: 'completed', createdAt: '2023-03-18', completedAt: '2023-03-19', tags: [] }
  ];
  
  const mockChartData = {
    statusStats: [
      { label: 'planned', value: 1 },
      { label: 'completed', value: 1 }
    ],
    timelineData: [
      { date: '2023-03-18', created: 1, completed: 0 },
      { date: '2023-03-19', created: 1, completed: 1 }
    ],
    tagStats: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Arrange
    (useStore as jest.Mock).mockReturnValue({
      todos: mockTodos,
      loading: false
    });
    
    (useChartData as jest.Mock).mockReturnValue(mockChartData);
  });

  it('should render TodoChart with correct props', () => {
    // Arrange - already set up in beforeEach
    
    // Act
    render(<TodoChartContainer />);
    
    // Assert
    expect(screen.getByTestId('todo-chart')).toBeInTheDocument();
    expect(useStore).toHaveBeenCalled();
    expect(useChartData).toHaveBeenCalledWith(mockTodos);
    expect(TodoChart).toHaveBeenCalledWith({
      loading: false,
      statusStats: mockChartData.statusStats,
      timelineData: mockChartData.timelineData,
      tagStats: mockChartData.tagStats
    }, {});
  });

  it('should pass loading state to TodoChart', () => {
    // Arrange
    (useStore as jest.Mock).mockReturnValue({
      todos: mockTodos,
      loading: true
    });
    
    // Act
    render(<TodoChartContainer />);
    
    // Assert
    expect(TodoChart).toHaveBeenCalledWith({
      loading: true,
      statusStats: mockChartData.statusStats,
      timelineData: mockChartData.timelineData,
      tagStats: mockChartData.tagStats
    }, {});
  });
});