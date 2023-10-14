import { TodoList } from "@common/types/todos.interface";
import axios from "axios";

export async function fetchTodos() {
  const response = await axios.get("/todos");
  return await response.data();
}

export async function fetchTodoListsByUserId(userId: number) {
  const response = await axios.get<TodoList[]>("/todo-lists/users/" + userId);

  return response.data;
}
