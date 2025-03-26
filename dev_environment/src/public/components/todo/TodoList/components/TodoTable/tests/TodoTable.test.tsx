import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoTable from '../TodoTable';
import { Todo } from '../../../../../../types/types';

// Mock Elastic UI components
jest.mock('@elastic/eui', () => ({
  EuiBasicTable: ({ 
    items, 
    columns, 
    loading, 
    itemId, 
    itemIdToExpandedRowMap, 
    pagination, 
    sorting, 
    onChange 
  }) => (
    <div data-testid="eui-basic-table">
      <table>
        <thead>
          <tr>
            {columns.map((column: any, index: number) => (
              <th key={index} onClick={() => onChange({ sort: { field: column.field, direction: 'asc' } })}>
                {typeof column.name === 'string' ? column.name : 'Expand'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} data-testid={`row-${item.id}`}>
              {columns.map((column: any, index: number) => (
                <td key={index}>
                  {column.render 
                    ? column.render(column.field ? item[column.field] : item, item) 
                    : column.actions 
                      ? column.actions.map((action: any, actionIndex: number) => (
                          action.enabled === undefined || action.enabled(item) 
                            ? <button 
                                key={actionIndex} 
                                data-testid={`action-${action.name.toLowerCase()}-${item.id}`}
                                onClick={() => action.onClick(item)}
                              >
                                {action.name}
                              </button> 
                            : null
                        ))
                      : item[column.field]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div data-testid="pagination">
        <button 
          data-testid="previous-page" 
          onClick={() => onChange({ page: { index: pagination.pageIndex - 1, size: pagination.pageSize } })}
          disabled={pagination.pageIndex === 0}
        >
          Previous
        </button>
        <span data-testid="page-info">
          Page {pagination.pageIndex + 1} of {Math.ceil(pagination.totalItemCount / pagination.pageSize)}
        </span>
        <button 
          data-testid="next-page" 
          onClick={() => onChange({ page: { index: pagination.pageIndex + 1, size: pagination.pageSize } })}
          disabled={pagination.pageIndex >= Math.ceil(pagination.totalItemCount / pagination.pageSize) - 1}
        >
          Next
        </button>
      </div>
    </div>
  ),
  EuiBadge: ({ children, color }) => (
    <span data-testid={`badge-${color}`} className={`eui-badge-${color}`}>
      {children}
    </span>
  ),
  EuiButtonIcon: ({ onClick, 'aria-label': ariaLabel, iconType }) => (
    <button 
      data-testid={`button-icon-${iconType}`} 
      onClick={onClick} 
      aria-label={ariaLabel}
    >
      {iconType}
    </button>
  ),
  EuiScreenReaderOnly: ({ children }) => (
    <span data-testid="screen-reader-only">{children}</span>
  ),
  EuiSpacer: ({ size }) => (
    <div data-testid={`spacer-${size}`} />
  ),
  EuiText: ({ children, size }) => (
    <div data-testid={`text-${size}`}>{children}</div>
  )
}));

describe('TodoTable', () => {
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
    items: mockTodos,
    loading: false,
    itemIdToExpandedRowMap: {},
    toggleDetails: jest.fn(),
    onTableChange: jest.fn(),
    resultsCount: 3,
    pageIndex: 0,
    pageSize: 5,
    todosLength: 3,
    sortField: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
    onStatusChange: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the table with todos', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Assert
    expect(screen.getByTestId('eui-basic-table')).toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('row-2')).toBeInTheDocument();
    expect(screen.getByTestId('row-3')).toBeInTheDocument();
  });

  it('should display the correct number of todos', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Assert
    expect(screen.getByTestId('text-xs')).toHaveTextContent('Showing 3 Todo');
  });

  it('should call onStatusChange when status action is clicked', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Act
    const completeButton = screen.getByTestId('action-complete-1');
    fireEvent.click(completeButton);
    
    // Assert
    expect(mockProps.onStatusChange).toHaveBeenCalledWith('1', 'completed');
  });

  it('should call onDelete when delete action is clicked', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Act
    const deleteButton = screen.getByTestId('action-delete-1');
    fireEvent.click(deleteButton);
    
    // Assert
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('should call toggleDetails when expand button is clicked', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Act
    const expandButtons = screen.getAllByTestId('button-icon-arrowRight');
    fireEvent.click(expandButtons[0]);
    
    // Assert
    expect(mockProps.toggleDetails).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('should call onTableChange when sorting is changed', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Act
    const titleHeader = screen.getByText('Title');
    fireEvent.click(titleHeader);
    
    // Assert
    expect(mockProps.onTableChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: { field: 'title', direction: 'asc' }
      })
    );
  });

  it('should call onTableChange when pagination is changed', () => {
    // Arrange
    const propsWithMoreTodos = {
      ...mockProps,
      todosLength: 10,
      pageSize: 5,
      pageIndex: 0
    };
    
    // Act
    render(<TodoTable {...propsWithMoreTodos} />);
    
    // Act
    const nextButton = screen.getByTestId('next-page');
    fireEvent.click(nextButton);
    
    // Assert
    expect(mockProps.onTableChange).toHaveBeenCalledWith(
      expect.objectContaining({
        page: { index: 1, size: 5 }
      })
    );
  });

  it('should render correct status badges', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Assert
    expect(screen.getByText('planned')).toBeInTheDocument();
    expect(screen.getByText('planned').closest('[data-testid="badge-primary"]')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('completed').closest('[data-testid="badge-success"]')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.getByText('error').closest('[data-testid="badge-danger"]')).toBeInTheDocument();
  });

  it('should disable status actions based on current status', () => {
    // Act
    render(<TodoTable {...mockProps} />);
    
    // Assert
    expect(screen.queryByTestId('action-complete-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-planned-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-error-3')).not.toBeInTheDocument();
  });
});