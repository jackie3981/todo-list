import { Info, CheckCircle, Code } from "lucide-react";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Info className={styles.headerIcon} size={40} />
        <h1 className={styles.title}>About This App</h1>
        <p className={styles.subtitle}>
          A modern Todo application built as a learning project
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <CheckCircle className={styles.cardIcon} size={24} />
            <h2 className={styles.cardTitle}>Features</h2>
          </div>
          <ul className={styles.list}>
            <li>Authentication system</li>
            <li>Protected routes</li>
            <li>Todo CRUD operations</li>
            <li>Sorting and filtering</li>
            <li>Optimistic UI updates</li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Code className={styles.cardIcon} size={24} />
            <h2 className={styles.cardTitle}>Technologies</h2>
          </div>
          <ul className={styles.list}>
            <li>React ^19.1.1</li>
            <li>React Router ^7.13.0</li>
            <li>Vite ^7.1.7</li>
            <li>DOMPurify ^3.3.1</li>
            <li>Tailwind CSS ^4.1.18</li>
            <li>Lucide React Icons ^0.563.0</li>
          </ul>
        </div>
      </div>
    </div>
  );
}