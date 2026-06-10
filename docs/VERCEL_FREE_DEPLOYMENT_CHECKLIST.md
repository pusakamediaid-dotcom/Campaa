# Vercel Free Deployment Checklist

Project:  
Campaa

Target:  
Vercel Hobby deployment for premium demo website.

## Deployment Mode

Recommended:

- Vercel Hobby.
- Demo Mode as default.
- No paid API required for initial public demo.

## Required Build Settings

Framework:  
Vite

Install Command:  
npm install

Build Command:  
npm run build

Output Directory:  
dist

Development Command:  
npm run dev

## Optional Environment Variables

- OPENAI_API_KEY
- GEMINI_API_KEY
- OPENROUTER_API_KEY

Notes:

- These variables are optional.
- Do not add real keys to GitHub.
- Add them only in the Vercel dashboard if needed.
- Without environment variables, Campaa should remain usable in Demo Mode.

## Pre-Deploy Checklist

- README updated.
- CI workflow added.
- npm build command available.
- TypeScript typecheck available.
- Security documentation available.
- Demo Mode documented.
- No API key committed.
- No .env committed.
- No paid dependency required.

## Post-Deploy Checklist

- Open Vercel production URL.
- Test Demo Mode.
- Test mode selector.
- Test tool UI if available.
- Check browser console.
- Check Vercel build logs.
- Add Vercel URL to README.
- Add Vercel URL to GitHub repository website field.
- Create GitHub release after successful deployment.

## Manual Steps

1. Go to vercel.com.
2. Import GitHub repository: `pusakamediaid-dotcom/Campaa`.
3. Choose Vite framework if detected.
4. Confirm build command: `npm run build`.
5. Confirm output directory: `dist`.
6. Do not add API keys for first demo deployment.
7. Deploy.
8. Copy production URL.
9. Update README after deployment.
