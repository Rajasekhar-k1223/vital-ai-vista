import { useState } from 'react'
import { Upload, FileText, Image, Activity, Brain, AlertTriangle, CheckCircle, Download, Eye, Trash2, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

interface MedicalReport {
  id: string
  type: 'xray' | 'scan' | 'blood_test' | 'symptoms'
  title: string
  date: Date
  fileName: string
  fileSize: string
  aiAnalysis: {
    status: 'completed' | 'processing' | 'pending'
    findings: string[]
    riskLevel: 'low' | 'medium' | 'high'
    recommendations: string[]
    similarCases: number
  }
  uploadedBy: string
}

const mockReports: MedicalReport[] = [
  {
    id: '1',
    type: 'xray',
    title: 'Chest X-Ray',
    date: new Date('2024-01-15'),
    fileName: 'chest_xray_2024.jpg',
    fileSize: '2.4 MB',
    aiAnalysis: {
      status: 'completed',
      findings: [
        'No acute cardiopulmonary disease detected',
        'Heart size within normal limits',
        'Clear lung fields bilaterally'
      ],
      riskLevel: 'low',
      recommendations: [
        'Routine annual follow-up recommended',
        'Maintain current health regimen'
      ],
      similarCases: 0
    },
    uploadedBy: 'Dr. Michael Chen'
  },
  {
    id: '2',
    type: 'blood_test',
    title: 'Complete Blood Count',
    date: new Date('2024-01-12'),
    fileName: 'cbc_results.pdf',
    fileSize: '156 KB',
    aiAnalysis: {
      status: 'completed',
      findings: [
        'Slightly elevated cholesterol (210 mg/dL)',
        'Blood glucose within normal range',
        'Hemoglobin levels normal'
      ],
      riskLevel: 'medium',
      recommendations: [
        'Consider dietary modifications to reduce cholesterol',
        'Retest in 3 months',
        'Increase cardiovascular exercise'
      ],
      similarCases: 3
    },
    uploadedBy: 'Lab Technician'
  },
  {
    id: '3',
    type: 'symptoms',
    title: 'Migraine Symptoms Log',
    date: new Date('2024-01-10'),
    fileName: 'symptoms_jan2024.txt',
    fileSize: '12 KB',
    aiAnalysis: {
      status: 'completed',
      findings: [
        'Pattern detected: Migraines occur 2-3 times per week',
        'Triggers identified: Stress, lack of sleep, bright lights',
        'Duration: 4-6 hours average'
      ],
      riskLevel: 'medium',
      recommendations: [
        'Consider neurologist consultation',
        'Track caffeine and water intake',
        'Implement stress management techniques',
        'Regular sleep schedule recommended'
      ],
      similarCases: 8
    },
    uploadedBy: 'Patient Self-Report'
  }
]

export function MedicalReportsTab({ patientId }: { patientId: string }) {
  const { toast } = useToast()
  const [reports, setReports] = useState<MedicalReport[]>(mockReports)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    type: '',
    title: '',
    description: '',
    file: null as File | null
  })
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 20MB",
          variant: "destructive"
        })
        return
      }
      setUploadData({ ...uploadData, file })
    }
  }

  const handleSubmitReport = () => {
    if (!uploadData.type || !uploadData.title || !uploadData.file) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // Simulate upload and AI analysis
    const newReport: MedicalReport = {
      id: Date.now().toString(),
      type: uploadData.type as any,
      title: uploadData.title,
      date: new Date(),
      fileName: uploadData.file.name,
      fileSize: (uploadData.file.size / (1024 * 1024)).toFixed(2) + ' MB',
      aiAnalysis: {
        status: 'processing',
        findings: [],
        riskLevel: 'low',
        recommendations: [],
        similarCases: 0
      },
      uploadedBy: 'Patient'
    }

    setReports([newReport, ...reports])
    setIsUploadDialogOpen(false)
    setUploadData({ type: '', title: '', description: '', file: null })

    toast({
      title: "Report uploaded successfully",
      description: "AI analysis is processing..."
    })

    // Simulate AI processing
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { ...r, aiAnalysis: { ...r.aiAnalysis, status: 'completed' as const }}
          : r
      ))
      toast({
        title: "AI Analysis Complete",
        description: "Your report has been analyzed"
      })
    }, 3000)
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'xray':
      case 'scan':
        return Image
      case 'blood_test':
        return Activity
      case 'symptoms':
        return FileText
      default:
        return FileText
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-destructive bg-destructive/10'
      case 'medium':
        return 'text-warning bg-warning/10'
      case 'low':
        return 'text-success bg-success/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Medical Reports & AI Analysis</h2>
          <p className="text-muted-foreground">Upload reports for intelligent health insights</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="medical-button">
              <Upload className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Medical Report</DialogTitle>
              <DialogDescription>
                Upload X-rays, scans, blood tests, or symptom reports for AI analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type *</Label>
                <Select value={uploadData.type} onValueChange={(value) => setUploadData({ ...uploadData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="xray">X-Ray</SelectItem>
                    <SelectItem value="scan">CT/MRI Scan</SelectItem>
                    <SelectItem value="blood_test">Blood Test Results</SelectItem>
                    <SelectItem value="symptoms">Symptoms Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-title">Report Title *</Label>
                <Input
                  id="report-title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="e.g., Chest X-Ray, Blood Test Results"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">Description (Optional)</Label>
                <Textarea
                  id="report-description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Add any relevant notes or symptoms"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-file">Upload File *</Label>
                <Input
                  id="report-file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, PDF, TXT, DOC, DOCX (Max 20MB)
                </p>
                {uploadData.file && (
                  <p className="text-sm text-primary">
                    Selected: {uploadData.file.name} ({(uploadData.file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReport} className="medical-button">
                  Upload & Analyze
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
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Analyzed</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.aiAnalysis.status === 'completed').length}</p>
              </div>
              <Brain className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Similar Cases Found</p>
                <p className="text-2xl font-bold">{reports.reduce((sum, r) => sum + r.aiAnalysis.similarCases, 0)}</p>
              </div>
              <Activity className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Alerts</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.aiAnalysis.riskLevel === 'high').length}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Medical Reports History</CardTitle>
          <CardDescription>AI-analyzed medical documents and health insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports uploaded yet</p>
              <Button className="mt-4 medical-button" onClick={() => setIsUploadDialogOpen(true)}>
                Upload Your First Report
              </Button>
            </div>
          ) : (
            reports.map((report) => {
              const Icon = getReportTypeIcon(report.type)
              return (
                <Card key={report.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{report.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.date.toLocaleDateString()}
                              </span>
                              <span>{report.fileName}</span>
                              <span>{report.fileSize}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRiskColor(report.aiAnalysis.riskLevel)}>
                              {report.aiAnalysis.riskLevel} risk
                            </Badge>
                            {report.aiAnalysis.status === 'processing' && (
                              <Badge variant="outline" className="animate-pulse">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Processing...
                              </Badge>
                            )}
                            {report.aiAnalysis.status === 'completed' && (
                              <Badge variant="outline" className="bg-success/10 text-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Analyzed
                              </Badge>
                            )}
                          </div>
                        </div>

                        {report.aiAnalysis.status === 'completed' && (
                          <div className="space-y-3 mt-4">
                            {/* AI Findings */}
                            <div>
                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <Brain className="h-4 w-4 text-primary" />
                                AI Findings
                              </h5>
                              <ul className="space-y-1">
                                {report.aiAnalysis.findings.map((finding, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                    <span>{finding}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* AI Recommendations */}
                            <div>
                              <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-warning" />
                                Health Recommendations
                              </h5>
                              <ul className="space-y-1">
                                {report.aiAnalysis.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-warning">→</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Similar Cases Alert */}
                            {report.aiAnalysis.similarCases > 0 && (
                              <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-warning">
                                      Similar Pattern Detected
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      AI found {report.aiAnalysis.similarCases} similar case(s) in your history. 
                                      Based on patterns, we recommend following the health recommendations above 
                                      to prevent potential complications.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* AI Health Timeline */}
      {reports.length > 0 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Health Timeline & Predictions
            </CardTitle>
            <CardDescription>
              Pattern analysis and future health predictions based on your medical history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Health Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Health Score</span>
                  <span className="text-sm font-medium text-success">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on analysis of {reports.length} medical reports
                </p>
              </div>

              {/* Predicted Issues */}
              <div className="border-t border-border pt-4">
                <h5 className="text-sm font-semibold mb-3">Potential Future Health Concerns</h5>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Elevated Cholesterol Risk</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on current trends, you may develop high cholesterol within 6-12 months if dietary 
                        changes are not implemented. Follow recommended diet modifications.
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">30% risk</Badge>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cardiovascular Health - Good</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your heart health indicators are excellent. Continue current exercise routine 
                        and maintain healthy lifestyle.
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-success/10 text-success">Low risk</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
