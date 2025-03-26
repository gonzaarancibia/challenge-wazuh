import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoListContainer from '../TodoListContainer';
import TodoList from '../TodoList';
import { useStore } from '../../../../store';
import { Todo } from '../../../../types/types';

// Mock dependencies
jest.mock('../../../../store', () => ({
  useStore: jest.fn()
}));

jest.mock('../TodoList', () => {
  return jest.fn(() => <div data-testid="todo-list" />);
});

describe('TodoListContainer', () => {
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

  const mockHttp = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };

  const mockNotifications = {
    toasts: {
      addSuccess: jest.fn(),
      addError: jest.fn()
    }
  };

  const mockStore = {
    filteredTodos: mockTodos,
    loading: false,
    fetchTodos: jest.fn(),
    updateTodoStatus: jest.fn(),
    deleteTodo: jest.fn(),
    searchTerm: '',
    setSearchTerm: jest.fn(),
    selectedTags: [],
    setSelectedTags: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('should render TodoList with correct props', () => {
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Assert
    expect(TodoList).toHaveBeenCalledWith(
      expect.objectContaining({
        todos: mockTodos,
        loading: false,
        searchTerm: '',
        setSearchTerm: mockStore.setSearchTerm,
        selectedTags: [],
        setSelectedTags: mockStore.setSelectedTags,
        handleStatusChange: expect.any(Function),
        handleDelete: expect.any(Function)
      }),
      expect.anything()
    );
  });

  it('should call fetchTodos on mount', () => {
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Assert
    expect(mockStore.fetchTodos).toHaveBeenCalledWith(mockHttp);
  });

  it('should handle status change correctly', async () => {
    // Arrange
    mockStore.updateTodoStatus.mockResolvedValue({});
    
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Get the handleStatusChange function from the props passed to TodoList
    const { handleStatusChange } = (TodoList as jest.Mock).mock.calls[0][0];
    
    // Act
    await act(async () => {
      await handleStatusChange('1', 'completed');
    });
    
    // Assert
    expect(mockStore.updateTodoStatus).toHaveBeenCalledWith(mockHttp, '1', 'completed');
    expect(mockNotifications.toasts.addSuccess).toHaveBeenCalledWith('Todo status updated to completed');
  });

  it('should handle status change error', async () => {
    // Arrange
    mockStore.updateTodoStatus.mockRejectedValue(new Error('Failed'));
    
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Get the handleStatusChange function from the props passed to TodoList
    const { handleStatusChange } = (TodoList as jest.Mock).mock.calls[0][0];
    
    // Act
    await act(async () => {
      await handleStatusChange('1', 'completed');
    });
    
    // Assert
    expect(mockStore.updateTodoStatus).toHaveBeenCalledWith(mockHttp, '1', 'completed');
    expect(mockNotifications.toasts.addError).toHaveBeenCalledWith('Failed to update todo status');
  });

  it('should handle delete correctly', async () => {
    // Arrange
    mockStore.deleteTodo.mockResolvedValue({});
    
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Get the handleDelete function from the props passed to TodoList
    const { handleDelete } = (TodoList as jest.Mock).mock.calls[0][0];
    
    // Act
    await act(async () => {
      await handleDelete('1');
    });
    
    // Assert
    expect(mockStore.deleteTodo).toHaveBeenCalledWith(mockHttp, '1');
    expect(mockNotifications.toasts.addSuccess).toHaveBeenCalledWith('Todo deleted successfully');
  });

  it('should handle delete error', async () => {
    // Arrange
    const error = { body: { message: 'Custom error message' } };
    mockStore.deleteTodo.mockRejectedValue(error);
    
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Get the handleDelete function from the props passed to TodoList
    const { handleDelete } = (TodoList as jest.Mock).mock.calls[0][0];
    
    // Act
    await act(async () => {
      await handleDelete('1');
    });
    
    // Assert
    expect(mockStore.deleteTodo).toHaveBeenCalledWith(mockHttp, '1');
    expect(mockNotifications.toasts.addError).toHaveBeenCalledWith('Custom error message');
  });

  it('should handle delete error with no message', async () => {
    // Arrange
    mockStore.deleteTodo.mockRejectedValue({});
    
    // Act
    render(<TodoListContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Get the handleDelete function from the props passed to TodoList
    const { handleDelete } = (TodoList as jest.Mock).mock.calls[0][0];
    
    // Act
    await act(async () => {
      await handleDelete('1');
    });
    
    // Assert
    expect(mockStore.deleteTodo).toHaveBeenCalledWith(mockHttp, '1');
    expect(mockNotifications.toasts.addError).toHaveBeenCalledWith('Failed to delete todo');
  });
});