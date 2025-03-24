import React from 'react';
import { Chart, Settings, BarSeries, Axis, ScaleType } from '@elastic/charts';
import { TagStat } from '../../../../../types/TodoChart.types';

export const TagDistributionChart: React.FC<{ data: TagStat[] }> = ({ data }) => (
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
        data={[...data].sort((a, b) => b.count - a.count)}
        xAccessor="tag"
        yAccessors={['count']}
        xScaleType={ScaleType.Ordinal}
        yScaleType={ScaleType.Linear}
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
);