import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export interface JWTPayload {
  userId: number
  email: string
  exp?: number
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

function base64urlEncode(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64urlDecode(str: string): string {
  // Add back padding
  str += "=".repeat((4 - (str.length % 4)) % 4)
  // Replace URL-safe characters
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  return Buffer.from(str, "base64").toString()
}

// This is edge-runtime compatible and works in the browser
export function generateToken(payload: JWTPayload): string {
  const exp = Date.now() + JWT_EXPIRES_IN
  const tokenPayload = { ...payload, exp }

  const payloadStr = JSON.stringify(tokenPayload)
  const payloadB64 = base64urlEncode(payloadStr)

  const signature = base64urlEncode(JWT_SECRET + payloadB64)

  return `${payloadB64}.${signature}`
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [payloadB64, signature] = token.split(".")

    if (!payloadB64 || !signature) {
      return null
    }

    // Verify signature
    const expectedSignature = base64urlEncode(JWT_SECRET + payloadB64)
    if (signature !== expectedSignature) {
      return null
    }

    // Decode payload
    const payloadStr = base64urlDecode(payloadB64)
    const payload = JSON.parse(payloadStr) as JWTPayload

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      return null
    }

    return payload
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return null
  }
}
