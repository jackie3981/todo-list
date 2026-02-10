import { X, Check, Edit2, Trash } from "lucide-react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle";
import { sanitizeText } from "../../../utils/sanitize";
import styles from "./TodoListItem.module.css";


function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo, isEven }) {
  const { isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit } = useEditableTitle(todo.title);

  const handleUpdate = (event) => {
    event.preventDefault();

    if (!isEditing) return;

    const finalTitle = finishEdit();
    const sanitizedTitle = sanitizeText(finalTitle);

    onUpdateTodo({
      ...todo,
      title: sanitizedTitle,
    });
  };

  return (
    <li className={isEven ? styles.itemEven : styles.itemOdd}>
      {isEditing ? (
        <form onSubmit={handleUpdate} className={styles.editForm}>
          <TextInputWithLabel
            elementId={`todo-${todo.id}`}
            labelText=""
            value={workingTitle}
            onChange={(event) => updateTitle(event.target.value)}
            placeholder="Enter todo title..."
          />

          <div className={styles.editActions}>
            <button 
              type="button" 
              onClick={cancelEdit}
              className={styles.btnCancel}
              aria-label="Cancel editing"
            >
              <X size={18} />
              Cancel
            </button>

            <button 
              type="button" 
              onClick={handleUpdate} 
              disabled={!isValidTodoTitle(workingTitle)}
              className={styles.btnUpdate}
              aria-label="Update todo"
            >
              <Check size={18} />
              Update
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.viewMode}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
              className={styles.checkbox}
            />
          </label>

          <span 
            className={todo.isCompleted ? styles.titleCompleted : styles.title}
          >
            {todo.title}
          </span>

          <button
            onClick={startEditing}
            className={styles.btnEdit}
            aria-label="Edit todo"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDeleteTodo(todo.id)}
            className={styles.btnDelete}
            aria-label="Delete todo"
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </li>
  );
}

export default TodoListItem;