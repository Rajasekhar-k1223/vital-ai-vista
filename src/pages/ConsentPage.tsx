import { useState } from 'react'
import { Plus, Search, Shield, FileText, Calendar, User, Eye, Edit, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/components/AuthContext'

interface ConsentForm {
  id: string
  patientName: string
  patientId: string
  formType: string
  title: string
  description: string
  consentGiven: boolean
  dateConsented?: Date
  dateExpires?: Date
  witnessName?: string
  providerName: string
  status: 'active' | 'expired' | 'revoked' | 'pending'
  digitalSignature?: string
  ipAddress?: string
  version: string
}

interface AuditLog {
  id: string
  patientId: string
  patientName: string
  action: string
  resource: string
  timestamp: Date
  userId: string
  userName: string
  details: string
  ipAddress: string
  userAgent: string
}

const mockConsentForms: ConsentForm[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    formType: 'treatment',
    title: 'General Treatment Consent',
    description: 'Consent for routine medical care and treatment',
    consentGiven: true,
    dateConsented: new Date('2024-01-15T10:30:00'),
    dateExpires: new Date('2025-01-15'),
    witnessName: 'Nurse Jane Wilson',
    providerName: 'Dr. Sarah Johnson',
    status: 'active',
    digitalSignature: 'JSmith_2024_001',
    ipAddress: '192.168.1.10',
    version: '2.1'
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    formType: 'data-sharing',
    title: 'Health Information Exchange Consent',
    description: 'Permission to share health information with other healthcare providers',
    consentGiven: true,
    dateConsented: new Date('2024-01-14T14:20:00'),
    dateExpires: new Date('2026-01-14'),
    providerName: 'Dr. Michael Chen',
    status: 'active',
    digitalSignature: 'EDavis_2024_002',
    ipAddress: '192.168.1.15',
    version: '1.3'
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    formType: 'procedure',
    title: 'Surgical Procedure Consent',
    description: 'Informed consent for cardiac catheterization procedure',
    consentGiven: false,
    providerName: 'Dr. Lisa Anderson',
    status: 'pending',
    version: '3.0'
  },
  {
    id: '4',
    patientName: 'John Smith',
    patientId: 'P001',
    formType: 'research',
    title: 'Clinical Research Participation',
    description: 'Consent to participate in cardiovascular research study',
    consentGiven: true,
    dateConsented: new Date('2023-06-15T09:00:00'),
    dateExpires: new Date('2024-06-15'),
    providerName: 'Dr. Robert Chen',
    status: 'expired',
    digitalSignature: 'JSmith_2023_003',
    version: '1.0'
  }
]

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Smith',
    action: 'VIEW',
    resource: 'Patient Medical Record',
    timestamp: new Date('2024-01-15T10:30:00'),
    userId: 'U001',
    userName: 'Dr. Sarah Johnson',
    details: 'Accessed patient chart for routine visit',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Emily Davis',
    action: 'UPDATE',
    resource: 'Medication List',
    timestamp: new Date('2024-01-15T09:15:00'),
    userId: 'U002',
    userName: 'Dr. Michael Chen',
    details: 'Updated diabetes medication dosage',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/121.0'
  },
  {
    id: '3',
    patientId: 'P003',
    patientName: 'Robert Wilson',
    action: 'CREATE',
    resource: 'Diagnostic Report',
    timestamp: new Date('2024-01-14T16:45:00'),
    userId: 'U003',
    userName: 'Dr. Lisa Anderson',
    details: 'Created chest X-ray report',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari/17.0'
  },
  {
    id: '4',
    patientId: 'P001',
    patientName: 'John Smith',
    action: 'EXPORT',
    resource: 'Lab Results',
    timestamp: new Date('2024-01-14T14:30:00'),
    userId: 'U001',
    userName: 'Dr. Sarah Johnson',
    details: 'Exported blood work results to PDF',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0'
  },
  {
    id: '5',
    patientId: 'P002',
    patientName: 'Emily Davis',
    action: 'DELETE',
    resource: 'Duplicate Record',
    timestamp: new Date('2024-01-13T11:20:00'),
    userId: 'U004',
    userName: 'Admin User',
    details: 'Removed duplicate patient entry',
    ipAddress: '192.168.1.200',
    userAgent: 'Edge/120.0.0.0'
  }
]

export function ConsentPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [consentForms] = useState(mockConsentForms)
  const [auditLogs] = useState(mockAuditLogs)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isAddConsentDialogOpen, setIsAddConsentDialogOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newConsent, setNewConsent] = useState({
    patientId: '',
    formType: '',
    title: '',
    description: ''
  })

  const getFilteredConsentForms = () => {
    let filteredForms = consentForms

    if (user?.role === 'patient') {
      filteredForms = consentForms.filter(cf => cf.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredForms = filteredForms.filter(cf =>
        cf.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cf.formType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filteredForms = filteredForms.filter(cf => cf.formType === typeFilter)
    }

    return filteredForms
  }

  const getFilteredAuditLogs = () => {
    let filteredLogs = auditLogs

    if (user?.role === 'patient') {
      filteredLogs = auditLogs.filter(al => al.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredLogs = filteredLogs.filter(al =>
        al.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        al.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        al.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        al.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filteredLogs
  }

  const handleAddConsent = () => {
    console.log('Adding consent form:', newConsent)
    setIsAddConsentDialogOpen(false)
    setNewConsent({ patientId: '', formType: '', title: '', description: '' })
  }

  const handleViewForm = (form: ConsentForm) => {
    setSelectedForm(form)
    setIsViewDialogOpen(true)
  }

  const filteredConsentForms = getFilteredConsentForms()
  const filteredAuditLogs = getFilteredAuditLogs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Consent & Security Management
          </h1>
          <p className="text-muted-foreground">
            Manage patient consent forms, privacy settings, and audit trails
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Dialog open={isAddConsentDialogOpen} onOpenChange={setIsAddConsentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                New Consent Form
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Consent Form</DialogTitle>
                <DialogDescription>Generate a new consent form for patient approval</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consent-patient">Patient</Label>
                    <Select value={newConsent.patientId} onValueChange={(value) => setNewConsent({...newConsent, patientId: value})}>
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
                    <Label htmlFor="consent-type">Form Type</Label>
                    <Select value={newConsent.formType} onValueChange={(value) => setNewConsent({...newConsent, formType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="treatment">General Treatment</SelectItem>
                        <SelectItem value="procedure">Specific Procedure</SelectItem>
                        <SelectItem value="data-sharing">Data Sharing</SelectItem>
                        <SelectItem value="research">Research Participation</SelectItem>
                        <SelectItem value="photography">Photography/Media</SelectItem>
                        <SelectItem value="financial">Financial Responsibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consent-title">Consent Title</Label>
                  <Input
                    id="consent-title"
                    value={newConsent.title}
                    onChange={(e) => setNewConsent({...newConsent, title: e.target.value})}
                    placeholder="General Treatment Consent, Procedure Authorization..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consent-description">Description</Label>
                  <Textarea
                    id="consent-description"
                    value={newConsent.description}
                    onChange={(e) => setNewConsent({...newConsent, description: e.target.value})}
                    placeholder="Detailed description of what the patient is consenting to..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddConsentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddConsent} className="medical-button">
                    Create Form
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
                <p className="text-sm font-medium text-muted-foreground">Active Consents</p>
                <p className="text-2xl font-bold">{filteredConsentForms.filter(cf => cf.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{filteredConsentForms.filter(cf => cf.status === 'pending').length}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold">{filteredConsentForms.filter(cf => cf.status === 'expired').length}</p>
              </div>
              <FileText className="h-4 w-4 text-error" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Audit Events Today</p>
                <p className="text-2xl font-bold">{filteredAuditLogs.filter(al => 
                  al.timestamp.toDateString() === new Date().toDateString()
                ).length}</p>
              </div>
              <Shield className="h-4 w-4 text-info" />
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
                placeholder="Search consent forms and audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
                <SelectItem value="data-sharing">Data Sharing</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="consent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consent">Consent Forms</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Patient Consent Management</CardTitle>
              <CardDescription>Track consent forms, approvals, and expiration dates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Consent Form</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsentForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{form.patientName}</div>
                            <div className="text-sm text-muted-foreground">ID: {form.patientId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{form.title}</div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {form.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Version {form.version}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{form.formType.replace('-', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            className={
                              form.status === 'active' ? "status-active" :
                              form.status === 'pending' ? "status-warning" :
                              form.status === 'expired' ? "status-critical" :
                              "status-inactive"
                            }
                          >
                            {form.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs">
                            {form.consentGiven ? (
                              <CheckCircle className="h-3 w-3 text-success" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-warning" />
                            )}
                            <span>{form.consentGiven ? 'Consented' : 'Not Consented'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {form.dateConsented && (
                            <div>Consented: {form.dateConsented.toLocaleDateString()}</div>
                          )}
                          {form.dateExpires && (
                            <div className={`${form.dateExpires < new Date() ? 'text-error' : 'text-muted-foreground'}`}>
                              Expires: {form.dateExpires.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{form.providerName}</div>
                          {form.witnessName && (
                            <div className="text-muted-foreground">Witness: {form.witnessName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewForm(form)}
                          >
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

        <TabsContent value="audit" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Security Audit Trail</CardTitle>
              <CardDescription>Complete log of system access and data modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div>{log.timestamp.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">{log.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-muted-foreground">ID: {log.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.patientName}</div>
                          <div className="text-muted-foreground">{log.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            log.action === 'VIEW' ? "status-info" :
                            log.action === 'CREATE' ? "status-success" :
                            log.action === 'UPDATE' ? "status-warning" :
                            log.action === 'DELETE' ? "status-critical" :
                            log.action === 'EXPORT' ? "status-warning" :
                            "status-inactive"
                          }
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{log.resource}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate">{log.details}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{log.ipAddress}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Consent Form Viewer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-popover max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedForm && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedForm.title}</DialogTitle>
                <DialogDescription>
                  Patient: {selectedForm.patientName} | Type: {selectedForm.formType}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Form Version:</Label>
                    <p className="text-sm">{selectedForm.version}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Provider:</Label>
                    <p className="text-sm">{selectedForm.providerName}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Description:</Label>
                  <p className="text-sm mt-1">{selectedForm.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Consent Status:</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Switch checked={selectedForm.consentGiven} disabled />
                      <span className="text-sm">{selectedForm.consentGiven ? 'Granted' : 'Not Granted'}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Form Status:</Label>
                    <Badge 
                      className={
                        selectedForm.status === 'active' ? "status-active" :
                        selectedForm.status === 'pending' ? "status-warning" :
                        selectedForm.status === 'expired' ? "status-critical" :
                        "status-inactive"
                      }
                    >
                      {selectedForm.status}
                    </Badge>
                  </div>
                </div>

                {selectedForm.dateConsented && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Date Consented:</Label>
                      <p className="text-sm">{selectedForm.dateConsented.toLocaleDateString()}</p>
                    </div>
                    {selectedForm.dateExpires && (
                      <div>
                        <Label className="text-sm font-semibold">Expiration Date:</Label>
                        <p className="text-sm">{selectedForm.dateExpires.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedForm.digitalSignature && (
                  <div>
                    <Label className="text-sm font-semibold">Digital Signature:</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{selectedForm.digitalSignature}</p>
                  </div>
                )}

                {selectedForm.witnessName && (
                  <div>
                    <Label className="text-sm font-semibold">Witness:</Label>
                    <p className="text-sm">{selectedForm.witnessName}</p>
                  </div>
                )}

                {selectedForm.ipAddress && (
                  <div>
                    <Label className="text-sm font-semibold">IP Address:</Label>
                    <p className="text-sm text-muted-foreground">{selectedForm.ipAddress}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}