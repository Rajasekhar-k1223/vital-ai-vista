import { useState } from 'react'
import { Plus, Search, FileText, Calendar, User, MapPin, Clock, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/AuthContext'

interface Encounter {
  id: string
  patientName: string
  patientId: string
  practitionerName: string
  practitionerId: string
  date: Date
  type: string
  status: 'planned' | 'in-progress' | 'finished' | 'cancelled'
  location: string
  reasonCode: string
  notes?: string
  duration: number // in minutes
}

const mockEncounters: Encounter[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    practitionerName: 'Dr. Sarah Johnson',
    practitionerId: 'PR001',
    date: new Date('2024-01-15T10:30:00'),
    type: 'Routine Checkup',
    status: 'finished',
    location: 'Room 101',
    reasonCode: 'Annual Physical',
    notes: 'Patient in good health. Blood pressure normal.',
    duration: 45
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    practitionerName: 'Dr. Michael Chen',
    practitionerId: 'PR002',
    date: new Date('2024-01-16T14:00:00'),
    type: 'Follow-up',
    status: 'in-progress',
    location: 'Room 203',
    reasonCode: 'Diabetes Management',
    duration: 30
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    practitionerName: 'Dr. Lisa Anderson',
    practitionerId: 'PR003',
    date: new Date('2024-01-17T09:15:00'),
    type: 'Emergency',
    status: 'finished',
    location: 'Emergency Room',
    reasonCode: 'Chest Pain',
    notes: 'ECG normal. Discharged with instructions.',
    duration: 90
  }
]

export function EncountersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [encounters] = useState(mockEncounters)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEncounter, setNewEncounter] = useState({
    patientId: '',
    practitionerId: '',
    type: '',
    location: '',
    reasonCode: '',
    notes: ''
  })

  const getFilteredEncounters = () => {
    let filteredEncounters = encounters

    if (searchTerm) {
      filteredEncounters = filteredEncounters.filter(e =>
        e.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.practitionerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.reasonCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredEncounters = filteredEncounters.filter(e => e.status === statusFilter)
    }

    return filteredEncounters
  }

  const handleAddEncounter = () => {
    console.log('Adding encounter:', newEncounter)
    setIsAddDialogOpen(false)
    setNewEncounter({ patientId: '', practitionerId: '', type: '', location: '', reasonCode: '', notes: '' })
  }

  const filteredEncounters = getFilteredEncounters()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Patient Encounters
          </h1>
          <p className="text-muted-foreground">
            Manage patient encounters and visit records
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                New Encounter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Encounter</DialogTitle>
                <DialogDescription>Record a new patient encounter or visit</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="encounter-patient">Patient</Label>
                    <Select value={newEncounter.patientId} onValueChange={(value) => setNewEncounter({...newEncounter, patientId: value})}>
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
                    <Label htmlFor="encounter-practitioner">Practitioner</Label>
                    <Select value={newEncounter.practitionerId} onValueChange={(value) => setNewEncounter({...newEncounter, practitionerId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select practitioner" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="PR001">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="PR002">Dr. Michael Chen</SelectItem>
                        <SelectItem value="PR003">Dr. Lisa Anderson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="encounter-type">Encounter Type</Label>
                    <Select value={newEncounter.type} onValueChange={(value) => setNewEncounter({...newEncounter, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Routine Checkup">Routine Checkup</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="encounter-location">Location</Label>
                    <Input
                      id="encounter-location"
                      value={newEncounter.location}
                      onChange={(e) => setNewEncounter({...newEncounter, location: e.target.value})}
                      placeholder="Room 101, Emergency Room..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encounter-reason">Reason for Visit</Label>
                  <Input
                    id="encounter-reason"
                    value={newEncounter.reasonCode}
                    onChange={(e) => setNewEncounter({...newEncounter, reasonCode: e.target.value})}
                    placeholder="Annual Physical, Chest Pain, Follow-up..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encounter-notes">Clinical Notes</Label>
                  <Textarea
                    id="encounter-notes"
                    value={newEncounter.notes}
                    onChange={(e) => setNewEncounter({...newEncounter, notes: e.target.value})}
                    placeholder="Patient assessment, treatment plan, recommendations..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEncounter} className="medical-button">
                    Create Encounter
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
                <p className="text-sm font-medium text-muted-foreground">Total Encounters</p>
                <p className="text-2xl font-bold">{filteredEncounters.length}</p>
              </div>
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{filteredEncounters.filter(e => e.status === 'in-progress').length}</p>
              </div>
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{filteredEncounters.filter(e => e.status === 'finished').length}</p>
              </div>
              <Badge className="status-active">Finished</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                <p className="text-2xl font-bold">{filteredEncounters.filter(e => e.type === 'Emergency').length}</p>
              </div>
              <Badge className="status-critical">Emergency</Badge>
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
                placeholder="Search encounters..."
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Encounters Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Patient Encounters</CardTitle>
          <CardDescription>View and manage patient encounters and visits</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Practitioner</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEncounters.map((encounter) => (
                <TableRow key={encounter.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{encounter.patientName}</p>
                        <p className="text-sm text-muted-foreground">ID: {encounter.patientId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{encounter.practitionerName}</p>
                    <p className="text-sm text-muted-foreground">{encounter.reasonCode}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">{encounter.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{encounter.date.toLocaleTimeString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{encounter.type}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{encounter.duration} min</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">{encounter.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        encounter.status === 'finished' ? "status-active" :
                        encounter.status === 'in-progress' ? "status-warning" :
                        encounter.status === 'planned' ? "status-info" :
                        "status-inactive"
                      }
                    >
                      {encounter.status.replace('-', ' ')}
                    </Badge>
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
    </div>
  )
}