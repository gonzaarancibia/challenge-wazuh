import React from 'react';
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
  selectedTags: string[];
  isLoading?: boolean;
}

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