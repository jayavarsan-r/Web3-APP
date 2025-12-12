import { type NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { validateEmail } from "@/lib/validations"

// GET /api/profile - Get user profile
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

    // Fetch user profile
    const users = await sql`
      SELECT id, name, email, created_at, updated_at
      FROM users
      WHERE id = ${payload.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
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
    const { name, email } = body

    // Validation
    if (name && name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters long" }, { status: 400 })
    }

    if (email && !validateEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUsers = await sql`
        SELECT id FROM users WHERE email = ${email} AND id != ${payload.userId}
      `

      if (existingUsers.length > 0) {
        return NextResponse.json({ error: "Email is already taken" }, { status: 409 })
      }
    }

    // Update profile
    const result = await sql`
      UPDATE users
      SET 
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${payload.userId}
      RETURNING id, name, email, created_at, updated_at
    `

    return NextResponse.json({
      message: "Profile updated successfully",
      user: result[0],
    })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
