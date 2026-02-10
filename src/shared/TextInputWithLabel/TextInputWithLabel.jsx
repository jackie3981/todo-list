import PropTypes from "prop-types";
import styles from "./TextInputWithLabel.module.css";

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value,
  placeholder = "",
  error = "",
  maxLength = 200,
}) {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 20;

  return (
    <div className={styles.container}>
      {labelText && (
        <label htmlFor={elementId} className={styles.label}>
          {labelText}
        </label>
      )}
      <input
        type="text"
        id={elementId}
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? styles.inputError : styles.input}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${elementId}-error` : undefined}
      />
      {error && (
        <span id={`${elementId}-error`} className={styles.error}>
          {error}
        </span>
      )}
      {isNearLimit && !error && (
        <span className={styles.charCount}>
          {remaining} characters remaining
        </span>
      )}
    </div>
  );
}

TextInputWithLabel.propTypes = {
  elementId: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  maxLength: PropTypes.number,
};

export default TextInputWithLabel;