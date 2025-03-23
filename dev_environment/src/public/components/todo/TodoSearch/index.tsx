import React, { useState } from 'react';
import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiComboBox,
} from '@elastic/eui';

interface TodoSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onTagFilter: (tags: string[]) => void;
  isLoading?: boolean;
}

export const TodoSearch: React.FC<TodoSearchProps> = ({
  searchTerm,
  onSearch,
  onTagFilter,
  isLoading,
}) => {
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

  const handleTagChange = (selected: Array<{ label: string }>) => {
    setSelectedTags(selected);
    onTagFilter(selected.map(tag => tag.label));
  };

  return (
    <EuiFlexGroup gutterSize="s">
      <EuiFlexItem>
        <EuiFieldSearch
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          isLoading={isLoading}
          fullWidth
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiComboBox
          placeholder="Filter by tags"
          options={predefinedTags}
          selectedOptions={selectedTags}
          onChange={handleTagChange}
          isClearable={true}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};