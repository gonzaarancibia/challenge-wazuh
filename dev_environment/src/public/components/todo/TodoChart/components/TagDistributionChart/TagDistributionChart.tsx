import React from 'react';
import { Chart, Settings, BarSeries, Axis, ScaleType } from '@elastic/charts';
import { TagStat } from '../../../../../types/TodoChart.types';
import { EuiText, EuiEmptyPrompt } from '@elastic/eui';

export const TagDistributionChart: React.FC<{ data: TagStat[] }> = ({ data }) => {
  // Check if there's no data or all counts are zero
  const hasData = data.length > 0 && data.some(item => item.count > 0);

  if (!hasData) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EuiEmptyPrompt
          iconType="visualizeApp"
          title={<h3>No data to display</h3>}
          titleSize="xs"
          body={<EuiText size="s">There are no tags associated with your todos.</EuiText>}
        />
      </div>
    );
  }

  return (
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
};