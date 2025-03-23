import React, { useEffect } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
} from '@elastic/eui';
import { TodoTable } from './TodoTable';
import { TodoSearch } from '../TodoSearch';
import { useTodos } from '../../../hooks/useTodos';
import { CoreStart } from '../../../../../../src/core/public';

interface TodoListProps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}

export const TodoList: React.FC<TodoListProps> = ({ http, notifications }) => {
  const { 
    todos, 
    loading, 
    fetchTodos, 
    updateTodoStatus,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags 
  } = useTodos(http);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleStatusChange = async (id: string, status: 'completed' | 'planned' | 'error') => {
    try {
      await updateTodoStatus(id, status);
      notifications.toasts.addSuccess(`Todo status updated to ${status}`);
    } catch (error) {
      notifications.toasts.addError('Failed to update todo status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await http.delete(`/api/todo_plugin/todos/${id}`);
      notifications.toasts.addSuccess('Todo deleted successfully');
      // Refresh the todo list
      fetchTodos();
    } catch (error) {
      notifications.toasts.addError(error.body?.message || 'Failed to delete todo');
    }
  };

  return (
    <EuiPanel>
      <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
        <EuiFlexItem>
          <EuiTitle size="s">
            <h2>Todo List</h2>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            onClick={() => fetchTodos()}
            isLoading={loading}
            iconType="refresh"
          >
            Refresh
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <TodoSearch 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onTagFilter={setSelectedTags}
        isLoading={loading}
      />
      <EuiSpacer />
      <TodoTable
        todos={todos}
        loading={loading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </EuiPanel>
  );
};