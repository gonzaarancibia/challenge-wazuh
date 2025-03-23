import { schema } from '@osd/config-schema';
import { IRouter } from '../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  // Get all todos
  router.get(
    {
      path: '/api/todo_plugin/todos',
      validate: false,
    },
    async (context, request, response) => {
      const client = context.core.opensearch.client.asCurrentUser;
      try {
        const result = await client.search({
          index: 'todos',
          body: {
            sort: [{ createdAt: { order: 'desc' } }],
          },
        });

        return response.ok({
          body: {
            todos: result.body.hits.hits.map((hit: any) => ({
              id: hit._id,
              ...hit._source,
            })),
          },
        });
      } catch (error) {
        return response.custom({
          statusCode: 500,
          body: { message: 'Failed to fetch todos' },
        });
      }
    }
  );


  // Create todo
  router.post(
    {
      path: '/api/todo_plugin/todos',
      validate: {
        body: schema.object({
          title: schema.string(),
          status: schema.string(),
          assignee: schema.maybe(schema.string()),
          description: schema.maybe(schema.string()),
          tags: schema.maybe(schema.arrayOf(schema.string())),
        }),
      },
    },
    async (context, request, response) => {
      const client = context.core.opensearch.client.asCurrentUser;
      try {
        const result = await client.index({
          index: 'todos',
          body: {
            ...request.body,
            status: 'planned',
            createdAt: new Date().toISOString(),
          },
        });

        return response.ok({
          body: {
            id: result.body._id,
            ...request.body,
            status: 'planned',
            createdAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        return response.custom({
          statusCode: 500,
          body: { message: 'Failed to create todo' },
        });
      }
    }
  );

  // Update todo status
  router.put(
    {
      path: '/api/todo_plugin/todos/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
        body: schema.object({
          status: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      const client = context.core.opensearch.client.asCurrentUser;
      try {
        const updateDoc = {
          status: request.body.status,
        };

        // Add completedAt when status is completed
        if (request.body.status === 'completed') {
          updateDoc.completedAt = new Date().toISOString();
        }
        // Remove completedAt when going back to planned
        else if (request.body.status === 'planned') {
          updateDoc.completedAt = null;
        }
        // Add errorAt when status is error
        else if (request.body.status === 'error') {
          updateDoc.errorAt = new Date().toISOString();
        }

        await client.update({
          index: 'todos',
          id: request.params.id,
          body: {
            doc: updateDoc,
          },
        });

        return response.ok({
          body: { success: true },
        });
      } catch (error) {
        return response.custom({
          statusCode: 500,
          body: { message: 'Failed to update todo' },
        });
      }
    }
  );

  // GET Search todos
  router.get(
    {
      path: '/api/todo_plugin/todos/search',
      validate: {
        query: schema.object({
          q: schema.maybe(schema.string()),
          tags: schema.maybe(schema.arrayOf(schema.string())),
        }),
      },
    },
    async (context, request, response) => {
      const { q, tags } = request.query;
      const client = context.core.opensearch.client.asCurrentUser;

      try {
        const must = [];

        if (q) {
          must.push({
            multi_match: {
              query: q,
              fields: ['title', 'description'],
              type: 'phrase_prefix', // This enables prefix matching
              max_expansions: 50,    // Limit the number of terms to match
            },
          });
        }

        if (tags && tags.length > 0) {
          must.push({
            terms: {
              tags: tags,
            },
          });
        }

        const result = await client.search({
          index: 'todos',
          body: {
            query: {
              bool: {
                must: must.length > 0 ? must : [{ match_all: {} }],
              },
            },
            sort: [{ _score: { order: 'desc' } }, { createdAt: { order: 'desc' } }],
          },
        });

        return response.ok({
          body: {
            todos: result.body.hits.hits.map((hit: any) => ({
              id: hit._id,
              ...hit._source,
            })),
          },
        });
      } catch (error) {
        return response.custom({
          statusCode: 500,
          body: { message: 'Failed to search todos' },
        });
      }
    }
  );

  // DELETE todo
  router.delete(
    {
      path: '/api/todo_plugin/todos/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      const { id } = request.params;
      const client = context.core.opensearch.client.asCurrentUser;

      try {
        await client.delete({
          index: 'todos',
          id: id,
        });

        return response.ok({
          body: { success: true },
        });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: {
            message: 'Failed to delete todo',
            error: error,
          },
        });
      }
    }
  );

}
