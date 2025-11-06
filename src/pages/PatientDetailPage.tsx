import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Activity, FileText, 
  Pill, TestTube, DollarSign, AlertTriangle, Heart, Stethoscope, 
  ClipboardList, Download, Eye, Plus, Edit
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { 
  getDisplayName, 
  getContactValue, 
  getAddressText,
  getIdentifierValue,
  getCodeDisplay,
  CODING_SYSTEMS,
  LOINC_CODES,
  SNOMED_CODES,
  RXNORM_CODES,
  createCodeableConcept,
  getStatusColor
} from '@/lib/fhir-utils'
import type { Patient } from '@/types/fhir/Patient'
import type { AllergyIntolerance } from '@/types/fhir/AllergyIntolerance'
import type { MedicationRequest } from '@/types/fhir/Medication'
import type { Observation } from '@/types/fhir/Observation'
import type { DiagnosticReport } from '@/types/fhir/DiagnosticReport'
import type { Claim } from '@/types/fhir/Claim'

export default function PatientDetailPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()

  // Mock patient data - replace with actual data fetching
  const patient: Patient = {
    resourceType: 'Patient',
    id: patientId,
    identifier: [{ system: CODING_SYSTEMS.MRN, value: 'MRN001234' }],
    active: true,
    name: [{ use: 'official', family: 'Anderson', given: ['John', 'Michael'], text: 'John Michael Anderson' }],
    telecom: [
      { system: 'email', value: 'john.anderson@email.com', use: 'home' },
      { system: 'phone', value: '+1 (555) 123-4567', use: 'mobile' }
    ],
    gender: 'male',
    birthDate: '1985-03-15',
    address: [{ 
      use: 'home', 
      line: ['123 Main St', 'Apt 4B'], 
      city: 'Springfield', 
      state: 'IL', 
      postalCode: '62701',
      text: '123 Main St, Apt 4B, Springfield, IL 62701'
    }],
    maritalStatus: { text: 'Married' },
    contact: [{
      relationship: [{ text: 'Emergency Contact - Spouse' }],
      name: { text: 'Jane Anderson' },
      telecom: [{ system: 'phone', value: '+1 (555) 987-6543' }]
    }],
    generalPractitioner: [{ display: 'Dr. Michael Chen, MD' }]
  }

  // Mock clinical data
  const problems = [
    {
      id: '1',
      code: createCodeableConcept(CODING_SYSTEMS.SNOMED, SNOMED_CODES.HYPERTENSION, 'Essential Hypertension'),
      clinicalStatus: 'active',
      severity: 'moderate',
      onsetDate: '2020-05-10',
      notes: 'Well controlled with medication'
    },
    {
      id: '2',
      code: createCodeableConcept(CODING_SYSTEMS.SNOMED, SNOMED_CODES.DIABETES_MELLITUS, 'Type 2 Diabetes Mellitus'),
      clinicalStatus: 'active',
      severity: 'mild',
      onsetDate: '2021-03-15',
      notes: 'Diet controlled, HbA1c stable'
    }
  ]

  const allergies: AllergyIntolerance[] = [
    {
      resourceType: 'AllergyIntolerance',
      id: '1',
      patient: { reference: `Patient/${patientId}` },
      clinicalStatus: { text: 'Active' },
      type: 'allergy',
      category: ['medication'],
      criticality: 'high',
      code: { text: 'Penicillin' },
      recordedDate: '2015-08-20',
      reaction: [{
        manifestation: [{ text: 'Anaphylaxis' }],
        severity: 'severe'
      }]
    },
    {
      resourceType: 'AllergyIntolerance',
      id: '2',
      patient: { reference: `Patient/${patientId}` },
      clinicalStatus: { text: 'Active' },
      type: 'allergy',
      category: ['food'],
      criticality: 'low',
      code: { text: 'Shellfish' },
      recordedDate: '2018-04-12',
      reaction: [{
        manifestation: [{ text: 'Hives' }],
        severity: 'mild'
      }]
    }
  ]

  const medications: MedicationRequest[] = [
    {
      resourceType: 'MedicationRequest',
      id: '1',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: createCodeableConcept(CODING_SYSTEMS.RXNORM, RXNORM_CODES.LISINOPRIL, 'Lisinopril 10mg'),
      subject: { reference: `Patient/${patientId}` },
      authoredOn: '2024-01-01',
      dosageInstruction: [{
        text: 'Take 1 tablet by mouth once daily',
        timing: { code: { text: 'Once daily' } },
        route: { text: 'Oral' },
        doseAndRate: [{ doseQuantity: { value: 1, unit: 'tablet' } }]
      }],
      dispenseRequest: {
        quantity: { value: 90, unit: 'tablet' },
        expectedSupplyDuration: { value: 90, unit: 'days' }
      }
    },
    {
      resourceType: 'MedicationRequest',
      id: '2',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: createCodeableConcept(CODING_SYSTEMS.RXNORM, RXNORM_CODES.METFORMIN, 'Metformin 500mg'),
      subject: { reference: `Patient/${patientId}` },
      authoredOn: '2024-01-01',
      dosageInstruction: [{
        text: 'Take 1 tablet by mouth twice daily with meals',
        timing: { code: { text: 'Twice daily' } },
        route: { text: 'Oral' },
        doseAndRate: [{ doseQuantity: { value: 1, unit: 'tablet' } }]
      }],
      dispenseRequest: {
        quantity: { value: 180, unit: 'tablet' },
        expectedSupplyDuration: { value: 90, unit: 'days' }
      }
    }
  ]

  const vitalSigns: Observation[] = [
    {
      resourceType: 'Observation',
      id: '1',
      status: 'final',
      code: createCodeableConcept(CODING_SYSTEMS.LOINC, LOINC_CODES.BLOOD_PRESSURE, 'Blood Pressure'),
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: '2024-01-15T10:30:00Z',
      component: [
        {
          code: createCodeableConcept(CODING_SYSTEMS.LOINC, LOINC_CODES.SYSTOLIC_BP, 'Systolic BP'),
          valueQuantity: { value: 128, unit: 'mmHg' }
        },
        {
          code: createCodeableConcept(CODING_SYSTEMS.LOINC, LOINC_CODES.DIASTOLIC_BP, 'Diastolic BP'),
          valueQuantity: { value: 82, unit: 'mmHg' }
        }
      ]
    },
    {
      resourceType: 'Observation',
      id: '2',
      status: 'final',
      code: createCodeableConcept(CODING_SYSTEMS.LOINC, LOINC_CODES.GLUCOSE, 'Blood Glucose'),
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: '2024-01-15T10:30:00Z',
      valueQuantity: { value: 105, unit: 'mg/dL' },
      referenceRange: [{
        low: { value: 70, unit: 'mg/dL' },
        high: { value: 100, unit: 'mg/dL' }
      }]
    }
  ]

  const labResults: DiagnosticReport[] = [
    {
      resourceType: 'DiagnosticReport',
      id: '1',
      status: 'final',
      code: createCodeableConcept(CODING_SYSTEMS.LOINC, '24331-1', 'Lipid Panel'),
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: '2024-01-10T08:00:00Z',
      issued: '2024-01-10T14:00:00Z',
      conclusion: 'Cholesterol levels within normal range. Continue current management.'
    },
    {
      resourceType: 'DiagnosticReport',
      id: '2',
      status: 'final',
      code: createCodeableConcept(CODING_SYSTEMS.LOINC, '4548-4', 'HbA1c'),
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: '2024-01-10T08:00:00Z',
      issued: '2024-01-10T14:00:00Z',
      conclusion: 'HbA1c: 6.2% - Good diabetic control maintained.'
    }
  ]

  const recommendedTests = [
    { name: 'Annual Physical Exam', dueDate: '2024-03-15', priority: 'routine' },
    { name: 'HbA1c Follow-up', dueDate: '2024-04-01', priority: 'important' },
    { name: 'Lipid Panel', dueDate: '2024-07-01', priority: 'routine' }
  ]

  const billing: Claim[] = [
    {
      resourceType: 'Claim',
      id: '1',
      status: 'active',
      use: 'claim',
      priority: createCodeableConcept('http://terminology.hl7.org/CodeSystem/processpriority', 'normal', 'Normal'),
      type: createCodeableConcept('http://terminology.hl7.org/CodeSystem/claim-type', 'professional', 'Professional'),
      patient: { reference: `Patient/${patientId}` },
      created: '2024-01-15',
      provider: { display: 'Springfield Medical Center' },
      total: { value: 350, currency: 'USD' },
      insurance: [{
        sequence: 1,
        focal: true,
        coverage: { display: 'Blue Cross Blue Shield' }
      }]
    },
    {
      resourceType: 'Claim',
      id: '2',
      status: 'active',
      use: 'claim',
      priority: createCodeableConcept('http://terminology.hl7.org/CodeSystem/processpriority', 'normal', 'Normal'),
      type: createCodeableConcept('http://terminology.hl7.org/CodeSystem/claim-type', 'professional', 'Professional'),
      patient: { reference: `Patient/${patientId}` },
      created: '2024-01-10',
      provider: { display: 'Springfield Lab Services' },
      total: { value: 180, currency: 'USD' },
      insurance: [{
        sequence: 1,
        focal: true,
        coverage: { display: 'Blue Cross Blue Shield' }
      }]
    }
  ]

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/patients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{getDisplayName(patient.name)}</h1>
            <p className="text-muted-foreground">
              MRN: {getIdentifierValue(patient.identifier, CODING_SYSTEMS.MRN)} | 
              Age: {patient.birthDate ? calculateAge(patient.birthDate) : 'N/A'} | 
              Gender: {patient.gender}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Record
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>
      </div>

      {/* Patient Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {getContactValue(patient.telecom, 'phone')}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {getContactValue(patient.telecom, 'email')}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {getAddressText(patient.address)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Primary Care
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{patient.generalPractitioner?.[0]?.display || 'Not assigned'}</p>
            <p className="text-sm text-muted-foreground mt-1">Family Medicine</p>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-destructive">{allergies.length} Active</p>
            <p className="text-sm text-muted-foreground mt-1">
              {allergies.filter(a => a.criticality === 'high').length} Critical
            </p>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{medications.filter(m => m.status === 'active').length} Active</p>
            <p className="text-sm text-muted-foreground mt-1">Prescriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">
            <ClipboardList className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="problems">
            <Heart className="h-4 w-4 mr-2" />
            Problems
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Activity className="h-4 w-4 mr-2" />
            Vitals & Labs
          </TabsTrigger>
          <TabsTrigger value="tests">
            <TestTube className="h-4 w-4 mr-2" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="billing">
            <DollarSign className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Active Problems */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Active Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {problems.map((problem) => (
                    <div key={problem.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{getCodeDisplay(problem.code)}</p>
                          <p className="text-sm text-muted-foreground">
                            Since: {new Date(problem.onsetDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={
                          problem.severity === 'severe' ? 'bg-destructive/10 text-destructive' :
                          problem.severity === 'moderate' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }>
                          {problem.severity}
                        </Badge>
                      </div>
                      {problem.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">{problem.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Allergies & Intolerances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allergies.map((allergy) => (
                    <div key={allergy.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{getCodeDisplay(allergy.code)}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {allergy.category?.join(', ')} allergy
                          </p>
                        </div>
                        <Badge className={
                          allergy.criticality === 'high' ? 'bg-destructive/10 text-destructive' :
                          allergy.criticality === 'low' ? 'bg-success/10 text-success' :
                          'bg-warning/10 text-warning'
                        }>
                          {allergy.criticality}
                        </Badge>
                      </div>
                      {allergy.reaction && allergy.reaction.length > 0 && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          Reaction: {allergy.reaction[0].manifestation.map(m => getCodeDisplay(m)).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Advice */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Clinical Advice & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Lifestyle Modifications</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Continue low-sodium diet (less than 2000mg daily) for hypertension management</li>
                    <li>Maintain regular exercise routine - at least 150 minutes moderate activity per week</li>
                    <li>Monitor blood glucose levels before meals and bedtime</li>
                    <li>Limit alcohol consumption to moderate levels</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Follow-up Care</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Schedule quarterly HbA1c monitoring for diabetes management</li>
                    <li>Annual comprehensive metabolic panel and lipid screening</li>
                    <li>Blood pressure monitoring at home - report if consistently above 130/80</li>
                    <li>Regular foot examinations for diabetic neuropathy screening</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Problems Tab */}
        <TabsContent value="problems">
          <Card className="medical-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Health Problems</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Problem
                </Button>
              </div>
              <CardDescription>Current and historical health conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Onset Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell className="font-medium">{getCodeDisplay(problem.code)}</TableCell>
                      <TableCell>
                        <Badge className="status-active">{problem.clinicalStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          problem.severity === 'severe' ? 'bg-destructive/10 text-destructive' :
                          problem.severity === 'moderate' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }>
                          {problem.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(problem.onsetDate).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{problem.notes}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <Card className="medical-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Medications</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Prescribe Medication
                </Button>
              </div>
              <CardDescription>Active prescriptions and medication history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage Instructions</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Prescribed Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-medium">
                        {getCodeDisplay(med.medicationCodeableConcept)}
                      </TableCell>
                      <TableCell>{med.dosageInstruction?.[0]?.text || 'N/A'}</TableCell>
                      <TableCell>
                        {med.dispenseRequest?.quantity?.value} {med.dispenseRequest?.quantity?.unit}
                      </TableCell>
                      <TableCell>{new Date(med.authoredOn || '').toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(med.status)}>{med.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">Refill</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals & Labs Tab */}
        <TabsContent value="vitals" className="space-y-4">
          {/* Recent Vitals */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Recent Vital Signs</CardTitle>
              <CardDescription>Latest recorded vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vital Sign</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Date Recorded</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vitalSigns.map((vital) => (
                    <TableRow key={vital.id}>
                      <TableCell className="font-medium">{getCodeDisplay(vital.code)}</TableCell>
                      <TableCell>
                        {vital.component ? (
                          <span>
                            {vital.component[0].valueQuantity?.value}/{vital.component[1].valueQuantity?.value} mmHg
                          </span>
                        ) : (
                          <span>
                            {vital.valueQuantity?.value} {vital.valueQuantity?.unit}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(vital.effectiveDateTime || '').toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vital.status)}>{vital.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Lab Results */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Recent diagnostic test results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Conclusion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labResults.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell className="font-medium">{getCodeDisplay(lab.code)}</TableCell>
                      <TableCell>{new Date(lab.effectiveDateTime || '').toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lab.status)}>{lab.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">{lab.conclusion}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommended Tests Tab */}
        <TabsContent value="tests">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Recommended Tests & Screenings</CardTitle>
              <CardDescription>Upcoming and recommended diagnostic tests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test/Screening</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendedTests.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{new Date(test.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          test.priority === 'urgent' ? 'bg-destructive/10 text-destructive' :
                          test.priority === 'important' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }>
                          {test.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm">Schedule Test</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Billing & Claims</CardTitle>
              <CardDescription>Patient billing history and insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billing.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">CLM-{claim.id}</TableCell>
                      <TableCell>{new Date(claim.created || '').toLocaleDateString()}</TableCell>
                      <TableCell>{claim.provider?.display}</TableCell>
                      <TableCell className="font-medium">
                        ${claim.total?.value?.toFixed(2)} {claim.total?.currency}
                      </TableCell>
                      <TableCell>{claim.insurance?.[0]?.coverage?.display}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Outstanding Balance</p>
                    <p className="text-2xl font-bold">$530.00</p>
                  </div>
                  <Button>Make Payment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
