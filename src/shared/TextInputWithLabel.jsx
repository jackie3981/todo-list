/* eslint-disable prettier/prettier */
import PropTypes from "prop-types";

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value,
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={inputRef}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

TextInputWithLabel.propTypes = {
  elementId: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  value: PropTypes.string.isRequired,
};

export default TextInputWithLabel;
