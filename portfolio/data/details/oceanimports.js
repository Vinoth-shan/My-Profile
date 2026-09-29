// Public-safe project details (sanitised: no credentials, hosts, names or security findings).
Object.assign(window.DETAILS = window.DETAILS || {}, {
 "oiw": {
  "purpose": "Operators need a single pane to track shipments across Customs, PTP, and Transport teams. Replaces fragmented Excel tracking with live visibility into operational gates and performance.",
  "concept": "Central hub reading master shipment table (cargowise) written by n8n Logysis import flows. Every operator views pending/pipeline tasks; edits inline; audits complete shipments per team.",
  "scope": {
   "in": [
    "shipment records",
    "per-operator task counts",
    "audit verdicts",
    "ETA updates"
   ],
   "out": [
    "email",
    "external reports"
   ]
  },
  "roles": [
   [
    "Operator",
    "track assigned shipments, inline edits"
   ],
   [
    "Auditor",
    "grade completed shipments per team"
   ],
   [
    "Admin",
    "upload Logysis exports, manage users"
   ]
  ],
  "workflow": [
   [
    "Logysis export lands",
    "n8n IMAP picks up Excel, parses, branches by filename",
    "n8n"
   ],
   [
    "Upload to cargowise",
    "Excel rows UPSERT keyed on shipment_no; ETA only on first import",
    "n8n"
   ],
   [
    "Task appears in dashboard",
    "Operator sees pending gate in their queue (CAN/ISF/DO/POD/billing/etc)",
    "System"
   ],
   [
    "Operator edits inline",
    "Toggles gates NA/Applicable, adds remarks via api/*.php endpoints",
    "Operator"
   ],
   [
    "Shipment marked complete",
    "Status moves to CMP, cmp_date auto-stamps, audit flag set",
    "System"
   ],
   [
    "Auditor reviews & scores",
    "Per-team audit verdict (value/remark/error triplet) inserted to audit DB",
    "Auditor"
   ],
   [
    "Verdict mirrors back",
    "cargowise.<team>_audit/_percent/_error updated; grid color-codes state",
    "System"
   ]
  ],
  "modules": [
   [
    "Shipment Records",
    "4555-line grid with 6-status filter (INV/WRK/JRA/IHL/CMP/CLS), drill-down codes per gate"
   ],
   [
    "Activity Dashboard",
    "Pending vs pipeline counts across 7 gates, sliced by operator (0-4 days / beyond)"
   ],
   [
    "Volume Reports",
    "Location-based (INDIA/TURKEY) and operator-based throughput summaries"
   ],
   [
    "Performance Dashboards",
    "Team-level audit KPIs (DOCS/CC/Trans/PTP) with percent complete and error flags"
   ],
   [
    "Audit Subsystem",
    "Completed-shipment grading form, checklist per team, rollup report view"
   ],
   [
    "User Assignment",
    "Dynamic operator list; adding/removing triggers ALTER TABLE mailcount (5 cols/person)"
   ]
  ],
  "dashboards": [
   [
    "Activity Dashboard",
    "Operator pending/pipeline counts across Customs/PTP/Transport gates; hidden if zero"
   ],
   [
    "Volume Dashboard",
    "Location-based shipment count by operator (India/Turkey), total volume KPIs"
   ],
   [
    "Team Performance",
    "Per-team audit completion %, error rate, average time-to-close per audit team"
   ]
  ],
  "records": [
   [
    "cargowise",
    "ship (PK), user, ccuser, tuser, ptpuser, eta, can, do, pod, bill, status, rem3, audit flags"
   ],
   [
    "mailcount",
    "date (UK), ~150 operator columns (5 per: email count, sent, delivered, leave flag, calls)"
   ],
   [
    "audit_cmp_gen2",
    "shipment_no (UK), mbl_no, eta, status, 12 doc audit triplets, 2 POD, 2 billing, per-team auditor"
   ]
  ],
  "integrations": [
   [
    "n8n IMAP workflow",
    "sea import: reads Logysis Excel from mailbox, branches by filename (Ocean/2026 OI), posts JSON"
   ],
   [
    "n8n ETA workflow",
    "final eta air and sea: updates both oceanImports.cargowise AND airImports.airShip in one txn"
   ],
   [
    "Empty Return Tracking",
    "reads/writes empty_return_v2 (cross-app container gate-out & return dates)"
   ],
   [
    "Arrival-Notice API",
    "reads arrival-notice PDFs from shared pdf_log, populates arn_received/arn_actioned_by"
   ],
   [
    "Railway dashboard",
    "external external_api/pickup_api.php exposes empty_return_v2 to opsimp-dashboard"
   ],
   [
    "Air Imports",
    "cross-app: audit module reads/updates airImports.airShip for air-side audits"
   ]
  ],
  "security": [
   "Session-based auth via oi_login; Access column gates admin menu items with CSS class + server-side check",
   "API key: X-API-Key header + hash_equals comparison"
  ],
  "engineering": [
   "Wide-schema mailcount design: one row per date, ~30 operator columns × 5 metrics = 150+ cols; scales to add/remove operators via dynamic ALTER TABLE",
   "Dual production URLs running identical codebase; n8n filename-branch routes to correct domain; separate DB assumed",
   "Dual ETA ingestion paths (manual SheetJS + n8n IMAP): cross-app write (oceanImports + airImports) in single transaction to keep ocean/air ETA in sync",
   "Audit subsystem owns separate audit DB; INSERT … ON DUPLICATE KEY UPDATE keyed on shipment_no merges multi-team verdicts into one row; mirrors back into cargowise for color-coding"
  ],
  "outcomes": [
   "Replaced Excel tracking with live shipment visibility; operators see pending tasks by gate without manual list-building",
   "Centralized ETA updates: n8n workflow is single source of truth for both ocean and air, eliminating split-brain ETA drift",
   "Team audit completion jumped from spreadsheet spot-checks to systematic completion scoring (per-team KPIs, audit flags trigger color-coded rows)",
   "containers can be tracked to gate-out and return without leaving the main app"
  ]
 },
 "customs": {
  "purpose": "Operators and brokers need to raise, track and complete US customs entries for imports. Brokers consolidate operator documents into PDFs for submission; auditors grade quality.",
  "concept": "MVC rewrite of flat-PHP customs app. Operators submit shipments, brokers edit & consolidate docs, admins manage staff access. Drives Descartes upload queue. Activity log for every change.",
  "scope": {
   "in": [
    "customs entries (new/draft/processing/uploaded/complete)",
    "operator uploads",
    "Descartes sync"
   ],
   "out": [
    "archival to separate audit tables"
   ]
  },
  "roles": [
   [
    "User",
    "submit own entries or any granted"
   ],
   [
    "Broker",
    "process entries, consolidate PDFs, Descartes queue"
   ],
   [
    "Admin",
    "manage staff access grants"
   ]
  ],
  "workflow": [
   [
    "Operator submits entry",
    "form lookup (3-source fallback), duplicate check, arrival-notice auto-attach, n8n webhook fires",
    "Operator"
   ],
   [
    "Broker receives notification",
    "reviews entry, requests docs if needed, marks as ready",
    "Broker"
   ],
   [
    "Broker consolidates PDFs",
    "merges processor + operator docs in fixed order (FPDI/TCPDF), uploads to Descartes via API",
    "Broker"
   ],
   [
    "Descartes confirms receipt",
    "Descartes acknowledges upload, entry marked uploaded with timestamp",
    "System"
   ],
   [
    "Status transitions to complete",
    "activity log appends, per-user access scoped to own + granted",
    "System"
   ]
  ],
  "modules": [
   [
    "Dashboard",
    "status-by-period tables, completion-trend & performance charts (Chart.js), status split, workload, Descartes status"
   ],
   [
    "Customs Data Table",
    "sortable/filterable with hero status cards, multi-select filters, column customiser, CSV export, draft-approval"
   ],
   [
    "New Entry Form",
    "shipment lookup (3-source fallback), ARN auto-attach, duplicate check, operator doc upload, n8n webhook + email"
   ],
   [
    "Descartes Update",
    "queue for PDF upload status, on-demand consolidation, inline Descartes date, Uploaded/Pending filters"
   ],
   [
    "Live Consolidator",
    "ad-hoc PDF merge: drag-to-order thumbnails, real-time progress, file naming, preview drawer"
   ],
   [
    "Reports",
    "staff-only column-builder Excel export with same filters as data page"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "status breakdown (New/Draft/Processing/Uploaded/Complete), completion trend, team workload distribution, Descartes sync status"
   ],
   [
    "Data Table",
    "searchable customs entries with hero status badges, multi-select operator/location filters, Descartes upload timestamp"
   ]
  ],
  "records": [
   [
    "customs_entry (in oceanImports DB)",
    "entry_no (PK), shipment_no, mbl, status, operator, broker, draft_fee, duty_amount, payable_by"
   ],
   [
    "log_customs_entry",
    "created, updated, drafted, approved records; actor, target_id, details (JSON), timestamp"
   ]
  ],
  "integrations": [
   [
    "oceanImports DB",
    "cross-DB joins to cargowise for shipment metadata (MBL, customer, ETD, ETA)"
   ],
   [
    "officedata.shipments",
    "lookup source for shipment_no auto-populate"
   ],
   [
    "pdf_log table",
    "n8n-populated ARN archive; PDFs auto-attached to entries on shipment_no match"
   ],
   [
    "CloudConvert API",
    "converts Office/CSV files to PDF during consolidation (FPDI for native PDFs, TCPDF image wrap)"
   ],
   [
    "n8n webhook",
    "fires on entry submit (custom_entry_new) → email to broker; new-entry status triggers team notification"
   ]
  ],
  "security": [
   "Auth against shared oi_login table; Customs_Access column gates User/Broker/Admin roles",
   "User Access table: broker/admin grants User X visibility to User Y's entries; enforced in every list + deep-link guard",
   "Activity log never deleted (append-only); draft_approved state audit ensures no bypass of broker approval step"
  ],
  "engineering": [
   "MVC router-based PHP (no framework); Composer autoload + vendor/ committed so deploy is git pull only",
   "Document consolidation engine (Consolidate class) merges PDFs (FPDI), wraps images, converts Office/CSV via CloudConvert; reused by Live Consolidator for ad-hoc merges",
   "Activity log scopes to user's access (own entries + granted visibility); query builds the visibility JOIN dynamically",
   "New entry 3-source fallback lookup: officedata.shipments → oceanImports.cargowise → manual entry; avoids single-source dependency"
  ],
  "outcomes": [
   "Centralized customs filing: operators submit, brokers consolidate PDFs, Descartes upload tracked in one interface",
   "Automated ARN attachment: shipments auto-linked to pre-existing arrival-notice PDFs via mbl lookup, saving manual document hunting",
   "Audit trail for every entry: activity log captures status changes, who drafted/approved/uploaded, with full snapshot on soft-delete",
   "Live document consolidation: operators see merged PDF before broker uploads, reducing back-and-forth on doc order/completeness"
  ]
 },
 "isf": {
  "purpose": "Operators must file US Customs ISF for ocean imports at least 24h before vessel load. Brokers transmit to CBP and track filing status. Replaces email-based coordination.",
  "concept": "6-stage workflow (New → In Progress → Ready to Transmit → ISF Accepted → BILL Matched/Not Matched). Operators submit draft ISF with docs; brokers edit, transmit to CBP via webhook, status updates trigger n8n emails.",
  "scope": {
   "in": [
    "ISF filings",
    "operator docs (ISF + supporting)",
    "broker updates",
    "CBP acceptance"
   ],
   "out": [
    "billing system"
   ]
  },
  "roles": [
   [
    "User",
    "submit ISF draft, view own + granted entries"
   ],
   [
    "Broker",
    "edit status, add broker docs/remarks, delete"
   ],
   [
    "Admin",
    "user access management"
   ]
  ],
  "workflow": [
   [
    "Operator submits draft ISF",
    "form capture (vessel, voyage, ETD, AMS #, IOR, MBL/HBL, docs); shipment lookup from officedata; n8n isf_entry_new fires",
    "Operator"
   ],
   [
    "Broker moves to In Progress",
    "status change & webhook (isf_status_change) notify operator + raiser only (no CC/BCC)",
    "Broker"
   ],
   [
    "Broker prepares for transmission",
    "Ready to Transmit status; operator/processor docs reviewed; remarks added",
    "Broker"
   ],
   [
    "Broker transmits to CBP",
    "ISF Accepted status; webhook (isf_status_change) sent; CBP entry_no captured",
    "Broker"
   ],
   [
    "Invoice match resolved",
    "BILL Matched or BILL Not Matched status; webhook (update_isf_entry) fires only for these two states",
    "Broker"
   ],
   [
    "File organizers can re-upload",
    "Operator re-organize/delete operator files via submit_isf_operator_files.php; webhook (isf_document_change) fires"
   ]
  ],
  "modules": [
   [
    "Form (New Entry)",
    "vessel/voyage/ETD/AMS #/IOR/MBL/HBL, mandatory isf_files upload, optional others docs, shipment auto-lookup"
   ],
   [
    "Dashboard",
    "filterable list by status, operator, date range; hero status cards; role-scoped visibility"
   ],
   [
    "ISF View (Read-only)",
    "displays entry detail + operator docs + Entry Activity card (lifecycle of all changes)"
   ],
   [
    "ISF Edit (Broker/Admin)",
    "status dropdown, broker remarks/docs/files, reason enum, Entry Activity card (what was last changed)"
   ],
   [
    "User Access",
    "admin-only mapping: which User may see which other User's entries (self-visibility always implicit)"
   ],
   [
    "Activity Log",
    "global append-only feed with KPI tiles, filters by user/action/date, free-text over target_id/details"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "status breakdown (New/In Progress/Ready to Transmit/ISF Accepted/BILL Matched/BILL Not Matched); searchable list"
   ],
   [
    "Activity Log",
    "day-grouped event feed with login/logout/create/status/update/delete actions; entry ownership traces to deletion"
   ]
  ],
  "records": [
   [
    "isf_entry",
    "reference_no (UK), shipment_no (FK-by-convention), mbl, hbl, vessel_name, voyage_no, etd, ams_house_no, ior_name, status, per-status date_* audit columns"
   ],
   [
    "log_isf_entry",
    "action (Logged in/Created/Changed status/Updated/Deleted), actor, target_id (reference_no), details (JSON), timestamp (ET)"
   ],
   [
    "isf_user_access",
    "username, granted_username (UNIQUE pair); implicit self-visibility; Admin/Broker see all"
   ]
  ],
  "integrations": [
   [
    "n8n webhooks",
    "isf_entry_new, isf_status_change, update_isf_entry, isf_document_change → email notifications (recipients from user.json)"
   ],
   [
    "officedata.shipments",
    "shipment_no auto-lookup populates MBL/HBL/ETA/job_owner; duplicate-check against ACTIVE isf_entry rows"
   ],
   [
    "pdf_log table",
    "MBL → archived arrival-notice PDF path lookup (read-only)"
   ],
   [
    "oceanImports.cargowise",
    "cross-app read for shipment validation; ISF duplicates checked against active customs_entry too"
   ],
   [
    "shared oi_login table",
    "Customs_Access column gates User/Broker/Admin (same auth as Customs Entry)"
   ]
  ],
  "security": [
   "Session-based auth via oi_login.Customs_Access (User/Broker/Admin); shared with Customs Entry but separate grant tables",
   "User Access enforced at dashboard list, report export, deep-link guard, Activity Log, Entry Activity card; re-checked server-side (card never trusts host page)",
   "ordinary form submits (submit_form, submit_isf_edit, submit_isf_operator_files) have none yet",
   "Webhook delivery hardened: ignore_user_abort(true) + one retry on connection failure only (not on 4xx/5xx to avoid duplicate emails)",
   "Deleted entry: DB row removed; files left on disk (recoverable); reference_no reused after delete (log splits into incarnations at Deleted entry line)"
  ],
  "engineering": [
   "Entry Activity card (one function in activity_card.php) included by both isf_view + isf_edit; brings own <style>/<script>; safe inside edit form (buttons are type=button)",
   "Activity log scopes differently per view: activity_log.php admits line if actor in access list OR entry owned by viewer OR viewer created entry; card admits ANY action IF entry visible",
   "Webhook delivery decoupled from page load: send_n8n_webhook() called before page render; survives client disconnect via ignore_user_abort(true); retry once on connection failure",
   "Reference number reuse after hard delete: log keeps both incarnations; card/feed split at Deleted entry line so previous holder's history not exposed to new holder"
  ],
  "outcomes": [
   "24-hour ISF filing workflow now tracked in app instead of email threads; status visible to all stakeholders at every stage",
   "Operator visibility into broker edits: Entry Activity card shows every change (status, fields, docs) as it happens, eliminating surprise rejections",
   "Automated CBP communication: n8n webhook bridges app state to email notifications; no manual email forwarding to brokers",
   "Audit-ready deletion: Deleted entry line in activity log captures full row snapshot + attachment paths; allows post-delete review without exposing deleted data to unauthorized users"
  ]
 },
 "ctrack": {
  "purpose": "",
  "concept": "Lightweight MVC dashboard for empty_return_v2 table. Operators upload shipment spreadsheets (PhpSpreadsheet), track/update gate-out & return dates. REST API exposes data to Railway automation.",
  "scope": {
   "in": [
    "container records",
    "operator uploads",
    "shipment metadata"
   ],
   "out": [
    "external Railway dashboard"
   ]
  },
  "roles": [
   [
    "User",
    "upload containers, track & update milestones"
   ],
   [
    "Admin",
    "manage users, export reports"
   ]
  ],
  "workflow": [
   [
    "Operator uploads spreadsheet",
    "Excel (20 cols: container, tracking, carrier, arrival, gate-out, empty_return, shipment_no, etc.) parsed by PhpSpreadsheet",
    "Operator"
   ],
   [
    "Bulk UPSERT to empty_return_v2",
    "INSERT … ON DUPLICATE KEY UPDATE keyed on container_no; only non-empty fields overwrite; future empty_return forced NULL",
    "System"
   ],
   [
    "Operator views dashboard",
    "KPI tiles: delay buckets (0-1, 2-3, 4-5, 5+ days past deadline) by operator & location",
    "User"
   ],
   [
    "Operator fixes missing shipment",
    "quick-fix edit from dashboard dropdown (5 fields: arrival, gate-out, return, shipment_no, remarks)",
    "Operator"
   ],
   [
    "Detailed edit for audit",
    "detailed_data/edit.php writes update_user + update_time on every save; audit trail for compliance",
    "Operator"
   ],
   [
    "External API query",
    "Railway dashboard calls external_api/pickup_api.php (API key header + origin check) to fetch active container state"
   ]
  ],
  "modules": [
   [
    "Dashboard",
    "KPI tiles (delay buckets by operator/location), per-container status list, shipment-missing quick-fix dropdown"
   ],
   [
    "Data Table",
    "searchable/filterable list of all containers with key dates, status badges, edit/view drill-down"
   ],
   [
    "Quick-Fix Edit",
    "5 fields (arrival_date, gate_out, empty_return, shipment_no, remarks); gated to dashboard only"
   ],
   [
    "Detailed Edit",
    "reads/updates container_number, arrival, gate-out, return, remarks; writes update_user/update_time; audit trail"
   ],
   [
    "Report Builder",
    "column-picker custom export to Excel (date range, operator, location filters)"
   ],
   [
    "External API",
    "REST endpoint (GET ?action=search&ship=... or &container=...) with X-API-Key auth + origin CORS checks"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "delay-bucket KPI tiles (0-1, 2-3, 4-5, 5+ days late) by operator & location; per-container summary with status badges"
   ]
  ],
  "records": [
   [
    "empty_return_v2",
    "container_number (PK), tracking_number, carrier_name, arrival_date, gate_out, empty_return, shipment_no, job_owner, location_udf, remarks, update_user, update_time"
   ]
  ],
  "integrations": [
   [
    "PhpSpreadsheet",
    "client-side Excel parse → JSON chunks → PHP bulk UPSERT (20-col Logysis ops report)"
   ],
   [
    "Railway dashboard",
    "external_api/pickup_api.php exposes container state; CORS allow-list + API key auth; server-to-server key-only"
   ],
   [
    "oceanImports DB",
    "reads oi_login for auth; no per-app role column (any valid user = full access)"
   ],
   [
    "Logysis macro pipeline",
    "upstream Excels (3 shapes: ops report, empty-return report, ETA-by-shipment) sourced from Logysis macro"
   ],
   [
    "n8n",
    "no direct n8n integration (unlike Ocean Imports); all data ingestion via Excel upload"
   ]
  ],
  "security": [
   "no per-app role column (all users = full access by design)",
   "External API: X-API-Key header (hash_equals checked); CORS allow-list; server-to-server requests (no Origin) pass through"
  ],
  "engineering": [
   "Wide-schema empty_return_v2: container_number as natural PK (not surrogate ID); re-upload is free upsert keyed on container number",
   "Three Excel upload endpoints (upload.php, upload_er.php, upload_eta.php) targeting different Logysis report shapes; same UPSERT semantics",
   "detailed-data edit (with audit) for operator-facing workflow",
   "External API stateless: caller must provide shipment or container reference; no session/login required, only API key + CORS check"
  ],
  "outcomes": [
   "Replaced manual tracking spreadsheets with live delay-bucket dashboard",
   "Container state visible to external Railway dashboard (API-driven); no manual export/re-import needed",
   "Audit trail on all operator edits: detailed_data/edit.php logs who changed what and when (update_user/update_time for compliance)",
   "Bulk Logysis sync: 3 different Excel shapes from upstream macro all map to same table cleanly (location/user/ETA filters pre-validated)"
  ]
 },
 "empty": {
  "purpose": "AJ Worldwide ocean imports need to track empty containers from arrival through return within carrier free-time windows. Delays past deadline trigger per-diem charges that must be monitored.",
  "concept": "Pure CRUD app: no n8n, no email. Three Excel upload endpoints ingest Logysis macro pipeline data. Brokers & operators edit via web UI. Dashboard shows delay buckets by operator & location.",
  "scope": {
   "in": [
    "container records",
    "Logysis Excel uploads (3 shapes)"
   ],
   "out": [
    "nothing; read-only external consumers OK"
   ]
  },
  "roles": [
   [
    "User",
    "upload containers, view dashboard, edit in UI"
   ],
   [
    "Admin",
    "same; no special role"
   ]
  ],
  "workflow": [
   [
    "Logysis macro runs upstream",
    "generates 3 Excel files (ops, empty-return, ETA-by-shipment); sends to AJ teams",
    "Upstream"
   ],
   [
    "Operator uploads Excel",
    "file parses; Excel-serial dates convert to Y-m-d; bulk UPSERT on container_number (PK)",
    "Operator"
   ],
   [
    "Dashboard shows delay buckets",
    "0-1, 2-3, 4-5, 5+ days past deadline; sliced by operator & location (India/Turkey)",
    "System"
   ],
   [
    "Operator fixes data errors",
    "quick edit (14 fields) from dashboard or detailed edit (5 fields + audit) from table",
    "Operator"
   ],
   [
    "Metrics tracked",
    "arrival → gate-out → empty_return lifecycle"
   ]
  ],
  "modules": [
   [
    "Login",
    "no per-app role"
   ],
   [
    "Dashboard",
    "delay-bucket KPI tiles (0-1, 2-3, 4-5, 5+ days late) by operator & location; container summary"
   ],
   [
    "Data Table",
    "searchable/filterable list; read-only view; full edit form"
   ],
   [
    "Report Builder",
    "column-picker Excel export (custom date range, operator, location filters)"
   ],
   [
    "Upload UI (3 forms)",
    "upload.html (ops), upload_er.html (return), upload2.html (ops + ETA combined on one page)"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "delay-bucket KPI tiles by operator & location; high-level per-container status with arrival/gate-out/return milestones"
   ]
  ],
  "records": [
   [
    "empty_return",
    "container_number (PK), tracking_number, carrier_name, arrival_date, gate_out, empty_return, shipment_no, job_owner, location_udf, remarks, update_time, update_user"
   ]
  ],
  "integrations": [
   [
    "PhpSpreadsheet",
    "Excels parsed server-side; 3 upload endpoints (ops, empty-return, ETA-by-shipment)"
   ],
   [
    "oceanImports DB",
    "oi_login auth only; no per-app role gating"
   ]
  ],
  "security": [
   "no per-app role column (all users = full access)",
   "Charset is latin1_swedish_ci (legacy); loses non-ASCII in customer_name/shipper/consignee; future columns should force utf8mb4"
  ],
  "engineering": [
   "Three Excel upload endpoints (upload.php, upload_er.php, upload_eta.php) targeting different Logysis report shapes; same UPSERT on container_number PK",
   "Column-order positional parsing in upload.php (no header lookup); fragile if Logysis macro changes order",
   "Future ETA > TODAY+1 forced to NULL to guard against carrier-portal date bugs"
  ],
  "outcomes": [
   "delays surface immediately",
   "Audit trail on detailed edits (who changed what, when); quick-fix dashboard edit exists for urgent corrections without audit overhead",
   "Three Logysis Excel shapes cleanly upsert to one table via positional column mapping; bulk sync requires zero manual intervention",
   "No email/n8n overhead: pure CRUD app focuses ops teams on container state visibility without automation complexity"
  ]
 },
 "wip": {
  "purpose": "Ocean import operators must schedule follow-ups on shipments by job owner & customer group. Tracking follow-up due dates prevents missed opportunities for customer contact.",
  "concept": "MVC app with Excel multi-sheet upload (WIP Extract + Final ETA). User Master seeds employee roster. Follow-ups tracked by job owner, customer group, location. Activity log + role-based access.",
  "scope": {
   "in": [
    "follow-up records",
    "user roster",
    "customer groups",
    "n8n triggers"
   ],
   "out": [
    "email notifications via n8n"
   ]
  },
  "roles": [
   [
    "Controller",
    "upload user master/follow-ups, column mapping, user role assignment"
   ],
   [
    "Admin",
    "customer groups, column mapping"
   ],
   [
    "User",
    "view assigned follow-ups, download reports"
   ]
  ],
  "workflow": [
   [
    "Controller uploads user master",
    "Employee roster (ID, Name, Team, Location, Email, Manager) parsed; JSON backups pre-apply/delete",
    "Controller"
   ],
   [
    "Controller uploads follow-ups",
    "WIP Extract + Final ETA multi-sheet Excel; configurable column mapping per upload_columns table",
    "Controller"
   ],
   [
    "Follow-ups appear in dashboard",
    "By job owner, customer group, location, status, date range (ET timezone)",
    "System"
   ],
   [
    "Admin/Controller map user access",
    "By team, location, or individual job owner; scope determines what User sees",
    "Admin"
   ],
   [
    "Operators view assigned follow-ups",
    "Filtered by their team/location/job owner grant; export to Excel by date range + status",
    "User"
   ],
   [
    "n8n email trigger fires",
    "On follow-up date, email notifications sent to operators (configured in n8n workflow)"
   ]
  ],
  "modules": [
   [
    "Upload",
    "multi-sheet Excel import (WIP Extract, Final ETA); configurable column mapping; backup JSON snapshots"
   ],
   [
    "Dashboard",
    "summary counts, recent uploads, follow-up status by job owner/customer/location"
   ],
   [
    "Follow-ups Table",
    "filterable by job owner, customer, location, status, date range; export to Excel"
   ],
   [
    "User Master",
    "employee roster editor; upload CSV, apply/delete (backups before apply), manual add/edit"
   ],
   [
    "Customer Groups",
    "predefined (BKT, Chocovia, HTS, SINO); admin can add custom groups"
   ],
   [
    "User Mapping",
    "grant User access by team, location, or individual job owner (Admin only)"
   ],
   [
    "Activity Log",
    "upload events, user changes, deletions (all roles can view, scoped to their data)"
   ],
   [
    "Reports",
    "export follow-ups by date range, status (User-scoped or full for Admin/Controller)"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "summary KPI tiles (follow-up counts by status), recent uploads, job owner workload by team/location"
   ]
  ],
  "records": [
   [
    "wip_followup",
    "job reference, customer_group (FK), job_owner, follow_up_date, status, remarks"
   ],
   [
    "wip_user_master",
    "User ID (PK), Name, Team, Location, Email, Manager, Team Leader, is_active"
   ],
   [
    "log_wip_followup",
    "upload_id, row_number, data snapshot, status; activity log of uploads/changes"
   ]
  ],
  "integrations": [
   [
    "shared oceanImports DB",
    "wip_* tables live alongside Ocean Imports cargowise; oi_login.wip column gates access (Controller/Admin/User)"
   ],
   [
    "n8n workflows",
    "external; email triggers on follow-up due date (admin configures webhook endpoint + recipient list)"
   ],
   [
    "PhpSpreadsheet",
    "multi-sheet Excel import; configurable column mapping stored in wip_upload_columns"
   ],
   [
    "User Master JSON backups",
    "snapshots created before apply/delete (storage/backups/) allow restore of older roster"
   ]
  ],
  "security": [
   "Auth vs shared oi_login table; wip column gates Controller/Admin/User roles (distinct from other AJ apps)",
   "User access scoped by team/location/job_owner grant; User sees only their access list in follow-up queries + reports"
  ],
  "engineering": [
   "User Master multi-sheet upload with JSON backup snapshots; apply creates record snapshot before INSERT/UPDATE/DELETE (audit trail via storage/backups/)",
   "Column mapping configurable per upload (wip_upload_columns); allows Logysis export format changes without code deploy",
   "Shared oceanImports DB: WIP tables coexist with Ocean Imports cargowise; no separate database needed for this workflow"
  ],
  "outcomes": [
   "Follow-ups tracked by job owner & customer group in one place; no longer scattered across email/spreadsheets",
   "Role-based visibility: Users see only their assigned jobs; admins have full view for reporting & gap analysis",
   "Automated email triggers via n8n: follow-up due dates auto-notify operators (no manual list review)",
   "Employee roster versioning: JSON backups enable rollback if upload error; all changes logged for audit trail"
  ]
 },
 "rdd": {
  "purpose": "Accounting needs to track profit variance on completed shipments. Operators mark jobs WRK → RDD (ready for doc review) → CMP (complete). Profit drift (initial vs latest) surfaces under-/over-estimated jobs.",
  "concept": "Dashboard showing shipment lifecycle (WRK/RDD/CMP status). Profit-drift KPI is latest_estimated_profit - estimated_profit. Validation rules gate CMP transitions; n8n feeds Excel via IMAP.",
  "scope": {
   "in": [
    "shipment lifecycle",
    "cost/revenue tracking",
    "profit drift analysis"
   ],
   "out": [
    "accounting review"
   ]
  },
  "roles": [
   [
    "User",
    "edit own assigned shipments, bulk edit status"
   ],
   [
    "Admin",
    "reports, clear shipments"
   ]
  ],
  "workflow": [
   [
    "Shipment uploaded",
    "Excel (row 5+) UPSERT to rdd_data keyed on shipment_no; estimated_* frozen at first INSERT",
    "System"
   ],
   [
    "Status coerced to WRK",
    "IHL/INV/JRA status values rewritten to WRK (in-progress marker)",
    "System"
   ],
   [
    "Operator marks RDD",
    "Operator edits row, status → RDD; rdd_date auto-stamped (never overwritten after)",
    "Operator"
   ],
   [
    "Operator marks CMP",
    "Operator edits status → CMP; validation checks profit drift, transporter, ops remarks (gates fire if CMP)",
    "Operator"
   ],
   [
    "Profit drift triggers action",
    "If drift > 75 USD, reason dropdown required; if Port/Door movement, transporter name + rating required",
    "System"
   ],
   [
    "Accounting reviews",
    "Admin-only report page; filters by operator, movement type, date type (eta/wrk/rdd/cmp), profit range"
   ]
  ],
  "modules": [
   [
    "RDD Records (Dashboard)",
    "4-week default, operator/movement filters, date-type picker (eta/wrk/rdd/cmp), profit-diff sort, pagination, multi-select → bulk edit"
   ],
   [
    "Operator Dashboard",
    "per-operator aggregates: total records, WRK/RDD/CMP counts, No Initial C&R count, profit bucket distribution"
   ],
   [
    "Single Record View",
    "read-only drilldown modal (shipment, dates, revenue/cost/profit baseline & latest, status, transporter, reason, remarks)"
   ],
   [
    "Edit Form",
    "status dropdown, transporter autocomplete, rating (D/C/B/A/A+), reason (16 options), ops_remarks; validation on CMP"
   ],
   [
    "Bulk Edit",
    "multi-row select → edit form; transactional (all-or-nothing); validation fires once per batch"
   ],
   [
    "Reports",
    "admin-only column-builder (select columns), export to Excel, same filters as dashboard"
   ]
  ],
  "dashboards": [
   [
    "RDD Records",
    "sortable/filterable table (operator, movement type, date type, profit drift, status); hero status pills (WRK/RDD/CMP/No Initial C&R)"
   ],
   [
    "Operator Dashboard",
    "per-operator summary: total, status counts, profit drift buckets (over-150 / under-minus-150)"
   ]
  ],
  "records": [
   [
    "rdd_data (in officedata DB)",
    "shipment_no (PK), operator, type_of_movement, eta, estimated_*, latest_estimated_*, wrk_date, rdd_date, cmp_date, transporter_name, transporter_rating, reason, ops_remarks"
   ]
  ],
  "integrations": [
   [
    "n8n IMAP workflow",
    "RDD upload workflow: reads mailbox rdd, subject filter 'Turkiye RDD', parses Excel, POSTs to upload.php"
   ],
   [
    "oceanImports.uploadtime",
    "heartbeat updated on upload (key user='rdd_data') so home page shows last-updated timestamp"
   ],
   [
    "shared oi_login table",
    "rdd column gates Admin access (for reports)"
   ]
  ],
  "security": [
   "Session auth vs oi_login; Access column gates User/Broker/Admin; rdd column gates report access (Admin only)"
  ],
  "engineering": [
   "Profit drift (latest_estimated_profit - estimated_profit) is the central KPI; frozen baseline protects against re-estimation churn",
   "Date stamps (wrk_date, rdd_date, cmp_date) record first-entry only; once stamped, never overwritten even on re-upload",
   "Transporter autocomplete reads static transporter/list.json (~1471 names); no DB lookup for performance",
   "Validation gates fire only on CMP transition: profit drift → reason required; Port/Door movement → transporter + rating required; No Initial C&R → remarks required"
  ],
  "outcomes": [
   "Profit drift visibility: management spots under-estimated jobs immediately upon CMP, enabling corrective pricing for future jobs",
   "Reason tracking: every large variance requires explanation (costing error, FX, unexpected costs, etc.); root-cause data drives process improvement",
   "Transporter ratings integrated into workflow: every Port/Door job audited for carrier performance (D/C/B/A/A+ scale)",
   "Bulk status updates: multi-row select enables batch WRK→RDD marking at end-of-week, reducing per-row overhead"
  ]
 },
 "errlog": {
  "purpose": "Ocean import operations encounter errors (documentation issues, customs holds, delivery delays, etc.). Operations needs a single log to capture, assign, track resolution and report on error trends.",
  "concept": "Error tracking dashboard with status workflow (Hold → In Progress → Resolved → Closed). Operators submit incident reports; handlers investigate; activity log tracks all changes.",
  "scope": {
   "in": [
    "error reports",
    "operator submissions",
    "status updates"
   ],
   "out": [
    "reports by location/status/date"
   ]
  },
  "roles": [
   [
    "Operator",
    "submit error reports"
   ],
   [
    "Handler",
    "investigate, update status & notes"
   ],
   [
    "Location Manager",
    "filter by location"
   ],
   [
    "Management",
    "dashboard & reports"
   ]
  ],
  "workflow": [
   [
    "Operator submits error",
    "Incident type, cargo details, issue description captured in form; reference_no auto-generated",
    "Operator"
   ],
   [
    "Handler assigned",
    "Error added to queue with status Hold; handler investigates root cause",
    "Handler"
   ],
   [
    "Status updated",
    "Hold → In Progress → Resolved → Closed; follow-up dates trigger 'Action Required' flag",
    "Handler"
   ],
   [
    "Follow-up tracked",
    "Next follow-up due date stored; auto-mark errors Action Required when follow-up date passes",
    "System"
   ],
   [
    "Error resolved",
    "Handler updates status to Closed; activity log captures who resolved and when",
    "Handler"
   ],
   [
    "Reports generated",
    "Export errors by date range, location, customer, status; aggregate metrics by location/month"
   ]
  ],
  "modules": [
   [
    "Error Report Form",
    "Compact inline form (incident type, cargo type, customer, issue description, location, follow-up date)"
   ],
   [
    "Dashboard",
    "Error summary by status (Hold/In Progress/Resolved/Closed); KPI tiles by location; drill-down to detail"
   ],
   [
    "Filters",
    "By date range, operator, location, customer, reference number, status"
   ],
   [
    "Error Details",
    "Reference number, customer, cargo, issue date, location, handler notes, resolution, agent assigned"
   ],
   [
    "Status Tracking",
    "Auto-transitions based on follow-up date logic; Action Required flagging when follow-up due"
   ],
   [
    "Agent Assignment",
    "Track trucker/agent responsible for resolution of delivery-related errors"
   ],
   [
    "Reports",
    "Export errors by date, location, customer; trend analysis by status & root cause"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "Error count by status (Hold/In Progress/Resolved/Closed); KPI tiles by location; high-level summary with filters"
   ]
  ],
  "records": [
   [
    "error_reports",
    "error_id (PK), reference_no (UK), customer, cargo_type, issue_description, date, location, status, cls_date, agent_assigned, notes, created_at, updated_at"
   ]
  ],
  "integrations": [
   [
    "oceanImports.cargowise",
    "reads shipment metadata (shipment_no, container, customer) for error context"
   ],
   [
    "shared user.json endpoint",
    "external load of user roster for agent assignment dropdown"
   ],
   [
    "agents.json",
    "local JSON file holds agent/trucker roster (manual updates via manage_agents.html)"
   ]
  ],
  "security": [
   "Session auth vs oi_login; no per-app role column for error tracking (implicit: any valid user)"
  ],
  "engineering": [
   "Compact error report form (6 fields) designed for quick operator submissions (no document uploads, no approval workflow)",
   "Status auto-transitions based on follow-up date logic: if follow-up date passed, flag Action Required (similar to claims-dispute)",
   "Agent assignment: local agents.json + manage_agents.html UI; no central agent master DB",
   "Location field added to cargowise lookup for filtering errors by office (India/US/Turkey); defaults all existing to 'India'"
  ],
  "outcomes": [
   "Centralized error log replaces email-based issue tracking; no lost tickets, all handlers see full issue history",
   "Follow-up date auto-flagging prevents orphaned errors (handlers know when action is overdue)",
   "Location-based filtering enables India/US/Turkey ops to focus on their own error queue without switching views",
   "Agent assignment tracking helps ops managers identify top-performing truckers vs. repeat-problem vendors"
  ]
 },
 "shiptrack": {
  "purpose": "Operators need to find delivery milestones (DO release, IOR name, container numbers, empty-return dates) fast. Searching Gmail for this info is slow; AI can extract it from emails automatically.",
  "concept": "Chrome extension + web UI search shipment/MBL/container no → Gmail IMAP search → AI extract (Gemini now, Claude-ready) → cache in MySQL. Background cron ingests new mail incrementally.",
  "scope": {
   "in": [
    "Gmail mailbox (IMAP + attachments)",
    "email bodies & PDFs",
    "AI parsing"
   ],
   "out": [
    "cached milestone data",
    "external Chrome extension frontend"
   ]
  },
  "roles": [
   [
    "Admin",
    "add Gmail accounts, manage API keys"
   ],
   [
    "Operator (Chrome ext)",
    "search shipment#/MBL/container#"
   ]
  ],
  "workflow": [
   [
    "Admin adds Gmail account",
    "Email + app-password stored encrypted (AES-256-GCM) in MySQL config table",
    "Admin"
   ],
   [
    "Cron scans mailbox",
    "IMAP IDLE / polling every 15min; new mail → AI parse (body + PDFs) → cache in DB (dedupe on account+UID)",
    "Cron"
   ],
   [
    "Operator searches",
    "Chrome ext or web UI: search shipment/MBL/container → api/search.php returns cached results + live IMAP fallback",
    "Operator"
   ],
   [
    "Live search fallback",
    "If cache miss, IMAP TEXT search runs live (slower); AI parses matching emails on demand",
    "System"
   ],
   [
    "Results display",
    "DO release date, IOR name, container list, empty-return dates, event timeline extracted from emails/attachments"
   ]
  ],
  "modules": [
   [
    "Gmail account admin (web/admin.php)",
    "UI to add/remove mailbox accounts; app-password encrypted storage; test IMAP connection"
   ],
   [
    "Search interface (web + extension)",
    "Input: shipment#/MBL#/container# → dropdown results → click to view milestones"
   ],
   [
    "Cron scanner (cron/scan.php)",
    "Background job (15min interval); incremental IMAP ingest; batch processing; deduped AI calls"
   ],
   [
    "Search API (api/search.php)",
    "JSON endpoint: returns cached results + live IMAP fallback; merges both; no duplicate AI charge"
   ],
   [
    "AI extractor (api/ai.php)",
    "Gemini (default) or Claude-ready; handles email body + scanned PDFs; native PDF reading (no OCR server)"
   ],
   [
    "Cache (MySQL)",
    "Stores extracted milestones; unique key on account+UID prevents duplicate AI processing"
   ]
  ],
  "dashboards": [],
  "records": [],
  "integrations": [
   [
    "Gmail IMAP",
    "app-password auth (encrypted); incremental polling (15min); new-mail detection via UID tracking"
   ],
   [
    "Gemini API",
    "default AI provider; handles email body + PDF reading; cost per token (cached results avoid re-charge)"
   ],
   [
    "Claude API",
    "ready-to-switch: set ai.provider='claude' in config.php + fill ai.claude.api_key; same api/ai.php interface"
   ],
   [
    "MySQL cache",
    "stores extracted milestones (DO date, IOR, containers, events); deduped on account+UID"
   ],
   [
    "Chrome MV3 extension",
    "loads unpacked locally; sends searches to backend via X-API-Token header; auto-fill shipment form in browser"
   ],
   [
    "GoDaddy shared hosting",
    "cron via cPanel; PHP CLI for background jobs; no SSH required (Composer installed locally then uploaded)"
   ]
  ],
  "security": [
   "App passwords encrypted AES-256-GCM in DB; AI keys live in backend config.php only (frontend never sees them)",
   "API token required (X-API-Token header, hash_equals check); extension authenticates with token, not email password",
   "CORS allow-list can be configured (production: only extension origin + internal IPs; dev: localhost accepted)",
   "Shared-hosting constraint: no long-running processes; cron splits work into batches ($BATCH limit) to avoid PHP timeout",
   "Gmail 2FA required for app-password generation (Gmail account must have 2-Step Verification ON before issuing app password)"
  ],
  "engineering": [
   "Incremental mail sync: cron tracks last-seen UID per account; each run processes only new mail (no full re-scan overhead)",
   "Dedup on (account, UID): AI parsing is one-time cost per unique email; cache hit is instant; live IMAP TEXT search fallback for new mail cron hasn't processed yet",
   "Dual-AI support: Gemini is default (config.py ai.provider='gemini' + api_key); Claude switch is 1-line config change + 1 API key; ai.php abstraction layer handles both",
   "PDF native reading: Gemini/Claude both natively parse PDFs (no local OCR needed); text extraction via Composer optional (for plain email text)"
  ],
  "outcomes": [
   "Operators find DO release & empty-return dates in seconds (search → cached results) instead of minutes (Gmail folder hunt + manual email reading)",
   "Background cron eliminates operator wait: most searches hit cache from cron's 15-min incremental sync",
   "AI-powered extraction works on scanned PDFs (images + attachments); no manual copy-pasting from email chains",
   "Chrome extension + web UI provide two access points (browser automation + standalone search); enterprise + power-user friendly"
  ]
 },
 "lcl": {
  "purpose": "AJ Worldwide needs to generate LCL shipping quotations for import & export. Operators create quotes on-demand (freight + CFS + door delivery pricing). Admins manage rates & customer groups.",
  "concept": "Role-based UI (Controller/Admin/User) with live freight quoting. Admin rate tables (origins, destinations, charges as JSON). Activity log tracks logins, quotes, rate changes. User master for employee roster.",
  "scope": {
   "in": [
    "customer rate requests",
    "LCL freight rates",
    "CFS & door pricing"
   ],
   "out": [
    "quotations to customer",
    "internal rate history"
   ]
  },
  "roles": [
   [
    "Controller",
    "user master uploads, customer groups, column mapping, rate uploads"
   ],
   [
    "Admin",
    "rate management, RBA page, activity log view"
   ],
   [
    "User",
    "create quotes/bookings per location & direction"
   ]
  ],
  "workflow": [
   [
    "Admin sets rates",
    "Origins/ports/destinations/charges edited via rate-mgmt UI (JSON-backed storage per location/direction)",
    "Admin"
   ],
   [
    "User creates quote",
    "Select origin port + destination + container type + date → system looks up origin/port rates",
    "User"
   ],
   [
    "Live pricing calc",
    "Freight rate + CFS gateway + door delivery combined → total quote displayed",
    "System"
   ],
   [
    "Quote sent to customer",
    "User exports quote PDF or email link; customer reviews; conversion to booking"
   ],
   [
    "Booking created",
    "Quote → Booking status; activity log records conversion; booking-level pricing locked"
   ]
  ],
  "modules": [
   [
    "Import Quoting",
    "Pages + API + views for import LCL pricing (origin → port → destination)"
   ],
   [
    "Export Quoting",
    "Pages + API + views for export LCL pricing"
   ],
   [
    "Rate Management",
    "UI for admin to edit origins, ports, destinations, charges (JSON-backed); optional Gemini-assisted rate-sheet OCR"
   ],
   [
    "User Management",
    "Create users, edit email, activate/deactivate; per-user, per-location access control"
   ],
   [
    "Activity Log",
    "Audit trail of logins, price checks, quotes, bookings, rate edits, access changes"
   ],
   [
    "RBA Page",
    "Admin-only: role-based access grants (Controller/Admin/User per location/direction)"
   ]
  ],
  "dashboards": [],
  "records": [],
  "integrations": [
   [
    "shared oi_login table",
    "User/login auth; wip column used for role assignment (Controller/Admin/User)"
   ],
   [
    "MySQL JSON columns",
    "Origins, ports, destinations, charges stored as JSON for flexible rate card edits"
   ],
   [
    "Gemini API (optional)",
    "Rate-sheet conversion: admin uploads scanned rate PDF → Gemini OCR → JSON (opt-in; not required)"
   ]
  ],
  "security": [
   "Role-based access (RBA): oi_login.wip column gates Controller/Admin/User roles (per-location, per-direction grants)",
   "config/db_config.php (git-ignored): holds DB credentials; environment-specific, not committed",
   "config/gemini_key.txt (git-ignored): optional; Gemini API key for rate-sheet OCR feature",
   "Session-based auth via shared oi_login table"
  ],
  "engineering": [
   "JSON-backed rate tables: origins/ports/destinations/charges stored as JSON in DB (flexible schema, no migration for rate adjustments)",
   "Per-location, per-direction access: User can have import-India access but export-Turkey access (fine-grained grants)",
   "Activity log tracks quote/booking creation + rate updates; full audit trail for compliance",
   "Gemini-assisted rate-sheet OCR (optional): uploads PDF rate card → Gemini reads → JSON extraction → admin review + approve"
  ],
  "outcomes": [
   "Real-time LCL quoting: operators generate freight + CFS + door pricing in seconds (no manual rate lookup)",
   "Customer-facing quotations: exportable PDF quotes + booking conversion streamline sales cycle",
   "Admin rate management: JSON-backed storage allows on-the-fly rate updates without code deploy (Gemini OCR speeds bulk rate imports)",
   "Access control by role & location: Controllers manage user roster; Admins manage rates; Users quote per their assigned locations/directions"
  ]
 }
});
