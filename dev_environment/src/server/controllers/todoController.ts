import { RequestHandlerContext } from '../../../../src/core/server';
import { OpenSearchService } from '../services/opensearchService';

export class TodoController {
  private opensearchService: OpenSearchService;

  constructor() {
    this.opensearchService = OpenSearchService.getInstance();
  }

  public async getTodos(context: RequestHandlerContext) {
    const client = this.opensearchService.getClient(context);

    const result = await client.search({
      index: 'todos',
      body: {
        sort: [{ createdAt: { order: 'desc' } }],
      },
    });

    return result.body.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));
  }

  public async createTodo(context: RequestHandlerContext, data: any) {
    const client = context.core.opensearch.client.asCurrentUser;

    const result = await client.index({
      index: 'todos',
      body: {
        ...data,
        status: 'planned',
        createdAt: new Date().toISOString(),
      },
    });

    return {
      id: result.body._id,
      ...data,
      status: 'planned',
      createdAt: new Date().toISOString(),
    };
  }

  public async updateTodoStatus(context: RequestHandlerContext, id: string, status: string) {
    const client = context.core.opensearch.client.asCurrentUser;

    const updateDoc = {
      status: status,
    };

    // Add completedAt when status is completed
    if (status === 'completed') {
      updateDoc.completedAt = new Date().toISOString();
    }
    // Remove completedAt when going back to planned
    else if (status === 'planned') {
      updateDoc.completedAt = null;
    }
    // Add errorAt when status is error
    else if (status === 'error') {
      updateDoc.errorAt = new Date().toISOString();
    }

    await client.update({
      index: 'todos',
      id: id,
      body: {
        doc: updateDoc,
      },
    });

    return true;
  }

  public async deleteTodo(context: RequestHandlerContext, id: string) {
    const client = context.core.opensearch.client.asCurrentUser;

    await client.delete({
      index: 'todos',
      id: id,
    });

    return true;
  }
}