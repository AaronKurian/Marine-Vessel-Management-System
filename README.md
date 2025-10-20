#  Marine Vessel Management System (MVMS)

## Project Description

The Marine Vessel Management System (MVMS) is a centralized web platform designed to simplify and modernize maritime operations. It replaces slow manual processes with efficient digital workflows by connecting key stakeholders in one place, including:

* **Fleet Owners**
* **Captains**
* **Traders (Cargo Clients)**

The system is built to improve coordination, reduce delays, and ensure compliance with international regulations, making maritime logistics smoother and more reliable.

## Key Features

The platform offers tailored, role-based dashboards for different users, focusing on the following core functionalities:

* **Vessel Management**: Register and monitor vessels with real-time status (At Port/At Sea).
* **Voyage Scheduling**: Plan vessel routes, set departure dates, and track arrivals.
* **Cargo Tracking**: Traders can submit, and owners/captains can manage, cargo requests for voyages.
* **User Roles**: Separate dashboards (`/dashboard/fleetowner`, `/dashboard/captain`, `/dashboard/trader`) based on user role.

## Tech Stack

The project is structured as a client-server application with a clear separation between the frontend and the backend.

### Frontend

| Component | Technology | Description |
|-----------|------------|-------------|
| Framework | React | User interface library. |
| Styling | Tailwind CSS | Utility-first CSS framework for rapid UI development. |
| Tooling | Vite | Next-generation frontend tooling. |
| Routing | React Router DOM | Declarative routing for React. |

### Backend

| Component | Technology | Description |
|-----------|------------|-------------|
| Runtime | Node.js | JavaScript runtime environment. |
| Framework | Express.js | Minimalist and flexible Node.js web application framework. |
| Database | Supabase | Backend-as-a-Service (BaaS) providing a Postgres database and API layer. |
| Dev Tool | Nodemon | Utility for automatically restarting the server during development. |

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* Node.js (version 18 or higher is recommended)
* npm or yarn
* A Supabase project instance (for database configuration)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

3. Create a `.env` file in the `backend` directory and add your Supabase credentials:
   ```env
   # .env file content
   SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
   SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   # The API will run on this port by default
   PORT=3000
   ```

4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

   The server should start on `http://localhost:3000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

3. Start the frontend application:
   ```bash
   npm run dev
   ```

   The frontend application should now be accessible, typically at `http://localhost:5173` (as suggested by Vite's typical behavior, though the base URL is not explicitly configured in the provided files). It is configured to communicate with the backend running on `http://localhost:3000`.

