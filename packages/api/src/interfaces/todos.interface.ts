export interface Todo {
  id?: number;
  title: string;
  description: string;
  statusId: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  ownerId: number;
  parentId?: number;
}

export enum TodoStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface TodoDTO {
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  ownerId: number;
  parentId?: number;
}
