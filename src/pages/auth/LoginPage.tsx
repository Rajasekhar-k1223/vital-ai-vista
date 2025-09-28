import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/AuthContext'
import { UserRole } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import logo from '@/assets/logo.png'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('practitioner')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password, role)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to VitalAI.",
      })
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    { role: 'super_admin', email: 'admin@vitalai.com', name: 'Super Admin Demo' },
    { role: 'org_admin', email: 'orgadmin@vitalai.com', name: 'Org Admin Demo' },
    { role: 'practitioner', email: 'doctor@vitalai.com', name: 'Practitioner Demo' },
    { role: 'patient', email: 'patient@vitalai.com', name: 'Patient Demo' }
  ]

  const fillDemoCredentials = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
    setRole(demoRole)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="VitalAI" className="h-10 w-10" />
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold text-primary">VitalAI</h1>
                <p className="text-sm text-muted-foreground">Healthcare Intelligence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="medical-card">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the healthcare platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="medical-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="medical-input pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger className="medical-input">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                    <SelectItem value="org_admin">Organization Administrator</SelectItem>
                    <SelectItem value="practitioner">Healthcare Practitioner</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full medical-button" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Try different roles with pre-filled credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((demo) => (
              <Button
                key={demo.role}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => fillDemoCredentials(demo.role as UserRole, demo.email)}
              >
                <div>
                  <div className="font-medium">{demo.name}</div>
                  <div className="text-sm text-muted-foreground">{demo.email}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}