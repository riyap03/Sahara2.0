# Ghar Ka Backup — Matching Engine

## Overview

The matching engine is the core USP of the Ghar Ka Backup system. It automatically matches senior service requests with the most suitable trusted helpers based on multiple factors.

## Architecture

```
Task Created (Senior needs help)
        ↓
Matching Engine
        ↓
Score Candidates
   ├── Skill Match (40%)
   ├── Trust Score (25%)
   ├── Availability (20%)
   └── Distance (15%)
        ↓
Ranked Results
   ├── Primary (Highest Score)
   ├── Backup #1 (Second Highest)
   └── Backup #2 (Third Highest)
        ↓
Notify Primary
        ↓
If Rejected → Activate Backup Chain
   ├── Backup #1 becomes Primary
   ├── Backup #2 becomes Backup #1
   └── If all exhausted → ESCALATE
```

## Scoring Weights

| Factor | Weight | Description |
|--------|--------|-------------|
| Skill Match | 40% | Exact skill match = 100%, partial match = 70%, category match = 50% |
| Trust Score | 25% | Direct trust score from senior's trusted network (0-100) |
| Availability | 20% | Available = 100, Busy = 40, Offline = 0 |
| Distance | 15% | Within service radius, closer = higher score |

## Backup Chain Logic

1. **Primary assigned** — System notifies the highest-scored helper
2. **Primary rejects** — Backup #1 automatically promoted to Primary
3. **Backup #1 rejects** — Backup #2 promoted to Primary
4. **All backups exhausted** — Task status → `escalated`, family notified

## API Endpoints

### Find Matches for Task
```bash
POST /api/matching/task/:taskId/find
```

### Accept Task
```bash
POST /api/matching/task/:taskId/accept
Body: { "helperId": "<helper-object-id>" }
```

### Reject Task (Triggers Backup Chain)
```bash
POST /api/matching/task/:taskId/reject
Body: { "helperId": "<helper-object-id>" }
```

### Get Task Matches
```bash
GET /api/matching/task/:taskId
```

## Response Format

```json
{
  "success": true,
  "data": {
    "taskId": "...",
    "status": "searching",
    "matches": {
      "primary": {
        "helperId": "...",
        "name": "Rajesh Plumber",
        "service": "Plumbing",
        "skills": ["plumber", "pipe", "water"],
        "trustScore": 85,
        "availability": "available",
        "distance": 0.15,
        "distanceCategory": "near",
        "skillScore": 100,
        "availabilityScore": 100,
        "distanceScore": 99,
        "compositeScore": 96
      },
      "backup1": { ... },
      "backup2": null
    },
    "totalCandidates": 3
  }
}
```

## Models

### User
- Role: `senior`, `family`, `helper`, `admin`
- Address with coordinates for distance calculation
- Emergency contact for family

### Task
- Category: home-repair, medicine, doctor, travel, essentials, emergency, other
- Required skill, priority, status
- Matching candidates array with scores
- OTP verification, check-in/out
- Escalation level tracking

### HelperProfile
- Skills array
- Trust score (0-100)
- Availability status and working hours
- Location with coordinates
- Service radius (default 10km)
- Completed/cancelled tasks count
- Response rate

### TrustedPerson
- Senior's trusted network
- Skills, availability, trust score
- Approved/verified status
- Linked to User via userId

## Running Tests

```bash
cd server
npm test
```

## Seeding Sample Data

```bash
cd server
npm run seed
```
