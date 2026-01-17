/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";
import FilterInput from "../../shared/FilterInput";
import useDebounce from "../../utils/useDebounce";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [sortBy, setSortBy] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const [filterTerm, setFilterTerm] = useState("");

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const [dataVersion, setDataVersion] = useState(0);

  const [filterError, setFilterError] = useState("");

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const invaliddateCache = useCallback(() => {
    console.log("Invalidating memo cache after todo mutation");
    setDataVersion((v) => v + 1);
  }, []);

  // Fetch todos at mount and when token changes
  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError("");

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);
        const response = await fetch(`${baseUrl}/tasks?${params}`, {
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

        setFilterError("");
      } catch (err) {
        if (debouncedFilterTerm || sortBy !== "creationDate" || sortDirection !== "desc") {
          setFilterError(`Error filtering/sorting todos: ${err.message}`);
        } else {
          setError(err.message);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  // Add Todo with optimistic update
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
      invaliddateCache();
    } catch (err) {
      setTodoList((prev) => prev.filter((t) => t.id !== tempTodo.id));
      setError(err.message);
    }
  }

  // Complete Todo with optimistic update
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
      invaliddateCache();
    } catch (err) {
      // rollback
      setTodoList((prev) => prev.map((t) => (t.id === todoId ? originalTodo : t)));
      setError(err.message);
    }
  }

  // Update Todo with optimistic update
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
      invaliddateCache();
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
      {filterError && (
        <div style={{ color: "orange", marginBottom: "1rem" }}>
          <p>{filterError}</p>
          <button onClick={() => setFilterError("")} style={{ marginRight: "0.5rem" }}>
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              setFilterTerm("");
              setSortBy("creationDate");
              setSortDirection("desc");
              setFilterError("");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}


      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        //setSortBy={setSortBy}
        sortDirection={sortDirection}
        //setSortDirection={setSortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />

    </div>
  );
}
