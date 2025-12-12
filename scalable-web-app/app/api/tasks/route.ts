import { type NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { validateTask } from "@/lib/validations"

// GET /api/tasks - Get all tasks for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    // Build query with filters
    const query = sql`
      SELECT id, title, description, status, priority, created_at, updated_at
      FROM tasks
      WHERE user_id = ${payload.userId}
    `

    // Apply filters dynamically
    const conditions = []
    const params = []

    if (search) {
      conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    if (status) {
      conditions.push(`status = $${params.length + 1}`)
      params.push(status)
    }

    if (priority) {
      conditions.push(`priority = $${params.length + 1}`)
      params.push(priority)
    }

    // Execute query with filters
    const tasks = await sql`
      SELECT id, title, description, status, priority, created_at, updated_at
      FROM tasks
      WHERE user_id = ${payload.userId}
        ${search ? sql`AND (title ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})` : sql``}
        ${status ? sql`AND status = ${status}` : sql``}
        ${priority ? sql`AND priority = ${priority}` : sql``}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("[v0] Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status = "pending", priority = "medium" } = body

    // Validation
    const validationErrors = validateTask(title, status, priority)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    // Create task
    const result = await sql`
      INSERT INTO tasks (user_id, title, description, status, priority)
      VALUES (${payload.userId}, ${title}, ${description || null}, ${status}, ${priority})
      RETURNING id, title, description, status, priority, created_at, updated_at
    `

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: result[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
