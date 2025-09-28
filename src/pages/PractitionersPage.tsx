import { useState } from 'react'
import { Plus, Search, Stethoscope, Calendar, Users, Eye, Edit, Phone, Mail, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/AuthContext'

interface Practitioner {
  id: string
  npi: string
  name: string
  email: string
  phone: string
  specialty: string
  department: string
  licenseNumber: string
  education: string
  yearsExperience: number
  patientCount: number
  nextAvailability: Date
  status: 'active' | 'inactive' | 'on-leave'
  organizationId: string
}

const mockPractitioners: Practitioner[] = [
  {
    id: '1',
    npi: '1234567890',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@vitalai.com',
    phone: '+1 (555) 234-5678',
    specialty: 'Cardiology',
    department: 'Cardiology',
    licenseNumber: 'MD-12345',
    education: 'Harvard Medical School',
    yearsExperience: 15,
    patientCount: 89,
    nextAvailability: new Date('2024-01-16T09:00:00'),
    status: 'active',
    organizationId: 'org-1'
  },
  {
    id: '2',
    npi: '2345678901',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@vitalai.com',
    phone: '+1 (555) 345-6789',
    specialty: 'Internal Medicine',
    department: 'Internal Medicine',
    licenseNumber: 'MD-23456',
    education: 'Johns Hopkins University',
    yearsExperience: 12,
    patientCount: 124,
    nextAvailability: new Date('2024-01-16T14:30:00'),
    status: 'active',
    organizationId: 'org-1'
  },
  {
    id: '3',
    npi: '3456789012',
    name: 'Dr. Robert Wilson',
    email: 'robert.wilson@vitalai.com',
    phone: '+1 (555) 456-7890',
    specialty: 'Emergency Medicine',
    department: 'Emergency',
    licenseNumber: 'MD-34567',
    education: 'Stanford University School of Medicine',
    yearsExperience: 8,
    patientCount: 156,
    nextAvailability: new Date('2024-01-15T18:00:00'),
    status: 'on-leave',
    organizationId: 'org-1'
  },
  {
    id: '4',
    npi: '4567890123',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@communityhc.com',
    phone: '+1 (555) 567-8901',
    specialty: 'Pediatrics',
    department: 'Pediatrics',
    licenseNumber: 'MD-45678',
    education: 'University of Pennsylvania',
    yearsExperience: 10,
    patientCount: 78,
    nextAvailability: new Date('2024-01-17T10:00:00'),
    status: 'active',
    organizationId: 'org-2'
  }
]

export function PractitionersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [practitioners] = useState(mockPractitioners)
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPractitioner, setNewPractitioner] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    department: '',
    licenseNumber: '',
    education: '',
    yearsExperience: 0
  })

  // Filter practitioners based on user's role and organization
  const getFilteredPractitioners = () => {
    let filteredPractitioners = practitioners

    if (user?.role === 'org_admin') {
      filteredPractitioners = practitioners.filter(p => p.organizationId === user.organizationId)
    }

    // Apply search filter
    if (searchTerm) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.npi.includes(searchTerm)
      )
    }

    // Apply specialty filter
    if (specialtyFilter !== 'all') {
      filteredPractitioners = filteredPractitioners.filter(p => p.specialty === specialtyFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredPractitioners = filteredPractitioners.filter(p => p.status === statusFilter)
    }

    return filteredPractitioners
  }

  const handleAddPractitioner = () => {
    console.log('Adding practitioner:', newPractitioner)
    setIsAddDialogOpen(false)
    setNewPractitioner({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      department: '',
      licenseNumber: '',
      education: '',
      yearsExperience: 0
    })
  }

  if (user?.role !== 'super_admin' && user?.role !== 'org_admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="medical-card text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only Administrators can access practitioner management.</p>
        </Card>
      </div>
    )
  }

  const filteredPractitioners = getFilteredPractitioners()
  const specialties = [...new Set(practitioners.map(p => p.specialty))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            Practitioner Management
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'super_admin' 
              ? 'Manage all healthcare practitioners across organizations'
              : `Manage practitioners in ${user?.organizationName}`
            }
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="medical-button">
              <Plus className="h-4 w-4 mr-2" />
              Add Practitioner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Practitioner</DialogTitle>
              <DialogDescription>Register a new healthcare practitioner</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prac-name">Full Name</Label>
                  <Input
                    id="prac-name"
                    value={newPractitioner.name}
                    onChange={(e) => setNewPractitioner({...newPractitioner, name: e.target.value})}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prac-email">Email</Label>
                  <Input
                    id="prac-email"
                    type="email"
                    value={newPractitioner.email}
                    onChange={(e) => setNewPractitioner({...newPractitioner, email: e.target.value})}
                    placeholder="john.smith@hospital.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prac-phone">Phone</Label>
                  <Input
                    id="prac-phone"
                    value={newPractitioner.phone}
                    onChange={(e) => setNewPractitioner({...newPractitioner, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prac-license">License Number</Label>
                  <Input
                    id="prac-license"
                    value={newPractitioner.licenseNumber}
                    onChange={(e) => setNewPractitioner({...newPractitioner, licenseNumber: e.target.value})}
                    placeholder="MD-12345"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prac-specialty">Specialty</Label>
                  <Select value={newPractitioner.specialty} onValueChange={(value) => setNewPractitioner({...newPractitioner, specialty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                      <SelectItem value="emergency-medicine">Emergency Medicine</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prac-department">Department</Label>
                  <Input
                    id="prac-department"
                    value={newPractitioner.department}
                    onChange={(e) => setNewPractitioner({...newPractitioner, department: e.target.value})}
                    placeholder="Department name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prac-education">Education</Label>
                  <Input
                    id="prac-education"
                    value={newPractitioner.education}
                    onChange={(e) => setNewPractitioner({...newPractitioner, education: e.target.value})}
                    placeholder="Medical school"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prac-experience">Years of Experience</Label>
                  <Input
                    id="prac-experience"
                    type="number"
                    value={newPractitioner.yearsExperience}
                    onChange={(e) => setNewPractitioner({...newPractitioner, yearsExperience: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPractitioner} className="medical-button">
                  Add Practitioner
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Practitioners</p>
                <p className="text-2xl font-bold">{filteredPractitioners.length}</p>
              </div>
              <Stethoscope className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Practitioners</p>
                <p className="text-2xl font-bold">{filteredPractitioners.filter(p => p.status === 'active').length}</p>
              </div>
              <Badge className="status-active">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{filteredPractitioners.reduce((sum, p) => sum + p.patientCount, 0)}</p>
              </div>
              <Users className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Specialties</p>
                <p className="text-2xl font-bold">{specialties.length}</p>
              </div>
              <GraduationCap className="h-4 w-4 text-warning" />
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
                placeholder="Search practitioners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Practitioners Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Practitioners</CardTitle>
          <CardDescription>Healthcare practitioners and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practitioner</TableHead>
                <TableHead>NPI & License</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Next Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPractitioners.map((practitioner) => (
                <TableRow key={practitioner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{practitioner.name}</p>
                        <p className="text-sm text-muted-foreground">{practitioner.education}</p>
                        <p className="text-xs text-muted-foreground">{practitioner.yearsExperience} years experience</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">NPI: {practitioner.npi}</Badge>
                      <p className="text-sm">License: {practitioner.licenseNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{practitioner.specialty}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{practitioner.department}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {practitioner.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {practitioner.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{practitioner.patientCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {practitioner.nextAvailability.toLocaleDateString()}
                      <br />
                      {practitioner.nextAvailability.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        practitioner.status === 'active' ? "status-active" :
                        practitioner.status === 'on-leave' ? "status-pending" :
                        "status-inactive"
                      }
                    >
                      {practitioner.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4" />
                      </Button>
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