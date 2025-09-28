import { useState } from 'react'
import { 
  Brain, 
  Activity, 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  MessageSquare,
  BarChart3,
  Pill,
  Eye,
  User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/AuthContext'

interface AIModelProps {
  title: string
  description: string
  status: 'active' | 'training' | 'pending'
  accuracy: number
  predictions: number
  icon: React.ComponentType<{ className?: string }>
  lastUpdated: string
}

function AIModelCard({ title, description, status, accuracy, predictions, icon: Icon, lastUpdated }: AIModelProps) {
  const statusConfig = {
    active: { color: 'success', label: 'Active' },
    training: { color: 'warning', label: 'Training' },
    pending: { color: 'destructive', label: 'Pending' }
  }

  const config = statusConfig[status]

  return (
    <Card className="medical-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <Badge className={`status-${config.color}`}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={accuracy} className="flex-1 h-2" />
              <span className="text-sm font-medium">{accuracy}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Predictions</p>
            <p className="text-lg font-semibold mt-1">{predictions.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function AIHub() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const aiModels = [
    {
      title: 'Patient Risk Assessment',
      description: 'Predicts patient readmission risk and deterioration',
      status: 'active' as const,
      accuracy: 94.5,
      predictions: 15420,
      icon: AlertTriangle,
      lastUpdated: '2 hours ago'
    },
    {
      title: 'Diagnostic Imaging AI',
      description: 'Analyzes X-rays, MRIs, and CT scans for abnormalities',
      status: 'active' as const,
      accuracy: 97.2,
      predictions: 8750,
      icon: Scan,
      lastUpdated: '1 hour ago'
    },
    {
      title: 'Drug Interaction Checker',
      description: 'Identifies potential medication interactions and allergies',
      status: 'active' as const,
      accuracy: 99.1,
      predictions: 23100,
      icon: Pill,
      lastUpdated: '30 minutes ago'
    },
    {
      title: 'Vital Signs Monitoring',
      description: 'Real-time analysis of patient vital signs patterns',
      status: 'training' as const,
      accuracy: 92.3,
      predictions: 45200,
      icon: Heart,
      lastUpdated: '5 hours ago'
    },
    {
      title: 'Treatment Recommendation',
      description: 'Suggests optimal treatment plans based on patient history',
      status: 'active' as const,
      accuracy: 89.7,
      predictions: 12300,
      icon: Brain,
      lastUpdated: '1 day ago'
    },
    {
      title: 'Clinical Report Analysis',
      description: 'Extracts insights from clinical reports and notes',
      status: 'pending' as const,
      accuracy: 85.4,
      predictions: 6800,
      icon: BarChart3,
      lastUpdated: '3 days ago'
    }
  ]

  const aiInsights = [
    {
      title: 'High-Risk Patient Alert',
      description: 'Patient John Doe shows 85% probability of readmission within 30 days',
      priority: 'high',
      icon: AlertTriangle,
      time: '5 minutes ago'
    },
    {
      title: 'Imaging Analysis Complete',
      description: 'CT scan analysis reveals no abnormalities for Patient Jane Smith',
      priority: 'low',
      icon: CheckCircle,
      time: '15 minutes ago'
    },
    {
      title: 'Drug Interaction Warning',
      description: 'Potential interaction detected between prescribed medications',
      priority: 'medium',
      icon: Pill,
      time: '1 hour ago'
    },
    {
      title: 'Vital Signs Pattern',
      description: 'Unusual heart rate pattern detected for Patient Mike Johnson',
      priority: 'medium',
      icon: Heart,
      time: '2 hours ago'
    }
  ]

  const aiCapabilities = [
    {
      title: 'Predictive Analytics',
      description: 'Forecast patient outcomes and identify at-risk individuals',
      icon: TrendingUp,
      features: ['Risk Assessment', 'Early Warning Systems', 'Outcome Prediction']
    },
    {
      title: 'Medical Imaging AI',
      description: 'Advanced analysis of medical images with high accuracy',
      icon: Eye,
      features: ['X-ray Analysis', 'MRI Interpretation', 'CT Scan Review']
    },
    {
      title: 'Clinical Decision Support',
      description: 'AI-powered recommendations for treatment decisions',
      icon: Brain,
      features: ['Treatment Plans', 'Medication Suggestions', 'Diagnostic Aid']
    },
    {
      title: 'Natural Language Processing',
      description: 'Extract insights from clinical notes and reports',
      icon: MessageSquare,
      features: ['Report Analysis', 'Clinical Coding', 'Documentation Aid']
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Intelligence Hub
          </h1>
          <p className="text-muted-foreground">
            Advanced AI models and insights for intelligent healthcare delivery
          </p>
        </div>
        <Button className="medical-button">
          Train New Model
        </Button>
      </div>

      {/* AI Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predictions Today</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alerts Generated</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="insights">Live Insights</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>AI Performance Summary</CardTitle>
                <CardDescription>Overall AI system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Model Accuracy</span>
                    <span className="text-sm text-muted-foreground">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Reliability</span>
                    <span className="text-sm text-muted-foreground">99.7%</span>
                  </div>
                  <Progress value={99.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-muted-foreground">150ms avg</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Recent AI Activity</CardTitle>
                <CardDescription>Latest AI predictions and analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.slice(0, 4).map((insight, index) => {
                  const priorityColors = {
                    high: 'text-destructive',
                    medium: 'text-warning',
                    low: 'text-success'
                  }
                  
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-1 rounded ${priorityColors[insight.priority as keyof typeof priorityColors]}`}>
                        <insight.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                        <p className="text-xs text-muted-foreground">{insight.time}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiModels.map((model, index) => (
              <AIModelCard key={index} {...model} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Live AI Insights & Alerts</CardTitle>
              <CardDescription>Real-time AI-generated insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => {
                const priorityColors = {
                  high: 'border-destructive bg-destructive/5',
                  medium: 'border-warning bg-warning/5',
                  low: 'border-success bg-success/5'
                }
                
                return (
                  <div key={index} className={`p-4 border rounded-lg ${priorityColors[insight.priority as keyof typeof priorityColors]}`}>
                    <div className="flex items-start gap-3">
                      <insight.icon className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{insight.time}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {aiCapabilities.map((capability, index) => (
              <Card key={index} className="medical-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <capability.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{capability.title}</CardTitle>
                      <CardDescription>{capability.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {capability.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}