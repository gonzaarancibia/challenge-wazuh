import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoAPP } from './TodoAPP';
import { TodoListContainer as TodoList } from './todo/TodoList';
import { TodoFormContainer as TodoForm } from './todo/TodoForm';
import { TodoChartContainer as TodoChart } from './todo/TodoChart';

// Mock dependencies
jest.mock('./todo/TodoList', () => ({
  TodoListContainer: jest.fn(() => <div data-testid="todo-list" />)
}));

jest.mock('./todo/TodoForm', () => ({
  TodoFormContainer: jest.fn(() => <div data-testid="todo-form" />)
}));

jest.mock('./todo/TodoChart', () => ({
  TodoChartContainer: jest.fn(() => <div data-testid="todo-chart" />)
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children, basename }) => (
    <div data-testid="router" data-basename={basename}>
      {children}
    </div>
  )
}));

jest.mock('@osd/i18n/react', () => ({
  I18nProvider: ({ children }) => <div data-testid="i18n-provider">{children}</div>,
  FormattedMessage: ({ defaultMessage, values }) => (
    <span data-testid="formatted-message">{defaultMessage.replace('{name}', values.name)}</span>
  )
}));

jest.mock('@elastic/eui', () => ({
  EuiPage: ({ children, restrictWidth }) => (
    <div data-testid="eui-page" data-width={restrictWidth}>
      {children}
    </div>
  ),
  EuiPageBody: ({ children, component }) => (
    <div data-testid="eui-page-body" data-component={component}>
      {children}
    </div>
  ),
  EuiPageContent: ({ children }) => <div data-testid="eui-page-content">{children}</div>,
  EuiPageContentBody: ({ children }) => <div data-testid="eui-page-content-body">{children}</div>,
  EuiPageHeader: ({ children }) => <div data-testid="eui-page-header">{children}</div>,
  EuiTitle: ({ children, size }) => (
    <div data-testid="eui-title" data-size={size}>
      {children}
    </div>
  ),
  EuiFlexGroup: ({ children }) => <div data-testid="eui-flex-group">{children}</div>,
  EuiFlexItem: ({ children, grow }) => (
    <div data-testid="eui-flex-item" data-grow={grow}>
      {children}
    </div>
  ),
  EuiSpacer: ({ size }) => <div data-testid="eui-spacer" data-size={size} />
}));

jest.mock('../../common', () => ({
  PLUGIN_ID: 'todo-plugin',
  PLUGIN_NAME: 'Todo Plugin'
}));

describe('TodoAPP', () => {
  // Arrange
  const mockProps = {
    basename: '/app/todo',
    notifications: {
      toasts: {
        addSuccess: jest.fn(),
        addError: jest.fn()
      }
    },
    http: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    },
    navigation: {
      ui: {
        TopNavMenu: jest.fn(({ appName, showSearchBar, useDefaultBehaviors }) => (
          <div 
            data-testid="top-nav-menu" 
            data-app-name={appName}
            data-show-search-bar={showSearchBar}
            data-use-default-behaviors={useDefaultBehaviors}
          />
        ))
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with correct structure', () => {
    // Act
    render(<TodoAPP {...mockProps} />);
    
    // Assert
    expect(screen.getByTestId('router')).toBeInTheDocument();
    expect(screen.getByTestId('router')).toHaveAttribute('data-basename', '/app/todo');
    
    expect(screen.getByTestId('i18n-provider')).toBeInTheDocument();
    
    expect(screen.getByTestId('top-nav-menu')).toBeInTheDocument();
    expect(screen.getByTestId('top-nav-menu')).toHaveAttribute('data-app-name', 'todo-plugin');
    expect(screen.getByTestId('top-nav-menu')).toHaveAttribute('data-show-search-bar', 'true');
    expect(screen.getByTestId('top-nav-menu')).toHaveAttribute('data-use-default-behaviors', 'true');
    
    expect(screen.getByTestId('eui-page')).toBeInTheDocument();
    expect(screen.getByTestId('eui-page')).toHaveAttribute('data-width', '1250px');
    
    expect(screen.getByTestId('eui-page-body')).toBeInTheDocument();
    expect(screen.getByTestId('eui-page-body')).toHaveAttribute('data-component', 'main');
    
    expect(screen.getByTestId('formatted-message')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-message')).toHaveTextContent('Todo Plugin');
  });

  it('should render TodoList with correct props', () => {
    // Act
    render(<TodoAPP {...mockProps} />);
    
    // Assert
    expect(TodoList).toHaveBeenCalledWith(
      {
        http: mockProps.http,
        notifications: mockProps.notifications
      },
      expect.anything()
    );
  });

  it('should render TodoForm with correct props', () => {
    // Act
    render(<TodoAPP {...mockProps} />);
    
    // Assert
    expect(TodoForm).toHaveBeenCalledWith(
      {
        http: mockProps.http,
        notifications: mockProps.notifications
      },
      expect.anything()
    );
  });

  it('should render TodoChart', () => {
    // Act
    render(<TodoAPP {...mockProps} />);
    
    // Assert
    expect(TodoChart).toHaveBeenCalled();
  });
});