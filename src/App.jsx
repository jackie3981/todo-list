import { useState } from "react";
import Header from "./shared/Header";
import TodosPage from "./features/Todos/TodosPage";
import Logon from "./features/Logon";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();
  // const [email, setEmail] = useState("");
  // const [token, setToken] = useState("");

  return (
    <div>
      {/* Header always visible */}
      <Header />

      {/* Conditional rendering */}
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </div>
  );
}

export default App;
