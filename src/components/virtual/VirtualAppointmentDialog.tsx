import { useState } from 'react'
import { Video, Calendar, Clock, User } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { VideoCall } from './VideoCall'
import { ChatPanel } from './ChatPanel'

interface VirtualAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: string
  patientName: string
  practitionerName: string
  appointmentDate: Date
  appointmentType: string
  currentUser: 'patient' | 'practitioner'
  currentUserName: string
}

export function VirtualAppointmentDialog({
  open,
  onOpenChange,
  appointmentId,
  patientName,
  practitionerName,
  appointmentDate,
  appointmentType,
  currentUser,
  currentUserName
}: VirtualAppointmentDialogProps) {
  const [isInCall, setIsInCall] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleJoinCall = () => {
    setIsInCall(true)
  }

  const handleEndCall = () => {
    setIsInCall(false)
    onOpenChange(false)
  }

  if (isInCall) {
    return (
      <>
        <VideoCall
          appointmentId={appointmentId}
          patientName={patientName}
          practitionerName={practitionerName}
          onEndCall={handleEndCall}
          onOpenChat={() => setIsChatOpen(true)}
        />
        {isChatOpen && (
          <ChatPanel
            appointmentId={appointmentId}
            currentUser={currentUser}
            currentUserName={currentUserName}
            otherUserName={currentUser === 'patient' ? practitionerName : patientName}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover max-w-2xl">
        <DialogHeader>
          <DialogTitle>Virtual Appointment</DialogTitle>
          <DialogDescription>Join your virtual healthcare appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appointment Details */}
          <Card className="medical-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Appointment Details</h3>
                <Badge variant="outline">{appointmentType}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium">{patientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{practitionerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{appointmentDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{appointmentDate.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Check */}
          <Card className="medical-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">System Check</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera</span>
                  <Badge className="status-active">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Microphone</span>
                  <Badge className="status-active">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Network Connection</span>
                  <Badge className="status-active">Strong</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Join Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinCall} className="medical-button">
              <Video className="h-4 w-4 mr-2" />
              Join Virtual Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
