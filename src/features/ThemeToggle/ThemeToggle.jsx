import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`${styles.slider} ${isDark ? styles.sliderDark : ''}`}>
        {isDark ? (
          <Moon className={styles.icon} size={14} />
        ) : (
          <Sun className={styles.icon} size={14} />
        )}
      </span>
    </button>
  );
}