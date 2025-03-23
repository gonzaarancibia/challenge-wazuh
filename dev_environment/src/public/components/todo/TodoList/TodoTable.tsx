import React, { useState, ReactNode, useMemo } from 'react';
import {
  EuiBasicTable,
  EuiBadge,
  EuiButtonIcon,
  EuiToolTip,
  Criteria,
  Comparators,
  EuiDescriptionList,
  EuiScreenReaderOnly,
  EuiSpacer,
  EuiText
} from '@elastic/eui';
import { Todo } from '../../../hooks/useTodos';

interface TodoTableProps {
  todos: Todo[];
  loading: boolean;
  onStatusChange: (id: string, status: Todo['status']) => void;
}

export const TodoTable: React.FC<TodoTableProps> = ({ todos, loading, onStatusChange, onDelete}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<Record<string, ReactNode>>({});

  const columns = [
    {
      field: 'title',
      name: 'Title',
      sortable: true,
      width: '30%',
    },
    {
      field: 'status',
      name: 'Status',
      sortable: true,
      render: (status: Todo['status']) => (
        <EuiBadge color={status === 'completed' ? 'success' : status === 'error' ? 'danger' : 'primary'}>
          {status}
        </EuiBadge>
      ),
    },
    {
      field: 'assignee',
      name: 'Assignee',
      sortable: true,
    },
    {
      field: 'createdAt',
      name: 'Created',
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      field: 'tags',
      name: 'Tags',
      render: (tags: string[] = []) => (
        <div>
          {tags.map((tag) => (
            <EuiBadge 
              key={tag}
              color="hollow"
              style={{ marginRight: '4px' }}
            >
              {tag}
            </EuiBadge>
          ))}
        </div>
      ),
    },
    {
      name: 'Actions',
      actions: [
        {
          name: 'Complete',
          description: 'Mark as complete',
          icon: 'checkInCircleFilled',
          color: 'success',
          type: 'icon',
          enabled: (item: Todo) => item.status!== 'completed',
          onClick: (item: Todo) => onStatusChange(item.id, 'completed'),
        },
        {
          name: 'Planned',
          description: (item: Todo) => 
            item.status === 'completed' ? 'Mark as planned' : 'Mark as complete',
          icon: 'doubleArrowRight',
          color: 'success',
          type: 'icon',
          enabled: (item: Todo) => item.status!== 'planned',
          onClick: (item: Todo) => onStatusChange(item.id, 'planned'),
        },
        {
          name: 'Error',
          description: 'Mark as executed with error',
          icon: 'alert',
          color: 'danger',
          type: 'icon',
          enabled: (item: Todo) => item.status !== 'error',
          onClick: (item: Todo) => onStatusChange(item.id, 'error'),
        },
        {
          name: 'Delete',
          description: 'Delete this todo',
          icon: 'trash',
          color: 'danger',
          type: 'icon',
          onClick: (item: Todo) => onDelete(item.id),
          showOnHover: true
        },
      ],
    },
    {
      align: 'right',
      width: '40px',
      isExpander: true,
      name: (
        <EuiScreenReaderOnly>
          <span>Expand row</span>
        </EuiScreenReaderOnly>
      ),
      render: (item: Todo) => (
        <EuiButtonIcon
          onClick={() => toggleDetails(item)}
          aria-label={itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
          iconType={itemIdToExpandedRowMap[item.id] ? 'arrowDown' : 'arrowRight'}
        />
      ),
    },
  ];

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

    // // Add this pagination logic
    // const getPaginatedItems = () => {
    //   const startIndex = pageIndex * pageSize;
    //   const endIndex = startIndex + pageSize;
    //   return todos.slice(startIndex, endIndex);
    // };

    
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
    <>
    <EuiSpacer size="s" />
      <EuiText size="xs">
        Showing {resultsCount} <strong>Todo</strong>
      </EuiText>
      <EuiSpacer size="s" />
    <EuiBasicTable
      items={items}
      columns={columns}
      loading={loading}
      itemId="id"
      itemIdToExpandedRowMap={itemIdToExpandedRowMap}
      pagination={{
        pageIndex,
        pageSize,
        totalItemCount: todos.length,
        pageSizeOptions: [5, 10],
      }}
      sorting={{
        sort: {
          field: sortField,
          direction: sortDirection,
        },
      }}
      onChange={onTableChange}
    />
    </>
  );
};