import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoForm from '../TodoForm';

// Mock Elastic UI components
jest.mock('@elastic/eui', () => ({
  EuiForm: ({ children, onSubmit }) => (
    <form data-testid="eui-form" onSubmit={onSubmit}>{children}</form>
  ),
  EuiFormRow: ({ label, children }) => (
    <div data-testid={`form-row-${label}`}>
      <label>{label}</label>
      {children}
    </div>
  ),
  EuiFieldText: ({ value, onChange }) => (
    <input 
      data-testid="eui-field-text" 
      value={value} 
      onChange={onChange} 
    />
  ),
  EuiTextArea: ({ value, onChange }) => (
    <textarea 
      data-testid="eui-text-area" 
      value={value} 
      onChange={onChange}
    />
  ),
  EuiButton: ({ children, type, isDisabled, fill }) => (
    <button 
      data-testid="eui-button" 
      type={type} 
      disabled={isDisabled}
    >
      {children}
    </button>
  ),
  EuiPanel: ({ children }) => (
    <div data-testid="eui-panel">{children}</div>
  ),
  EuiTitle: ({ children, size }) => (
    <div data-testid={`eui-title-${size}`}>{children}</div>
  ),
  EuiSpacer: () => <div data-testid="eui-spacer" />,
  EuiComboBox: ({ 
    selectedOptions, 
    onChange, 
    options, 
    isClearable, 
    isCreatable, 
    placeholder, 
    singleSelection 
  }) => (
    <div data-testid="eui-combo-box">
      <select 
        value={selectedOptions.length > 0 ? selectedOptions[0].label : ''}
        onChange={(e) => {
          const selected = options.find(opt => opt.label === e.target.value);
          onChange(selected ? [selected] : []);
        }}
      >
        <option value="">Select a tag</option>
        {options.map(option => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}));

describe('TodoForm', () => {
  // Arrange
  const mockProps = {
    title: '',
    description: '',
    assignee: '',
    selectedTags: [],
    predefinedTags: [
      { label: 'urgent' },
      { label: 'bug' },
      { label: 'feature' }
    ],
    setTitle: jest.fn(),
    setDescription: jest.fn(),
    setAssignee: jest.fn(),
    setSelectedTags: jest.fn(),
    handleSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with all fields', () => {
    // Act
    render(<TodoForm {...mockProps} />);
    
    // Assert
    expect(screen.getByTestId('eui-title-s')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Tag')).toBeInTheDocument();
    expect(screen.getByTestId('eui-button')).toBeInTheDocument();
  });

  it('should call setTitle when title input changes', () => {
    // Arrange
    render(<TodoForm {...mockProps} />);
    const titleInput = screen.getByTestId('form-row-Title').querySelector('input');
    
    // Act
    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    
    // Assert
    expect(mockProps.setTitle).toHaveBeenCalledWith('New Todo');
  });

  it('should call setDescription when description input changes', () => {
    // Arrange
    render(<TodoForm {...mockProps} />);
    const descriptionInput = screen.getByTestId('eui-text-area');
    
    // Act
    fireEvent.change(descriptionInput, { target: { value: 'Todo description' } });
    
    // Assert
    expect(mockProps.setDescription).toHaveBeenCalledWith('Todo description');
  });

  it('should call setAssignee when assignee input changes', () => {
    // Arrange
    render(<TodoForm {...mockProps} />);
    const assigneeInput = screen.getByTestId('form-row-Assignee').querySelector('input');
    
    // Act
    fireEvent.change(assigneeInput, { target: { value: 'John Doe' } });
    
    // Assert
    expect(mockProps.setAssignee).toHaveBeenCalledWith('John Doe');
  });

  it('should call handleSubmit when form is submitted', () => {
    // Arrange
    render(<TodoForm {...mockProps} />);
    const form = screen.getByTestId('eui-form');
    
    // Act
    fireEvent.submit(form);
    
    // Assert
    expect(mockProps.handleSubmit).toHaveBeenCalled();
  });

  it('should disable submit button when title is empty', () => {
    // Arrange
    render(<TodoForm {...mockProps} />);
    const button = screen.getByTestId('eui-button');
    
    // Assert
    expect(button).toBeDisabled();
  });

  it('should enable submit button when title is not empty', () => {
    // Arrange
    const propsWithTitle = {
      ...mockProps,
      title: 'Test Todo'
    };
    
    // Act
    render(<TodoForm {...propsWithTitle} />);
    const button = screen.getByTestId('eui-button');
    
    // Assert
    expect(button).not.toBeDisabled();
  });
});