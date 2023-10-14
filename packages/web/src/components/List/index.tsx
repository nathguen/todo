"use client";

import {
  Checkbox,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List as MuiList,
} from "@mui/material";
// search icon
import { TodoItem, TodoList } from "@common/types/todos.interface";
import { useMemo, useState } from "react";

interface ListTodoProps {
  todo: TodoItem;
}

const ListTodo = ({ todo }: ListTodoProps) => {
  const [status, setStatus] = useState(todo.status);

  const handleToggle = () => {};

  return (
    <ListItemButton>
      <ListItemIcon>
        <Checkbox />
      </ListItemIcon>
      <ListItemText primary={todo.title} />
    </ListItemButton>
  );
};

interface ListProps {
  list: TodoList;
}

export default function List({ list }: ListProps) {
  const sortedTodos = useMemo(() => {
    return list.todos.sort((a, b) => Number(a.status) - Number(b.status));
  }, [list.todos]);

  return (
    <MuiList>
      {sortedTodos.map((todo) => (
        <ListTodo key={todo.id} todo={todo} />
      ))}
    </MuiList>
  );
}
