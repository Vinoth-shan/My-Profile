# Vinoth S — Portfolio, Slides & Resume

Software Developer, Systems & Automation. Sole developer of 36 live systems for US and UK freight operations, with AI document automation, n8n workflows and REST APIs.

**Live site:** https://vinoth-shan.github.io/My-Profile/

| Page | Path |
|---|---|
| Portfolio | [`portfolio/`](portfolio/) |
| Project case studies | `portfolio/project.html?id=<project>` |
| Presentation (slides) | [`portfolio/slides.html`](portfolio/slides.html) |
| Resume (main, dark) | [`resume/5-dark.html`](resume/5-dark.html) |
| Resume (executive / bold) | [`resume/1-executive.html`](resume/1-executive.html), [`resume/4-bold.html`](resume/4-bold.html) |

## How it is built

Plain HTML, CSS and JavaScript — no framework, no build step, so it runs on any static host.

- `portfolio/data/profile.js` — profile, stats, journey and the project list (single source for portfolio and slides).
- `portfolio/data/details/*.js` — per-project case-study content.
- `resume/data/content.js` — resume content shared by all three resume designs.
- `resume/export.ps1` — exports the resume designs to `resume/pdf/` with headless Edge.

Company systems are confidential: this repository contains descriptions only, no company source code or data.
