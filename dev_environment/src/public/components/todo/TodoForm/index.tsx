import React, { useState } from 'react';
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTextArea,
  EuiButton,
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiComboBox,
} from '@elastic/eui';
import { CoreStart } from '../../../../../../src/core/public';
import { useTodos } from '../../../hooks/useTodos';

interface TodoFormProps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}

export const TodoForm: React.FC<TodoFormProps> = ({ http, notifications }) => {
  const { createTodo } = useTodos(http);
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
      await createTodo({
        title,
        description,
        assignee,
        status: 'planned',
        tags: selectedTags.map(tag => tag.label)
      });
      
      // Reset form
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
    <EuiPanel>
      <EuiTitle size="s">
        <h2>Create Todo</h2>
      </EuiTitle>
      <EuiSpacer />
      <EuiForm component="form" onSubmit={handleSubmit}>
        <EuiFormRow label="Title">
          <EuiFieldText
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </EuiFormRow>

        <EuiFormRow label="Description">
          <EuiTextArea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </EuiFormRow>

        <EuiFormRow label="Assignee">
          <EuiFieldText
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
          />
        </EuiFormRow>

        <EuiFormRow label="Tags">
          <EuiComboBox
            selectedOptions={selectedTags}
            onChange={setSelectedTags}
            onCreateOption={(searchValue) => {
              setSelectedTags([...selectedTags, { label: searchValue }]);
            }}
            options={predefinedTags}
            isClearable={true}
            isCreatable={true}
            placeholder="Select or create tags"
          />
        </EuiFormRow>

        <EuiSpacer />
        <EuiButton 
          type="submit" 
          fill
          isDisabled={!title.trim()}
        >
          Create Todo
        </EuiButton>
      </EuiForm>
    </EuiPanel>
  );
};