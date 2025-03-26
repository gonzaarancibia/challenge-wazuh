import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TagDistributionChart } from './TagDistributionChart';
import { TagStat } from '../../../../../types/TodoChart.types';

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

// Mock the Elastic Charts components
jest.mock('@elastic/charts', () => ({
  Chart: ({ children }) => <div data-testid="elastic-chart">{children}</div>,
  Settings: () => <div data-testid="chart-settings"></div>,
  BarSeries: ({ data }) => (
    <div data-testid="bar-series">
      {data.map((item, index) => (
        <div key={index} data-tag={item.tag} data-count={item.count}></div>
      ))}
    </div>
  ),
  Axis: ({ position }) => <div data-testid={`axis-${position}`}></div>,
  ScaleType: {
    Ordinal: 'ordinal',
    Linear: 'linear'
  }
}));

describe('TagDistributionChart', () => {
  it('renders correctly with given data', () => {
    // Arrange
    const mockData: TagStat[] = [
      { tag: 'work', count: 5 },
      { tag: 'personal', count: 10 },
      { tag: 'urgent', count: 2 },
    ];

    // Act
    const { getByTestId } = render(<TagDistributionChart data={mockData} />);

    // Assert
    expect(getByTestId('elastic-chart')).toBeInTheDocument();
    expect(getByTestId('chart-settings')).toBeInTheDocument();
    expect(getByTestId('bar-series')).toBeInTheDocument();
    expect(getByTestId('axis-left')).toBeInTheDocument();
    expect(getByTestId('axis-bottom')).toBeInTheDocument();
  });

  it('sorts data by count in descending order', () => {
    // Arrange
    const mockData: TagStat[] = [
      { tag: 'work', count: 5 },
      { tag: 'personal', count: 10 },
      { tag: 'urgent', count: 2 },
    ];

    // Act
    const { getByTestId } = render(<TagDistributionChart data={mockData} />);
    
    // Assert
    const barSeries = getByTestId('bar-series');
    const items = barSeries.children;
    
    // Check that the first item has the highest count
    expect(items[0].getAttribute('data-tag')).toBe('personal');
    expect(items[0].getAttribute('data-count')).toBe('10');
    
    // Check that the last item has the lowest count
    expect(items[2].getAttribute('data-tag')).toBe('urgent');
    expect(items[2].getAttribute('data-count')).toBe('2');
  });

  it('renders empty state when no data is provided', () => {
    // Arrange
    const mockData: TagStat[] = [];

    // Act
    const { getByTestId, getByText } = render(<TagDistributionChart data={mockData} />);

    // Assert
    expect(getByTestId('eui-empty-prompt')).toBeInTheDocument();
    expect(getByText('No data to display')).toBeInTheDocument();
  });

  it('renders empty state when all counts are zero', () => {
    // Arrange
    const mockData: TagStat[] = [
      { tag: 'work', count: 0 },
      { tag: 'personal', count: 0 },
    ];

    // Act
    const { getByTestId, getByText } = render(<TagDistributionChart data={mockData} />);

    // Assert
    expect(getByTestId('eui-empty-prompt')).toBeInTheDocument();
    expect(getByText('No data to display')).toBeInTheDocument();
  });
});