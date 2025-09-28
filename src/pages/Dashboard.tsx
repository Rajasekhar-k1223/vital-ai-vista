import { 
  Users, 
  Calendar, 
  Activity, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Heart,
  Pill,
  Stethoscope
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/AuthContext'
import { getRoleDisplayName } from '@/lib/auth'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'success' | 'warning' | 'destructive'
}

function StatCard({ title, value, change, icon: Icon, trend = 'neutral', color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-destructive bg-destructive/10'
  }

  return (
    <Card className="medical-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <p className={`text-xs flex items-center gap-1 ${
              trend === 'up' ? 'text-success' : 
              trend === 'down' ? 'text-destructive' : 
              'text-muted-foreground'
            }`}>
              {trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { user, switchRole } = useAuth()

  if (!user) return null

  // Role-specific dashboard data
  const getDashboardData = () => {
    switch (user.role) {
      case 'super_admin':
        return {
          title: 'Super Administrator Dashboard',
          description: 'System-wide overview and management',
          stats: [
            { title: 'Total Organizations', value: 12, change: '+2 this month', icon: Users, trend: 'up' as const, color: 'primary' as const },
            { title: 'Total Users', value: '2,847', change: '+12% from last month', icon: Users, trend: 'up' as const, color: 'success' as const },
            { title: 'System Uptime', value: '99.9%', change: 'Last 30 days', icon: Activity, trend: 'neutral' as const, color: 'success' as const },
            { title: 'AI Models Active', value: 8, change: '+2 deployed', icon: Brain, trend: 'up' as const, color: 'primary' as const }
          ]
        }
      case 'org_admin':
        return {
          title: 'Organization Administrator Dashboard',
          description: `Managing ${user.organizationName}`,
          stats: [
            { title: 'Total Patients', value: '1,234', change: '+45 this month', icon: Users, trend: 'up' as const, color: 'primary' as const },
            { title: 'Active Practitioners', value: 56, change: '+3 new hires', icon: Stethoscope, trend: 'up' as const, color: 'success' as const },
            { title: 'Monthly Encounters', value: '3,892', change: '+15% from last month', icon: Activity, trend: 'up' as const, color: 'success' as const },
            { title: 'AI Alerts', value: 23, change: 'Requires attention', icon: AlertTriangle, trend: 'neutral' as const, color: 'warning' as const }
          ]
        }
      case 'practitioner':
        return {
          title: 'Practitioner Dashboard',
          description: 'Your patient care overview',
          stats: [
            { title: 'My Patients', value: 89, change: '+3 new patients', icon: Users, trend: 'up' as const, color: 'primary' as const },
            { title: 'Today\'s Appointments', value: 12, change: '3 remaining', icon: Calendar, trend: 'neutral' as const, color: 'primary' as const },
            { title: 'Pending Reviews', value: 7, change: 'Lab results', icon: Activity, trend: 'neutral' as const, color: 'warning' as const },
            { title: 'AI Recommendations', value: 5, change: 'New insights', icon: Brain, trend: 'neutral' as const, color: 'success' as const }
          ]
        }
      case 'patient':
        return {
          title: 'Patient Dashboard',
          description: 'Your health overview',
          stats: [
            { title: 'Next Appointment', value: 'Tomorrow', change: 'Dr. Smith, 10:00 AM', icon: Calendar, trend: 'neutral' as const, color: 'primary' as const },
            { title: 'Health Score', value: '85%', change: '+5% improvement', icon: Heart, trend: 'up' as const, color: 'success' as const },
            { title: 'Active Medications', value: 3, change: '1 refill needed', icon: Pill, trend: 'neutral' as const, color: 'warning' as const },
            { title: 'AI Insights', value: 2, change: 'New recommendations', icon: Brain, trend: 'neutral' as const, color: 'success' as const }
          ]
        }
    }
  }

  const dashboardData = getDashboardData()

  const quickActions = {
    super_admin: [
      { title: 'Manage Organizations', description: 'Add, edit, or view organizations', href: '/organizations' },
      { title: 'System Analytics', description: 'View system-wide performance', href: '/analytics' },
      { title: 'AI Model Management', description: 'Deploy and monitor AI models', href: '/ai-hub' },
      { title: 'User Management', description: 'Manage platform users', href: '/users' }
    ],
    org_admin: [
      { title: 'Patient Management', description: 'View and manage patients', href: '/patients' },
      { title: 'Staff Management', description: 'Manage practitioners and staff', href: '/practitioners' },
      { title: 'Appointment Scheduling', description: 'Manage appointments', href: '/appointments' },
      { title: 'Organization Settings', description: 'Configure organization', href: '/organizations' }
    ],
    practitioner: [
      { title: 'Patient Records', description: 'Access patient information', href: '/patients' },
      { title: 'Schedule Appointments', description: 'Book and manage appointments', href: '/appointments' },
      { title: 'Lab Results', description: 'Review test results', href: '/observations' },
      { title: 'AI Insights', description: 'View AI recommendations', href: '/ai-hub' }
    ],
    patient: [
      { title: 'My Health Records', description: 'View your medical history', href: '/encounters' },
      { title: 'Book Appointment', description: 'Schedule with your provider', href: '/appointments' },
      { title: 'Medications', description: 'View prescriptions', href: '/medications' },
      { title: 'Health Insights', description: 'AI-powered health tips', href: '/ai-hub' }
    ]
  }

  const recentActivities = [
    { icon: CheckCircle, title: 'Patient discharge completed', time: '2 hours ago', color: 'text-success' },
    { icon: Clock, title: 'Lab results available', time: '4 hours ago', color: 'text-warning' },
    { icon: Brain, title: 'AI analysis completed', time: '6 hours ago', color: 'text-primary' },
    { icon: Calendar, title: 'Appointment scheduled', time: '1 day ago', color: 'text-muted-foreground' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dashboardData.title}</h1>
          <p className="text-muted-foreground">{dashboardData.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="status-active">
            {getRoleDisplayName(user.role)}
          </Badge>
          {user.role === 'super_admin' && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => switchRole('org_admin')}>
                Switch to Org Admin
              </Button>
              <Button size="sm" variant="outline" onClick={() => switchRole('practitioner')}>
                Switch to Practitioner
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="medical-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {quickActions[user.role].map((action, index) => (
                <div key={index} className="space-y-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-1 rounded ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {user.role !== 'patient' && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Patient Satisfaction</span>
                  <span className="text-sm text-muted-foreground">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Accuracy</span>
                  <span className="text-sm text-muted-foreground">98.5%</span>
                </div>
                <Progress value={98.5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-muted-foreground">2.1s avg</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}