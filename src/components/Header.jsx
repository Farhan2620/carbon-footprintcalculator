export default function Header({ activePage, onNavigate }) {
  return (
    <header className="app-header">
      <div className="app-header__bar">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true" />
          <div>
            <p className="app-header__title">
              Concrete Embodied Carbon Footprint Calculator
            </p>
            <p className="app-header__subtitle">
              Civil engineering · sustainability · LCA
            </p>
          </div>
        </div>

        <nav className="app-nav" aria-label="Main">
          <button
            type="button"
            className={`app-nav__btn ${activePage === "home" ? "is-active" : ""}`}
            onClick={() => onNavigate("home")}
            aria-current={activePage === "home" ? "page" : undefined}
          >
            Home
          </button>
          <button
            type="button"
            className={`app-nav__btn ${activePage === "calculator" ? "is-active" : ""}`}
            onClick={() => onNavigate("calculator")}
            aria-current={activePage === "calculator" ? "page" : undefined}
          >
            Calculator
          </button>
        </nav>
      </div>
      <div className="app-header__strap">
        <span>Embodied carbon estimation for concrete mix designs</span>
      </div>
    </header>
  );
}
