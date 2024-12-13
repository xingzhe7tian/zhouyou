import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'

export default function Register() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container my-8 flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>注册</CardTitle>
            <CardDescription>创建一个新账号</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">姓名</Label>
                  <Input id="name" placeholder="输入您的姓名" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">邮箱</Label>
                  <Input id="email" placeholder="输入您的邮箱" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">密码</Label>
                  <Input id="password" type="password" placeholder="创建一个密码" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/login">已有账号</Link>
            </Button>
            <Button>注册</Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

