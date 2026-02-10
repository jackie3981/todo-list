import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";
import { sanitizeEmail } from "../../utils/sanitize";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to /todos
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError("");

    const sanitizedEmail = sanitizeEmail(email);
    const result = await login(sanitizedEmail, password);

    if (!result.success) {
      setAuthError(result.error);
      setIsLoggingOn(false);
    }
    // If the login is successful, the useEffect will redirect the user
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <LogIn className={styles.icon} size={32} />
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to manage your todos</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {authError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{authError}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggingOn}
              placeholder="you@example.com"
              maxLength={200}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingOn}
              placeholder="Enter your password"
              maxLength={200}
              className={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoggingOn}
            className={styles.submitBtn}
          >
            {isLoggingOn ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Log In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}