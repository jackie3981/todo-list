/* eslint-disable react/prop-types */
import { useEffect, useCallback, useReducer } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";
import FilterInput from "../../shared/FilterInput";
import useDebounce from "../../utils/useDebounce";
import { useAuth } from "../../contexts/AuthContext";

import { todoReducer, initialTodoState, TODO_ACTIONS } from "../../reducers/todoReducers";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;
  
  const debouncedFilterTerm = useDebounce(filterTerm, 500);

  // Fetch todos at mount and when token changes
  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

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
        dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: err.message,
            isFilterError: debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc',
          },
        });
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

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: tempTodo });

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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId: tempTodo.id, todo: savedTodo },
      });
    } catch (err) {
      dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: { tempId: tempTodo.id, message: err.message } });
    }
  }

  // Complete Todo with optimistic update
  async function completeTodo(todoId) {
    const originalTodo = todoList.find((t) => t.id === todoId);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id: todoId } });

    try {
      await fetch(`${baseUrl}/tasks/${todoId}`, {
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

      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });

    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { id: todoId, originalTodo, message: err.message },
      });
    }
  }

  // Update Todo with optimistic update
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((t) => t.id === editedTodo.id);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

    try {
      await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
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

      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });

    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { originalTodo, message: err.message },
      }); 
    }
  }

  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error} 
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
            Clear Error
          </button>
        </div>
      )}
      {filterError && (
        <div style={{ color: "orange", marginBottom: "1rem" }}>
          <p>{filterError}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })} style={{ marginRight: "0.5rem" }}>
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
            }}
          >
            Reset Filters
          </button>
        </div>
      )}


      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(sortBy) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection } })}
        onSortDirectionChange={(sortDirection) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection } })}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={(term) => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: term })}
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
