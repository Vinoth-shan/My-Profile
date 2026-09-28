// Public-safe project details (sanitised: no credentials, hosts, names or security findings).
Object.assign(window.DETAILS = window.DETAILS || {}, {
 "ccc": {
  "purpose": "AJWW's multi-tenant warehouse portal for third-party inventory management. Serves two external customers to track ocean-imported goods through receive, store, pick, ship lifecycle.",
  "concept": "SaaS portal where customers log in to view real-time pallet inventory, upload inbound/outbound manifests, and generate compliance reports. Admin tenant switcher for unified view.",
  "scope": {
   "in": [
    "Inbound pallet tracking",
    "Live inventory by location",
    "Outbound orders with pallet linking",
    "PDF reports & statements",
    "n8n email delivery",
    "Tenant isolation"
   ],
   "out": [
    "Return goods workflows",
    "Multi-warehouse support",
    "Mobile app"
   ]
  },
  "roles": [
   [
    "Customer User",
    "View-only access to own tenant inventory, reports"
   ],
   [
    "Admin",
    "All uploads, edit columns, tenant switching, n8n trigger"
   ],
   [
    "System",
    "n8n workflows send reports via Gmail"
   ]
  ],
  "workflow": [
   [
    "1. Inbound Upload",
    "Excel file inserts pallet_id, qty, expiry into inbound_tbN; Balance_Qty initialized",
    "Admin"
   ],
   [
    "2. Inventory Sync",
    "Inventory_whN populated with location codes (2-43-E format) and available/staged/held partitions",
    "System"
   ],
   [
    "3. Outbound Upload",
    "Excel inserts picking data, decrements Balance_Qty transactionally; blocks if negative",
    "Admin"
   ],
   [
    "4. BOL Upload",
    "PDF stored in Bol_docs/, path linked to outbound row by PO_NO",
    "Admin"
   ],
   [
    "5. Report Request",
    "User/Admin triggers report page (inbound/outbound/inventory/statement)",
    "Customer/Admin"
   ],
   [
    "6. n8n Email",
    "Report HTML + base64 Excel sent via Gmail webhook to customer ops team",
    "n8n"
   ]
  ],
  "modules": [
   [
    "Inbound List",
    "View arrivals by container; edit WO, product, lot, expiry"
   ],
   [
    "Inventory Dashboard",
    "Real-time stock by location, SKU, available qty"
   ],
   [
    "Outbound List",
    "View shipments with BOL status; edit picking slip links"
   ],
   [
    "Reports",
    "Inbound/Outbound/Inventory/Invoice/Statement PDF/Excel generation"
   ],
   [
    "Admin Panel",
    "Tenant switcher, user mgmt, workflow triggers"
   ]
  ],
  "dashboards": [
   [
    "Live Stock Dashboard",
    "Inventory_whN pivoted by product, location, availability (available/staged/held)"
   ],
   [
    "Weekly Insight",
    "Date-range inbound vs outbound qty by product, emailed pivot"
   ],
   [
    "Transaction Statement",
    "Debit/credit ledger with running balance, CSV/PDF export"
   ]
  ],
  "records": [
   [
    "inbound_tbN",
    "WO, Container, Product, Pallet_ID, Lot_No, Expiry_Date, Actual_Qty, Balance_Qty"
   ],
   [
    "outbound_tbN",
    "SKU_Code, PO_NO, Pallet_ID (PID), Ship_Out_Date, BOL PDF path, documents"
   ],
   [
    "inventory_whN",
    "pallet_id, product, location (aisle-bay-tier), available_qty, staged, held, lot, ed"
   ],
   [
    "ccc_transaction",
    "transaction_type, ref_no, date, debit, credit, balance"
   ],
   [
    "ccc_login",
    ""
   ]
  ],
  "integrations": [
   [
    "Gmail OAuth2",
    "Sender 'AJWW Warehouse' via shared credential JTkyzx6Yx87X6lem"
   ]
  ],
  "security": [],
  "engineering": [
   "Dual-table per-tenant schema with column divergence between tenants",
   "Inbound table doubles as pallet ledger: Balance_Qty decremented on outbound",
   "n8n webhook payloads include base64 Excel attachment decoded server-side"
  ],
  "outcomes": [
   "Eliminated manual warehouse manifest tracking for two customers",
   "Real-time inventory visibility reduced picking errors",
   "Statement reports automated, email-on-demand to customer ops",
   "Tenant-aware schema design enables per-customer scale"
  ]
 },
 "pms": {
  "purpose": "AJWW OFW (Chennai back office) needed a structured annual performance appraisal system to replace manual feedback loops. Enforces multi-stage workflow to prevent out-of-order reviews.",
  "concept": "4-step workflow portal: employees self-assess with docs, managers review, HR appraisers rate, HR accepts. Year-scoped tables (pms_2025, pms_2026) track all submissions with edit history.",
  "scope": {
   "in": [
    "Employee self-assessment with attachments",
    "Manager feedback & recommendations",
    "HR appraisal ratings & comments",
    "Final HR acceptance/decision",
    "PDF report generation (3 formats)",
    "Multi-year support"
   ],
   "out": [
    "360-degree reviews",
    "Email notifications",
    "Bulk feedback upload"
   ]
  },
  "roles": [
   [
    "Employee",
    "Submit accomplishments + docs (1 MB max), view own PMS"
   ],
   [
    "Manager",
    "Review employee submissions, provide feedback"
   ],
   [
    "Reviewer/Appraiser",
    "Rate performance, comment on appraisal"
   ],
   [
    "HR Admin",
    "Accept final decision, generate reports, password-reset"
   ]
  ],
  "workflow": [
   [
    "1. Employee Submit",
    "Self-assessment: list accomplishments, upload supporting docs (PDF/JPG/DOC) up to 1 MB each",
    "Employee"
   ],
   [
    "2. Manager Review",
    "Manager reads submission, adds feedback & recommendations in step 2-4",
    "Manager"
   ],
   [
    "3. Reviewer Appraise",
    "Appraiser conducts performance ratings, comments, determines final rating",
    "Reviewer"
   ],
   [
    "4. HR Accept",
    "HR signs off on decision, generates PDF for employee file",
    "HR"
   ]
  ],
  "modules": [
   [
    "Self-Assessment Entry",
    "Employee inputs accomplishments as text array, uploads docs to Docs/ folder"
   ],
   [
    "Manager Dashboard",
    "My Team view: list of direct reports with submission status"
   ],
   [
    "Reviewer Form",
    "Appraisal ratings + comments per employee, multi-step workflow"
   ],
   [
    "PDF Generators",
    "Three formats (pdf, pdf2, pdf3) for different report layouts"
   ],
   [
    "Admin Panel",
    "User management, report generation, activity audit"
   ]
  ],
  "dashboards": [
   [
    "Performance Review",
    "Status overview: submitted/reviewed/accepted per employee"
   ],
   [
    "Activity Audit",
    "Edit history by employee and date"
   ],
   [
    "Report Export",
    "PDF/CSV download of all appraisals"
   ]
  ],
  "records": [
   [
    "ofw_user",
    ""
   ],
   [
    "pms_<year>",
    "employee_id, step (1-4), accomplishments[], existing_attachment[], manager_feedback, reviewer_ratings, hr_decision, created_at, updated_at"
   ]
  ],
  "integrations": [
   [
    "Session Keep-Alive",
    "AJAX /session_keepalive.php to extend session lifetime"
   ]
  ],
  "security": [
   "migrate to password_hash)",
   "File uploads to public Docs/ folder (validate extensions)",
   "Access control via simple access=1 flag (not fine-grained roles)"
  ],
  "engineering": [
   "Multi-year by table suffix: manual pms_<year> table creation required each fiscal year",
   "Three PDF export formats (unclear which is canonical; should consolidate)",
   "No soft-delete: submissions hard-deleted (recommend is_deleted flag for audit)",
   "Session timeout 30 minutes, token regenerated per login"
  ],
  "outcomes": [
   "Structured 4-step appraisal replaced manual email chains",
   "Audit trail tracks who submitted what and when",
   "PDF reports standardize documentation for employee files",
   "Role-based workflow prevents step skipping"
  ]
 },
 "room": {
  "purpose": "OFW office in Chennai needed a shared conference room booking system to prevent double-bookings and show availability on a lobby wall TV.",
  "concept": "FullCalendar-based booking portal. Employees log in, reserve 30-min slots. Conflict detection blocks overlaps. Public dashboard auto-refreshes on wall TV (no login).",
  "scope": {
   "in": [
    "Calendar view of all bookings",
    "Conflict detection & blocking",
    "Per-employee authentication",
    "Public wall-TV dashboard",
    "30-minute slot boundaries"
   ],
   "out": [
    "Multi-room support",
    "Room features (capacity, A/V)"
   ]
  },
  "roles": [
   [
    "OFW Employee",
    "View calendar, create/delete own bookings, see others' bookings"
   ],
   [
    "Wall-TV System",
    "Public endpoint; auto-refresh every 60s, shows all bookings"
   ]
  ],
  "workflow": [
   [
    "1. Login",
    "Employee ID + password → allowed_users.json check → access_token issued",
    "Employee"
   ],
   [
    "2. View Calendar",
    "FullCalendar loads all bookings for month; own bookings highlighted orange",
    "Employee"
   ],
   [
    "3. Reserve Slot",
    "Click empty slot → form (date/time/description) → conflict check via CONCAT(date, time)",
    "Employee"
   ],
   [
    "4. Confirm Booking",
    "INSERT into conference_room_schedule if no overlap; refresh calendar",
    "System"
   ],
   [
    "5. Dashboard",
    "",
    "System"
   ]
  ],
  "modules": [
   [
    "Calendar View",
    "FullCalendar month/week, clickable slots, personal bookings in orange"
   ],
   [
    "Booking Form",
    "Date, start/end time, description (optional), 30-min boundary validation"
   ],
   [
    "Public Dashboard",
    "Full-page calendar, auto-refresh 60s, grey events, employee names visible"
   ],
   [
    "Admin Link",
    "Index page has Admin & Registrar shortcuts"
   ]
  ],
  "dashboards": [
   [
    "Employee Calendar",
    "Personal and team bookings, 30-min granularity"
   ],
   [
    "Wall-TV Public",
    "All bookings, no login required, day view intended for lobby kiosk"
   ]
  ],
  "records": [
   [
    "conference_room_schedule",
    "employee_id, employee_name, booking_date, end_date, start_time, end_time, desc, created_at"
   ],
   [
    "ofw_user",
    "Employee ID, password, Employee Name, Designation, Department, Email ID (read-only)"
   ]
  ],
  "integrations": [
   [
    "ofw_user (PMS-OFW table)",
    "Read-only: authenticate login, pull employee details to stamp on bookings"
   ]
  ],
  "security": [
   "Whitelist maintained in allowed_users.json (no UI; manual edit required)",
   "Token rotation invalidates prior sessions silently",
   "Public dashboard exposes names/departments by design (wall-TV use case)"
  ],
  "engineering": [
   "Conflict detection uses CONCAT(date, time) to handle cross-midnight bookings",
   "30-min boundaries enforced: start/end times must be :00 or :30",
   "Separate end_date column supports bookings crossing midnight",
   "Second gate after PMS-OFW password check: allowed_users.json whitelist",
   "Two sessions: app (room_booking) and PMS (pms_ofw) isolated via session_name()"
  ],
  "outcomes": [
   "Eliminated room double-bookings via real-time conflict check",
   "Wall-TV dashboard visible without login (ideal for office kiosk)",
   "Slot-level granularity (30 min) prevents half-hour confusion",
   "Employee directory stamped on each booking (audit trail)"
  ]
 },
 "annual": {
  "purpose": "OFW Annual Day 2026 event platform. Needed email-OTP login (no password) and fair team draw that balances age bands across INDIA/BRASIL/USA/FRANCE teams.",
  "concept": "server decides fairness, locks assignment. Teaser film plays frame-by-frame on canvas.",
  "scope": {
   "in": [
    "Email-OTP login",
    "Team draw with fairness algorithm",
    "Age-band balanced assignment",
    "Teaser film rendering",
    "User directory"
   ],
   "out": [
    "Multi-event support",
    "Custom team definitions"
   ]
  },
  "roles": [
   [
    "Participant",
    "OTP login, view assigned team, watch teaser"
   ],
   [
    "Admin",
    "Seed users, trigger draw, view results"
   ]
  ],
  "workflow": [
   [
    "1. OTP Login",
    "",
    "Participant"
   ],
   [
    "2. Verify OTP",
    "Enter OTP → session + access_token issued",
    "Participant"
   ],
   [
    "3. First-Time Draw",
    "New user lands on spin page, clicks button → server computes age band",
    "Participant"
   ],
   [
    "4. Fair Assignment",
    "Server finds teams with fewest members in that age band, picks one randomly, locks in transaction",
    "System"
   ],
   [
    "5. Teaser Play",
    "13-second film (code-rendered canvas or mp4 fallback) plays after login",
    "Participant"
   ]
  ],
  "modules": [
   [
    "Login",
    "Email entry, OTP display (dev) or email send (prod), verify form"
   ],
   [
    "Team Draw",
    "Spin animation (client), server-side team picker result, result card"
   ],
   [
    "Profile",
    "User DOB, age band, assigned team (read-only after draw)"
   ],
   [
    "Teaser Studio",
    "Preview film at 1920x1080, record to webm/mp4, frame freeze by ?t=SECONDS"
   ]
  ],
  "dashboards": [
   [
    "Dashboard",
    "User's assigned team, team roster by age band"
   ]
  ],
  "records": [
   [
    "users",
    "email, dob, age_band (inferred), assigned_team (locked once), created_at"
   ],
   [
    "participants",
    "user_id, team, band"
   ]
  ],
  "integrations": [
   [
    "Email (prod)",
    ""
   ]
  ],
  "security": [
   "No persistent session storage shown; access_token issued per login"
  ],
  "engineering": [
   "Age band computed from DOB at assignment time (server-side)",
   "Team picker weighted: teams with fewer members in the band get preference",
   "Assignment locked in transaction (UPDATE user SET team = ? WHERE user_id = ?); immutable after",
   "Teaser film rendered frame-by-frame on canvas (14s duration, badge + monogram + launch)",
   "Real video files (mp4/webm) in public/media/ override code-rendered film"
  ],
  "outcomes": [
   "Fair team assignment balanced across age bands (no majority age band in one team)",
   "No password management needed: OTP-only login",
   "Teaser film generates excitement without video editing tooling",
   "50 dummy users pre-seeded for testing"
  ]
 },
 "odyssey": {
  "purpose": "Odyssey annual event in Sri Lanka. Needed room allocation system to split 64 Chalets (3 beds) and 20 Villas (4 beds) fairly across departments and genders.",
  "concept": "Admin assigns member counts per department/gender, registrars assign members to rooms one-by-one. Aadhaar upload required per person. Excel import seeds members, Excel export generates room manifest.",
  "scope": {
   "in": [
    "Villa quad (20x4 beds) split by department/gender",
    "Chalet triple (44x3 beds) for overflow",
    "Shared rooms for leftovers",
    "Aadhaar file upload validation (5 MB max)",
    "Excel import from rooming list",
    "Excel report with room layout"
   ],
   "out": [
    "Cross-property allocation",
    "Pre-assigned room numbers"
   ]
  },
  "roles": [
   [
    "Admin",
    "Edit room counts, assign member allocations to rooms, view status"
   ],
   [
    "Registrar",
    "Assign members to rooms one by one per department, upload Aadhaar"
   ],
   [
    "System",
    "Validate Aadhaar file type/size, generate Excel report"
   ]
  ],
  "workflow": [
   [
    "1. Import",
    "Python script reads rooming Excel, upsert members into rooming_members by Employee ID",
    "Admin"
   ],
   [
    "2. Configure",
    "Admin sets Villa allocation (20 rooms x 4 beds) and Chalet (44 rooms x 3 beds) split",
    "Admin"
   ],
   [
    "3. Assign Rooms",
    "Admin assigns member counts per department-gender combo to rooms (e.g., HR-Female: 3 members → Room 5)",
    "Admin"
   ],
   [
    "4. Registrar Assign",
    "Registrar logs in, picks department + gender, searches members, assigns to available rooms",
    "Registrar"
   ],
   [
    "5. Aadhaar Upload",
    "Per member: upload Aadhaar PDF/JPG (max 5 MB) to uploads/aadhaar/",
    "Registrar"
   ],
   [
    "6. Report",
    "Admin runs Excel export: one row per bed, merged Room No column, thin borders",
    "Admin"
   ]
  ],
  "modules": [
   [
    "Room Split",
    "Admin UI to allocate member counts (e.g., 'HR-Female: 5 members → Villa 01-04')",
    "Admin"
   ],
   [
    "Registrar",
    "Department picker, member search (name/emp ID), available room list, pick & assign"
   ],
   [
    "Room Page",
    "room.php?id=<room_no>: member list, add member form, Aadhaar upload"
   ],
   [
    "Report",
    "Excel download with Chalet sheet, Villa sheet, Not Assigned sheet"
   ]
  ],
  "dashboards": [
   [
    "Room Status",
    "Admin view: occupancy per room, unassigned member count"
   ],
   [
    "Registrar View",
    "Department roster, assigned vs. available members"
   ]
  ],
  "records": [
   [
    "rooming_members",
    "employee_id, name, email, phone, department, gender"
   ],
   [
    "rooming_rooms",
    "room_no (text), room_type (Villa/Chalet), capacity, assigned_count"
   ],
   [
    "rooming_room_members",
    "room_id FK, member_id FK, assigned_date"
   ],
   [
    "rooming_registrars",
    "employee_id, department"
   ]
  ],
  "integrations": [
   [
    "Excel import",
    "Python script: import_rooming_list.py reads XLSX Sheet1, upsert members"
   ]
  ],
  "security": [],
  "engineering": [
   "Member assignment is pick-by-department then pick-from-available-rooms",
   "Shared rooms created post-Chalet if overflow",
   "Report output: one row per bed (64*3 + 20*4 + shared rows), merged Room No across beds"
  ],
  "outcomes": [
   "Eliminated manual room assignment spreadsheets",
   "Fair gender/department split across room types",
   "Aadhaar evidence collected per guest (compliance/security)",
   "Single-sheet Excel export ready for front-desk check-in"
  ]
 },
 "org": {
  "purpose": "HR needed a centralized, shareable view of AJWW US org structure to answer reporting-line questions and plan headcount. Exported to PowerPoint for presentations.",
  "concept": "",
  "scope": {
   "in": [
    "Org chart visualization",
    "Headcount by department",
    "Business head listings",
    "Employee roster (ID, name, team, location)"
   ],
   "out": [
    "Manager updates from org chart",
    "Headcount forecasting"
   ]
  },
  "roles": [
   [
    "Data Owner",
    "Maintains Excel source (Organization Chart DB - US)"
   ],
   [
    "HR",
    "Runs build_org_json.py after Excel update, commits JSON"
   ],
   [
    "All Staff",
    "View HTML chart, check reporting lines"
   ]
  ],
  "workflow": [
   [
    "1. Update Excel",
    "HR edits Organization Chart DB - US (3).xlsx with new hires/transfers",
    "HR"
   ],
   [
    "2. Generate JSON",
    "Run python build_org_json.py from repo root",
    "Data Owner"
   ],
   [
    "3. Commit",
    "git add org_data.json && commit",
    "Data Owner"
   ],
   [
    "4. View Chart",
    "Open AJWW_US_Team_Structure_Presentation.html in browser",
    "All Staff"
   ],
   [
    "5. Export PPT",
    "OFW_US_Organization_Chart.pptx regenerated for presentations",
    "HR"
   ]
  ],
  "modules": [
   [
    "Org Chart",
    "HTML5 canvas or D3 tree (if AJAX-driven), shows reporting lines"
   ],
   [
    "Headcount Summary",
    "Table: Business Head, On-Roll, Trainee, Total"
   ],
   [
    "Employee List",
    "Filterable roster: ID, Name, Team, Department, Location"
   ]
  ],
  "dashboards": [
   [
    "Org Structure",
    "Tree view of all departments and reporting lines"
   ],
   [
    "Headcount Report",
    "Pivot by Business Head and Department, on-roll vs trainee"
   ]
  ],
  "records": [
   [
    "org_data.json",
    "meta (source, generatedOn, sheetsUsed), countSummary, employees array with id/name/team/dept/location/manager"
   ]
  ],
  "integrations": [
   [
    "Python script",
    "build_org_json.py reads Excel (Organization Chart DB - US (3).xlsx) and outputs JSON"
   ]
  ],
  "security": [],
  "engineering": [
   "JSON generated from Excel via Python script (one-way export, no live sync)",
   "Unresolved managers tracked in meta.unresolvedManagers (script makes assumptions for some)",
   "Duplicate OFW codes detected (OFW-669 appears twice; flagged in meta)"
  ],
  "outcomes": [
   "Single source of truth replaces scattered spreadsheets",
   "PowerPoint export for presentations (OFW_US_Organization_Chart.pptx)",
   "No database maintenance overhead",
   "Headcount snapshot preserved at generation time"
  ]
 },
 "daybook": {
  "purpose": "Personal responsibility tracker for solo use. Built in free time to manage daily tasks, income, loans, health metrics, and budget on Android via Capacitor.",
  "concept": "React 19 + TypeScript + Capacitor (iOS/Android native bridge). Local-first storage (Capacitor Filesystem + Preferences). Google Drive sync for cloud backup. Offline-first design.",
  "scope": {
   "in": [
    "Daily task tracking & completion",
    "Income/expense recording (bills, dues)",
    "Loan tracking with settle logic",
    "Health metrics (checkups, meds)",
    "Monthly budget overview",
    "Settings & data export/import",
    "Google Drive backup/restore",
    "Notifications for overdue tasks"
   ],
   "out": [
    "Multi-user sync",
    "Cloud-first design",
    "Web PWA"
   ]
  },
  "roles": [
   [
    "User",
    "Solo tracker: tasks, income, expenses, health, budget; offline sync to Drive"
   ]
  ],
  "workflow": [
   [
    "1. Add Task",
    "Create task with due date, category, priority",
    "User"
   ],
   [
    "2. Track Daily",
    "Check off completed tasks, log today's income/dues",
    "User"
   ],
   [
    "3. Record Bill",
    "Log one-time or recurring expense, category",
    "User"
   ],
   [
    "4. Backup",
    "Tap Backup in Settings → upload state to Google Drive (automatic or manual)",
    "User"
   ],
   [
    "5. Restore",
    "On new device: login Google, pull latest backup, decrypt local copy",
    "User"
   ],
   [
    "6. Notifications",
    "Local push alerts for overdue tasks, loan payment dates",
    "System"
   ]
  ],
  "modules": [
   [
    "Tasks Screen",
    "Today view + Backlog, check-off, add new, categories (work/home/health)"
   ],
   [
    "Money Screen",
    "Dashboard (income vs spend, balance), txn list, add txn form"
   ],
   [
    "Budget",
    "Monthly budget lines (groceries, rent, etc.), progress vs target"
   ],
   [
    "Vault",
    "Confidential notes (encrypted local storage)"
   ],
   [
    "Health",
    "Checkups, meds, metrics log, reminders"
   ],
   [
    "Settings",
    "Backup/Restore, Theme, Notifications, Data Export"
   ],
   [
    "Guide",
    "In-app help (offline, embedded markdown)"
   ]
  ],
  "dashboards": [
   [
    "Today",
    "Overdue + today's tasks, quick-log section for income/dues"
   ],
   [
    "Money Dashboard",
    "Net balance, income vs spend pie, recent transactions, budget status"
   ],
   [
    "Health Snapshot",
    "Last checkup date, next reminder, meds this week"
   ]
  ],
  "records": [
   [
    "tasks",
    "id, title, due_date, category, status (open/done), priority"
   ],
   [
    "transactions",
    "id, type (income/expense), amount, category, date"
   ],
   [
    "budgets",
    "month, category, limit, spent_to_date"
   ],
   [
    "health_logs",
    "date, type (checkup/med/metric), notes"
   ],
   [
    "backups",
    "timestamp, encrypted_blob, drive_file_id"
   ]
  ],
  "integrations": [
   [
    "Google Drive",
    "OAuth2 login, file storage/retrieval, auto-sync backup with conflict resolution"
   ],
   [
    "Google Calendar",
    "Sync due dates to calendar (if enabled)"
   ],
   [
    "Local Notifications",
    "Capacitor local-notifications for overdue reminders"
   ],
   [
    "Device Health",
    "Capacitor battery status, ask for exemption from doze mode"
   ]
  ],
  "security": [
   "Encryption at rest: AES-256 for vault notes (managed via Capacitor Preferences)",
   "Google Drive OAuth2 for sync (user auth, no server-side key storage)",
   "No backend server (all local processing)"
  ],
  "engineering": [
   "Capacitor bridge: native Android/iOS APIs for filesystem, camera (photo receipts), share, haptics",
   "React 19 with TypeScript for type safety",
   "Local-first: all data stored on device; Drive is backup not sync",
   "Task completion tracked with timestamps (no soft delete)"
  ],
  "outcomes": [
   "Consolidated personal finance tracking in one app (tasks + money + health)",
   "Offline-ready: works without internet (sync on reconnect)",
   "APK distributable without Play Store (manual install)",
   "Google Drive backup protects against device loss"
  ]
 },
 "wms": {
  "purpose": "AJ Worldwide needed a unified Warehouse Management System (WMS) for single-warehouse, single-tenant operations. Full lifecycle from ASN receiving to shipping, with mobile scanner support and ERP integration readiness.",
  "concept": "Monorepo (Turbo) with three apps: Next.js web (port 3000), Express API (port 4000), Expo mobile (WiFi). BFF pattern: only API talks to Supabase PostgreSQL. Custom JWT auth (24h, auto-refresh). Drizzle ORM schema. Phase 1 MVP underway (user mgmt + warehouse setup + receiving partial).",
  "scope": {
   "in": [
    "Receiving (ASN upload, barcode scan, damage capture)",
    "Putaway (directed/manual, zone config)",
    "Inventory management (real-time lookup, transfers, holds)",
    "Picking & wave management",
    "Packing & shipping (BOL, carrier assignment)",
    "Mobile RF scanner workflows",
    "3D warehouse visualization",
    "Reports & dashboards"
   ],
   "out": [
    "Multi-warehouse support",
    "EDI live SFTP/AS2",
    "Customer portal",
    "Returns RMA full workflows"
   ]
  },
  "roles": [
   [
    "Controller",
    "System admin, user creation, warehouse config, reporting"
   ],
   [
    "Admin",
    "Zone/location setup, inventory adjustments, wave creation"
   ],
   [
    "Manager",
    "Pick/pack wave oversight, exception handling"
   ],
   [
    "Picker",
    "Barcode scan, putaway, picking, packing"
   ],
   [
    "Client",
    "Portal: inventory query, order placement, tracking"
   ]
  ],
  "workflow": [
   [
    "1. ASN Upload",
    "Receive manifest (Excel): PO, SKU, qty, lot, expiry → create ASN in receiving module",
    "Admin"
   ],
   [
    "2. Receive Goods",
    "Barcode scan pallet/carton → match to ASN line → confirm qty → capture damage if any",
    "Picker"
   ],
   [
    "3. Putaway",
    "System suggests bin (directed putaway) or picker manually chooses → confirm scan → location updated",
    "Picker"
   ],
   [
    "4. Inventory Check",
    "Real-time query: SKU available qty by location, hold status, lot expiry",
    "Manager"
   ],
   [
    "5. Create Wave",
    "Admin batches outbound orders into wave → picks optimized paths → push to mobile",
    "Admin"
   ],
   [
    "6. Pick & Pack",
    "Picker scans SKU, confirms qty, packs into carton → packing slip prints, barcode applied",
    "Picker"
   ],
   [
    "7. Ship",
    "BOL generated, carrier assigned, shipping label printed, dispatch triggered",
    "Admin"
   ]
  ],
  "modules": [
   [
    "User Management",
    ""
   ],
   [
    "Warehouse Setup",
    "paginated location table"
   ],
   [
    "Inventory",
    ""
   ],
   [
    "Receiving",
    "NOT STARTED: ASN create/manage, barcode scanning, partial receipts"
   ],
   [
    "Picking & Waves",
    "NOT STARTED: wave creation, pick lists, path optimization"
   ],
   [
    "Packing",
    "NOT STARTED: packing station, packing slips (PDF), multi-carton"
   ],
   [
    "Shipping",
    "NOT STARTED: BOL generation, carrier assignment, tracking"
   ],
   [
    "Returns",
    "NOT STARTED: RMA, inspection, disposition (restock/repair/scrap/quarantine)"
   ]
  ],
  "dashboards": [
   [
    "WMS Dashboard",
    "KPIs: receiving throughput, inventory level by zone, wave status, picker productivity"
   ],
   [
    "Warehouse Map",
    "3D React Three Fiber visualization: aisles/levels, heatmap by utilization, location picker"
   ],
   [
    "Inventory Snapshot",
    "SKU query, lot tracking, expiry alerts, hold status"
   ]
  ],
  "records": [
   [
    "profiles",
    "uuid, emp_id (unique), full_name, email, role (controller/admin/manager/picker/client), created_at"
   ],
   [
    "warehouse_locations",
    "location (text PK, e.g. 'A-01-A'), type (rack/open_floor), aisle, level, bay, tier"
   ],
   [
    "inventory",
    "uuid, location FK, sku_code, qty, lot_no, expiry_date, hold_status (available/qc/damage/reserve), created_at"
   ],
   [
    "asn",
    "id, po_no, sku_code, qty_expected, qty_received, line_status"
   ],
   [
    "picking_waves",
    "id, wave_no, status (open/picking/packed/shipped), created_at"
   ]
  ],
  "integrations": [
   [
    "Supabase PostgreSQL",
    "Single database per tenant (configured via env DATABASE_URL)"
   ],
   [
    "JWT Auth",
    "Express signs JWTs with sub, role, empId; Next.js middleware validates locally (jose)"
   ],
   [
    "XLSX Import",
    "SheetJS (client-side) for Excel upload + export (500-row batch processing)"
   ],
   [
    "Cloudflare Turnstile",
    "CAPTCHA on web login (mobile skips due to native widget limitation)"
   ],
   [
    "EDI (Phase 3 planned)",
    "X12 870, 940, 945, 846, 856, 943, 944, 997 via SFTP/AS2"
   ]
  ],
  "security": [
   "JWT tokens in httpOnly cookie (web), AsyncStorage (mobile)",
   "Auto-refresh: API issues new token via X-Refreshed-Token header when < 1 hour remains",
   "Zod validation on all API inputs",
   "Role-based authorization after authentication (controller > admin > manager > picker hierarchy)",
   "Environment variables Zod-validated at startup (no runtime errors on missing secrets)"
  ],
  "engineering": [
   "Monorepo with Turbo: separate builds for web/mobile/api",
   "BFF pattern: API is single source of truth for Supabase",
   "3D warehouse viz via React Three Fiber (aisles, levels, heatmap)",
   "Async route handlers wrapped with asyncHandler() middleware",
   "Type sharing via @wms/types workspace package",
   "Drizzle ORM with PostgreSQL (drizzle-kit for migrations)"
  ],
  "outcomes": [
   "Single codebase for web + mobile + API reduces maintenance overhead",
   "3D warehouse visualization improves location picker UX vs. flat list",
   "JWT auto-refresh improves mobile battery life (no constant re-auth)",
   "API-first architecture enables future ERP/OMS integrations",
   "Phase 0 foundation complete (MVP shipping in 8-10 weeks)"
  ]
 }
});
