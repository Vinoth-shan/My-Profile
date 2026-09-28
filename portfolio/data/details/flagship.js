// Public-safe project details (sanitised: no credentials, hosts, names or security findings).
Object.assign(window.DETAILS = window.DETAILS || {}, {
 "arn": {
  "purpose": "Carriers email a BL-style Arrival Notice PDF for every ocean import; someone had to open each one, key in the BL/vessel/containers/last free date, and find the right operator to forward it to.",
  "concept": "An n8n pipeline watches the mailbox, dedupes PDFs by hash, and sends new ones to Gemini 2.5 Flash for structured extraction; a PHP backend resolves the responsible operator against the daily Logysis TMS export and emails them.",
  "scope": {
   "in": [
    "PDF ingestion & dedup",
    "AI extraction (Gemini)",
    "operator resolution & routing",
    "ops review dashboard",
    "MBL correction workflow",
    "customer REST API"
   ],
   "out": [
    "shipment booking/tracking (Logysis)",
    "freight rating/invoicing",
    "customs filing (separate apps read this data)"
   ]
  },
  "roles": [
   [
    "Admin",
    "sees every operator's ARN records, manages users and roles"
   ],
   [
    "Operator",
    "sees only records where pdf_log.operator matches their username"
   ],
   [
    "Customer (API)",
    "read-only REST access to their own ARNs, bearer/API-key auth"
   ]
  ],
  "workflow": [
   [
    "Carrier email arrives",
    "n8n IMAP trigger pulls UNSEEN mail; INVP invoice PDFs are filtered out",
    "n8n"
   ],
   [
    "Dedup #1",
    "SHA-256 hash of the PDF checked against officedata.pdf_hash_table before any AI call",
    "n8n / MySQL"
   ],
   [
    "AI extraction",
    "Gemini 2.5 Flash reads the PDF with a 21-rule prompt, returns strict JSON header + container array",
    "Gemini"
   ],
   [
    "Dedup #2 + operator match",
    "MD5 recheck, then 3-stage match: exact BL, BL minus 4-char carrier prefix, then container LIKE",
    "System"
   ],
   [
    "Non-destructive upsert",
    "UPSERT pdf_log/pdf_log_containers with COALESCE so revised notices never blank good data",
    "System"
   ],
   [
    "Old-to-new MBL rename",
    "if Logysis corrects the BL, the existing row is renamed to keep its history",
    "System"
   ],
   [
    "Notify",
    "n8n Gmail node emails the resolved operator, CC'd to the maintainer",
    "n8n"
   ],
   [
    "Ops review",
    "dashboard filter/search/export, mark ARN actioned, correct a wrong MBL and re-notify",
    "Operator"
   ],
   [
    "Late-binding re-notify",
    "ARNs that arrive before the TMS record are resolved and emailed on the next Logysis import",
    "n8n"
   ]
  ],
  "modules": [
   [
    "Dashboard",
    "main filterable ARN list — date, operator, carrier, location, MBL/HBL/container, mismatch flags, Excel export"
   ],
   [
    "ARN Pending",
    "operator/location-pivoted view of Logysis shipments still missing a notice"
   ],
   [
    "View / Edit / Delete",
    "per-record CRUD on pdf_log, soft delete only"
   ],
   [
    "Mark ARN Actioned",
    "closes the loop against the Logysis shipment record"
   ],
   [
    "MBL Correction",
    "ops-corrected MBL re-fires an EmailJS notice to the operator"
   ],
   [
    "Remarks",
    "inline AJAX remark editor per ARN"
   ],
   [
    "User Management",
    "adds a user to the shared login table and the email-routing list together"
   ],
   [
    "Excel Ingestion",
    "daily Logysis shipment export + last-free-date feed, 28-column upsert"
   ]
  ],
  "dashboards": [
   [
    "ARN Dashboard",
    "filterable list with mismatch flags, soft-delete aware, exportable to Excel"
   ],
   [
    "ARN Pending",
    "shipments with no arrival notice yet, pivoted by operator and location"
   ]
  ],
  "records": [
   [
    "ARN (pdf_log)",
    "MBL/HBL, carrier, vessel, voyage, shipper/consignee, ports, ETA, last free date, IT no, payment method, weights"
   ],
   [
    "Container",
    "container no, seal, ISO code, size, type, qty, weight, last free date, pickup no"
   ],
   [
    "Logysis shipment",
    "shipment no, operator roles, BL/HBL, containers, ETA, last free date, ARN-received flag"
   ]
  ],
  "integrations": [
   [
    "Google Gemini 2.5 Flash",
    "structured JSON extraction from carrier PDFs"
   ],
   [
    "n8n",
    "IMAP triggers, dedup, orchestration, Gmail delivery"
   ],
   [
    "Logysis TMS",
    "daily Excel export used for operator resolution"
   ],
   [
    "EmailJS",
    "MBL-correction re-notify and manual-upload notice"
   ],
   [
    "Customer REST API",
    "bearer/API-key access to ARNs by shipment or MBL, PDF/zip download"
   ],
   [
    "Internal apps",
    "customs_entry, ISF entry and air imports read pdf_log read-only"
   ]
  ],
  "security": [
   "Admin-only role gate on a shared login table",
   "double dedup layer (SHA-256 + MD5) so neither layer can fail silently",
   "versioned customer API with bearer/API-key auth and coded JSON errors"
  ],
  "engineering": [
   "3-stage fuzzy operator matching (exact BL, BL minus carrier prefix, container LIKE) with multi-role merge and a management fallback",
   "non-destructive UPSERT via COALESCE(NULLIF()) so a partial revised notice never overwrites good data",
   "old-to-new MBL rename preserves the primary key and history when Logysis corrects a BL",
   "LLM prompt encodes ~20 real carrier-PDF edge cases: split-page MBLs, dash-separated prefixes, multiple last-free-dates, HBL fallback",
   "late-binding resolution auto-emails ARNs that arrived before their TMS record existed",
   "productized the data store into a versioned customer REST API on top of the same tables the dashboard uses"
  ],
  "outcomes": [
   "removed manual reading and keying of 200-300 carrier PDFs a day",
   "automatic routing to the correct operator across the India/Turkey team with a management fallback",
   "fed 3 downstream internal apps and a customer-facing self-serve API from one data store",
   "non-destructive upserts and doubled dedup eliminated a class of missed or misrouted notices"
  ]
 },
 "sfms": {
  "purpose": "A.J. Worldwide had no single place to see who owns which customer, no pipeline visibility, no fair credit on shared accounts, and no way to spot a customer who quietly stopped shipping.",
  "concept": "Every screen is judged against two tests — does it measure a sales person's work, or does it help find/win/keep business — with entity (US/UK) and scope (ALL/SELF/SUPPORT) filtering enforced by one central service and money redacted at the response layer, never in CSS.",
  "scope": {
   "in": [
    "account 360 & profiling",
    "visit logging & follow-ups",
    "pipeline & leads",
    "targets/achievement/GP split",
    "quiet-customer detection",
    "activity reporting & audit"
   ],
   "out": [
    "shipment ops/tracking (Logysis owns this)",
    "rating/quotation engine",
    "invoicing/receivables",
    "HR/payroll",
    "customer portal",
    "mobile app"
   ]
  },
  "roles": [
   [
    "Sales",
    "13 people; logs visits, manages mapped customers, runs deals, sees own target and GP"
   ],
   [
    "Sales Support",
    "~50 people; works every mapped seller's customers, sees customer/deal money, never a person's targets"
   ],
   [
    "Management",
    "team activity, pipeline, conversion and GP, drillable company to branch to person to account"
   ],
   [
    "Admin",
    "users, roles, ownership + support mapping, master data, imports, audit"
   ]
  ],
  "workflow": [
   [
    "Log a visit",
    "under 3 minutes with photo and visiting card, persons met, outcome, next action",
    "Sales"
   ],
   [
    "Follow-up created",
    "every outcome creates a next action with a date and an owner",
    "System"
   ],
   [
    "Support chases the queue",
    "multi-seller follow-up queue, profiling, flags a rate they can't quote to the field",
    "Support"
   ],
   [
    "Deal moves through pipeline",
    "Qualifying through Won, with a mandatory win/loss reason and competitor on close",
    "Sales"
   ],
   [
    "Quiet-customer check",
    "accounts with no shipment/visit in 100 days are raised to everyone mapped to it",
    "System"
   ],
   [
    "Manager reviews the week",
    "team activity, pipeline, overdue follow-ups, quiet customers, without asking for a report",
    "Manager"
   ],
   [
    "Targets & GP import",
    "achievement and GP are imported from a Logysis monthly template, never self-declared",
    "System / n8n"
   ],
   [
    "Management drills down",
    "company to branch to sales person to account to a single visit",
    "Manager"
   ],
   [
    "Admin maintains mappings",
    "ownership and support mapping decide what everyone else can see",
    "Admin"
   ]
  ],
  "modules": [
   [
    "Account 360",
    "profile, 8-section profiling with completeness score, contacts, vendor mapping, documents"
   ],
   [
    "Visit Log",
    "sub-3-minute visit entry with photo/card, joint visits recorded once"
   ],
   [
    "Follow-up Tracker",
    "chase, complete with outcome, reschedule with a reason, hand back to the field"
   ],
   [
    "Support Workspace",
    "multi-seller queue, owning seller on every row, flags to the field"
   ],
   [
    "Pipeline / Deal Board",
    "stages with ageing, mandatory win/loss reason and competitor on close"
   ],
   [
    "Quiet Customer Engine",
    "100-day no-activity rule, escalation, self-closing alert"
   ],
   [
    "Targets & Achievement",
    "target setting with approval/lock, equal GP split shown against the total"
   ],
   [
    "Admin Console",
    "users, ownership + support mapping, 25 master-data screens with Excel import"
   ],
   [
    "Report Library",
    "42 reports with Excel and PDF export"
   ]
  ],
  "dashboards": [
   [
    "Sales dashboard",
    "today's visits, follow-ups, overdue in red, target gap for the month, open deals"
   ],
   [
    "Support dashboard",
    "per-seller open/overdue/due-today tiles, profiles below 70%, quiet customers — no target anywhere"
   ],
   [
    "Management cockpit",
    "activity to pipeline to conversion to gross profit, per person/branch/service"
   ],
   [
    "Quiet Customer view",
    "customers over 100 days with no job, each with an action or a recorded reason"
   ]
  ],
  "records": [
   [
    "Account",
    "profile, 1-3 owning sellers, GP split totalling 100%, profiling completeness score"
   ],
   [
    "Contact",
    "decision makers, receiving hours, visiting-card capture"
   ],
   [
    "Visit",
    "persons met, minutes, action items, competitors, lanes discussed"
   ],
   [
    "Follow-up",
    "owner, due date, outcome, reschedule reason"
   ],
   [
    "Deal / Lead",
    "stage, service line, trade lane, volume, expected GP, close date, loss reason"
   ],
   [
    "Target / Achievement",
    "credited GP, equal split across owning sellers"
   ]
  ],
  "integrations": [
   [
    "Resend",
    "OTP delivery for two-factor login"
   ],
   [
    "n8n",
    "customer master import with an exception queue; monthly GP import from a Logysis template"
   ],
   [
    "Logysis",
    "source of truth for achievement/GP — never self-declared in the app"
   ]
  ],
  "security": [
   "4-role matrix (SALES/SUPPORT/MGMT/ADMIN) with two independent role switches for financials vs. targets",
   "money redacted at the response payload, proven live by opening page source",
   "single central scope-filter service (ALL/SELF/SUPPORT) — no screen hand-rolls a WHERE owner_id",
   "entity isolation: every query bounded to the active US/UK operation, no consolidated view, ever",
   "full audit_log with old/new JSON values on every create, update, delete"
  ],
  "engineering": [
   "a sales person who also supports a colleague passes the financials role gate but must still lose that colleague's customer money — solved by stripping the whole restricted-column set per customer, not the role's blocklist",
   "ownership invariants (exactly one primary, one current handler, GP split totalling 100.00) enforced in a service layer, not in forms",
   "103-table schema built ahead of need so later modules (targets, achievement, notifications) never trigger a rebuild",
   "dependency-free test suite with a PEND state so specs stay green while waiting on real business data (support staff names, real customer master)",
   "quiet-customer detection with a self-closing, escalating alert instead of a static report"
  ],
  "outcomes": [
   "single source of truth for 13 sales people and ~50 support staff, replacing ad hoc spreadsheet tracking",
   "fair GP credit on shared customers — 11 of 27 ownership patterns in the live customer master are shared across 2-3 sellers",
   "surfaces customers quietly gone 100+ days without a shipment, previously invisible to management",
   "targets zero manual Excel activity reports circulated for weekly review meetings",
   "in development for A.J. Worldwide's US and UK sales operations"
  ]
 },
 "oex": {
  "purpose": "AJWW's US ocean export team tracked shipments and bookings in spreadsheets with no shared view across the Operations, Trucking and Documentation desks and no consistent milestone discipline.",
  "concept": "An MVC app where every shipment and booking is owned by a desk team, milestones are standardized events, and n8n automates the Outlook-attachment-to-database step that used to be manual re-typing.",
  "scope": {
   "in": [
    "shipment tracking",
    "bookings & quotation workflow",
    "milestones",
    "desk remarks & follow-ups",
    "unbilled/BT invoice visibility",
    "pricing-tool quotation lookup"
   ],
   "out": [
    "invoicing/AR itself (separate trackers)",
    "rating engine (external pricing tool owns pricing)"
   ]
  },
  "roles": [
   [
    "Controller",
    "admin — user access, data validation, full visibility across desks"
   ],
   [
    "User / Operator",
    "desk-scoped shipment tracking, milestone recording, remarks, follow-ups"
   ]
  ],
  "workflow": [
   [
    "Outlook attachment arrives",
    "n8n watches the mailbox for .xlsx attachments",
    "n8n"
   ],
   [
    "Token-authenticated upload",
    "n8n POSTs the workbook whole to /api/n8n/upload with X-OE-Token",
    "n8n"
   ],
   [
    "Streamed upsert",
    "rows read from row 4, upserted by Shipment No, an empty cell never wipes a value",
    "System"
   ],
   [
    "Auto-deactivation",
    "shipments the file no longer carries are deactivated, not deleted",
    "System"
   ],
   [
    "Desk assignment",
    "each shipment is owned by Operations, Trucking or Documentation",
    "System"
   ],
   [
    "Milestones recorded",
    "standardized events (ETD, Gate In, Vessel Departure, etc.) logged per shipment",
    "Operator"
   ],
   [
    "Booking created",
    "quotation fetched from the pricing tool, handed to a desk user as a new booking",
    "Operator"
   ],
   [
    "Unbilled/BT sync",
    "shipment cards show live unbilled and BT-pending invoice counts from two other databases",
    "System"
   ],
   [
    "Every change audited",
    "milestone, remark and booking edits log to activity_log with user and timestamp",
    "System"
   ]
  ],
  "modules": [
   [
    "Shipments",
    "desk-scoped list, drawer detail, customizable/exportable columns"
   ],
   [
    "Bookings",
    "quotation-to-booking workflow, BKSE+YYMM+3-digit numbering"
   ],
   [
    "Booking Assignment",
    "fetch a won pricing-tool quotation and hand it to a desk user"
   ],
   [
    "Milestones",
    "standardized progress events, searchable by date and type"
   ],
   [
    "Remarks",
    "desk-specific notes plus a pricing remark on handovers"
   ],
   [
    "Follow-ups",
    "bell notifications, overdue tracking"
   ],
   [
    "Data Upload",
    "manual + n8n Excel ingestion with a validation report"
   ],
   [
    "Unbilled & BT Tracking",
    "cross-database invoice exposure shown on the shipment card"
   ],
   [
    "Quotation PDF",
    "FPDF-generated quotation document"
   ]
  ],
  "dashboards": [
   [
    "Shipments view",
    "per-desk list with Last Update column, Last Edit filter, sortable and exportable"
   ],
   [
    "Data Checks",
    "upload validation report — empty cells, deactivated shipments"
   ],
   [
    "Activity Log",
    "every milestone, remark, and booking change with user and timestamp"
   ]
  ],
  "records": [
   [
    "Shipment",
    "shipment no, master/house no, operator, ETD/ETA/POD, cargo type, last updated at"
   ],
   [
    "Booking",
    "booking no, quotation reference, container types, pickup/POD"
   ],
   [
    "Milestone",
    "type, date, user, timestamp"
   ],
   [
    "Remark",
    "desk, text, pricing remark on handover"
   ]
  ],
  "integrations": [
   [
    "n8n",
    "webhook upload of Outlook attachments, token-authenticated"
   ],
   [
    "Resend",
    "OTP delivery and password reset"
   ],
   [
    "Pricing Tool API",
    "fetch quotations by number for bookings"
   ],
   [
    "Unbilled Tracker DB",
    "separate MySQL instance, invoice count on shipment cards"
   ],
   [
    "BT Invoice Tracker DB",
    "separate officedata database, BT-pending head card"
   ],
   [
    "FPDF",
    "quotation PDF generation"
   ]
  ],
  "security": [
   "token-authenticated n8n webhook (X-OE-Token)",
   "OTP two-factor login with 7-day trusted-device tokens",
   "per-user, per-tab access grants",
   "full audit trail on every milestone/remark/booking change"
  ],
  "engineering": [
   "row-by-row streamed Excel ingestion handles 10,000-row registers inside a 10-minute n8n timeout",
   "upsert-by-shipment-no with non-destructive empty-cell handling and automatic deactivation of dropped rows",
   "integrates 3 separate MySQL databases (own DB, Unbilled tracker, BT tracker on latin1) without direct joins",
   "28+ idempotent, ordered SQL migrations safe to re-run on every deploy",
   "desk-based ownership with booking-borrowed user attribution when the sheet's own column is empty",
   "in-place booking renumbering migration (BKSE+YYMM+3-digit) rewritten across every table and log sentence"
  ],
  "outcomes": [
   "replaced spreadsheet-based shipment tracking for the whole ocean export team",
   "gives Operations, Trucking and Documentation a shared, audited, real-time view of every shipment and booking",
   "automated the manual Outlook-attachment-to-spreadsheet workflow via n8n",
   "surfaces unbilled and BT-pending invoice exposure directly on the shipment card"
  ]
 },
 "ar": {
  "purpose": "",
  "concept": "A dedicated AR system — its own database and bcrypt+OTP auth, not the shared AJ login table — with 7 distinct roles and two-layer (frontend + backend) access enforcement on every one of its 40+ endpoints.",
  "scope": {
   "in": [
    "invoice tracking (36+ dims)",
    "org-level summary & credit analysis",
    "claims & write-off",
    "credit over-limit monitoring",
    "duty invoice segregation",
    "AP cross-reference",
    "cash account split",
    "CM reassignment"
   ],
   "out": [
    "shipment ops (Logysis)",
    "general ledger/accounting",
    "email trigger (Phase 3, planned)",
    "interactive dashboards (Phase 4, planned)"
   ]
  },
  "roles": [
   [
    "Controller",
    "full access; only role that creates users, uploads all 8 tabs, or sees email trigger"
   ],
   [
    "Super Admin / Admin",
    "full record access except transaction data; cash split and CM reassignment"
   ],
   [
    "Management",
    "view-only summary and transaction data, collection card visible"
   ],
   [
    "User (Collection Manager)",
    "CM-filtered view, defaults to own username"
   ],
   [
    "Sales Person",
    "salesman-filtered summary view only"
   ],
   [
    "Viewer",
    "read-only across records except transaction data"
   ]
  ],
  "workflow": [
   [
    "Monthly Excel upload",
    "Detailed/Summary/AP workbooks uploaded through an 8-tab interface",
    "Controller"
   ],
   [
    "Parse & map columns",
    "PhpSpreadsheet parses the workbook, maps columns by header text",
    "System"
   ],
   [
    "Detailed refresh",
    "TRUNCATE + bulk insert; first upload of the month archived to history",
    "System"
   ],
   [
    "Summary smart upsert",
    "per-organization upsert preserving remarks JSON and follow-up date; new orgs need approval",
    "System / Controller"
   ],
   [
    "Assigned-column classification",
    "each row auto-classified against the collection_managers table on every upload",
    "System"
   ],
   [
    "Collection manager works the queue",
    "sets remarks and follow-up dates on their CM-filtered organizations",
    "User"
   ],
   [
    "Bulk CM reassignment / cash split",
    "admin reassigns organizations or splits the Cash Accounts portfolio by amount range",
    "Admin"
   ],
   [
    "OTP login",
    "bcrypt password plus a 6-digit, 10-minute OTP with a 5-attempt cap",
    "System"
   ],
   [
    "Server-side access enforcement",
    "every data and export endpoint adds WHERE clauses from getAccessContext() regardless of frontend params",
    "System"
   ]
  ],
  "modules": [
   [
    "Detailed Records",
    "36+ column invoice list with filters, pagination, export"
   ],
   [
    "Summary Records",
    "org-level rollup with remarks and follow-up tracking"
   ],
   [
    "Claims & Write-Off",
    "claims list with JSON-backed storage"
   ],
   [
    "Credit Over-Limit",
    "over-limit organization monitoring"
   ],
   [
    "Duty Invoices",
    "duty invoice segregation and tracking"
   ],
   [
    "AP Invoices",
    "accounts-payable cross-reference"
   ],
   [
    "Data Uploads",
    "8-tab admin interface for all upload types"
   ],
   [
    "User Access Management",
    "per-user collection-manager access list"
   ],
   [
    "Cash Account Split",
    "amount-range distribution across sub-collection managers"
   ],
   [
    "Collection Manager Reassignment",
    "bulk reassignment with audit trail"
   ],
   [
    "Activity Log",
    "full filterable audit history across 5 activity streams"
   ]
  ],
  "dashboards": [
   [
    "Home dashboard",
    "4 cycling hero cards, priority collections by 60/90/120+ day aging, duty/outstanding/overlimit rows, 60s auto-refresh"
   ],
   [
    "Activity Log",
    "filterable, exportable, unlimited audit trail behind the capped Home feed"
   ]
  ],
  "records": [
   [
    "Detailed invoice",
    "organization, CM, salesman, reference/transaction/house/master/container no, aging buckets 1-30 through 120+, credit days/limit"
   ],
   [
    "Summary org record",
    "organization, outstanding, unbilled value, remarks JSON, next follow-up date and reason"
   ],
   [
    "Claims / write-off",
    "JSON-array records stored per organization"
   ],
   [
    "AP invoice",
    "vendor invoice no/date, outstanding USD, netting AR/AP"
   ],
   [
    "Cash account split",
    "username, min/max outstanding-amount range"
   ]
  ],
  "integrations": [
   [
    "Resend",
    "OTP email for login, add-user, and password reset"
   ],
   [
    "PhpSpreadsheet",
    "Excel parsing for uploads and Excel generation for exports"
   ]
  ],
  "security": [
   "bcrypt password hashing plus 6-digit OTP two-factor (10-min expiry, 5-attempt cap)",
   "7-role access matrix enforced at both UI and API layers",
   "two-layer enforcement — every data and export endpoint funnels through getAccessContext()",
   "PDO prepared statements everywhere, no string-concatenated SQL",
   "custom session save path with a 30-day lifetime to survive shared-hosting session GC"
  ],
  "engineering": [
   "4-branch assigned-column classification algorithm run identically on every detailed and summary upload",
   "smart summary upsert that preserves remarks JSON and follow-up dates across a full monthly refresh, gated by a new-organization approval modal",
   "cash account split system distributing one large shared portfolio across sub-collection-managers by outstanding-amount range",
   "two-layer access enforcement so no data leaks via URL manipulation across 40+ endpoints",
   "lazy-search organization picker handling 12,000+ orgs with debounced, DOM-bound events to avoid inline-onclick XSS from special characters in org names",
   "bulk CM reassignment updates detailed and summary tables atomically with a full audit trail"
  ],
  "outcomes": [
   "replaced multi-file Excel AR tracking with one real-time, multi-user system",
   "automatic detection of unassigned or misassigned collection-manager accounts across ~12,000 organizations",
   "role-based data privacy for 7 user types where everyone previously saw everything",
   "audits ~10,000+ detailed invoice records per upload cycle; the largest and most mature app in the AJ stack"
  ]
 },
 "verify": {
  "purpose": "AJ Worldwide staff were exposed to business email compromise — lookalike domains, brand-new domains used to reroute payments, free-mailbox impersonation of real customers, brokers and truckers — with no way to check a sender without leaving Outlook.",
  "concept": "An Outlook macro sends message metadata to a PHP API that runs a 5-stage fraud pipeline on every distinct address on the message and returns a verdict popup that lets the user grow a trusted-vendor allowlist with one click.",
  "scope": {
   "in": [
    "sender/domain verification",
    "typosquat detection",
    "domain-age check",
    "AI fraud classification",
    "trusted-vendor allowlist",
    "audit logging"
   ],
   "out": [
    "automated email blocking/filtering (advisory only)",
    "inbox-wide scanning (button-triggered only)",
    "any UI beyond the Outlook popup"
   ]
  },
  "roles": [
   [
    "Outlook user",
    "clicks Verify Sender on a suspicious email, can Add Email/Domain to the trusted list"
   ]
  ],
  "workflow": [
   [
    "User clicks Verify Sender",
    "on a suspicious email inside Outlook",
    "Operator"
   ],
   [
    "Macro posts metadata",
    "From/To/CC/Reply-To/Subject/first 8KB of body plus a shared secret",
    "Client"
   ],
   [
    "Trusted lookup",
    "",
    "System"
   ],
   [
    "Typosquat check",
    "Levenshtein distance <=2 against every trusted domain",
    "System"
   ],
   [
    "Domain age via RDAP",
    "skipped for generic mailbox providers where age is meaningless",
    "System"
   ],
   [
    "AI classification",
    "Gemini 2.5 Flash strict-JSON fraud read, only for untrusted addresses",
    "Gemini"
   ],
   [
    "Verdict rollup",
    "worst per-address score becomes the overall verdict returned to the popup",
    "System"
   ],
   [
    "Grow the allowlist",
    "user clicks Add Email or Add Domain directly from the verdict popup",
    "Operator"
   ],
   [
    "Audit log",
    "every address scanned is logged with verdict, score, reasons and AI output",
    "System"
   ]
  ],
  "modules": [
   [
    "Verify Sender endpoint",
    "the 5-stage pipeline, called per message"
   ],
   [
    "Add Trusted endpoint",
    "grows the allowlist from the popup, idempotent"
   ],
   [
    "Outlook popup",
    "per-address verdict cards with Add Email/Add Domain buttons"
   ]
  ],
  "dashboards": [],
  "records": [
   [
    "Trusted vendor",
    "company name, domain, contact email, role (trucker/broker/customer/internal), approved by/on"
   ],
   [
    "Verification log",
    ""
   ]
  ],
  "integrations": [
   [
    "Google Gemini 2.5 Flash",
    "JSON-mode fraud classification for untrusted addresses"
   ],
   [
    "RDAP",
    "free domain-age lookup, no API key"
   ],
   [
    "Outlook VBA macro",
    "sole client, installed per user, not in this repo"
   ]
  ],
  "security": [
   "shared-secret auth compared with hash_equals to avoid timing leaks",
   "full per-address audit trail on every scan"
  ],
  "engineering": [
   "5-stage pipeline short-circuits on a trust match so known-good senders skip AI/typosquat cost entirely",
   "typosquat detection via Levenshtein distance against every trusted domain, tuned for freight-industry lookalikes",
   "domain-age check skipped for generic mailbox providers since age is meaningless for 20-year-old giants",
   "worst-per-address verdict rollup across every From/To/CC address, not just the visible sender",
   "idempotent add-trusted endpoint refreshes approval metadata rather than erroring on a duplicate",
   "full forensic logging (AI analysis, red flags, matched-via path) per address for later BEC investigation"
  ],
  "outcomes": [
   "gives every AJ Worldwide Outlook user a one-click BEC check without leaving their inbox",
   "self-growing trusted-vendor allowlist that starts empty and only grows from real user approvals",
   "full audit trail of every fraud check for later investigation"
  ]
 },
 "trucker": {
  "purpose": "AJ's dispatch/broker team needed to quickly verify a carrier's legitimacy against a rising pattern of carrier-identity fraud, without manually cross-checking FMCSA, address records and the web for every MC/DOT number, email or company name.",
  "concept": "A single search box that queries the federal FMCSA registry and layers an AI fraud assessment with live web grounding plus a physical-address trust check, caching every result by the literal raw input so lookalike inputs keep their own warning history.",
  "scope": {
   "in": [
    "carrier lookup by MC/DOT/email/domain/name",
    "AI fraud scoring",
    "address trust classification",
    "manual fraud flag",
    "search history/cache"
   ],
   "out": [
    "booking/dispatch itself",
    "automated blocking",
    "bulk carrier import"
   ]
  },
  "roles": [
   [
    "Team user",
    "searches carriers, raises or clears a fraud flag; no admin UI, users are added via phpMyAdmin"
   ]
  ],
  "workflow": [
   [
    "Enter MC/DOT/email/domain/name",
    "single input drives every lookup path",
    "Operator"
   ],
   [
    "Check local cache",
    "most recent search matching the literal raw input, skipped on force-refresh or a prior miss",
    "System"
   ],
   [
    "Query FMCSA SODA",
    "authoritative legal name, address, phone, status, fleet; falls back to a Cloudflare Worker if blocked",
    "System"
   ],
   [
    "Gemini fuzzy lookup",
    "name/domain/ambiguous-number searches use Gemini 2.5 Pro with Google Search grounding",
    "Gemini"
   ],
   [
    "Gemini fraud assessment",
    "runs on every result regardless of lookup path",
    "Gemini"
   ],
   [
    "Address trust check",
    "Google Address Validation + Places classifies office/home/mailbox-shop/PO Box",
    "System"
   ],
   [
    "Verdict screen",
    "combined FMCSA + AI + address + prior flags rendered as one screen",
    "System"
   ],
   [
    "Raise/clear fraud flag",
    "persists on the carrier across all future searches",
    "Operator"
   ],
   [
    "Every search logged",
    "including misses, as an append-only audit trail",
    "System"
   ]
  ],
  "modules": [
   [
    "Carrier Search",
    "single input, multi-source lookup pipeline"
   ],
   [
    "Verdict Screen",
    "combined FMCSA + AI + address + flag display"
   ],
   [
    "Fraud Flag",
    "raise/clear, persists across future searches"
   ],
   [
    "Stats",
    "hero card drill-downs"
   ],
   [
    "Password Reset",
    "Resend-backed forgot-password flow"
   ]
  ],
  "dashboards": [
   [
    "Search verdict screen",
    "hero stat cards with drill-down stats per lookup"
   ]
  ],
  "records": [
   [
    "Company",
    "MC#, DOT#, address, fleet, fraud flags — one row per carrier"
   ],
   [
    "Search",
    "raw input, cached AI response, timestamp — append-only audit/cache log"
   ],
   [
    "User",
    "login, forced password reset flag"
   ]
  ],
  "integrations": [
   [
    "FMCSA SODA API",
    "direct federal carrier lookup, Cloudflare Worker fallback"
   ],
   [
    "Google Gemini 2.5 Pro",
    "fuzzy lookup and fraud assessment with Google Search grounding"
   ],
   [
    "Google Address Validation + Places",
    "registered-address trust classification"
   ],
   [
    "Resend",
    "password reset email"
   ]
  ],
  "security": [
   "session cookies with CSRF tokens",
   "bcrypt password hashing",
   "forced password reset for new users"
  ],
  "engineering": [
   "literal-raw-input cache key (not normalized) so a lookalike input keeps its own mismatch warning instead of silently merging into the canonical record",
   "Cloudflare Worker fallback proxy for FMCSA calls when a host firewall blocks direct SODA access",
   "Gemini fraud assessment grounded via live Google Search across freight-specific verification sites, not training data alone",
   "long-running Gemini calls (60-120s) handled with an explicit extended time limit to survive host request timeouts",
   "independent address-trust scoring layer (office/home/mailbox-shop/PO Box) on top of the federal record",
   "cached no-match results excluded from cache hits so a transient FMCSA failure never becomes a false negative"
  ],
  "outcomes": [
   "gives the dispatch/broker team one verdict screen instead of manually cross-checking FMCSA, address and web sources per carrier",
   "persistent fraud-flag system so one team member's finding protects the whole team on future lookups",
   "full audit trail of every carrier search, including misses, for pattern review"
  ]
 },
 "shipflow": {
  "purpose": "AJ's UK air-freight operation needed to know where each BL actually sits in the ground-handling pipeline and its handover/POD status — raw Logysis fields alone don't compute that.",
  "concept": "Every BL becomes a live record with a computed pipeline stage and completion status, fed by a 30-minute n8n Logysis sync or manual upload, with full change history and a documented customer REST API.",
  "scope": {
   "in": [
    "shipment ingestion (n8n + manual)",
    "computed pipeline stage/completion",
    "vendor handover & POD tracking",
    "stuck-shipment alerting",
    "full change history",
    "customer REST API",
    "reports"
   ],
   "out": [
    "booking/quotation",
    "invoicing",
    "US operations (this app is UK-only)"
   ]
  },
  "roles": [
   [
    "Operator",
    "reads internal shipment data"
   ],
   [
    "Admin",
    "manages Operator/Admin users, manual upload, edits shipments"
   ],
   [
    "Controller",
    "everything, including managing Admins and rotating the n8n sync secret"
   ],
   [
    "Customer (API)",
    "scoped to their own customer_company or origin agent"
   ]
  ],
  "workflow": [
   [
    "n8n pulls the Logysis attachment",
    "every 30 minutes",
    "n8n"
   ],
   [
    "Sync posted to the app",
    "JSON to /api/sync with an X-Sync-Secret header",
    "n8n / System"
   ],
   [
    "Transactional upsert",
    "ShipmentImporter diffs each row against shipments_master, shared with manual upload",
    "System"
   ],
   [
    "Shipper-ref parsed once",
    "compact vendor/qty string parsed into structured JSON at ingest",
    "System"
   ],
   [
    "Pipeline stage computed",
    "6-rule classifier over milestone dates + parsed vendors",
    "System"
   ],
   [
    "Completion computed",
    "customer remarks mapped to IN_TRANSIT/PARTIAL/COMPLETED",
    "System"
   ],
   [
    "History snapshot on real change only",
    "stage_entered_at preserved when the stage is unchanged",
    "System"
   ],
   [
    "Stuck alerts",
    "amber/red flags from per-stage duration thresholds",
    "System"
   ],
   [
    "Customer self-service",
    "pulls AWB status, POD and invoice files via the versioned REST API",
    "Customer"
   ]
  ],
  "modules": [
   [
    "Shipments list/detail",
    "full BL record with a history tab"
   ],
   [
    "Manual Upload",
    "Excel/CSV ingestion with a read-only dry-run preview before commit"
   ],
   [
    "Sync Logs",
    "per-ingest result rows — totals, status, source"
   ],
   [
    "Admin Users",
    "Operator/Admin/Controller/Customer account management"
   ],
   [
    "Sync Secret Rotation",
    "Controller-only, audited, takes effect immediately"
   ],
   [
    "Reports",
    "operational reporting"
   ],
   [
    "Customer API",
    "Basic Auth, ping/shipment/file endpoints, live test console"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "pipeline stage distribution and stuck amber/red alerts"
   ],
   [
    "Sync Logs",
    "n8n ingest history — totals, status, source per run"
   ],
   [
    "Reports",
    "operational reporting view"
   ]
  ],
  "records": [
   [
    "Shipment",
    "AWB/BL, milestone timestamps, vendors_parsed JSON, computed pipeline_stage + completion_status, stage_entered_at"
   ],
   [
    "Shipment history",
    "full snapshot per real change, newest first"
   ],
   [
    "Upload log",
    "totals, status, source (n8n or manual) per ingest"
   ],
   [
    "User",
    "access_type role, customer_company scope for CUSTOMER accounts"
   ]
  ],
  "integrations": [
   [
    "n8n",
    "30-minute Logysis email sync via /api/sync, shared-secret authenticated"
   ],
   [
    "Resend",
    "forgot-password email"
   ],
   [
    "Customer REST API",
    "Basic Auth, AWB status plus POD and invoice file download"
   ]
  ],
  "security": [
   "constant-time shared-secret comparison on the n8n sync endpoint",
   "CSRF token on every non-GET route except /api/sync",
   "4-role RBAC with CUSTOMER scoped to their own company/agent",
   "out-of-scope AWBs and files return 404, not 403, so customers can't enumerate other accounts",
   "Controller-rotatable sync secret with a full audit trail",
   "app/ code kept outside the web root"
  ],
  "engineering": [
   "pure 6-rule PipelineStage classifier (milestone dates + parsed vendor mix -> stage) shared identically by n8n and manual ingestion",
   "one transactional upsert path for n8n JSON and manual Excel, writing a history snapshot only on real change and preserving stage_entered_at so stuck-alerts stay meaningful",
   "shipper-ref mini-parser turns a compact string like vendor(qty)+vendor(qty) into structured JSON once at ingest",
   "per-stage amber/red stuck thresholds configurable without a deploy",
   "event-based history API — consecutive no-op syncs are never listed, so integrators resume safely from last_updated_at",
   "account-scoped 404s (not 403s) prevent customers from enumerating other accounts' shipments"
  ],
  "outcomes": [
   "gives the UK team a live, computed view of where every BL sits in the ground-handling pipeline instead of raw Logysis fields",
   "automated the manual Logysis-email-to-spreadsheet workflow via a 30-minute n8n sync",
   "gives customers self-service AWB, POD and invoice access through a documented REST API with a live test console",
   "used by the UK team; the customer REST API and console are live"
  ]
 },
 "pdesk": {
  "purpose": "A.J. Worldwide replaced ClickUp with a purpose-built internal tracker to control cost and match the workflow — fixed roles, a fixed status pipeline, and AI-assisted task descriptions — to how the office actually works.",
  "concept": "A kanban/list board where every task carries explicit per-task roles (Assigner/Assigned-to/Editor/Viewer), a fixed 7-stage status pipeline with full timestamped history, and parent/sub-task completion rules that mirror how work actually cascades.",
  "scope": {
   "in": [
    "task/sub-task/sibling-task creation",
    "per-task RBAC",
    "status pipeline with history",
    "comments & @-mentions",
    "attachments",
    "AI description generation",
    "dashboards, reports, time metrics"
   ],
   "out": [
    "time tracking/billable hours",
    "external notifications (email/SMS/Slack) in v1",
    "mobile native apps",
    "multi-tenant support",
    "comment editing/deletion"
   ]
  },
  "roles": [
   [
    "Owner",
    "only role that creates/disables/deletes accounts or changes roles; full access"
   ],
   [
    "Admin",
    "creates tasks on any product, auto-Editor on every task, cannot touch Owner accounts"
   ],
   [
    "User",
    "raises requests, sees only tasks where they hold a role"
   ]
  ],
  "workflow": [
   [
    "Create a top-level task",
    "product + title + description + dates + members in one form",
    "User"
   ],
   [
    "AI Generate",
    "rewrites rough notes into a structured description via Gemini, rate-limited 10 calls/5min",
    "System / Gemini"
   ],
   [
    "Enters Queue",
    "at the top of the column for every Assigned-to member",
    "System"
   ],
   [
    "Pick-up",
    "Assigned-to sets Start Date + Revised Expected Date; status auto-moves Queue to TO DO",
    "Assigned-to"
   ],
   [
    "Sub-tasks / sibling tasks",
    "Assigner creates sub-tasks (members inherited, overridable) or siblings (members fresh)",
    "Assigner"
   ],
   [
    "Status progression",
    "In Progress to Under Review to Testing to Completed/Rejected, every move timestamped with actor",
    "Assigner / Assigned-to / Admin / Owner"
   ],
   [
    "Comment thread",
    "@-mentions and attachments alongside the task for anyone with a role",
    "Editor / Assigner / Assigned-to"
   ],
   [
    "Completion cascade",
    "completing a parent with open sub-tasks prompts a complete-all confirmation; reopening one auto-reopens the parent",
    "System"
   ],
   [
    "Analytics at read time",
    "lead time, cycle time, time-in-status and productivity computed from status_history, no new schema",
    "System"
   ]
  ],
  "modules": [
   [
    "Kanban/List Board",
    "toggleable views, 7 status columns, filter pills with live counts"
   ],
   [
    "Task/Sub-task Detail",
    "Timing card plus a full status-history timeline"
   ],
   [
    "Comments",
    "@-mentions and per-comment attachments"
   ],
   [
    "Attachments",
    "task- and comment-bound, type-specific tile rendering"
   ],
   [
    "AI Description Generator",
    "Gemini-backed rewrite of rough notes into a structured description"
   ],
   [
    "Dashboard",
    "company-wide hero stats, status x user load matrix, aging/due-this-week/recently-completed panels"
   ],
   [
    "Reports",
    "throughput, cycle/lead time, bottleneck panel, per-product breakdown"
   ],
   [
    "Admin Users/Audit",
    "account management and account-level audit log"
   ],
   [
    "Profile",
    "self-service identity and password change"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "hero stats strip, status x user matrix split parent/sub-task, aging open tasks, due this week, recently completed, per-product breakdown"
   ],
   [
    "Reports",
    "throughput tiles, average cycle/lead time, status mix bar, bottleneck panel, per-user productivity, 7-day sparkline"
   ]
  ],
  "records": [
   [
    "Task / Sub-task",
    "parent_task_id, status, request/expected/revised/started/completed dates"
   ],
   [
    "Task member",
    "per-task role: Assigner, Assigned-to, Editor, Viewer"
   ],
   [
    "Status history",
    "from, to, actor, timestamp, auto_reason"
   ],
   [
    "Comment / Mention",
    "markdown-lite text with @-mention notifications"
   ],
   [
    "Attachment",
    "SHA-256 content-addressed file, task- or comment-bound"
   ],
   [
    "Product",
    "groups related tasks, auto-created on first use"
   ]
  ],
  "integrations": [
   [
    "Google Gemini 2.5 Flash",
    "AI task-description generation via cURL"
   ],
   [
    "Pusher Channels",
    "optional real-time board updates with a polling fallback (Phase 8)"
   ]
  ],
  "security": [
   "bcrypt cost-12 hashing with a server-side pepper, session regeneration on login, login throttling, forced reset",
   "SHA-256 content-addressed attachment storage outside the web root behind a gated download endpoint",
   "server-side MIME plus extension allowlist blocking every executable/script type",
   "per-user AI rate limit (10 calls/5 min) counted from the activity log so a misconfigured key can't be hammered",
   "granular per-task RBAC enforced from one Rbac.php source of truth"
  ],
  "engineering": [
   "per-task (not just per-user) RBAC with 4 distinct role capabilities and role-combination rules — Editor plus Assigner picks up the broader role",
   "parent/sub-task completion cascade with a confirm-all prompt and auto-reopen-parent-on-sub-task-reopen, each recorded in status history with its cause",
   "UTC-everywhere storage with a viewer-timezone cookie for display, so one task reads correctly in New York and Chennai at once, plus a one-time legacy-data UTC migration",
   "SHA-256 content-addressed file storage with a server-side MIME/extension allowlist blocking all executables",
   "every analytic (lead/cycle time, time-in-status, throughput, bottleneck panel) computed at read time from existing rows with zero new schema",
   "live per-user workload sub-line on the assignment picker so a creator sees who's already busy before assigning"
  ],
  "outcomes": [
   "replaced ClickUp as AJ Worldwide's internal task and project tracker",
   "every task carries a full timestamped audit trail instead of an opaque history",
   "AI-assisted description generation cuts task-writing friction for requesters",
   "company-wide dashboard and reports give load distribution and throughput visibility with zero manual reporting"
  ]
 }
});
