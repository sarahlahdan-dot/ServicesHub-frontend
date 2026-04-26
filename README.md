# ServiceHub — Frontend
 
React client for ServiceHub, a local consumer services marketplace for Bahrain.
 
**Stack:** React 19 · React Router 7 · Axios · Socket.io-client · Vite
 
---
 
## Setup
 
```bash
npm install
```
 
Create a `.env` file in the root:
 
```
VITE_BACKEND_URL=http://localhost:3000
```
 
Add the Happy Monkey font:
 
```
public/fonts/HappyMonkey-Regular.ttf
```
 
```bash
npm run dev
```
 
App runs on `http://localhost:5173`
 
---
 
## Pages & Routes
 
| Route | Page | Access |
|-------|------|--------|
| `/` | Homepage | Public |
| `/services` | Service listing with search + filter | Public |
| `/services/:id` | Service detail + booking form | Public |
| `/sign-in` | Sign in | Public |
| `/sign-up` | Sign up (role selector) | Public |
| `/dashboard` | Role-based hub | Any logged-in |
| `/my-bookings` | Bookings, chat, reviews | Customer |
| `/provider/bookings` | Manage incoming bookings | Provider |
| `/provider/services` | Create & manage listings | Provider |
| `/admin` | Stats + user table | Admin |
 
---
 
## Design
 
| Token | Value |
|-------|-------|
| `--deep-space-blue` | `#003049` |
| `--brick-red` | `#c1121f` |
| `--molten-lava` | `#780000` |
| `--papaya-whip` | `#fdf0d5` |
| `--steel-blue` | `#669bbc` |
| Brand font | Happy Monkey |
| Body font | DM Sans / Segoe UI |