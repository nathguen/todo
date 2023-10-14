import { TodoList } from "@common/types/todos.interface";
import React, { createContext, useContext, useState } from "react";
import { fetchTodoListsByUserId } from "../integrations";

interface ListsContextValue {
  fetchTodoLists: () => Promise<TodoList[]>;
  todoLists: TodoList[];
  isLoading: boolean;
  error: Error | null;
}

const ListsContext = createContext<ListsContextValue>({
  fetchTodoLists: async () => [],
  todoLists: [],
  isLoading: false,
  error: null,
});

export const useLists = () => useContext(ListsContext);

export const ListsProvider = ({ children }: { children: React.ReactNode }) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [list, setList] = useState<TodoList | null>(null);

  const getTodoLists = async () => {
    setIsLoading(true);
    let todoLists: TodoList[] = [];

    try {
      // replace with authenticated user
      todoLists = await fetchTodoListsByUserId(1);
      setTodoLists(todoLists);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setIsLoading(false);
      return todoLists;
    }
  };

  return (
    <ListsContext.Provider
      value={{
        todoLists,
        isLoading,
        error,
        fetchTodoLists: getTodoLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};
