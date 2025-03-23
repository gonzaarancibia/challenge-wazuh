import { PluginInitializerContext } from '../../../src/core/server';
import { TodoPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new TodoPlugin(initializerContext);
}

export { TodoPluginSetup, TodoPluginStart } from './types';
