import React from 'react';
import { render } from '@testing-library/react';
import { StatusDonutChart } from './StatusDonutChart';
import { StatusStat } from '../../../../../types/TodoChart.types';

describe('StatusDonutChart', () => {
  it('renders correctly with given data', () => {
    // Arrange
    const mockData: StatusStat[] = [
      { label: 'planned', value: 5 },
      { label: 'completed', value: 10 },
      { label: 'error', value: 2 },
    ];

    // Act
    const { getByText } = render(<StatusDonutChart data={mockData} />);

    // Assert
    expect(getByText('planned')).toBeInTheDocument();
    expect(getByText('completed')).toBeInTheDocument();
    expect(getByText('error')).toBeInTheDocument();
  });
});