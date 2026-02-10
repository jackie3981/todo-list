import { Link } from "react-router";
import { AlertTriangle, Home, ListTodo } from "lucide-react";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <AlertTriangle className={styles.icon} size={64} />
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Page not found</p>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.linkPrimary}>
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/todos" className={styles.linkSecondary}>
            <ListTodo size={18} />
            View Todos
          </Link>
        </div>
      </div>
    </div>
  );
}