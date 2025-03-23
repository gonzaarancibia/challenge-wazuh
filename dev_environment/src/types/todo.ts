export interface Todo {
    id: string;
    title: string;
    status: 'planned' | 'completed' | 'error';
    createdAt: string;
    completedAt?: string;
    errorAt?: string;
    assignee?: string;
    description?: string;
    tags?: string[];
}