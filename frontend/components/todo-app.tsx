"use client";

import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { cn } from "@/lib/utils";
import type { TodoItem } from "@/types/todo";
import TodoItemComponent from "./todo-item";
import TodoForm from "./todo-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ListTodo } from "lucide-react";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
      updatedAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export default function TodoApp() {
  const [activeTab, setActiveTab] = useState("active");
  const { loading, error, data } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const todos: TodoItem[] = data?.todos || [];

  const addTodo = async (text: string) => {
    try {
      await createTodo({
        variables: { title: text },
      });
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t: TodoItem) => t.id === id);
    if (!todo) return;

    try {
      await updateTodo({
        variables: {
          id,
          completed: !todo.completed,
        },
      });
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo({
        variables: { id },
      });
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const filteredTodos = todos.filter((todo: TodoItem) => {
    if (activeTab === "active") return !todo.completed;
    if (activeTab === "completed") return todo.completed;
    return true;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-950 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <span>To Done</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Organize your tasks with elegance
          </p>
        </header>

        <TodoForm onAddTodo={addTodo} />

        <Tabs defaultValue="active" className="mt-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8">
                <ListTodo className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="mt-4 text-slate-500 dark:text-slate-400">
                  {activeTab === "all"
                    ? "Your to-do list is empty"
                    : activeTab === "active"
                    ? "No active tasks"
                    : "No completed tasks"}
                </p>
              </div>
            ) : (
              <ul className="space-y-3" aria-label="To-do list">
                {filteredTodos.map((todo: TodoItem) => (
                  <li key={todo.id}>
                    <TodoItemComponent
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={handleDeleteTodo}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

