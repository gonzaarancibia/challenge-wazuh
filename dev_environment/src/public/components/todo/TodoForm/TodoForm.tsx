import React from 'react';
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
import { TodoFormProps } from '../../../types/TodoForm.types';

const TodoForm: React.FC<TodoFormProps> = ({
  title,
  description,
  assignee,
  selectedTags,
  predefinedTags,
  setTitle,
  setDescription,
  setAssignee,
  setSelectedTags,
  handleSubmit,
}) => (
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
          onChange={(selected) => setSelectedTags(selected.slice(-1))}
          options={predefinedTags}
          isClearable={true}
          isCreatable={false}
          placeholder="Select a tag"
          singleSelection={{ asPlainText: true }}
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

export default TodoForm;