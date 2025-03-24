import { CoreStart } from '../../../../src/core/public';
import { Todo } from './types';

export interface TodoListContainerProps {
    http: CoreStart['http'];
    notifications: CoreStart['notifications'];
}


export interface TodoListProps {
    todos: Todo[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedTags: string[];
    setSelectedTags: (value: string[]) => void;
    handleStatusChange: (id: string, status: Todo['status']) => void;
    handleDelete: (id: string) => void;
}

export interface TodoSearchProps {
    searchTerm: string;
    onSearch: (value: string) => void;
    onTagFilter: (tags: string[]) => void;
    selectedTags: string[];
    isLoading?: boolean;
}

export interface TodoTableProps {
    todos: Todo[];
    loading: boolean;
    onStatusChange: (id: string, status: Todo['status']) => void;
}


export interface TodoTableProps {
    items: Todo[];
    loading: boolean;
    itemIdToExpandedRowMap: Record<string, ReactNode>;
    toggleDetails: (todo: Todo) => void;
    onTableChange: (criteria: Criteria<Todo>) => void;
    resultsCount: ReactNode;
    pageIndex: number;
    pageSize: number;
    todosLength: number;
    sortField: keyof Todo;
    sortDirection: 'asc' | 'desc';
    onStatusChange: (id: string, status: Todo['status']) => void;
    onDelete: (id: string) => void;
}