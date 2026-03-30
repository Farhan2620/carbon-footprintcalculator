import { useMemo, useState, useCallback } from "react";
import {
  createEmptyMix,
  getDerived,
  carbonForMix,
  fmt1,
  fmt1p,
  fmtSteelVol,
  formatCarbon,
} from "../lib/calculatorEngine";

const ADMIX_LABELS = {
  avg: "Average Admixture",
  air: "Air entrainers",
  hard: "Hardening Accelerators",
  plastic: "Plasticisers and Superplasticisers",
  retard: "Retarders",
  setacc: "Set Accelerators",
  waterres: "Water Resisting Admixtures",
};

export default function CalculatorForm() {
  const [mixes, setMixes] = useState(() => [
    createEmptyMix(),
    createEmptyMix(),
    createEmptyMix(),
  ]);
  const [showResults, setShowResults] = useState(false);

  const derived = useMemo(() => mixes.map((m) => getDerived(m)), [mixes]);

  const updateMix = useCallback((idx, patch) => {
    setMixes((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }, []);

  const updateAdmix = useCallback((mixIdx, key, value) => {
    setMixes((prev) => {
      const next = [...prev];
      next[mixIdx] = {
        ...next[mixIdx],
        admix: { ...next[mixIdx].admix, [key]: value },
      };
      return next;
    });
  }, []);

  const handleCalculate = () => {
    setShowResults(true);
    requestAnimationFrame(() => {
      document.getElementById("results-section")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  const mixDisplayName = (idx) => {
    const n = mixes[idx].mixName?.trim();
    return n || `Mix ${idx + 1}`;
  };

  return (
    <article className="calculator-card card-enter" id="calculator">
      <header className="calc-header">
        <h1>Concrete mix inputs</h1>
        <p className="calc-intro">
          Compare up to three mix designs per m³. Panels update as you type.{" "}
          <strong>Calculate</strong> for indicative embodied carbon (kg CO₂e/m³).
        </p>
      </header>

      <section className="form-section">
        <h2 className="section-title">
          <span className="section-num">1</span> Concrete mixture
        </h2>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">a</span> Mixture name
          </div>
          <div className="grid-mixes">
            <div className="grid-corner" aria-hidden="true" />
            <div className="mix-colhead">Mix 1</div>
            <div className="mix-colhead">Mix 2</div>
            <div className="mix-colhead">Mix 3</div>
            <label className="field-label row-label">Enter mix name</label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="text"
                className="input-mix"
                value={mixes[i].mixName}
                onChange={(e) => updateMix(i, { mixName: e.target.value })}
                placeholder={`Mix ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">b</span> Select cement type
          </div>
          <div className="grid-mixes grid-mixes--inputs">
            <span className="sr-only">Mix columns</span>
            <label className="field-label row-label">SELECT cement type</label>
            {[0, 1, 2].map((i) => (
              <select
                key={i}
                className="input-mix"
                value={mixes[i].cementType}
                onChange={(e) => updateMix(i, { cementType: e.target.value })}
              >
                <option value="cem_i">Cement CEM I (Portland)</option>
                <option value="cem_ii">Cement CEM II / blended</option>
                <option value="cem_iii">Cement CEM III (high GGBS)</option>
              </select>
            ))}
          </div>
        </div>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">c</span> Cement quantity
          </div>
          <div className="grid-mixes grid-mixes--inputs">
            <label className="field-label row-label">
              Cement, kg per m<sup>3</sup>
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.1"
                value={mixes[i].cement || ""}
                onChange={(e) =>
                  updateMix(i, { cement: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">d</span> Additional cement replacements
          </div>
          <div className="grid-mixes grid-mixes--stack">
            <label className="field-label row-label">
              GGBS, kg per m<sup>3</sup>
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.1"
                value={mixes[i].ggbs || ""}
                onChange={(e) =>
                  updateMix(i, { ggbs: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
            <label className="field-label row-label">
              Fly ash, kg per m<sup>3</sup>
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.1"
                value={mixes[i].flyAsh || ""}
                onChange={(e) =>
                  updateMix(i, { flyAsh: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
            <label className="field-label row-label">
              Limestone fines, kg per m<sup>3</sup>
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.1"
                value={mixes[i].limestone || ""}
                onChange={(e) =>
                  updateMix(i, { limestone: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <div className="info-panel" aria-live="polite">
          <h3 className="info-panel__title">
            For information: Total cementitious content
          </h3>
          <div className="info-rows">
            <div className="info-row">
              <span>
                Cementitious materials, kg per m<sup>3</sup>
              </span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1(derived[i].cementitious)}
                </span>
              ))}
            </div>
            <div className="info-sub">of which:</div>
            <div className="info-row">
              <span>Cement</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1p(derived[i].pctCement)}
                </span>
              ))}
            </div>
            <div className="info-row">
              <span>GGBS</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1p(derived[i].pctGgbs)}
                </span>
              ))}
            </div>
            <div className="info-row">
              <span>Fly Ash</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1p(derived[i].pctFlyAsh)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">e</span> Water to cement ratio
          </div>
          <div className="grid-mixes grid-mixes--inputs">
            <label className="field-label row-label">
              Water / cementitious ratio (—)
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.01"
                value={mixes[i].wcr || ""}
                onChange={(e) =>
                  updateMix(i, { wcr: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <div className="info-panel">
          <h3 className="info-panel__title">For information: Water content</h3>
          <div className="info-rows">
            <div className="info-row">
              <span>
                Water, kg per m<sup>3</sup>
              </span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1(derived[i].water)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">g</span> Admixtures{" "}
            <span className="unit-hint">
              (kg per m<sup>3</sup> concrete)
            </span>
          </div>
          <div className="admixture-rows">
            {ADMIX_KEYS.map((key) => (
              <div
                key={key}
                className="grid-mixes grid-mixes--inputs admix-row"
              >
                <label className="field-label row-label">
                  {ADMIX_LABELS[key]}
                </label>
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="number"
                    className="input-mix admix-input"
                    min="0"
                    step="0.01"
                    value={mixes[i].admix[key] || ""}
                    onChange={(e) =>
                      updateAdmix(
                        i,
                        key,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="info-panel">
          <h3 className="info-panel__title">
            For information: Total admixtures
          </h3>
          <div className="info-rows">
            <div className="info-row">
              <span>
                Total admixtures, kg per m<sup>3</sup>
              </span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1(derived[i].admixTotal)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">f</span> Aggregates
          </div>
          <div className="grid-mixes grid-mixes--inputs">
            <label className="field-label row-label">
              Total coarse and fine aggregates, kg per m<sup>3</sup> concrete
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.1"
                value={mixes[i].aggregates || ""}
                onChange={(e) =>
                  updateMix(i, { aggregates: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <div className="info-panel">
          <h3 className="info-panel__title">For information: Total materials</h3>
          <div className="info-rows">
            <div className="info-row">
              <span>
                TOTAL material, kg per m<sup>3</sup> concrete
              </span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmt1(derived[i].totalMaterials)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">
          <span className="section-num">2</span> In-situ or precast
        </h2>
        <div className="grid-mixes grid-mixes--inputs">
          <label className="field-label row-label">SELECT concrete type</label>
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              className="input-mix"
              value={mixes[i].concreteType}
              onChange={(e) =>
                updateMix(i, { concreteType: e.target.value })
              }
            >
              <option value="insitu">in-situ</option>
              <option value="precast">precast</option>
            </select>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">
          <span className="section-num">3</span> Steel reinforcement
        </h2>
        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">a</span> Amount of steel
          </div>
          <div className="grid-mixes grid-mixes--inputs">
            <label className="field-label row-label">
              Amount of steel (kg/m<sup>3</sup>)
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="number"
                className="input-mix"
                min="0"
                step="0.1"
                value={mixes[i].steelKg || ""}
                onChange={(e) =>
                  updateMix(i, { steelKg: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <div className="info-panel">
          <h3 className="info-panel__title">For information: Volume of steel</h3>
          <div className="info-rows">
            <div className="info-row">
              <span>
                Volume steel (m<sup>3</sup> per m<sup>3</sup> concrete)
              </span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="out-num">
                  {fmtSteelVol(derived[i].steelVol)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="subsection">
          <div className="subsection-label">
            <span className="badge">b</span> Type of steel
          </div>
          <div className="grid-mixes grid-mixes--inputs">
            <label className="field-label row-label">Select factor</label>
            {[0, 1, 2].map((i) => (
              <select
                key={i}
                className="input-mix"
                value={mixes[i].steelFactor}
                onChange={(e) =>
                  updateMix(i, { steelFactor: e.target.value })
                }
              >
                <option value="eu_recycled">Europe recycled steel</option>
                <option value="eu_virgin">Europe virgin steel</option>
                <option value="global">Global average</option>
              </select>
            ))}
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">
          <span className="section-num">4</span> Transport from concrete producer
          to construction site
        </h2>
        <div className="grid-mixes grid-mixes--inputs">
          <label className="field-label row-label">
            Delivery distance, from concrete producer to construction site — km
          </label>
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="number"
              className="input-mix"
              min="0"
              step="0.1"
              value={mixes[i].deliveryKm || ""}
              onChange={(e) =>
                updateMix(i, { deliveryKm: parseFloat(e.target.value) || 0 })
              }
              placeholder="0"
            />
          ))}
        </div>
      </section>

      <div className="calc-actions">
        <button type="button" className="btn-calculate" onClick={handleCalculate}>
          Calculate
        </button>
      </div>

      {showResults && (
        <section className="results-section" id="results-section">
          <h2 className="results-title">
            Indicative embodied carbon (kg CO₂e per m³ concrete)
          </h2>
          <p className="results-note">
            Illustrative values using generic emission factors; replace with your
            verified data for project use.
          </p>
          <div className="results-grid">
            {[0, 1, 2].map((i) => {
              const c = carbonForMix(mixes[i]);
              const lines = [
                ["Materials (binder, agg., admix.)", c.materials],
                ["Reinforcement steel", c.steel],
                ["Site delivery", c.transport],
              ];
              if (!c.insitu) {
                lines.push(["Precast / factory allowance", c.placement]);
              }
              return (
                <div key={i} className="results-card" data-mix={i}>
                  <h3 className="results-mix-name">{mixDisplayName(i)}</h3>
                  <p className="results-total">
                    <span className="results-value">
                      {formatCarbon(c.total)}
                    </span>{" "}
                    <span className="unit">kg CO₂e/m³</span>
                  </p>
                  <ul className="results-breakdown">
                    {lines.map(([label, val]) => (
                      <li key={label}>
                        {label}: {formatCarbon(val)} kg CO₂e/m³
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
