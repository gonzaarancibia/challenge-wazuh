import React from 'react';
import { Chart, Settings, Axis, LineSeries } from '@elastic/charts';
import { TimelineData } from '../../../../../types/TodoChart.types';


export const TimelineChart: React.FC<{ data: TimelineData[] }> = ({ data }) => (
    <Chart size={{ height: 280 }}>
      <Settings
        showLegend={true}
        legendPosition="bottom"
        theme={{
          chartMargins: { top: 30, bottom: 20 },
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
        data={data}
        xScaleType="time"
        xAccessor="date"
        yAccessors={['created']}
      />
      <LineSeries
        id="completed-todos"
        name="Completed Todos"
        data={data}
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
  );
  