# Ghar Ka Backup — Backend API

**Tagline:** Don't monitor seniors. Build a backup around them.

## Project Overview

Ghar Ka Backup is a hyper-local trusted support network for elderly people living independently. It connects seniors with trusted helpers through a priority-based backup chain.

## Architecture

```
Server Entry: server.js
    ↓
Express App: src/app.js
    ↓
Routes → Controllers → Services → Models → MongoDB
```

## Folder Structure

```
server/
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── TrustedContact.js
│   │   ├── ServiceProvider.js
│   │   ├── HelpRequest.js
│   │   ├── Task.js
│   │   ├── Notification.js
│   │   └── EmergencyContact.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── trustedCircle.controller.js
│   │   ├── provider.controller.js
│   │   ├── request.controller.js
│   │   ├── task.controller.js
│   │   ├── emergency.controller.js
│   │   ├── notification.controller.js
│   │   └── family.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── trustedCircle.routes.js
│   │   ├── provider.routes.js
│   │   ├── request.routes.js
│   │   ├── task.routes.js
│   │   ├── emergency.routes.js
│   │   ├── family.routes.js
│   │   └── notification.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   └── role.middleware.js
│   ├── services/
│   │   ├── matching.service.js
│   │   ├── backupChain.service.js
│   │   ├── notification.service.js
│   │   ├── escalation.service.js
│   │   └── ai.service.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── request.validator.js
│   │   └── provider.validator.js
│   └── utils/
│       ├── generateOtp.js
│       ├── generateToken.js
│       └── distance.js
├── seed.js
└── test-matching.js
```

## Installation

```bash
cd server
npm install
```

## Environment Setup

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ghar-ka-backup
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
```

## MongoDB Setup

Ensure MongoDB is running locally or update `MONGO_URI` in `.env` for your MongoDB Atlas connection.

```bash
# Local MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Running the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Seeding Database

```bash
npm run seed
```

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get own profile |
| PUT | `/api/users/me` | Update own profile |

### Trusted Circle

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trusted-circle` | Add trusted contact |
| GET | `/api/trusted-circle` | Get trusted contacts |
| PUT | `/api/trusted-circle/:id` | Update trusted contact |
| DELETE | `/api/trusted-circle/:id` | Remove trusted contact |

### Service Providers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/providers` | Create provider profile |
| GET | `/api/providers` | Get all providers |
| GET | `/api/providers/:id` | Get provider by ID |
| PUT | `/api/providers/:id` | Update provider profile |
| PATCH | `/api/providers/availability` | Update availability |

### Help Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Create help request |
| GET | `/api/requests/my` | Get my requests |
| GET | `/api/requests/:id` | Get request by ID |
| PATCH | `/api/requests/:id` | Update request |
| PATCH | `/api/requests/:id/cancel` | Cancel request |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/my` | Get my tasks |
| POST | `/api/tasks/:id/accept` | Accept task |
| POST | `/api/tasks/:id/reject` | Reject task |
| POST | `/api/tasks/:id/verify-otp` | Verify OTP |
| POST | `/api/tasks/:id/check-in` | Check in |
| POST | `/api/tasks/:id/check-out` | Check out |
| POST | `/api/tasks/:id/complete` | Complete task |

### Emergency

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emergency` | Trigger emergency |

### Family Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/family/senior/:seniorId` | Get senior info |
| GET | `/api/family/senior/:seniorId/requests` | Get senior requests |
| GET | `/api/family/senior/:seniorId/tasks` | Get senior tasks |
| GET | `/api/family/senior/:seniorId/notifications` | Get senior notifications |
| POST | `/api/family/senior/:seniorId/connect` | Connect with senior |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get my notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## Authentication Flow

1. Register with `POST /api/auth/register`
2. Login with `POST /api/auth/login` to get JWT token
3. Include token in `Authorization: Bearer <token>` header for protected routes

## Backup Chain Flow

```
Senior creates request
       ↓
AI/rule-based intent detection
       ↓
Create Help Request
       ↓
Backup Chain starts
       ↓
Level 1 → Trusted Circle
       ↓ (if no suitable person)
Level 2 → Community
       ↓ (if no suitable person)
Level 3 → Verified Providers
       ↓
Task created + OTP generated
       ↓
Provider accepts
       ↓
Provider arrives
       ↓
OTP verification → Check-in
       ↓
Task IN_PROGRESS
       ↓
Provider finishes → Check-out
       ↓
Task COMPLETED
       ↓
Senior + Family notified
```

## Matching Algorithm

Scoring weights:
- Trust Score: 40%
- Distance: 25%
- Availability: 15%
- Rating: 10%
- Task History: 10%

## Example API Requests

### Register Senior

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Sharma",
    "email": "rajesh@example.com",
    "phone": "+919876543210",
    "password": "password123",
    "role": "senior",
    "language": "Hindi",
    "address": {
      "street": "12, Malviya Nagar",
      "city": "Jaipur",
      "state": "Rajasthan",
      "pincode": "302017"
    },
    "location": { "lat": 26.9124, "lng": 75.7873 }
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "password123"
  }'
```

### Create Help Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "plumbing",
    "description": "Mera pump kharab ho gaya hai",
    "priority": "normal",
    "location": { "lat": 26.9124, "lng": 75.7873 }
  }'
```

### Trigger Emergency

```bash
curl -X POST http://localhost:5000/api/emergency \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "description": "Mere husband achanak gir gaye hain",
    "location": { "lat": 26.9124, "lng": 75.7873 }
  }'
```

## Running Tests

```bash
npm test
```

## Postman Testing Sequence

1. Register a senior user
2. Login and copy JWT token
3. Add trusted contacts (POST `/api/trusted-circle`)
4. Create a help request (POST `/api/requests`)
5. Check request status (GET `/api/requests/my`)
6. Accept task (POST `/api/tasks/:id/accept`)
7. Verify OTP (POST `/api/tasks/:id/verify-otp`)
8. Complete task (POST `/api/tasks/:id/complete`)
9. Trigger emergency (POST `/api/emergency`)

## Future Integrations

- OpenAI API for advanced AI intent detection
- Google Maps / Geolocation for distance calculation
- Firebase for push notifications
- Twilio/MSG91 for OTP/SMS
- Government/emergency integrations

## User Roles

- `senior` — Can create requests, manage trusted circle, verify OTP
- `family` — Can view senior activity, receive alerts
- `provider` — Can create profile, accept tasks
- `volunteer` — Can register, accept community requests
- `admin` — Can verify users, monitor system
