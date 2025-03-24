import React from 'react';
import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiComboBox,
} from '@elastic/eui';
import { TodoSearchProps } from '../../../../../types/TodoList.types';

export const TodoSearch: React.FC<TodoSearchProps> = ({
  searchTerm,
  onSearch,
  onTagFilter,
  selectedTags,
  isLoading,
}) => {
  const predefinedTags = [
    { label: 'urgent' },
    { label: 'bug' },
    { label: 'feature' },
    { label: 'documentation' },
    { label: 'enhancement' },
    { label: 'help wanted' },
    { label: 'question' }
  ];

  const selectedTagOptions = selectedTags.map(tag => ({ label: tag }));

  const handleTagChange = (selected: Array<{ label: string }>) => {
    onTagFilter(selected.map(tag => tag.label));
  };

  return (
    <EuiFlexGroup gutterSize="m">
      <EuiFlexItem>
        <EuiFieldSearch
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          isLoading={isLoading}
          className="custom-search"
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiComboBox
          placeholder="Filter by tags"
          options={predefinedTags}
          selectedOptions={selectedTagOptions}
          onChange={handleTagChange}
          isClearable={true}
          className="custom-search"
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};