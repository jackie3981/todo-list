/* eslint-disable react/prop-types */

export default function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="sortBy">Sort by:</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
      >
        <option value="creationDate">Creation Date</option>
        <option value="title">Title</option>
      </select>
      <label htmlFor="sortDirection">Order:</label>
      <select
        id="sortDirection"
        value={sortDirection}
        onChange={(e) => onSortDirectionChange(e.target.value)}
        style={{ marginLeft: "0.5rem" }}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}
