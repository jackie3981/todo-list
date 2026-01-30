import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

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
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>Welcome, {name}</span>
      <button onClick={handleLogout} disabled={isLoggingOff}>
        {isLoggingOff ? "Logging out..." : "Log Out"}
      </button>
      {error && <span style={{ color: "orange" }}>{error}</span>}
    </div>
  );
}