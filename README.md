# 🛸 Rick & Morty - Fullstack Auth System

A high-performance web application built with **Angular 20**, focused on reactive state management and a robust authentication system that fully supports **Server-Side Rendering (SSR)** and **Hydration**.

## 🚀 Core Technologies

* **Angular 20 (Signals & Resources):** Leveraging the `httpResource` for native, signal-based HTTP request management.
* **RxJS Interop:** Seamless integration of `firstValueFrom` for handling asynchronous logic within services.
* **Express.js Backend:** Secure `httpOnly` cookie implementation to mitigate XSS and CSRF risks.
* **PostgreSQL & Drizzle:** Robust data persistence and type-safe database queries.
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
* PostgreSQL database

### 2. Environment Configuration
The project uses an `.env` file for sensitive data. **Do not commit your `.env` file.** Instead, use the template provided in `.env.example`.

1.  Copy the example file:
    ```bash
    cp .env.example .env
    ```
2.  Update the values in `.env` with your local credentials:
    ```env
    PORT=3000
    DATABASE_URL=postgres://user:password@localhost:5432/your_db
    JWT_SECRET=your_secure_random_string
    ```

### 3. Running Project
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd rick-morty
npm install
npm start
```

---

## 🖥️ Local Setup Log (2026-09-03)

State of the local dev environment on this machine, for future reference:

* **PostgreSQL**: installed via system package, service was disabled — started with `sudo systemctl enable --now postgresql`. System role `postgres` uses password auth (password: `1234`, set by the project owner, not the `.env.example` placeholder).
* **Database**: `rick_morty_db`, created with `createdb`. Migrations applied with `npx drizzle-kit migrate` (uses `backend/drizzle.config.ts`, reads `backend/src/db/migrations/*`). Currently has one table: `users`.
* **`backend/.env`**: created from `.env.example`, filled with local values (`DB_USER=postgres`, `DB_PASSWORD=1234`, `DB_NAME=rick_morty_db`, `DB_HOST=localhost`, `DB_PORT=5432`, `PORT=3000`). Not committed (gitignored).
* **Port mismatch bug fixed**: `rick-morty/src/app/shared/models.ts` (`APIS.BACKEND.AUTH.*`) hardcodes `http://localhost:3000/auth/...`, but `backend/index.ts` defaulted to port `4000` when `PORT` wasn't set. Set `PORT=3000` in `backend/.env` so the frontend's hardcoded URLs actually reach the backend. If the backend is ever moved to a different port, either update `PORT` in `.env` back to match, or move `models.ts` to read from an Angular environment file instead of a hardcoded URL.
* **Verified working**: `POST /auth/register` and `POST /auth/login` tested directly with `curl` — both return 200 and login sets `access_token`/`refresh_token` as `httpOnly`, `SameSite=Strict` cookies.
* **Dev servers**: backend (`npm run dev` in `backend/`) on `http://localhost:3000`, frontend (`npm start` in `rick-morty/`) on `http://localhost:4200`.
