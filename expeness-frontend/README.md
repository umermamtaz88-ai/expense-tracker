# ExpenseFlow — Premium Expense Tracker

A modern, premium expense tracking frontend built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Connects to the FastAPI backend in `../expeness-tracker`.

## Installation

```bash
cd expeness-frontend
npm install
```

## Environment

Create `.env.local` (already included):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run

**1. Start the backend** (in a separate terminal):

```bash
cd ../expeness-tracker
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**2. Start the frontend:**

```bash
cd expeness-frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx              # Dashboard
  expenses/             # Expense CRUD pages
  categories/           # Category overview
  analytics/            # Charts & insights
  settings/             # User preferences (local)
  profile/              # User profile (local)
components/
  ui/                   # Design system primitives
  layout/               # Sidebar, Navbar, DashboardLayout
  features/             # Feature-specific components
hooks/                  # useExpenses, useDashboard, useAnalytics
services/               # API layer (api.ts, expense.service.ts)
types/                  # TypeScript interfaces
constants/              # Navigation, category icons/colors
lib/                    # Utils, settings
```

## Backend Integration

| Frontend Feature       | Backend Endpoint              |
|------------------------|-------------------------------|
| List expenses          | GET `/expenses`               |
| Filter expenses        | GET `/expenses?category&start_date&end_date` |
| Get expense            | GET `/expenses/{id}`          |
| Create expense         | POST `/expenses`              |
| Update expense         | PUT `/expenses/{id}`          |
| Delete expense         | DELETE `/expenses/{id}`       |
| Categories             | GET `/categories`             |
| Overall summary        | GET `/summary`                |
| Monthly summary        | GET `/summary/month`          |
| Category summary       | GET `/summary/category`       |
| Health check           | GET `/`                       |

## Missing Backend Endpoints

The following features use **client-side** logic because no backend endpoint exists:

- **Search** — filtered in browser after fetching expenses
- **Sorting** — client-side after API fetch
- **Pagination** — client-side (backend returns all matching records)
- **Total Income / Total Balance** — computed client-side from Salary, Business, Investment categories
- **Monthly budget / remaining budget** — stored in `localStorage` via Settings page
- **User settings** — local storage only (no `GET/PUT /settings`)
- **Today's spending** — computed client-side from expense list
- **Authentication** — not implemented in backend

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Recharts
- Sonner (toasts)
- next-themes (dark mode)
