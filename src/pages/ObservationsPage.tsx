import { useState } from 'react'
import { Plus, Search, Activity, TrendingUp, Heart, Thermometer, Scale, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/AuthContext'

interface Observation {
  id: string
  patientName: string
  patientId: string
  type: string
  value: string
  unit: string
  status: 'final' | 'preliminary' | 'amended'
  category: string
  date: Date
  practitionerName: string
  normalRange?: string
  isAbnormal: boolean
}

const mockObservations: Observation[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    type: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    status: 'final',
    category: 'vital-signs',
    date: new Date('2024-01-15T10:30:00'),
    practitionerName: 'Dr. Sarah Johnson',
    normalRange: '90-140 / 60-90',
    isAbnormal: false
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    type: 'Blood Glucose',
    value: '180',
    unit: 'mg/dL',
    status: 'final',
    category: 'laboratory',
    date: new Date('2024-01-15T09:15:00'),
    practitionerName: 'Dr. Michael Chen',
    normalRange: '70-100',
    isAbnormal: true
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    type: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    status: 'final',
    category: 'vital-signs',
    date: new Date('2024-01-14T14:20:00'),
    practitionerName: 'Dr. Lisa Anderson',
    normalRange: '60-100',
    isAbnormal: false
  },
  {
    id: '4',
    patientName: 'John Smith',
    patientId: 'P001',
    type: 'Temperature',
    value: '99.2',
    unit: '°F',
    status: 'final',
    category: 'vital-signs',
    date: new Date('2024-01-15T10:30:00'),
    practitionerName: 'Dr. Sarah Johnson',
    normalRange: '97.8-99.1',
    isAbnormal: true
  },
  {
    id: '5',
    patientName: 'Emily Davis',
    patientId: 'P002',
    type: 'Cholesterol Total',
    value: '220',
    unit: 'mg/dL',
    status: 'final',
    category: 'laboratory',
    date: new Date('2024-01-14T08:00:00'),
    practitionerName: 'Dr. Michael Chen',
    normalRange: '< 200',
    isAbnormal: true
  }
]

export function ObservationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [observations] = useState(mockObservations)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newObservation, setNewObservation] = useState({
    patientId: '',
    type: '',
    value: '',
    unit: '',
    category: ''
  })

  const getFilteredObservations = () => {
    let filteredObservations = observations

    if (user?.role === 'patient') {
      filteredObservations = observations.filter(o => o.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredObservations = filteredObservations.filter(o =>
        o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.practitionerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filteredObservations = filteredObservations.filter(o => o.category === categoryFilter)
    }

    return filteredObservations
  }

  const handleAddObservation = () => {
    console.log('Adding observation:', newObservation)
    setIsAddDialogOpen(false)
    setNewObservation({ patientId: '', type: '', value: '', unit: '', category: '' })
  }

  const filteredObservations = getFilteredObservations()
  const vitalSigns = filteredObservations.filter(o => o.category === 'vital-signs')
  const labResults = filteredObservations.filter(o => o.category === 'laboratory')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Observations & Vitals
          </h1>
          <p className="text-muted-foreground">
            Monitor patient vital signs and laboratory results
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Observation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Observation</DialogTitle>
                <DialogDescription>Add a new vital sign or laboratory result</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="obs-patient">Patient</Label>
                    <Select value={newObservation.patientId} onValueChange={(value) => setNewObservation({...newObservation, patientId: value})}>
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
                    <Label htmlFor="obs-category">Category</Label>
                    <Select value={newObservation.category} onValueChange={(value) => setNewObservation({...newObservation, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="vital-signs">Vital Signs</SelectItem>
                        <SelectItem value="laboratory">Laboratory</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="physical-exam">Physical Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="obs-type">Observation Type</Label>
                    <Select value={newObservation.type} onValueChange={(value) => setNewObservation({...newObservation, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
                        <SelectItem value="Heart Rate">Heart Rate</SelectItem>
                        <SelectItem value="Temperature">Temperature</SelectItem>
                        <SelectItem value="Weight">Weight</SelectItem>
                        <SelectItem value="Blood Glucose">Blood Glucose</SelectItem>
                        <SelectItem value="Cholesterol">Cholesterol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="obs-value">Value</Label>
                    <Input
                      id="obs-value"
                      value={newObservation.value}
                      onChange={(e) => setNewObservation({...newObservation, value: e.target.value})}
                      placeholder="120/80, 72, 98.6..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="obs-unit">Unit</Label>
                    <Select value={newObservation.unit} onValueChange={(value) => setNewObservation({...newObservation, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="mmHg">mmHg</SelectItem>
                        <SelectItem value="bpm">bpm</SelectItem>
                        <SelectItem value="°F">°F</SelectItem>
                        <SelectItem value="°C">°C</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="mg/dL">mg/dL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddObservation} className="medical-button">
                    Record Observation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Observations</p>
                <p className="text-2xl font-bold">{filteredObservations.length}</p>
              </div>
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vital Signs</p>
                <p className="text-2xl font-bold">{vitalSigns.length}</p>
              </div>
              <Heart className="h-4 w-4 text-error" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lab Results</p>
                <p className="text-2xl font-bold">{labResults.length}</p>
              </div>
              <Activity className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Abnormal</p>
                <p className="text-2xl font-bold">{filteredObservations.filter(o => o.isAbnormal).length}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-warning" />
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
                placeholder="Search observations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vital-signs">Vital Signs</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="physical-exam">Physical Exam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Observations Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Observations</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>All Observations</CardTitle>
              <CardDescription>Complete list of patient observations and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Normal Range</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Practitioner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObservations.map((obs) => (
                    <TableRow key={obs.id}>
                      <TableCell>
                        <div className="font-medium">{obs.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {obs.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {obs.type === 'Blood Pressure' && <Heart className="h-4 w-4 text-error" />}
                          {obs.type === 'Temperature' && <Thermometer className="h-4 w-4 text-warning" />}
                          {obs.type === 'Weight' && <Scale className="h-4 w-4 text-info" />}
                          {obs.type === 'Heart Rate' && <Activity className="h-4 w-4 text-success" />}
                          <span className="font-medium">{obs.type}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">{obs.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{obs.value} {obs.unit}</div>
                        {obs.isAbnormal && (
                          <Badge className="status-critical mt-1">Abnormal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{obs.normalRange}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{obs.date.toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">{obs.date.toLocaleTimeString()}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{obs.practitionerName}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className="status-active">{obs.status}</Badge>
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

        <TabsContent value="vitals" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
              <CardDescription>Patient vital signs and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {vitalSigns.map((vital) => (
                  <Card key={vital.id} className="medical-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {vital.type === 'Blood Pressure' && <Heart className="h-5 w-5 text-error" />}
                          {vital.type === 'Temperature' && <Thermometer className="h-5 w-5 text-warning" />}
                          {vital.type === 'Heart Rate' && <Activity className="h-5 w-5 text-success" />}
                          <span className="font-medium">{vital.type}</span>
                        </div>
                        {vital.isAbnormal && <Badge className="status-critical">!</Badge>}
                      </div>
                      <div className="text-2xl font-bold">{vital.value} {vital.unit}</div>
                      <div className="text-sm text-muted-foreground">Normal: {vital.normalRange}</div>
                      <div className="text-sm text-muted-foreground mt-2">{vital.patientName}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Blood work and laboratory test results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labResults.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell className="font-medium">{lab.patientName}</TableCell>
                      <TableCell>{lab.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lab.value} {lab.unit}</span>
                          {lab.isAbnormal && <Badge className="status-critical">High</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{lab.normalRange}</TableCell>
                      <TableCell>{lab.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="status-active">{lab.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}