import { useState } from 'react'
import { Plus, Search, BookOpen, Code, Globe, Eye, Edit, Trash2, Download, Upload } from 'lucide-react'
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
import { useAuth } from '@/components/AuthContext'

interface CodeSystem {
  id: string
  name: string
  version: string
  url: string
  title: string
  description: string
  publisher: string
  status: 'draft' | 'active' | 'retired' | 'unknown'
  date: Date
  content: 'not-present' | 'example' | 'fragment' | 'complete' | 'supplement'
  count: number
  concepts?: Concept[]
}

interface Concept {
  id: string
  code: string
  display: string
  definition?: string
  designations?: Designation[]
  properties?: ConceptProperty[]
}

interface Designation {
  language: string
  use: string
  value: string
}

interface ConceptProperty {
  code: string
  value: string | number | boolean
}

interface ValueSet {
  id: string
  name: string
  title: string
  description: string
  url: string
  version: string
  status: 'draft' | 'active' | 'retired' | 'unknown'
  date: Date
  publisher: string
  purpose?: string
  compose: ValueSetCompose
  expansion?: ValueSetExpansion
}

interface ValueSetCompose {
  include: ValueSetInclude[]
  exclude?: ValueSetInclude[]
}

interface ValueSetInclude {
  system: string
  version?: string
  concept?: ValueSetConcept[]
  filter?: ValueSetFilter[]
}

interface ValueSetConcept {
  code: string
  display: string
}

interface ValueSetFilter {
  property: string
  op: string
  value: string
}

interface ValueSetExpansion {
  identifier: string
  timestamp: Date
  total: number
  contains: ValueSetExpansionContains[]
}

interface ValueSetExpansionContains {
  system: string
  code: string
  display: string
}

const mockCodeSystems: CodeSystem[] = [
  {
    id: '1',
    name: 'SNOMED CT',
    version: '2024-01',
    url: 'http://snomed.info/sct',
    title: 'SNOMED Clinical Terms',
    description: 'Systematized Nomenclature of Medicine Clinical Terms',
    publisher: 'SNOMED International',
    status: 'active',
    date: new Date('2024-01-31'),
    content: 'complete',
    count: 354796
  },
  {
    id: '2',
    name: 'ICD-10-CM',
    version: '2024',
    url: 'http://hl7.org/fhir/sid/icd-10-cm',
    title: 'International Classification of Diseases, 10th Revision, Clinical Modification',
    description: 'ICD-10-CM is the official system of assigning codes to diagnoses',
    publisher: 'Centers for Disease Control and Prevention',
    status: 'active',
    date: new Date('2023-10-01'),
    content: 'complete',
    count: 72616
  },
  {
    id: '3',
    name: 'CPT',
    version: '2024',
    url: 'http://www.ama-assn.org/go/cpt',
    title: 'Current Procedural Terminology',
    description: 'Medical procedural coding system maintained by the American Medical Association',
    publisher: 'American Medical Association',
    status: 'active',
    date: new Date('2023-12-31'),
    content: 'complete',
    count: 10155
  },
  {
    id: '4',
    name: 'LOINC',
    version: '2.76',
    url: 'http://loinc.org',
    title: 'Logical Observation Identifiers Names and Codes',
    description: 'Universal standard for identifying medical laboratory observations',
    publisher: 'Regenstrief Institute, Inc.',
    status: 'active',
    date: new Date('2023-12-15'),
    content: 'complete',
    count: 96108
  }
]

const mockValueSets: ValueSet[] = [
  {
    id: '1',
    name: 'cardiovascular-conditions',
    title: 'Cardiovascular Conditions',
    description: 'Value set containing cardiovascular diagnosis codes',
    url: 'http://vitalai.com/fhir/ValueSet/cardiovascular-conditions',
    version: '1.0.0',
    status: 'active',
    date: new Date('2024-01-15'),
    publisher: 'VitalAI Medical Center',
    purpose: 'For use in identifying patients with cardiovascular conditions',
    compose: {
      include: [
        {
          system: 'http://hl7.org/fhir/sid/icd-10-cm',
          concept: [
            { code: 'I10', display: 'Essential hypertension' },
            { code: 'I21.9', display: 'Acute myocardial infarction, unspecified' },
            { code: 'I50.9', display: 'Heart failure, unspecified' }
          ]
        }
      ]
    },
    expansion: {
      identifier: 'uuid:12345',
      timestamp: new Date('2024-01-15T10:30:00'),
      total: 3,
      contains: [
        { system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I10', display: 'Essential hypertension' },
        { system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I21.9', display: 'Acute myocardial infarction, unspecified' },
        { system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I50.9', display: 'Heart failure, unspecified' }
      ]
    }
  },
  {
    id: '2',
    name: 'diabetes-medications',
    title: 'Diabetes Medications',
    description: 'Medications commonly used for diabetes treatment',
    url: 'http://vitalai.com/fhir/ValueSet/diabetes-medications',
    version: '2.1.0',
    status: 'active',
    date: new Date('2024-01-10'),
    publisher: 'VitalAI Medical Center',
    compose: {
      include: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          concept: [
            { code: '860975', display: 'Metformin 500 MG Oral Tablet' },
            { code: '311027', display: 'Insulin, Regular, Human 100 UNT/ML Injectable Solution' }
          ]
        }
      ]
    },
    expansion: {
      identifier: 'uuid:67890',
      timestamp: new Date('2024-01-10T14:20:00'),
      total: 2,
      contains: [
        { system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '860975', display: 'Metformin 500 MG Oral Tablet' },
        { system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '311027', display: 'Insulin, Regular, Human 100 UNT/ML Injectable Solution' }
      ]
    }
  }
]

export function TerminologyPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [codeSystems] = useState(mockCodeSystems)
  const [valueSets] = useState(mockValueSets)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddCodeSystemDialogOpen, setIsAddCodeSystemDialogOpen] = useState(false)
  const [isAddValueSetDialogOpen, setIsAddValueSetDialogOpen] = useState(false)
  const [newCodeSystem, setNewCodeSystem] = useState({
    name: '',
    title: '',
    description: '',
    publisher: '',
    version: ''
  })
  const [newValueSet, setNewValueSet] = useState({
    name: '',
    title: '',
    description: '',
    publisher: '',
    version: ''
  })

  const getFilteredCodeSystems = () => {
    let filteredSystems = codeSystems

    if (searchTerm) {
      filteredSystems = filteredSystems.filter(cs =>
        cs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredSystems = filteredSystems.filter(cs => cs.status === statusFilter)
    }

    return filteredSystems
  }

  const getFilteredValueSets = () => {
    let filteredSets = valueSets

    if (searchTerm) {
      filteredSets = filteredSets.filter(vs =>
        vs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vs.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredSets = filteredSets.filter(vs => vs.status === statusFilter)
    }

    return filteredSets
  }

  const handleAddCodeSystem = () => {
    console.log('Adding code system:', newCodeSystem)
    setIsAddCodeSystemDialogOpen(false)
    setNewCodeSystem({ name: '', title: '', description: '', publisher: '', version: '' })
  }

  const handleAddValueSet = () => {
    console.log('Adding value set:', newValueSet)
    setIsAddValueSetDialogOpen(false)
    setNewValueSet({ name: '', title: '', description: '', publisher: '', version: '' })
  }

  if (!user || (user.role !== 'super_admin' && user.role !== 'org_admin')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="medical-card text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only Administrators can access terminology management.</p>
        </Card>
      </div>
    )
  }

  const filteredCodeSystems = getFilteredCodeSystems()
  const filteredValueSets = getFilteredValueSets()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Terminology Management
          </h1>
          <p className="text-muted-foreground">
            Manage medical coding systems, value sets, and terminology mappings
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCodeSystemDialogOpen} onOpenChange={setIsAddCodeSystemDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Code System
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Code System</DialogTitle>
                <DialogDescription>Register a new terminology code system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cs-name">System Name</Label>
                    <Input
                      id="cs-name"
                      value={newCodeSystem.name}
                      onChange={(e) => setNewCodeSystem({...newCodeSystem, name: e.target.value})}
                      placeholder="ICD-10-CM, SNOMED CT..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cs-version">Version</Label>
                    <Input
                      id="cs-version"
                      value={newCodeSystem.version}
                      onChange={(e) => setNewCodeSystem({...newCodeSystem, version: e.target.value})}
                      placeholder="2024, 1.0.0..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cs-title">Display Title</Label>
                  <Input
                    id="cs-title"
                    value={newCodeSystem.title}
                    onChange={(e) => setNewCodeSystem({...newCodeSystem, title: e.target.value})}
                    placeholder="International Classification of Diseases..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cs-publisher">Publisher</Label>
                  <Input
                    id="cs-publisher"
                    value={newCodeSystem.publisher}
                    onChange={(e) => setNewCodeSystem({...newCodeSystem, publisher: e.target.value})}
                    placeholder="WHO, AMA, SNOMED International..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cs-description">Description</Label>
                  <Textarea
                    id="cs-description"
                    value={newCodeSystem.description}
                    onChange={(e) => setNewCodeSystem({...newCodeSystem, description: e.target.value})}
                    placeholder="Detailed description of the code system..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddCodeSystemDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCodeSystem} className="medical-button">
                    Add System
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddValueSetDialogOpen} onOpenChange={setIsAddValueSetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Value Set
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Value Set</DialogTitle>
                <DialogDescription>Define a new set of medical codes for specific use cases</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vs-name">Value Set Name</Label>
                    <Input
                      id="vs-name"
                      value={newValueSet.name}
                      onChange={(e) => setNewValueSet({...newValueSet, name: e.target.value})}
                      placeholder="cardiovascular-conditions..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vs-version">Version</Label>
                    <Input
                      id="vs-version"
                      value={newValueSet.version}
                      onChange={(e) => setNewValueSet({...newValueSet, version: e.target.value})}
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vs-title">Display Title</Label>
                  <Input
                    id="vs-title"
                    value={newValueSet.title}
                    onChange={(e) => setNewValueSet({...newValueSet, title: e.target.value})}
                    placeholder="Cardiovascular Conditions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vs-publisher">Publisher</Label>
                  <Input
                    id="vs-publisher"
                    value={newValueSet.publisher}
                    onChange={(e) => setNewValueSet({...newValueSet, publisher: e.target.value})}
                    placeholder="VitalAI Medical Center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vs-description">Description</Label>
                  <Textarea
                    id="vs-description"
                    value={newValueSet.description}
                    onChange={(e) => setNewValueSet({...newValueSet, description: e.target.value})}
                    placeholder="Purpose and scope of this value set..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddValueSetDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddValueSet} className="medical-button">
                    Create Value Set
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Code Systems</p>
                <p className="text-2xl font-bold">{filteredCodeSystems.length}</p>
              </div>
              <Code className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Value Sets</p>
                <p className="text-2xl font-bold">{filteredValueSets.length}</p>
              </div>
              <BookOpen className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Concepts</p>
                <p className="text-2xl font-bold">{filteredCodeSystems.reduce((sum, cs) => sum + cs.count, 0).toLocaleString()}</p>
              </div>
              <Globe className="h-4 w-4 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Systems</p>
                <p className="text-2xl font-bold">{filteredCodeSystems.filter(cs => cs.status === 'active').length}</p>
              </div>
              <Badge className="status-active">Active</Badge>
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
                placeholder="Search code systems and value sets..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="codesystems" className="space-y-4">
        <TabsList>
          <TabsTrigger value="codesystems">Code Systems</TabsTrigger>
          <TabsTrigger value="valuesets">Value Sets</TabsTrigger>
        </TabsList>

        <TabsContent value="codesystems" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Medical Code Systems</CardTitle>
              <CardDescription>Registered terminology systems and coding standards</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Concepts</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodeSystems.map((system) => (
                    <TableRow key={system.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{system.name}</div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {system.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {system.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{system.publisher}</div>
                        <div className="text-sm text-muted-foreground">
                          Updated: {system.date.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{system.version}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            system.content === 'complete' ? "status-success" :
                            system.content === 'fragment' ? "status-warning" :
                            system.content === 'not-present' ? "status-critical" :
                            "status-info"
                          }
                        >
                          {system.content}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{system.count.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">concepts</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            system.status === 'active' ? "status-active" :
                            system.status === 'draft' ? "status-warning" :
                            system.status === 'retired' ? "status-inactive" :
                            "status-info"
                          }
                        >
                          {system.status}
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
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="valuesets" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Value Sets</CardTitle>
              <CardDescription>Curated collections of medical codes for specific purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value Set</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Concepts</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredValueSets.map((valueSet) => (
                    <TableRow key={valueSet.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{valueSet.title}</div>
                          <div className="text-sm text-muted-foreground">{valueSet.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {valueSet.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{valueSet.publisher}</div>
                        {valueSet.purpose && (
                          <div className="text-xs text-muted-foreground max-w-xs truncate">
                            {valueSet.purpose}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{valueSet.version}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {valueSet.expansion?.total || valueSet.compose.include.reduce((sum, inc) => sum + (inc.concept?.length || 0), 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">concepts</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{valueSet.date.toLocaleDateString()}</div>
                        {valueSet.expansion && (
                          <div className="text-xs text-muted-foreground">
                            Expanded: {valueSet.expansion.timestamp.toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            valueSet.status === 'active' ? "status-active" :
                            valueSet.status === 'draft' ? "status-warning" :
                            valueSet.status === 'retired' ? "status-inactive" :
                            "status-info"
                          }
                        >
                          {valueSet.status}
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
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
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
      </Tabs>
    </div>
  )
}