
# Tech Spec — Careers Page Builder

## Assumptions
- Every recruiter will have **one company** (no multiple-company management for now).
- A company can have **many jobs**.
- The **public careers page** should be open to everyone (no login needed).
- The **preview page** is **only** for the recruiter who owns that company.
- The public page only works when the recruiter has **published** the page.  
  If not published → redirect visitors back to dashboard.
- The dashboard is only for logged-in recruiters.
- If a recruiter logs in but doesn’t have a company yet, we show a **Create Company** modal immediately.
- Theme color chosen by the recruiter is used across the UI (buttons, headings, highlights).
- Only a logged-in recruiter can edit company details, sections, and job posts.
- There is **no job application process** here — just viewing jobs.

---

## Architecture

This app follows a **simple client–server setup**:

- **Next.js** (App Router) for both frontend UI and backend API routes.
- **Neon PostgreSQL** as the database.
- **Prisma** as ORM to talk to the database safely.
- **JWT auth** stored in **HttpOnly cookies** so the token is not exposed in frontend JS.

### How things talk to each other

React UI (Next.js components)  
↓ (axios / fetch)  
API Routes (Next.js server functions)  
↓ (Prisma)  
PostgreSQL (Neon DB)


- Frontend sends requests to the backend.
- Backend verifies JWT → if valid, it performs DB work via Prisma.
- Prisma handles schema and ensures typed DB queries.

### Authentication
- JWT is stored in **HttpOnly cookie**.
- On protected endpoints, the server:
  - Checks the token.
  - Finds the user.
  - Rejects the request if the token is missing/invalid.
- If authentication fails → redirect to **/login**.

---

## User Roles

| User | What they do | Needs Login? |
|------|--------------|--------------|
| Recruiter | Creates company page, edits content, manages jobs | Yes |
| Candidate | Just visits public page and views jobs | No |

---

## Database Schema 

### Recruiter
- Stores the login user.
- `email`, `password`, timestamps.
- Linked to **one** company.
- **Relationship:**
- One **Recruiter** → One **Company**

### Company
- Stores branding + page content (logo, banner, theme color).
- `sections` is JSON which allows flexible content structure + drag & drop.
- Linked to the recruiter who owns it.
- Can have multiple jobs.
- **Relationships:**
- One **Company** → One **Recruiter**
- One **Company** → Many **Jobs**

### Job
- Represents a single job listing.
- Contains title, description, work policy, type, etc.
- Connected to a company.
- **Relationship:**
- Many **Job** → One **Company**

---

## Test Plan (Manual Testing)

Since this is a prototype, I tested manually:

### Login
-  Valid login → goes to Dashboard.
-  Wrong login → shows error alert.
-  Missing/expired token → gets redirected to login.

### Company Setup
- Recruiter without company → sees Create Company modal.
- Creating company → unlocks dashboard.
- Duplicate slug → shows error.

### Editing Careers Page
- Uploading logo/banner → updates UI.
- Adding, reordering, and deleting sections works and persists.
- Jobs can be created, edited inline, and deleted.

### Preview Page
- Recruiter can view preview.
- Other users or logged-out users → redirected to dashboard.

### Public Page
- If company is published → `/public/[slug]` works.
- If not published → redirects to dashboard.
- Job filters & search work as expected.

---

## User Flow Summary

1. User logs in → server gives JWT cookie.
2. Goes to Dashboard → server checks token.
3. If recruiter has no company → must create one first.
4. Once company exists, recruiter can:
   - Upload branding
   - Edit sections
   - Add/manage jobs
5. Recruiter can preview page (private).
6. Recruiter can publish page → public link is now viewable.
7. Candidates can open public link and browse jobs.

---

