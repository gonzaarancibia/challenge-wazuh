import React, { useState } from 'react';
import { useStore } from '../../../store';
import TodoForm from './TodoForm';
import { TodoFormContainerProps } from '../../../types/TodoForm.types';

const TodoFormContainer: React.FC<TodoFormContainerProps> = ({ http, notifications }) => {
  const { createTodo } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [selectedTags, setSelectedTags] = useState<Array<{ label: string }>>([]);

  const predefinedTags = [
    { label: 'urgent' },
    { label: 'bug' },
    { label: 'feature' },
    { label: 'documentation' },
    { label: 'enhancement' },
    { label: 'help wanted' },
    { label: 'question' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTodo(http, {
        title,
        description,
        assignee,
        status: 'planned',
        tags: selectedTags.length > 0 ? [selectedTags[0].label] : []
      });
      
      setTitle('');
      setDescription('');
      setAssignee('');
      setSelectedTags([]);
            
      notifications.toasts.addSuccess('Todo created successfully');
    } catch (error) {
      notifications.toasts.addError('Failed to create todo');
    }
  };

  return (
    <TodoForm
      title={title}
      description={description}
      assignee={assignee}
      selectedTags={selectedTags}
      predefinedTags={predefinedTags}
      setTitle={setTitle}
      setDescription={setDescription}
      setAssignee={setAssignee}
      setSelectedTags={setSelectedTags}
      handleSubmit={handleSubmit}
    />
  );
};

export default TodoFormContainer;