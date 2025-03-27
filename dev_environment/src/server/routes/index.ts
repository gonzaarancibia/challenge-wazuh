import { schema } from '@osd/config-schema';
import { IRouter } from '../../../../src/core/server';
import { TodoController } from '../controllers/todoController';

export function defineRoutes(router: IRouter) {
  const todoController = new TodoController();

  // Get all todos
  router.get(
    {
      path: '/api/todo_plugin/todos',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const todos = await todoController.getTodos(context);
        return response.ok({
          body: { todos },
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
      try {
        const todo = await todoController.createTodo(context, request.body);
        return response.ok({
          body: todo
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
      try {
        await todoController.updateTodoStatus(
          context,
          request.params.id,
          request.body.status
        );
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
      try {
        await todoController.deleteTodo(context, request.params.id);
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
