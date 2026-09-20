# Ziplify — Frontend

React frontend for [Ziplify](https://ziplify.vercel.app), a URL shortener with accounts, custom aliases, link expiration, and a dashboard for managing your links.

For the full system architecture, design decisions, performance benchmarks, and resolved-issues log, see the backend repo's documentation: [ziplify-server](https://github.com/Maahhbuub/ziplify-server).

---

## Stack

- **React 19** + **Vite**
- **CSS Modules** — no Tailwind, scoped per-component styling
- `react-router-dom` — client-side routing
- `axios` — API client, with automatic access-token refresh on 401
- `lucide-react` — icons
- `react-hot-toast` — notifications

---

## Project structure

```
src/
├── api/            → axios instance, token refresh interceptor
├── components/
│   ├── dashboard/  → dashboard widgets (stats, links table, charts, link creator)
│   ├── home/       → public landing page (Hero)
│   ├── status/     → NotFound, LinkExpired, VerifyEmail, Maintenance
│   └── ui/         → shared UI (modals, loaders)
├── context/        → AuthContext (user session, login/logout/register)
├── hooks/          → useAuth, useParticles
├── layouts/        → MainLayout, AuthLayout, DashboardLayout
├── pages/          → route-level pages (Home, Dashboard, MyLinks, Profile, Analytics, auth/*)
└── routes/         → GuestRoute, PrivateRoute — auth-gated route wrappers
```

### Route map

| Path | Layout | Access |
|---|---|---|
| `/` | `MainLayout` | Public |
| `/auth/login`, `/auth/signup`, `/auth/forgot` | `AuthLayout` | Guest only (`GuestRoute`) |
| `/auth/verify-email`, `/auth/reset-password` | `AuthLayout` | Public (token-gated) |
| `/my-dashboard`, `/my-dashboard/my-links`, `/my-dashboard/profile`, `/my-dashboard/analytics` | `DashboardLayout` | Authenticated only (`PrivateRoute`) |
| `/not-found`, `/link-expired` | — | Public status pages |

Dashboard routes live under the `/my-dashboard/*` prefix deliberately — every segment contains a `/`, which structurally can't collide with the short-code proxy rule below, regardless of length.

---

## How routing to the backend works

This app is a single-page app, but short links (`ziplify.vercel.app/ab21`) need to hit the backend directly, not React Router. `vercel.json` handles this at the edge, before any request reaches the React bundle:

```json
{
    "rewrites": [
        { "source": "/([a-zA-Z0-9]{1,10})", "destination": "https://ziplify-server-production.up.railway.app/$1" },
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

- A path matching a short code (1–10 alphanumeric characters) is proxied straight to the Railway backend, which performs the actual lookup and `302` redirect.
- Everything else falls back to `index.html`, letting React Router take over client-side.

This only matters for **fresh requests** (a hard refresh, a bookmark, a direct URL visit) — in-app navigation via `<Link>` never touches this layer at all, since it's handled entirely client-side by React Router.

**Why this matters for naming new routes:** any route name that's short and purely alphanumeric (e.g. a bare `/login` or `/dashboard`) risks colliding with the short-code pattern above. All current routes are either nested under a multi-segment prefix (`/auth/*`, `/my-dashboard/*`) or contain a hyphen (`/not-found`, `/link-expired`), which makes them immune. Keep new routes to one of those two shapes.

---

## Local development

### Prerequisites
- Node.js
- The [backend](https://github.com/Maahhbuub/ziplify-server) running locally (or a deployed instance to point at)

### Setup

```bash
git clone https://github.com/Maahhbuub/ziplify-web.git
cd ziplify-web
npm install
```

Create a `.env` file:

```
VITE_API_BASE_URL=https://ziplify-server-production.up.railway.app
```

Point this at `http://localhost:5000` instead if you're running the backend locally.

Run the dev server:

```bash
npm run dev
```

### Other scripts

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # ESLint
```

---

## Authentication

`AuthContext` holds the current user and access token in memory (not localStorage), and calls `GET /auth/me` on mount to restore a session from the refresh-token cookie. The axios instance (`src/api/api.js`) automatically attaches the access token to outgoing requests and, on a `401`, transparently attempts a token refresh once before retrying the original request — except for the auth endpoints themselves, which are excluded to avoid a refresh loop.

---

## Deployment

Deployed on **Vercel**, auto-deploying on push to `main`.

**Required environment variable (set in Vercel's dashboard, not just locally):**

```
VITE_API_BASE_URL=https://ziplify-server-production.up.railway.app
```

Vite environment variables are baked in at build time — changing this value requires a new deployment to take effect, not just a dashboard save.