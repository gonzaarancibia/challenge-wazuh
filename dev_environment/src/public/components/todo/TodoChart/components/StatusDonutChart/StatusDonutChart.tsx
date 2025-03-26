import React from 'react';
import { EuiText, EuiEmptyPrompt } from '@elastic/eui';
import { Chart, Settings, Partition } from '@elastic/charts';
import { capitalizeFirst } from '../../../../../utils/utils';
import { StatusStat } from '../../../../../types/TodoChart.types';

export const StatusDonutChart: React.FC<{ data: StatusStat[] }> = ({ data }) => {
  const hasData = data.length > 0 && data.some(item => item.value > 0);

  if (!hasData) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EuiEmptyPrompt
          iconType="visualizeApp"
          title={<h3>No data to display</h3>}
          titleSize="xs"
          body={<EuiText size="s">There are no todos with status information.</EuiText>}
        />
      </div>
    );
  }

  return (
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
        data={data}
        valueAccessor={(d) => d.value}
        layers={[
          {
            groupByRollup: (d) => capitalizeFirst(d.label),
            shape: {
              fillColor: (d) => {
                if (d.dataName.toLowerCase() === 'error') return '#BD271E';
                return d.dataName.toLowerCase() === 'completed' ? '#00BFB3' : '#006BB4';
              },
            },
          },
        ]}
        clockwiseSectors={false}
      />
    </Chart>
  );
};
