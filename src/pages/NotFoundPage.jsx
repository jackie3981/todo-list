import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>Page not found</p>

      <nav>
        <Link to="/">Home</Link>{" | "}
        <Link to="/todos">Todos</Link>
      </nav>
    </section>
  );
}
