// Shared HTML builders for every resume design. Designs differ only in layout and CSS.
window.H = (() => {
  const R = window.R;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ic = n => `<i data-lucide="${n}"></i>`;
  const c = R.contact;
  const CONTACT = [
    ["map-pin", c.location, ""],
    ["mail", c.email, "mailto:" + c.email],
    ["phone", c.phone, "tel:" + c.phone.replace(/\s/g, "")],
    ["globe", c.portfolio, "https://" + c.portfolio],
    ["github", c.github, "https://" + c.github]
  ];
  return {
    esc, ic,
    contact: (only) => `<ul class="r-contact">${CONTACT.filter(x => !only || only.includes(x[0])).map(([i, t, h]) =>
      `<li>${ic(i)}${h ? `<a href="${esc(h)}">${esc(t)}</a>` : `<span>${esc(t)}</span>`}</li>`).join("")}</ul>`,
    summary: () => `<p class="r-summary">${esc(R.summary)}</p>`,
    metrics: (n) => `<div class="r-metrics">${R.metrics.slice(0, n || 99).map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>`,
    ai: () => `<div class="r-ai"><h4>${ic("sparkles")}AI-driven development</h4><p>${esc(R.ai)}</p></div>`,
    skills: () => `<div class="r-skills">${R.skills.map(([g, items]) => `<div class="r-skill"><h4>${esc(g)}</h4><div class="r-tags">${items.map(t => `<span>${esc(t)}</span>`).join("")}</div></div>`).join("")}</div>`,
    job: (j) => `<article class="r-job">
        <header><div><h3>${esc(j.role)}</h3><p class="r-org">${esc(j.org)}${j.unit ? ` · ${esc(j.unit)}` : ""}, ${esc(j.place)}</p></div><span class="r-dates">${esc(j.dates)}</span></header>
        ${j.intro ? `<p class="r-intro">${esc(j.intro)}</p>` : ""}
        ${j.groups.map(([g, items]) => `${g ? `<h4 class="r-group">${esc(g)}</h4>` : ""}<ul>${items.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`).join("")}
      </article>`,
    experience: function () { return R.experience.map(this.job).join(""); },
    // Part of a job's groups, for designs that split experience across the two pages.
    jobPart: function (i, from, to, cont) {
      const j = R.experience[i];
      return this.job({ ...j, intro: cont ? "" : j.intro, role: cont ? `${j.role} (continued)` : j.role, groups: j.groups.slice(from, to) });
    },
    projects: (n) => `<div class="r-projects">${R.projects.slice(0, n || 99).map(([name, stack, one]) => `<div class="r-proj"><b>${esc(name)}</b><span class="r-stack">${esc(stack)}</span><p>${esc(one)}</p></div>`).join("")}</div>`,
    strengths: () => `<div class="r-strengths">${R.strengths.map(([t, d]) => `<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")}</div>`,
    education: () => R.education.map(([d, s, y, g]) => `<div class="r-edu"><b>${esc(d)}</b><span>${esc(s)}</span><span>${esc(y)} · ${esc(g)}</span></div>`).join(""),
    languages: () => `<ul class="r-langs">${R.languages.map(([l, v]) => `<li><b>${esc(l)}</b><span>${esc(v)}</span></li>`).join("")}</ul>`,
    freelance: () => `<p class="r-free">${esc(R.freelance)}</p>`,
    done: () => {
      // Floating download button (screen only) pointing at this design's exported PDF.
      const base = location.pathname.split("/").pop().replace(/\.html$/i, "");
      const pdf = `pdf/Vinoth_S_Resume_${base}.pdf`;
      const style = document.createElement("style");
      style.textContent = `.dl-fab{position:fixed;right:22px;bottom:22px;z-index:50;display:inline-flex;align-items:center;gap:9px;padding:13px 20px;border-radius:999px;
        font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff;text-decoration:none;background:linear-gradient(120deg,#4F46E5,#8B5CF6 45%,#EC4899);
        box-shadow:0 14px 30px -10px rgba(79,70,229,.7);transition:transform .15s}
        .dl-fab:hover{transform:translateY(-2px)} .dl-fab svg{width:18px;height:18px}
        @media print{.dl-fab{display:none!important}} @media (max-width:520px){.dl-fab{right:14px;bottom:14px;padding:12px 16px}}`;
      document.head.appendChild(style);
      document.body.insertAdjacentHTML("beforeend", `<a class="dl-fab" href="${pdf}" download="Vinoth_S_Resume.pdf" aria-label="Download resume as PDF"><i data-lucide="download"></i>Download PDF</a>`);
      window.lucide && window.lucide.createIcons();
      // Records any page/column whose content spills past its fixed A4 height (read by the export check).
      const check = () => {
        const bad = [];
        document.querySelectorAll(".page, .page > aside, .page > main, .page .col").forEach((el, i) => {
          if (el.scrollHeight > el.clientHeight + 2) bad.push(`${el.className || el.tagName}#${i}:+${el.scrollHeight - el.clientHeight}px`);
        });
        document.documentElement.dataset.overflow = bad.join(" | ") || "none";
        const cs = el => getComputedStyle(el);
        document.documentElement.dataset.slack = [...document.querySelectorAll(".page, .page > aside, .page > main, .page .col")].map((el, i) => {
          const kids = [...el.children].filter(k => cs(k).position !== "absolute");
          const used = kids.reduce((s, k) => s + k.getBoundingClientRect().height, 0);
          const pad = parseFloat(cs(el).paddingTop) + parseFloat(cs(el).paddingBottom);
          return `${el.tagName.toLowerCase()}${el.className ? "." + el.className.split(" ")[0] : ""}#${i}:${Math.round(el.clientHeight - pad - used)}`;
        }).join(" ");
      };
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(check, 300));
    }
  };
})();
