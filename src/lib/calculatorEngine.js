/** Pure calculation helpers — same factors as legacy app.js */

export const STEEL_DENSITY = 7850;

export const FACTORS = {
  cement: { cem_i: 0.85, cem_ii: 0.72, cem_iii: 0.55 },
  ggbs: 0.05,
  flyAsh: 0.05,
  limestone: 0.08,
  admix: 2.8,
  aggregates: 0.0045,
  steel: { eu_recycled: 0.42, eu_virgin: 1.25, global: 0.9 },
  transportPerTonneKm: 0.082,
  precastExtra: 14,
};

export const ADMIX_KEYS = [
  "avg",
  "air",
  "hard",
  "plastic",
  "retard",
  "setacc",
  "waterres",
];

export function createEmptyAdmix() {
  return Object.fromEntries(ADMIX_KEYS.map((k) => [k, 0]));
}

export function createEmptyMix() {
  return {
    mixName: "",
    cementType: "cem_i",
    cement: 0,
    ggbs: 0,
    flyAsh: 0,
    limestone: 0,
    wcr: 0,
    aggregates: 0,
    admix: createEmptyAdmix(),
    concreteType: "insitu",
    steelKg: 0,
    steelFactor: "eu_recycled",
    deliveryKm: 0,
  };
}

function pct(part, total) {
  if (total <= 0) return 0;
  return (100 * part) / total;
}

export function sumAdmix(admix) {
  return ADMIX_KEYS.reduce((t, k) => t + (Number(admix[k]) || 0), 0);
}

export function getDerived(mix) {
  const cement = Number(mix.cement) || 0;
  const ggbs = Number(mix.ggbs) || 0;
  const flyAsh = Number(mix.flyAsh) || 0;
  const limestone = Number(mix.limestone) || 0;
  const cementitious = cement + ggbs + flyAsh + limestone;
  const wcr = Number(mix.wcr) || 0;
  const water = cementitious > 0 ? wcr * cementitious : 0;
  const admixTotal = sumAdmix(mix.admix || {});
  const aggregates = Number(mix.aggregates) || 0;
  const totalMaterials = cementitious + water + admixTotal + aggregates;
  const steelKg = Number(mix.steelKg) || 0;
  const steelVol = steelKg > 0 ? steelKg / STEEL_DENSITY : 0;

  return {
    cementitious,
    pctCement: pct(cement, cementitious),
    pctGgbs: pct(ggbs, cementitious),
    pctFlyAsh: pct(flyAsh, cementitious),
    water,
    admixTotal,
    totalMaterials,
    steelVol,
  };
}

export function carbonForMix(mix) {
  const cement = Number(mix.cement) || 0;
  const ggbs = Number(mix.ggbs) || 0;
  const flyAsh = Number(mix.flyAsh) || 0;
  const limestone = Number(mix.limestone) || 0;
  const admixTotal = sumAdmix(mix.admix || {});
  const aggregates = Number(mix.aggregates) || 0;
  const steelKg = Number(mix.steelKg) || 0;
  const deliveryKm = Number(mix.deliveryKm) || 0;
  const ct = mix.cementType || "cem_i";
  const sf = mix.steelFactor || "global";
  const insitu = mix.concreteType !== "precast";

  const fc = FACTORS.cement[ct] || FACTORS.cement.cem_i;
  const materials =
    cement * fc +
    ggbs * FACTORS.ggbs +
    flyAsh * FACTORS.flyAsh +
    limestone * FACTORS.limestone +
    admixTotal * FACTORS.admix +
    aggregates * FACTORS.aggregates;

  const steelF = FACTORS.steel[sf] || FACTORS.steel.global;
  const steelCO2 = steelKg * steelF;

  const d = getDerived(mix);
  const tonnes = d.totalMaterials / 1000;
  const transportCO2 = tonnes * deliveryKm * FACTORS.transportPerTonneKm;
  const placement = insitu ? 0 : FACTORS.precastExtra;

  const total = materials + steelCO2 + transportCO2 + placement;

  return {
    total,
    materials,
    steel: steelCO2,
    transport: transportCO2,
    placement,
    insitu,
  };
}

export function fmt1(x) {
  return (Math.round(x * 10) / 10).toFixed(1);
}

export function fmt1p(x) {
  return fmt1(x) + "%";
}

export function fmtSteelVol(x) {
  if (x <= 0) return "0.0";
  if (x < 0.0001) return x.toExponential(2);
  return (Math.round(x * 1e6) / 1e6).toFixed(6);
}

export function formatCarbon(n) {
  if (!Number.isFinite(n) || n < 0) return "0";
  return n >= 100
    ? Math.round(n).toString()
    : (Math.round(n * 10) / 10).toFixed(1);
}
