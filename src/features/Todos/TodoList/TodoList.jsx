import TodoListItem from "./TodoListItem";
import { useMemo } from "react";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion, statusFilter="all" }) {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;

    switch (statusFilter) {
    case "completed":
      filteredTodos = todoList.filter((t) => t.isCompleted);
      break;
    case "active":
      filteredTodos = todoList.filter((t) => !t.isCompleted);
      break;
    default:
      filteredTodos = todoList;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case "completed":
        return "No completed todos.";
      case "active":
        return "No active todos.";
      default:
        return "Add todos to get started.";
    }
  }

  return (
    <ul>
      {filteredTodoList.todos.length === 0 ? (
        <li>{getEmptyMessage()}</li>
      ) : (
        <ul>
          {filteredTodoList.todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </ul>
  );
}

export default TodoList;