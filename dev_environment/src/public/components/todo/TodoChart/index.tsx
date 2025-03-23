import React, { memo } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingContent
} from '@elastic/eui';
import { Chart, Settings, Partition, BarSeries, Axis, ScaleType } from '@elastic/charts';
import { useStore } from '../../../store';
import { useChartData } from '../../../hooks/useChartData';
import { CoreStart } from '../../../../../../src/core/public';

interface TodoChartProps {
  http: CoreStart['http'];
}

export const TodoChart: React.FC<TodoChartProps> = memo(({ http }) => {
  const { todos, loading } = useStore();
  const { statusStats, timelineData, tagStats } = useChartData(todos);

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
          <Chart size={{ height: 200 }}>
            <Settings showLegend={true} />
            <Partition
              data={statusStats}
              valueAccessor={(d) => d.value}
              nameAccessor={(d) => d.label}
              layers={[
                {
                  groupByRollup: (d) => d.label,
                  shape: {
                    fillColor: (d) => {
                      switch (d.label) {
                        case 'completed': return '#7DE2D1';
                        case 'error': return '#FF7E62';
                        default: return '#7D9EE5';
                      }
                    },
                  },
                },
              ]}
            />
          </Chart>
        </EuiFlexItem>
        <EuiFlexItem>
          <Chart size={{ height: 200 }}>
            <Settings showLegend={true} />
            <BarSeries
              data={timelineData}
              xAccessor="date"
              yAccessors={['created', 'completed']}
              splitSeriesAccessors={['status']}
              stackAccessors={['status']}
            />
            <Axis
              id="bottom-axis"
              position="bottom"
              tickFormat={(d) => new Date(d).toLocaleDateString()}
            />
            <Axis
              id="left-axis"
              position="left"
              tickFormat={(d) => Math.round(d)}
              ticks={5}
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiTitle size="xs">
            <h3>Tag Distribution</h3>
          </EuiTitle>
          <Chart size={{ height: 300 }}>
            <Settings
              rotation={90}
              showLegend={false}
            />
            <BarSeries
              id="tags"
              name="Tags Distribution"
              data={[...tagStats].sort((a, b) => b.count - a.count)}
              xAccessor="tag"
              yAccessors={['count']}
              xScaleType={ScaleType.Ordinal}
              yScaleType={ScaleType.Linear}
            />
            <Axis
              id="bottom-axis"
              position="left"
              gridLine={{ visible: false }}
            />
            <Axis
              id="left-axis"
              position="bottom"
              tickFormat={(d) => Math.round(d).toString()}
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
});