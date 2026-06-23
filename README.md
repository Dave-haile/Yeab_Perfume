# Yeab Luxury Perfumes 🧴✨

A full-stack luxury perfume e-commerce application with a React frontend and Express backend. Browse, search, and manage a curated collection of premium fragrances with detailed profiles, accord breakdowns, and gallery images.

**Repository:** [https://github.com/Dave-haile/Yeab_Perfume.git](https://github.com/Dave-haile/Yeab_Perfume.git)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Configuration](#environment-configuration)
  - [Backend (`back/.env`)](#backend-backenv)
  - [Frontend (`front/.env`)](#frontend-frontenv)
- [Running the Application](#running-the-application)
  - [Start the Backend](#start-the-backend)
  - [Start the Frontend](#start-the-frontend)
  - [Seed the Database](#seed-the-database)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
  - [Backend Scripts](#backend-scripts)
  - [Frontend Scripts](#frontend-scripts)
- [Features](#features)
- [Deployment](#deployment)

---

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite 6** (build tool & dev server)
- **React Router DOM v7**
- **Tailwind CSS v4**
- **Motion** (animations)
- **Lucide React** (icons)
- **Axios** (HTTP client)

### Backend

- **Node.js** with **Express 5**
- **TypeScript** (via `tsx` for development)
- **SQLite** (`better-sqlite3`)
- **JWT Authentication** (`jsonwebtoken` + `bcryptjs`)
- **Multer** (file uploads)

---

## Project Structure

```
Yeab-Luxury-Perfumes/
├── back/                      # Express API server
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── db/                # Database connection & schema
│   │   ├── middleware/        # Auth, error handling, uploads
│   │   ├── models/            # Database models (perfumes, users, config)
│   │   ├── routes/            # API route definitions
│   │   ├── index.ts           # Server entry point
│   │   ├── seed.ts            # Database seeder
│   │   └── types.ts           # TypeScript type definitions
│   ├── data/                  # SQLite database files
│   ├── uploads/               # Uploaded images (auto-created)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                   # Environment variables
├── front/                     # React SPA
│   ├── src/
│   │   ├── common/            # Layout, routing, context providers
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # API client, utilities, data
│   │   ├── pages/             # Admin pages
│   │   ├── views/             # Main app views/catalog
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env                   # Environment variables
└── README.md                  # This file
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Dave-haile/Yeab_Perfume.git
cd Yeab-Luxury-Perfumes
```

### 2. Backend Setup

```bash
cd back
npm install
```

### 3. Frontend Setup

```bash
cd ../front
npm install
```

---

## Environment Configuration

### Backend (`back/.env`)

Create or edit `back/.env` with the following variables:

```env
PORT=8000
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=8h
NODE_ENV=development
```

| Variable         | Description                      | Default       |
| ---------------- | -------------------------------- | ------------- |
| `PORT`           | Backend server port              | `8000`        |
| `JWT_SECRET`     | Secret key for JWT token signing | (required)    |
| `JWT_EXPIRES_IN` | JWT token expiration duration    | `8h`          |
| `NODE_ENV`       | Environment mode                 | `development` |

### Frontend (`front/.env`)

Create or edit `front/.env`:

```env
VITE_API_URL=http://localhost:8000/api
BASE_URL=http://localhost:8000/
```

| Variable       | Description                        | Default                     |
| -------------- | ---------------------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL               | `http://localhost:8000/api` |
| `BASE_URL`     | Backend base URL (for images etc.) | `http://localhost:8000/`    |

---

## Running the Application

You need two terminal windows — one for the backend and one for the frontend.

### Start the Backend

```bash
cd back
npm run dev
```

The backend will start at **http://localhost:8000** and the API at **http://localhost:8000/api**.

A health check endpoint is available at: `http://localhost:8000/api/health`

### Start the Frontend

```bash
cd front
npm run dev
```

The frontend will start at **http://localhost:3000**.

### Seed the Database

To populate the database with sample perfumes and a default admin user:

```bash
cd back
npm run seed
```

This will:

1. Wipe all existing perfume data
2. Insert a curated collection of luxury perfumes
3. Create a default admin account

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description          | Auth Required |
| ------ | -------------------- | -------------------- | ------------- |
| POST   | `/api/auth/login`    | Admin login          | No            |
| POST   | `/api/auth/register` | Register a new admin | Yes           |

### Perfumes

| Method | Endpoint            | Description          | Auth Required |
| ------ | ------------------- | -------------------- | ------------- |
| GET    | `/api/perfumes`     | Get all perfumes     | No            |
| GET    | `/api/perfumes/:id` | Get perfume by ID    | No            |
| POST   | `/api/perfumes`     | Create a new perfume | Yes           |
| PATCH  | `/api/perfumes/:id` | Update a perfume     | Yes           |
| DELETE | `/api/perfumes/:id` | Delete a perfume     | Yes           |

### Uploads

| Method | Endpoint             | Description     | Auth Required |
| ------ | -------------------- | --------------- | ------------- |
| POST   | `/api/uploads/image` | Upload an image | Yes           |

### Staff Requests

| Method | Endpoint                         | Description            | Auth Required |
| ------ | -------------------------------- | ---------------------- | ------------- |
| GET    | `/api/staff-requests`            | Get all staff requests | Yes           |
| POST   | `/api/staff-requests`            | Submit a staff request | No            |
| PATCH  | `/api/staff-requests/:id/status` | Update request status  | Yes           |

### Admin

| Method | Endpoint               | Description          | Auth Required |
| ------ | ---------------------- | -------------------- | ------------- |
| GET    | `/api/admin/users`     | List all admin users | Yes           |
| DELETE | `/api/admin/users/:id` | Delete an admin user | Yes           |

### Config

| Method | Endpoint      | Description       | Auth Required |
| ------ | ------------- | ----------------- | ------------- |
| GET    | `/api/config` | Get public config | No            |
| PATCH  | `/api/config` | Update config     | Yes           |

### Health

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/api/health` | Server health check | No            |

---

## Available Scripts

### Backend Scripts

| Script  | Command         | Description                      |
| ------- | --------------- | -------------------------------- |
| `dev`   | `npm run dev`   | Start dev server with hot reload |
| `build` | `npm run build` | Compile TypeScript to JavaScript |
| `start` | `npm start`     | Start compiled production server |
| `seed`  | `npm run seed`  | Seed database with sample data   |

### Frontend Scripts

| Script    | Command           | Description                       |
| --------- | ----------------- | --------------------------------- |
| `dev`     | `npm run dev`     | Start Vite dev server (port 3000) |
| `build`   | `npm run build`   | Build for production              |
| `preview` | `npm run preview` | Preview production build          |
| `lint`    | `npm run lint`    | Run TypeScript type checking      |

---

## Features

- 🏪 **Luxury Perfume Catalog** — Browse a curated collection with detailed fragrance profiles
- 🔍 **Accord Visualizations** — Visual breakdown of fragrance accords with color-coded percentages
- 📸 **Image Gallery** — Perfume image galleries with horizontal scrolling
- 🏷️ **Brand Filtering** — Filter perfumes by brand, gender, category, and season
- 🌙 **Day/Night & Seasonal** — Perfume recommendations based on time of day and seasons
- 🔐 **Admin Panel** — Secure admin dashboard for managing perfumes, users, and site config
- 👥 **Staff Requests** — Public request submission system for staff/admin
- 📂 **Image Uploads** — File upload support for perfume images
- 📱 **Responsive Design** — Mobile-friendly interface with Tailwind CSS

---

## Deployment

### Backend

1. Build the TypeScript:

   ```bash
   cd back
   npm run build
   ```

2. Set production environment variables in `back/.env`:

   ```env
   PORT=8000
   JWT_SECRET=<strong-production-secret>
   JWT_EXPIRES_IN=8h
   NODE_ENV=production
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Build the static files:

   ```bash
   cd front
   npm run build
   ```

2. Serve the `dist/` folder via the Express backend or any static file server (e.g., Nginx).

---

For questions or contributions, please visit the [GitHub repository](https://github.com/Dave-haile/Yeab_Perfume.git).
