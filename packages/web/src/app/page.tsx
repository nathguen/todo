"use client";

import { TodoList } from "@common/types/todos.interface";
import { User } from "@common/types/users.interface";
import {
  Button,
  LinearProgress,
  ListItemButton,
  ListItemText,
  List as MuiList,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { fetchUserByID } from "../integrations";
import AuthProvider from "../providers/auth";
import { ListsProvider, useLists } from "../providers/lists";
import { darkTheme } from "./theme";

function Home() {
  const [user, setUser] = useState<User | null>(null);

  const { todoLists, fetchTodoLists, isLoading } = useLists();

  const router = useRouter();

  const getUser = async () => {
    try {
      // replace with authenticated user
      const user = await fetchUserByID(1);
      setUser(user);
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
    fetchTodoLists();
  }, []);

  const handleSelectList = (list: TodoList) => {
    router.push(`/list/${list.id}`);
  };

  return (
    <main>
      <header className="flex flex-row justify-between p-4 items-center">
        <div className="flex flex-row items-center">
          <RxAvatar className="text-4xl mr-4" />

          <Typography>Nathan Guenther</Typography>
        </div>

        <FaSearch className="text-xl" />
      </header>

      {isLoading && (
        <div className="px-4">
          <LinearProgress />
        </div>
      )}

      {todoLists.map((list) => (
        <MuiList key={list.id}>
          <ListItemButton onClick={() => handleSelectList(list)}>
            <ListItemText>{list.title}</ListItemText>
          </ListItemButton>
        </MuiList>
      ))}

      <div className="fixed bottom-2 left-2 right-2">
        <Button startIcon={<FaPlusCircle />} variant="outlined" fullWidth>
          New List
        </Button>
      </div>
    </main>
  );
}

export default function HomeWrapper() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <ListsProvider>
          <Home />
        </ListsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
