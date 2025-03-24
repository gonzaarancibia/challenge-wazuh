import React, { useEffect } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { TodoTable } from './TodoTable';
import { TodoSearch } from '../TodoSearch';
import { useStore } from '../../../store';
import { CoreStart } from '../../../../../../src/core/public';
import { Todo } from '../../../types/todo';

interface TodoListProps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}

export const TodoList: React.FC<TodoListProps> = ({ http, notifications }) => {
  const { 
    filteredTodos,
    loading, 
    fetchTodos, 
    updateTodoStatus,
    deleteTodo,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags 
  } = useStore();

  useEffect(() => {
    fetchTodos(http);
  }, [fetchTodos, http]);

  const handleStatusChange = async (id: string, status: Todo['status']) => {
    try {
      await updateTodoStatus(http, id, status);
      notifications.toasts.addSuccess(`Todo status updated to ${status}`);
    } catch (error) {
      notifications.toasts.addError('Failed to update todo status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(http, id);
      notifications.toasts.addSuccess('Todo deleted successfully');
    } catch (error) {
      notifications.toasts.addError(error.body?.message || 'Failed to delete todo');
    }
  };

  return (
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
        todos={filteredTodos}
        loading={loading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </EuiPanel>
  );
};