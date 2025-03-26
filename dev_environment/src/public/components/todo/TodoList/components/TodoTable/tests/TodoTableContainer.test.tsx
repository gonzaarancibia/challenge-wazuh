import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoTableContainer from '../TodoTableContainer';
import TodoTable from '../TodoTable';
import { Todo } from '../../../../../../types/types';

jest.mock('../TodoTable', () => {
  return jest.fn(() => <div data-testid="todo-table" />);
});

jest.mock('@elastic/eui', () => ({
  Comparators: {
    property: jest.fn(() => jest.fn((a: any, b: any) => 0)),
    default: jest.fn(() => jest.fn((a: any, b: any) => 0))
  },
  EuiDescriptionList: ({ listItems }) => (
    <div data-testid="eui-description-list">
      {listItems.map((item: any, index: number) => (
        <div key={index} data-testid={`list-item-${item.title.toLowerCase()}`}>
          {item.title}: {item.description}
        </div>
      ))}
    </div>
  )
}));

describe('TodoTableContainer', () => {
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
    },
    {
      id: '3',
      title: 'Test Todo 3',
      description: 'Description 3',
      status: 'error',
      assignee: 'User 3',
      createdAt: '2023-01-04T00:00:00.000Z',
      tags: []
    }
  ];

  const mockProps = {
    todos: mockTodos,
    loading: false,
    onStatusChange: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render TodoTable with correct initial props', () => {
    // Act
    render(<TodoTableContainer {...mockProps} />);
    
    // Assert
    expect(TodoTable).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.any(Array),
        loading: false,
        itemIdToExpandedRowMap: {},
        toggleDetails: expect.any(Function),
        onTableChange: expect.any(Function),
        resultsCount: expect.any(Object),
        pageIndex: 0,
        pageSize: 5,
        todosLength: 3,
        sortField: 'createdAt',
        sortDirection: 'desc',
        onStatusChange: mockProps.onStatusChange,
        onDelete: mockProps.onDelete
      }),
      {}
    );
  });

  it('should handle table change for pagination', () => {
    // Act
    render(<TodoTableContainer {...mockProps} />);
    
    const { onTableChange } = (TodoTable as jest.Mock).mock.calls[0][0];
    
    // Act
    act(() => {
      onTableChange({
        page: { index: 1, size: 10 }
      });
    });
    
    // Assert
    expect(TodoTable).toHaveBeenLastCalledWith(
      expect.objectContaining({
        pageIndex: 1,
        pageSize: 10
      }),
      {}
    );
  });

  it('should handle table change for sorting', () => {
    // Act
    render(<TodoTableContainer {...mockProps} />);
    
    const { onTableChange } = (TodoTable as jest.Mock).mock.calls[0][0];
    
    // Act
    act(() => {
      onTableChange({
        sort: { field: 'title', direction: 'asc' }
      });
    });
    
    // Assert
    expect(TodoTable).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortField: 'title',
        sortDirection: 'asc'
      }),
      {}
    );
  });

  it('should toggle details when toggleDetails is called', () => {
    // Act
    const { rerender } = render(<TodoTableContainer {...mockProps} />);
    
    const { toggleDetails } = (TodoTable as jest.Mock).mock.calls[0][0];
    
    // Act
    act(() => {
      toggleDetails(mockTodos[0]);
    });
    
    // Assert
    const firstCall = (TodoTable as jest.Mock).mock.calls[(TodoTable as jest.Mock).mock.calls.length - 1][0];
    expect(Object.keys(firstCall.itemIdToExpandedRowMap).length).toBe(1);
    expect(firstCall.itemIdToExpandedRowMap['1']).toBeTruthy();
    
    (TodoTable as jest.Mock).mockClear();
    
    rerender(<TodoTableContainer {...mockProps} />);
    
    const updatedToggleDetails = (TodoTable as jest.Mock).mock.calls[0][0].toggleDetails;
    
    // Act
    act(() => {
      updatedToggleDetails(mockTodos[0]);
    });
    
    // Assert
    const lastCallProps = (TodoTable as jest.Mock).mock.calls[(TodoTable as jest.Mock).mock.calls.length - 1][0];
    expect(Object.keys(lastCallProps.itemIdToExpandedRowMap)).toHaveLength(0);
  });

  it('should calculate correct results count', () => {
    // Act
    render(<TodoTableContainer {...mockProps} />);
    
    const { resultsCount } = (TodoTable as jest.Mock).mock.calls[0][0];
    
    // Assert
    expect(resultsCount).toMatchObject({
      type: React.Fragment,
      props: {
        children: [
          expect.objectContaining({
            type: 'strong',
            props: expect.anything()
          }),
          ' ',
          'of ',
          3
        ]
      }
    });
  });

  it('should filter and sort todos correctly', () => {
    // Arrange
    const manyTodos = Array(20).fill(null).map((_, i) => ({
      id: `${i + 1}`,
      title: `Todo ${i + 1}`,
      description: `Description ${i + 1}`,
      status: i % 3 === 0 ? 'planned' : i % 3 === 1 ? 'completed' : 'error',
      assignee: `User ${i + 1}`,
      createdAt: new Date(2023, 0, i + 1).toISOString(),
      completedAt: i % 3 === 1 ? new Date(2023, 0, i + 2).toISOString() : undefined,
      tags: []
    }));
    
    // Act
    render(<TodoTableContainer {...mockProps} todos={manyTodos} />);
    
    const { onTableChange } = (TodoTable as jest.Mock).mock.calls[0][0];
    
    // Act
    act(() => {
      onTableChange({
        page: { index: 1, size: 5 }
      });
    });
    
    // Assert
    const { items } = (TodoTable as jest.Mock).mock.calls[(TodoTable as jest.Mock).mock.calls.length - 1][0];
    expect(items.length).toBe(5);
    expect(items[0].id).toBe('6');
  });
});