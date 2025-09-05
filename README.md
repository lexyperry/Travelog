# Travelog
A simple travel journal where you can create trips, add entries, and upload photos. This README adds practical, copy‑pasteable setup and troubleshooting steps so you can get the app running end‑to‑end quickly.

# Tech Stack 
-Frontend: React, Vite, React Router, Tailwind CSS v4 
-Backend: Flask, SQLAlchemy, Marshmallow (schemas), SQLite (dev) 
-Infra: Cloudinary

# Features 
-Authenticated app(JWT cookies via Flask backend)
-Trips CRUD (title, location, dates, status)
-Entries per trip(data, text, place)
-Photo uploads(Cloudinart signed uploads)
-Responsive UI styled with Tailwind CSS v4

# Steps to Run Backend
>cd backend
>source .venv/bin/activate
>pip install -r requirements.txt
>flask db upgrade
>flask run

# Steps to Run Frontend
>cd frontend
>npm install
>npm install -D @tailwindcss/cli
VITE_API_URL=http://localhost:5000
>npm run dev

# API Surface (used by the frontend)

Auth (typical):

POST /api/auth/login → sets JWT cookies

POST /api/auth/register (if present)

POST /api/auth/refresh (if present)

POST /api/auth/logout

Trips:

GET /api/trips — list (owned by user)

POST /api/trips — create

GET /api/trips/:trip_id — detail (owned)

PATCH /api/trips/:trip_id — update

DELETE /api/trips/:trip_id — delete (see cascade notes)

Entries:

GET /api/trips/:trip_id/entries

POST /api/trips/:trip_id/entries

PATCH /api/entries/:entry_id

DELETE /api/entries/:entry_id

Uploads (Cloudinary signed uploads):

POST /api/uploads/sign?trip_id=:id → returns { api_key, timestamp, signature, folder, cloud_name }

client then POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload with those fields + file

then POST /api/trips/:trip_id/photos to persist { url, provider_id }
Endpoints:

POST /api/auth/register
Body: { "email", "password", "name" }
Resp: 201 { id, email, name }

POST /api/auth/login
Body: { "email", "password" }
Resp: 200 { user: { id, email, name } } and sets access & refresh cookies plus csrf_access_token/csrf_refresh_token.

POST /api/auth/refresh
Req: refresh cookie
Resp: sets a new access cookie; 200 { ok: true }.

POST /api/auth/logout
Resp: clears cookies; 200 { ok: true }.
