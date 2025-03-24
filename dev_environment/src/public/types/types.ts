import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

export interface CustomPluginPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPluginPluginStart { }

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface Todo {
  id: string;
  title: string;
  status: 'planned' | 'completed' | 'error';
  createdAt: string;
  completedAt?: string;
  errorAt?: string;
  assignee?: string;
  description?: string;
  tags?: string[];
}