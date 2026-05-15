# PollFlow — Create & Share Polls in Real-Time

## Overview
PollFlow is a production-grade, highly responsive web application designed for creating, sharing, and analyzing polls in real-time. Whether you are a business looking for customer feedback or a community organizer looking for consensus, PollFlow provides an elegant, frictionless experience for both poll creators and respondents.

By leveraging a powerful Node.js/Express backend paired with MongoDB and Socket.io, the platform ensures that as votes roll in, creators see their analytics dashboards update live—with zero manual refreshing required. The frontend utilizes React, Tailwind CSS, and Recharts to visualize this data beautifully.

## Features
- **Secure Authentication:** JWT-based stateless authentication with robust password validation and protected routing.
- **Complex Poll Creation:** Dynamic array management allowing up to 20 questions with customizable requirements and ordering.
- **Real-Time Analytics:** Live socket-driven dashboards that increment total responses and shift vote shares on the fly.
- **Advanced Visualizations:** Recharts integration for responsive Pie charts, Bar charts, and chronological Trend line tracking.
- **Responsive Public Interfaces:** Frictionless voting interfaces for respondents with sticky progress bars and auto-scrolling validation.
- **Granular Poll Management:** Soft/hard locking expiration systems and unchangeable publication states.
- **Native Sharing:** Built-in copy-to-clipboard functionality and X/Twitter share intent mapping.

## Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, TailwindCSS 3, Recharts 2 |
| **Backend** | Node.js 18+, Express 4, Express-Validator |
| **Database** | MongoDB Atlas, Mongoose 7 |
| **Real-time** | Socket.io 4.x (Client & Server) |
| **Utilities** | Date-fns, Axios, React-Hot-Toast |

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB Atlas Account (or local MongoDB instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pollflow
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `/server` directory and a `.env` file in the `/client` directory based on the table below.

4. **Run the Development Servers**
   ```bash
   # In terminal 1
   npm run dev:server
   
   # In terminal 2
   npm run dev:client
   ```

### Environment Variables

**Server (`/server/.env`)**
| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | API port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB Connection String |
| `JWT_SECRET` | Yes | Secret for signing auth tokens |
| `CLIENT_URL` | Yes | URL of the frontend (e.g. `http://localhost:5173`) |

**Client (`/client/.env`)**
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | URL of the backend (e.g. `http://localhost:5000`) |

## API Documentation

| Method | Route | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new user account |
| POST | `/api/auth/login` | No | Authenticate and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| POST | `/api/polls/create` | Yes | Create a new poll |
| GET | `/api/polls/my-polls` | Yes | Get all polls created by user |
| DELETE | `/api/polls/:pollId` | Yes | Delete a specific poll |
| POST | `/api/polls/:pollId/publish`| Yes | Finalize and publish results |
| GET | `/api/analytics/:pollId/summary`| Yes | Get real-time data for dashboard |
| GET | `/api/public/poll/:shareToken` | Optional | Fetch poll for respondents |
| POST | `/api/public/poll/:shareToken/respond`| Optional | Submit vote payload |
| GET | `/api/public/poll/:shareToken/results`| No | View published final results |

## Project Structure
```text
pollflow/
├── client/
│   ├── src/
│   │   ├── api/          # Axios instances and endpoint definitions
│   │   ├── components/   # Reusable UI (Modals, Charts, QuestionBuilders)
│   │   ├── context/      # React Context (Auth)
│   │   ├── hooks/        # Custom hooks (useSocket, useCountdown)
│   │   ├── pages/        # Route components (Dashboard, Analytics, etc.)
│   │   └── utils/        # Formatters, Validators, Constants
├── server/
│   ├── controllers/      # Route logic handlers
│   ├── middleware/       # Auth guards, Poll ownership guards
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express router definitions
│   └── socket/           # WebSocket server configuration
```

## Deployment
- **Backend**: Suitable for Render or Railway. Ensure `CLIENT_URL` matches the frontend deployment URL to avoid CORS errors.
- **Frontend**: Suitable for Vercel or Netlify. Ensure `VITE_API_URL` points to the deployed backend.
- **Database**: Host on MongoDB Atlas and whitelist the backend server IP addresses.
