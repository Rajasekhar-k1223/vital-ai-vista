import { useState, useEffect } from 'react'
import { Video, VideoOff, Mic, MicOff, Phone, Users, Settings, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface VideoCallProps {
  appointmentId: string
  patientName: string
  practitionerName: string
  onEndCall: () => void
  onOpenChat: () => void
}

export function VideoCall({ appointmentId, patientName, practitionerName, onEndCall, onOpenChat }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [duration, setDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting')
  const { toast } = useToast()

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setConnectionStatus('connected')
      toast({
        title: "Connected",
        description: "Virtual appointment started successfully",
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (connectionStatus === 'connected') {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [connectionStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    toast({
      title: isVideoOn ? "Camera Off" : "Camera On",
      description: isVideoOn ? "Your camera has been turned off" : "Your camera has been turned on",
    })
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    toast({
      title: isAudioOn ? "Mic Muted" : "Mic Unmuted",
      description: isAudioOn ? "Your microphone has been muted" : "Your microphone has been unmuted",
    })
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-semibold">Virtual Appointment</h2>
            <p className="text-sm text-muted-foreground">
              {patientName} • {practitionerName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'} className="status-active">
              {connectionStatus === 'connecting' ? 'Connecting...' : formatDuration(duration)}
            </Badge>
            <Badge variant="outline">ID: {appointmentId}</Badge>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-muted">
        {/* Main Video (Remote) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="medical-card w-full h-full m-4">
            <CardContent className="flex items-center justify-center h-full">
              {connectionStatus === 'connecting' ? (
                <div className="text-center">
                  <div className="animate-pulse text-primary">
                    <Users className="h-16 w-16 mx-auto mb-4" />
                  </div>
                  <p className="text-muted-foreground">Connecting to {practitionerName}...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                  <p className="font-medium">{practitionerName}</p>
                  <p className="text-sm text-muted-foreground">Camera is off</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Self Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48">
          <Card className="medical-card overflow-hidden">
            <CardContent className="p-0 relative h-full">
              {isVideoOn ? (
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{patientName}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-muted h-full flex items-center justify-center">
                  <VideoOff className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Waiting Room Notification */}
        {connectionStatus === 'connecting' && (
          <div className="absolute top-4 left-4">
            <Card className="medical-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="animate-pulse">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Waiting Room</p>
                  <p className="text-sm text-muted-foreground">Please wait while we connect you...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-card border-t border-border p-6">
        <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
          {/* Video Toggle */}
          <Button
            size="lg"
            variant={isVideoOn ? "default" : "destructive"}
            onClick={toggleVideo}
            className="h-14 w-14 rounded-full p-0"
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          {/* Audio Toggle */}
          <Button
            size="lg"
            variant={isAudioOn ? "default" : "destructive"}
            onClick={toggleAudio}
            className="h-14 w-14 rounded-full p-0"
          >
            {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          {/* Chat */}
          <Button
            size="lg"
            variant="outline"
            onClick={onOpenChat}
            className="h-14 w-14 rounded-full p-0"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          {/* Settings */}
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full p-0"
          >
            <Settings className="h-6 w-6" />
          </Button>

          {/* End Call */}
          <Button
            size="lg"
            variant="destructive"
            onClick={onEndCall}
            className="h-14 px-8 rounded-full"
          >
            <Phone className="h-6 w-6 mr-2 rotate-[135deg]" />
            End Call
          </Button>
        </div>
      </div>
    </div>
  )
}
