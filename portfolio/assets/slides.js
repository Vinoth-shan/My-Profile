(() => {
  const P = window.PROFILE, C = window.CATEGORIES, L = window.PROJECTS, D = window.DETAILS || {};
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ic = n => `<i data-lucide="${n}"></i>`;
  const GR = ["#4F46E5", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4", "#3B82F6"];
  const PI = { arn: "file-scan", sfms: "target", oex: "container", ar: "landmark", verify: "mail-check", trucker: "truck", shipflow: "plane-landing", pdesk: "kanban-square",
    oiw: "ship", customs: "stamp", isf: "file-badge", ctrack: "boxes", empty: "timer-reset", wip: "list-checks", rdd: "git-compare-arrows", errlog: "bug", shiptrack: "search-check", lcl: "calculator",
    aefm: "plane-takeoff", aimp: "plane-landing", aew: "layout-template", aiw: "layout-template", unbilled: "receipt", bt: "bell-ring", billperf: "gauge", aht: "timer",
    claim: "scale", truckissue: "truck", claims: "files", loi: "signature", ccc: "warehouse", pms: "award", room: "calendar-clock", annual: "party-popper", odyssey: "bed-double", org: "network", daybook: "smartphone", wms: "package", aiemail: "mails" };
  const ST = { live: ["s-live", "Live"], dev: ["s-dev", "In development"], early: ["s-early", "Early stage"] };
  const status = s => `<span class="status ${ST[s][0]}">${ST[s][1]}</span>`;
  const chips = a => `<div class="chips">${(a || []).map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div>`;
  const list = (a, cls, i, n) => a && a.length ? `<ul class="list ${cls || ""}">${a.slice(0, n || 99).map(x => `<li>${ic(i)}<span>${esc(x)}</span></li>`).join("")}</ul>` : "";
  const mini = (a, i, n) => a && a.length ? `<div class="mini">${a.slice(0, n || 99).map(x => `<div>${ic(i)}<span><b>${esc(x[0])}</b> ${esc(x[1])}</span></div>`).join("")}</div>` : "";
  const card = (t, i, body, c) => body ? `<div class="card"${c ? ` style="--c:${c}"` : ""}><h4>${ic(i)}${t}</h4>${body}</div>` : "";
  const col = (...cards) => { const h = cards.join(""); return h ? `<div class="g" style="align-content:start">${h}</div>` : ""; };
  const steps = (wf, n) => wf.length ? `<ol class="steps">${wf.slice(0, n || 99).map((w, k) => `<li><span class="n">${k + 1}</span><div><b>${esc(w[0])}</b>${w[1] ? `<p>${esc(w[1])}</p>` : ""}${w[2] ? `<span class="actor">${esc(w[2])}</span>` : ""}</div></li>`).join("")}</ol>` : "";

  const gcard = (p, extra) => { const c = C[p.cat]; return `<div class="card gcard" style="--c:${c.c}"><span class="gglow" aria-hidden="true"></span><div class="gh"><span class="ic" style="background:${c.c}">${ic(PI[p.id] || c.ic)}</span>${extra || ""}</div><h4>${esc(p.n)}</h4><p>${esc(p.one)}</p></div>`; };
  const S = [];
  const add = (sec, t, html, dark) => S.push({ sec, t, html, dark });

  add("Opening", "Title", `<div class="inner"><span class="kick">${ic("map-pin")}${esc(P.location)}</span><h1 class="h1">${esc(P.name)}</h1>
    <p class="h2 keepcase" style="color:#E4E7FF;font-size:clamp(20px,2.6vw,32px)">${esc(P.title)}</p><p class="lede">${esc(P.tagline)}</p>
    <div class="g g5" style="margin-top:12px">${window.UI.stats().map((s, i) => `<div class="card stat" style="display:flex;gap:12px;align-items:center"><span class="ic" style="background:${GR[i]}">${ic(s.ic)}</span><div style="min-width:0"><b>${esc((s.p || "") + s.v + s.s)}</b><span>${esc(s.l)}</span></div></div>`).join("")}</div></div>`, true);

  const agenda = [["About me", "user-round", "Who I am, how I work, and how I use AI."], ["Journey", "route", "Engineering, business, and the switch to software."], ["Portfolio map", "map", "All systems grouped by business area."], ["Featured systems", "star", "Eight systems in depth: problem, workflow, data, outcomes."], ["Every system", "layout-grid", "One slide per project, grouped by area."], ["Toolkit & contact", "wrench", "Skills and how to reach me."]];
  add("Opening", "Agenda", `<div class="inner"><span class="kick">${ic("list")}Agenda</span><h2 class="h2">What this deck covers</h2>
    <div class="g g3">${agenda.map((a, i) => `<button class="card ag" data-go="${a[0]}"><span class="num">${i + 1}</span><div><h4>${ic(a[1])}${a[0]}</h4><p>${a[2]}</p></div></button>`).join("")}</div>
    <p class="lede" style="font-size:15px">Use the arrows at the bottom right, your arrow keys, or swipe. Index opens a list of every slide.</p></div>`);

  add("About me", "One developer, the whole stack", `<div class="inner"><span class="kick">${ic("user-round")}About me</span><h2 class="h2">One developer, the whole stack</h2>
    <div class="g g2"><div class="card">${P.summary.map(p => `<p style="margin-bottom:10px">${esc(p)}</p>`).join("")}${(P.awards || []).map(a => `<div class="award-line">${ic("trophy")}<span><b>${esc(a.t)} ${esc(a.y)}</b> · ${esc(a.org)}</span></div>`).join("")}</div>
    <div class="card"><h4>${ic("sparkles")}${esc(P.ai.title)}</h4><p style="margin-bottom:10px">${esc(P.ai.lead)}</p>${mini(P.ai.points.map(x => [x.t, x.d]), "check-circle-2")}</div></div></div>`);

  add("About me", "How I work", `<div class="inner"><span class="kick">${ic("workflow")}How I work</span><h2 class="h2">A request goes in, a running system comes out</h2>
    <div class="g g5">${P.process.map((s, i) => `<div class="card"><span class="ic" style="background:${GR[i]};margin-bottom:12px">${ic(s.ic)}</span><h4>${i + 1}. ${esc(s.t)}</h4><p>${esc(s.d)}</p></div>`).join("")}</div></div>`);

  add("Journey", "From railway fabrication to AI automation", `<div class="inner"><span class="kick">${ic("route")}Journey</span><h2 class="h2">From railway fabrication to AI automation</h2>
    <div class="track">${P.journey.map(j => `<div class="stop" style="--c:${j.c}"><span class="dot">${ic(j.ic)}</span><span class="y">${esc(j.y)}</span><b>${esc(j.t)}</b><p>${esc(j.d)}</p></div>`).join("")}</div></div>`);

  const cats = Object.entries(C).map(([k, v]) => [k, v, L.filter(p => p.cat === k)]).filter(x => x[2].length);
  add("Portfolio map", `${L.length} systems across the business`, `<div class="inner"><span class="kick">${ic("map")}Portfolio map</span><h2 class="h2">${L.length} live systems across the business</h2><p class="lede" style="font-size:15px">${esc(P.versionsNote)}</p>
    <div class="g g4">${cats.map(([k, v, ps]) => `<div class="card" style="--c:${v.c};border-top:4px solid ${v.c}"><h4>${ic(v.ic)}${esc(v.n)}<span style="margin-left:auto;color:var(--mute)">${ps.length}</span></h4><p>${ps.map(p => esc(p.n)).join(", ")}</p></div>`).join("")}</div></div>`);

  const head = (p, sub) => { const c = C[p.cat]; return `<span class="kick" style="color:${c.c}">${ic(c.ic)}${esc(c.n)}${sub ? `, ${sub}` : ""}</span>
    <div class="phead"><span class="ic" style="background:${c.c}">${ic(PI[p.id] || c.ic)}</span><h2 class="h2">${esc(p.n)}</h2>${status(p.status)}</div><p class="lede">${esc(p.one)}</p>`; };

  const flags = L.filter(p => p.flagship);
  add("Featured systems", "Featured systems", `<div class="inner"><span class="kick">${ic("star")}Part 4</span><h1 class="h2" style="font-size:clamp(36px,6vw,80px)">Featured systems</h1>
    <p class="lede">Eight systems in depth. Each gets two slides: what it is and why, then how it works and what it produced.</p><div class="g g4">${flags.map(p => gcard(p, `<span class="gcat">${esc(C[p.cat].n)}</span>`)).join("")}</div></div>`, true);

  flags.forEach(p => {
    const d = D[p.id] || {}, c = C[p.cat].c;
    const mets = p.metrics ? `<div class="g g3">${p.metrics.map(m => `<div class="card stat"><b style="color:${c}">${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join("")}</div>` : "";
    add("Featured systems", p.n, `<div class="inner">${head(p, "overview")}
      <div class="g g3">
        ${card("Purpose", "target", `<p>${esc(d.purpose || p.problem)}</p>${d.concept ? `<p style="margin-top:8px"><b>Concept.</b> ${esc(d.concept)}</p>` : ""}`, c)}
        ${card("Scope", "crosshair", d.scope ? list(d.scope.in, "ok", "check-circle-2", 5) + list(d.scope.out, "no", "circle-slash", 3) : list(p.features, "ok", "check-circle-2"), c)}
        ${card("Who uses it", "users", mini(d.roles, "user-round", 5) || chips(p.stack), c)}
      </div>${mets}</div>`);
    const wf = d.workflow && d.workflow.length ? d.workflow : p.flow.map(f => [f, "", ""]);
    add("Featured systems", p.n + ": how it works", `<div class="inner">${head(p, "how it works")}
      <div class="g g3">
        ${card("Workflow", "workflow", steps(wf, 8), c)}
        ${col(card("Screens & dashboards", "layout-dashboard", mini((d.dashboards || []).concat(d.modules || []), "app-window", 6), c), card("Records", "database", mini(d.records, "table-2", 5), c))}
        ${col(card("Engineering", "cpu", list(d.engineering, "", "sparkle", 4), c), card("Outcomes", "trending-up", list(d.outcomes && d.outcomes.length ? d.outcomes : [p.hl], "ok", "badge-check", 4), c), card("Stack", "layers", chips(p.stack), c))}
      </div></div>`);
  });

  cats.forEach(([k, v, ps]) => {
    const rest = ps.filter(p => !p.flagship); if (!rest.length) return;
    add(v.n, v.n, `<div class="inner"><span class="kick">${ic(v.ic)}Every system</span><h1 class="h2" style="font-size:clamp(36px,6vw,80px)">${esc(v.n)}</h1>
      <div class="g g3">${rest.map(p => gcard(p, status(p.status))).join("")}</div></div>`, true);
    rest.forEach(p => {
      const d = D[p.id] || {};
      const hasWf = d.workflow && d.workflow.length;
      const wf = hasWf ? d.workflow : (p.features || []).map(f => [f, "", ""]);
      add(v.n, p.n, `<div class="inner">${head(p)}
        <div class="g g3">
          ${col(card("Purpose", "target", `<p>${esc(d.purpose || p.one)}</p>`, v.c), card("Scope", "crosshair", d.scope ? list(d.scope.in, "ok", "check-circle-2", 4) : "", v.c), card("Who uses it", "users", mini(d.roles, "user-round", 4), v.c))}
          ${card(hasWf ? "Workflow" : "Features", "workflow", steps(wf, 7), v.c)}
          ${col(card("Screens & dashboards", "layout-dashboard", mini((d.dashboards || []).concat(d.modules || []), "app-window", 5), v.c), card("Records", "database", mini(d.records, "table-2", 4), v.c), card("Outcomes", "trending-up", list(d.outcomes, "ok", "badge-check", 3), v.c), card("Stack", "layers", chips(p.stack), v.c))}
        </div></div>`);
    });
  });

  add("Toolkit & contact", "Skills", `<div class="inner"><span class="kick">${ic("wrench")}Toolkit</span><h2 class="h2">Skills</h2>
    <div class="g g3">${P.skills.map((s, i) => `<div class="card"><h4><span class="ic" style="background:${GR[i]};width:36px;height:36px;font-size:17px">${ic(s.ic)}</span>${esc(s.g)}</h4>${chips(s.i)}</div>`).join("")}</div></div>`);
  const contacts = [["mail", P.email, "mailto:" + P.email], ["phone", P.phone, "tel:" + P.phone.replace(/\s/g, "")], ["message-circle", "WhatsApp", "https://wa.me/" + P.phone.replace(/\D/g, "")], P.links.github && ["github", "GitHub", P.links.github], P.links.linkedin && ["linkedin", "LinkedIn", P.links.linkedin]].filter(Boolean);
  add("Toolkit & contact", "Thank you", `<div class="inner"><span class="kick">${ic("hand-heart")}Thank you</span><h1 class="h1" style="font-size:clamp(40px,7vw,96px)">Let's talk</h1>
    <p class="lede">${esc(P.openTo)}.</p><p class="lede" style="color:#FDE7C2">${esc(P.freelance)}</p><div class="g g4" style="max-width:1100px">${contacts.map(c => `<a class="card" href="${esc(c[2])}" style="text-decoration:none;color:inherit"><h4>${ic(c[0])}${esc(c[1])}</h4></a>`).join("")}</div></div>`, true);

  const deck = document.getElementById("deck");
  deck.innerHTML = S.map((s, i) => `<section class="slide${s.dark ? " dark" : ""}" aria-label="Slide ${i + 1}: ${esc(s.t)}">${s.dark ? '<span class="mesh" aria-hidden="true"></span>' : ""}${s.html}</section>`).join("");
  const slides = [...deck.children], n = slides.length;
  document.getElementById("tot").textContent = n;

  const secs = []; S.forEach((s, i) => { let g = secs.find(x => x.n === s.sec); if (!g) secs.push(g = { n: s.sec, items: [] }); g.items.push([i, s.t]); });
  document.getElementById("mList").innerHTML = secs.map(g => `<div class="sec"><h5>${esc(g.n)}</h5><ol>${g.items.map(([i, t]) => `<li><button class="it" data-i="${i}"><span>${i + 1}</span>${esc(t)}</button></li>`).join("")}</ol></div>`).join("");

  let cur = 0;
  const menu = document.getElementById("menu"), prev = document.getElementById("bPrev"), next = document.getElementById("bNext");
  function go(k) {
    cur = Math.max(0, Math.min(n - 1, k));
    slides.forEach((s, i) => s.classList.toggle("on", i === cur));
    slides[cur].scrollTop = 0;
    document.getElementById("cur").textContent = cur + 1;
    document.getElementById("prog").style.width = ((cur + 1) / n * 100) + "%";
    prev.disabled = cur === 0; next.disabled = cur === n - 1;
    document.querySelectorAll(".menu .it").forEach(b => b.classList.toggle("cur", +b.dataset.i === cur));
    history.replaceState(null, "", "#" + (cur + 1));
  }
  const openMenu = o => { menu.classList.toggle("on", o); if (o) { const c = menu.querySelector(".it.cur"); c && c.scrollIntoView({ block: "center" }); c && c.focus(); } else document.getElementById("bIdx").focus(); };
  prev.onclick = () => go(cur - 1);
  next.onclick = () => go(cur + 1);
  document.getElementById("bIdx").onclick = () => openMenu(true);
  document.getElementById("mClose").onclick = () => openMenu(false);
  menu.onclick = e => { const b = e.target.closest(".it"); if (b) { go(+b.dataset.i); openMenu(false); } };
  deck.onclick = e => { const b = e.target.closest("[data-go]"); if (!b) return; const key = b.dataset.go === "Every system" ? S.findIndex((s, i) => i > 0 && Object.values(C).some(c => c.n === s.sec)) : S.findIndex(s => s.sec === b.dataset.go); if (key >= 0) go(key); };
  addEventListener("keydown", e => {
    if (menu.classList.contains("on")) { if (e.key === "Escape" || e.key.toLowerCase() === "m") openMenu(false); return; }
    if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(cur + 1); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
    else if (e.key === "Home") go(0); else if (e.key === "End") go(n - 1);
    else if (e.key.toLowerCase() === "m") openMenu(true);
    else if (e.key.toLowerCase() === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  });
  let tx = null, ty = null;
  deck.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener("touchend", e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1)); tx = null; });
  go((parseInt(location.hash.slice(1)) || 1) - 1);
  window.lucide && window.lucide.createIcons();
})();
