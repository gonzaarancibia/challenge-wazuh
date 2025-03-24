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
import { useStore } from '../../../store';

interface TodoFormProps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}

export const TodoForm: React.FC<TodoFormProps> = ({ http, notifications }) => {
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

        <EuiFormRow label="Tag">
          <EuiComboBox
            selectedOptions={selectedTags}
            onChange={(selected) => setSelectedTags(selected.slice(-1))} // Solo mantiene el último tag seleccionado
            options={predefinedTags}
            isClearable={true}
            isCreatable={false} // Removemos la opción de crear tags
            placeholder="Select a tag"
            singleSelection={{ asPlainText: true }} // Fuerza selección única
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