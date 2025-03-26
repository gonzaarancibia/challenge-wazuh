import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoSearch } from './TodoSearch';

// Mock Elastic UI components
jest.mock('@elastic/eui', () => ({
  EuiFieldSearch: ({ placeholder, value, onChange, isLoading, className }) => (
    <input
      data-testid="eui-field-search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={isLoading}
      className={className}
    />
  ),
  EuiFlexGroup: ({ children, gutterSize }) => (
    <div data-testid="eui-flex-group" className={`gutterSize-${gutterSize}`}>{children}</div>
  ),
  EuiFlexItem: ({ children }) => (
    <div data-testid="eui-flex-item">{children}</div>
  ),
  EuiComboBox: ({ placeholder, options, selectedOptions, onChange, isClearable, className }) => (
    <div data-testid="eui-combo-box" className={className}>
      <select
        data-testid="combo-box-select"
        value={selectedOptions.length > 0 ? selectedOptions[0].label : ''}
        onChange={(e) => {
          const selected = options.find(opt => opt.label === e.target.value);
          onChange(selected ? [selected] : []);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}));

describe('TodoSearch', () => {
  // Arrange
  const mockProps = {
    searchTerm: '',
    onSearch: jest.fn(),
    onTagFilter: jest.fn(),
    selectedTags: [],
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search field and tag filter', () => {
    // Act
    render(<TodoSearch {...mockProps} />);
    
    // Assert
    expect(screen.getByTestId('eui-field-search')).toBeInTheDocument();
    expect(screen.getByTestId('eui-combo-box')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
    expect(screen.getByText('Filter by tags')).toBeInTheDocument();
  });

  it('should call onSearch when search input changes', () => {
    // Arrange
    render(<TodoSearch {...mockProps} />);
    const searchInput = screen.getByTestId('eui-field-search');
    
    // Act
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Assert
    expect(mockProps.onSearch).toHaveBeenCalledWith('test search');
  });

  it('should call onTagFilter when tag selection changes', () => {
    // Arrange
    render(<TodoSearch {...mockProps} />);
    const tagSelect = screen.getByTestId('combo-box-select');
    
    // Act
    fireEvent.change(tagSelect, { target: { value: 'urgent' } });
    
    // Assert
    expect(mockProps.onTagFilter).toHaveBeenCalledWith(['urgent']);
  });

  it('should display selected tags', () => {
    // Arrange
    const propsWithSelectedTags = {
      ...mockProps,
      selectedTags: ['bug', 'feature']
    };
    
    // Act
    render(<TodoSearch {...propsWithSelectedTags} />);
    
    // Assert
    expect(screen.getByTestId('eui-combo-box')).toBeInTheDocument();
    // Verificamos que las etiquetas seleccionadas se muestren correctamente
    // Nota: En nuestro mock, solo mostramos la primera etiqueta seleccionada en el valor del select
    expect(screen.getByTestId('combo-box-select')).toHaveValue('bug');
  });

  it('should disable search field when loading', () => {
    // Arrange
    const propsWithLoading = {
      ...mockProps,
      isLoading: true
    };
    
    // Act
    render(<TodoSearch {...propsWithLoading} />);
    const searchInput = screen.getByTestId('eui-field-search');
    
    // Assert
    expect(searchInput).toBeDisabled();
  });
});