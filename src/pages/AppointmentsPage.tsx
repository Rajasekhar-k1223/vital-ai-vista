import { useState } from 'react'
import { Plus, Search, Calendar, Clock, User, Phone, Mail, Eye, Edit, Check, X, MapPin } from 'lucide-react'
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

interface Appointment {
  id: string
  patientName: string
  patientMRN: string
  practitionerName: string
  appointmentType: string
  date: Date
  duration: number
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  location: string
  notes?: string
  organizationId: string
  priority: 'routine' | 'urgent' | 'emergency'
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Anderson',
    patientMRN: 'MRN001234',
    practitionerName: 'Dr. Michael Chen',
    appointmentType: 'Cardiology Consultation',
    date: new Date('2024-01-16T10:00:00'),
    duration: 60,
    status: 'scheduled',
    location: 'Room 301, Cardiology Wing',
    notes: 'Follow-up for chest pain',
    organizationId: 'org-1',
    priority: 'routine'
  },
  {
    id: '2',
    patientName: 'Sarah Wilson',
    patientMRN: 'MRN001235',
    practitionerName: 'Dr. Sarah Johnson',
    appointmentType: 'Annual Physical',
    date: new Date('2024-01-16T14:30:00'),
    duration: 45,
    status: 'confirmed',
    location: 'Room 205, Internal Medicine',
    organizationId: 'org-1',
    priority: 'routine'
  },
  {
    id: '3',
    patientName: 'Michael Johnson',
    patientMRN: 'MRN001236',
    practitionerName: 'Dr. Robert Wilson',
    appointmentType: 'Emergency Consultation',
    date: new Date('2024-01-15T18:00:00'),
    duration: 30,
    status: 'in-progress',
    location: 'Emergency Room A',
    notes: 'Chest pain, urgent evaluation needed',
    organizationId: 'org-1',
    priority: 'emergency'
  },
  {
    id: '4',
    patientName: 'Emma Davis',
    patientMRN: 'MRN001237',
    practitionerName: 'Dr. Emily Davis',
    appointmentType: 'Pediatric Check-up',
    date: new Date('2024-01-17T11:00:00'),
    duration: 30,
    status: 'scheduled',
    location: 'Room 120, Pediatrics',
    organizationId: 'org-2',
    priority: 'routine'
  }
]

export function AppointmentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments] = useState(mockAppointments)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('today')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    practitionerName: '',
    appointmentType: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    notes: ''
  })

  // Filter appointments based on user's role and organization
  const getFilteredAppointments = () => {
    let filteredAppointments = appointments

    if (user?.role === 'org_admin' || user?.role === 'practitioner') {
      filteredAppointments = appointments.filter(a => a.organizationId === user.organizationId)
    }

    if (user?.role === 'patient') {
      // For demo, show appointments for the logged-in patient
      filteredAppointments = appointments.filter(a => a.patientName.includes('John Anderson'))
    }

    if (user?.role === 'practitioner') {
      // Show appointments for this practitioner
      filteredAppointments = filteredAppointments.filter(a => a.practitionerName.includes('Dr. Michael Chen'))
    }

    // Apply search filter
    if (searchTerm) {
      filteredAppointments = filteredAppointments.filter(a =>
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.practitionerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.appointmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientMRN.includes(searchTerm)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredAppointments = filteredAppointments.filter(a => a.status === statusFilter)
    }

    // Apply date filter
    const today = new Date()
    if (dateFilter === 'today') {
      filteredAppointments = filteredAppointments.filter(a => 
        a.date.toDateString() === today.toDateString()
      )
    } else if (dateFilter === 'upcoming') {
      filteredAppointments = filteredAppointments.filter(a => 
        a.date >= today
      )
    } else if (dateFilter === 'past') {
      filteredAppointments = filteredAppointments.filter(a => 
        a.date < today
      )
    }

    return filteredAppointments.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const handleAddAppointment = () => {
    console.log('Adding appointment:', newAppointment)
    setIsAddDialogOpen(false)
    setNewAppointment({
      patientName: '',
      practitionerName: '',
      appointmentType: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      notes: ''
    })
  }

  const filteredAppointments = getFilteredAppointments()
  const canManageAppointments = user?.role !== 'patient'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'status-pending'
      case 'confirmed': return 'status-active'
      case 'in-progress': return 'bg-primary/10 text-primary'
      case 'completed': return 'status-active'
      case 'cancelled': return 'status-inactive'
      case 'no-show': return 'bg-destructive/10 text-destructive'
      default: return 'status-pending'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'routine': return 'bg-muted text-muted-foreground'
      case 'urgent': return 'bg-warning/10 text-warning'
      case 'emergency': return 'bg-destructive/10 text-destructive'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Appointments
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'patient' 
              ? 'Your scheduled appointments and healthcare visits'
              : 'Manage patient appointments and scheduling'
            }
          </p>
        </div>
        {canManageAppointments && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Create a new patient appointment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apt-patient">Patient</Label>
                    <Input
                      id="apt-patient"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                      placeholder="Patient name or MRN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apt-practitioner">Practitioner</Label>
                    <Select value={newAppointment.practitionerName} onValueChange={(value) => setNewAppointment({...newAppointment, practitionerName: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select practitioner" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                        <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="Dr. Robert Wilson">Dr. Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-type">Appointment Type</Label>
                  <Select value={newAppointment.appointmentType} onValueChange={(value) => setNewAppointment({...newAppointment, appointmentType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="physical">Physical Exam</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apt-date">Date</Label>
                    <Input
                      id="apt-date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apt-time">Time</Label>
                    <Input
                      id="apt-time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apt-duration">Duration (minutes)</Label>
                    <Select value={newAppointment.duration.toString()} onValueChange={(value) => setNewAppointment({...newAppointment, duration: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-location">Location</Label>
                  <Input
                    id="apt-location"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                    placeholder="Room number or location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-notes">Notes</Label>
                  <Input
                    id="apt-notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    placeholder="Appointment notes or instructions"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAppointment} className="medical-button">
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold">{filteredAppointments.length}</p>
              </div>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">
                  {appointments.filter(a => a.date.toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <Clock className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{filteredAppointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
              <Check className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{filteredAppointments.filter(a => a.status === 'in-progress').length}</p>
              </div>
              <User className="h-4 w-4 text-primary" />
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
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Appointments Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>{user?.role === 'patient' ? 'Your Appointments' : 'Appointments'}</CardTitle>
          <CardDescription>
            {user?.role === 'patient' 
              ? 'Your scheduled healthcare appointments'
              : 'Patient appointment scheduling and management'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Practitioner</TableHead>
                <TableHead>Appointment</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.patientMRN}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{appointment.practitionerName}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{appointment.appointmentType}</p>
                      <p className="text-sm text-muted-foreground">{appointment.duration} minutes</p>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <div>
                        <p>{appointment.date.toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          {appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {appointment.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(appointment.priority)}>
                      {appointment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canManageAppointments && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {appointment.status === 'scheduled' && (
                            <Button size="sm" variant="outline">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
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
    </div>
  )
}