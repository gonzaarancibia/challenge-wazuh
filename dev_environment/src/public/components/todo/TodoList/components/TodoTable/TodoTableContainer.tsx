import React, { useState, useMemo, ReactNode } from 'react';
import { Todo } from '../../../../../types/types';
import TodoTable from './TodoTable';
import { TodoTableProps } from '../../../../../types/TodoList.types';
import { Criteria, Comparators, EuiDescriptionList } from '@elastic/eui';

const TodoTableContainer: React.FC<TodoTableProps> = ({ todos, loading, onStatusChange, onDelete }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<Record<string, ReactNode>>({});

  const toggleDetails = (todo: Todo) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[todo.id]) {
      delete itemIdToExpandedRowMapValues[todo.id];
    } else {
      const listItems = [
        {
          title: 'Description',
          description: todo.description || 'No description available',
        },
        {
          title: 'Created',
          description: new Date(todo.createdAt).toLocaleString(),
        },
        {
          title: 'Status',
          description: todo.status === "completed" ? "Completed at: " + new Date(todo.completedAt).toLocaleString() : todo.status,
        },
      ];
      itemIdToExpandedRowMapValues[todo.id] = (
        <EuiDescriptionList listItems={listItems} />
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const onTableChange = ({ page = {}, sort = {} }: Criteria<Todo>) => {
    const { index: pageIndex, size: pageSize } = page;
    const { field: sortField, direction: sortDirection } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  const findTodos = (
    todos: Todo[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Todo,
    sortDirection: 'asc' | 'desc'
  ) => {
    let items = [...todos];

    if (sortField) {
      items = items.sort(
        Comparators.property(sortField, Comparators.default(sortDirection))
      );
    }

    const startIndex = pageIndex * pageSize;
    return items.slice(startIndex, Math.min(startIndex + pageSize, todos.length));
  };

  const items = useMemo(
    () => findTodos(todos, pageIndex, pageSize, sortField as keyof Todo, sortDirection as 'asc' | 'desc'),
    [todos, pageIndex, pageSize, sortField, sortDirection]
  );

  const resultsCount =
    pageSize === 0 ? (
      <strong>All</strong>
    ) : (
      <>
        <strong>
          {pageSize * pageIndex + 1}-{pageSize * pageIndex + pageSize}
        </strong>{' '}
        of {todos.length}
      </>
    );

  return (
    <TodoTable
      items={items}
      loading={loading}
      itemIdToExpandedRowMap={itemIdToExpandedRowMap}
      toggleDetails={toggleDetails}
      onTableChange={onTableChange}
      resultsCount={resultsCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      todosLength={todos.length}
      sortField={sortField}
      sortDirection={sortDirection}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
    />
  );
};

export default TodoTableContainer;