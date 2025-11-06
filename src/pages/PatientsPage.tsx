import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Users, Calendar, Heart, Eye, Edit, FileText, Phone, Mail, User, Activity } from 'lucide-react'
import { MedicalReportsTab } from '@/components/patients/MedicalReportsTab'
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
import type { Patient } from '@/types/fhir/Patient'
import { 
  createHumanName, 
  createContactPoint, 
  createAddress, 
  createIdentifier, 
  getDisplayName, 
  getContactValue, 
  getAddressText,
  getIdentifierValue,
  CODING_SYSTEMS
} from '@/lib/fhir-utils'

// Extended Patient interface with custom fields for UI
interface PatientExtended extends Patient {
  lastVisit: Date
  nextAppointment?: Date
  riskLevel: 'low' | 'medium' | 'high'
  organizationId: string
}

const mockPatients: PatientExtended[] = [
  {
    resourceType: 'Patient',
    id: '1',
    identifier: [
      createIdentifier(CODING_SYSTEMS.MRN, 'MRN001234', 'official')
    ],
    active: true,
    name: [createHumanName('Anderson', 'John', 'official')],
    telecom: [
      createContactPoint('email', 'john.anderson@email.com', 'home'),
      createContactPoint('phone', '+1 (555) 123-4567', 'mobile')
    ],
    gender: 'male',
    birthDate: '1985-03-15',
    address: [createAddress('123 Main St', 'City', 'State', '12345')],
    contact: [{
      relationship: [{ text: 'Emergency Contact' }],
      name: createHumanName('Anderson', 'Jane'),
      telecom: [createContactPoint('phone', '+1 (555) 987-6543', 'home')]
    }],
    generalPractitioner: [{ display: 'Dr. Michael Chen' }],
    lastVisit: new Date('2024-01-10T14:30:00'),
    nextAppointment: new Date('2024-01-20T10:00:00'),
    riskLevel: 'low',
    organizationId: 'org-1'
  },
  {
    resourceType: 'Patient',
    id: '2',
    identifier: [
      createIdentifier(CODING_SYSTEMS.MRN, 'MRN001235', 'official')
    ],
    active: true,
    name: [createHumanName('Wilson', 'Sarah', 'official')],
    telecom: [
      createContactPoint('email', 'sarah.wilson@email.com', 'home'),
      createContactPoint('phone', '+1 (555) 234-5678', 'mobile')
    ],
    gender: 'female',
    birthDate: '1992-07-22',
    address: [createAddress('456 Oak Ave', 'City', 'State', '12345')],
    contact: [{
      relationship: [{ text: 'Emergency Contact' }],
      name: createHumanName('Wilson', 'Robert'),
      telecom: [createContactPoint('phone', '+1 (555) 876-5432', 'home')]
    }],
    generalPractitioner: [{ display: 'Dr. Sarah Johnson' }],
    lastVisit: new Date('2024-01-12T09:15:00'),
    riskLevel: 'medium',
    organizationId: 'org-1'
  },
  {
    resourceType: 'Patient',
    id: '3',
    identifier: [
      createIdentifier(CODING_SYSTEMS.MRN, 'MRN001236', 'official')
    ],
    active: true,
    name: [createHumanName('Johnson', 'Michael', 'official')],
    telecom: [
      createContactPoint('email', 'michael.johnson@email.com', 'home'),
      createContactPoint('phone', '+1 (555) 345-6789', 'mobile')
    ],
    gender: 'male',
    birthDate: '1978-11-08',
    address: [createAddress('789 Pine Rd', 'City', 'State', '12345')],
    contact: [{
      relationship: [{ text: 'Emergency Contact' }],
      name: createHumanName('Johnson', 'Lisa'),
      telecom: [createContactPoint('phone', '+1 (555) 765-4321', 'home')]
    }],
    generalPractitioner: [{ display: 'Dr. Robert Wilson' }],
    lastVisit: new Date('2024-01-08T16:45:00'),
    nextAppointment: new Date('2024-01-25T14:30:00'),
    riskLevel: 'high',
    organizationId: 'org-2'
  }
]

export function PatientsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [patients] = useState(mockPatients)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: ''
  })

  // Filter patients based on user's role and organization
  const getFilteredPatients = () => {
    let filteredPatients = patients

    if (user?.role === 'org_admin' || user?.role === 'practitioner') {
      filteredPatients = patients.filter(p => p.organizationId === user.organizationId)
    }

    if (user?.role === 'patient') {
      // Patients can only see their own record
      filteredPatients = patients.filter(p => getContactValue(p.telecom, 'email') === user.email)
    }

    // Apply search filter
    if (searchTerm) {
      filteredPatients = filteredPatients.filter(p =>
        getDisplayName(p.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getIdentifierValue(p.identifier, CODING_SYSTEMS.MRN).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getContactValue(p.telecom, 'email').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredPatients = filteredPatients.filter(p => 
        statusFilter === 'active' ? p.active === true :
        statusFilter === 'inactive' ? p.active === false :
        false
      )
    }

    // Apply risk filter
    if (riskFilter !== 'all') {
      filteredPatients = filteredPatients.filter(p => p.riskLevel === riskFilter)
    }

    return filteredPatients
  }

  const handleAddPatient = () => {
    console.log('Adding patient:', newPatient)
    setIsAddDialogOpen(false)
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContact: ''
    })
  }

  const filteredPatients = getFilteredPatients()
  const canAddPatients = user?.role === 'super_admin' || user?.role === 'org_admin' || user?.role === 'practitioner'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'patient' 
              ? 'Your health records and information'
              : 'Manage patient records and healthcare information'
            }
          </p>
        </div>
        {canAddPatients && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>Register a new patient in the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input
                      id="patient-name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      placeholder="john.doe@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone</Label>
                    <Input
                      id="patient-phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-dob">Date of Birth</Label>
                    <Input
                      id="patient-dob"
                      type="date"
                      value={newPatient.dateOfBirth}
                      onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-gender">Gender</Label>
                  <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-address">Address</Label>
                  <Input
                    id="patient-address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-emergency">Emergency Contact</Label>
                  <Input
                    id="patient-emergency"
                    value={newPatient.emergencyContact}
                    onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                    placeholder="Jane Doe +1 (555) 987-6543"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPatient} className="medical-button">
                    Register Patient
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
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{filteredPatients.length}</p>
              </div>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
                <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold">{filteredPatients.filter(p => p.active === true).length}</p>
              </div>
              <Badge className="status-active">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold">{filteredPatients.filter(p => p.riskLevel === 'high').length}</p>
              </div>
              <Heart className="h-4 w-4 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments Today</p>
                <p className="text-2xl font-bold">{filteredPatients.filter(p => p.nextAppointment).length}</p>
              </div>
              <Calendar className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      {user?.role !== 'patient' && (
        <Card className="medical-card">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search patients..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Main Content with Tabs */}
      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="patients">Patient Records</TabsTrigger>
          <TabsTrigger value="reports">
            <Activity className="h-4 w-4 mr-2" />
            Medical Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          {/* Patients Table */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>{user?.role === 'patient' ? 'Your Information' : 'Patients'}</CardTitle>
              <CardDescription>
                {user?.role === 'patient' 
                  ? 'Your medical record and health information'
                  : 'Patient records and medical information'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Primary Physician</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{getDisplayName(patient.name)}</p>
                        <p className="text-sm text-muted-foreground">
                          Born: {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getIdentifierValue(patient.identifier, CODING_SYSTEMS.MRN)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {getContactValue(patient.telecom, 'phone')}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {getContactValue(patient.telecom, 'email')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{patient.generalPractitioner?.[0]?.display || 'N/A'}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {patient.lastVisit.toLocaleDateString()}
                    </div>
                    {patient.nextAppointment && (
                      <p className="text-xs text-muted-foreground">
                        Next: {patient.nextAppointment.toLocaleDateString()}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        patient.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                        patient.riskLevel === 'medium' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }
                    >
                      {patient.riskLevel} risk
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={patient.active ? "status-active" : "status-inactive"}>
                      {patient.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canAddPatients && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
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

        <TabsContent value="reports">
          <MedicalReportsTab patientId={user?.id || '1'} />
        </TabsContent>
      </Tabs>
    </div>
  )
}