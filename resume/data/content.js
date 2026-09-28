// Single source for all resume designs. Update here, then re-export the PDFs.
// PORTFOLIO: GitHub Pages URL (https://vinoth-shan.github.io/My-Profile/).
window.R = {
  name: "VINOTH S",
  title: "Software Developer, Systems & Automation",
  tagline: "I design, build and run the software a freight business runs on, from database architecture to AI document automation.",
  contact: {
    location: "Chennai, India",
    email: "vino18oct@gmail.com",
    phone: "+91 81247 10512",
    github: "github.com/Vinoth-shan",
    portfolio: "vinoth-shan.github.io/My-Profile"
  },
  summary: "Sole software developer at A.J. Worldwide's Chennai back office, supporting US and UK freight-forwarding operations. Teams bring me a business requirement; I own everything after that: architecture, data model, UI, APIs, n8n automation, AI integration, hosting and support. In three years that has become 36 live systems used by 250 operations staff, including two customer-facing products and AI pipelines that read hundreds of shipping documents a day. Before software I founded and ran a fabrication business supplying Indian Railways, so I build with cost, users and deadlines in mind.",
  metrics: [
    ["36", "live applications, built solo"],
    ["250", "operations staff using them"],
    ["6", "AI-integrated systems"],
    ["16", "n8n-automated systems"],
    ["23", "API-connected systems"],
    ["3 yrs", "as the sole developer"]
  ],
  ai: "I build with Claude as an AI pair programmer. I decide the architecture, data model and edge cases; Claude speeds up scaffolding, refactors, migrations and documentation; I review, test and can explain every line before it ships. It lets one developer deliver at the pace of a small team.",
  skills: [
    ["AI & automation", ["Claude (AI-driven development)", "n8n", "Google Gemini API", "Document extraction", "UiPath RPA", "Excel VBA"]],
    ["Backend & data", ["PHP 8 (custom MVC)", "REST API design", "MySQL / MariaDB", "Schema design & migrations", "Stored functions", "PDO"]],
    ["Frontend", ["JavaScript", "HTML / CSS", "Bootstrap / Tailwind", "React + TypeScript", "Capacitor (Android)", "Chrome extensions"]],
    ["Integrations", ["IMAP / Gmail", "Resend / EmailJS", "FMCSA API", "Google Maps & Address", "RDAP / WHOIS", "Webhooks"]],
    ["Documents & reporting", ["PhpSpreadsheet (chunked Excel ETL)", "SheetJS", "mPDF / FPDF / TCPDF", "KPI dashboards"]],
    ["Security & delivery", ["Agile, iterative delivery", "Git / GitHub", "Role-based access", "OTP two-factor login", "API keys & rate limits", "Linux hosting", "Cron jobs"]]
  ],
  experience: [
    {
      role: "Software Developer, Systems & Automation",
      org: "A.J. Worldwide Services",
      unit: "Office Framework Operation Gen",
      place: "Chennai",
      dates: "Oct 2023 – Present",
      award: "Extra Mile Award 2025–26 · recognised for performance and going beyond my role",
      intro: "Only developer in the organisation. I turn requirements from US and UK operations teams into production systems and run them end to end, working in agile, iterative cycles: ship a working first version fast, then keep adding features from user feedback.",
      groups: [
        ["AI & automation", [
          "Built an AI arrival-notice pipeline (25-node n8n workflow + Gemini 2.5 Flash) that reads 200–300 carrier PDFs a day, extracts BL and container data, matches the responsible operator and emails them automatically.",
          "Cut AI cost by removing duplicate PDFs with a content hash stored in the database before any document is sent to the model.",
          "Automated 16 systems with n8n: mailbox ingestion, webhook-driven status changes, escalation state machines and scheduled report emails.",
          "Earlier UiPath RPA bots (email routing, Outlook to Excel to database processing, scheduled scraping) removed about 3 FTE of manual work."
        ]],
        ["Platforms & architecture", [
          "Architecting a 103-table Sales Force Management System for US and UK entities with a central scope filter and role-based redaction of financial data (in staged development).",
          "Built the Ocean Exports Workspace: 34+ tables, 20 controllers, n8n ingestion, quotation PDFs and live links to billing and pricing tools.",
          "Standardised on custom PHP 8 MVC, MySQL/MariaDB and REST APIs with key authentication and rate limiting; every system is version-controlled in the company's private GitHub organization."
        ]],
        ["Customer products & security", [
          "Shipped ShipFlow-UK, air-freight tracking with a customer console and a rate-limited customer REST API, plus a multi-tenant warehouse portal for external customers.",
          "Built fraud-prevention tools: one-click Outlook sender verification (domain age, trusted vendors, address checks, AI scoring) and carrier verification using FMCSA federal data."
        ]],
        ["Finance & compliance workflows", [
          "Moved Excel-based work into audited web workflows: US customs entry (8 stages), ISF 10+2 filing, accounts receivable with 7 roles and OTP login, unbilled-revenue tracking, vendor-invoice escalation and dispute management.",
          "Replaced the company's ClickUp subscription with ProjectDesk, an in-house Kanban tracker with custom workflows and AI-drafted task descriptions."
        ]]
      ]
    },
    {
      role: "Founder",
      org: "MECHOD",
      unit: "Fabrication",
      place: "Chennai",
      dates: "Aug 2018 – Oct 2023",
      intro: "",
      groups: [
        ["", [
          "Founded and ran a fabrication business supplying Indian Railways (ICF) through public tenders.",
          "Handled procurement, production planning, quality control, costing and customer relations.",
          "Taught myself web development alongside the business and delivered freelance builds, including a warehouse-listing platform with Google Maps."
        ]]
      ]
    }
  ],
  projects: [
    ["Arrival Notice AI Pipeline", "n8n · Gemini · PHP · MariaDB", "Reads 200–300 carrier PDFs a day and routes each shipment to its operator."],
    ["Sales Force Management System", "PHP 8.2 · MariaDB · n8n", "103-table lead-to-customer platform for US and UK sales teams."],
    ["ShipFlow-UK", "PHP MVC · REST API · n8n", "Air-freight tracking with customer console and customer API."],
    ["Verify Sender", "Outlook VBA · PHP · Gemini · RDAP", "One-click email fraud check inside Outlook."],
    ["Trucker Tracker", "PHP · FMCSA · Gemini", "Carrier verification verdict from federal data and AI."],
    ["AR Workspace", "PHP · MySQL · OTP 2FA", "Receivables platform that replaced the Excel credit-control tracker."],
    ["Customs & ISF Entry", "PHP · MariaDB · n8n", "Operator-to-broker filing workflows with audit trails."],
    ["DayBook (personal)", "React 19 · TypeScript · Capacitor", "Offline-first Android task and expense app, built in my own time."]
  ],
  strengths: [
    ["End-to-end ownership", "From the first conversation with users to hosting and support."],
    ["Business sense", "Five years running my own company taught cost, deadlines and customers."],
    ["Agile delivery", "Ship a working first version, then improve it in short cycles from user feedback."],
    ["Fast, careful delivery", "AI-assisted speed with human review of every change."]
  ],
  education: [["B.E. Production Engineering", "Velammal Engineering College, Chennai", "2017", "CGPA 7.4"]],
  languages: [["Tamil", "Native"], ["English", "Professional"]],
  freelance: "Open to freelance work: custom web apps, n8n automation and AI integrations."
};
