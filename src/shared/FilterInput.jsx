/* eslint-disable react/prop-types */

export default function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="filterInput">Search todos:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
      />
    </div>
  );
}
