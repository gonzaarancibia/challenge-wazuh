import React from 'react';
import { Chart, Settings, Axis, LineSeries } from '@elastic/charts';
import { TimelineData } from '../../../../../types/TodoChart.types';
import { EuiText, EuiEmptyPrompt } from '@elastic/eui';

export const TimelineChart: React.FC<{ data: TimelineData[] }> = ({ data }) => {
  const hasData = data.length > 0 && data.some(item => item.created > 0 || item.completed > 0);

  if (!hasData) {
    return (
      <>
        <EuiEmptyPrompt
          iconType="visualizeApp"
          title={<h3>No data to display</h3>}
          titleSize="xs"
          body={<EuiText size="s">There is no timeline data available.</EuiText>}
        />
      </>
    );
  }

  return (
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
};
  