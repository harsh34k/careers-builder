# Careers Page Builder

This is a small app where a **recruiter can create and customize a Careers page for their company**, and **candidates can browse jobs** from that page.  
The idea is to let companies tell their story (logo, banner, sections, theme styling) and list open roles in a clean & modern UI.

---

## 🧱 What I Built

- Recruiters can **log in** and manage their company.
- If a recruiter is new and doesn’t have a company yet, they are asked to **create one first**.
- The Dashboard lets the recruiter:
  - Upload **logo** & **banner**
  - Choose a **theme color**
  - Add, edit, reorder, and delete **content sections**
  - Create and manage **job postings**
  - **Preview** the final page privately before publishing
  - **Publish** and share a public link

- Candidates can visit the **public careers page**:
  - View branding, story, and culture sections
  - Browse all job openings
  - Filter jobs and search by title

(No job application flow is built, on purpose — browsing only.)

---

## 🧰 Tech Stack

| Layer | Tools Used |
|------|------------|
| Frontend UI | Next.js (App Router), TailwindCSS, shadcn/ui |
| Backend APIs | Next.js server routes |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT stored in HttpOnly cookies |
| Rich Text Editor | Tiptap |
| File Uploads | Cloudinary API |

---

##  How to Run Locally

### 1. Clone the repo
git clone <your-repo-url>
cd <repo-folder>
### 2. Install dependencies
npm install
### 3. Set up Environment Variables
create .env file using .env.exammple file
### 4. Push schema & generate client
npx prisma db push
npx prisma generate
### 5. Run the dev server
npm run dev

## User Guide (Step-by-Step)
 ### For Recruiters

1. Go to /signup and create an account.

2. Log in → You’ll land on Dashboard.

3. If it's your first time → Create your Company.

4. Now you can:

 - Upload logo & banner

 - Set theme color

 - Add custom content sections

 - Create job listings

5. Click Preview to see what the public page will look like.

6. Click Publish to make the page accessible to candidates.

7. Copy and share your Public Careers Page link.

### For Candidates

1. Visit /public/<company-slug>.

2. View company intro and sections.

3.Browse open jobs using filters or search.

4. Open any job to view full details.

## Improvement Plans

1. Improve UI especially the dashboard.
2. Use pagination in Jobs
3. Used sepearte table for section instead of storing Json in Company table.
4. Better Data validation for email, password and other fields.
5. Add full job application flow (resume upload, form builder, apply tracking).
6. Using Toast instead of alerts , and overall better error handling
7. Show Loading state


