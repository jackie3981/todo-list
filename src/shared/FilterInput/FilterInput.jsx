import { Search } from "lucide-react";
import styles from "./FilterInput.module.css";

export default function FilterInput({ filterTerm, onFilterChange }) {
  const maxLength = 200;
  const remaining = maxLength - filterTerm.length;
  const isNearLimit = remaining <= 20;

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Search className={styles.icon} size={18} />
        <input
          id="filterInput"
          type="text"
          value={filterTerm}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Search todos..."
          maxLength={maxLength}
          className={styles.input}
          aria-label="Search todos"
        />
        {filterTerm && (
          <button
            onClick={() => onFilterChange("")}
            className={styles.clearBtn}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
      </div>
      {isNearLimit && (
        <span className={styles.charCount}>
          {remaining} characters remaining
        </span>
      )}
    </div>
  );
}