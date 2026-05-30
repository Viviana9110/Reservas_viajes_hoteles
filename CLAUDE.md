# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

npm workspaces monorepo with two packages:

- `backend/` — Express 5 + Mongoose API (ESM, `"type": "module"`)
- `frontend/` — React 19 + Vite 7 + Tailwind v4 SPA

The root `package.json` only declares the workspaces; there are no root-level scripts. Install dependencies from the repo root (`npm install`) so both workspaces are linked at once.

## Commands

Backend (run from `backend/`):
- `npm run server` — dev server with nodemon
- `npm start` — production-style run (`node index.js`)
- `npm run lint` — ESLint
- `npm run seed:destinations` — populates the `destinations` collection (only seed wired to an npm script)
- Other seeds (`seed.js`, `seedUsuarios.js`, `seedHoteles.js`, `seedRooms.js`, `seedPaquetes.js`) have no npm scripts — run with `node seed*.js`. Order matters: `seedUsuarios.js` must run first because `seed.js` looks up `owner@test.com` and exits if missing.

Frontend (run from `frontend/`):
- `npm run dev` — Vite dev server on port 5173 (the backend CORS allowlist expects this exact origin)
- `npm run build` / `npm run preview`
- `npm run lint`

There is no test suite in either workspace.

## Environment

Backend `.env` (loaded via `import "dotenv/config"` in `backend/index.js`):
- `MONGODB_URI` — required (Mongoose connects on startup)
- `JWT_SECRET`, `JWT_EXPIRES_IN` (defaults to `1d`)
- `PORT` (defaults to 4000)
- `EMAIL_USER`, `EMAIL_PASS` — optional Gmail SMTP for booking confirmations
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` — optional WhatsApp notifications
- `OWNER_WHATSAPP` — optional, used to build a `wa.me` link inside confirmation emails

`backend/utils/notifications.js` gracefully no-ops when email/Twilio env vars are missing, so missing creds will not break booking flows in development.

Frontend `.env`:
- `VITE_API_URL` — set as `axios.defaults.baseURL` in `frontend/src/context/AppContext.jsx`. All frontend requests use paths like `/auth/me` (no `/api` prefix), so `VITE_API_URL` must end with `/api` (e.g. `http://localhost:4000/api`).

## Architecture

### Backend API surface (mounted in `backend/index.js`)

| Mount | Purpose |
|---|---|
| `/api/auth` | register / login / logout / me |
| `/api/hotels` | hotel CRUD + nested room create (`POST /:hotelId/rooms`) and list (`GET /:id/rooms`) |
| `/api/hoteles` | **separate** rooms router — note the Spanish spelling, distinct from `/api/hotels` |
| `/api/bookings` | hotel room bookings |
| `/api/trips` | package CRUD (route file is `package.routes.js`, mounted under `/trips`) |
| `/api/booking-trips` | package bookings |
| `/api/search` | combined hotel + package search with date/guest availability |
| `/api/dashboard` | owner dashboard counts |
| `/api/custom-trips` | user-submitted custom trip requests with itinerary builder |
| `/api/destinations` | destinations catalog |

Watch for these naming mismatches when wiring new endpoints:
- `/api/hotels` (hotel resources) vs `/api/hoteles` (rooms) — easy to confuse
- Frontend uses `/trips` for packages; the model and controller are named `Package`

### Auth & roles

Two-tier role model on `User`: `"user" | "owner"` (`backend/models/User.js`). There is no `"admin"` role even though several routes call `requireRole("owner", "admin")` — in practice only `owner` ever passes.

Middleware in `backend/middlewares/auth.js`:
- `requireAuth` — reads `Authorization: Bearer <token>` header, populates `req.user` (this is the canonical path the frontend uses)
- `requireRole(...roles)` — RBAC gate, must follow `requireAuth`
- `protect` — legacy cookie-based variant (`req.cookies.token`); kept for compatibility but the frontend stores the JWT in `localStorage` and sends it via the `Authorization` header, so new routes should use `requireAuth`

Two route files were deleted from `backend/middlewares/` (`authorize.js`, `roles.js`) — do not reintroduce them; consolidate any new role logic in `auth.js`.

### Data model relationships

- `Hotel` → `User` (`owner`)
- `Room` → `Hotel` (`hotel`) with `type: single|double|suite`
- `Booking` → `User` + `Hotel` + `Room` with `checkIn`/`checkOut`
- `Package` — standalone trip product (name, destination, price, days)
- `BookingTrips` — bookings for `Package`s
- `CustomTrip` — user-built itinerary with embedded `destinations` and per-day `itinerary` arrays; status machine `pending → reviewing → quoted → approved/rejected`
- `Destination` — referenced by `CustomTrip.destinations[].destinationRef`

### Search availability logic (`backend/controllers/search.controller.js`)

The availability check is intentionally simple: it finds bookings that overlap the requested window, collects their room ids, and excludes them from the per-hotel room query. It iterates hotels sequentially (no aggregation pipeline). Keep this in mind before adding indexes or refactoring — the N+1 over hotels is the current design, not a bug to "fix" silently.

### Frontend state

`frontend/src/context/AppContext.jsx` is the single source of app-wide state: `user`, `token`, `hotels`, `trips`, `dashboardStats`, plus auth actions (`loginUser`, `registerUser`, `logoutUser`) and fetchers. On mount it loads hotels and trips; whenever `token` changes it refetches `/auth/me`.

`zustand` is a declared dependency but the current code uses React Context — do not assume zustand stores exist before grepping for them.

### Routing & route protection

`frontend/src/App.jsx` defines all routes inline and wraps each page with a `framer-motion` `AnimatedPage`. The `Navbar`/`Footer` are hidden when the URL contains `"owner"` (substring match on `location.pathname`, not a route check).

The `ProtectedRoute` component in `App.jsx` redirects to `/access-denied` for missing user or role mismatch. The owner area lives under `/owner/*` with `allowedRoles={["owner"]}`.

### Conventions

- User-facing API messages and most comments are in Spanish — match the existing language when adding messages.
- Mongoose models use `{ timestamps: true }` consistently — preserve this on new models.
- Validation uses `express-validator` chains on the route, followed by the shared `validate` middleware (`backend/middlewares/validate.js`). Add validators inline in the route file, not in the controller.
- Errors bubble to the shared `notFound` / `onError` handlers in `backend/middlewares/error.js`; controllers currently catch and respond directly rather than `next(err)`-ing — follow the surrounding pattern in each file.

## CORS

`backend/index.js` hard-codes the allowed origins (`http://localhost:5173` and the Vercel production URL). New deploy targets must be added to that array — there is no env-driven CORS config.
