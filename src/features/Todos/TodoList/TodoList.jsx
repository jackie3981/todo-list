import TodoListItem from "./TodoListItem";
import { useMemo } from "react";
import { Inbox } from "lucide-react";
import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, onDeleteTodo, dataVersion, statusFilter="all" }) {
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

  if (filteredTodoList.todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Inbox className={styles.emptyIcon} size={48} />
        <p className={styles.emptyText}>{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {filteredTodoList.todos.map((todo, index) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
          isEven={index % 2 === 0}
        />
      ))}
    </ul>
  );
}

export default TodoList;