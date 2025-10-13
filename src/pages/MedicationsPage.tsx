import { useState } from 'react'
import { Plus, Search, Pill, AlertTriangle, Calendar, Clock, Eye, Edit, Trash2, CheckCircle, X } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/AuthContext'
import type { MedicationRequest } from '@/types/fhir/Medication'
import type { AllergyIntolerance } from '@/types/fhir/AllergyIntolerance'
import { createCodeableConcept, createReference, getCodeDisplay, CODING_SYSTEMS, getIdentifierValue, formatFHIRDate } from '@/lib/fhir-utils'

const mockMedications: MedicationRequest[] = [
  {
    resourceType: 'MedicationRequest',
    id: 'med-001',
    identifier: [{ system: CODING_SYSTEMS.MRN, value: 'MED-001', use: 'official' }],
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: createCodeableConcept(CODING_SYSTEMS.RXNORM, '104375', 'Lisinopril 10mg Oral Tablet'),
    subject: createReference('Patient', 'P001', 'John Smith'),
    authoredOn: '2024-01-01',
    requester: createReference('Practitioner', 'PR001', 'Dr. Sarah Johnson'),
    dosageInstruction: [{
      text: 'Take with food in the morning',
      timing: { code: createCodeableConcept('http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation', 'QD', 'Once daily') },
      route: createCodeableConcept(CODING_SYSTEMS.SNOMED, '26643006', 'Oral'),
      doseAndRate: [{ doseQuantity: { value: 10, unit: 'mg', system: CODING_SYSTEMS.UCUM, code: 'mg' } }]
    }],
    dispenseRequest: { numberOfRepeatsAllowed: 3, quantity: { value: 30, unit: 'tablets' } }
  },
  {
    resourceType: 'MedicationRequest',
    id: 'med-002',
    identifier: [{ system: CODING_SYSTEMS.MRN, value: 'MED-002', use: 'official' }],
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: createCodeableConcept(CODING_SYSTEMS.RXNORM, '6809', 'Metformin 500mg Oral Tablet'),
    subject: createReference('Patient', 'P002', 'Emily Davis'),
    authoredOn: '2023-12-15',
    requester: createReference('Practitioner', 'PR002', 'Dr. Michael Chen'),
    dosageInstruction: [{
      text: 'Take with meals to reduce stomach upset',
      timing: { code: createCodeableConcept('http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation', 'BID', 'Twice daily') },
      route: createCodeableConcept(CODING_SYSTEMS.SNOMED, '26643006', 'Oral'),
      doseAndRate: [{ doseQuantity: { value: 500, unit: 'mg', system: CODING_SYSTEMS.UCUM, code: 'mg' } }]
    }],
    dispenseRequest: { numberOfRepeatsAllowed: 2, quantity: { value: 60, unit: 'tablets' } }
  }
]

const mockAllergies: AllergyIntolerance[] = [
  {
    resourceType: 'AllergyIntolerance',
    id: 'allergy-001',
    identifier: [{ system: CODING_SYSTEMS.MRN, value: 'ALG-001', use: 'official' }],
    clinicalStatus: createCodeableConcept('http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', 'active', 'Active'),
    verificationStatus: createCodeableConcept('http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', 'confirmed', 'Confirmed'),
    type: 'allergy',
    category: ['medication'],
    criticality: 'high',
    code: createCodeableConcept(CODING_SYSTEMS.RXNORM, '7980', 'Penicillin'),
    patient: createReference('Patient', 'P001', 'John Smith'),
    onsetDateTime: '2020-03-15',
    recordedDate: '2020-03-15',
    reaction: [{
      manifestation: [createCodeableConcept(CODING_SYSTEMS.SNOMED, '271807003', 'Skin rash')],
      severity: 'moderate',
      description: 'Skin rash and hives developed after antibiotic course'
    }]
  },
  {
    resourceType: 'AllergyIntolerance',
    id: 'allergy-002',
    identifier: [{ system: CODING_SYSTEMS.MRN, value: 'ALG-002', use: 'official' }],
    clinicalStatus: createCodeableConcept('http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', 'active', 'Active'),
    verificationStatus: createCodeableConcept('http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', 'confirmed', 'Confirmed'),
    type: 'allergy',
    category: ['food'],
    criticality: 'high',
    code: createCodeableConcept(CODING_SYSTEMS.SNOMED, '300913006', 'Shellfish'),
    patient: createReference('Patient', 'P002', 'Emily Davis'),
    onsetDateTime: '2018-07-22',
    recordedDate: '2018-07-22',
    reaction: [{
      manifestation: [createCodeableConcept(CODING_SYSTEMS.SNOMED, '39579001', 'Anaphylaxis')],
      severity: 'severe',
      description: 'Carries EpiPen at all times'
    }]
  }
]

export function MedicationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [medications] = useState(mockMedications)
  const [allergies] = useState(mockAllergies)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMed, setSelectedMed] = useState<MedicationRequest | null>(null)
  const [selectedAllergy, setSelectedAllergy] = useState<AllergyIntolerance | null>(null)
  const [isViewMedOpen, setIsViewMedOpen] = useState(false)
  const [isViewAllergyOpen, setIsViewAllergyOpen] = useState(false)
  const [isAddMedDialogOpen, setIsAddMedDialogOpen] = useState(false)
  const [isAddAllergyDialogOpen, setIsAddAllergyDialogOpen] = useState(false)

  const getFilteredMedications = () => {
    let filteredMeds = medications
    if (user?.role === 'patient') {
      filteredMeds = medications.filter(m => m.subject?.reference === 'Patient/P001')
    }
    if (searchTerm) {
      filteredMeds = filteredMeds.filter(m =>
        getCodeDisplay(m.medicationCodeableConcept).toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.display?.toLowerCase().includes(searchTerm.toLowerCase())
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
      filteredAllergies = allergies.filter(a => a.patient?.reference === 'Patient/P001')
    }
    if (searchTerm) {
      filteredAllergies = filteredAllergies.filter(a =>
        getCodeDisplay(a.code).toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patient?.display?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filteredAllergies
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
            FHIR R4 MedicationRequest and AllergyIntolerance resources
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
                <DialogContent className="bg-popover max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Prescribe New Medication</DialogTitle>
                    <DialogDescription>Create new FHIR MedicationRequest resource</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="text-sm text-muted-foreground">FHIR R4 MedicationRequest form would go here</div>
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
                <DialogContent className="bg-popover max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Record New Allergy</DialogTitle>
                    <DialogDescription>Create new FHIR AllergyIntolerance resource</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="text-sm text-muted-foreground">FHIR R4 AllergyIntolerance form would go here</div>
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
                <p className="text-2xl font-bold">{filteredMedications.filter(m => (m.dispenseRequest?.numberOfRepeatsAllowed || 0) <= 1).length}</p>
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
              <CardTitle>Medication Requests (FHIR R4)</CardTitle>
              <CardDescription>MedicationRequest resources with RxNorm coding</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication (RxNorm)</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Prescriber</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refills</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>
                        <div className="font-medium">{med.subject?.display}</div>
                        <div className="text-sm text-muted-foreground">{med.subject?.reference}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{getCodeDisplay(med.medicationCodeableConcept)}</div>
                            <div className="text-sm text-muted-foreground">
                              {med.medicationCodeableConcept?.coding?.[0]?.code}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{med.dosageInstruction?.[0]?.text}</div>
                        <div className="text-xs text-muted-foreground">
                          {getCodeDisplay(med.dosageInstruction?.[0]?.timing?.code)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{med.requester?.display}</div>
                        <div className="text-sm text-muted-foreground">{med.authoredOn}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={med.status === 'active' ? "status-active" : "status-inactive"}>
                          {med.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{med.dispenseRequest?.numberOfRepeatsAllowed || 0} left</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setSelectedMed(med); setIsViewMedOpen(true); }}>
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
              <CardTitle>Allergy Intolerances (FHIR R4)</CardTitle>
              <CardDescription>AllergyIntolerance resources with SNOMED/RxNorm coding</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Allergen</TableHead>
                    <TableHead>Reaction</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllergies.map((allergy) => (
                    <TableRow key={allergy.id}>
                      <TableCell>
                        <div className="font-medium">{allergy.patient?.display}</div>
                        <div className="text-sm text-muted-foreground">{allergy.patient?.reference}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <div>
                            <span className="font-medium">{getCodeDisplay(allergy.code)}</span>
                            <div className="text-xs text-muted-foreground">{allergy.code?.coding?.[0]?.code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {allergy.reaction?.[0]?.manifestation.map(m => getCodeDisplay(m)).join(', ')}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          allergy.reaction?.[0]?.severity === 'severe' ? "status-critical" :
                          allergy.reaction?.[0]?.severity === 'moderate' ? "status-warning" :
                          "status-info"
                        }>
                          {allergy.reaction?.[0]?.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{allergy.category?.[0]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="status-active">
                          {getCodeDisplay(allergy.clinicalStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setSelectedAllergy(allergy); setIsViewAllergyOpen(true); }}>
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

      {/* View Medication Dialog */}
      <Dialog open={isViewMedOpen} onOpenChange={setIsViewMedOpen}>
        <DialogContent className="bg-popover max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medication Request Details</DialogTitle>
            <DialogDescription>FHIR R4 MedicationRequest Resource</DialogDescription>
          </DialogHeader>
          {selectedMed && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Resource Type</Label>
                  <p className="font-medium">{selectedMed.resourceType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Resource ID</Label>
                  <p className="font-medium">{selectedMed.id}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Medication (RxNorm)</Label>
                <p className="font-medium text-lg">{getCodeDisplay(selectedMed.medicationCodeableConcept)}</p>
                <p className="text-sm text-muted-foreground">Code: {selectedMed.medicationCodeableConcept?.coding?.[0]?.code}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Patient</Label>
                  <p className="font-medium">{selectedMed.subject?.display}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prescriber</Label>
                  <p className="font-medium">{selectedMed.requester?.display}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Dosage Instructions</Label>
                <p className="font-medium">{selectedMed.dosageInstruction?.[0]?.text}</p>
                <p className="text-sm text-muted-foreground">
                  Route: {getCodeDisplay(selectedMed.dosageInstruction?.[0]?.route)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className="status-active">{selectedMed.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Intent</Label>
                  <p className="font-medium">{selectedMed.intent}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Authored On</Label>
                  <p className="font-medium">{selectedMed.authoredOn}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Dispense Request</Label>
                <p className="text-sm">Quantity: {selectedMed.dispenseRequest?.quantity?.value} {selectedMed.dispenseRequest?.quantity?.unit}</p>
                <p className="text-sm">Refills: {selectedMed.dispenseRequest?.numberOfRepeatsAllowed}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Allergy Dialog */}
      <Dialog open={isViewAllergyOpen} onOpenChange={setIsViewAllergyOpen}>
        <DialogContent className="bg-popover max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Allergy Intolerance Details</DialogTitle>
            <DialogDescription>FHIR R4 AllergyIntolerance Resource</DialogDescription>
          </DialogHeader>
          {selectedAllergy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Resource Type</Label>
                  <p className="font-medium">{selectedAllergy.resourceType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Resource ID</Label>
                  <p className="font-medium">{selectedAllergy.id}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Allergen</Label>
                <p className="font-medium text-lg">{getCodeDisplay(selectedAllergy.code)}</p>
                <p className="text-sm text-muted-foreground">Code: {selectedAllergy.code?.coding?.[0]?.code}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Patient</Label>
                  <p className="font-medium">{selectedAllergy.patient?.display}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <Badge variant="outline">{selectedAllergy.category?.[0]}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedAllergy.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Criticality</Label>
                  <Badge className={selectedAllergy.criticality === 'high' ? "status-critical" : "status-info"}>
                    {selectedAllergy.criticality}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Onset Date</Label>
                  <p className="font-medium">{selectedAllergy.onsetDateTime}</p>
                </div>
              </div>
              {selectedAllergy.reaction && selectedAllergy.reaction.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Reaction</Label>
                  <div className="space-y-2 mt-2">
                    {selectedAllergy.reaction.map((reaction, idx) => (
                      <div key={idx} className="border p-3 rounded-lg">
                        <p className="font-medium">Manifestation: {reaction.manifestation.map(m => getCodeDisplay(m)).join(', ')}</p>
                        <p className="text-sm">Severity: <Badge className="status-warning">{reaction.severity}</Badge></p>
                        {reaction.description && <p className="text-sm text-muted-foreground">{reaction.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Clinical Status</Label>
                  <Badge className="status-active">{getCodeDisplay(selectedAllergy.clinicalStatus)}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Verification Status</Label>
                  <Badge className="status-success">{getCodeDisplay(selectedAllergy.verificationStatus)}</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
