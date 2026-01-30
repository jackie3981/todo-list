import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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

  return (
    <section>
      <h1>Profile</h1>

      <p><strong>Name:</strong> {name}</p>
      <p><strong>Status:</strong> {" "}
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </p>

      <hr />

      <h2>Todo Stats</h2>
      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error &&  (
        <>
          <ul>
            <li>Total todos: {todoStats.total}</li>
            <li>Completed: {todoStats.completed}</li>
            <li>Active: {todoStats.active}</li>
        </ul>

        {todoStats.total > 0 && 
            <p>
              Completion rate:{" "}
              {Math.round(
                (todoStats.completed / todoStats.total) * 100
              )}
              %
            </p>}
        </>
      )}
      
    </section>
  );
}
