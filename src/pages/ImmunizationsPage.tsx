import { useState } from 'react'
import { Plus, Search, Syringe, Calendar, Shield, AlertTriangle, Eye, Edit, Trash2, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth } from '@/components/AuthContext'

interface Immunization {
  id: string
  patientName: string
  patientId: string
  vaccineName: string
  vaccineCode: string
  administeredDate: Date
  nextDueDate?: Date
  doseNumber: number
  totalDoses: number
  administeredBy: string
  location: string
  manufacturer?: string
  lotNumber?: string
  status: 'completed' | 'due' | 'overdue' | 'not-applicable'
  series?: string
  notes?: string
}

const mockImmunizations: Immunization[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    vaccineName: 'COVID-19 mRNA',
    vaccineCode: 'CVX-208',
    administeredDate: new Date('2023-09-15'),
    nextDueDate: new Date('2024-09-15'),
    doseNumber: 2,
    totalDoses: 2,
    administeredBy: 'Dr. Sarah Johnson',
    location: 'VitalAI Medical Center',
    manufacturer: 'Pfizer-BioNTech',
    lotNumber: 'ABC123',
    status: 'completed',
    series: 'Primary Series'
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    vaccineName: 'Influenza (Seasonal)',
    vaccineCode: 'CVX-161',
    administeredDate: new Date('2023-10-01'),
    nextDueDate: new Date('2024-10-01'),
    doseNumber: 1,
    totalDoses: 1,
    administeredBy: 'Nurse Mary Wilson',
    location: 'Community Health Clinic',
    manufacturer: 'Sanofi Pasteur',
    lotNumber: 'FLU2024',
    status: 'due',
    notes: 'Annual flu vaccination due'
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    vaccineName: 'Tetanus, Diphtheria, Pertussis (Tdap)',
    vaccineCode: 'CVX-115',
    administeredDate: new Date('2019-03-15'),
    nextDueDate: new Date('2024-03-15'),
    doseNumber: 1,
    totalDoses: 1,
    administeredBy: 'Dr. Lisa Anderson',
    location: 'Emergency Department',
    status: 'overdue',
    notes: 'Booster needed for wound care'
  },
  {
    id: '4',
    patientName: 'John Smith',
    patientId: 'P001',
    vaccineName: 'Pneumococcal Conjugate (PCV13)',
    vaccineCode: 'CVX-133',
    administeredDate: new Date('2022-01-15'),
    doseNumber: 1,
    totalDoses: 1,
    administeredBy: 'Dr. Michael Chen',
    location: 'VitalAI Medical Center',
    manufacturer: 'Wyeth Pharmaceuticals',
    status: 'completed'
  }
]

const vaccineSchedule = [
  { vaccine: 'COVID-19', recommended: 'Annual', ageGroup: 'All ages 6mo+' },
  { vaccine: 'Influenza', recommended: 'Annual', ageGroup: 'All ages 6mo+' },
  { vaccine: 'Tdap', recommended: 'Every 10 years', ageGroup: 'Adults' },
  { vaccine: 'Pneumococcal', recommended: 'Age-specific', ageGroup: '65+ or high-risk' },
  { vaccine: 'Shingles (Zoster)', recommended: 'One-time', ageGroup: '50+ years' }
]

export function ImmunizationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [immunizations] = useState(mockImmunizations)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newImmunization, setNewImmunization] = useState({
    patientId: '',
    vaccineName: '',
    doseNumber: '',
    location: '',
    notes: ''
  })

  const getFilteredImmunizations = () => {
    let filteredImms = immunizations

    if (user?.role === 'patient') {
      filteredImms = immunizations.filter(i => i.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredImms = filteredImms.filter(i =>
        i.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.administeredBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredImms = filteredImms.filter(i => i.status === statusFilter)
    }

    return filteredImms
  }

  const handleAddImmunization = () => {
    console.log('Adding immunization:', newImmunization)
    setIsAddDialogOpen(false)
    setNewImmunization({ patientId: '', vaccineName: '', doseNumber: '', location: '', notes: '' })
  }

  const filteredImmunizations = getFilteredImmunizations()
  const overdueCount = filteredImmunizations.filter(i => i.status === 'overdue').length
  const dueCount = filteredImmunizations.filter(i => i.status === 'due').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Syringe className="h-8 w-8 text-primary" />
            Immunizations & Vaccines
          </h1>
          <p className="text-muted-foreground">
            Track vaccination history and manage immunization schedules
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Record Vaccination
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Vaccination</DialogTitle>
                <DialogDescription>Add a new vaccination to patient's immunization record</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imm-patient">Patient</Label>
                    <Select value={newImmunization.patientId} onValueChange={(value) => setNewImmunization({...newImmunization, patientId: value})}>
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
                    <Label htmlFor="imm-vaccine">Vaccine</Label>
                    <Select value={newImmunization.vaccineName} onValueChange={(value) => setNewImmunization({...newImmunization, vaccineName: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vaccine" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="COVID-19 mRNA">COVID-19 mRNA</SelectItem>
                        <SelectItem value="Influenza (Seasonal)">Influenza (Seasonal)</SelectItem>
                        <SelectItem value="Tdap">Tetanus, Diphtheria, Pertussis</SelectItem>
                        <SelectItem value="Pneumococcal">Pneumococcal</SelectItem>
                        <SelectItem value="Shingles (Zoster)">Shingles (Zoster)</SelectItem>
                        <SelectItem value="MMR">Measles, Mumps, Rubella</SelectItem>
                        <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imm-dose">Dose Number</Label>
                    <Select value={newImmunization.doseNumber} onValueChange={(value) => setNewImmunization({...newImmunization, doseNumber: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dose" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="1">Dose 1</SelectItem>
                        <SelectItem value="2">Dose 2</SelectItem>
                        <SelectItem value="3">Dose 3</SelectItem>
                        <SelectItem value="Booster">Booster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imm-location">Administration Site</Label>
                    <Input
                      id="imm-location"
                      value={newImmunization.location}
                      onChange={(e) => setNewImmunization({...newImmunization, location: e.target.value})}
                      placeholder="Left deltoid, Right thigh..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imm-notes">Notes</Label>
                  <Input
                    id="imm-notes"
                    value={newImmunization.notes}
                    onChange={(e) => setNewImmunization({...newImmunization, notes: e.target.value})}
                    placeholder="Patient tolerating well, no adverse reactions..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddImmunization} className="medical-button">
                    Record Vaccination
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Alerts for Overdue Vaccinations */}
      {overdueCount > 0 && (
        <Alert className="border-error bg-error/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overdue Vaccinations</AlertTitle>
          <AlertDescription>
            {overdueCount} vaccination{overdueCount > 1 ? 's are' : ' is'} overdue and require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Immunizations</p>
                <p className="text-2xl font-bold">{filteredImmunizations.length}</p>
              </div>
              <Syringe className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Up to Date</p>
                <p className="text-2xl font-bold">{filteredImmunizations.filter(i => i.status === 'completed').length}</p>
              </div>
              <Shield className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold">{dueCount}</p>
              </div>
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueCount}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-error" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Schedule */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Recommended Vaccination Schedule</CardTitle>
          <CardDescription>Standard immunization recommendations for adults</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vaccineSchedule.map((schedule, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Syringe className="h-4 w-4 text-primary" />
                  <span className="font-medium">{schedule.vaccine}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Frequency: {schedule.recommended}
                </div>
                <div className="text-sm text-muted-foreground">
                  Age Group: {schedule.ageGroup}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search immunizations..."
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
                <SelectItem value="all">All Vaccinations</SelectItem>
                <SelectItem value="completed">Up to Date</SelectItem>
                <SelectItem value="due">Due Soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Immunizations Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Immunization History</CardTitle>
          <CardDescription>Complete vaccination records and schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Vaccine</TableHead>
                <TableHead>Dose Progress</TableHead>
                <TableHead>Administered</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImmunizations.map((imm) => (
                <TableRow key={imm.id}>
                  <TableCell>
                    <div className="font-medium">{imm.patientName}</div>
                    <div className="text-sm text-muted-foreground">ID: {imm.patientId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Syringe className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">{imm.vaccineName}</div>
                        {imm.series && (
                          <div className="text-sm text-muted-foreground">{imm.series}</div>
                        )}
                        {imm.vaccineCode && (
                          <div className="text-xs text-muted-foreground">{imm.vaccineCode}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Dose {imm.doseNumber} of {imm.totalDoses}
                      </div>
                      <Progress 
                        value={(imm.doseNumber / imm.totalDoses) * 100} 
                        className="w-20 h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {imm.administeredDate.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">{imm.location}</div>
                    {imm.manufacturer && (
                      <div className="text-xs text-muted-foreground">{imm.manufacturer}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {imm.nextDueDate ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {imm.nextDueDate.toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{imm.administeredBy}</div>
                    {imm.lotNumber && (
                      <div className="text-xs text-muted-foreground">Lot: {imm.lotNumber}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        imm.status === 'completed' ? "status-active" :
                        imm.status === 'due' ? "status-warning" :
                        imm.status === 'overdue' ? "status-critical" :
                        "status-inactive"
                      }
                    >
                      {imm.status === 'completed' ? 'Up to Date' :
                       imm.status === 'due' ? 'Due Soon' :
                       imm.status === 'overdue' ? 'Overdue' :
                       'N/A'}
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