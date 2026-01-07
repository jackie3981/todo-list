import { useState } from "react";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => 
      todo.id === editedTodo.id 
        ? {...editedTodo} 
        : todo
    );
    setTodoList(updatedTodos);
  }

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList([newTodo, ...todoList]);
  }

  function completeTodo(todoId) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === todoId) {
        return {...todo, isCompleted: true}
        // If the checked checkbox didn't disappear, I would use this variant instead of the current one.
        // return { ...todo, isCompleted: !todo.isCompleted }; 
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;
