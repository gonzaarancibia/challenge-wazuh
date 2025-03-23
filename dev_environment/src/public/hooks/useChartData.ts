import { useMemo } from 'react';
import { Todo } from './useTodos';

export const useChartData = (todos: Todo[]) => {
    const statusStats = useMemo(() => {
        const stats = {
            planned: 0,
            completed: 0,
            error: 0,
        };

        todos.forEach(todo => {
            stats[todo.status]++;
        });

        return Object.entries(stats).map(([status, count]) => ({
            label: status,
            value: count,
        }));
    }, [todos]);

    const tagStats = useMemo(() => {
        const stats = {};
        todos.forEach(todo => {
            todo.tags?.forEach(tag => {
                stats[tag] = (stats[tag] || 0) + 1;
            });
        });

        return Object.entries(stats).map(([tag, count]) => ({
            tag,
            count,
        }));
    }, [todos]);

    const timelineData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => ({
            date,
            completed: todos.filter(todo =>
                todo.completedAt?.startsWith(date)).length,
            created: todos.filter(todo =>
                todo.createdAt.startsWith(date)).length,
        }));
    }, [todos]);

    return { statusStats, timelineData, tagStats };
};