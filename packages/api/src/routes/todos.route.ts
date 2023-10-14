import { TodoController } from '@/controllers/todos.controller';
import { CreateTodoDto, UpdateTodoDto } from '@/dtos/todos.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { Router } from 'express';

export class TodoRoute implements Routes {
  public path = '/todos';
  public router = Router();
  public todo = new TodoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.todo.getTodos);
    this.router.get(`${this.path}/:id(\\d+)`, this.todo.getTodoById);
    this.router.get(`/todo-lists/users/:id(\\d+)`, this.todo.getTodoListsByUserId);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateTodoDto, true), this.todo.createTodo);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(UpdateTodoDto, true), this.todo.updateTodo);
    this.router.delete(`${this.path}/:id(\\d+)`, this.todo.deleteTodo);
  }
}
