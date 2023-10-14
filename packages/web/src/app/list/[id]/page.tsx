"use client";

import { darkTheme } from "@/web/app/theme";
import List from "@/web/components/List";
import { createTodo } from "@/web/integrations";
import AuthProvider, { useAuth } from "@/web/providers/auth";
import { ListsProvider, useLists } from "@/web/providers/lists";
// import { lists } from "@/web/data/lists";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  LinearProgress,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  const listId = Number(id);

  const [taskTitle, setTaskTitle] = useState<string>("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [savingTask, setSavingTask] = useState(false);

  const { isLoading: isLoadingLists, fetchTodoLists, todoLists } = useLists();
  const { user, getUser, isLoading: isLoadingUser } = useAuth();

  const todoList = useMemo(() => {
    return todoLists.find((list) => list.id === listId);
  }, [id, todoLists]);

  const handleAddTask = async () => {
    if (!user) return;

    setSavingTask(true);

    try {
      await createTodo(user.id, listId, taskTitle);
      await fetchTodoLists();
    } catch (error) {
    } finally {
      setSavingTask(false);
      setShowAddTask(false);
    }
  };

  useEffect(() => {
    fetchTodoLists();

    // @TODO replace with authenticated user
    getUser();
  }, []);

  if (isLoadingLists || isLoadingUser || !todoList) {
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
        <Button
          startIcon={<FaPlus />}
          variant="outlined"
          fullWidth
          onClick={() => setShowAddTask(true)}
        >
          Add a Task
        </Button>
      </div>

      <Dialog open={showAddTask} fullWidth>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Add a Task"
            type="text"
            fullWidth
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddTask(false)}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default function ListPageWrapper({ params }: PageProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <ListsProvider>
          <ListPage params={params} />
        </ListsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
