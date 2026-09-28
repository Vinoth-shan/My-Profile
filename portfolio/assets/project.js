(() => {
  const { esc, ic, PICON, status, chips, href, theme, icons } = window.UI;
  const C = window.CATEGORIES, L = window.PROJECTS, D = window.DETAILS || {};
  theme();
  const yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();
  const id = new URLSearchParams(location.search).get("id");
  const i = L.findIndex(p => p.id === id);
  const main = document.getElementById("main");
  if (i < 0) {
    main.innerHTML = `<section class="sec"><div class="wrap"><h1 class="h">Project not found</h1><p class="lead">That link doesn't match a project. Pick one from the full list.</p><p style="margin-top:20px"><a class="btn line" href="index.html#projects">${ic("layout-grid")}Browse all projects</a></p></div></section>`;
    icons(); return;
  }
  const p = L[i], c = C[p.cat], d = D[p.id] || {};
  document.title = `${p.n} case study`;

  const sec = (key, title, iconName, body, lead) => body ? `<section class="cs-sec" id="${key}"><div class="cs-h"><span class="cs-hi">${ic(iconName)}</span><div><h2>${title}</h2>${lead ? `<p>${lead}</p>` : ""}</div></div>${body}</section>` : "";
  const has = a => a && a.length;

  const wf = has(d.workflow) ? d.workflow : (p.flow || []).map(f => [f, "", ""]);
  const facts = [
    ["layers", "Area", c.n],
    ["activity", "Status", { live: "Live", dev: "In development", early: "Early stage" }[p.status]],
    has(d.roles) && ["users", "User roles", d.roles.length],
    has(wf) && ["workflow", "Workflow steps", wf.length],
    has(d.records) && ["database", "Record types", d.records.length],
    has(d.integrations) && ["plug-zap", "Integrations", d.integrations.length]
  ].filter(Boolean);

  const parts = [];
  parts.push(sec("why", "Why it exists", "target", (d.purpose || d.concept || p.problem) ? `<div class="cs-two">
      <article class="cs-quote"><span class="cs-lbl">${ic("circle-help")}The need</span><p>${esc(d.purpose || p.problem || p.one)}</p></article>
      ${d.concept || p.hl ? `<article class="cs-quote alt"><span class="cs-lbl">${ic("lightbulb")}The idea</span><p>${esc(d.concept || p.hl)}</p></article>` : ""}
    </div>` : ""));
  if (d.scope && (has(d.scope.in) || has(d.scope.out))) parts.push(sec("scope", "Scope", "crosshair", `<div class="cs-two">
      <div class="cs-box"><h3 class="ok">${ic("check-circle-2")}In scope</h3><ul class="cs-list ok">${(d.scope.in || []).map(x => `<li>${ic("check")}${esc(x)}</li>`).join("")}</ul></div>
      ${has(d.scope.out) ? `<div class="cs-box"><h3 class="no">${ic("circle-slash")}Out of scope</h3><ul class="cs-list no">${d.scope.out.map(x => `<li>${ic("minus")}${esc(x)}</li>`).join("")}</ul></div>` : ""}
    </div>`, "What this system is responsible for, and what it deliberately leaves to other tools."));
  if (has(d.roles)) parts.push(sec("people", "Who uses it", "users", `<div class="cs-grid">${d.roles.map(r => `<div class="cs-role"><span>${ic("user-round")}</span><div><b>${esc(r[0])}</b><p>${esc(r[1])}</p></div></div>`).join("")}</div>`));
  if (has(wf)) parts.push(sec("flow", "How it works", "workflow", `<ol class="cs-flow">${wf.map((w, k) => `<li><span class="n">${k + 1}</span><div><b>${esc(w[0])}</b>${w[1] ? `<p>${esc(w[1])}</p>` : ""}${w[2] ? `<span class="actor">${ic("user-cog")}${esc(w[2])}</span>` : ""}</div></li>`).join("")}</ol>`, "Step by step, from the trigger to the result."));
  if (has(d.modules) || has(d.dashboards)) parts.push(sec("screens", "Screens and dashboards", "layout-dashboard", `
      ${has(d.dashboards) ? `<div class="cs-dash">${d.dashboards.map(x => `<div class="cs-dcard"><span class="cs-di">${ic("chart-no-axes-combined")}</span><b>${esc(x[0])}</b><p>${esc(x[1])}</p></div>`).join("")}</div>` : ""}
      ${has(d.modules) ? `<div class="cs-grid mods">${d.modules.map(x => `<div class="cs-mod"><b>${ic("app-window")}${esc(x[0])}</b><p>${esc(x[1])}</p></div>`).join("")}</div>` : ""}`));
  if (has(d.records)) parts.push(sec("data", "Data it keeps", "database", `<div class="cs-grid recs">${d.records.map(r => `<div class="cs-rec"><h3>${ic("table-2")}${esc(r[0])}</h3>${chips(String(r[1]).split(/,\s*/).filter(Boolean))}</div>`).join("")}</div>`));
  if (has(d.integrations) || has(d.security)) parts.push(sec("tech", "Integrations and security", "plug-zap", `<div class="cs-two">
      ${has(d.integrations) ? `<div class="cs-box"><h3>${ic("link-2")}Connected systems</h3><ul class="cs-list">${d.integrations.map(x => `<li>${ic("dot")}<span><b>${esc(x[0])}</b> ${esc(x[1])}</span></li>`).join("")}</ul></div>` : ""}
      ${has(d.security) ? `<div class="cs-box"><h3>${ic("shield-check")}Access and security</h3><ul class="cs-list ok">${d.security.map(x => `<li>${ic("lock")}${esc(x)}</li>`).join("")}</ul></div>` : ""}
    </div>`));
  if (has(d.engineering)) parts.push(sec("eng", "Engineering decisions", "cpu", `<div class="cs-grid">${d.engineering.map(x => `<div class="cs-eng">${ic("sparkles")}<p>${esc(x)}</p></div>`).join("")}</div>`));
  const outs = has(d.outcomes) ? d.outcomes : (p.features || []);
  if (has(outs)) parts.push(sec("outcomes", has(d.outcomes) ? "Outcomes" : "Key features", "trending-up", `<div class="cs-grid outs">${outs.map(x => `<div class="cs-out"><span>${ic("badge-check")}</span><p>${esc(x)}</p></div>`).join("")}</div>`));

  const toc = [["why", "Why"], ["scope", "Scope"], ["people", "Users"], ["flow", "Workflow"], ["screens", "Screens"], ["data", "Data"], ["tech", "Integrations"], ["eng", "Engineering"], ["outcomes", "Outcomes"]]
    .filter(([k]) => parts.some(h => h.includes(`id="${k}"`)));
  const prev = L[(i - 1 + L.length) % L.length], next = L[(i + 1) % L.length];

  main.innerHTML = `
  <section class="cs-hero" style="--c:${c.c}">
    <span class="mesh" aria-hidden="true"></span><span class="cs-glow" aria-hidden="true"></span>
    <div class="wrap wide">
      <a class="cs-back" href="index.html#projects">${ic("arrow-left")}All projects</a>
      <div class="cs-title">
        <span class="cs-icon">${ic(PICON[p.id] || c.ic)}</span>
        <div>
          <div class="cs-tags"><span class="cs-cat">${ic(c.ic)}${esc(c.n)}</span>${status(p.status)}</div>
          <h1>${esc(p.n)}</h1>
          <p class="cs-one">${esc(p.one)}</p>
        </div>
      </div>
      ${p.metrics ? `<div class="cs-mets">${p.metrics.map(m => `<div><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join("")}</div>` : ""}
      <div class="cs-facts">${facts.map(f => `<div>${ic(f[0])}<span>${esc(f[1])}</span><b>${esc(f[2])}</b></div>`).join("")}</div>
      <div class="cs-stack">${chips(p.stack)}</div>
    </div>
  </section>
  <nav class="cs-toc" aria-label="On this page"><div class="wrap wide">${toc.map(([k, t]) => `<a href="#${k}">${t}</a>`).join("")}</div></nav>
  <div class="wrap wide cs-body" style="--c:${c.c}">${parts.join("")}</div>
  <section class="wrap wide cs-next">
    <a class="cs-pn" href="${href(prev.id)}"><span>${ic("arrow-left")}Previous</span><b>${esc(prev.n)}</b></a>
    <a class="cs-pn all" href="index.html#projects"><span>${ic("layout-grid")}Back to</span><b>All ${L.length} projects</b></a>
    <a class="cs-pn r" href="${href(next.id)}"><span>Next${ic("arrow-right")}</span><b>${esc(next.n)}</b></a>
  </section>`;
  icons();
})();
