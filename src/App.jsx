import { Route, Routes } from "react-router";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TodosPage from "./pages/TodosPage"; 
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import RequireAuth from "./routes/RequireAuth";
import Header from "./shared/Header";

import "./App.css";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/todos"
          element={
            <RequireAuth>             
              <TodosPage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
