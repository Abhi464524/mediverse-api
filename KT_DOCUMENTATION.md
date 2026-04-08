# Mediverse Backend - Knowledge Transfer (KT) Documentation

This document provides a comprehensive overview of the **Mediverse Backend** project structure, architecture, and technology stack to facilitate Knowledge Transfer.

## 🚀 Project Overview
**Mediverse** is a healthcare platform backend built with **Node.js**, **Express**, and **TypeScript**. It manages users, doctor profiles, and medical records using **PostgreSQL** as the primary database and **Firebase** for additional services.

---

## 🏗 Project Structure

```text
mediverse-backend/
├── src/
│   ├── config/             # Configuration for external services (DB, Firebase)
│   ├── controllers/        # Business logic and request handlers
│   ├── db/                 # Database initialization and migration scripts
│   ├── index.ts            # Application entry point
│   ├── middleware/         # Custom Express middleware (auth, logging, etc.)
│   ├── models/             # Database models or schemas
│   ├── routes/             # API route definitions (mapping URLs to controllers)
│   ├── types/              # TypeScript type definitions and interfaces
├── scripts/                # Utility scripts
├── .env                    # Environment variables (not tracked in Git)
├── package.json            # Dependencies and NPM scripts
├── tsconfig.json           # TypeScript compiler configuration
└── dist/                   # Compiled JavaScript files (generated after build)
```

---

## 🛠 Technology Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via `pg` pool)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Cloud / Auth**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## 📦 Directory Breakdown

### `src/index.ts`
The entry point of the application. It:
1. Loads environment variables using `dotenv`.
2. Connects to the PostgreSQL database.
3. Initializes database tables if they don't exist.
4. Sets up global middleware (`cors`, `helmet`, `express.json`).
5. Mounts the API routes.
6. Starts the server on the configured port.

### `src/config/`
Contains configuration files:
- **`db.ts`**: Sets up the PostgreSQL connection pool using `pg`.
- **`firebase.ts`**: Initializes the Firebase Admin SDK for authentication or cloud functions.

### `src/controllers/`
Contains the logic for processing incoming requests.
- **`userController.ts`**: Handles user-related operations (authentication, profile updates).
- **`doctorController.ts`**: Manages doctor-specific data.
- **`doctorProfileController.ts`**: Handles detailed profile management for doctors.

### `src/routes/`
Defines the API endpoints and maps them to controllers.
- **`/api/users`**: User registration, login, and profile routes.
- **`/api/doctors`**: Search and management of doctors.
- **`/api/doctor-profile`**: Detailed profile operations for medical professionals.

### `src/db/`
- **`init.ts`**: Contains the SQL DDL commands to create the initial table structure (`User`, `Doctor`, `DoctorProfile`).

---

## 🗄 Database Schema
The project uses a relational schema in PostgreSQL:
1. **User**: Stores authentication and basic profile data.
2. **Doctor**: Stores professional metadata and clinic details.
3. **DoctorProfile**: A secondary table linked to users for extended professional information.

---

## 🏃 Run & Build Scripts
Commonly used scripts defined in `package.json`:

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon src/index.ts` | Starts the server in development mode with auto-reload. |
| `npm run dev:all` | `concurrently ...` | **Recommended**: Starts both the server and localtunnel. |
| `npm run tunnel` | `npx localtunnel ...` | Exposes the local server to a public URL for testing. |
| `npm run build` | `tsc` | Compiles TypeScript files into the `dist/` folder. |
| `npm run start` | `node dist/index.js` | Runs the compiled application. |
| `npm run prod` | `pm2 start dist/index.js` | Starts the app in production mode using PM2. |

---

## 📱 Connecting from Mobile (Physical Device)

When testing with a physical Android/iOS device, you have two options for connecting to the backend:

### 1. Direct (Same WiFi) - **Highly Recommended**
If your laptop and phone are on the same WiFi, use the **machine's local IP address**. This is 100x faster and more stable than a tunnel.
- **URL**: Check the server terminal for `📱 Direct Local IP`. (e.g., `http://192.168.1.5:3500`)
- **Advantage**: Zero lag, no timeouts.

### 2. Remote (Different WiFi)
If your laptop and phone are on different networks, use **Localtunnel**.
- **URL**: Check the server terminal for `your url is: ...` (e.g., `https://short-fox-52.loca.lt`)
- **Advantage**: Works from anywhere in the world.
- **Note**: This setup often has higher latency and may sometimes time out.

---

## 🚀 Deployment Readiness
The API is configured to be "production-ready" out of the box:
- **Proxy Trust**: `app.set('trust proxy', 1)` is enabled, allowing it to work behind Nginx, AWS Load Balancers, or localtunnel.
- **Environment Driven**: Port, CORS, and Database SSL are all controlled via `.env`.
- **SSL Support**: Set `DATABASE_SSL=true` in `.env` when connecting to managed databases like AWS RDS.
- **CORS Security**: Use `ALLOWED_ORIGINS` in `.env` to restrict access to your frontend domain in production.

---

## 🛡 Security & Best Practices
- **Environment Variables**: Sensitive data like `DATABASE_URL` and `FIREBASE_SECRET` are stored in `.env`.
- **Password Hashing**: Done using `bcrypt` to ensure user security.
- **HTTP Headers**: Managed by `helmet` to protect against common web vulnerabilities.
- **TypeScript**: Used throughout the project to ensure type safety and reduce runtime errors.
