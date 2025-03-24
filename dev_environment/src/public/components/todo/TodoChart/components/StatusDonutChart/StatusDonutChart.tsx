import React from 'react';
import { Chart, Settings, Partition} from '@elastic/charts';
import { capitalizeFirst } from '../../../../../utils/utils';
import { StatusStat } from '../../../../../types/TodoChart.types';


export const StatusDonutChart: React.FC<{ data: StatusStat[] }> = ({ data }) => (
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
              fillColor: (d, sortIndex) => ['#006BB4', '#00BFB3', '#BD271E'][sortIndex],
            },
          },
        ]}
        clockwiseSectors={false}
      />
    </Chart>
  );
  