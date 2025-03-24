import React from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { TodoTableContainer as TodoTable } from './components/TodoTable';
import { TodoSearch } from './components/TodoSearch';
import { TodoListProps } from '../../../types/TodoList.types';

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  searchTerm,
  setSearchTerm,
  selectedTags,
  setSelectedTags,
  handleStatusChange,
  handleDelete,
}) => (
  <EuiPanel>
    <EuiFlexGroup alignItems="baseline" justifyContent="spaceBetween">
      <EuiFlexItem>
        <EuiTitle size="s">
          <h2>Todo List</h2>
        </EuiTitle>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <TodoSearch
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onTagFilter={setSelectedTags}
          selectedTags={selectedTags}
          isLoading={loading}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
    <EuiSpacer />
    <TodoTable
      todos={todos}
      loading={loading}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
    />
  </EuiPanel>
);

export default TodoList;