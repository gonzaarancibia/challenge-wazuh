import React, { useEffect } from 'react';
import { useStore } from '../../../store';
import TodoList from './TodoList';
import { TodoListContainerProps } from '../../../types/TodoList.types';
import { Todo } from '../../../types/types';



const TodoListContainer: React.FC<TodoListContainerProps> = ({ http, notifications }) => {
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
    <TodoList
      todos={filteredTodos}
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedTags={selectedTags}
      setSelectedTags={setSelectedTags}
      handleStatusChange={handleStatusChange}
      handleDelete={handleDelete}
    />
  );
};

export default TodoListContainer;