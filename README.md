# 🛸 Rick & Morty - Fullstack Auth System

A high-performance web application built with **Angular 20**, focused on reactive state management and a robust authentication system that fully supports **Server-Side Rendering (SSR)** and **Hydration**.

## 🚀 Core Technologies

* **Angular 20 (Signals & Resources):** Leveraging the `httpResource` for native, signal-based HTTP request management.
* **RxJS Interop:** Seamless integration of `firstValueFrom` for handling asynchronous logic within services.
* **FastAPI Backend (Python):** Secure `httpOnly` cookie implementation to mitigate XSS and CSRF risks.
* **PostgreSQL & SQLAlchemy:** Robust data persistence with typed ORM models.
* **JWT (JSON Web Tokens):** Dual-token authentication system (`access_token` & `refresh_token`) with automated session validation.
* **httpResource:** Use for the new httpResoource to get api data.
---

## 🔐 Key Features

### 🛠️ Reactive AuthService
The heart of the application uses the new `httpResource` API to sync user state between the frontend and backend.
* **SSR Awareness:** Integrated `PLATFORM_ID` checks to ensure session validation only triggers in the browser, preventing hydration mismatches and server-side cookie failures.
* **Signal-Driven UI:** Exposed `isAuthenticated` as a `computed` signal, allowing the entire UI to react instantly to login/logout events.

### 🛡️ Smart Auth Guard
A sophisticated, asynchronous Guard that handles the "initial load" challenge:
* **Async Synchronization:** Uses an internal `effect` wrapped in a `Promise` to pause navigation until the `loggedUser` resource finishes its first load (transitioning from `idle` or `loading`).
* **Automatic Redirection:** Seamlessly routes unauthenticated users to `/auth/login` while preserving the application's integrity.

### 📝 Advanced Form Management
* **Register & Login:** Built with `ReactiveFormsModule` and `Signals` for real-time feedback.
* **Cross-Field Validation:** Includes a `passwordMatchValidator` that dynamically sets errors on the `repeat_password` control, ensuring data integrity before reaching the API.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
* Node.js (LTS version)
* Python 3.12+
* PostgreSQL database

### 2. Environment Configuration
The backend reads `backend/.env`. **Do not commit your `.env` file.** Instead, use the template provided in `backend/.env.example`.

1.  Copy the example file:
    ```bash
    cp backend/.env.example backend/.env
    ```
2.  Update the values with your local credentials (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `REFRESH_TOKEN`). Alternatively set `DATABASE_URL=postgresql://user:password@localhost:5432/your_db`.
3.  On a fresh database, create the schema:
    ```bash
    psql -d your_db -f backend/schema.sql
    ```

### 3. Running Project
**Backend (FastAPI, port 3000):**
```bash
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn app.main:app --reload --port 3000
```
(or from `rick-morty/`: `npm run server:install` and `npm run server:dev`)
Interactive API docs: `http://localhost:3000/docs`.

**Frontend:**
```bash
cd rick-morty
npm install
npm start
```

### Deploy (Vercel)
Frontend and backend are two separate Vercel projects from this repo:

* **`backend/`** (Root Directory = `backend`): Vercel auto-detects the FastAPI app in `app/main.py`; the daily cron hits `/api/keepalive` to keep Supabase awake. Set `DB_*`, `JWT_SECRET`, `REFRESH_TOKEN` and `CRON_SECRET` there.
* **`rick-morty/`** (Root Directory = `rick-morty`): the SSR frontend. Its `vercel.json` proxies `/auth/*` to the backend deployment, so the auth cookies stay on the frontend's domain — currently `https://backend-two-chi-22.vercel.app`.

---

## 🖥️ Local Setup Log (2026-09-03)

State of the local dev environment on this machine, for future reference:

* **PostgreSQL**: installed via system package, service was disabled — started with `sudo systemctl enable --now postgresql`. System role `postgres` uses password auth (password: `1234`, set by the project owner, not the `.env.example` placeholder).
* **Database**: `rick_morty_db`, created with `createdb`. Migrations applied with `npx drizzle-kit migrate` (uses `backend/drizzle.config.ts`, reads `backend/src/db/migrations/*`). Currently has one table: `users`.
* **`backend/.env`**: created from `.env.example`, filled with local values (`DB_USER=postgres`, `DB_PASSWORD=1234`, `DB_NAME=rick_morty_db`, `DB_HOST=localhost`, `DB_PORT=5432`, `PORT=3000`). Not committed (gitignored).
* **Port mismatch bug fixed**: `rick-morty/src/app/shared/models.ts` (`APIS.BACKEND.AUTH.*`) hardcodes `http://localhost:3000/auth/...`, but `backend/index.ts` defaulted to port `4000` when `PORT` wasn't set. Set `PORT=3000` in `backend/.env` so the frontend's hardcoded URLs actually reach the backend. If the backend is ever moved to a different port, either update `PORT` in `.env` back to match, or move `models.ts` to read from an Angular environment file instead of a hardcoded URL.
* **Verified working**: `POST /auth/register` and `POST /auth/login` tested directly with `curl` — both return 200 and login sets `access_token`/`refresh_token` as `httpOnly`, `SameSite=Strict` cookies.
* **Dev servers**: backend (`npm run dev` in `backend/`) on `http://localhost:3000`, frontend (`npm start` in `rick-morty/`) on `http://localhost:4200`.
