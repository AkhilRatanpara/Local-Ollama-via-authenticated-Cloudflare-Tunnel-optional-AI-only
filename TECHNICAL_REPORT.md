# Technical Report: Sangam Platform Architecture & Engineering Overview

**Project Name:** Sangam (Smart AI-Powered Government Scheme & Benefit Discovery Platform)  
**Repository Location:** `d:\project backup\sangam`  
**Stack Summary:** Next.js 16 (App Router), React 19, TypeScript, PostgreSQL, Drizzle ORM, Ollama (Mistral LLM), Tailwind CSS v4, Framer Motion, Puppeteer, Cheerio, Node-Cron.

---

## 1. Executive Summary & Core Objective

**Sangam** is a modern full-stack web application designed to bridge the information gap between Indian citizens and government welfare schemes, loans, and subsidies. The system indexes active government programs, matches them against user demographic profiles using rule-based pre-filtering combined with local LLM-driven semantic ranking, and provides a database-grounded AI conversational assistant named **Sarthi**.

Key technical pillars of the platform include:
- **Zero-Hallucination AI Architecture**: AI answers are strictly grounded in live PostgreSQL database records using RAG (Retrieval-Augmented Generation) style prompt injection.
- **Two-Stage Scheme Matching**: Deterministic SQL/TypeScript demographic filtering followed by LLM-calculated match scores (0–100) and customized fit explanations.
- **Automated Data Scraping Engine**: Cron-based background workers continuously fetch updates from `india.gov.in`, Press Information Bureau (PIB) RSS feeds, and NewsData.io APIs.
- **Dynamic Site Control**: Real-time feature toggling managed via an admin panel backed by a PostgreSQL key-value configuration table.

---

## 2. Core Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16 (App Router)](file:///d:/project%20backup/sangam/package.json#L25), [React 19](file:///d:/project%20backup/sangam/package.json#L29), [TypeScript](file:///d:/project%20backup/sangam/package.json#L49) | Server & Client Components, API routes, type-safe frontend UI. |
| **Styling & Animation** | [Tailwind CSS v4](file:///d:/project%20backup/sangam/package.json#L47), [Framer Motion](file:///d:/project%20backup/sangam/package.json#L22), Lucide Icons | Responsive modern dark/light UI, fluid animations, glassmorphism. |
| **Database & ORM** | [PostgreSQL](file:///d:/project%20backup/sangam/package.json#L27), [Drizzle ORM](file:///d:/project%20backup/sangam/package.json#L21), Drizzle Kit | Schema-first type-safe ORM, relations, fast relational queries. |
| **AI / LLM Engine** | [Ollama](file:///d:/project%20backup/sangam/lib/ai-service.ts#L2) (`mistral` model) | Local LLM inference server running on port `11434` for intent parsing, scheme ranking, and streaming chat. |
| **Authentication** | [Jose (JWT)](file:///d:/project%20backup/sangam/lib/auth.ts#L1), HttpOnly Cookies | Stateless encrypted session tokens (`HS256`), 24h rolling expiration. |
| **Data Ingestion** | [Puppeteer](file:///d:/project%20backup/sangam/package.json#L46), [Cheerio](file:///d:/project%20backup/sangam/package.json#L41), [Node-Cron](file:///d:/project%20backup/sangam/package.json#L45) | Headless browser web scraping, XML parsing, automated cron jobs. |
| **Mail Service** | [Nodemailer](file:///d:/project%20backup/sangam/package.json#L26) | Email notifications and verification messages. |

---

## 3. High-Level Architecture Diagram

```
                             +-----------------------------------+
                             |     User Browser / Client UI      |
                             | (Next.js React 19 Client Side)    |
                             +-----------------+-----------------+
                                               |
                                     HTTP Requests / API
                                               v
                             +-----------------------------------+
                             | Next.js 16 Middleware & API Routes|
                             |  - Authentication (Jose JWT)      |
                             |  - Feature Toggle Checks          |
                             +--------+-----------------+--------+
                                      |                 |
                +---------------------+                 +---------------------+
                |                                                             |
                v                                                             v
+-------------------------------+                             +-------------------------------+
|       PostgreSQL DB           |                             |   Local Ollama AI Server      |
|     (Managed via Drizzle)     |                             |       (Mistral Model)         |
|  - Users                      |                             |  - Intent Parsing             |
|  - Schemes                    |                             |  - Profile Scheme Ranking     |
|  - News                       |<============================|  - RAG Streaming Chatbot      |
|  - Site Settings              |      Context Grounding      +-------------------------------+
+---------------+---------------+
                ^
                | Background Updates
+---------------+---------------+
| Automated Production Scraper  |
| - Puppeteer (india.gov.in)    |
| - Cheerio (PIB RSS Feeds)     |
| - NewsData.io REST API        |
+-------------------------------+
```

---

## 4. Database Architecture & Schema Specifications

The database layer is managed using **Drizzle ORM** over PostgreSQL. The database consists of 4 main schema entities located in [`db/schemas/`](file:///d:/project%20backup/sangam/db/schemas):

### 4.1 `users` Table ([`db/schemas/user.ts`](file:///d:/project%20backup/sangam/db/schemas/user.ts))
Stores account credentials, complete demographic profiles, family background, document references, and bookmark history.
- `id` (UUID, PK)
- `email` (Text, Unique, Not Null)
- `password` (Text, Bcrypt Hash)
- `role` (Text, Default: `"user"`) — `"user"` or `"admin"`
- **Demographics:** `mobile`, `dob`, `gender`, `category` (General/OBC/SC/ST), `occupation`, `income`, `state`, `district`, `village`, `caste`, `address`
- **Family Details:** `fatherName`, `fatherProfession`, `motherName`, `motherProfession`
- **IDs & Documents:** `aadhar`, `pan`, `documents` (JSONB)
- **Activity:** `appliedSchemes` (JSONB), `savedSchemes` (JSONB)

### 4.2 `schemes` Table ([`db/schemas/scheme.ts`](file:///d:/project%20backup/sangam/db/schemas/scheme.ts))
Contains structured parameters for each government scheme to enable precise SQL filtering and AI scoring.
- `id` (UUID, PK)
- `title`, `ministry`, `description`, `category`, `type` (Subsidy, Loan, Scholarship, Pension)
- `state` (Central or specific State name)
- `benefits` (Text Array), `eligibility` (Text Array), `documentsRequired` (Text Array), `amount` (Real), `shortBenefits` (Text)
- **Loan Parameters:** `interestRate`, `tenureMax` (months), `collateralRequired` (Bool), `moratoriumMonths`, `interestSubvention`, `lendingPartners` (Text Array)
- **Subsidy Parameters:** `subsidyPercentage`, `subsidyMaxAmount`, `dbtStatus` (Bool), `vendorEmpanelled` (Bool)
- **Filtering Criteria Bounds:**
  - `gender` (All, Male, Female, Transgender)
  - `ageMin` (Int), `ageMax` (Int)
  - `incomeLimit` (Real)
  - `caste` (Text Array, e.g. `["SC", "ST", "OBC"]`)
  - `residence` (Urban, Rural, Both)
- `status` (`"active"`, `"closed"`, `"upcoming"`)
- `applicationUrl`, `tags` (Text Array), `applicationsCount` (Int)

### 4.3 `news` Table ([`db/schemas/news.ts`](file:///d:/project%20backup/sangam/db/schemas/news.ts))
Stores news releases ingested automatically from official press bureaus and news APIs.
- `id` (UUID, PK)
- `title`, `description`, `category` (PIB, Education, Politics, Science, Technology, Breaking)
- `icon`, `schemeId` (Nullable UUID link), `url`, `imageUrl`

### 4.4 `site_settings` Table ([`db/schemas/settings.ts`](file:///d:/project%20backup/sangam/db/schemas/settings.ts))
Key-value store for live admin feature switches.
- `key` (Text, Unique): e.g., `nav_schemes_enabled`, `nav_loans_enabled`, `nav_subsidies_enabled`, `nav_news_enabled`, `chatbot_enabled`.
- `value` (JSONB): Boolean toggle states (`true`/`false`).

---

## 5. AI Engine & Algorithm Workflows

The AI functionality is implemented in [`lib/ai-service.ts`](file:///d:/project%20backup/sangam/lib/ai-service.ts), [`app/api/ai/rank/route.ts`](file:///d:/project%20backup/sangam/app/api/ai/rank/route.ts), and [`app/api/chat/route.ts`](file:///d:/project%20backup/sangam/app/api/chat/route.ts).

### 5.1 Scheme Ranking Pipeline
When a user visits their profile dashboard or scheme recommendations page:

```
[User Profile Data]
       |
       v
+-------------------------------------------------------------------+
| Step 1: Pre-Filtering (TypeScript / In-Memory SQL Bounds Check)  |
| - Age Check: User Age between ageMin & ageMax                    |
| - Income Check: User Income <= incomeLimit                       |
| - Gender Check: Scheme Gender is "All" or matches user           |
| - Caste Check: Scheme Caste array includes user category         |
+-------------------------------------------------------------------+
       |
       v Top 12 Candidate Schemes
+-------------------------------------------------------------------+
| Step 2: Semantic AI Scoring (AIService.rankSchemes via Ollama)  |
| - Prompt sends user profile + simplified candidate scheme payload |
| - Mistral LLM evaluates qualification match & generates 0-100    |
|   confidence score & short reason per scheme                      |
+-------------------------------------------------------------------+
       |
       v
[Sorted Output: High Score to Low Score displayed on UI]
```

### 5.2 Conversational AI (Sarthi Chatbot) Workflow
In [`app/api/chat/route.ts`](file:///d:/project%20backup/sangam/app/api/chat/route.ts):

1. **Database Grounding Dump:** On every incoming message, active schemes are fetched from PostgreSQL and serialized into a structured `DATABASE OVERVIEW` text summary.
2. **Intent Keyword Matcher:** The system processes user query keywords, expands synonyms (e.g. `scholarship` $\rightarrow$ `education`, `kisan` $\rightarrow$ `agriculture`), and performs weighted matching across scheme titles (+10), categories (+5), tags (+5), and benefits (+2).
3. **Prompt Construction:** The top matching schemes are formatted with exact eligibility flags for the current user.
4. **Streaming Response:** The system prompt instructs the `mistral` model to act strictly within the provided database context (Zero Hallucination Policy). Responses are streamed directly back to the client using standard HTTP chunked text encoding.

---

## 6. Authentication & Middleware Security

Authentication is managed in [`lib/auth.ts`](file:///d:/project%20backup/sangam/lib/auth.ts) and enforced at the edge via [`middleware.ts`](file:///d:/project%20backup/sangam/middleware.ts):

- **JWT Encryption:** Uses the `jose` library with `HS256` symmetric signing key.
- **Session Lifespan:** 24-hour expiration.
- **Rolling Refresh:** `updateSession()` automatically updates cookie expiration on every valid request.
- **Route Protections:**
  - `/profile`, `/settings` require valid logged-in user session.
  - `/admin/*` requires session with `role === "admin"`.
  - Unauthenticated users attempting protected routes are redirected to `/login` or `/admin/login`.

---

## 7. Data Ingestion & Automation Engine

Located in [`scripts/production-automation.ts`](file:///d:/project%20backup/sangam/scripts/production-automation.ts):

1. **Puppeteer Web Crawler:** Launches headless Chrome browser to inspect `india.gov.in` search portal for new "Yojana" or "Scheme" links, extracting metadata and application links.
2. **PIB RSS Parser (`lib/pib-service.ts`):** Uses Cheerio XML mode to parse Press Information Bureau RSS channels (Releases, Photos, Media Advisories) and store non-duplicate records.
3. **NewsData.io Ingestion (`lib/newsdata-service.ts`):** Syncs national Indian news (Education, Politics, Science, Technology, Breaking) via REST API with automatic category mapping and emoji icons.
4. **Cron Schedule:** Managed using `node-cron` running daily at `00:00` (midnight).

---

## 8. Summary of API Endpoints

- `POST /api/auth/login` — User authentication & session set
- `POST /api/auth/register` — New citizen registration
- `GET /api/schemes` — Paginated scheme listing with category/type/search filtering
- `POST /api/ai/rank` — Profile-based smart AI scheme scoring
- `POST /api/chat` — RAG-based AI assistant streaming responses
- `GET /api/admin/settings` & `PATCH /api/admin/settings` — Feature flag control endpoints
