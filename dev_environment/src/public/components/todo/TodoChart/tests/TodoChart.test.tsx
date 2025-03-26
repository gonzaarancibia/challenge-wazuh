import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Añadir esta importación
import TodoChart from '../TodoChart';
import { StatusDonutChart } from '../components/StatusDonutChart';
import { TimelineChart } from '../components/TimelineChart';
import { TagDistributionChart } from '../components/TagDistributionChart';

// Mock Elastic UI components
jest.mock('@elastic/eui', () => ({
  EuiPanel: ({ children }) => <div data-testid="eui-panel">{children}</div>,
  EuiTitle: ({ children, size }) => <div data-testid={`eui-title-${size}`}>{children}</div>,
  EuiSpacer: () => <div data-testid="eui-spacer" />,
  EuiFlexGroup: ({ children }) => <div data-testid="eui-flex-group">{children}</div>,
  EuiFlexItem: ({ children, style }) => <div data-testid="eui-flex-item" style={style}>{children}</div>,
  EuiLoadingContent: ({ lines }) => <div data-testid="eui-loading-content" role="progressbar" aria-label={`Loading content: ${lines} lines`} />
}));

// Mock the chart components
jest.mock('../components/StatusDonutChart', () => ({
  StatusDonutChart: jest.fn(() => <div data-testid="status-donut-chart" />)
}));

jest.mock('../components/TimelineChart', () => ({
  TimelineChart: jest.fn(() => <div data-testid="timeline-chart" />)
}));

jest.mock('../components/TagDistributionChart', () => ({
  TagDistributionChart: jest.fn(() => <div data-testid="tag-distribution-chart" />)
}));

describe('TodoChart', () => {
  const mockProps = {
    loading: false,
    statusStats: [
      { label: 'planned', value: 2 },
      { label: 'completed', value: 3 },
      { label: 'error', value: 1 }
    ],
    timelineData: [
      { date: '2023-03-14', created: 1, completed: 0 },
      { date: '2023-03-15', created: 2, completed: 1 },
      { date: '2023-03-16', created: 0, completed: 1 },
      { date: '2023-03-17', created: 1, completed: 0 },
      { date: '2023-03-18', created: 1, completed: 1 },
      { date: '2023-03-19', created: 0, completed: 0 },
      { date: '2023-03-20', created: 1, completed: 0 }
    ],
    tagStats: [
      { tag: 'work', count: 3 },
      { tag: 'urgent', count: 2 },
      { tag: 'personal', count: 1 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state when loading is true', () => {
    render(<TodoChart {...mockProps} loading={true} />);
    
    // Should show loading content
    expect(screen.getByTestId('eui-loading-content')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Chart components should not be rendered
    expect(screen.queryByTestId('status-donut-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('timeline-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tag-distribution-chart')).not.toBeInTheDocument();
  });

  it('should render all chart components when not loading', () => {
    render(<TodoChart {...mockProps} />);
    
    // Title should be rendered
    expect(screen.getByText('Todo Statistics')).toBeInTheDocument();
    expect(screen.getByText('Tag Distribution')).toBeInTheDocument();
    
    // All chart components should be rendered
    expect(screen.getByTestId('status-donut-chart')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-chart')).toBeInTheDocument();
    expect(screen.getByTestId('tag-distribution-chart')).toBeInTheDocument();
    
    // Check if props are passed correctly to chart components
    expect(StatusDonutChart).toHaveBeenCalledWith({ data: mockProps.statusStats }, {});
    expect(TimelineChart).toHaveBeenCalledWith({ data: mockProps.timelineData }, {});
    expect(TagDistributionChart).toHaveBeenCalledWith({ data: mockProps.tagStats }, {});
  });

  it('should handle empty data gracefully', () => {
    const emptyProps = {
      loading: false,
      statusStats: [],
      timelineData: [],
      tagStats: []
    };
    
    render(<TodoChart {...emptyProps} />);
    
    // Title should still be rendered
    expect(screen.getByText('Todo Statistics')).toBeInTheDocument();
    
    // Chart components should be rendered with empty data
    expect(screen.getByTestId('status-donut-chart')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-chart')).toBeInTheDocument();
    expect(screen.getByTestId('tag-distribution-chart')).toBeInTheDocument();
    
    // Check if empty props are passed correctly
    expect(StatusDonutChart).toHaveBeenCalledWith({ data: [] }, {});
    expect(TimelineChart).toHaveBeenCalledWith({ data: [] }, {});
    expect(TagDistributionChart).toHaveBeenCalledWith({ data: [] }, {});
  });
});