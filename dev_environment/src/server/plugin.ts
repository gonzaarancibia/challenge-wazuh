import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { TodoPluginSetup, TodoPluginStart } from './types';
import { defineRoutes } from './routes';
import { OpenSearchService } from './services/opensearchService';

export class TodoPlugin
  implements Plugin<TodoPluginSetup, TodoPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup) {
    this.logger.debug('todo_plugin: Setup');

    try {
      // Initialize OpenSearch service
      const opensearchService = OpenSearchService.getInstance();
      opensearchService.initialize(core);

      const router = core.http.createRouter();

      // Register server side APIs
      defineRoutes(router);

      return {};
    } catch (error) {
      this.logger.error('Failed to setup plugin:', error);
      throw error;
    }
  }

  public start(core: CoreStart) {
    this.logger.debug('todo_plugin: Started');
    return {};
  }

  public stop() { }
}
