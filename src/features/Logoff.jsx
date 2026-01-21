import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Logoff() {
  const { email, logout } = useAuth();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOff(true);
    setError("");
    
    const result = await logout();
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsLoggingOff(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>Welcome, {email}</span>
      <button onClick={handleLogout} disabled={isLoggingOff}>
        {isLoggingOff ? "Logging out..." : "Log Out"}
      </button>
      {error && <span style={{ color: "orange" }}>{error}</span>}
    </div>
  );
}