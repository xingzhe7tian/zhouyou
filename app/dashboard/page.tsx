'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Home, Users, Settings, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react'

const data = [
  { name: '一月', 用户: 4000, 收入: 2400 },
  { name: '二月', 用户: 3000, 收入: 1398 },
  { name: '三月', 用户: 2000, 收入: 9800 },
  { name: '四月', 用户: 2780, 收入: 3908 },
  { name: '五月', 用户: 1890, 收入: 4800 },
  { name: '六月', 用户: 2390, 收入: 3800 },
]

const menuItems = [
  { icon: Home, label: '概览', href: '/dashboard' },
  { icon: Users, label: '用户管理', href: '/dashboard/users' },
  { icon: BarChart2, label: '数据分析', href: '/dashboard/analytics' },
  { icon: Settings, label: '设置', href: '/dashboard/settings' },
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setUserEmail(localStorage.getItem('userEmail') || '')
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  const isAdmin = userEmail === '270148539@qq.com'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header showMenu={false} />
      <div className="flex flex-grow">
        <aside className={`bg-white border-r border-gray-200 min-h-screen transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <div className="flex justify-end p-2 border-b border-gray-200">
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={isSidebarCollapsed ? "展开菜单" : "收起菜单"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors ${
                      isSidebarCollapsed 
                        ? 'justify-center' 
                        : 'w-full'
                    }`}
                    title={isSidebarCollapsed ? item.label : ''}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`ml-3 flex-grow whitespace-nowrap ${isSidebarCollapsed ? 'hidden' : 'inline-block'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-grow p-8">
          <h1 className="text-3xl font-bold mb-6 gradient-text">控制台</h1>
          <p className="text-xl mb-8 text-gray-600">欢迎回来, {userEmail}</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>总用户</CardTitle>
                <CardDescription>您的网站总用户数</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,234</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>今日活跃</CardTitle>
                <CardDescription>今日活跃用户数</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">256</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>总收入</CardTitle>
                <CardDescription>本月总收入</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">¥9,876</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>用户增长和收入趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="用户" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="收入" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {isAdmin && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>管理员操作</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button>进入管理控制台</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

