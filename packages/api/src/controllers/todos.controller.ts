import { TodoService } from '@/services/todos.service';
import { TodoItem } from '@common/types';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class TodoController {
  public todo = Container.get(TodoService);

  public getTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllTodosData: TodoItem[] = await this.todo.findAllTodos();

      res.status(200).json({ data: findAllTodosData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTodoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = Number(req.params.id);
      const findOneTodoData: TodoItem = await this.todo.findTodoById(todoId);

      res.status(200).json({ data: findOneTodoData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getTodoListsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findTodoListsData = await this.todo.findTodoListsByUserId(userId);

      res.status(200).json({ data: findTodoListsData, message: 'findListsByUserId' });
    } catch (error) {
      next(error);
    }
  };

  public createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoData: TodoItem = req.body;
      const createTodoData: TodoItem = await this.todo.createTodo(todoData);

      res.status(201).json({ data: createTodoData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = Number(req.params.id);
      const todoData: TodoItem = req.body;
      const updateTodoData: TodoItem = await this.todo.updateTodo(todoId, todoData);

      res.status(200).json({ data: updateTodoData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = Number(req.params.id);
      const deleteTodoData: TodoItem = await this.todo.deleteTodo(todoId);

      res.status(200).json({ data: deleteTodoData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
