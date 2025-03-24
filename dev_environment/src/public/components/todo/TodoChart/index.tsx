import React, { memo } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingContent
} from '@elastic/eui';
import { Chart, Settings, Partition, BarSeries, Axis, ScaleType, LineSeries } from '@elastic/charts';
import { useStore } from '../../../store';
import { useChartData } from '../../../hooks/useChartData';
import { CoreStart } from '../../../../../../src/core/public';

interface TodoChartProps {
  http: CoreStart['http'];
}

export const TodoChart: React.FC<TodoChartProps> = memo(({ http }) => {
  const { todos, loading } = useStore();
  const { statusStats, timelineData, tagStats } = useChartData(todos);

  // Función para capitalizar primera letra
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
        <EuiFlexItem >
          <Chart size={{ height: 300 }}>
            <Settings
              showLegend={true}
              legendPosition="bottom"
              theme={{
                chartMargins: { left: 0, right: 0, bottom: 20 },
                colors: {
                  vizColors: ['#006BB4', '#00BFB3', '#BD271E']
                },
                barSeriesStyle: {
                  displayValue: {
                    fontSize: 10
                  }
                }
              }}
            />
            <Partition
              id="status-donut"
              data={statusStats}
              valueAccessor={(d) => d.value}
              layers={[
                {
                  groupByRollup: (d) => capitalizeFirst(d.label),
                  shape: {
                    fillColor: (d, sortIndex) => ['#006BB4', '#00BFB3', '#BD271E'][sortIndex],
                  },
                },
              ]}
              clockwiseSectors={false}
            />
          </Chart>
        </EuiFlexItem>
        <EuiFlexItem style={{ minWidth: '55%' }}>
          <Chart size={{ height: 280 }}>
            <Settings
              showLegend={true}
              legendPosition="bottom"
              theme={{
                chartMargins: { top: 30,bottom: 20 },
                colors: {
                  vizColors: ['#006BB4', '#00BFB3']
                },
                axes: {
                  axisTitle: {
                    fontSize: 14
                  },
                  axisLabel: {
                    fontSize: 12
                  }
                }
              }}
            />
            <LineSeries
              id="created-todos"
              name="Created Todos"
              data={timelineData}
              xScaleType="time"
              xAccessor="date"
              yAccessors={['created']}
            />
            <LineSeries
              id="completed-todos"
              name="Completed Todos"
              data={timelineData}
              xScaleType="time"
              xAccessor="date"
              yAccessors={['completed']}
            />
            <Axis
              id="bottom-axis"
              position="bottom"
              tickFormat={(d) => new Date(d).toLocaleDateString()}
              style={{
                tickLabels: {
                  fontSize: 12,
                  padding: 5
                }
              }}
              gridLine={{ visible: true }}
            />
            <Axis
              id="left-axis"
              position="left"
              gridLine={{ visible: true }}
              tickFormat={(d) => Math.round(d)}
              style={{
                tickLabels: {
                  fontSize: 12,
                  padding: 5
                }
              }}
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGroup>
      {/* <EuiSpacer /> */}
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiTitle size="xs">
            <h3>Tag Distribution</h3>
          </EuiTitle>
          <Chart size={{ height: 300 }}>
            <Settings
              rotation={90}
              showLegend={false}
              theme={{
                axes: {
                  axisTitle: {
                    fontSize: 14
                  },
                  axisLabel: {
                    fontSize: 12
                  }
                }
              }}
            />
            <BarSeries
              id="tags"
              name="Tags Distribution"
              data={[...tagStats].sort((a, b) => b.count - a.count)}
              xAccessor="tag"
              yAccessors={['count']}
              xScaleType={ScaleType.Ordinal}
              yScaleType={ScaleType.Linear}
            // barSeriesStyle={{
            //   rect: {
            //     fill: '#006BB4'
            //   }
            // }}
            />
            <Axis
              id="bottom-axis"
              position="left"
              gridLine={{ visible: false }}
              style={{
                tickLabels: {
                  fontSize: 12,
                  padding: 5
                }
              }}
            />
            <Axis
              id="left-axis"
              position="bottom"
              tickFormat={(d) => Math.round(d).toString()}
              style={{
                tickLabels: {
                  fontSize: 12,
                  padding: 5
                }
              }}
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
});