import { useState } from 'react'
import { Plus, Search, Scan, Eye, Edit, Trash2, Calendar, User, FileImage, Brain, Download } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth } from '@/components/AuthContext'

interface DiagnosticReport {
  id: string
  patientName: string
  patientId: string
  reportType: string
  studyDate: Date
  reportDate: Date
  modality: string
  bodyPart: string
  findings: string
  impression: string
  recommendation: string
  radiologist: string
  status: 'pending' | 'preliminary' | 'final' | 'amended'
  priority: 'routine' | 'urgent' | 'stat'
  images?: ImageStudy[]
  aiAnalysis?: AIAnalysis
}

interface ImageStudy {
  id: string
  type: string
  description: string
  url?: string
  thumbnailUrl?: string
}

interface AIAnalysis {
  id: string
  analysisType: string
  confidence: number
  findings: string[]
  abnormalityDetected: boolean
  severity?: 'low' | 'moderate' | 'high'
  recommendations: string[]
}

const mockDiagnosticReports: DiagnosticReport[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    reportType: 'Chest X-Ray',
    studyDate: new Date('2024-01-15T09:30:00'),
    reportDate: new Date('2024-01-15T14:00:00'),
    modality: 'X-Ray',
    bodyPart: 'Chest',
    findings: 'Lungs are clear bilaterally. No acute cardiopulmonary abnormalities. Heart size normal.',
    impression: 'Normal chest radiograph.',
    recommendation: 'No follow-up needed unless clinically indicated.',
    radiologist: 'Dr. Robert Chen',
    status: 'final',
    priority: 'routine',
    images: [
      {
        id: 'img1',
        type: 'PA View',
        description: 'Posterior-anterior chest view'
      },
      {
        id: 'img2',
        type: 'Lateral View',
        description: 'Lateral chest view'
      }
    ]
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientId: 'P002',
    reportType: 'Brain MRI',
    studyDate: new Date('2024-01-14T10:00:00'),
    reportDate: new Date('2024-01-14T16:30:00'),
    modality: 'MRI',
    bodyPart: 'Brain',
    findings: 'Small hyperintense lesion noted in the right frontal white matter on T2-weighted images.',
    impression: 'Small non-specific white matter lesion. Clinical correlation recommended.',
    recommendation: 'Follow-up MRI in 6 months to assess stability.',
    radiologist: 'Dr. Lisa Wang',
    status: 'final',
    priority: 'urgent',
    images: [
      {
        id: 'img3',
        type: 'T1 Axial',
        description: 'T1-weighted axial images'
      },
      {
        id: 'img4',
        type: 'T2 FLAIR',
        description: 'T2 FLAIR images'
      }
    ],
    aiAnalysis: {
      id: 'ai1',
      analysisType: 'Lesion Detection',
      confidence: 85,
      findings: ['Small hyperintense lesion detected', 'Location: Right frontal white matter'],
      abnormalityDetected: true,
      severity: 'low',
      recommendations: ['Clinical correlation recommended', 'Consider follow-up imaging']
    }
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientId: 'P003',
    reportType: 'Abdominal CT',
    studyDate: new Date('2024-01-13T14:15:00'),
    reportDate: new Date('2024-01-13T18:00:00'),
    modality: 'CT',
    bodyPart: 'Abdomen',
    findings: 'Liver, spleen, kidneys appear normal. No evidence of acute pathology.',
    impression: 'Normal abdominal CT scan.',
    recommendation: 'No further imaging needed at this time.',
    radiologist: 'Dr. Amanda Rodriguez',
    status: 'final',
    priority: 'stat',
    images: [
      {
        id: 'img5',
        type: 'Axial Series',
        description: 'Axial CT images with contrast'
      }
    ]
  }
]

export function DiagnosticsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [reports] = useState(mockDiagnosticReports)
  const [modalityFilter, setModalityFilter] = useState<string>('all')
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newReport, setNewReport] = useState({
    patientId: '',
    reportType: '',
    modality: '',
    bodyPart: '',
    findings: '',
    impression: ''
  })

  const getFilteredReports = () => {
    let filteredReports = reports

    if (user?.role === 'patient') {
      filteredReports = reports.filter(r => r.patientId === 'P001') // Current patient
    }

    if (searchTerm) {
      filteredReports = filteredReports.filter(r =>
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.radiologist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (modalityFilter !== 'all') {
      filteredReports = filteredReports.filter(r => r.modality === modalityFilter)
    }

    return filteredReports
  }

  const handleAddReport = () => {
    console.log('Adding diagnostic report:', newReport)
    setIsAddReportDialogOpen(false)
    setNewReport({ patientId: '', reportType: '', modality: '', bodyPart: '', findings: '', impression: '' })
  }

  const handleViewReport = (report: DiagnosticReport) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const filteredReports = getFilteredReports()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Scan className="h-8 w-8 text-primary" />
            Diagnostic Reports & Imaging
          </h1>
          <p className="text-muted-foreground">
            Review diagnostic reports, imaging studies, and AI analysis results
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Dialog open={isAddReportDialogOpen} onOpenChange={setIsAddReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Report
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Diagnostic Report</DialogTitle>
                <DialogDescription>Add a new diagnostic report and imaging study</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-patient">Patient</Label>
                    <Select value={newReport.patientId} onValueChange={(value) => setNewReport({...newReport, patientId: value})}>
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
                    <Label htmlFor="report-modality">Modality</Label>
                    <Select value={newReport.modality} onValueChange={(value) => setNewReport({...newReport, modality: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select modality" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="X-Ray">X-Ray</SelectItem>
                        <SelectItem value="CT">CT Scan</SelectItem>
                        <SelectItem value="MRI">MRI</SelectItem>
                        <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                        <SelectItem value="Mammography">Mammography</SelectItem>
                        <SelectItem value="Nuclear">Nuclear Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Input
                      id="report-type"
                      value={newReport.reportType}
                      onChange={(e) => setNewReport({...newReport, reportType: e.target.value})}
                      placeholder="Chest X-Ray, Brain MRI..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-bodypart">Body Part</Label>
                    <Select value={newReport.bodyPart} onValueChange={(value) => setNewReport({...newReport, bodyPart: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body part" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Head">Head</SelectItem>
                        <SelectItem value="Chest">Chest</SelectItem>
                        <SelectItem value="Abdomen">Abdomen</SelectItem>
                        <SelectItem value="Pelvis">Pelvis</SelectItem>
                        <SelectItem value="Spine">Spine</SelectItem>
                        <SelectItem value="Extremities">Extremities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-findings">Clinical Findings</Label>
                  <Textarea
                    id="report-findings"
                    value={newReport.findings}
                    onChange={(e) => setNewReport({...newReport, findings: e.target.value})}
                    placeholder="Detailed description of imaging findings..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-impression">Impression</Label>
                  <Textarea
                    id="report-impression"
                    value={newReport.impression}
                    onChange={(e) => setNewReport({...newReport, impression: e.target.value})}
                    placeholder="Clinical impression and diagnosis..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReport} className="medical-button">
                    Create Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* AI Analysis Alert */}
      {filteredReports.some(r => r.aiAnalysis?.abnormalityDetected) && (
        <Alert className="border-warning bg-warning/10">
          <Brain className="h-4 w-4" />
          <AlertTitle>AI Analysis Available</AlertTitle>
          <AlertDescription>
            AI-powered diagnostic analysis has detected findings requiring clinical review.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{filteredReports.length}</p>
              </div>
              <Scan className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{filteredReports.filter(r => r.status === 'pending').length}</p>
              </div>
              <Eye className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Analyzed</p>
                <p className="text-2xl font-bold">{filteredReports.filter(r => r.aiAnalysis).length}</p>
              </div>
              <Brain className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent Priority</p>
                <p className="text-2xl font-bold">{filteredReports.filter(r => r.priority === 'urgent' || r.priority === 'stat').length}</p>
              </div>
              <Badge className="status-critical">!</Badge>
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
                placeholder="Search diagnostic reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={modalityFilter} onValueChange={(value) => setModalityFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by modality" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Modalities</SelectItem>
                <SelectItem value="X-Ray">X-Ray</SelectItem>
                <SelectItem value="CT">CT Scan</SelectItem>
                <SelectItem value="MRI">MRI</SelectItem>
                <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                <SelectItem value="Mammography">Mammography</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Reports Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Diagnostic Reports</CardTitle>
          <CardDescription>Medical imaging reports and diagnostic studies</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Study</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Radiologist</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Analysis</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{report.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {report.patientId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">{report.reportType}</div>
                        <div className="text-sm text-muted-foreground">{report.modality} - {report.bodyPart}</div>
                      </div>
                    </div>
                    <Badge 
                      className={
                        report.priority === 'stat' ? "status-critical" :
                        report.priority === 'urgent' ? "status-warning" :
                        "status-info"
                      }
                    >
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.studyDate.toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        {report.studyDate.toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{report.radiologist}</div>
                    <div className="text-sm text-muted-foreground">
                      Report: {report.reportDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        report.status === 'final' ? "status-active" :
                        report.status === 'preliminary' ? "status-warning" :
                        report.status === 'pending' ? "status-info" :
                        "status-inactive"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.aiAnalysis ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Brain className="h-3 w-3 text-success" />
                          <span className="text-sm font-medium">{report.aiAnalysis.confidence}% confident</span>
                        </div>
                        {report.aiAnalysis.abnormalityDetected && (
                          <Badge className="status-warning">Abnormality</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No AI analysis</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileImage className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
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

      {/* Report Viewer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-popover max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReport.reportType} - {selectedReport.patientName}</DialogTitle>
                <DialogDescription>
                  Study Date: {selectedReport.studyDate.toLocaleDateString()} | 
                  Radiologist: {selectedReport.radiologist}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="report" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="report">Report</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  {selectedReport.aiAnalysis && <TabsTrigger value="ai">AI Analysis</TabsTrigger>}
                </TabsList>

                <TabsContent value="report" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Clinical Findings:</Label>
                      <p className="text-sm mt-1">{selectedReport.findings}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Impression:</Label>
                      <p className="text-sm mt-1">{selectedReport.impression}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Recommendation:</Label>
                      <p className="text-sm mt-1">{selectedReport.recommendation}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedReport.images?.map((image) => (
                      <Card key={image.id} className="medical-card">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                            <FileImage className="h-16 w-16 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{image.type}</div>
                            <div className="text-sm text-muted-foreground">{image.description}</div>
                          </div>
                          <Button className="w-full mt-3" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Image
                          </Button>
                        </CardContent>
                      </Card>
                    )) || (
                      <p className="text-muted-foreground">No images available for this study.</p>
                    )}
                  </div>
                </TabsContent>

                {selectedReport.aiAnalysis && (
                  <TabsContent value="ai" className="space-y-4">
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-success" />
                          AI Diagnostic Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-semibold">Analysis Type:</Label>
                            <p className="text-sm">{selectedReport.aiAnalysis.analysisType}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">Confidence Level:</Label>
                            <p className="text-sm">{selectedReport.aiAnalysis.confidence}%</p>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold">AI Findings:</Label>
                          <ul className="text-sm mt-1 list-disc list-inside">
                            {selectedReport.aiAnalysis.findings.map((finding, index) => (
                              <li key={index}>{finding}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">AI Recommendations:</Label>
                          <ul className="text-sm mt-1 list-disc list-inside">
                            {selectedReport.aiAnalysis.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>

                        {selectedReport.aiAnalysis.abnormalityDetected && (
                          <Alert className="border-warning bg-warning/10">
                            <Brain className="h-4 w-4" />
                            <AlertTitle>Abnormality Detected</AlertTitle>
                            <AlertDescription>
                              AI analysis has detected potential abnormalities. 
                              Clinical correlation and radiologist review recommended.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}