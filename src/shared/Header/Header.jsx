import ThemeToggle from "../../features/ThemeToggle/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import Logoff from "../../features/Logoff/Logoff";
import Navigation from "../Navigation/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Todo List</h1>
        <Navigation />
        <div className={styles.actions}>
          <ThemeToggle />
          {isAuthenticated && <Logoff />}
        </div>
      </div>
    </header>
  );
}