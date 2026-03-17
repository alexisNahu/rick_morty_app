# 🛸 Rick & Morty - Fullstack Auth System

A high-performance web application built with **Angular 20**, focused on reactive state management and a robust authentication system that fully supports **Server-Side Rendering (SSR)** and **Hydration**.

## 🚀 Core Technologies

* **Angular 20 (Signals & Resources):** Leveraging the `httpResource` for native, signal-based HTTP request management.
* **RxJS Interop:** Seamless integration of `firstValueFrom` for handling asynchronous logic within services.
* **Express.js Backend:** Secure `httpOnly` cookie implementation to mitigate XSS and CSRF risks.
* **PostgreSQL & Drizzle:** Robust data persistence and type-safe database queries.
* **JWT (JSON Web Tokens):** Dual-token authentication system (`access_token` & `refresh_token`) with automated session validation.

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
