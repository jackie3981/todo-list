import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { User, CheckCircle2, Circle, TrendingUp, AlertCircle } from "lucide-react";
import styles from "./ProfilePage.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function ProfilePage() {
  const { name, token, isAuthenticated } = useAuth();
 
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;

      try {
        setError("");
        setLoading(true);

        const response = await fetch(`${baseUrl}/tasks/`, {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const todos = await response.json();
        
        const total = todos.length;
        const completed = todos.filter(todo => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchStats();
    }
  }, [token]);

  const completionRate = todoStats.total > 0 
    ? Math.round((todoStats.completed / todoStats.total) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <User className={styles.headerIcon} size={40} />
        <h1 className={styles.title}>Profile</h1>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Name:</span>
          <span className={styles.infoValue}>{name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status:</span>
          <span className={isAuthenticated ? styles.statusActive : styles.statusInactive}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <h2 className={styles.sectionTitle}>Todo Statistics</h2>

      {loading && (
        <div className={styles.loadingState}>
          <span className={styles.spinner}></span>
          <p>Loading statistics...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Circle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Todos</p>
              <p className={styles.statValue}>{todoStats.total}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconSuccess}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Completed</p>
              <p className={styles.statValue}>{todoStats.completed}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWarning}>
              <Circle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Active</p>
              <p className={styles.statValue}>{todoStats.active}</p>
            </div>
          </div>

          {todoStats.total > 0 && (
            <div className={styles.statCard}>
              <div className={styles.statIconInfo}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Completion Rate</p>
                <p className={styles.statValue}>{completionRate}%</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}