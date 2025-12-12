"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  LogOut,
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react"

interface Task {
  id: number
  title: string
  description: string | null
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  useEffect(() => {
    fetchProfile()
    fetchTasks()
  }, [])

  useEffect(() => {
    let filtered = [...tasks]

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Fetch profile error:", error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()

      if (response.ok) {
        setTasks(data.tasks)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleCreateTask = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setTaskForm({ title: "", description: "", status: "pending", priority: "medium" })
        fetchTasks()
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (error) {
      setError("Failed to create task")
    }
  }

  const handleUpdateTask = async () => {
    if (!selectedTask) return

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setSelectedTask(null)
        setTaskForm({ title: "", description: "", status: "pending", priority: "medium" })
        fetchTasks()
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (error) {
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setSelectedTask(null)
        fetchTasks()
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (error) {
      setError("Failed to delete task")
    }
  }

  const openEditDialog = (task: Task) => {
    setSelectedTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task)
    setIsDeleteDialogOpen(true)
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
      default:
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
      case "medium":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30"
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/50">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto absolute inset-0 m-auto" />
          </div>
          <p className="text-muted-foreground font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TaskFlow Pro
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Professional Task Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="relative">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <span className="font-bold text-white text-lg">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl shadow-md hover:shadow-lg transition-all border-2 hover:border-red-200 dark:hover:border-red-900 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6 shadow-xl rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all group rounded-2xl">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.total}
                </span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Total Tasks</p>
              <p className="text-xs text-muted-foreground mt-1">{completionRate}% completed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all group rounded-2xl">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  {stats.completed}
                </span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Completed</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Great progress!
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all group rounded-2xl">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {stats.inProgress}
                </span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">In Progress</p>
              <p className="text-xs text-muted-foreground mt-1">Active tasks</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all group rounded-2xl">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-br from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  {stats.pending}
                </span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Pending</p>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 shadow-2xl border-2 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-bl-full" />
          <CardContent className="pt-6 pb-6 relative">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-white dark:bg-slate-800 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-md text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2 shadow-md text-base font-medium">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2 shadow-md text-base font-medium">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  size="lg"
                  className="h-12 rounded-xl shadow-xl shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 whitespace-nowrap font-semibold px-6"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredTasks.length === 0 ? (
          <Card className="shadow-2xl border-2 rounded-2xl overflow-hidden">
            <CardContent className="py-24 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30" />
                <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Clock className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                No tasks found
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed text-lg">
                {tasks.length === 0
                  ? "Start your productivity journey by creating your first task"
                  : "Try adjusting your search or filter settings"}
              </p>
              {tasks.length === 0 && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  size="lg"
                  className="h-14 rounded-xl shadow-2xl shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 text-base font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-2 overflow-hidden relative rounded-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:scale-[1.01]"
              >
                <div
                  className={`absolute top-0 left-0 h-full w-2 ${
                    task.priority === "high"
                      ? "bg-gradient-to-b from-red-500 via-red-600 to-orange-500"
                      : task.priority === "medium"
                        ? "bg-gradient-to-b from-orange-500 via-orange-600 to-yellow-500"
                        : "bg-gradient-to-b from-blue-500 via-blue-600 to-cyan-500"
                  }`}
                />

                <CardContent className="pt-7 pb-7 pl-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <h3 className="font-bold text-2xl text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {task.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(task.status)} px-4 py-1.5 font-semibold shadow-lg rounded-lg text-xs uppercase tracking-wide`}
                        >
                          <span className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(task.priority)} px-4 py-1.5 font-semibold shadow-lg rounded-lg text-xs uppercase tracking-wide`}
                        >
                          {task.priority} Priority
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-muted-foreground mb-5 leading-relaxed text-base">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg w-fit">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          Created{" "}
                          {new Date(task.created_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(task)}
                        className="h-11 w-11 rounded-xl shadow-lg hover:shadow-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(task)}
                        className="h-11 w-11 rounded-xl shadow-lg hover:shadow-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="rounded-2xl border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Task</DialogTitle>
            <DialogDescription className="text-base">Add a new task to boost your productivity</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold">
                Task Title
              </label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="h-11 rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Add task details..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="rounded-xl border-2 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value: Task["status"]) => setTaskForm({ ...taskForm, status: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Priority</label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value: Task["priority"]) => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl border-2">
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!taskForm.title.trim()}
              className="rounded-xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
            <DialogDescription className="text-base">Update your task details</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-semibold">
                Task Title
              </label>
              <Input
                id="edit-title"
                placeholder="Enter task title..."
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="h-11 rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-semibold">
                Description
              </label>
              <Textarea
                id="edit-description"
                placeholder="Add task details..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="rounded-xl border-2 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value: Task["status"]) => setTaskForm({ ...taskForm, status: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Priority</label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value: Task["priority"]) => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-2">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTask}
              disabled={!taskForm.title.trim()}
              className="rounded-xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Update Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Delete Task</DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl border-2">
              Cancel
            </Button>
            <Button onClick={handleDeleteTask} variant="destructive" className="rounded-xl shadow-lg">
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
