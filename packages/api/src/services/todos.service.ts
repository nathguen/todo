import { client } from '@/database';
import { createTodoQuery, deleteTodoQuery, getTodoByIdQuery, getTodosByTodoListIdQuery, updateTodoQuery } from '@/queries/todos.query';
import { TodoItem, TodoList, User } from '@common/types';
import { HttpException } from '@exceptions/httpException';
import { Service } from 'typedi';

@Service()
export class TodoService {
  public async findAllTodos(): Promise<TodoItem[]> {
    const { rows } = await client.query<TodoItem>('SELECT * FROM todos');
    const todos: TodoItem[] = rows;

    return todos;
  }

  public async findTodoListsByUserId(userId: number): Promise<TodoList[]> {
    const { rows: todoListRows } = await client.query<TodoList>('SELECT * FROM todo_lists WHERE owner_id = $1', [userId]);
    const todoLists: TodoList[] = todoListRows;

    const todoListsWithTodos = await Promise.all(
      todoLists.map(async todoList => {
        const { rows: todoRows } = await client.query<TodoItem>(getTodosByTodoListIdQuery, [todoList.id]);
        const todos: TodoItem[] = todoRows;

        return {
          ...todoList,
          todos,
        };
      }),
    );

    return todoListsWithTodos;
  }

  public async findTodoById(todoId: number): Promise<TodoItem> {
    const { rows } = await client.query<TodoItem>(getTodoByIdQuery, [todoId]);

    // if no user found, throw an error
    if (!rows[0]) throw new HttpException(404, "Todo doesn't exist");

    return rows[0];
  }

  public async createTodo(todoData: TodoItem): Promise<TodoItem> {
    // add new todo
    await client.query('BEGIN');

    try {
      const createTodoData: TodoItem = { ...todoData };

      const { rows } = await client.query(createTodoQuery, [
        createTodoData.title,
        createTodoData.description,
        createTodoData.status,
        createTodoData.owner_id,
        createTodoData.todo_list_id,
      ]);
      console.log({ rows });
      await client.query('COMMIT');

      return this.findTodoById(rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  public async updateTodo(todoId: number, todoData: TodoItem): Promise<TodoItem> {
    // check for existing todo
    const { rows } = await client.query<User>('SELECT * FROM users WHERE id = $1', [todoId]);
    if (!rows[0]) throw new HttpException(409, "Todo doesn't exist");

    const storedTodo = await this.findTodoById(todoId);
    const updatedTodo = { ...storedTodo, ...todoData };

    // update todo
    await client.query('BEGIN');

    try {
      await client.query(updateTodoQuery, [
        updatedTodo.title,
        updatedTodo.description,
        updatedTodo.status,
        updatedTodo.owner_id,
        updatedTodo.archived_at,
        updatedTodo.parent_id,
        todoId,
      ]);
      await client.query('COMMIT');

      return await this.findTodoById(todoId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  public async deleteTodo(todoId: number): Promise<TodoItem> {
    const todo = await this.findTodoById(todoId);

    await client.query('BEGIN');

    try {
      await client.query(deleteTodoQuery, [todoId]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    return todo;
  }
}
