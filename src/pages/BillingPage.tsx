import { useState } from 'react'
import { Plus, Search, CreditCard, DollarSign, FileText, Calendar, Eye, Edit, Trash2, Download, AlertCircle } from 'lucide-react'
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

interface Claim {
  id: string
  patientName: string
  patientId: string
  claimNumber: string
  serviceDate: Date
  submissionDate: Date
  provider: string
  diagnosis: string
  procedureCodes: string[]
  totalAmount: number
  paidAmount: number
  status: 'submitted' | 'processing' | 'paid' | 'denied' | 'pending'
  insuranceCompany: string
  membershipId: string
  deductible: number
  coinsurance: number
  copay: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  patientName: string
  patientId: string
  issueDate: Date
  dueDate: Date
  services: Service[]
  subtotal: number
  tax: number
  total: number
  paidAmount: number
  balance: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paymentMethod?: string
}

interface Service {
  id: string
  description: string
  code: string
  quantity: number
  unitPrice: number
  total: number
}

const mockClaims: Claim[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    claimNumber: 'CLM-2024-001',
    serviceDate: new Date('2024-01-15'),
    submissionDate: new Date('2024-01-16'),
    provider: 'Dr. Sarah Johnson',
    diagnosis: 'Essential Hypertension (I10)',
    procedureCodes: ['99213', '93000'],
    totalAmount: 485.00,
    paidAmount: 388.00,
    status: 'paid',
    insuranceCompany: 'Blue Cross Blue Shield',
    membershipId: 'BCBS123456789',
    deductible: 250.00,
    coinsurance: 20,
    copay: 30.00
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    claimNumber: 'CLM-2024-002',
    serviceDate: new Date('2024-01-14'),
    submissionDate: new Date('2024-01-15'),
    provider: 'Dr. Michael Chen',
    diagnosis: 'Type 2 Diabetes (E11.9)',
    procedureCodes: ['99214', '82947'],
    totalAmount: 320.00,
    paidAmount: 0,
    status: 'processing',
    insuranceCompany: 'Aetna',
    membershipId: 'AET987654321',
    deductible: 500.00,
    coinsurance: 15,
    copay: 25.00
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    claimNumber: 'CLM-2024-003',
    serviceDate: new Date('2024-01-13'),
    submissionDate: new Date('2024-01-14'),
    provider: 'Dr. Lisa Anderson',
    diagnosis: 'Acute Chest Pain (R07.89)',
    procedureCodes: ['99285', '93000', '71020'],
    totalAmount: 1250.00,
    paidAmount: 0,
    status: 'denied',
    insuranceCompany: 'UnitedHealth',
    membershipId: 'UHC555666777',
    deductible: 1000.00,
    coinsurance: 10,
    copay: 50.00
  }
]

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    patientName: 'John Smith',
    patientId: 'P001',
    issueDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-14'),
    services: [
      {
        id: 's1',
        description: 'Office Visit - Established Patient',
        code: '99213',
        quantity: 1,
        unitPrice: 185.00,
        total: 185.00
      },
      {
        id: 's2',
        description: 'ECG, 12-lead',
        code: '93000',
        quantity: 1,
        unitPrice: 75.00,
        total: 75.00
      }
    ],
    subtotal: 260.00,
    tax: 20.80,
    total: 280.80,
    paidAmount: 280.80,
    balance: 0,
    status: 'paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    patientName: 'Emily Davis',
    patientId: 'P002',
    issueDate: new Date('2024-01-14'),
    dueDate: new Date('2024-02-13'),
    services: [
      {
        id: 's3',
        description: 'Office Visit - Detailed Examination',
        code: '99214',
        quantity: 1,
        unitPrice: 245.00,
        total: 245.00
      }
    ],
    subtotal: 245.00,
    tax: 19.60,
    total: 264.60,
    paidAmount: 0,
    balance: 264.60,
    status: 'sent'
  }
]

export function BillingPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [claims] = useState(mockClaims)
  const [invoices] = useState(mockInvoices)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddClaimDialogOpen, setIsAddClaimDialogOpen] = useState(false)
  const [isAddInvoiceDialogOpen, setIsAddInvoiceDialogOpen] = useState(false)
  const [newClaim, setNewClaim] = useState({
    patientId: '',
    diagnosis: '',
    procedureCode: '',
    amount: ''
  })
  const [newInvoice, setNewInvoice] = useState({
    patientId: '',
    serviceDescription: '',
    amount: ''
  })

  const getFilteredClaims = () => {
    let filteredClaims = claims

    if (searchTerm) {
      filteredClaims = filteredClaims.filter(c =>
        c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filteredClaims = filteredClaims.filter(c => c.status === statusFilter)
    }

    return filteredClaims
  }

  const getFilteredInvoices = () => {
    let filteredInvoices = invoices

    if (searchTerm) {
      filteredInvoices = filteredInvoices.filter(i =>
        i.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filteredInvoices
  }

  const handleAddClaim = () => {
    console.log('Adding claim:', newClaim)
    setIsAddClaimDialogOpen(false)
    setNewClaim({ patientId: '', diagnosis: '', procedureCode: '', amount: '' })
  }

  const handleAddInvoice = () => {
    console.log('Adding invoice:', newInvoice)
    setIsAddInvoiceDialogOpen(false)
    setNewInvoice({ patientId: '', serviceDescription: '', amount: '' })
  }

  if (!user || (user.role !== 'super_admin' && user.role !== 'org_admin')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="medical-card text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only Administrators can access billing management.</p>
        </Card>
      </div>
    )
  }

  const filteredClaims = getFilteredClaims()
  const filteredInvoices = getFilteredInvoices()
  const totalRevenue = filteredClaims.reduce((sum, c) => sum + c.paidAmount, 0)
  const totalOutstanding = filteredInvoices.reduce((sum, i) => sum + i.balance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Billing & Claims Management
          </h1>
          <p className="text-muted-foreground">
            Manage insurance claims, patient invoices, and billing operations
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddClaimDialogOpen} onOpenChange={setIsAddClaimDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Submit Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Insurance Claim</DialogTitle>
                <DialogDescription>Submit a new insurance claim for patient services</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="claim-patient">Patient</Label>
                    <Select value={newClaim.patientId} onValueChange={(value) => setNewClaim({...newClaim, patientId: value})}>
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
                    <Label htmlFor="claim-amount">Total Amount</Label>
                    <Input
                      id="claim-amount"
                      value={newClaim.amount}
                      onChange={(e) => setNewClaim({...newClaim, amount: e.target.value})}
                      placeholder="485.00"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-diagnosis">Diagnosis Code</Label>
                  <Input
                    id="claim-diagnosis"
                    value={newClaim.diagnosis}
                    onChange={(e) => setNewClaim({...newClaim, diagnosis: e.target.value})}
                    placeholder="I10 - Essential Hypertension"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-procedure">Procedure Code</Label>
                  <Input
                    id="claim-procedure"
                    value={newClaim.procedureCode}
                    onChange={(e) => setNewClaim({...newClaim, procedureCode: e.target.value})}
                    placeholder="99213, 93000"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddClaimDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClaim} className="medical-button">
                    Submit Claim
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddInvoiceDialogOpen} onOpenChange={setIsAddInvoiceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle>Create Patient Invoice</DialogTitle>
                <DialogDescription>Generate a new invoice for patient services</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-patient">Patient</Label>
                  <Select value={newInvoice.patientId} onValueChange={(value) => setNewInvoice({...newInvoice, patientId: value})}>
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
                  <Label htmlFor="invoice-service">Service Description</Label>
                  <Input
                    id="invoice-service"
                    value={newInvoice.serviceDescription}
                    onChange={(e) => setNewInvoice({...newInvoice, serviceDescription: e.target.value})}
                    placeholder="Office Visit - Established Patient"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-amount">Amount</Label>
                  <Input
                    id="invoice-amount"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    placeholder="185.00"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddInvoiceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddInvoice} className="medical-button">
                    Create Invoice
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold">{filteredClaims.filter(c => c.status === 'processing' || c.status === 'submitted').length}</p>
              </div>
              <FileText className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Denied Claims</p>
                <p className="text-2xl font-bold">{filteredClaims.filter(c => c.status === 'denied').length}</p>
              </div>
              <Badge className="status-critical">Denied</Badge>
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
                placeholder="Search claims and invoices..."
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
                <SelectItem value="all">All Claims</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
          <TabsTrigger value="invoices">Patient Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
              <CardDescription>Track insurance claim submissions and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Claim Details</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>
                        <div className="font-medium">{claim.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {claim.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{claim.claimNumber}</div>
                        <div className="text-sm text-muted-foreground">{claim.diagnosis}</div>
                        <div className="text-xs text-muted-foreground">
                          Codes: {claim.procedureCodes.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {claim.serviceDate.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Submitted: {claim.submissionDate.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{claim.insuranceCompany}</div>
                        <div className="text-sm text-muted-foreground">{claim.membershipId}</div>
                        <div className="text-xs text-muted-foreground">
                          Copay: ${claim.copay} | Coinsurance: {claim.coinsurance}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">Billed: ${claim.totalAmount.toFixed(2)}</div>
                          <div className="text-success">Paid: ${claim.paidAmount.toFixed(2)}</div>
                          {claim.totalAmount > claim.paidAmount && (
                            <div className="text-warning">
                              Balance: ${(claim.totalAmount - claim.paidAmount).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            claim.status === 'paid' ? "status-success" :
                            claim.status === 'processing' ? "status-warning" :
                            claim.status === 'denied' ? "status-critical" :
                            claim.status === 'submitted' ? "status-info" :
                            "status-inactive"
                          }
                        >
                          {claim.status}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Patient Invoices</CardTitle>
              <CardDescription>Manage patient billing and payment tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="font-medium">{invoice.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {invoice.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        {invoice.paymentMethod && (
                          <div className="text-sm text-muted-foreground">
                            Via: {invoice.paymentMethod}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {invoice.services.map((service) => (
                            <div key={service.id} className="text-sm">
                              <div className="font-medium">{service.description}</div>
                              <div className="text-muted-foreground">
                                {service.code} - ${service.unitPrice.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Issued: {invoice.issueDate.toLocaleDateString()}</div>
                          <div className={`${invoice.status === 'overdue' ? 'text-error' : 'text-muted-foreground'}`}>
                            Due: {invoice.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">Total: ${invoice.total.toFixed(2)}</div>
                          <div className="text-success">Paid: ${invoice.paidAmount.toFixed(2)}</div>
                          {invoice.balance > 0 && (
                            <div className="text-warning">Balance: ${invoice.balance.toFixed(2)}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            invoice.status === 'paid' ? "status-success" :
                            invoice.status === 'sent' ? "status-info" :
                            invoice.status === 'overdue' ? "status-critical" :
                            invoice.status === 'draft' ? "status-inactive" :
                            "status-warning"
                          }
                        >
                          {invoice.status}
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