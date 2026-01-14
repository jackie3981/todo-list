import { useState } from "react";
import Header from "./shared/Header";
import TodosPage from "./features/Todos/TodosPage";
import Logon from "./features/Logon";

import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  return (
    <div>
      {/* Header siempre visible */}
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail} />

      {/* Renderizado condicional */}
      {token ? <TodosPage token={token} /> : <Logon onSetEmail={setEmail} onSetToken={setToken} />}
    </div>
  );
}

export default App;
