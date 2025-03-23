import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { TodoPluginSetup, TodoPluginStart } from './types';
import { defineRoutes } from './routes';

export class TodoPlugin
  implements Plugin<TodoPluginSetup, TodoPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup) {
    this.logger.debug('todo_plugin: Setup');
    // Esperar a que OpenSearch esté disponible
    await core.opensearch.waitUntilReady();

    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    // Initialize OpenSearch index if it doesn't exist
    await this.initializeIndex(core);

    return {};
  }

  private async initializeIndex(core: CoreSetup) {
    try {
      const client = core.opensearch.client.asCurrentUser;

      const indexExists = await client.indices.exists({ index: 'todos' });

      if (!indexExists.body) {
        await client.indices.create({
          index: 'todos',
          body: {
            mappings: {
              properties: {
                title: { type: 'text' },
                status: { type: 'keyword' },
                createdAt: { type: 'date' },
                completedAt: { type: 'date' },
                errorAt: { type: 'date' },
                assignee: { type: 'keyword' },
                description: { type: 'text' },
                tags: { type: 'keyword' }
              }
            }
          }
        });
        this.logger.debug('todo_plugin: Created todos index');
      }
    } catch (error) {
      this.logger.error('Failed to initialize todos index:', error);
      throw error; // Re-throw to ensure setup fails if index creation fails
    }
  }

  public start(core: CoreStart) {
    this.logger.debug('todo_plugin: Started');
    return {};
  }

  public stop() { }
}
