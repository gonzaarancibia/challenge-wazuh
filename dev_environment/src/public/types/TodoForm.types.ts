import React from 'react';
import { CoreStart } from '../../../../src/core/public';

export interface TodoFormProps {
    title: string;
    description: string;
    assignee: string;
    selectedTags: Array<{ label: string }>;
    predefinedTags: Array<{ label: string }>;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setAssignee: (value: string) => void;
    setSelectedTags: (value: Array<{ label: string }>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}


export interface TodoFormContainerProps {
    http: CoreStart['http'];
    notifications: CoreStart['notifications'];
}

