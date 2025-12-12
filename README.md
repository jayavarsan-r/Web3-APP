# 📋 Task Manager - Full-Stack Web Application

> A production-ready, scalable task management application built with Next.js 16, featuring JWT authentication, CRUD operations, and a modern UI.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)

---

## ✨ Features

### 🔐 Authentication
- Secure signup and login with JWT tokens
- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies for token storage
- Protected routes with middleware
- Auto-redirect based on auth state

### 📊 Dashboard
- User profile management
- Full CRUD operations for tasks
- Real-time search and filtering
- Status tracking (pending, in-progress, completed)
- Priority levels (low, medium, high)
- Responsive, modern UI with TailwindCSS

### 🔒 Security
- JWT-based authentication
- bcrypt password hashing
- HTTP-only cookies
- Input validation (client + server)
- SQL injection prevention
- CORS configuration
- Environment variable management

---

## 🛠️ Tech Stack

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

---

## 📁 Project Structure
```
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
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Neon Postgres database account

### Environment Variables

Create a `.env.local` file in the root directory:
```bash
DATABASE_URL=your_neon_database_url
POSTGRES_URL=your_neon_postgres_url
JWT_SECRET=your_secret_key_here
```

> **⚠️ Important:** In production, always use a strong `JWT_SECRET` environment variable.

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Run database migrations**

Execute the SQL script at `scripts/001_create_tables.sql` in your Neon dashboard or via pgAdmin.

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

### Authentication Endpoints

#### `POST /auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

**Validation Rules:**
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 8 characters, must contain uppercase, lowercase, and numbers

---

#### `POST /auth/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

> **Note:** JWT token is set as HTTP-only cookie (`auth_token`)

---

#### `POST /auth/logout`
Logout the current user.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### Profile Endpoints

#### `GET /profile`
Get the authenticated user's profile.

**Headers:**
```
Cookie: auth_token=<jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### `PUT /profile`
Update the authenticated user's profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200):**
```json
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
```

---

### Task Endpoints

#### `GET /tasks`
Get all tasks for the authenticated user with optional filtering.

**Query Parameters:**
- `search` (optional): Search in title and description
- `status` (optional): Filter by status (pending, in-progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)

**Example:**
```
GET /api/tasks?search=meeting&status=pending&priority=high
```

**Response (200):**
```json
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
```

---

#### `POST /tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "in-progress",
  "priority": "high"
}
```

**Response (201):**
```json
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
```

---

#### `GET /tasks/:id`
Get a specific task by ID.

**Response (200):**
```json
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
```

---

#### `PUT /tasks/:id`
Update a specific task.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium"
}
```

**Response (200):**
```json
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
```

---

#### `DELETE /tasks/:id`
Delete a specific task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

### Error Responses

All endpoints may return the following error responses:

| Status Code | Description | Example Response |
|------------|-------------|------------------|
| 400 | Bad Request | `{"error": "Validation failed", "errors": [...]}` |
| 401 | Unauthorized | `{"error": "Unauthorized"}` |
| 404 | Not Found | `{"error": "Task not found"}` |
| 409 | Conflict | `{"error": "User with this email already exists"}` |
| 500 | Internal Server Error | `{"error": "Internal server error"}` |

---

## 💾 Database Schema

### users table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### tasks table
```sql
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
```

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Connect Neon database via integration
   - Add environment variables
   - Deploy

3. **Environment Variables**

Add these in Vercel dashboard (Settings → Environment Variables):
- `DATABASE_URL` - Your Neon database URL
- `POSTGRES_URL` - Your Neon Postgres URL
- `JWT_SECRET` - Your secret key for production

4. **Run Database Migrations**

After deployment, execute the SQL script in your Neon dashboard.

---

## 📈 Scalability Considerations

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
```typescript
// Example Redis caching
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

// Cache user profile
await redis.set(`user:${userId}`, JSON.stringify(user), { ex: 3600 })
```

#### 2. API Rate Limiting
Implement rate limiting to prevent abuse:
```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

const { success } = await ratelimit.limit(identifier)
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

#### 3. CDN & Edge Caching
- Deploy static assets to Vercel Edge Network
- Use Edge Functions for auth middleware
- Implement ISR (Incremental Static Regeneration) for public pages

#### 4. Monitoring & Logging
Implement comprehensive monitoring:
```typescript
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
```

#### 5. Microservices Migration Path
```
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
```

#### 6. Docker Configuration
```dockerfile
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
```

#### 7. CI/CD Pipeline
```yaml
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
```

#### 8. Database Scaling
```
Current: Single Neon Postgres
         ↓
Scale: Primary + Read Replicas
       - Primary: Writes
       - Replicas: Reads
         ↓
Advanced: Sharding
          - Shard by user_id
          - Consistent hashing
```

---

## 🔒 Security Best Practices

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

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Unit tests for validation functions
- Integration tests for API routes
- E2E tests with Playwright

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**

- GitHub: [@jayavarsan-r](https://github.com/jayavarsan-r)
- LinkedIn: [Jayavarsan R](https://linkedin.com/in/jayavarsan/)
- Email: jayavarsanr@gmail.com

---

## 🙏 Acknowledgments

- Built as a Frontend Developer Intern assignment
- Demonstrates full-stack development skills with modern web technologies
- Special thanks to the Next.js and React communities

---

## 📞 Support

For issues or questions:
- 📧 Email: jayavarsanr@gmail.com
- 🐛 [Open an issue](https://github.com/yourusername/task-manager/issues)
- 💬 [Discussions](https://github.com/yourusername/task-manager/discussions)

---

<div align="center">
  <p>Made with ❤️ by Your Jayavarsan</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
