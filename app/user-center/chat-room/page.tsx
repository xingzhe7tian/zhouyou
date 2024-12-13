'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Simulated user data (in a real app, this would come from authentication)
  const currentUser = 'CurrentUser'

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    newSocket.on('chat message', (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && socket) {
      const message: Message = {
        id: Date.now().toString(),
        user: currentUser,
        content: newMessage.trim(),
        timestamp: new Date(),
      }
      socket.emit('chat message', message)
      setNewMessage('')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>聊天室</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] mb-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start mb-4 ${message.user === currentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex ${message.user === currentUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[70%]`}>
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarFallback>{message.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${message.user === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <p className="text-sm font-semibold mb-1">{message.user}</p>
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="输入消息..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit">发送</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

