# CAPITAL ARCHITECT - MASTER ENGINEERING BLUEPRINT

## 1. The AI Operating Protocol
We operate on a "Brain vs. Hands" architecture to prevent hallucination and code conflicts.
* **The Brain (Lead Architect):** All system design, database architecture, and complex logic planning happens in the cloud (Gemini). Gemini writes the execution prompts.
* **The Hands (Line Worker):** GitHub Copilot executes the code locally in VS Code based *only* on Gemini's prompts. Copilot does not invent architecture; it builds what the Architect designs.

## 2. The Tech Stack
* **Framework:** Next.js (App Router strictly enforced).
* **Database:** PostgreSQL via Supabase.
* **ORM:** Prisma (All migrations use `npx prisma db push` during rapid prototyping).
* **Styling:** Tailwind CSS + shadcn/ui (if applicable).
* **Authentication:** Clerk.

## 3. The Vercel Cloud Directives (CRITICAL)
Capital Architect is hosted on Vercel's serverless infrastructure. You must strictly obey these limits:
* **No Heavy Backend Binaries:** Puppeteer, Python scripts, or massive PDF rendering engines are strictly forbidden on the server. They will cause Vercel timeout errors.
* **Client-Side Delegation:** Heavy processing (like PDF document generation for the Compliance Engine) MUST be offloaded to the user's browser using lightweight libraries like `html2pdf.js`.
* **Server Actions:** All database mutations (reads/writes) must use Next.js async Server Actions (`"use server"`), not traditional API routes. 

## 4. Current Core Systems
1. **The God-Mode Dashboard:** The central nervous system viewing all incoming data.
2. **The Scoring Engine:** Calculates `fundabilityScore` based on Metro 2 errors, entity type, and recent inquiries.
3. **The Compliance Engine:** Hydrates HTML templates with client data and generates downloadable PDFs on the client side.

## 5. Development Rules for Copilot
* Zero Overwhelm: Write small, modular, bite-sized components. Do not rewrite a 500-line file to change 3 lines of code.
* The Next Right Step: If an error occurs, provide the single most immediate fix, not a 10-step refactor.
* Keep it Unified: Do not suggest external hosting (Heroku, DigitalOcean) or new languages (Python). Keep everything inside Next.js.
