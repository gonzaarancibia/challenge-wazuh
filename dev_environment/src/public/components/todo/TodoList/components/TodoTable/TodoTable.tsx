import React from 'react';
import {
  EuiBasicTable,
  EuiBadge,
  EuiButtonIcon,
  EuiScreenReaderOnly,
  EuiSpacer,
  EuiText
} from '@elastic/eui';
import { Todo } from '../../../../../types/types';
import { TodoTableProps } from '../../../../../types/TodoList.types';

const TodoTable: React.FC<TodoTableProps> = ({
  items,
  loading,
  itemIdToExpandedRowMap,
  toggleDetails,
  onTableChange,
  resultsCount,
  pageIndex,
  pageSize,
  todosLength,
  sortField,
  sortDirection,
  onStatusChange,
  onDelete
}) => {
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
          totalItemCount: todosLength,
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

export default TodoTable;