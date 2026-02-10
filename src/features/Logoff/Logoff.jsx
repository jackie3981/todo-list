import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import styles from "./Logoff.module.css";

export default function Logoff() {
  const { name, logout } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOff(true);
    setError("");
    
    const result = await logout();
    
    if (result.success) {
      navigate("/login");
      return;
    } 
    setError(result.error);
       
    setIsLoggingOff(false);
  };

  return (
    <div className={styles.container}>
      <span className={styles.welcome}>Welcome, {name}</span>
      <button 
        onClick={handleLogout} 
        disabled={isLoggingOff}
        className={styles.logoutBtn}
      >
        <LogOut size={18} />
        {isLoggingOff ? "Logging out..." : "Log Out"}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}