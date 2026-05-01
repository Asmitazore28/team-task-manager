# Team Task Manager

A full-stack web application for team project and task management with role-based access control.

## Features

- **Authentication**: Signup/Login with JWT tokens
- **Role-based Access**: Admin and Member roles
- **Project Management**: Create, update, delete projects, manage team members
- **Task Management**: Create tasks, assign to users, track status
- **Dashboard**: Overview of all tasks, status counts, overdue tracking
- **Progress Tracking**: Todo, In Progress, Done status workflow

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd team-task-manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Configure environment variables:

Create a `.env` file in the backend directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Open your browser at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get single project (protected)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/members` - Add member (protected)
- `DELETE /api/projects/:id/members` - Remove member (protected)

### Tasks
- `GET /api/tasks` - Get all tasks with filters (protected)
- `GET /api/tasks/dashboard` - Get dashboard stats (protected)
- `GET /api/tasks/users` - Get all users (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `PUT /api/tasks/:id/status` - Update task status (protected)
- `PUT /api/tasks/:id/assign` - Assign task to user (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

## User Roles

- **Admin**: Can create/delete projects, tasks, manage members
- **Member**: Can view projects, tasks, update task status

## Deployment

The app is deployed on Railway:
- Backend: https://team-task-manager-backend-production.up.railway.app
- Frontend: https://team-task-manager-frontend-production.up.railway.app

## License

MIT
