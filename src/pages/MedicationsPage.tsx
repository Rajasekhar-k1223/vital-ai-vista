import { useState } from 'react'
import { Plus, Search, Pill, AlertTriangle, Calendar, Clock, Eye, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth } from '@/components/AuthContext'

interface Medication {
  id: string
  patientName: string
  patientId: string
  medicationName: string
  dosage: string
  frequency: string
  route: string
  startDate: Date
  endDate?: Date
  status: 'active' | 'completed' | 'stopped' | 'suspended'
  prescribedBy: string
  instructions: string
  refillsRemaining: number
  lastTaken?: Date
  sideEffects?: string[]
  interactions?: string[]
}

interface Allergy {
  id: string
  patientName: string
  patientId: string
  allergen: string
  reaction: string
  severity: 'mild' | 'moderate' | 'severe'
  onsetDate?: Date
  notes?: string
}

const mockMedications: Medication[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'Oral',
    startDate: new Date('2024-01-01'),
    status: 'active',
    prescribedBy: 'Dr. Sarah Johnson',
    instructions: 'Take with food in the morning',
    refillsRemaining: 3,
    lastTaken: new Date('2024-01-15T08:00:00')
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'Oral',
    startDate: new Date('2023-12-15'),
    status: 'active',
    prescribedBy: 'Dr. Michael Chen',
    instructions: 'Take with meals to reduce stomach upset',
    refillsRemaining: 2,
    lastTaken: new Date('2024-01-15T19:00:00'),
    interactions: ['Alcohol']
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    route: 'Oral',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-20'),
    status: 'completed',
    prescribedBy: 'Dr. Lisa Anderson',
    instructions: 'Complete full course even if feeling better',
    refillsRemaining: 0,
    sideEffects: ['Nausea', 'Diarrhea']
  }
]

const mockAllergies: Allergy[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    allergen: 'Penicillin',
    reaction: 'Skin rash, hives',
    severity: 'moderate',
    onsetDate: new Date('2020-03-15'),
    notes: 'Developed after antibiotic course in 2020'
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    allergen: 'Shellfish',
    reaction: 'Anaphylaxis',
    severity: 'severe',
    onsetDate: new Date('2018-07-22'),
    notes: 'Carries EpiPen at all times'
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    allergen: 'Latex',
    reaction: 'Contact dermatitis',
    severity: 'mild',
    notes: 'Avoid latex gloves during procedures'
  }
]

export function MedicationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [medications] = useState(mockMedications)
  const [allergies] = useState(mockAllergies)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddMedDialogOpen, setIsAddMedDialogOpen] = useState(false)
  const [isAddAllergyDialogOpen, setIsAddAllergyDialogOpen] = useState(false)
  const [newMedication, setNewMedication] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    route: '',
    instructions: ''
  })
  const [newAllergy, setNewAllergy] = useState({
    patientId: '',
    allergen: '',
    reaction: '',
    severity: '' as 'mild' | 'moderate' | 'severe',
    notes: ''
  })

  const getFilteredMedications = () => {
    let filteredMeds = medications

    if (user?.role === 'patient') {
      filteredMeds = medications.filter(m => m.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredMeds = filteredMeds.filter(m =>
        m.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredMeds = filteredMeds.filter(m => m.status === statusFilter)
    }

    return filteredMeds
  }

  const getFilteredAllergies = () => {
    let filteredAllergies = allergies

    if (user?.role === 'patient') {
      filteredAllergies = allergies.filter(a => a.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredAllergies = filteredAllergies.filter(a =>
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.allergen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reaction.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filteredAllergies
  }

  const handleAddMedication = () => {
    console.log('Adding medication:', newMedication)
    setIsAddMedDialogOpen(false)
    setNewMedication({ patientId: '', medicationName: '', dosage: '', frequency: '', route: '', instructions: '' })
  }

  const handleAddAllergy = () => {
    console.log('Adding allergy:', newAllergy)
    setIsAddAllergyDialogOpen(false)
    setNewAllergy({ patientId: '', allergen: '', reaction: '', severity: 'mild', notes: '' })
  }

  const filteredMedications = getFilteredMedications()
  const filteredAllergies = getFilteredAllergies()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Pill className="h-8 w-8 text-primary" />
            Medications & Allergies
          </h1>
          <p className="text-muted-foreground">
            Manage patient medications, prescriptions, and allergy records
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role !== 'patient' && (
            <>
              <Dialog open={isAddMedDialogOpen} onOpenChange={setIsAddMedDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="medical-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-popover max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Prescribe New Medication</DialogTitle>
                    <DialogDescription>Add a new medication to patient's treatment plan</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="med-patient">Patient</Label>
                        <Select value={newMedication.patientId} onValueChange={(value) => setNewMedication({...newMedication, patientId: value})}>
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
                        <Label htmlFor="med-name">Medication Name</Label>
                        <Input
                          id="med-name"
                          value={newMedication.medicationName}
                          onChange={(e) => setNewMedication({...newMedication, medicationName: e.target.value})}
                          placeholder="Lisinopril, Metformin..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="med-dosage">Dosage</Label>
                        <Input
                          id="med-dosage"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                          placeholder="10mg, 500mg..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="med-frequency">Frequency</Label>
                        <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Once daily">Once daily</SelectItem>
                            <SelectItem value="Twice daily">Twice daily</SelectItem>
                            <SelectItem value="Three times daily">Three times daily</SelectItem>
                            <SelectItem value="Four times daily">Four times daily</SelectItem>
                            <SelectItem value="As needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="med-route">Route</Label>
                        <Select value={newMedication.route} onValueChange={(value) => setNewMedication({...newMedication, route: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Oral">Oral</SelectItem>
                            <SelectItem value="Intravenous">Intravenous</SelectItem>
                            <SelectItem value="Intramuscular">Intramuscular</SelectItem>
                            <SelectItem value="Topical">Topical</SelectItem>
                            <SelectItem value="Subcutaneous">Subcutaneous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med-instructions">Instructions</Label>
                      <Input
                        id="med-instructions"
                        value={newMedication.instructions}
                        onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                        placeholder="Take with food, avoid alcohol..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddMedDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMedication} className="medical-button">
                        Prescribe Medication
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddAllergyDialogOpen} onOpenChange={setIsAddAllergyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Add Allergy
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-popover">
                  <DialogHeader>
                    <DialogTitle>Record New Allergy</DialogTitle>
                    <DialogDescription>Add a new allergy to patient's medical record</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="allergy-patient">Patient</Label>
                      <Select value={newAllergy.patientId} onValueChange={(value) => setNewAllergy({...newAllergy, patientId: value})}>
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
                        <Label htmlFor="allergy-allergen">Allergen</Label>
                        <Input
                          id="allergy-allergen"
                          value={newAllergy.allergen}
                          onChange={(e) => setNewAllergy({...newAllergy, allergen: e.target.value})}
                          placeholder="Penicillin, Shellfish, Latex..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="allergy-severity">Severity</Label>
                        <Select value={newAllergy.severity} onValueChange={(value) => setNewAllergy({...newAllergy, severity: value as 'mild' | 'moderate' | 'severe'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergy-reaction">Reaction</Label>
                      <Input
                        id="allergy-reaction"
                        value={newAllergy.reaction}
                        onChange={(e) => setNewAllergy({...newAllergy, reaction: e.target.value})}
                        placeholder="Hives, rash, swelling, anaphylaxis..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergy-notes">Additional Notes</Label>
                      <Input
                        id="allergy-notes"
                        value={newAllergy.notes}
                        onChange={(e) => setNewAllergy({...newAllergy, notes: e.target.value})}
                        placeholder="Carries EpiPen, avoid during procedures..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddAllergyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAllergy} className="medical-button">
                        Record Allergy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* AI Drug Interaction Alert */}
      {filteredMedications.some(m => m.interactions && m.interactions.length > 0) && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>AI Drug Interaction Alert</AlertTitle>
          <AlertDescription>
            Potential drug interactions detected. Review patient medications for safety concerns.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Medications</p>
                <p className="text-2xl font-bold">{filteredMedications.filter(m => m.status === 'active').length}</p>
              </div>
              <Pill className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Known Allergies</p>
                <p className="text-2xl font-bold">{filteredAllergies.length}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Refills Due</p>
                <p className="text-2xl font-bold">{filteredMedications.filter(m => m.refillsRemaining <= 1).length}</p>
              </div>
              <Clock className="h-4 w-4 text-error" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{filteredMedications.filter(m => m.status === 'completed').length}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-success" />
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
                placeholder="Search medications and allergies..."
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
                <SelectItem value="all">All Medications</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="medications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Patient medication list and prescription details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage & Frequency</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refills</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>
                        <div className="font-medium">{med.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {med.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{med.medicationName}</div>
                            <div className="text-sm text-muted-foreground">{med.route}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{med.dosage}</div>
                        <div className="text-sm text-muted-foreground">{med.frequency}</div>
                        <div className="text-xs text-muted-foreground mt-1">{med.instructions}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{med.prescribedBy}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {med.startDate.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            med.status === 'active' ? "status-active" :
                            med.status === 'completed' ? "status-success" :
                            med.status === 'stopped' ? "status-inactive" :
                            "status-warning"
                          }
                        >
                          {med.status}
                        </Badge>
                        {med.interactions && (
                          <Badge className="status-critical mt-1">Interaction Risk</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${med.refillsRemaining <= 1 ? 'text-error' : ''}`}>
                          {med.refillsRemaining} left
                        </div>
                        {med.lastTaken && (
                          <div className="text-sm text-muted-foreground">
                            Last: {med.lastTaken.toLocaleDateString()}
                          </div>
                        )}
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

        <TabsContent value="allergies" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Known Allergies</CardTitle>
              <CardDescription>Patient allergy records and reactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Allergen</TableHead>
                    <TableHead>Reaction</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Onset Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllergies.map((allergy) => (
                    <TableRow key={allergy.id}>
                      <TableCell>
                        <div className="font-medium">{allergy.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {allergy.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="font-medium">{allergy.allergen}</span>
                        </div>
                      </TableCell>
                      <TableCell>{allergy.reaction}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            allergy.severity === 'severe' ? "status-critical" :
                            allergy.severity === 'moderate' ? "status-warning" :
                            "status-info"
                          }
                        >
                          {allergy.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {allergy.onsetDate ? allergy.onsetDate.toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm">{allergy.notes || '-'}</span>
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
      </Tabs>
    </div>
  )
}