import { StateCreator } from 'zustand';

export interface FilterSlice {
  searchTerm: string;
  selectedTags: string[];
  setSearchTerm: (term: string) => void;
  setSelectedTags: (tags: string[]) => void;
}

export const createFilterSlice: StateCreator<FilterSlice> = (set) => ({
  searchTerm: '',
  selectedTags: [],
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedTags: (selectedTags) => set({ selectedTags }),
});