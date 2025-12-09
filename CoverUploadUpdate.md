# Cover Image Upload Setup 

What to install:

1. Backend (BE)
- From the `BE` folder install the new dependencies:

```powershell
cd "c:\Users\PC\Downloads\Project-CNPM\BE"
npm install @supabase/supabase-js multer
```

2. Frontend (FE)
- From the `FE` folder install Supabase client if not already:

```powershell
cd "c:\Users\PC\Downloads\Project-CNPM\FE"
npm install @supabase/supabase-js
```

What to add to .env:

1. Backend `.env` (BE/.env):
```
SUPABASE_URL=https://nhqmnxbexvazcpzbtdtu.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key> (lấy trong Project Settings -> API Keys)
```

2. Frontend `.env` (FE/.env) — required keys (add/verify):
```
VITE_SUPABASE_URL=https://nhqmnxbexvazcpzbtdtu.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key> (lấy trong Project Settings -> API Keys)
```
- The FE uses the anon key only for optional client-side uploads or for public buckets. The server uses the `SUPABASE_SERVICE_KEY` to upload securely.


Files touched by this feature
- FE:
  - `FE/src/components/dialogs/BookEditDialog.jsx` (uploads file — now prefers server upload)
  - `FE/src/services/supabaseClient.js` (Supabase client initialization)
  - `FE/.env` (VITE_* variables)
- BE:
  - `BE/src/services/supabaseServerClient.js` (server supabase client)
  - `BE/src/routes/bookRoutes.js` (added `POST /upload-cover` route)
  - `BE/src/controllers/bookController.js` (added `uploadCover` handler)
  - `BE/.env` (SUPABASE_SERVICE_KEY)

Recommended follow-ups
- Run `npm audit` and `npm audit fix` in the BE folder and verify the server starts and tests pass. If `npm audit fix` requires `--force`, do it in a branch and test carefully.

