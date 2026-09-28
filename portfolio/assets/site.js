(() => {
  const P = window.PROFILE, C = window.CATEGORIES, L = window.PROJECTS, D = window.DETAILS || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ic = n => `<i data-lucide="${n}"></i>`;
  const icons = () => window.lucide && window.lucide.createIcons();
  const GRADS = ["#4F46E5", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4", "#3B82F6"];
  const PICON = { arn: "file-scan", sfms: "target", oex: "container", ar: "landmark", verify: "mail-check", trucker: "truck", shipflow: "plane-landing", pdesk: "kanban-square",
    oiw: "ship", customs: "stamp", isf: "file-badge", ctrack: "boxes", empty: "timer-reset", wip: "list-checks", rdd: "git-compare-arrows", errlog: "bug", shiptrack: "search-check", lcl: "calculator",
    aefm: "plane-takeoff", aimp: "plane-landing", aew: "layout-template", aiw: "layout-template", unbilled: "receipt", bt: "bell-ring", billperf: "gauge", aht: "timer",
    claim: "scale", truckissue: "truck", claims: "files", loi: "signature", ccc: "warehouse", pms: "award", room: "calendar-clock", annual: "party-popper", odyssey: "bed-double", org: "network", daybook: "smartphone", wms: "package" };
  const ST = { live: ["s-live", "Live"], dev: ["s-dev", "In development"], early: ["s-early", "Early stage"] };
  const status = s => `<span class="status ${ST[s][0]}">${ST[s][1]}</span>`;
  const chips = a => `<div class="chips">${(a || []).map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div>`;

  // theme + menu
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#theme").onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  };
  const links = $("#links"), mb = $("#menuBtn");
  mb.onclick = () => { const o = links.classList.toggle("open"); mb.setAttribute("aria-expanded", o); };
  links.onclick = e => { if (e.target.closest("a")) { links.classList.remove("open"); mb.setAttribute("aria-expanded", false); } };

  // hero
  $("#loc").textContent = P.location;
  $("#name").textContent = P.name;
  $("#role").textContent = P.title;
  $("#tagline").textContent = P.tagline;
  $("#cv").href = P.resume;
  const areaCounts = Object.entries(C).map(([k, v]) => [v, L.filter(p => p.cat === k).length]).filter(x => x[1]);
  const maxArea = Math.max(...areaCounts.map(x => x[1]));
  $("#mapTotal").textContent = `${L.length} systems`;
  $("#map").innerHTML = areaCounts.map(([v, n]) => `<li><span class="mi" style="background:${v.c}">${ic(v.ic)}</span><div><span class="ml">${esc(v.n)}</span><span class="mb"><i style="width:${Math.round(n / maxArea * 100)}%;background:${v.c}"></i></span></div><span class="mc">${n}</span></li>`).join("");
  $("#stats").innerHTML = window.UI.stats().map((s, i) => `<div class="stat"><span class="si" style="background:${GRADS[i]}">${ic(s.ic || "star")}</span><div><b>${esc((s.p || "") + s.v + s.s)}</b><span>${esc(s.l)}</span></div></div>`).join("");

  // about
  $("#summary").innerHTML = P.summary.map(p => `<p>${esc(p)}</p>`).join("");
  $("#awards").innerHTML = (P.awards || []).map(a => `<div class="award"><span class="aw-i">${ic("trophy")}</span><div><b>${esc(a.t)} <em>${esc(a.y)}</em></b><span>${esc(a.org)}. ${esc(a.d)}</span></div></div>`).join("");
  $("#ai").innerHTML = `<h3><span class="badge">${ic("sparkles")}</span>${esc(P.ai.title)}</h3><p>${esc(P.ai.lead)}</p>
    <ul>${P.ai.points.map(x => `<li><span class="ii">${ic(x.ic)}</span><div><b>${esc(x.t)}</b><span>${esc(x.d)}</span></div></li>`).join("")}</ul>`;
  $("#process").innerHTML = P.process.map((s, i) => `<li><span class="n">${i + 1}</span><span class="pi" style="background:${GRADS[i]}">${ic(s.ic)}</span><b>${esc(s.t)}</b><span>${esc(s.d)}</span></li>`).join("");

  // journey
  $("#route").innerHTML = P.journey.map(j => `<li class="stop" style="--c:${j.c}">
    <span class="node">${ic(j.ic)}</span>
    <div class="date"><span class="when">${esc(j.y)}</span></div>
    <div class="card"><h4>${esc(j.t)}</h4><p>${esc(j.d)}</p></div></li>`).join("");

  // featured bento
  const flags = L.filter(p => p.flagship);
  $("#bento").innerHTML = flags.map(p => {
    const c = C[p.cat];
    return `<a class="feat" href="${window.UI.href(p.id)}" style="--c:${c.c}">
      <div class="fh"><span class="fi" style="background:${c.c}">${ic(PICON[p.id])}</span><span class="fc">${esc(c.n)}</span></div>
      <h3>${esc(p.n)}</h3><p>${esc(p.one)}</p>
      ${p.metrics ? `<div class="mets">${p.metrics.map(m => `<div><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join("")}</div>` : ""}
      <span class="open">View case study ${ic("arrow-up-right")}</span></a>`;
  }).join("");

  // project grid
  let cat = "all";
  const counts = L.reduce((a, p) => (a[p.cat] = (a[p.cat] || 0) + 1, a), {});
  $("#filters").innerHTML = `<button class="tab" data-c="all" aria-pressed="true">${ic("layout-grid")}All <span class="k">${L.length}</span></button>` +
    Object.entries(C).filter(([k]) => counts[k]).map(([k, v]) => `<button class="tab" data-c="${k}" aria-pressed="false" style="--c:${v.c}">${ic(v.ic)}${esc(v.n)} <span class="k">${counts[k]}</span></button>`).join("");
  $("#filters").onclick = e => { const b = e.target.closest(".tab"); if (!b) return; cat = b.dataset.c; document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-pressed", x === b)); render(); };
  $("#q").oninput = render;
  function render() {
    const t = $("#q").value.trim().toLowerCase();
    const list = L.filter(p => (cat === "all" || p.cat === cat) && (!t || [p.n, p.one, ...(p.stack || [])].join(" ").toLowerCase().includes(t)));
    $("#count").textContent = list.length ? `Showing ${list.length} of ${L.length} projects` : "No project matches that search. Try a technology like n8n or Gemini.";
    $("#grid").innerHTML = list.map(window.UI.card).join("");
    icons();
  }
  render();

  $("#vnote").innerHTML = `${ic("history")}<span>${esc(P.versionsNote)}</span>`;

  // skills + contact
  $("#skillgrid").innerHTML = P.skills.map((s, i) => `<div class="sk"><h4><span class="si" style="background:${GRADS[i]}">${ic(s.ic)}</span>${esc(s.g)}</h4>${chips(s.i)}</div>`).join("");
  $("#openTo").textContent = `${P.openTo}.`;
  $("#cLoc").textContent = P.location;
  $("#cFree").textContent = P.freelance;
  const cl = [[`mailto:${P.email}`, P.email, "mail"], [`tel:${P.phone.replace(/\s/g, "")}`, P.phone, "phone"]];
  cl.push([`https://wa.me/${P.phone.replace(/\D/g, "")}`, "WhatsApp", "message-circle"]);
  if (P.links.github) cl.push([P.links.github, "GitHub", "github"]);
  if (P.links.linkedin) cl.push([P.links.linkedin, "LinkedIn", "linkedin"]);
  cl.push([P.resume, "Resume", "file-text"]);
  $("#clinks").innerHTML = cl.map(([h, t, i], k) => `<a class="c-btn${k === 0 ? " main" : ""}" href="${esc(h)}"${h.startsWith("http") || h.endsWith(".html") ? ' target="_blank" rel="noopener"' : ""}><span class="c-i">${ic(i)}</span><span class="c-t">${esc(t)}</span>${ic("arrow-up-right")}</a>`).join("");
  $("#fTitle").textContent = `${P.title}. ${P.location}.`;
  $("#fSocial").innerHTML = cl.filter(c => c[2] !== "file-text").map(([h, t, i]) => `<a class="ib" href="${esc(h)}" aria-label="${esc(t)}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${ic(i)}</a>`).join("");
  $("#yr").textContent = new Date().getFullYear();

  icons();
})();
