window.UI = (() => {
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ic = n => `<i data-lucide="${n}"></i>`;
  const PICON = { arn: "file-scan", sfms: "target", oex: "container", ar: "landmark", verify: "mail-check", trucker: "truck", shipflow: "plane-landing", pdesk: "kanban-square",
    oiw: "ship", customs: "stamp", isf: "file-badge", ctrack: "boxes", empty: "timer-reset", wip: "list-checks", rdd: "git-compare-arrows", errlog: "bug", shiptrack: "search-check", lcl: "calculator",
    aefm: "plane-takeoff", aimp: "plane-landing", aew: "layout-template", aiw: "layout-template", unbilled: "receipt", bt: "bell-ring", billperf: "gauge", aht: "timer",
    claim: "scale", truckissue: "truck", claims: "files", loi: "signature", ccc: "warehouse", pms: "award", room: "calendar-clock", annual: "party-popper", odyssey: "bed-double", org: "network", daybook: "smartphone", wms: "package", aiemail: "mails" };
  const ST = { live: ["s-live", "Live"], dev: ["s-dev", "In development"], early: ["s-early", "Early stage"] };
  const status = s => `<span class="status ${ST[s][0]}">${ST[s][1]}</span>`;
  const chips = a => `<div class="chips">${(a || []).map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div>`;
  const href = id => `project.html?id=${encodeURIComponent(id)}`;

  const maxSteps = () => Math.max(1, ...Object.values(window.DETAILS || {}).map(d => (d.workflow || []).length));
  const TECH = [[/php/i, "PHP"], [/mysql|mariadb|sql/i, "SQL"], [/n8n/i, "n8n"], [/gemini|claude|\bai\b/i, "AI"], [/react/i, "Re"], [/typescript/i, "TS"],
    [/javascript|vanilla js|jquery/i, "JS"], [/python/i, "Py"], [/excel|spreadsheet|sheetjs/i, "XLS"], [/pdf/i, "PDF"], [/imap|gmail|resend|emailjs|phpmailer/i, "Mail"],
    [/fmcsa|rest api|\bapi\b/i, "API"], [/android|capacitor/i, "App"], [/chrome/i, "Ext"], [/outlook|vba/i, "VBA"], [/bootstrap|tailwind|css/i, "CSS"]];
  const initials = t => (TECH.find(([r]) => r.test(t)) || [0, t.replace(/[^A-Za-z0-9]/g, "").slice(0, 3)])[1];
  function card(p) {
    const c = window.CATEGORIES[p.cat], d = (window.DETAILS || {})[p.id] || {};
    const steps = (d.workflow || p.flow || []).length;
    const pct = steps ? Math.max(12, Math.round(steps / maxSteps() * 100)) : 0;
    const stack = p.stack || [];
    const uniq = [...new Map(stack.map(t => [initials(t), t])).entries()];
    return `<a class="pcard" href="${href(p.id)}" style="--c:${c.c}">
      <span class="pc-glow" aria-hidden="true"></span>
      <div class="pc-head"><span class="pc-cat">${ic(c.ic)}${esc(c.n)}</span>${status(p.status)}</div>
      <div class="pc-main">
        <span class="pc-ic">${ic(PICON[p.id] || c.ic)}</span>
        <h4>${esc(p.n)}</h4>
        <p>${esc(p.one)}</p>
      </div>
      ${steps ? `<div class="pc-bar"><div><b>Workflow</b><span>${steps} steps</span></div><span class="pc-track"><i style="width:${pct}%"></i></span></div>` : ""}
      <div class="pc-foot">
        <div class="pc-tech">${uniq.slice(0, 3).map(([k, t]) => `<span title="${esc(t)}">${esc(k)}</span>`).join("")}${uniq.length > 3 ? `<span class="more" title="${esc(uniq.slice(3).map(x => x[1]).join(", "))}">+${uniq.length - 3}</span>` : ""}</div>
        <span class="pc-pill">Case study ${ic("arrow-up-right")}</span>
      </div>
    </a>`;
  }

  function theme() {
    const root = document.documentElement, btn = document.getElementById("theme");
    try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
    if (btn) btn.onclick = () => {
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    };
  }
  const icons = () => window.lucide && window.lucide.createIcons();

  // Stat counts are derived from project data so they stay correct as projects are added.
  const text = p => [...(p.stack || []), ...(((window.DETAILS || {})[p.id] || {}).integrations || []).map(x => x.join(" ")), p.one].join(" ");
  const CALC = {
    apps: L => L.length,
    ai: L => L.filter(p => /gemini|claude|\bAI\b|openai/i.test(text(p))).length,
    n8n: L => L.filter(p => /n8n/i.test(text(p))).length,
    api: L => L.filter(p => /\bapi\b|webhook|fmcsa|resend|emailjs|google|rdap|openroute/i.test(text(p))).length
  };
  const stats = () => window.PROFILE.stats.map(s => s.calc ? { ...s, v: CALC[s.calc](window.PROJECTS) } : s);
  return { esc, ic, PICON, status, chips, card, href, theme, icons, stats };
})();
