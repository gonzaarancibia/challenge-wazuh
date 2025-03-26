import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimelineChart } from './TimelineChart';
import { TimelineData } from '../../../../../types/TodoChart.types';

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
  Chart: ({ children, size }) => <div data-testid="elastic-chart" data-height={size?.height}>{children}</div>,
  Settings: () => <div data-testid="chart-settings"></div>,
  LineSeries: ({ id, name, data }) => (
    <div data-testid={`line-series-${id}`} data-name={name}>
      {data.map((item, index) => (
        <div key={index} data-date={item.date} data-created={item.created} data-completed={item.completed}></div>
      ))}
    </div>
  ),
  Axis: ({ id, position }) => <div data-testid={`axis-${position}`} data-id={id}></div>
}));

describe('TimelineChart', () => {
  it('renders correctly with given data', () => {
    // Arrange
    const mockData: TimelineData[] = [
      { date: new Date('2023-03-15'), created: 3, completed: 1 },
      { date: new Date('2023-03-16'), created: 2, completed: 2 },
      { date: new Date('2023-03-17'), created: 5, completed: 3 },
    ];

    // Act
    const { getByTestId } = render(<TimelineChart data={mockData} />);

    // Assert
    expect(getByTestId('elastic-chart')).toBeInTheDocument();
    expect(getByTestId('chart-settings')).toBeInTheDocument();
    expect(getByTestId('line-series-created-todos')).toBeInTheDocument();
    expect(getByTestId('line-series-completed-todos')).toBeInTheDocument();
    expect(getByTestId('axis-bottom')).toBeInTheDocument();
    expect(getByTestId('axis-left')).toBeInTheDocument();
  });

  it('renders empty state when no data is provided', () => {
    // Arrange
    const mockData: TimelineData[] = [];

    // Act
    const { getByTestId, getByText } = render(<TimelineChart data={mockData} />);

    // Assert
    expect(getByTestId('eui-empty-prompt')).toBeInTheDocument();
    expect(getByText('No data to display')).toBeInTheDocument();
    expect(getByText('There is no timeline data available.')).toBeInTheDocument();
  });
});