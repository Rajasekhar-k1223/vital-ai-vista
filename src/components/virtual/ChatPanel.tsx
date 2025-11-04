import { useState, useRef, useEffect } from 'react'
import { Send, X, Paperclip, File } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  sender: 'patient' | 'practitioner'
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'file'
  fileName?: string
}

interface ChatPanelProps {
  appointmentId: string
  currentUser: 'patient' | 'practitioner'
  currentUserName: string
  otherUserName: string
  onClose: () => void
}

export function ChatPanel({ appointmentId, currentUser, currentUserName, otherUserName, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'practitioner',
      senderName: otherUserName,
      content: 'Hello! Thank you for joining. How are you feeling today?',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      senderName: currentUserName,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 flex flex-col shadow-lg">
      {/* Header */}
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Chat</CardTitle>
            <p className="text-sm text-muted-foreground">{otherUserName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.sender === currentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-xs font-medium">
                    {message.senderName.charAt(0)}
                  </div>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className={`rounded-lg p-3 ${
                    message.sender === currentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.type === 'file' ? (
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        <span className="text-sm">{message.fileName}</span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  <span className={`text-xs text-muted-foreground ${message.sender === currentUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="resize-none"
            />
          </div>
          <Button onClick={handleSendMessage} size="icon" className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send
        </p>
      </div>
    </div>
  )
}
