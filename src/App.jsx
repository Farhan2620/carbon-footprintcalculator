import { useState, useCallback } from "react";
import Header from "./components/Header";
import SiteFooter from "./components/SiteFooter";
import CookieBanner from "./components/CookieBanner";
import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";

export default function App() {
  const [page, setPage] = useState("home");

  const navigate = useCallback((next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="app-shell">
      <Header activePage={page} onNavigate={navigate} />

      <main className="app-main">
        <div
          key={page}
          className="app-page"
          role="main"
          aria-label={page === "home" ? "Information" : "Calculator"}
        >
          {page === "home" ? <HomePage /> : <CalculatorPage />}
        </div>
      </main>

      <SiteFooter />
      <CookieBanner />
    </div>
  );
}
