export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__block">
          <strong className="site-footer__label">Project</strong>
          <p className="site-footer__text">
            Concrete Embodied Carbon Footprint Calculator — educational tool for
            estimating cradle-to-site emissions from material inputs per m³.
          </p>
        </div>
        <div className="site-footer__block">
          <strong className="site-footer__label">Disclaimer</strong>
          <p className="site-footer__text">
            Results are indicative only. Use supplier EPDs and verified factors
            for compliance and design.
          </p>
        </div>
        <div className="site-footer__block site-footer__block--meta">
          <span className="site-footer__copy">
            © {new Date().getFullYear()} Concrete Embodied Carbon Calculator
          </span>
        </div>
      </div>
    </footer>
  );
}
