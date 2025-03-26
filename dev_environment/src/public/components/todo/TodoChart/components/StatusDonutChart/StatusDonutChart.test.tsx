import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusDonutChart } from './StatusDonutChart';
import { StatusStat } from '../../../../../types/TodoChart.types';

// Mock the EUI components
jest.mock('@elastic/eui', () => ({
  EuiText: ({ children, size }) => <div data-testid="eui-text" data-size={size}>{children}</div>,
  EuiEmptyPrompt: ({ iconType, title, titleSize, body }) => (
    <div data-testid="eui-empty-prompt" data-icon-type={iconType} data-title-size={titleSize}>
      <div data-testid="eui-empty-prompt-title">{title}</div>
      <div data-testid="eui-empty-prompt-body">{body}</div>
    </div>
  )
}));

describe('StatusDonutChart', () => {
  it('renders correctly with given data', () => {
    // Arrange
    const mockData: StatusStat[] = [
      { label: 'planned', value: 5 },
      { label: 'completed', value: 10 },
      { label: 'error', value: 2 },
    ];

    // Act
    const { container } = render(<StatusDonutChart data={mockData} />);

    // Assert
    // Check if the chart container is rendered
    expect(container.querySelector('.echChart')).toBeInTheDocument();
    expect(container.querySelector('.echChartStatus')).toBeInTheDocument();
  });

  it('renders empty state when no data is provided', () => {
    // Arrange
    const mockData: StatusStat[] = [];

    // Act
    const { getByText } = render(<StatusDonutChart data={mockData} />);

    // Assert
    expect(getByText('No data to display')).toBeInTheDocument();
    expect(getByText('There are no todos with status information.')).toBeInTheDocument();
  });

  it('renders empty state when all values are zero', () => {
    // Arrange
    const mockData: StatusStat[] = [
      { label: 'planned', value: 0 },
      { label: 'completed', value: 0 },
      { label: 'error', value: 0 },
    ];

    // Act
    const { getByText } = render(<StatusDonutChart data={mockData} />);

    // Assert
    expect(getByText('No data to display')).toBeInTheDocument();
    expect(getByText('There are no todos with status information.')).toBeInTheDocument();
  });
});