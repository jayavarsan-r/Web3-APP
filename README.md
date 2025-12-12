# Task Manager - Full-Stack Web Application

A production-ready, scalable task management application built with Next.js 16, featuring JWT authentication, CRUD operations, and a modern UI.

## Features

### Authentication
- Secure signup and login with JWT tokens
- Password hashing with bcrypt
- HTTP-only cookies for token storage
- Protected routes with middleware
- Auto-redirect based on auth state

### Dashboard
- User profile management
- Full CRUD operations for tasks
- Real-time search and filtering
- Status tracking (pending, in-progress, completed)
- Priority levels (low, medium, high)
- Responsive, modern UI with TailwindCSS

### Security
- JWT-based authentication
- bcrypt password hashing (10 rounds)
- HTTP-only cookies
- Input validation (client + server)
- SQL injection prevention
- CORS configuration
- Environment variable management

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - RESTful API
- **Neon Postgres** - Database
- **@neondatabase/serverless** - Database client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT generation/verification

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts       # User registration
│   │   │   ├── login/route.ts        # User login
│   │   │   └── logout/route.ts       # User logout
│   │   ├── profile/route.ts          # Get/update profile
│   │   └── tasks/
│   │       ├── route.ts              # List/create tasks
│   │       └── [id]/route.ts         # Get/update/delete task
│   ├── dashboard/page.tsx            # Protected dashboard
│   ├── login/page.tsx                # Login page
│   ├── signup/page.tsx               # Signup page
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   └── ui/                           # Reusable UI components
├── lib/
│   ├── auth.ts                       # Auth utilities
│   ├── db.ts                         # Database client
│   └── validations.ts                # Validation functions
├── scripts/
│   └── 001_create_tables.sql        # Database schema
├── middleware.ts                     # Route protection
└── package.json
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Neon Postgres database (already connected via Vercel)

### Environment Variables

The following environment variables are already configured in your Vercel project:

\`\`\`bash
DATABASE_URL=                 # Neon database connection string
POSTGRES_URL=                 # Alternative Neon connection string
JWT_SECRET=                   # Secret key for JWT (optional, defaults to development key)
\`\`\`

**Note:** In production, you should set a strong `JWT_SECRET` environment variable.

### Local Development

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd scalable-web-app
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Run database migrations**

The database tables will be created automatically when you run the SQL script:
- Navigate to the v0 interface
- Execute the script at `scripts/001_create_tables.sql`

Or manually create tables in your Neon dashboard using the SQL from that file.

4. **Start the development server**
\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser**
\`\`\`
http://localhost:3000
\`\`\`

## API Documentation

### Base URL
\`\`\`
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
\`\`\`

### Authentication Endpoints

#### POST /auth/signup
Create a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
\`\`\`

**Validation Rules:**
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 8 characters, must contain uppercase, lowercase, and numbers

---

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
\`\`\`

**Note:** JWT token is set as HTTP-only cookie (`auth_token`)

---

#### POST /auth/logout
Logout the current user.

**Response (200):**
\`\`\`json
{
  "message": "Logout successful"
}
\`\`\`

---

### Profile Endpoints

#### GET /profile
Get the authenticated user's profile.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
\`\`\`

---

#### PUT /profile
Update the authenticated user's profile.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
\`\`\`

---

### Task Endpoints

#### GET /tasks
Get all tasks for the authenticated user with optional filtering.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Query Parameters:**
- `search` (optional): Search in title and description
- `status` (optional): Filter by status (pending, in-progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)

**Example:**
\`\`\`
GET /api/tasks?search=meeting&status=pending&priority=high
\`\`\`

**Response (200):**
\`\`\`json
{
  "tasks": [
    {
      "id": 1,
      "title": "Team meeting",
      "description": "Discuss Q1 goals",
      "status": "pending",
      "priority": "high",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

---

#### POST /tasks
Create a new task.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "in-progress",
  "priority": "high"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Task created successfully",
  "task": {
    "id": 2,
    "title": "Complete project",
    "description": "Finish the task manager app",
    "status": "in-progress",
    "priority": "high",
    "created_at": "2025-01-15T14:00:00Z",
    "updated_at": "2025-01-15T14:00:00Z"
  }
}
\`\`\`

---

#### GET /tasks/:id
Get a specific task by ID.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "task": {
    "id": 1,
    "title": "Team meeting",
    "description": "Discuss Q1 goals",
    "status": "pending",
    "priority": "high",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
\`\`\`

---

#### PUT /tasks/:id
Update a specific task.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "priority": "medium",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T15:00:00Z"
  }
}
\`\`\`

---

#### DELETE /tasks/:id
Delete a specific task.

**Headers:**
\`\`\`
Cookie: auth_token=<jwt_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Task deleted successfully"
}
\`\`\`

---

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
\`\`\`json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
\`\`\`

**401 Unauthorized:**
\`\`\`json
{
  "error": "Unauthorized"
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
  "error": "Task not found"
}
\`\`\`

**409 Conflict:**
\`\`\`json
{
  "error": "User with this email already exists"
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

## Database Schema

### users table
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### tasks table
\`\`\`sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- The Neon integration is already connected
- Add environment variables (if needed)
- Deploy

3. **Environment Variables**

Add these in Vercel dashboard (Settings → Environment Variables):
- `DATABASE_URL` - Already set via Neon integration
- `JWT_SECRET` - Your secret key for production

4. **Run Database Migrations**

After deployment, run the SQL script in your Neon dashboard or via the v0 interface.

## Scalability Considerations

### Current Architecture
- **Serverless Functions**: Each API route runs as a serverless function
- **Connection Pooling**: Neon provides built-in connection pooling
- **Stateless Authentication**: JWT tokens enable horizontal scaling

### Scaling to Production

#### 1. Database Optimization
- **Indexing**: Already implemented on user_id, status, and email
- **Connection Pooling**: Use Neon's pooled connection string
- **Read Replicas**: Add read replicas for heavy read workloads
- **Caching**: Implement Redis for session caching

\`\`\`typescript
// Example Redis caching
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

// Cache user profile
await redis.set(`user:${userId}`, JSON.stringify(user), { ex: 3600 })
\`\`\`

#### 2. API Rate Limiting
Implement rate limiting to prevent abuse:

\`\`\`typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

const { success } = await ratelimit.limit(identifier)
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
\`\`\`

#### 3. CDN & Edge Caching
- Deploy static assets to Vercel Edge Network
- Use Edge Functions for auth middleware
- Implement ISR (Incremental Static Regeneration) for public pages

#### 4. Monitoring & Logging
Implement comprehensive monitoring:

\`\`\`typescript
// Example: Vercel Analytics
import { Analytics } from '@vercel/analytics/react'

// Example: Error tracking
try {
  // ... operation
} catch (error) {
  console.error('[Error]', { 
    operation: 'createTask',
    userId,
    error: error.message,
    timestamp: new Date().toISOString()
  })
  // Send to error tracking service (Sentry, etc.)
}
\`\`\`

#### 5. Microservices Migration Path

When scaling beyond serverless:

\`\`\`
Current: Monolithic Next.js App
         ↓
Step 1: Separate API & Frontend
        - API: api.yourdomain.com
        - Frontend: app.yourdomain.com
         ↓
Step 2: Extract Services
        - Auth Service (auth.yourdomain.com)
        - Task Service (tasks.yourdomain.com)
        - User Service (users.yourdomain.com)
         ↓
Step 3: Add Message Queue
        - Use Vercel Queue or external (RabbitMQ, Kafka)
        - Event-driven architecture
         ↓
Step 4: Container Orchestration
        - Docker containers
        - Kubernetes cluster
        - Load balancing
\`\`\`

#### 6. Docker Configuration

\`\`\`dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
\`\`\`

#### 7. CI/CD Pipeline

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
\`\`\`

#### 8. Load Balancing Strategy
- Use Vercel's automatic load balancing
- For custom setup: Nginx or AWS ALB
- Health checks on `/api/health`
- Circuit breakers for external services

#### 9. Database Scaling
\`\`\`
Current: Single Neon Postgres
         ↓
Scale: Primary + Read Replicas
       - Primary: Writes
       - Replicas: Reads
         ↓
Advanced: Sharding
          - Shard by user_id
          - Consistent hashing
\`\`\`

## Security Best Practices

1. **Authentication**
   - JWT tokens with 7-day expiration
   - HTTP-only cookies prevent XSS
   - Bcrypt hashing with salt rounds

2. **Input Validation**
   - Client-side validation for UX
   - Server-side validation for security
   - SQL parameterized queries

3. **CORS Configuration**
   - Restrict origins in production
   - Credentials allowed for cookies

4. **Environment Variables**
   - Never commit secrets to Git
   - Use Vercel's environment variables
   - Rotate JWT secret regularly

## Testing

### Run Tests
\`\`\`bash
npm test
\`\`\`

### Test Coverage
- Unit tests for validation functions
- Integration tests for API routes
- E2E tests with Playwright

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your portfolio or learning!

## Support

For issues or questions:
- Open a GitHub issue
- Email: your-email@example.com

## Author

Built as a Frontend Developer Intern assignment demonstrating full-stack development skills with modern web technologies.
