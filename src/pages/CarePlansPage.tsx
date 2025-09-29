import { useState } from 'react'
import { Plus, Search, Target, TrendingUp, Calendar, User, Eye, Edit, Trash2, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/components/AuthContext'

interface CarePlan {
  id: string
  patientName: string
  patientId: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'suspended' | 'draft'
  startDate: Date
  targetDate?: Date
  createdBy: string
  lastUpdated: Date
  goals: Goal[]
  activities: Activity[]
  progress: number
}

interface Goal {
  id: string
  title: string
  description: string
  targetValue?: string
  currentValue?: string
  unit?: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'achieved' | 'suspended'
  targetDate?: Date
  progress: number
}

interface Activity {
  id: string
  title: string
  description: string
  type: 'medication' | 'exercise' | 'diet' | 'education' | 'monitoring'
  frequency: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed'
  dueDate?: Date
  completedDate?: Date
}

const mockCarePlans: CarePlan[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    title: 'Hypertension Management Plan',
    description: 'Comprehensive care plan for managing high blood pressure through medication, lifestyle modifications, and regular monitoring.',
    category: 'Cardiovascular',
    status: 'active',
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-06-01'),
    createdBy: 'Dr. Sarah Johnson',
    lastUpdated: new Date('2024-01-15'),
    progress: 65,
    goals: [
      {
        id: 'g1',
        title: 'Blood Pressure Control',
        description: 'Maintain blood pressure below 140/90 mmHg',
        targetValue: '130/80',
        currentValue: '135/85',
        unit: 'mmHg',
        priority: 'high',
        status: 'active',
        targetDate: new Date('2024-03-01'),
        progress: 70
      },
      {
        id: 'g2',
        title: 'Weight Reduction',
        description: 'Lose 10 pounds to reduce cardiovascular risk',
        targetValue: '170',
        currentValue: '175',
        unit: 'lbs',
        priority: 'medium',
        status: 'active',
        targetDate: new Date('2024-04-01'),
        progress: 50
      }
    ],
    activities: [
      {
        id: 'a1',
        title: 'Take Lisinopril',
        description: '10mg once daily in the morning',
        type: 'medication',
        frequency: 'Daily',
        status: 'in-progress',
        dueDate: new Date('2024-01-16')
      },
      {
        id: 'a2',
        title: 'Daily Walk',
        description: '30 minutes brisk walking',
        type: 'exercise',
        frequency: 'Daily',
        status: 'completed',
        completedDate: new Date('2024-01-15')
      }
    ]
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    title: 'Type 2 Diabetes Care Plan',
    description: 'Diabetes management focused on glucose control, medication adherence, and lifestyle modifications.',
    category: 'Endocrine',
    status: 'active',
    startDate: new Date('2023-12-15'),
    createdBy: 'Dr. Michael Chen',
    lastUpdated: new Date('2024-01-14'),
    progress: 80,
    goals: [
      {
        id: 'g3',
        title: 'HbA1c Control',
        description: 'Maintain HbA1c below 7%',
        targetValue: '6.5',
        currentValue: '6.8',
        unit: '%',
        priority: 'high',
        status: 'active',
        progress: 85
      }
    ],
    activities: [
      {
        id: 'a3',
        title: 'Blood Glucose Monitoring',
        description: 'Check blood sugar twice daily',
        type: 'monitoring',
        frequency: 'Twice daily',
        status: 'in-progress'
      }
    ]
  }
]

const mockGoals: Goal[] = [
  {
    id: 'g4',
    title: 'Cholesterol Reduction',
    description: 'Lower LDL cholesterol to under 100 mg/dL',
    targetValue: '100',
    currentValue: '120',
    unit: 'mg/dL',
    priority: 'medium',
    status: 'active',
    targetDate: new Date('2024-05-01'),
    progress: 60
  },
  {
    id: 'g5',
    title: 'Exercise Compliance',
    description: 'Complete 150 minutes of moderate exercise weekly',
    targetValue: '150',
    currentValue: '90',
    unit: 'minutes/week',
    priority: 'medium',
    status: 'active',
    progress: 60
  }
]

export function CarePlansPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [carePlans] = useState(mockCarePlans)
  const [goals] = useState(mockGoals)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false)
  const [newCarePlan, setNewCarePlan] = useState({
    patientId: '',
    title: '',
    description: '',
    category: ''
  })
  const [newGoal, setNewGoal] = useState({
    patientId: '',
    title: '',
    description: '',
    targetValue: '',
    priority: '' as 'high' | 'medium' | 'low'
  })

  const getFilteredCarePlans = () => {
    let filteredPlans = carePlans

    if (user?.role === 'patient') {
      filteredPlans = carePlans.filter(cp => cp.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredPlans = filteredPlans.filter(cp =>
        cp.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredPlans = filteredPlans.filter(cp => cp.status === statusFilter)
    }

    return filteredPlans
  }

  const handleAddCarePlan = () => {
    console.log('Adding care plan:', newCarePlan)
    setIsAddPlanDialogOpen(false)
    setNewCarePlan({ patientId: '', title: '', description: '', category: '' })
  }

  const handleAddGoal = () => {
    console.log('Adding goal:', newGoal)
    setIsAddGoalDialogOpen(false)
    setNewGoal({ patientId: '', title: '', description: '', targetValue: '', priority: 'medium' })
  }

  const filteredCarePlans = getFilteredCarePlans()
  const allGoals = [...carePlans.flatMap(cp => cp.goals), ...goals]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Care Plans & Goals
          </h1>
          <p className="text-muted-foreground">
            Manage patient care plans, treatment goals, and progress tracking
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role !== 'patient' && (
            <>
              <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="medical-button">
                    <Plus className="h-4 w-4 mr-2" />
                    New Care Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-popover max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Care Plan</DialogTitle>
                    <DialogDescription>Develop a comprehensive care plan for patient treatment</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan-patient">Patient</Label>
                        <Select value={newCarePlan.patientId} onValueChange={(value) => setNewCarePlan({...newCarePlan, patientId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="P001">John Smith</SelectItem>
                            <SelectItem value="P002">Emily Davis</SelectItem>
                            <SelectItem value="P003">Robert Wilson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan-category">Category</Label>
                        <Select value={newCarePlan.category} onValueChange={(value) => setNewCarePlan({...newCarePlan, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                            <SelectItem value="Endocrine">Endocrine</SelectItem>
                            <SelectItem value="Respiratory">Respiratory</SelectItem>
                            <SelectItem value="Mental Health">Mental Health</SelectItem>
                            <SelectItem value="Preventive">Preventive</SelectItem>
                            <SelectItem value="Rehabilitation">Rehabilitation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-title">Care Plan Title</Label>
                      <Input
                        id="plan-title"
                        value={newCarePlan.title}
                        onChange={(e) => setNewCarePlan({...newCarePlan, title: e.target.value})}
                        placeholder="Hypertension Management Plan, Diabetes Care Plan..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-description">Description</Label>
                      <Textarea
                        id="plan-description"
                        value={newCarePlan.description}
                        onChange={(e) => setNewCarePlan({...newCarePlan, description: e.target.value})}
                        placeholder="Detailed description of the care plan, objectives, and approach..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddPlanDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCarePlan} className="medical-button">
                        Create Care Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-popover">
                  <DialogHeader>
                    <DialogTitle>Set New Goal</DialogTitle>
                    <DialogDescription>Define a measurable treatment goal for the patient</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-patient">Patient</Label>
                      <Select value={newGoal.patientId} onValueChange={(value) => setNewGoal({...newGoal, patientId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="P001">John Smith</SelectItem>
                          <SelectItem value="P002">Emily Davis</SelectItem>
                          <SelectItem value="P003">Robert Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-title">Goal Title</Label>
                        <Input
                          id="goal-title"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                          placeholder="Blood Pressure Control, Weight Loss..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goal-priority">Priority</Label>
                        <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as 'high' | 'medium' | 'low'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-description">Description</Label>
                      <Textarea
                        id="goal-description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        placeholder="Detailed description of the goal and success criteria..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-target">Target Value</Label>
                      <Input
                        id="goal-target"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                        placeholder="130/80 mmHg, 170 lbs, 7%..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddGoalDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddGoal} className="medical-button">
                        Set Goal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Care Plans</p>
                <p className="text-2xl font-bold">{filteredCarePlans.filter(cp => cp.status === 'active').length}</p>
              </div>
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{allGoals.filter(g => g.status === 'active').length}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goals Achieved</p>
                <p className="text-2xl font-bold">{allGoals.filter(g => g.status === 'achieved').length}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{Math.round(filteredCarePlans.reduce((acc, cp) => acc + cp.progress, 0) / filteredCarePlans.length)}%</p>
              </div>
              <Progress value={75} className="w-8 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search care plans and goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Care Plans</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Active Care Plans</CardTitle>
              <CardDescription>Patient treatment plans and progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Care Plan</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarePlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{plan.patientName}</div>
                            <div className="text-sm text-muted-foreground">ID: {plan.patientId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.title}</div>
                          <div className="text-sm text-muted-foreground">{plan.category}</div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {plan.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={plan.progress} className="w-20" />
                          <div className="text-sm font-medium">{plan.progress}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{plan.createdBy}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {plan.lastUpdated.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Started: {plan.startDate.toLocaleDateString()}</div>
                          {plan.targetDate && (
                            <div className="text-muted-foreground">
                              Target: {plan.targetDate.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            plan.status === 'active' ? "status-active" :
                            plan.status === 'completed' ? "status-success" :
                            plan.status === 'suspended' ? "status-warning" :
                            "status-inactive"
                          }
                        >
                          {plan.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {plan.goals.length} goals
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user?.role !== 'patient' && (
                            <>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {allGoals.map((goal) => (
              <Card key={goal.id} className="medical-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge 
                      className={
                        goal.priority === 'high' ? "status-critical" :
                        goal.priority === 'medium' ? "status-warning" :
                        "status-info"
                      }
                    >
                      {goal.priority} priority
                    </Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {/* Current vs Target Values */}
                    {goal.currentValue && goal.targetValue && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="text-muted-foreground">Current</div>
                          <div className="font-semibold">{goal.currentValue} {goal.unit}</div>
                        </div>
                        <div className="text-center p-2 bg-primary/10 rounded">
                          <div className="text-muted-foreground">Target</div>
                          <div className="font-semibold text-primary">{goal.targetValue} {goal.unit}</div>
                        </div>
                      </div>
                    )}

                    {/* Target Date */}
                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Target: {goal.targetDate.toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                      <Badge 
                        className={
                          goal.status === 'achieved' ? "status-success" :
                          goal.status === 'active' ? "status-active" :
                          "status-warning"
                        }
                      >
                        {goal.status}
                      </Badge>
                      
                      {user?.role !== 'patient' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
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