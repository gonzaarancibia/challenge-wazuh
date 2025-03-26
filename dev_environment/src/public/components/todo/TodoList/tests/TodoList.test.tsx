import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../TodoList';
import { TodoTableContainer as TodoTable } from '../components/TodoTable';
import { TodoSearch } from '../components/TodoSearch';
import { Todo } from '../../../../types/types';

// Mock Elastic UI components
jest.mock('@elastic/eui', () => ({
  EuiPanel: ({ children }) => <div data-testid="eui-panel">{children}</div>,
  EuiTitle: ({ children }) => <div data-testid="eui-title">{children}</div>,
  EuiSpacer: () => <div data-testid="eui-spacer" />,
  EuiFlexGroup: ({ children }) => <div data-testid="eui-flex-group">{children}</div>,
  EuiFlexItem: ({ children }) => <div data-testid="eui-flex-item">{children}</div>,
}));

// Mock the child components
jest.mock('../components/TodoTable', () => ({
  TodoTableContainer: jest.fn(() => <div data-testid="todo-table" />)
}));

jest.mock('../components/TodoSearch', () => ({
  TodoSearch: jest.fn(() => <div data-testid="todo-search" />)
}));

describe('TodoList', () => {
  // Arrange
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

  const mockProps = {
    todos: mockTodos,
    loading: false,
    searchTerm: '',
    setSearchTerm: jest.fn(),
    selectedTags: [],
    setSelectedTags: jest.fn(),
    handleStatusChange: jest.fn(),
    handleDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with title', () => {
    // Act
    render(<TodoList {...mockProps} />);
    
    // Assert
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('should pass correct props to TodoSearch', () => {
    // Act
    render(<TodoList {...mockProps} />);
    
    // Assert
    expect(TodoSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        searchTerm: '',
        onSearch: mockProps.setSearchTerm,
        onTagFilter: mockProps.setSelectedTags,
        selectedTags: [],
        isLoading: false
      }),
      expect.anything()
    );
  });

  it('should pass correct props to TodoTable', () => {
    // Act
    render(<TodoList {...mockProps} />);
    
    // Assert
    expect(TodoTable).toHaveBeenCalledWith(
      expect.objectContaining({
        todos: mockTodos,
        loading: false,
        onStatusChange: mockProps.handleStatusChange,
        onDelete: mockProps.handleDelete
      }),
      expect.anything()
    );
  });

  it('should update props when loading state changes', () => {
    // Act
    const { rerender } = render(<TodoList {...mockProps} />);
    
    // Assert
    expect(TodoSearch).toHaveBeenCalledWith(
      expect.objectContaining({ isLoading: false }),
      expect.anything()
    );
    expect(TodoTable).toHaveBeenCalledWith(
      expect.objectContaining({ loading: false }),
      expect.anything()
    );
    
    // Act
    rerender(<TodoList {...mockProps} loading={true} />);
    
    // Assert
    expect(TodoSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ isLoading: true }),
      expect.anything()
    );
    expect(TodoTable).toHaveBeenLastCalledWith(
      expect.objectContaining({ loading: true }),
      expect.anything()
    );
  });

  it('should update props when search term changes', () => {
    // Act
    const { rerender } = render(<TodoList {...mockProps} />);
    
    // Assert
    expect(TodoSearch).toHaveBeenCalledWith(
      expect.objectContaining({ searchTerm: '' }),
      expect.anything()
    );
    
    // Act
    rerender(<TodoList {...mockProps} searchTerm="test search" />);
    
    // Assert
    expect(TodoSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ searchTerm: 'test search' }),
      expect.anything()
    );
  });

  it('should update props when selected tags change', () => {
    // Act
    const { rerender } = render(<TodoList {...mockProps} />);
    
    // Assert
    expect(TodoSearch).toHaveBeenCalledWith(
      expect.objectContaining({ selectedTags: [] }),
      expect.anything()
    );
    
    // Act
    rerender(<TodoList {...mockProps} selectedTags={['urgent', 'bug']} />);
    
    // Assert
    expect(TodoSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedTags: ['urgent', 'bug'] }),
      expect.anything()
    );
  });
});