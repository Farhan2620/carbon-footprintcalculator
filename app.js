(function () {
  "use strict";

  var MIX_COUNT = 3;
  var STEEL_DENSITY = 7850;

  var FACTORS = {
    cement: { cem_i: 0.85, cem_ii: 0.72, cem_iii: 0.55 },
    ggbs: 0.05,
    flyAsh: 0.05,
    limestone: 0.08,
    admix: 2.8,
    aggregates: 0.0045,
    steel: { eu_recycled: 0.42, eu_virgin: 1.25, global: 0.9 },
    transportPerTonneKm: 0.082,
    precastExtra: 14
  };

  function num(el) {
    if (!el) return 0;
    var v = parseFloat(String(el.value).replace(",", "."), 10);
    return Number.isFinite(v) ? v : 0;
  }

  function getMixField(mix, name) {
    var el = document.querySelector(
      '[data-field="' + name + '"][data-mix="' + mix + '"]'
    );
    return el;
  }

  function sumAdmixtures(mix) {
    var inputs = document.querySelectorAll(
      ".admix-input[data-mix=\"" + mix + "\"]"
    );
    var t = 0;
    for (var i = 0; i < inputs.length; i++) {
      t += num(inputs[i]);
    }
    return t;
  }

  function getState(mix) {
    var cement = num(getMixField(mix, "cement"));
    var ggbs = num(getMixField(mix, "ggbs"));
    var flyAsh = num(getMixField(mix, "flyAsh"));
    var limestone = num(getMixField(mix, "limestone"));
    var cementitious = cement + ggbs + flyAsh + limestone;
    var wcr = num(getMixField(mix, "wcr"));
    var water = cementitious > 0 ? wcr * cementitious : 0;
    var admixTotal = sumAdmixtures(mix);
    var aggregates = num(getMixField(mix, "aggregates"));
    var totalMaterials = cementitious + water + admixTotal + aggregates;
    var steelKg = num(getMixField(mix, "steelKg"));
    var steelVol = steelKg > 0 ? steelKg / STEEL_DENSITY : 0;
    var cementType = getMixField(mix, "cementType");
    var ct = cementType ? cementType.value : "cem_i";
    var steelFactor = getMixField(mix, "steelFactor");
    var sf = steelFactor ? steelFactor.value : "eu_recycled";
    var concreteType = getMixField(mix, "concreteType");
    var insitu = concreteType ? concreteType.value === "insitu" : true;
    var deliveryKm = num(getMixField(mix, "deliveryKm"));

    return {
      cement: cement,
      ggbs: ggbs,
      flyAsh: flyAsh,
      limestone: limestone,
      cementitious: cementitious,
      wcr: wcr,
      water: water,
      admixTotal: admixTotal,
      aggregates: aggregates,
      totalMaterials: totalMaterials,
      steelKg: steelKg,
      steelVol: steelVol,
      cementType: ct,
      steelFactor: sf,
      insitu: insitu,
      deliveryKm: deliveryKm
    };
  }

  function pct(part, total) {
    if (total <= 0) return 0;
    return (100 * part) / total;
  }

  function fmt1(x) {
    return (Math.round(x * 10) / 10).toFixed(1);
  }

  function fmt1p(x) {
    return fmt1(x) + "%";
  }

  function fmtSteelVol(x) {
    if (x <= 0) return "0.0";
    if (x < 0.0001) return x.toExponential(2);
    return (Math.round(x * 1e6) / 1e6).toFixed(6);
  }

  function setOut(name, mix, text, flash) {
    var el = document.querySelector(
      '[data-out="' + name + '"][data-mix="' + mix + '"]'
    );
    if (!el) return;
    if (el.textContent !== text) {
      el.textContent = text;
      if (flash) {
        el.classList.remove("updated");
        void el.offsetWidth;
        el.classList.add("updated");
      }
    }
  }

  function updateIntermediate() {
    for (var m = 0; m < MIX_COUNT; m++) {
      var s = getState(m);
      setOut("cementitious", m, fmt1(s.cementitious), true);
      setOut("pctCement", m, fmt1p(pct(s.cement, s.cementitious)), true);
      setOut("pctGgbs", m, fmt1p(pct(s.ggbs, s.cementitious)), true);
      setOut("pctFlyAsh", m, fmt1p(pct(s.flyAsh, s.cementitious)), true);
      setOut("water", m, fmt1(s.water), true);
      setOut("admixTotal", m, fmt1(s.admixTotal), true);
      setOut("totalMaterials", m, fmt1(s.totalMaterials), true);
      setOut("steelVol", m, fmtSteelVol(s.steelVol), true);
    }
    updateMixNames();
  }

  function updateMixNames() {
    for (var m = 0; m < MIX_COUNT; m++) {
      var inp = getMixField(m, "mixName");
      var name =
        inp && inp.value.trim()
          ? inp.value.trim()
          : "Mix " + (m + 1);
      var card = document.querySelector('.results-card[data-mix="' + m + '"]');
      if (card) {
        var h = card.querySelector("[data-result-mix-name]");
        if (h) h.textContent = name;
      }
    }
  }

  function carbonForMix(mix) {
    var s = getState(mix);
    var fc = FACTORS.cement[s.cementType] || FACTORS.cement.cem_i;
    var materials =
      s.cement * fc +
      s.ggbs * FACTORS.ggbs +
      s.flyAsh * FACTORS.flyAsh +
      s.limestone * FACTORS.limestone +
      s.admixTotal * FACTORS.admix +
      s.aggregates * FACTORS.aggregates;

    var steelF = FACTORS.steel[s.steelFactor] || FACTORS.steel.global;
    var steelCO2 = s.steelKg * steelF;

    var tonnes = s.totalMaterials / 1000;
    var transportCO2 =
      tonnes * s.deliveryKm * FACTORS.transportPerTonneKm;

    var placement = s.insitu ? 0 : FACTORS.precastExtra;

    var total = materials + steelCO2 + transportCO2 + placement;

    return {
      total: total,
      materials: materials,
      steel: steelCO2,
      transport: transportCO2,
      placement: placement
    };
  }

  function formatCarbon(n) {
    if (!Number.isFinite(n) || n < 0) return "0";
    return n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toFixed(1);
  }

  function runCalculate() {
    var section = document.getElementById("resultsSection");
    if (section) {
      section.hidden = false;
      section.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    for (var m = 0; m < MIX_COUNT; m++) {
      var c = carbonForMix(m);
      var valEl = document.querySelector(
        '[data-out="carbonTotal"][data-mix="' + m + '"]'
      );
      if (valEl) {
        valEl.textContent = formatCarbon(c.total);
        valEl.classList.remove("updated");
        void valEl.offsetWidth;
        valEl.classList.add("updated");
      }
      var ul = document.querySelector('[data-breakdown="' + m + '"]');
      if (ul) {
        ul.innerHTML = "";
        var rows = [
          ["Materials (binder, agg., admix.)", c.materials],
          ["Reinforcement steel", c.steel],
          ["Site delivery", c.transport]
        ];
        if (!getState(m).insitu) {
          rows.push(["Precast / factory allowance", c.placement]);
        }
        for (var i = 0; i < rows.length; i++) {
          var li = document.createElement("li");
          li.textContent =
            rows[i][0] + ": " + formatCarbon(rows[i][1]) + " kg CO₂e/m³";
          ul.appendChild(li);
        }
      }
    }
    updateMixNames();
  }

  function bindInputs() {
    var root = document.getElementById("calculator");
    if (!root) return;
    root.addEventListener("input", function () {
      updateIntermediate();
    });
    root.addEventListener("change", function () {
      updateIntermediate();
    });
  }

  function initCookie() {
    var bar = document.getElementById("cookieBar");
    var btn = document.getElementById("cookieAccept");
    try {
      if (localStorage.getItem("ce_cookies_ok") === "1" && bar) {
        bar.hidden = true;
      }
    } catch (e) {}
    if (btn && bar) {
      btn.addEventListener("click", function () {
        bar.hidden = true;
        try {
          localStorage.setItem("ce_cookies_ok", "1");
        } catch (e) {}
      });
    }
  }

  function init() {
    bindInputs();
    updateIntermediate();
    initCookie();
    var btn = document.getElementById("btnCalculate");
    if (btn) btn.addEventListener("click", runCalculate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
