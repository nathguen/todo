import { TodoItem, TodoList, TodoStatus } from "@common/types/todos.interface";
import axios from "axios";

export async function fetchTodos() {
  const response = await axios.get("/todos");
  return await response.data();
}

export async function fetchTodoListsByUserId(userId: number) {
  const response = await axios.get<TodoList[]>("/todo-lists/users/" + userId);

  return response.data;
}

export async function createTodo(
  userId: number,
  todoListId: number,
  title: string,
  description?: string
) {
  const response = await axios.post<TodoItem>("/todos", {
    title,
    description,
    status: TodoStatus.Todo,
    owner_id: userId,
    todo_list_id: todoListId,
  });

  return response.data;
}
