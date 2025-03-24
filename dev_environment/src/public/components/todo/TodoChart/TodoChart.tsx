import React from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingContent
} from '@elastic/eui';
import { StatusDonutChart } from './components/StatusDonutChart';
import { TimelineChart } from './components/TimelineChart';
import { TagDistributionChart } from './components/TagDistributionChart';
import { TodoChartProps } from '../../../types/TodoChart.types';


const TodoChart: React.FC<TodoChartProps> = ({ loading, statusStats, timelineData, tagStats }) => {
  if (loading) {
    return <EuiLoadingContent lines={3} />;
  }

  return (
    <EuiPanel>
      <EuiTitle size="s">
        <h2>Todo Statistics</h2>
      </EuiTitle>
      <EuiSpacer />
      <EuiFlexGroup>
        <EuiFlexItem>
          <StatusDonutChart data={statusStats} />
        </EuiFlexItem>
        <EuiFlexItem style={{ minWidth: '55%' }}>
          <TimelineChart data={timelineData} />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiTitle size="xs">
            <h3>Tag Distribution</h3>
          </EuiTitle>
          <TagDistributionChart data={tagStats} />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default TodoChart;