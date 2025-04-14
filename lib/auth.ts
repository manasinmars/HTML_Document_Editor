// Types for our authentication system
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  role: "user" | "admin"
  isActive?: boolean
  lastActive?: string
  currentFile?: string
}

export interface UserWithPassword extends User {
  password: string
}

// Get all users from localStorage
export const getUsers = (): UserWithPassword[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("users") || "[]")
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin"
}

// Add a function to get user's file content
export const getUserFileContent = (userId: string): string => {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(`savedHtml_${userId}`) || ""
}

// Update the getActiveUsers function to include file content
export const getActiveUsers = (): User[] => {
  const users = getUsers()
  const activeUsers: User[] = []

  users.forEach((user) => {
    const activeUser = localStorage.getItem(`userActivity_${user.id}`)
    if (activeUser) {
      const parsedUser = JSON.parse(activeUser)
      if (parsedUser.isActive) {
        activeUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          isActive: true,
          lastActive: parsedUser.lastActive,
          currentFile: parsedUser.currentFile,
          fileContent: getUserFileContent(user.id),
        })
      }
    }
  })

  return activeUsers
}

// Update user activity
export const updateUserActivity = (userId: string, isActive: boolean, currentFile?: string) => {
  if (typeof window === "undefined") return

  localStorage.setItem(
    `userActivity_${userId}`,
    JSON.stringify({
      isActive,
      lastActive: new Date().toISOString(),
      currentFile: currentFile || "Untitled",
    }),
  )
}

// Initialize admin user if not exists
export const initializeAdmin = () => {
  if (typeof window === "undefined") return

  const users = getUsers()
  const adminExists = users.some((user) => user.role === "admin")

  if (!adminExists) {
    const adminUser: UserWithPassword = {
      id: "admin-" + Date.now().toString(),
      name: "Administrator",
      email: "admin@example.com",
      password: "admin123", // In a real app, this should be hashed
      role: "admin",
      createdAt: new Date().toISOString(),
    }

    users.push(adminUser)
    localStorage.setItem("users", JSON.stringify(users))
    console.log("Admin user created:", adminUser.email)
  }
}
