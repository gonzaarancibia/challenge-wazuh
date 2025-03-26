import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoFormContainer from '../TodoFormContainer';
import { useStore } from '../../../../store';
import TodoForm from '../TodoForm';

jest.mock('../../../../store', () => ({
  useStore: jest.fn()
}));

jest.mock('../TodoForm', () => {
  return jest.fn(() => <div data-testid="todo-form" />);
});

describe('TodoFormContainer', () => {
  // Arrange
  const mockHttp = {};
  const mockNotifications = {
    toasts: {
      addSuccess: jest.fn(),
      addError: jest.fn()
    }
  };
  const mockCreateTodo = jest.fn();

  beforeEach(() => {
    // Arrange
    jest.clearAllMocks();
    (useStore as jest.Mock).mockReturnValue({
      createTodo: mockCreateTodo
    });
  });

  it('should render TodoForm with correct props', () => {
    // Act
    render(<TodoFormContainer http={mockHttp} notifications={mockNotifications} />);
    
    // Assert
    expect(screen.getByTestId('todo-form')).toBeInTheDocument();
    expect(TodoForm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '',
        description: '',
        assignee: '',
        selectedTags: [],
        predefinedTags: expect.any(Array),
        setTitle: expect.any(Function),
        setDescription: expect.any(Function),
        setAssignee: expect.any(Function),
        setSelectedTags: expect.any(Function),
        handleSubmit: expect.any(Function)
      }),
      {}
    );
  });

  it('should call createTodo with correct data when form is submitted', async () => {
    // Arrange
    mockCreateTodo.mockResolvedValueOnce({});
    
    // Act
    render(<TodoFormContainer http={mockHttp} notifications={mockNotifications} />);
    const { handleSubmit } = (TodoForm as jest.Mock).mock.calls[0][0];
    const mockEvent = { preventDefault: jest.fn() };
    
    await act(async () => {
      await handleSubmit(mockEvent);
    });
    
    // Assert
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockCreateTodo).toHaveBeenCalledWith(
      mockHttp,
      expect.objectContaining({
        title: '',
        description: '',
        assignee: '',
        status: 'planned',
        tags: []
      })
    );
    expect(mockNotifications.toasts.addSuccess).toHaveBeenCalledWith('Todo created successfully');
  });

  it('should show error toast when createTodo fails', async () => {
    // Arrange
    mockCreateTodo.mockRejectedValueOnce(new Error('API error'));
    
    // Act
    render(<TodoFormContainer http={mockHttp} notifications={mockNotifications} />);
    const { handleSubmit } = (TodoForm as jest.Mock).mock.calls[0][0];
    const mockEvent = { preventDefault: jest.fn() };
    
    await act(async () => {
      await handleSubmit(mockEvent);
    });
    
    // Assert
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockCreateTodo).toHaveBeenCalled();
    expect(mockNotifications.toasts.addError).toHaveBeenCalledWith('Failed to create todo');
  });

  it('should reset form fields after successful submission', async () => {
    // Arrange
    mockCreateTodo.mockResolvedValueOnce({});
    let formProps: any;
    
    // Act
    const { rerender } = render(<TodoFormContainer http={mockHttp} notifications={mockNotifications} />);
    formProps = (TodoForm as jest.Mock).mock.calls[0][0];
    
    await act(async () => {
      formProps.setTitle('Test Todo');
      formProps.setDescription('Test Description');
      formProps.setAssignee('John Doe');
      formProps.setSelectedTags([{ label: 'urgent' }]);
    });
    
    rerender(<TodoFormContainer http={mockHttp} notifications={mockNotifications} />);
    formProps = (TodoForm as jest.Mock).mock.calls[(TodoForm as jest.Mock).mock.calls.length - 1][0];
    
    expect(formProps.title).toBe('Test Todo');
    expect(formProps.description).toBe('Test Description');
    expect(formProps.assignee).toBe('John Doe');
    expect(formProps.selectedTags).toEqual([{ label: 'urgent' }]);
    
    const mockEvent = { preventDefault: jest.fn() };
    
    await act(async () => {
      await formProps.handleSubmit(mockEvent);
    });
    
    // Assert
    expect(mockCreateTodo).toHaveBeenCalledWith(
      mockHttp,
      expect.objectContaining({
        title: 'Test Todo',
        description: 'Test Description',
        assignee: 'John Doe',
        status: 'planned',
        tags: ['urgent']
      })
    );
    
    rerender(<TodoFormContainer http={mockHttp} notifications={mockNotifications} />);
    const finalProps = (TodoForm as jest.Mock).mock.calls[(TodoForm as jest.Mock).mock.calls.length - 1][0];
    
    expect(finalProps.title).toBe('');
    expect(finalProps.description).toBe('');
    expect(finalProps.assignee).toBe('');
    expect(finalProps.selectedTags).toEqual([]);
  });
});