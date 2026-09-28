// Public-safe project details (sanitised: no credentials, hosts, names or security findings).
Object.assign(window.DETAILS = window.DETAILS || {}, {
 "aefm": {
  "purpose": "Multi-purpose dashboard for Air Export team to track shipment milestones from pickup to ITN with overdue-flag highlighting. Addresses operator activity monitoring across CS, DOC, and SCAN teams and centralized error reporting.",
  "concept": "Tracks shipment workflow milestones with overdue visibility, logs daily operator activity (emails, calls, leave), and surfaces centralized error reports from oceanImports.",
  "scope": {
   "in": [
    "Shipment milestones via n8n",
    "Operator activity per day",
    "Cross-DB error reports"
   ],
   "out": [
    "Overdue milestone flags",
    "Email/call/leave metrics",
    "Issue list"
   ]
  },
  "roles": [
   [
    "CS Operator",
    "Tracks shipment pickup and paperwork handoff"
   ],
   [
    "DOC Team",
    "Manages documentation workflow"
   ],
   [
    "SCAN Team",
    "Handles scanning operations"
   ]
  ],
  "workflow": [
   [
    "Shipment Received",
    "Job enters system with estimated pickup date",
    "System"
   ],
   [
    "Agent Update",
    "CS confirms pickup details with shipping agent",
    "Operator"
   ],
   [
    "Airline Booking",
    "Booking confirmation recorded when flight secured",
    "Operator"
   ],
   [
    "Actual Pickup",
    "Cargo handed over to airline and pre-alert sent",
    "Operator"
   ],
   [
    "Invoice & ITN",
    "Invoice raised and ITN number captured",
    "Operator"
   ]
  ],
  "modules": [
   [
    "Shipment Workflow",
    "Displays all jobs with milestone overdue indicators"
   ],
   [
    "Operator Activity",
    "Daily email/call/leave tracking per operator with heatmap"
   ],
   [
    "Issue Log",
    "Centralized error reports from oceanImports.error_reports"
   ]
  ],
  "dashboards": [
   [
    "Activity Dashboard",
    "Operator workload by team, overdue milestone buckets, leave status calendar"
   ]
  ],
  "records": [
   [
    "AEShip",
    "Shipment_No, Job_Owner, Airline, AWB_NO, status, milestones (Estimated_Pickup through ITN_Number)"
   ],
   [
    "mailcount",
    "date, per-operator email count, sent count, leave status, call count (21 operators × 4 metrics)"
   ]
  ],
  "integrations": [
   [
    "n8n",
    "Auto-pushes shipment data directly into AEShip table"
   ],
   [
    "PhpSpreadsheet",
    "Manual Excel upload fallback for data entry"
   ]
  ],
  "security": [
   "Session-based auth with 30-minute idle timeout"
  ],
  "engineering": [
   "n8n ingests data on the way IN (unusual for AJ stack)",
   "Wide mailcount schema (84 operator columns) fragile on operator add/remove",
   "Milestone overdue logic walks date columns in order to flag delays"
  ],
  "outcomes": [
   "Centralized Air Export follow-up visibility",
   "Operator workload balancing visibility by team"
  ]
 },
 "aimp": {
  "purpose": "Comprehensive airfreight workflow and quality-assurance platform tracking inbound shipments through delivery milestones, auditing completed shipments against 16-point scorecard, and flagging service failures.",
  "concept": "Live shipment ledger with dual audit subsystems (CMP shipment + customer-service), local error tracking, and AHT measurement across 5 operators on cross-DB ocean workload.",
  "scope": {
   "in": [
    "n8n JSON shipment push",
    "Manual Excel upload",
    "Cross-ocean workload joins"
   ],
   "out": [
    "Error flagging via audit",
    "Audit scoring updates",
    "AHT calculations"
   ]
  },
  "roles": [
   [
    "CS Operator",
    "Logs shipment milestones and status changes"
   ],
   [
    "Auditor",
    "Reviews completed shipments on 16-question checklist"
   ],
   [
    "AP Focal",
    "Customer-service quality audit (gates on oi_login)"
   ]
  ],
  "workflow": [
   [
    "Shipment Posted",
    "n8n POSTs JSON with field transformation to upload endpoint",
    "System"
   ],
   [
    "Milestone Tracking",
    "Operator logs ATA, CAN, DO, DD, POD, INV, CC dates",
    "Operator"
   ],
   [
    "Completion",
    "Shipment reaches CMP status and becomes audit-eligible",
    "System"
   ],
   [
    "CMP Audit",
    "Auditor scores 16 questions and raises error flag if needed",
    "Auditor"
   ],
   [
    "Quality Review",
    "Customer-service audit completes (separate auth gate)",
    "AP Focal"
   ]
  ],
  "modules": [
   [
    "Shipment Ledger",
    "Tracks airShip with status filtering (INV/WRK/JRA/IHL/CMP)"
   ],
   [
    "CMP Shipment Audit",
    "16-question scorecard per completed shipment with remarks"
   ],
   [
    "Customer-Service Audit",
    "Separate scoring grid for service quality"
   ],
   [
    "Error Log",
    "Local issue dashboard from air-import error_reports table"
   ]
  ],
  "dashboards": [
   [
    "Activity Dashboard",
    "Per-operator workload, milestone overdue flags, team breakdown"
   ]
  ],
  "records": [
   [
    "airShip",
    "ship, user, mbl, eta, ata, can, do, dd, pod, inv, cc, audit, auditpercent, error_flag"
   ],
   [
    "audit_cmp_air",
    "ship, 16 question slots (q1_1 through q9_1), audit metadata (auditor, auditpercent, timestamp)"
   ]
  ],
  "integrations": [
   [
    "n8n",
    "POSTs JSON shipments to upload_shipment_n8n.php with field mapping"
   ],
   [
    "oceanImports.cargowise",
    "Read ocean-import workload for AHT calculation joins"
   ],
   [
    "PhpSpreadsheet",
    "Excel export for audit reports and mailcount data"
   ]
  ],
  "security": [],
  "engineering": [
   "n8n endpoint performs field transformation (status truncation, service code mapping)",
   "audit_cmp_air has 48 columns (16 slots × 3) — unnormalized design",
   "Two audit subsystems with different auth gates (oi_login for CS audit only)"
  ],
  "outcomes": [
   "Live shipment milestone visibility",
   "Quality audit with error flagging",
   "Cross-team workload tracking and AHT benchmarking"
  ]
 },
 "aew": {
  "purpose": "Authentication and navigation hub for Air Export operations to eventually consolidate shipment tracking, data uploads, auditing, and reporting modules under one entry point.",
  "concept": "Two-step login (credentials + OTP via Resend) with role-based landing page showing placeholder module cards and external links to sibling AJWW apps.",
  "scope": {
   "in": [
    "User login credentials",
    "OTP email delivery"
   ],
   "out": [
    "Module navigation",
    "External app links"
   ]
  },
  "roles": [
   [
    "Operator",
    "Logs and tracks shipments"
   ],
   [
    "Controller",
    "Manages system configuration"
   ],
   [
    "Admin",
    "Full system access"
   ]
  ],
  "workflow": [
   [
    "Login",
    "User enters username and password",
    "User"
   ],
   [
    "OTP Sent",
    "Resend emails 6-digit code to user email",
    "System"
   ],
   [
    "OTP Verify",
    "User enters code and gains authenticated session",
    "User"
   ],
   [
    "Set Password",
    "First-time users must set their own password",
    "User"
   ]
  ],
  "modules": [
   [
    "Authentication",
    "Two-step login with OTP verification"
   ],
   [
    "Navigation Hub",
    "Module preview cards and external app links (not yet wired)"
   ]
  ],
  "dashboards": [],
  "records": [
   [
    "users",
    "user_id, username, email, password_hash, access_type (Controller/Admin/Operator), is_active, login_count, last_login_at"
   ]
  ],
  "integrations": [
   [
    "Resend",
    "OTP email delivery service"
   ]
  ],
  "security": [
   "Bcrypt password hashing ($2y$10$...)",
   "Session isolation via AIREXPORTS_SESSID cookie",
   "force_reset flag enforces password change on first sign-in"
  ],
  "engineering": [
   "Plain PHP 8.2 with no framework",
   "Session isolation prevents conflicts with sibling AJWW apps",
   "24-hour sliding idle timeout with heartbeat"
  ],
  "outcomes": [
   "Secure authenticated entry point",
   "Foundation ready for module expansion"
  ]
 },
 "aiw": {
  "purpose": "Secure landing page and navigation hub for Air Import operations as operational modules are built out in parallel development.",
  "concept": "Simple username/password login with role badges and placeholder module cards; session isolated from other AJWW apps on same domain.",
  "scope": {
   "in": [
    "User login"
   ],
   "out": [
    "Role-based landing page",
    "External app links"
   ]
  },
  "roles": [
   [
    "Operator",
    "Will manage inbound shipments"
   ],
   [
    "Admin",
    "System configuration"
   ]
  ],
  "workflow": [
   [
    "Login",
    "User enters username and password",
    "User"
   ],
   [
    "Session Start",
    "Credentials verified against database and session created",
    "System"
   ],
   [
    "Dashboard Load",
    "Role-based landing page displayed with module placeholders",
    "User"
   ]
  ],
  "modules": [
   [
    "Authentication",
    "Username/password login (no OTP)"
   ],
   [
    "Navigation Hub",
    "Placeholder module cards for future development"
   ]
  ],
  "dashboards": [],
  "records": [
   [
    "users",
    "user_id, username, email, password_hash, role (Admin/Operator), is_active"
   ]
  ],
  "integrations": [],
  "security": [
   "Session isolation via app-specific cookie",
   "Basic authentication flow"
  ],
  "engineering": [
   "Simpler than Air-Exports (no OTP)",
   "Mirrored codebase structure for consistency"
  ],
  "outcomes": [
   "Entry point for future Air Imports development"
  ]
 },
 "unbilled": {
  "purpose": "Real-time visibility into completed but uninvoiced shipments across 5 transport modes with ageing-bucket dashboards to prevent revenue leakage and automated month-end chase emails.",
  "concept": "Logysis Excel uploads feed mode-specific tables, surface 9 ageing buckets (0-3 to 120+ days) segmented by operator/team/country, trigger daily and month-end email reminders via n8n webhook.",
  "scope": {
   "in": [
    "Logysis Excel exports per mode",
    "ETA-only updates",
    "Pending-records CSV"
   ],
   "out": [
    "Ageing dashboard",
    "Email reminders",
    "Remark exclusions"
   ]
  },
  "roles": [
   [
    "Operator",
    "Uploads per-mode unbilled report and chases their pile"
   ],
   [
    "Admin",
    "Bulk upload management, remarks, email trigger activation"
   ]
  ],
  "workflow": [
   [
    "Upload Logysis Report",
    "Operator exports per-mode unbilled report from Logysis and uploads",
    "Operator"
   ],
   [
    "Sync-Delete",
    "Non-uploaded rows deleted (sheet is source of truth)",
    "System"
   ],
   [
    "Ageing Calculation",
    "DATEDIFF logic buckets rows into 9 age ranges using ETD/ETA/shipment_date",
    "System"
   ],
   [
    "Email Trigger",
    "Admin clicks daily or month-end button, fires n8n webhook",
    "Admin"
   ]
  ],
  "modules": [
   [
    "Unbilled Dashboard",
    "Ageing buckets by operator/team/country with KPI tiles"
   ],
   [
    "Records View",
    "Searchable grid filtered by operator scope or admin full access"
   ],
   [
    "Remarks Management",
    "Bulk-add/edit/delete exclusion reasons for never-bill shipments"
   ],
   [
    "Report Builder",
    "Custom column export to Excel with formatting"
   ],
   [
    "ETA Updates",
    "Refresh air/ocean import ETAs without full data re-upload"
   ]
  ],
  "dashboards": [
   [
    "Ageing Dashboard",
    "Bucket counts (0-3 / 4-7 / 8-15 / 16-30 / 31-45 / 46-60 / 61-90 / 91-120 / 120+) sliced by operator, team, country with month-end pending indicator"
   ]
  ],
  "records": [
   [
    "unbilled_records_ae",
    "job_owner, shipment_number, etd, eta, remarks, ageing metadata"
   ],
   [
    "unbilled_records_oi",
    "job_owner, ptp_operator, customs_clearance_operator, transport_operator, shipment_number, etd, eta"
   ]
  ],
  "integrations": [
   [
    "Logysis",
    "Direct Excel export (no macro pipeline)"
   ],
   [
    "n8n",
    "Webhook-driven daily and month-end email reminders"
   ],
   [
    "PhpSpreadsheet",
    "Chunked Excel read (1000 rows) for multi-thousand-row files"
   ]
  ],
  "security": [
   "Session-based on shared oi_login"
  ],
  "engineering": [
   "TRUNCATE + sync-delete pattern (different from UPSERT)",
   "5 mode tables instead of 1 normalized design",
   "Chunked reader prevents OOM on large files"
  ],
  "outcomes": [
   "Consolidated unbilled visibility across 5 transport modes",
   "Automated month-end revenue chasing reminders"
  ]
 },
 "bt": {
  "purpose": "Vendor invoice pending tracker for upstream BravoTran system where operators respond with remarks, AP focals classify pending items, and escalation emails fire after 3 days of silence.",
  "concept": "",
  "scope": {
   "in": [
    "BravoTran Excel export"
   ],
   "out": [
    "Email notifications",
    "Status transitions",
    "Escalation routing"
   ]
  },
  "roles": [
   [
    "Operator",
    "Responds to flagged invoices with remarks"
   ],
   [
    "AP Focal",
    "Classifies and reviews pending invoices"
   ],
   [
    "Team Lead",
    "Receives escalation when operator unresponsive"
   ]
  ],
  "workflow": [
   [
    "Upload Excel",
    "Admin uploads BT pending data, TRUNCATE replaces table",
    "Admin"
   ],
   [
    "First Notification",
    "n8n detects new rows, sends email to operator with all pending invoices",
    "System"
   ],
   [
    "3-Day Escalation",
    "After Due_date passes, escalate to Team Lead and Manager",
    "System"
   ],
   [
    "Stale Remarks",
    "If operator updates remarks but goes silent 7+ days, re-escalate",
    "System"
   ]
  ],
  "modules": [
   [
    "Dashboard",
    "Pending invoices by operator, vendor, ageing range with status pills"
   ],
   [
    "Dashboard2",
    "Operator/team rollup with count vs. amount metric modes"
   ],
   [
    "Report Builder",
    "Column-subset export to Excel or CSV"
   ],
   [
    "User Access",
    "Per-user operator visibility grants (name-scoped users only)"
   ]
  ],
  "dashboards": [
   [
    "BT Records",
    "Multi-select operator/vendor/ageing filters, status indicators"
   ],
   [
    "Operator/Team Rollup",
    "Two views (userwise and team) with amount/count toggle"
   ]
  ],
  "records": [
   [
    "BT_pending_data",
    "bt_invoice_id, Operator, new_operator, Invoice_Total, Accrued_Total, Status, Notification_date, Due_date, Escalation_date, Reminder, AP_Focal_Remarks, Remarks_Updated_on"
   ]
  ],
  "integrations": [
   [
    "n8n",
    "Webhook Testing (email + state machine logic)"
   ],
   [
    "Gmail OAuth",
    "Sender AJWW BT TRIGGER via n8n"
   ],
   [
    "officedata.uploadtime",
    "Heartbeat keyed by user='bt_data'"
   ]
  ],
  "security": [
   "Name-scoped users see own rows + granted operator rows"
  ],
  "engineering": [
   "Centralized DB config (first app to use this pattern)",
   "TRUNCATE + INSERT (different from UPSERT)",
   "Operator reassignment clears AP_Focal_Remarks_updated_on to force re-review"
  ],
  "outcomes": [
   "Vendor invoice aging visibility",
   "Escalation cadence preventing invoice hold-up"
  ]
 },
 "billperf": {
  "purpose": "Track sea-import (OI) billing timeliness SLAs — measure business-day gap between shipment milestone and first invoice, sliced by operator and location, surface on-time vs. late buckets.",
  "concept": "Custom MySQL function business_days_diff() counts weekdays between reference date (ETA or empty_return) and invoice date; dashboard aggregates by operator with separate PTP/DTD bucket schemes.",
  "scope": {
   "in": [
    "Manual Excel upload from Logysis"
   ],
   "out": [
    "SLA dashboard",
    "Drill-down reports"
   ]
  },
  "roles": [
   [
    "Operator",
    "Uploads OI billing data from Logysis"
   ],
   [
    "Manager",
    "Views SLA performance by operator"
   ]
  ],
  "workflow": [
   [
    "Upload Excel",
    "Operator exports OI billing from Logysis and uploads 27-column sheet",
    "Operator"
   ],
   [
    "UPSERT Rows",
    "Keyed by shipment_no; blanks preserve existing data",
    "System"
   ],
   [
    "Heartbeat Update",
    "officedata.uploadtime set to NOW() with team='oi_billing'",
    "System"
   ],
   [
    "Dashboard Compute",
    "business_days_diff() applied per row to bucket SLA performance",
    "System"
   ]
  ],
  "modules": [
   [
    "Dashboard",
    "Three tables (India, Turkey, Overall) by job_owner with PTP/DTD buckets"
   ],
   [
    "Detailed Data",
    "Filterable record list with status pills and ageing cells"
   ],
   [
    "Report Builder",
    "Column picker and date filters with Excel export"
   ]
  ],
  "dashboards": [
   [
    "SLA Dashboard",
    "job_owner × PTP/DTD family with on-time / 1–3 late / 4–5 late / 6+ late buckets"
   ]
  ],
  "records": [
   [
    "OI_billing",
    "job_owner, shipment_no, eta, empty_return, first_invoice_date, location_udf, type_of_movement, invoice_no_and_date"
   ]
  ],
  "integrations": [
   [
    "empty_return_tracking",
    "Reads and writes oceanImports.empty_return table for backfill"
   ],
   [
    "PhpSpreadsheet",
    "Excel import and styled export"
   ],
   [
    "MySQL function",
    "Custom business_days_diff() stored function"
   ]
  ],
  "security": [],
  "engineering": [
   "Custom MySQL stored function required (not in repo)",
   "Column alias names misleading (count_0_2 ≠ actual day range)",
   "Cross-app table writes to empty_return (intentional operator backfill)"
  ],
  "outcomes": [
   "Sea-import SLA compliance visibility",
   "Per-operator billing timeliness accountability"
  ]
 },
 "aht": {
  "purpose": "Activity-time tracking for AP team to measure handle-time per activity type and identify efficiency gaps against historical averages; replaced broken browser-only timer with server-side persistence.",
  "concept": "Persistent running-timer clock stored on server, per-activity drag-drop activity master with team defaults, custom per-person assignment, 06:00 IST working-day boundary, 90-day personal vs. team benchmarking.",
  "scope": {
   "in": [
    "Activity selection",
    "Timer start/stop"
   ],
   "out": [
    "Per-activity averages",
    "Team benchmarks",
    "CSV export"
   ]
  },
  "roles": [
   [
    "AP Team",
    "Log activities with durations"
   ],
   [
    "Admin",
    "Manage activity master and per-person assignments"
   ]
  ],
  "workflow": [
   [
    "Open Tracker",
    "Running-timer state loaded from server file data/running/<hash>.json",
    "User"
   ],
   [
    "Work Activity",
    "Complete a task, then select activity from custom dropdown",
    "Operator"
   ],
   [
    "Submit Entry",
    "Records start → now duration, timer resets for next entry",
    "Operator"
   ],
   [
    "Dashboard View",
    "Per-activity average shown alongside each person's delta from benchmark",
    "Admin"
   ]
  ],
  "modules": [
   [
    "Tracker",
    "Activity dropdown, running timer, refresh-time button, notes field"
   ],
   [
    "Dashboard",
    "Per-activity card with per-person efficiency delta display"
   ],
   [
    "Activity Master",
    "Add/edit activities, team defaults, sub-activities"
   ],
   [
    "Users",
    "Per-person assignment (override team defaults)"
   ]
  ],
  "dashboards": [
   [
    "Performance Dashboard",
    "Activity card per-person delta from historical average (90-day personal vs. all-time team)"
   ]
  ],
  "records": [
   [
    "aht_ap",
    "date, start_time, end_time, activity, operator, duration"
   ],
   [
    "Apteam",
    "id, username, team, is_active, password_hash (bcrypt)"
   ]
  ],
  "integrations": [],
  "security": [
   "Bcrypt password hashing",
   "Session rotation only on sign-in (prevents fixation)",
   "Private session directory (not shared with other apps)"
  ],
  "engineering": [
   "Clock lives on server (data/running/<hash>.json), browser renders only",
   "Working day 06:00 IST to 06:00 IST (not midnight)",
   "Activity assignment: team default + per-person override in single JSON"
  ],
  "outcomes": [
   "Activity-level efficiency benchmarking",
   "Operator performance accountability against team average"
  ]
 },
 "claim": {
  "purpose": "Portal for ops staff to raise and track invoice disputes/claims against carriers, truckers, and other counterparties with supporting attachments; dispute handlers manage 9-state workflow with timeline notes and automated escalations.",
  "concept": "Public dispute form + login-gated management, bcrypt users table shared with trucker app, JSON attachments + follow-up timeline, three n8n webhooks (new submission / update / daily cron email report).",
  "scope": {
   "in": [
    "Public dispute submission",
    "Logysis shipment master upload"
   ],
   "out": [
    "Email notifications",
    "Status reports",
    "Audit trail"
   ]
  },
  "roles": [
   [
    "Operator",
    "Submits dispute with attachments"
   ],
   [
    "Dispute Handler",
    "Manages lifecycle, updates status, adds notes"
   ],
   [
    "Admin",
    "User and master data management"
   ]
  ],
  "workflow": [
   [
    "Public Submission",
    "Consignee/operator fills dispute form with shipment, party, amount, attachments",
    "Operator"
   ],
   [
    "New Webhook",
    "POST to claims_and_dispute_new fires transactional email to default handler",
    "System"
   ],
   [
    "Handler Review",
    "Dispute handler updates status, adds notes, reassigns if needed",
    "Handler"
   ],
   [
    "Update Webhook",
    "POST to claims_and_dispute_update sends reassign OR note-added emails",
    "System"
   ],
   [
    "Daily Cron",
    "10:00 AM Mon-Fri sends consolidated Claims/Dispute/Trucker report",
    "System"
   ]
  ],
  "modules": [
   [
    "Dispute Form",
    "Public form for new disputes"
   ],
   [
    "Claims List",
    "Filterable records with status pills"
   ],
   [
    "Claim Edit",
    "Handler updates status, adds notes, reassigns, attaches files"
   ],
   [
    "Dashboard",
    "Date-preset pivots by handler × party_type/source"
   ],
   [
    "Reports",
    "Date-range export with column picker"
   ],
   [
    "Shipment Upload",
    "Logysis shipment-master Excel refresh"
   ]
  ],
  "dashboards": [
   [
    "KPI Dashboard",
    "Date presets (this month / 3m / 6m / YTD / custom) pivoted by handler and party_type/source"
   ]
  ],
  "records": [
   [
    "shipment_disputes",
    "id (AJ-YYMM-NNNN), form_type (Dispute/Claim), shipment_no, operator, dispute_party, invoice_amount, dispute_amount, Status, notes (JSON timeline)"
   ]
  ],
  "integrations": [
   [
    "n8n",
    "Three webhooks: claims_and_dispute_new, claims_and_dispute_update, Claims Daily Trigger New cron"
   ],
   [
    "Gmail OAuth",
    "Via n8n sender AJWW CLAIMS AND DISPUTE"
   ],
   [
    "PhpSpreadsheet",
    "Shipment upload and report export"
   ]
  ],
  "security": [
   "Shared users table with trucker app (bcrypt hashes)",
   "Private session LOGISYS_DISPUTE_SESSID",
   "Viewer mode enforced server-side (not just CSS)"
  ],
  "engineering": [
   "Two codebase copies (logisys + trucker) sharing layout partials",
   "JSON attachments store relative file URLs",
   "Follow-up dates as JSON array for timeline",
   "form_type controls email recipient routing"
  ],
  "outcomes": [
   "Centralized dispute tracking",
   "Escalation cadence via n8n state machine"
  ]
 },
 "truckissue": {
  "purpose": "Portal for raising and tracking disputes against trucking partners (detention, per-diem, etc.) with multi-line charge breakdown and handler lifecycle management; notifications sent via EmailJS directly from browser.",
  "concept": "Public dispute form + login-gated management, charges_array JSON for per-line tracking, bcrypt users table shared with claim app, EmailJS templates fire directly from browser (no n8n webhook).",
  "scope": {
   "in": [
    "Public dispute submission"
   ],
   "out": [
    "Browser-side email notifications"
   ]
  },
  "roles": [
   [
    "Operator",
    "Submits dispute with charge lines"
   ],
   [
    "Dispute Handler",
    "Manages lifecycle"
   ],
   [
    "Admin",
    "User and master data management"
   ]
  ],
  "workflow": [
   [
    "Form Submission",
    "Operator selects charge lines (detention, per-diem, etc.) with invoice and dispute amounts",
    "Operator"
   ],
   [
    "Submit",
    "JS aggregates charges into charges_array and POSTs to submit_shipment.php",
    "Operator"
   ],
   [
    "EmailJS Send",
    "Browser calls EmailJS directly with template_st5g0gm",
    "User"
   ],
   [
    "Handler Update",
    "Handler reassigns or adds notes via claimEdit.php",
    "Handler"
   ],
   [
    "EmailJS Notify",
    "Browser fires template_xwtw00s (reassign) or template_d8aglrq (note)",
    "User"
   ]
  ],
  "modules": [
   [
    "Dispute Form",
    "Multi-line charge picker with aggregated totals"
   ],
   [
    "Claims List",
    "Filterable records"
   ],
   [
    "Claim Edit",
    "Handler reassign, note add, status update"
   ],
   [
    "Dashboard",
    "KPI pivots by handler"
   ],
   [
    "Reports",
    "Column-picker export"
   ]
  ],
  "dashboards": [
   [
    "KPI Dashboard",
    "Disputes by handler and party_type/source"
   ]
  ],
  "records": [
   [
    "trucker_dispute",
    "id (AJ-TR-YYMM-NNNN), charges_array (JSON lines with charge_name, invoice_amount, dispute_amount), invoice_amount, dispute_amount, profit_loss"
   ]
  ],
  "integrations": [
   [
    "EmailJS",
    ""
   ]
  ],
  "security": [
   "Shared users table with claim app",
   "Private session TRUCKER_DISPUTE_SESSID",
   "Viewer mode enforced server-side",
   "EmailJS public key exposed in page source"
  ],
  "engineering": [
   "Mirrored codebase with claim app (shared layout partials)",
   "Multi-line charges in JSON array",
   "EmailJS direct from browser (no backend email call)"
  ],
  "outcomes": [
   "Trucker dispute tracking",
   "Multi-charge line visibility"
  ]
 },
 "claims": {
  "purpose": "Centralized PHP/MySQL web application for managing claims, disputes, and trucker disputes across AJWW operations in unified interface.",
  "concept": "Three dispute types (Claim/Dispute/Trucker) in unified table with role-based access, auto-status transition when follow-up due, file attachments up to 25 MB.",
  "scope": {
   "in": [
    "Web form submission"
   ],
   "out": [
    "Status dashboard",
    "Excel export"
   ]
  },
  "roles": [
   [
    "Claim Handler",
    "Process claims"
   ],
   [
    "Dispute Handler",
    "Manage disputes"
   ],
   [
    "Operator",
    "Record disputes"
   ],
   [
    "Admin",
    "System config"
   ]
  ],
  "workflow": [
   [
    "Dispute Entry",
    "Operator fills form with shipment, issue, amount, documents",
    "Operator"
   ],
   [
    "Follow-up Auto-Transition",
    "On page load, rows with past follow-up_date marked Action Required",
    "System"
   ],
   [
    "Handler Review",
    "Handler updates status and remarks",
    "Handler"
   ]
  ],
  "modules": [
   [
    "Dispute Form",
    "Unified form for Claim/Dispute/Trucker types"
   ],
   [
    "Dashboard",
    "List with filters"
   ],
   [
    "Reports",
    "Export to Excel"
   ]
  ],
  "dashboards": [
   [
    "Dispute Dashboard",
    "Filterable list by form_type, status, operator, handler"
   ]
  ],
  "records": [
   [
    "cd_disputes",
    "form_type, shipment_no, operator, status, follow_up_date, created_at"
   ],
   [
    "cd_attachments",
    "file references"
   ]
  ],
  "integrations": [],
  "security": [
   "Bcrypt passwords",
   "6-hour session timeout"
  ],
  "engineering": [
   "Unified table (vs. separate tables in trucker/logisys apps)",
   "Auto-status sweep runs per page load"
  ],
  "outcomes": [
   "Consolidated dispute visibility"
  ]
 },
 "loi": {
  "purpose": "Public-facing web form that lets a consignee digitally sign a Letter of Indemnity accepting financial responsibility for demurrage, detention, customs charges, and related penalties; PDF rendered and emailed.",
  "concept": "",
  "scope": {
   "in": [
    "Public form submission"
   ],
   "out": [
    "Signed PDF",
    "Email notification"
   ]
  },
  "roles": [
   [
    "Consignee",
    "Signs LOI digitally"
   ],
   [
    "AJ Ops",
    "Views and downloads signed PDFs"
   ]
  ],
  "workflow": [
   [
    "Open Form",
    "Consignee receives link from AJ ops, opens form.php",
    "Consignee"
   ],
   [
    "Fill & Sign",
    "Enters name/title/company/email, signs canvas pad, clicks Submit",
    "Consignee"
   ],
   [
    "PDF Generation",
    "mPDF renders A4 LOI with signature, saves under loi_agreements/",
    "System"
   ],
   [
    "Email Send",
    "submit.php POSTs PDF (base64) to EmailJS with consignee + AJ CC",
    "System"
   ]
  ],
  "modules": [
   [
    "Public Form",
    "Consignee signature capture with canvas"
   ],
   [
    "Admin Dashboard",
    "View/download signed PDFs, filter by date/consignee"
   ]
  ],
  "dashboards": [],
  "records": [
   [
    "loi_records",
    "identity_no (AJ-LOI-<MM><####>), consignee_name, reference_no, sign_title, email, pdf_path, date_signed, created_at"
   ]
  ],
  "integrations": [
   [
    "EmailJS REST API",
    "POSTs base64 PDF to the EmailJS API"
   ],
   [
    "mPDF",
    "PDF rendering (Composer dependency)"
   ]
  ],
  "security": [],
  "engineering": [],
  "outcomes": [
   "Digital LOI collection",
   "Signed PDF audit trail"
  ]
 }
});
