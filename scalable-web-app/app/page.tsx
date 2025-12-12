import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Shield, Zap, Lock, ArrowRight, Sparkles, LayoutGrid, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">TaskFlow</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log In
              </Link>
              <Button asChild size="sm" className="shadow-lg shadow-primary/20">
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        <div className="absolute top-20 right-20 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 h-96 w-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span>Modern Task Management</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance">
              Organize Your Work,
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Amplify Productivity
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of task management with powerful features, beautiful design, and
              enterprise-grade security. Built for teams that move fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="shadow-xl shadow-primary/30 text-base">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
                <Link href="/login">View Demo</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-16">
              <div className="p-4 rounded-2xl backdrop-blur-sm bg-card/50 border border-border/40">
                <div className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground mt-1">Active Users</div>
              </div>
              <div className="p-4 rounded-2xl backdrop-blur-sm bg-card/50 border border-border/40">
                <div className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Uptime</div>
              </div>
              <div className="p-4 rounded-2xl backdrop-blur-sm bg-card/50 border border-border/40">
                <div className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  50M+
                </div>
                <div className="text-sm text-muted-foreground mt-1">Tasks Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Everything You Need to Stay Organized</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Powerful features designed for modern teams and individuals who demand the best.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-2">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-8 pb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                  <Lock className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">Bank-Grade Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  JWT authentication, bcrypt encryption, and secure HTTP-only cookies protect your data 24/7.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 border-2">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-8 pb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
                  <LayoutGrid className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">Smart Organization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create, organize, and prioritize tasks with intuitive filters and real-time search capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-2">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-chart-3/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-8 pb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-chart-3 to-chart-3/80 flex items-center justify-center mb-6 shadow-lg shadow-chart-3/30">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built on Next.js 16 with optimized performance for instant loading and smooth interactions.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-chart-5/10 transition-all duration-300 border-2">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-chart-5/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-8 pb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-chart-5 to-chart-5/80 flex items-center justify-center mb-6 shadow-lg shadow-chart-5/30">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Complete CRUD</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Full Create, Read, Update, Delete operations with validation and error handling built-in.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-chart-4/10 transition-all duration-300 border-2">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-chart-4/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-8 pb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-chart-4 to-chart-4/80 flex items-center justify-center mb-6 shadow-lg shadow-chart-4/30">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Team Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Designed for collaboration with user management and protected routes for team workflows.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-2">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
              <CardContent className="pt-8 pb-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">Production Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Clean architecture with input validation, error handling, and scalability best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Ready to Transform Your Workflow?</h2>
          <p className="text-lg text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams already using TaskFlow to manage their work more efficiently. Start your free trial
            today, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="shadow-2xl shadow-primary/30 text-base">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">TaskFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TaskFlow. Built with Next.js and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
