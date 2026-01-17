/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  // Fetch todos al montar y cuando cambia el token
  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError("");

      try {
        const response = await fetch(`${baseUrl}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        setTodoList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  // Add Todo con optimistic update
  async function addTodo(todoTitle) {
    const tempTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList([tempTodo, ...todoList]);

    try {
      const response = await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      const savedTodo = await response.json();
      setTodoList((prev) => prev.map((t) => (t.id === tempTodo.id ? savedTodo : t)));
    } catch (err) {
      setTodoList((prev) => prev.filter((t) => t.id !== tempTodo.id));
      setError(err.message);
    }
  }

  // Complete Todo con optimistic update
  async function completeTodo(todoId) {
    const originalTodo = todoList.find((t) => t.id === todoId);
    if (!originalTodo) return;

    setTodoList((prev) => prev.map((t) => (t.id === todoId ? { ...t, isCompleted: true } : t)));

    try {
      const response = await fetch(`${baseUrl}/tasks/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: true,
          createdTime: originalTodo.createdTime,
        }),
      });

      if (!response.ok) throw new Error("Failed to complete todo");
    } catch (err) {
      // rollback
      setTodoList((prev) => prev.map((t) => (t.id === todoId ? originalTodo : t)));
      setError(err.message);
    }
  }

  // Update Todo con optimistic update
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((t) => t.id === editedTodo.id);
    if (!originalTodo) return;

    setTodoList((prev) => prev.map((t) => (t.id === editedTodo.id ? editedTodo : t)));

    try {
      const response = await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
          createdTime: originalTodo.createdTime,
        }),
      });

      if (!response.ok) throw new Error("Failed to update todo");
    } catch (err) {
      // rollback
      setTodoList((prev) => prev.map((t) => (t.id === editedTodo.id ? originalTodo : t)));
      setError(err.message);
    }
  }

  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error} <button onClick={() => setError("")}>Clear Error</button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  );
}
