This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Capital Architect Intake Webhook

This project includes a server intake endpoint at `POST /api/intake` that writes leads to Prisma and auto-assigns tiers.

### Required env vars

- `DATABASE_URL` (Supabase pooler)
- `DIRECT_URL` (Supabase direct host)
- `INTAKE_API_KEY` (optional but recommended)

### Intake payload shape

```json
{
	"leadName": "Acme Holdings",
	"ficoBand": "720+",
	"utilizationBand": "31-50%",
	"bankruptcy": "No",
	"recentLates": "No",
	"sourceLeadId": "2026-03-27T20:00:00Z|Acme Holdings"
}
```

### Google Apps Script bridge

Use `scripts/google-apps-script/intake-webhook.gs` in your linked Form script project:

1. Open Google Form -> Extensions -> Apps Script.
2. Paste the file contents and set `INTAKE_API_URL` + `INTAKE_API_KEY`.
3. Add an installable trigger for `onFormSubmit`.
4. Submit a test form and verify the lead appears in Admin Dashboard.

### Local verification

1. Start app with `npm run dev`.
2. Send a test request:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/intake" -Method Post -Headers @{"x-intake-key"="caparch_intake_local_2026"} -ContentType "application/json" -Body '{"leadName":"Test Capital LLC","ficoBand":"720+","utilizationBand":"31-50%","bankruptcy":"No","recentLates":"No","sourceLeadId":"local-test-1"}'
```

3. Open `/dashboard/admin` and confirm the new lead row appears with Tier `A`.
