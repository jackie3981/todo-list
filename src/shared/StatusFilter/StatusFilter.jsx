import { useSearchParams } from "react-router";
import styles from "./StatusFilter.module.css";

export default function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (status) => {
    const nextParams = new URLSearchParams(searchParams);

    if (status === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", status);
    }

    setSearchParams(nextParams);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="statusFilter" className={styles.label}>
        Show:
      </label>
      <select
        id="statusFilter"
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={styles.select}
      >
        <option value="all">All Todos</option>
        <option value="active">Active Todos</option>
        <option value="completed">Completed Todos</option>
      </select>
    </div>
  );
}