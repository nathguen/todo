"use client";

import { darkTheme } from "@/web/app/theme";
import List from "@/web/components/List";
import { ListsProvider, useLists } from "@/web/providers/lists";
// import { lists } from "@/web/data/lists";
import {
  AppBar,
  Button,
  IconButton,
  LinearProgress,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import { HiDotsHorizontal, HiUsers } from "react-icons/hi";

interface PageProps {
  params: {
    id: string;
  };
}

function ListPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();

  const { isLoading, fetchTodoLists, todoLists } = useLists();

  const todoList = useMemo(() => {
    return todoLists.find((list) => list.id === Number(id));
  }, [id, todoLists]);

  useEffect(() => {
    fetchTodoLists();
  }, []);

  console.log(todoList);

  if (isLoading || !todoList) {
    return (
      <main className="px-4">
        <LinearProgress />
      </main>
    );
  }

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <div className="flex flex-1 flex-row justify-between">
            <Button onClick={() => router.back()} startIcon={<FiChevronLeft />}>
              {todoList.title}
            </Button>

            <div>
              <IconButton size="medium" edge="start" color="inherit">
                <HiUsers />
              </IconButton>
              <IconButton
                size="medium"
                edge="end"
                color="inherit"
                aria-label="menu"
              >
                <HiDotsHorizontal />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <div className="px-6 pt-2">
        <Typography variant="h2">{todoList.title}</Typography>
      </div>

      {todoList.todos.length > 0 && <List list={todoList} />}

      <div className="fixed bottom-2 left-2 right-2">
        <Button startIcon={<FaPlus />} variant="outlined" fullWidth>
          Add a Task
        </Button>
      </div>
    </main>
  );
}

export default function ListPageWrapper({ params }: PageProps) {
  return (
    <ListsProvider>
      <ThemeProvider theme={darkTheme}>
        <ListPage params={params} />
      </ThemeProvider>
    </ListsProvider>
  );
}
