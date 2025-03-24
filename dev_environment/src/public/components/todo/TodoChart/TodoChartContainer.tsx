import React from 'react';
import { useStore } from '../../../store';
import { useChartData } from './hooks/useChartData';
import TodoChart from './TodoChart';

export const TodoChartContainer: React.FC = () => {
  const { todos, loading } = useStore();
  const { statusStats, timelineData, tagStats } = useChartData(todos);

  return <TodoChart loading={loading} statusStats={statusStats} timelineData={timelineData} tagStats={tagStats} />;
};

