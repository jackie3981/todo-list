import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from "./TodoForm.module.css";
import { sanitizeText } from "../../../utils/sanitize";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const inputRef = useRef(null);

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (workingTodoTitle.trim()) {
      const sanitizedTitle = sanitizeText(workingTodoTitle);
      onAddTodo(sanitizedTitle);
      setWorkingTodoTitle("");
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Add New Todo"
        inputRef={inputRef}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        placeholder="What needs to be done?"
      />

      <button 
        type="submit" 
        disabled={!isValidTodoTitle(workingTodoTitle)}
        className={styles.submitBtn}
      >
        <Plus size={18} />
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;