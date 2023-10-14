export enum TodoStatus {
  Todo = "todo",
  Done = "done",
  InProgress = "in-progress",
}

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  todo_list_id: number;
  status: TodoStatus;
  create_at: Date;
  updated_at: Date;
  archived_at: Date;
  parent_id: number;
}

export interface TodoList {
  id: number;
  title: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
  todos: TodoItem[];
}
