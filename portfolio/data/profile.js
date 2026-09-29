// Single source of truth for portfolio (index.html) and slides (slides.html).
// To add a project: append to PROJECTS. To add GitHub/LinkedIn: fill PROFILE.links.
window.PROFILE = {
  name: "VINOTH S",
  versionsNote: "All projects listed are live today. Several are upgraded rebuilds of earlier apps; older versions and apps that have been retired are not counted.",
  openTo: "Open to software development, automation and AI-integration roles",
  freelance: "Also available for freelance work: custom web apps, workflow automation with n8n, and AI integrations.",
  title: "Software Developer — Systems & Automation",
  tagline: "I design, build and run the systems a freight business depends on — from database architecture to AI document automation.",
  location: "Chennai, India",
  email: "vino18oct@gmail.com",
  phone: "+91 81247 10512",
  links: {
    linkedin: "",   // add LinkedIn URL
    github: "https://github.com/Vinoth-shan"
  },
  resume: "../resume/5-dark.html",
  stats: [
    { calc: "apps", s: "", l: "live applications built solo", ic: "boxes" },
    { v: 250, s: "", p: "", l: "operations staff using my apps", ic: "users" },
    { calc: "ai", s: "", l: "AI-integrated systems", ic: "brain-circuit" },
    { calc: "n8n", s: "", l: "n8n-automated systems", ic: "workflow" },
    { calc: "api", s: "", l: "API-connected systems", ic: "plug-zap" }
  ],
  summary: [
    "I am the only developer at A.J. Worldwide's Chennai back office. Teams bring me a basic requirement; I own everything after that — architecture, database design, UI, APIs, n8n automation, AI integration, hosting and support. Every system is version-controlled in the company's private GitHub organization.",
    "In three years that has become 37 live systems used by 250 operations staff across US and UK freight operations, two customer-facing products, and AI pipelines that read hundreds of shipping documents a day.",
    "I build with AI (Claude) as a force multiplier: I make the architecture decisions, AI helps me ship them faster."
  ],
  awards: [
    { t: "Extra Mile Award", y: "2025–26", org: "A.J. Worldwide Services", d: "Recognised for performance and for going beyond my role as the company's sole developer." }
  ],
  journey: [
    { y: "2017", ic: "graduation-cap", c: "#6366F1", t: "B.E. Production Engineering", d: "Velammal Engineering College, Chennai (CGPA 7.4)." },
    { y: "2018", ic: "factory", c: "#8B5CF6", t: "Founded a fabrication business", d: "Supplied fabricated items to Indian Railways (ICF) through public tenders: procurement, production, quality and customers." },
    { y: "2020", ic: "laptop", c: "#EC4899", t: "Taught myself to code", d: "Learned web development from scratch alongside the business and started freelance builds." },
    { y: "Oct 2023", ic: "briefcase", c: "#F43F5E", t: "Joined AJWW as its first developer", d: "Left the partnership to work in software full time. The first task was a single PHP form." },
    { y: "2024", ic: "layout-dashboard", c: "#F59E0B", t: "From forms to platforms", d: "Dashboards, workflow tools and UiPath RPA bots that removed about 3 FTE of manual work." },
    { y: "2025", ic: "workflow", c: "#06B6D4", t: "Automation moves to n8n + AI", d: "Gemini document extraction, fraud checks and email automation replaced manual steps." },
    { y: "2026", ic: "rocket", c: "#3B82F6", t: "Products, customers, AI-driven development", d: "Customer APIs, a 103-table sales platform, Claude-assisted delivery, and the Extra Mile Award for 2025–26." }
  ],
  ai: {
    title: "AI-driven development",
    lead: "I build with Claude as a pair programmer. I own the architecture and every decision; AI removes the slow parts.",
    points: [
      { ic: "compass", t: "I design first", d: "Data model, roles, workflows and failure cases are decided before any code is generated." },
      { ic: "sparkles", t: "Claude accelerates", d: "Scaffolding, refactors, SQL migrations, test data and documentation, produced in minutes instead of days." },
      { ic: "scan-search", t: "Every line reviewed", d: "Generated code is read, run and corrected by me. It ships only when I can explain it." },
      { ic: "refresh-cw", t: "Agile, iterative delivery", d: "Every system starts as a working first version and keeps gaining features in short cycles driven by user feedback." },
      { ic: "gauge", t: "Solo at team speed", d: "37 live systems in three years, maintained by one developer." }
    ]
  },
  process: [
    { ic: "messages-square", t: "Requirement", d: "Sit with the ops team, map the real workflow and the Excel it replaces." },
    { ic: "drafting-compass", t: "Architecture", d: "Data model, roles, integrations and failure points — decided by me." },
    { ic: "code-xml", t: "Build", d: "PHP MVC, MySQL/MariaDB, vanilla JS. AI-assisted with Claude, versioned in the company GitHub organization." },
    { ic: "bot", t: "Automate", d: "n8n workflows, email, webhooks, AI extraction, scheduled jobs." },
    { ic: "server-cog", t: "Ship & iterate", d: "Release a working first version, then add features continuously in agile cycles from user feedback." }
  ],
  skills: [
    { ic: "database", g: "Backend", i: ["PHP 8 (custom MVC)", "REST API design", "MySQL / MariaDB", "Schema & migrations", "Stored functions", "PDO"] },
    { ic: "brain-circuit", g: "AI & Automation", i: ["n8n", "Google Gemini API", "Claude (AI-assisted dev)", "Document extraction", "UiPath RPA", "Excel VBA"] },
    { ic: "monitor-smartphone", g: "Frontend", i: ["JavaScript", "HTML / CSS", "Bootstrap / Tailwind", "React + TypeScript", "Capacitor (Android)", "Chrome MV3 extensions"] },
    { ic: "plug-zap", g: "Integrations", i: ["IMAP / Gmail", "Resend / EmailJS", "FMCSA API", "Google Maps & Address", "RDAP / WHOIS", "OpenRouteService"] },
    { ic: "file-spreadsheet", g: "Data & Documents", i: ["PhpSpreadsheet", "Excel ETL (chunked)", "mPDF / FPDF / TCPDF", "SheetJS", "Dashboards & KPIs"] },
    { ic: "shield-check", g: "Security & Ops", i: ["Agile, iterative delivery", "Git / GitHub", "RBAC", "OTP / 2FA", "API keys & rate limits", "Linux hosting", "Cron jobs"] }
  ]
};

window.CATEGORIES = {
  oi:   { n: "Ocean Imports", c: "#2563EB", ic: "ship" },
  ex:   { n: "Exports & Air", c: "#0891B2", ic: "plane" },
  fin:  { n: "Finance & Billing", c: "#7C3AED", ic: "wallet" },
  risk: { n: "Disputes & Risk", c: "#E11D48", ic: "shield-alert" },
  cust: { n: "Customer & Sales", c: "#EA580C", ic: "handshake" },
  int:  { n: "Internal Tools", c: "#0D9488", ic: "building-2" },
  own:  { n: "Personal", c: "#DB2777", ic: "heart" }
};

// flagship: true → full case study. status: live | dev | early
window.PROJECTS = [
  {
    id: "arn", n: "Arrival Notice AI Pipeline", cat: "oi", flagship: true, status: "live",
    one: "Reads 200–300 carrier arrival notices a day with AI and routes each shipment to the right operator.",
    problem: "Carrier arrival-notice PDFs arrived by email all day. Staff opened each one, read shipment and container details by hand, found the responsible operator and forwarded it.",
    flow: ["Carrier emails arrive (IMAP)", "n8n skips invoice mails, hashes each PDF", "Duplicate hashes dropped before AI", "Gemini 2.5 Flash extracts BL & containers", "PHP API saves to MariaDB", "Operator matched from Logysis data", "Operator emailed automatically"],
    features: ["25-node n8n workflow, fully unattended", "Content-hash de-duplication saves AI cost", "Ops dashboard to review, correct and action", "Customer REST API for arrival-notice data"],
    metrics: [["200–300", "PDFs / day"], ["25", "n8n nodes"], ["0", "manual reads"]],
    stack: ["n8n", "Gemini 2.5 Flash", "PHP 8", "MariaDB", "IMAP", "Gmail", "REST API"],
    hl: "End-to-end AI document automation running in production every day."
  },
  {
    id: "sfms", n: "Sales Force Management System", cat: "cust", flagship: true, status: "dev",
    one: "Lead-to-customer platform for US and UK sales teams with role-based financial visibility.",
    problem: "Customer ownership, visits, deals and targets lived in scattered sheets, with no single truth across two entities.",
    flow: ["Leads & customers imported (n8n)", "Ownership rules enforced (one primary, 100% shares)", "Visits, deals, targets logged", "Scope filter by role & entity", "Financials redacted per role"],
    features: ["103-table schema, 27 controllers, 37+ services", "Central scope filter + response-layer redaction", "US + UK multi-entity design", "Soft deletes and audit everywhere", "Staged 8-phase delivery plan"],
    metrics: [["103", "tables"], ["27", "controllers"], ["2", "entities"]],
    stack: ["PHP 8.2", "MariaDB", "jQuery", "Resend OTP", "n8n"],
    hl: "Largest system I've architected — built in stages, currently in development."
  },
  {
    id: "oex", n: "Ocean Exports Workspace", cat: "ex", flagship: true, status: "live",
    one: "Operations console for ocean exports — bookings, tracking, quotations and invoicing links.",
    problem: "Export teams tracked bookings and follow-ups in spreadsheets with no link to billing status.",
    flow: ["Shipment data pushed by n8n webhook", "Desk-wise work queues", "Quotation PDFs generated", "Unbilled & BT status pulled via API", "OTP login, trusted devices"],
    features: ["34+ tables, 20 controllers, 28 migrations", "n8n ingestion endpoint", "Pricing-tool and billing integrations", "FPDF quotation documents"],
    metrics: [["34+", "tables"], ["20", "controllers"], ["7", "integrations"]],
    stack: ["PHP 8.2 MVC", "MySQL 8", "n8n", "Resend", "FPDF", "PhpSpreadsheet"],
    hl: "Multi-team workspace wired into billing and pricing systems."
  },
  {
    id: "ar", n: "AR Workspace", cat: "fin", flagship: true, status: "live",
    one: "Accounts-receivable platform that replaced the Excel credit-control tracker.",
    problem: "Receivables, credit notes, claims and write-offs were chased across shared Excel files.",
    flow: ["Invoices loaded from TMS exports", "36+ data points tracked per invoice", "Credit analysis & ageing", "Claims and write-off workflow", "Audit trail on every change"],
    features: ["7-role access control", "OTP two-factor login", "Dedicated database", "Full audit trail"],
    metrics: [["7", "roles"], ["36+", "fields tracked"], ["2FA", "login"]],
    stack: ["PHP 8", "MySQL", "PhpSpreadsheet", "Resend", "bcrypt"],
    hl: "Finance-grade app with 2FA and audit trail."
  },
  {
    id: "aiemail", n: "AI Email Suite", cat: "fin", flagship: true, status: "live",
    one: "Turns everyday Outlook emails into billing-review PDFs and trucker-vetting sheets with AI.",
    problem: "Staff read long email threads by hand to prepare invoices and to record which truckers had been vetted.",
    flow: ["Outlook emails uploaded (.msg or Excel export)", "Thread, screenshots and PDF attachments read", "Gemini or Claude extracts structured data", "Names matched to editable masters", "Billing-review PDF or vetting table produced", "Staff review, edit and download"],
    features: ["Invoice Summary: one billing-review PDF per shipment thread", "FTL Vetting: reads vetting emails, exports the Excel sheet", "Unknown names highlighted, one click adds them to the masters", "Gemini or Claude, switched by one setting", "No database; password login; files auto-deleted"],
    metrics: [["2", "AI modules"], ["2", "AI providers"], ["0", "databases"]],
    stack: ["PHP 8", "Gemini API", "Claude API", "mPDF", "Outlook .msg"],
    hl: "Two AI modules turn everyday emails into review-ready PDFs and Excel sheets."
  },
  {
    id: "trucker", n: "Trucker Tracker — Carrier Verification", cat: "risk", flagship: true, status: "live",
    one: "Single-screen verdict on whether a US trucking carrier is genuine.",
    problem: "Dispatchers had to check carriers manually across government records and web searches to avoid fraud.",
    flow: ["Enter MC / USDOT / email / domain", "FMCSA federal record lookup", "Address validation & places", "Gemini 2.5 Pro fraud assessment", "Combined verdict screen"],
    features: ["Multi-source lookup", "Cloudflare Worker fallback for FMCSA", "AI risk reasoning", "Password reset via Resend"],
    metrics: [["4", "data sources"], ["1", "verdict screen"]],
    stack: ["PHP 8", "FMCSA API", "Gemini 2.5 Pro", "Google Address Validation", "Cloudflare Worker"],
    hl: "Combines government data and AI into one decision."
  },
  {
    id: "shipflow", n: "ShipFlow-UK", cat: "cust", flagship: true, status: "live",
    one: "Air-freight tracking for the UK team, with a customer console and customer API.",
    problem: "UK air shipments were tracked in Excel with no customer visibility.",
    flow: ["Logysis data synced by n8n every 30 min", "Manual Excel/CSV upload fallback", "Pipeline stage computed per BL", "Stuck-shipment detection", "Customer console + REST API"],
    features: ["Computed pipeline stages", "Rate-limited customer REST API", "Customer console", "Custom MVC router"],
    metrics: [["30 min", "auto sync"], ["UK", "team + customers"]],
    stack: ["PHP 8.1 MVC", "MySQL 8", "n8n", "REST API", "Resend"],
    hl: "Customer-facing product with its own API."
  },
  {
    id: "pdesk", n: "ProjectDesk", cat: "int", flagship: true, status: "live",
    one: "In-house project tracker that replaced ClickUp.",
    problem: "The company paid for ClickUp but needed a tracker fitted to its own teams and roles.",
    flow: ["Anyone raises a request", "Assign members & roles", "Custom status pipeline", "@mentions, comments, files", "AI drafts task descriptions"],
    features: ["Kanban boards per project", "Custom workflows", "Gemini task-description generation", "No framework — runs on shared hosting"],
    metrics: [["1", "SaaS tool replaced"]],
    stack: ["PHP 8.1 MVC", "MySQL 8", "Gemini", "Vanilla JS"],
    hl: "Replaced a paid SaaS product."
  },

  // Ocean imports
  { id: "oiw", n: "Ocean Imports Workspace", cat: "oi", status: "live", one: "Central console for ocean-import shipments; hub that 5+ sibling apps read from.", features: ["Pending & pipeline task views", "Inline per-shipment edits", "Chunked Excel upload", "n8n IMAP ingestion, ETA sync across databases"], stack: ["PHP 8", "MariaDB", "SheetJS", "n8n"] },
  { id: "customs", n: "Customs Entry", cat: "oi", status: "live", one: "8-stage US customs entry workflow between operators and brokers.", features: ["Draft entry with documents", "Broker processing stage", "Per-stage audit columns", "n8n email notifications", "MVC rewrite of legacy app"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "isf", n: "ISF Entry", cat: "oi", status: "live", one: "Importer Security Filing workflow for US Customs, filed 24h before loading.", features: ["6-stage status workflow", "Bill matched / not matched", "Status-change emails via n8n"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "ctrack", n: "Container Tracking", cat: "oi", status: "live", one: "Tracks each container's empty-return milestones.", features: ["Last free date, gate out, gate in", "Web UI + API for automation", "Upload progress tracking"], stack: ["PHP 8 MVC", "MySQL", "PhpSpreadsheet"] },
  { id: "empty", n: "Empty Return Tracking", cat: "oi", status: "live", one: "Flags containers at risk of per-diem charges.", features: ["Delay-bucket dashboard", "5 Excel import paths", "Operator & location views"], stack: ["PHP 8", "MariaDB", "PhpSpreadsheet"] },
  { id: "wip", n: "WIP Follow-ups", cat: "oi", status: "live", one: "Multi-sheet Excel ingestion with automated follow-up emails.", features: ["20 mapped columns", "User & customer mapping", "n8n email triggers"], stack: ["PHP 8 MVC", "MariaDB", "n8n"] },
  { id: "rdd", n: "RDD Process", cat: "oi", status: "live", one: "WRK → RDD → CMP lifecycle tracker with profit-drift detection.", features: ["Initial vs latest profit comparison", "Per-operator dashboards", "n8n email-driven Excel push"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "errlog", n: "Ocean Imports Error Log", cat: "oi", status: "live", one: "Captures and tracks operational errors by location and status.", features: ["Multi-filter dashboard", "Auto status transitions", "India & US locations"], stack: ["PHP", "MySQL"] },
  { id: "shiptrack", n: "Shipment Tracker", cat: "oi", status: "live", one: "Search mailboxes for any shipment's milestones — web app and Chrome extension.", features: ["IMAP search across accounts", "AI extraction of DO release, IOR, containers", "Cached results via cron", "Chrome MV3 extension"], stack: ["PHP 8", "IMAP", "Gemini", "Chrome MV3"] },

  // Exports & air
  { id: "lcl", n: "LCL Pricing", cat: "ex", status: "live", one: "LCL ocean-freight quote calculator and booking tool.", features: ["Port-to-port charge breakdown", "Gemini turns pasted Excel rates into JSON", "ZIP → distance via OpenRouteService", "5-tier roles"], stack: ["PHP 8", "Gemini 2.0", "OpenRouteService", "EmailJS"] },
  { id: "aefm", n: "Air Exports Follow-up Manager", cat: "ex", status: "live", one: "Milestone tracker for air exports: pickup → booking → invoice → ITN.", features: ["Overdue flags per milestone", "Operator activity log", "n8n pushes data in"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "aimp", n: "Air Imports", cat: "ex", status: "live", one: "Shipment ledger with two QA audit subsystems and handle-time tracking.", features: ["CMP shipment audit", "Customer-service audit scorecards", "AHT module"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "aew", n: "Air Exports Workspace", cat: "ex", status: "early", one: "New modular workspace — OTP auth and shell ready, modules planned.", features: ["OTP login", "Role-based landing"], stack: ["PHP 8.2", "MariaDB", "Resend"] },
  { id: "aiw", n: "Air Imports Workspace", cat: "ex", status: "early", one: "Companion workspace for air imports — foundation in place.", features: ["Auth & routing shell"], stack: ["PHP 8.2", "MariaDB"] },

  // Finance
  { id: "unbilled", n: "Unbilled Tracker", cat: "fin", status: "live", one: "Finds completed shipments not yet invoiced, across 8 segments.", features: ["Ageing buckets 0–120+ days", "Per-shipment tracking", "n8n email escalation"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "bt", n: "BT Invoice Pending Tracker", cat: "fin", status: "live", one: "Vendor-invoice follow-up with automatic escalation.", features: ["Operator remarks & AP review", "n8n state machine writes dates back to DB", "Escalation to leads/managers"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "billperf", n: "Billing Performance", cat: "fin", status: "live", one: "Billing-timeliness SLA dashboard in business days.", features: ["Custom SQL business-days function", "Operator & location slicing"], stack: ["PHP 8", "MariaDB"] },
  { id: "aht", n: "AHT Tracker (AP)", cat: "fin", status: "live", one: "Server-side task timer for the Accounts Payable team.", features: ["Timer survives tab discard & redirects", "Per-user utilisation"], stack: ["PHP 8", "MySQL"] },

  // Risk & disputes
  { id: "claim", n: "Logysis Claim & Dispute", cat: "risk", status: "live", one: "9-stage invoice dispute and claims portal.", features: ["Per-action email webhooks", "Weekday morning summary via n8n", "Drag-to-reorder reports"], stack: ["PHP 8", "MariaDB", "n8n"] },
  { id: "truckissue", n: "Trucker Issue / Dispute", cat: "risk", status: "live", one: "Trucking-invoice disputes with multi-line charges.", features: ["9-state workflow", "Multiple charge lines per invoice", "Email notifications"], stack: ["PHP 8", "MariaDB", "EmailJS"] },
  {
    id: "verify", n: "Verify Sender — Email Fraud Check", cat: "risk", status: "live",
    one: "One click in Outlook tells staff whether a suspicious email is safe.",
    problem: "Business-email-compromise attempts (fake vendors, changed bank details) reached operations staff.",
    flow: ["Outlook macro sends email metadata", "Domain age via RDAP / WHOIS", "Trusted-vendor lookup", "Address check (Google / USPS)", "Gemini classification", "Risk score returned in Outlook"],
    features: ["5-stage detection pipeline", "Per-address risk scoring", "Verification audit log", "Works inside existing Outlook"],
    metrics: [["5", "checks"], ["1", "click"]],
    stack: ["Outlook VBA", "PHP 8", "Gemini", "RDAP", "Google Maps"],
    hl: "Security tool built into staff's daily workflow."
  },
  { id: "claims", n: "Claims & Dispute (Unified)", cat: "risk", status: "live", one: "Consolidates customer claims, third-party and trucker disputes.", features: ["Auto 'Action Required' on due follow-ups", "Role-based access", "25 MB attachments"], stack: ["PHP", "MySQL"] },
  { id: "loi", n: "LOI — Letter of Indemnity", cat: "risk", status: "live", one: "Public e-signature form for consignee indemnity letters.", features: ["Canvas signature", "PDF generated with mPDF", "Emailed and stored"], stack: ["PHP 8", "mPDF", "EmailJS"] },

  // Customer
  { id: "ccc", n: "CCC Warehouse Portal", cat: "cust", status: "live", one: "Multi-tenant pallet-tracking portal used by external warehouse customers.", features: ["Inbound → inventory → outbound → BOL", "Customer-tier access", "Automated report emails"], stack: ["PHP 8", "MariaDB", "mPDF", "n8n"] },

  // Internal
  { id: "pms", n: "PMS — Performance Appraisal", cat: "int", status: "live", one: "4-stage annual appraisal workflow for the office.", features: ["Employee → manager → reviewer → HR", "Year-wise tables", "3 PDF report formats"], stack: ["PHP", "MySQL", "Bootstrap"] },
  { id: "room", n: "Conference Room Booking", cat: "int", status: "live", one: "Room booking with a live wall-TV display.", features: ["30-min slots, conflict detection", "Public TV dashboard"], stack: ["PHP 8", "MySQL", "FullCalendar"] },
  { id: "annual", n: "OFW Annual Day 2026", cat: "int", status: "live", one: "Event app with OTP login and fair random team draw.", features: ["Age-band balanced team draw", "Teaser video launch"], stack: ["PHP 8.2 MVC", "MariaDB"] },

  // Personal
  { id: "daybook", n: "DayBook (Android)", cat: "own", status: "live", links: [["Download APK", "https://github.com/Vinoth-shan/DayBook/releases/download/v1.0/DayBook-v1.0.apk", "download"], ["Source on GitHub", "https://github.com/Vinoth-shan/DayBook", "github"]], one: "My own offline-first task and expense app — built in my free time, APK shipped.", features: ["Reminders until a task is done", "Linked expense tracking", "Colour-blind-safe SVG charts", "Optional Google Drive sync"], stack: ["React 19", "TypeScript", "Capacitor 7", "Android"] },
  { id: "wms", n: "WMS Monorepo", cat: "own", status: "early", one: "Warehouse management system foundation — web, mobile and API in one repo.", features: ["Turbo monorepo", "Shared types & tooling"], stack: ["TypeScript", "pnpm", "Turbo"] }
];
