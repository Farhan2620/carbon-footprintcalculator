function IconLeaf() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22c4.5-3.5 8-8 8-14a8 8 0 00-16 0c0 6 3.5 10.5 8 14z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 22c-2-4-4-8-4-12a8 8 0 0116 0c0 4-2 8-4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 18V9l4.5 3L18 10v8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18h6M10 22h4M12 2a6 6 0 00-3 11.2V16h6v-2.8A6 6 0 0012 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4M12 17h.01M10.3 3.2L2.6 17a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.2a2 2 0 00-3.4 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero card-enter">
        <h1 className="home-hero__title">
          Concrete Embodied Carbon Footprint Calculator
        </h1>
        <p className="home-hero__lead">
          Concrete plays a critical role in modern construction, but it is also
          one of the largest contributors to embodied carbon in infrastructure
          and building projects. Reducing its environmental impact is essential
          for achieving sustainable development goals.
        </p>
      </section>

      <section className="home-article card-enter">
        <h2 className="home-section-title">Understanding embodied carbon</h2>
        <p>
          Embodied carbon refers to the total greenhouse gas emissions generated
          during the extraction, production, transportation, and placement of
          construction materials. In concrete, the primary source of these
          emissions is Ordinary Portland Cement (OPC), which has a high carbon
          intensity due to energy-intensive manufacturing processes.
        </p>
        <p>
          To reduce emissions, alternative cementitious materials such as Ground
          Granulated Blast Furnace Slag (GGBS) and Fly Ash (also known as
          Pulverized Fuel Ash – PFA) are widely used. These materials partially
          replace cement in concrete mixes and significantly lower the overall
          carbon footprint while maintaining structural performance.
        </p>
      </section>

      <section className="home-article card-enter">
        <h2 className="home-section-title">About the calculator</h2>
        <div className="home-panel">
          <div className="home-panel__icon">
            <IconLayers />
          </div>
          <div>
            <p className="home-panel__text">
              This tool is designed to estimate the embodied carbon of concrete
              mixtures based on material composition per cubic meter. Users can
              input quantities of cement, supplementary cementitious materials,
              aggregates, water, and admixtures to calculate total emissions.
            </p>
          </div>
        </div>
      </section>

      <section className="home-article card-enter">
        <h2 className="home-section-title">Key features</h2>
        <div className="home-features">
          <ul className="home-features__list">
            <li>
              <span className="home-features__icon-wrap">
                <IconChart />
              </span>
              <span>Supports analysis of multiple concrete mix designs</span>
            </li>
            <li>
              <span className="home-features__icon-wrap">
                <IconLeaf />
              </span>
              <span>Provides quick estimation of embodied carbon per m³</span>
            </li>
            <li>
              <span className="home-features__icon-wrap">
                <IconLayers />
              </span>
              <span>Helps compare traditional vs low-carbon concrete options</span>
            </li>
            <li>
              <span className="home-features__icon-wrap">
                <IconBook />
              </span>
              <span>
                Useful for students, engineers, and sustainability professionals
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="home-article card-enter">
        <h2 className="home-section-title">Methodology</h2>
        <div className="home-panel home-panel--accent">
          <div className="home-panel__icon">
            <IconBook />
          </div>
          <p className="home-panel__text">
            The calculator uses standard emission factors derived from recognized
            environmental databases and research studies. It considers material
            production and transportation impacts (cradle-to-site boundary).
          </p>
        </div>
      </section>

      <section className="home-article card-enter">
        <h2 className="home-section-title">Low-carbon concrete strategies</h2>
        <ul className="home-list">
          <li>Reduce cement content using GGBS or Fly Ash</li>
          <li>Optimize mix design for performance and efficiency</li>
          <li>Source materials locally to reduce transport emissions</li>
          <li>Use recycled aggregates where possible</li>
        </ul>
      </section>

      <section className="home-article card-enter">
        <h2 className="home-section-title">Usage instructions</h2>
        <ol className="home-steps">
          <li>
            <span className="home-steps__num">1</span>
            Enter material quantities per cubic meter
          </li>
          <li>
            <span className="home-steps__num">2</span>
            Click &quot;Calculate&quot;
          </li>
          <li>
            <span className="home-steps__num">3</span>
            View total embodied carbon results
          </li>
          <li>
            <span className="home-steps__num">4</span>
            Compare different mix scenarios
          </li>
        </ol>
      </section>

      <section className="home-note card-enter">
        <div className="home-note__icon">
          <IconAlert />
        </div>
        <div>
          <h2 className="home-note__title">Note</h2>
          <p className="home-note__text">
            For more accurate results, use actual mix design data provided by
            suppliers or laboratory testing reports.
          </p>
        </div>
      </section>

      <section className="home-cta card-enter">
        <div className="home-cta__icon">
          <IconLightbulb />
        </div>
        <div>
          <h2 className="home-cta__title">Ready to estimate emissions?</h2>
          <p className="home-cta__text">
            Open the Calculator tab to enter mix data and compare up to three
            scenarios side by side.
          </p>
        </div>
      </section>
    </div>
  );
}
