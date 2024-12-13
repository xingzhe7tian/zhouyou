import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

interface BackendHeaderProps {
  title: string
  userEmail: string
}

export function BackendHeader({ title, userEmail }: BackendHeaderProps) {
  const router = useRouter()

  const switchBackend = (backend: string) => {
    switch(backend) {
      case 'user-center':
        router.push('/user-center')
        break
      case 'tech-agent':
        router.push('/tech-agent')
        break
      case 'admin':
        router.push('/admin')
        break
      case 'gm':
        router.push('/gm')
        break
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{userEmail}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  切换后台 <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => switchBackend('user-center')}>用户中心</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchBackend('tech-agent')}>技术代理</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchBackend('admin')}>管理控制台</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchBackend('gm')}>GM后台</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              返回首页
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

