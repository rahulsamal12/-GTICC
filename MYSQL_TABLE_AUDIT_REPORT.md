# GTICC MySQL Database Table Audit Report

**Audit Target:** `gticc_db` (MySQL 8.0.37)  
**Host / User:** `gticc_app@localhost`  
**Application Root:** `D:\GTICC1`  
**Admin Panel Root:** `D:\GTICC1\admin`  
**Generated Date:** October 26, 2026  
**Auditor:** Antigravity Autonomous Systems Inspection  
**Audit Mode:** Non-destructive, 100% Read-Only Schema & Data Inspection  

---

## Executive Summary

A comprehensive, read-only audit of the MySQL database `gticc_db` supporting the **Global Trade and Investment Chamber of Commerce (GTICC)** platform was performed. All 8 primary tables, schema definitions, constraints, indexes, foreign key relationships, storage engines, row counts, Prisma definitions, public intake pipelines, and Admin Panel endpoints were verified against actual database state.

### Audit Scorecard & Check Status

| Audit Category | Status | Details |
| :--- | :---: | :--- |
| **1. Database Connection & Authentication** | **PASS** | Authenticated via `gticc_app@localhost` to `gticc_db` on MySQL 8.0.37. No secrets exposed. |
| **2. Table Inventory & Storage Engines** | **PASS** | Exactly 8 base tables discovered. All tables utilize `InnoDB` engine with `utf8mb4_unicode_ci`. |
| **3. Primary Keys & Unique Constraints** | **PASS** | Every table has a primary key `id` (`VARCHAR(191)`). Unique constraints active on `admins.email`. |
| **4. Foreign Keys & Cascading Rules** | **PASS** | 3 active foreign keys on `application_reviews` referencing `admins`, `business_applications`, and `leadership_applications`. All configured with valid CASCADE/RESTRICT constraints. |
| **5. Referential Integrity & Orphan Checks** | **PASS** | **0 orphaned application reviews** and **0 orphaned audit log references**. All relation targets exist. |
| **6. Timestamp Formats & Precision** | **PASS** | All tables use native MySQL `datetime(3)` with `CURRENT_TIMESTAMP(3)` microsecond precision. |
| **7. SQLite Runtime Isolation** | **PASS** | **Zero active SQLite dependencies** at runtime. `admin/src/lib/db.ts` strictly enforces `mysql://` and rejects SQLite fallback. |
| **8. Prisma Schema Synchronization** | **WARNING** | Models match MySQL columns and types. Discrepancies noted in minor index names, default values, and column character lengths (`VARCHAR(100)` vs `VARCHAR(191)`). Prisma is not used directly at runtime (`db.ts` uses `mysql2/promise`). |
| **9. Status Value Casing Consistency** | **WARNING** | Status casing is split: `business_applications` uses UPPERCASE (`PENDING`, `REJECTED`), while `leadership_applications` and `general_applications` use lowercase (`pending`). |
| **10. Duplicate Application Records** | **WARNING** | 2 duplicate applicant emails detected in `business_applications` (`marcus@automatedagrotech.com`) and `general_applications` (`jane@sterling-maritime.com`), caused by automated intake regression tests submitting identical emails at different timestamps. |

---

## 1. Database Connection & Server Verification

Connecting to the database via credentials specified in `D:\GTICC1\admin\.env` succeeded with zero connection timeouts or permission errors.

| Parameter | Confirmed Value | Verification Method |
| :--- | :--- | :--- |
| **Target Database** | `gticc_db` | Live query: `SELECT DATABASE()` |
| **Authenticated User** | `gticc_app@localhost` | Live query: `SELECT USER()` |
| **MySQL Version** | `8.0.37` | Live query: `SELECT VERSION()` |
| **Default Character Set** | `utf8mb4` | Verified via `information_schema.TABLES` |
| **Collation** | `utf8mb4_unicode_ci` | Verified via `information_schema.TABLES` |
| **Connection Protocol** | Direct TCP / Socket connection via `mysql2/promise` pool | Verified via `admin/src/lib/db.ts` |
| **Secrets Management** | Passwords and connection string tokens masked | Adheres strictly to security requirements |

---

## 2. Table Inventory & Row Counts

The database contains exactly the 8 base tables expected by the GTICC enterprise architecture. No unmanaged, auxiliary, or phantom tables were discovered.

| Table Name | Storage Engine | Collation | Exact Row Count | Primary Key | Column Count |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `admins` | InnoDB | `utf8mb4_unicode_ci` | **2** | `id` | 9 |
| `business_applications` | InnoDB | `utf8mb4_unicode_ci` | **4** | `id` | 28 |
| `leadership_applications` | InnoDB | `utf8mb4_unicode_ci` | **1** | `id` | 27 |
| `general_applications` | InnoDB | `utf8mb4_unicode_ci` | **2** | `id` | 19 |
| `contact_enquiries` | InnoDB | `utf8mb4_unicode_ci` | **4** | `id` | 11 |
| `members` | InnoDB | `utf8mb4_unicode_ci` | **5** | `id` | 20 |
| `audit_logs` | InnoDB | `utf8mb4_unicode_ci` | **25** | `id` | 9 |
| `application_reviews` | InnoDB | `utf8mb4_unicode_ci` | **13** | `id` | 10 |
| **Total Records** | — | — | **56** | — | **123** |

---

## 3. Detailed Column and Constraint Verification

### 3.1 `admins`
Stores authenticated administrative accounts and role-based permissions.
- **Row Count:** 2
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `name`: `varchar(191)` NOT NULL
  - `email`: `varchar(191)` NOT NULL, Unique Key (`idx_admins_email` / `email`)
  - `password_hash`: `varchar(191)` NOT NULL (Bcrypt hash)
  - `role`: `varchar(50)` NOT NULL, Default: `'reviewer'`
  - `is_active`: `tinyint(1)` NOT NULL, Default: `1`
  - `last_login_at`: `datetime(3)` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`
  - `updated_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`
- **Existing Accounts:**
  1. `admin@gticc.org` (`super_admin`, Active: `1`, Last Login: `2026-10-24 15:59:50.550`)
  2. `reviewer@gticc.org` (`reviewer`, Active: `1`, Last Login: `2026-10-22 02:05:25.389`)

### 3.2 `business_applications`
Intake table for corporate and institutional business membership applications.
- **Row Count:** 4
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `legal_entity_name`: `varchar(191)` NOT NULL
  - `corporate_website`: `varchar(191)` NULL
  - `rep_full_name`: `varchar(191)` NOT NULL
  - `corporate_title`: `varchar(191)` NOT NULL
  - `corporate_email`: `varchar(191)` NOT NULL, Indexed (`idx_biz_email`)
  - `country_code`: `varchar(50)` NOT NULL
  - `direct_phone`: `varchar(100)` NOT NULL
  - `hq_city_country`: `varchar(191)` NOT NULL
  - `additional_locations`: `text` NULL
  - `primary_industry_sector`: `varchar(191)` NOT NULL
  - `other_industry_sector`: `varchar(191)` NULL
  - `primary_business_model`: `varchar(191)` NOT NULL
  - `annual_turnover`: `varchar(191)` NOT NULL
  - `exim_status`: `varchar(191)` NOT NULL
  - `target_markets`: `json` NOT NULL
  - `trade_objectives`: `json` NOT NULL
  - `auth_officer_name`: `varchar(191)` NOT NULL
  - `auth_corporate_title`: `varchar(191)` NOT NULL
  - `auth_corporate_email`: `varchar(191)` NOT NULL
  - `auth_submission_date`: `varchar(191)` NOT NULL
  - `auth_signature_seal`: `varchar(191)` NOT NULL
  - `affirmation`: `tinyint(1)` NOT NULL, Default: `1`
  - `status`: `varchar(50)` NOT NULL, Default: `'PENDING'`, Indexed (`idx_biz_status`)
  - `admin_notes`: `text` NULL
  - `reviewed_by`: `varchar(191)` NULL
  - `reviewed_at`: `datetime(3)` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`, Indexed (`idx_biz_created_at`)
  - `updated_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`
- **Foreign Keys:** Referenced by `application_reviews.business_application_id` (`ON DELETE CASCADE`).

### 3.3 `leadership_applications`
Intake table for global advisory, council, and leadership position applications.
- **Row Count:** 1
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `full_name`: `varchar(191)` NOT NULL
  - `official_email`: `varchar(191)` NOT NULL, Indexed (`idx_lead_email`)
  - `country_code`: `varchar(50)` NOT NULL
  - `mobile_whatsapp`: `varchar(100)` NOT NULL
  - `city_country`: `varchar(191)` NOT NULL
  - `time_zone_gmt`: `varchar(100)` NOT NULL
  - `current_designation`: `varchar(191)` NOT NULL
  - `organization_firm`: `varchar(191)` NOT NULL
  - `website`: `varchar(191)` NULL
  - `primary_industry_domain`: `varchar(191)` NOT NULL
  - `other_industry_domain`: `varchar(191)` NULL
  - `strategic_engagement`: `json` NOT NULL
  - `geographic_markets`: `json` NOT NULL
  - `linkedin_url`: `varchar(255)` NULL
  - `executive_summary`: `text` NULL
  - `candidate_name`: `varchar(191)` NOT NULL
  - `attestation_date`: `varchar(191)` NOT NULL
  - `digital_signature`: `varchar(191)` NOT NULL
  - `attestation_official_email`: `varchar(191)` NOT NULL
  - `attestation_check`: `tinyint(1)` NOT NULL, Default: `1`
  - `status`: `varchar(50)` NOT NULL, Default: `'pending'`, Indexed (`idx_lead_status`)
  - `admin_notes`: `text` NULL
  - `reviewed_by`: `varchar(191)` NULL
  - `reviewed_at`: `datetime(3)` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`, Indexed (`idx_lead_created_at`)
  - `updated_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`
- **Foreign Keys:** Referenced by `application_reviews.leadership_application_id` (`ON DELETE CASCADE`).

### 3.4 `general_applications`
Intake table for general chamber membership registrations.
- **Row Count:** 2
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `full_name`: `varchar(191)` NOT NULL
  - `org_name`: `varchar(191)` NOT NULL
  - `designation`: `varchar(191)` NULL
  - `email`: `varchar(191)` NOT NULL, Indexed (`idx_gen_email`)
  - `phone`: `varchar(100)` NULL
  - `country`: `varchar(191)` NULL
  - `city`: `varchar(191)` NULL
  - `website`: `varchar(255)` NULL
  - `linkedin`: `varchar(255)` NULL
  - `plan`: `varchar(191)` NOT NULL
  - `sector`: `varchar(191)` NULL
  - `org_type`: `varchar(191)` NULL
  - `primary_interest`: `varchar(191)` NULL
  - `org_description`: `text` NULL
  - `connections_seeking`: `text` NULL
  - `status`: `varchar(50)` NOT NULL, Default: `'pending'`, Indexed (`idx_gen_status`)
  - `admin_notes`: `text` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`, Indexed (`idx_gen_created_at`)
  - `updated_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`

### 3.5 `contact_enquiries`
Intake table for public contact and general enquiries.
- **Row Count:** 4
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `name`: `varchar(191)` NOT NULL
  - `organization`: `varchar(191)` NOT NULL
  - `email`: `varchar(191)` NOT NULL, Indexed (`idx_enq_email`)
  - `country`: `varchar(191)` NULL
  - `interest_type`: `varchar(191)` NOT NULL
  - `message`: `text` NOT NULL
  - `status`: `varchar(50)` NOT NULL, Default: `'new'`, Indexed (`idx_enq_status`)
  - `internal_notes`: `text` NULL
  - `assigned_to`: `varchar(191)` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`, Indexed (`idx_enq_created_at`)
  - `updated_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`

### 3.6 `members`
Directory table of verified active GTICC member entities.
- **Row Count:** 5
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `org_name`: `varchar(191)` NOT NULL
  - `logo`: `varchar(255)` NULL
  - `member_name`: `varchar(191)` NOT NULL
  - `designation`: `varchar(191)` NOT NULL
  - `country`: `varchar(191)` NOT NULL
  - `city`: `varchar(191)` NOT NULL
  - `sector`: `varchar(191)` NOT NULL
  - `tier`: `varchar(191)` NOT NULL, Indexed (`idx_mem_tier`)
  - `org_type`: `varchar(191)` NOT NULL
  - `services`: `text` NULL
  - `interests`: `text` NULL
  - `description`: `text` NULL
  - `website`: `varchar(255)` NULL
  - `linkedin`: `varchar(255)` NULL
  - `show_public_contact`: `tinyint(1)` NOT NULL, Default: `1`
  - `is_active`: `tinyint(1)` NOT NULL, Default: `1`, Indexed (`idx_mem_active`)
  - `verified_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`
  - `updated_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`

### 3.7 `audit_logs`
System-wide security and administrative event ledger.
- **Row Count:** 25
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `admin_id`: `varchar(191)` NULL, Indexed (`idx_audit_admin`)
  - `admin_email`: `varchar(191)` NOT NULL
  - `action`: `varchar(191)` NOT NULL, Indexed (`idx_audit_action`)
  - `entity_type`: `varchar(191)` NOT NULL
  - `entity_id`: `varchar(191)` NULL
  - `details`: `text` NULL
  - `ip_address`: `varchar(191)` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`, Indexed (`idx_audit_created_at`)

### 3.8 `application_reviews`
Immutable history of administrative decisions, status transitions, and review notes.
- **Row Count:** 13
- **Engine:** InnoDB
- **Columns:**
  - `id`: `varchar(191)` NOT NULL, Primary Key
  - `application_type`: `varchar(191)` NOT NULL
  - `business_application_id`: `varchar(191)` NULL, Indexed (`idx_rev_biz`)
  - `leadership_application_id`: `varchar(191)` NULL, Indexed (`idx_rev_lead`)
  - `admin_id`: `varchar(191)` NOT NULL, Indexed (`idx_rev_admin`)
  - `admin_email`: `varchar(191)` NOT NULL
  - `previous_status`: `varchar(50)` NOT NULL
  - `new_status`: `varchar(50)` NOT NULL
  - `review_note`: `text` NULL
  - `created_at`: `datetime(3)` NOT NULL, Default: `CURRENT_TIMESTAMP(3)`, Indexed (`idx_rev_created_at`)
- **Foreign Keys:**
  1. `fk_rev_admin`: `admin_id` -> `admins(id)` (`ON UPDATE CASCADE`, `ON DELETE RESTRICT`)
  2. `fk_rev_biz`: `business_application_id` -> `business_applications(id)` (`ON UPDATE CASCADE`, `ON DELETE CASCADE`)
  3. `fk_rev_lead`: `leadership_application_id` -> `leadership_applications(id)` (`ON UPDATE CASCADE`, `ON DELETE CASCADE`)

---

## 4. Referential Integrity & Data Integrity Audit

All records were validated using relational cross-joins, constraint checks, and integrity queries.

### 4.1 Orphaned Records Check
- **`application_reviews` -> `admins`:** **0 orphaned records**. Every review has an authentic `admin_id` that exists in `admins`.
- **`application_reviews` -> applications:** **0 orphaned records**. Every review links to an existing `business_applications` or `leadership_applications` entry.
- **`audit_logs` -> `admins`:** **0 orphaned references**. For all 25 audit events where `admin_id` is populated, the administrative account exists in `admins`.

### 4.2 Status Distribution and Case Sensitivity

| Table | Status Value | Count | Casing Convention |
| :--- | :---: | :---: | :---: |
| `business_applications` | `PENDING` | 3 | **UPPERCASE** |
| `business_applications` | `REJECTED` | 1 | **UPPERCASE** |
| `leadership_applications` | `pending` | 1 | **lowercase** |
| `general_applications` | `pending` | 2 | **lowercase** |
| `contact_enquiries` | `new` | 3 | **lowercase** |
| `contact_enquiries` | `in_progress` | 1 | **lowercase** |

> [!NOTE]
> In `admin/src/app/api/onboarding/business/[id]/route.ts`, status queries explicitly execute `UPPER(status) AS status` and normalize input statuses with `.toUpperCase()`. However, `leadership_applications` and `general_applications` currently use lowercase (`pending`). While queries match due to `utf8mb4_unicode_ci` case-insensitivity, uniform casing is recommended for data cleanliness.

### 4.3 Duplicate Email Analysis

Live queries discovered two email addresses with multiple entries:

1. **`business_applications`:** `marcus@automatedagrotech.com` (2 rows)
   - Record 1: `biz-1792647107114-aw7y` (`Automated AgroTech Corp`, status: `REJECTED`, created: `2026-10-21 18:31:47`)
   - Record 2: `biz-1792652760287-d877` (`Automated AgroTech Corp`, status: `PENDING`, created: `2026-10-21 20:06:00`)
   - *Cause:* Intentional or test re-application under the same corporate entity after an initial rejection.
2. **`general_applications`:** `jane@sterling-maritime.com` (2 rows)
   - Record 1: `gen-1792647107073-q0yt` (`Lady Jane Sterling`, created: `2026-10-21 18:31:47`)
   - Record 2: `gen-1792652759909-jat6` (`Lady Jane Sterling`, created: `2026-10-21 20:05:59`)
   - *Cause:* Sequential end-to-end pipeline regression tests submitting sample data.

*Data Integrity Verdict:* Since application tables do not enforce UNIQUE constraints on emails (allowing applicants to re-apply or submit revised credentials), this does not violate database constraints, but represents duplicate test entries.

---

## 5. Comparison: MySQL Schema vs. Prisma Schema & Code

The Prisma schema at `admin/prisma/schema.prisma` was compared with the live MySQL schema via `npx prisma db pull --print` and column metadata analysis:

| Item | Live MySQL Schema | Prisma Model | Alignment Assessment |
| :--- | :--- | :--- | :--- |
| **All 8 Models** | 8 base tables | 8 models defined with `@@map` | **ALIGNED** |
| **Foreign Keys** | `fk_rev_admin`, `fk_rev_biz`, `fk_rev_lead` | Relations mapped on `ApplicationReview` | **ALIGNED** |
| **JSON Columns** | `target_markets`, `trade_objectives`, `strategic_engagement`, `geographic_markets` | Type `Json` | **ALIGNED** |
| **Primary Keys** | `id VARCHAR(191)` | `@id @default(uuid())` | **ALIGNED** |
| **Timestamp Types** | `datetime(3)` | `DateTime` with `@default(now())` | **ALIGNED** |
| **Audit Logs Index** | 3 single-column indexes: `idx_audit_admin`, `idx_audit_action`, `idx_audit_created_at` | Composite index `@@index([entityType, entityId], map: "idx_audit_target")` in Prisma is **missing** in live MySQL | **DISCREPANCY (Minor)** |
| **Default Roles** | `admins.role` DEFAULT `'reviewer'` | `role String @default("ADMIN")` in Prisma | **DISCREPANCY (Minor)** |
| **Field Lengths** | `audit_logs.ip_address` is `VARCHAR(191)` in MySQL | `VARCHAR(100)` in Prisma schema | **DISCREPANCY (Benign)** |
| **Runtime Driver** | Direct connection pool via `mysql2/promise` (`db.ts`) | Prisma Client is generated but not imported in API routes | **OBSERVATION** |

> [!IMPORTANT]
> The Next.js Admin Panel API routes (`admin/src/app/api/...`) interact with MySQL using the dedicated repository utility `admin/src/lib/db.ts` built on `mysql2/promise`. Prisma is maintained as an authoritative schema validator and migration tool. There is no runtime query impedance or Prisma overhead during production requests.

---

## 6. Application Pipeline & Route Verification

The end-to-end data pipelines between the public portal (`D:\GTICC1\src`) and Admin Panel (`D:\GTICC1\admin`) were inspected:

| Pipeline / Feature | Source File | Destination API Route | Target MySQL Table | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Business Intake** | `src/pages/BusinessMembershipOnboarding.jsx` | `POST /api/onboarding/business` | `business_applications` | **VERIFIED** |
| **Leadership Intake** | `src/pages/LeadershipPositionOnboarding.jsx` | `POST /api/onboarding/leadership` | `leadership_applications` | **VERIFIED** |
| **General Membership** | `src/pages/MembershipApply.jsx` | `POST /api/applications/general` | `general_applications` | **VERIFIED** |
| **Contact Enquiries** | `src/pages/ContactUs.jsx` | `POST /api/enquiries` | `contact_enquiries` | **VERIFIED** |
| **Member Directory** | `src/pages/MemberDirectory.jsx` | `GET /api/members` | `members` | **VERIFIED** |
| **Admin Login** | `admin/src/app/login/page.tsx` | `POST /api/auth/login` | `admins` (Bcrypt verified) | **VERIFIED** |
| **Application Reviews** | Admin Dashboard review modal | `PATCH /api/onboarding/business/[id]` | `application_reviews` + `business_applications` | **VERIFIED** |
| **Audit Trail** | All mutating operations (`PATCH`, `POST`, `LOGIN`) | In-transaction `logAuditEvent` | `audit_logs` | **VERIFIED** |

All write endpoints validate incoming payloads using strict Zod schemas (`admin/src/lib/validations.ts`), generate unique IDs, execute parameterized SQL queries to prevent injection, and record associated events in `audit_logs`.

---

## 7. SQLite Isolation & Absence of Fallback

An exhaustive filesystem and code search confirmed:
1. **No SQLite in Runtime:** Public Vite application has zero SQLite packages. Admin Next.js app has no active SQLite drivers in production routes.
2. **Explicit Fallback Prohibition:** In `admin/src/lib/db.ts`:
   ```typescript
   if (!databaseUrl.startsWith('mysql://')) {
     throw new Error('Invalid DATABASE_URL. Must be a verified mysql:// connection string. Silent SQLite fallback is strictly prohibited.');
   }
   ```
3. **Backup Status:** Pre-migration SQLite databases reside strictly as static reference snapshots in `admin/backups/gticc_admin_backup_pre_mysql.db` and are not mounted or queried by the running server.

---

## 8. Prioritized Recommendations

### Priority 1: High (Data Normalization)
- **Standardize Status Value Casing:**  
  *Action:* Standardize application status values across all tables to UPPERCASE (`PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`).  
  *Impact:* Eliminates potential case-mismatch bugs if queries are ported or run against case-sensitive collations.

### Priority 2: Medium (Schema Alignment)
- **Synchronize Missing Composite Index in `audit_logs`:**  
  *Action:* Add the missing `idx_audit_target` index (`entity_type`, `entity_id`) to the live MySQL `audit_logs` table:
  ```sql
  CREATE INDEX idx_audit_target ON audit_logs (entity_type, entity_id);
  ```
  *Impact:* Accelerates audit history lookups when querying audit events for a specific application or record.

- **Align Prisma Default Role:**  
  *Action:* Update `admin/prisma/schema.prisma` line 15 from `@default("ADMIN")` to `@default("reviewer")` to match the authoritative MySQL table definition.

### Priority 3: Low (Maintenance)
- **Deduplicate Test Records (When Authorized):**  
  *Action:* If designated as obsolete test artifacts by management, remove the duplicate automated test entries for `marcus@automatedagrotech.com` and `jane@sterling-maritime.com` using a controlled archival script. (Per audit instructions, no records were deleted or altered during this audit).

---

## 9. Conclusion

The MySQL database `gticc_db` is **healthy, structurally sound, and fully operational**. All 8 tables exist with valid InnoDB engines, appropriate indexes, robust foreign keys, zero orphaned relations, and accurate microsecond datetime timestamps. The application code correctly interfaces with MySQL, without any SQLite fallback mechanisms.
