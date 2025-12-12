import { type NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { validateTask } from "@/lib/validations"

// GET /api/tasks/:id - Get a single task
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const taskId = Number.parseInt(params.id)
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const tasks = await sql`
      SELECT id, title, description, status, priority, created_at, updated_at
      FROM tasks
      WHERE id = ${taskId} AND user_id = ${payload.userId}
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task: tasks[0] })
  } catch (error) {
    console.error("[v0] Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/tasks/:id - Update a task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const taskId = Number.parseInt(params.id)
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, status, priority } = body

    // Validation
    if (title || status || priority) {
      const validationErrors = validateTask(title || "valid", status, priority)
      if (validationErrors.length > 0) {
        return NextResponse.json({ error: "Validation failed", errors: validationErrors }, { status: 400 })
      }
    }

    // Check if task exists and belongs to user
    const existingTasks = await sql`
      SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${payload.userId}
    `

    if (existingTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Update task
    const result = await sql`
      UPDATE tasks
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId} AND user_id = ${payload.userId}
      RETURNING id, title, description, status, priority, created_at, updated_at
    `

    return NextResponse.json({
      message: "Task updated successfully",
      task: result[0],
    })
  } catch (error) {
    console.error("[v0] Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const taskId = Number.parseInt(params.id)
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    // Delete task
    const result = await sql`
      DELETE FROM tasks
      WHERE id = ${taskId} AND user_id = ${payload.userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
