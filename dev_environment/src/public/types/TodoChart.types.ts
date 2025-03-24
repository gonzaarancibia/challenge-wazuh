// Define the interfaces for the props
export interface StatusStat {
    label: string;
    value: number;
}

export interface TimelineData {
    date: string;
    completed: number;
    created: number;
}

export interface TagStat {
    tag: string;
    count: number;
}

export interface TodoChartProps {
    loading: boolean;
    statusStats: StatusStat[];
    timelineData: TimelineData[];
    tagStats: TagStat[];
}
