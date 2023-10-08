import { client } from '@/database';
import { TodoDTO } from '@/interfaces/todos.interface';
import { createTodoQuery, deleteTodoQuery, getTodoByIdQuery, updateTodoQuery } from '@/queries/todos.query';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { Service } from 'typedi';

@Service()
export class TodoService {
  public async findAllTodos(): Promise<TodoDTO[]> {
    const { rows } = await client.query<TodoDTO>('SELECT * FROM todos');
    const todos: TodoDTO[] = rows;

    return todos;
  }

  public async findTodoById(todoId: number): Promise<TodoDTO> {
    const { rows } = await client.query<TodoDTO>(getTodoByIdQuery, [todoId]);

    // if no user found, throw an error
    if (!rows[0]) throw new HttpException(404, "Todo doesn't exist");

    return rows[0];
  }

  public async createTodo(todoData: TodoDTO): Promise<TodoDTO> {
    // add new todo
    await client.query('BEGIN');

    try {
      const createTodoData: TodoDTO = { ...todoData };

      const { rows } = await client.query(createTodoQuery, [
        createTodoData.title,
        createTodoData.description,
        createTodoData.status,
        createTodoData.ownerId,
      ]);
      await client.query('COMMIT');

      return this.findTodoById(rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  public async updateTodo(todoId: number, todoData: TodoDTO): Promise<TodoDTO> {
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
        updatedTodo.ownerId,
        updatedTodo.archivedAt,
        updatedTodo.parentId,
        todoId,
      ]);
      await client.query('COMMIT');

      return await this.findTodoById(todoId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  public async deleteTodo(todoId: number): Promise<TodoDTO> {
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
