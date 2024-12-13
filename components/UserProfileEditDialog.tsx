import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Camera } from 'lucide-react'

interface UserProfileEditDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (nickname: string, avatarUrl: string) => void
  initialNickname: string
  initialAvatarUrl: string
}

export function UserProfileEditDialog({
  isOpen,
  onClose,
  onSave,
  initialNickname,
  initialAvatarUrl
}: UserProfileEditDialogProps) {
  const [nickname, setNickname] = useState(initialNickname)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    onSave(nickname, avatarUrl)
    onClose()
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑个人信息</DialogTitle>
          <DialogDescription>
            在这里修改您的昵称和头像。点击保存以应用更改。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer relative group" onClick={handleAvatarClick}>
              <AvatarImage src={avatarUrl} alt="用户头像" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Label htmlFor="avatar" className="text-center text-sm text-gray-500">
              点击头像更改
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nickname" className="text-right">
              昵称
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" onClick={handleSave}>
            保存更改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

