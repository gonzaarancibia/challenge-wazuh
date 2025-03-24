import { PluginInitializerContext } from '../../../src/core/server';
import { TodoPlugin } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new TodoPlugin(initializerContext);
}

export { TodoPluginSetup, TodoPluginStart } from './types';
