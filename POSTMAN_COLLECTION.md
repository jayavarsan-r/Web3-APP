# Postman Collection - Task Manager API

## Setup

1. **Import into Postman**
   - Click "Import" in Postman
   - Select "Raw Text"
   - Copy the JSON collection below

2. **Set Variables**
   - Create environment in Postman
   - Add variable: `BASE_URL` = `http://localhost:3000` (dev) or your production URL

## Collection JSON

\`\`\`json
{
  "info": {
    "name": "Task Manager API",
    "description": "Full-stack task management application with JWT authentication",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:3000",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/auth/signup",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "signup"]
            }
          },
          "response": []
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/auth/login",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "login"]
            }
          },
          "response": []
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{BASE_URL}}/api/auth/logout",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "logout"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Profile",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/api/profile",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "profile"]
            }
          },
          "response": []
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Smith\",\n  \"email\": \"john.smith@example.com\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/profile",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "profile"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/api/tasks",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "tasks"]
            }
          },
          "response": []
        },
        {
          "name": "Get Tasks with Filters",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/api/tasks?search=meeting&status=pending&priority=high",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "tasks"],
              "query": [
                {
                  "key": "search",
                  "value": "meeting"
                },
                {
                  "key": "status",
                  "value": "pending"
                },
                {
                  "key": "priority",
                  "value": "high"
                }
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Complete project\",\n  \"description\": \"Finish the task manager app\",\n  \"status\": \"in-progress\",\n  \"priority\": \"high\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/tasks",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "tasks"]
            }
          },
          "response": []
        },
        {
          "name": "Get Task by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{BASE_URL}}/api/tasks/1",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "tasks", "1"]
            }
          },
          "response": []
        },
        {
          "name": "Update Task",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated title\",\n  \"description\": \"Updated description\",\n  \"status\": \"completed\",\n  \"priority\": \"medium\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/api/tasks/1",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "tasks", "1"]
            }
          },
          "response": []
        },
        {
          "name": "Delete Task",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{BASE_URL}}/api/tasks/1",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "tasks", "1"]
            }
          },
          "response": []
        }
      ]
    }
  ]
}
\`\`\`

## Testing Flow

### 1. Create an Account
\`\`\`
POST /api/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123"
}
\`\`\`

### 2. Login
\`\`\`
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "TestPass123"
}
\`\`\`
**Note:** Cookie `auth_token` is automatically set

### 3. Get Profile
\`\`\`
GET /api/profile
\`\`\`

### 4. Create Tasks
\`\`\`
POST /api/tasks
{
  "title": "My First Task",
  "description": "This is a test task",
  "status": "pending",
  "priority": "high"
}
\`\`\`

### 5. Get All Tasks
\`\`\`
GET /api/tasks
\`\`\`

### 6. Filter Tasks
\`\`\`
GET /api/tasks?status=pending&priority=high
\`\`\`

### 7. Update Task
\`\`\`
PUT /api/tasks/1
{
  "status": "completed"
}
\`\`\`

### 8. Delete Task
\`\`\`
DELETE /api/tasks/1
\`\`\`

### 9. Logout
\`\`\`
POST /api/auth/logout
\`\`\`

## Response Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized |
| 404  | Not Found |
| 409  | Conflict (duplicate email) |
| 500  | Internal Server Error |
