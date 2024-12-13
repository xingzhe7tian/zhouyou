'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast, useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Login() {
  const [email, setEmail] = useState('270148539@qq.com')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    if ((email === 'user@example.com' && password === 'password') || 
        (email === '270148539@qq.com' && password === '111111')) {
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      })
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
      if (email === '270148539@qq.com') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      toast({
        title: "登录失败",
        description: "邮箱或密码错误",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center gradient-text">登录您的账户</CardTitle>
            <CardDescription className="text-center">输入您的账号信息以登录</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="输入您的邮箱" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="输入您的密码" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                还没有账号？ 
                <Link href="/register" className="font-medium text-primary hover:underline ml-1">
                  立即注册
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

