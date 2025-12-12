export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" })
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({ field: "password", message: "Password must contain at least one uppercase letter" })
  }

  if (!/[a-z]/.test(password)) {
    errors.push({ field: "password", message: "Password must contain at least one lowercase letter" })
  }

  if (!/[0-9]/.test(password)) {
    errors.push({ field: "password", message: "Password must contain at least one number" })
  }

  return errors
}

export function validateSignup(name: string, email: string, password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!name || name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters long" })
  }

  if (!email || !validateEmail(email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  errors.push(...validatePassword(password))

  return errors
}

export function validateTask(title: string, status?: string, priority?: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!title || title.trim().length < 3) {
    errors.push({ field: "title", message: "Title must be at least 3 characters long" })
  }

  if (status && !["pending", "in-progress", "completed"].includes(status)) {
    errors.push({ field: "status", message: "Invalid status value" })
  }

  if (priority && !["low", "medium", "high"].includes(priority)) {
    errors.push({ field: "priority", message: "Invalid priority value" })
  }

  return errors
}
