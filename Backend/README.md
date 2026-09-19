# SafeRoute Backend API

A Node.js, Express, and MongoDB backend application providing authentication, user profiles, emergency contacts, and incident reporting for the SafeRoute Dhaka Night Commute platform.

## Architecture

This project follows the 4-part modular structure:
1. **Part 1: Server Setup & CRUD Operations** - Express server, middleware, CORS, and standard REST endpoints.
2. **Part 2: Route Separation & MVC Pattern** - Modular architecture with `routes/`, `controllers/`, `models/`, `middleware/`, and `config/`.
3. **Part 3: MongoDB Database Integration** - Mongoose schemas, connections, and full database CRUD operations.
4. **Part 4: Authentication System** - Secure login and registration supporting email or phone, password hashing with `bcryptjs`, and stateless authentication with JWT (`jsonwebtoken`).

## Directory Structure

```
Backend/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   ├── authController.js     # Register, Login (email/phone), Logout, Current User
│   ├── reportController.js   # Incident report CRUD operations
│   └── userController.js     # Profile and emergency contact management
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token authentication & route protection
│   └── errorMiddleware.js    # Centralized error and 404 handler
├── models/
│   ├── User.js               # User schema with bcrypt password hashing & validation
│   ├── IncidentReport.js     # SafeRoute community reports schema
│   └── EmergencyContact.js   # Emergency contacts schema
├── routes/
│   ├── authRoutes.js         # /api/auth (register, login, logout, me)
│   ├── reportRoutes.js       # /api/reports (CRUD for safety reports)
│   └── userRoutes.js         # /api/users (user profile & contacts)
├── .env.example              # Environment variables template
├── .env                      # Active environment configuration
├── package.json              # Dependencies and scripts
└── server.js                 # Express application entry point
```

## Getting Started

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already done by default):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/saferoute
JWT_SECRET=saferoute_super_secret_jwt_key_2026_dhaka_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*Note: If using MongoDB Atlas, replace `MONGO_URI` with your connection string.*

### 3. Run the Server
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

---

## API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register with name, email/phone, password |
| `POST` | `/api/auth/login` | Public | Login with email OR phone and password |
| `POST` | `/api/auth/logout` | Public | Clear auth cookie |
| `GET` | `/api/auth/me` | Private | Get profile of logged-in user (requires Bearer token) |

#### Example: Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Tanvir Ahmed",
  "email": "tanvir@saferoute.bd",
  "phone": "+8801712345678",
  "password": "Password123"
}
```

#### Example: Login (Email or Phone)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "tanvir@saferoute.bd",
  "password": "Password123"
}
```
Or with phone:
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+8801712345678",
  "password": "Password123"
}
```

---

### Incident Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports` | Public | Get all community hazard reports |
| `POST` | `/api/reports` | Public/Auth | Submit a new hazard report |
| `GET` | `/api/reports/:id` | Public | Get a single report by ID |
| `PUT` | `/api/reports/:id` | Public/Auth | Upvote or update a report |
| `DELETE` | `/api/reports/:id` | Private | Delete a report |

---

### User & Contacts (`/api/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Private | Get user profile |
| `PUT` | `/api/users/profile` | Private | Update user profile |
| `GET` | `/api/users/contacts` | Private | Get emergency contacts |
| `POST` | `/api/users/contacts` | Private | Add emergency contact |
| `DELETE` | `/api/users/contacts/:id` | Private | Delete emergency contact |

