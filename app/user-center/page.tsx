'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, UserCircle, Code, X, RefreshCw, FileText, Backpack, BarChart2, Settings, Loader2, MessageCircle, LogOut, ChevronsUpDown } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserProfileEditDialog } from '@/components/UserProfileEditDialog'

const menuItems = [
  { icon: FileText, label: '项目结构', href: '/user-center/project-structure' },
  { icon: UserCircle, label: '个人信息', href: '/user-center/profile' },
  { icon: BarChart2, label: '数据分析', href: '/user-center/analytics' },
  { icon: Settings, label: '设置', href: '/user-center/settings' },
  { icon: Code, label: '技术代理', href: '/tech-agent' },
  { icon: Backpack, label: '玩家物品', href: '/user-center/player-items' },
  { icon: MessageCircle, label: '聊天室', href: '/user-center/chat-room' },
]

export default function UserCenter() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [openPages, setOpenPages] = useState<Array<{ href: string; label: string }>>([])
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({})
  const [iframeLoading, setIframeLoading] = useState<{ [key: string]: boolean }>({})
  const loadingTimers = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [userData, setUserData] = useState({ name: 'User', email: userEmail })

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

  useEffect(() => {
    menuItems.forEach(item => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'document'
      link.href = item.href
      document.head.appendChild(link)
    })
  }, [])

  const checkIframeLoaded = (href: string) => {
    const iframe = iframeRefs.current[href];
    if (iframe) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.readyState === 'complete') {
          setIframeLoading(prev => ({ ...prev, [href]: false }));
          if (loadingTimers.current[href]) {
            clearTimeout(loadingTimers.current[href]!);
            loadingTimers.current[href] = null;
          }
          return;
        }
      } catch (e) {
        setIframeLoading(prev => ({ ...prev, [href]: false }));
        return;
      }
    }
    loadingTimers.current[href] = setTimeout(() => checkIframeLoaded(href), 100);
  };

  const handlePageClick = (item: typeof menuItems[0]) => {
    if (!openPages.some(page => page.href === item.href)) {
      setOpenPages(prevPages => [...prevPages, { href: item.href, label: item.label }])
      setIframeLoading(prev => ({ ...prev, [item.href]: true }))
      checkIframeLoaded(item.href);
    }
    setSelectedPage(item.href)
  }

  const handleClosePage = (href: string) => {
    setOpenPages(prevPages => prevPages.filter(page => page.href !== href))
    if (selectedPage === href) {
      const remainingPages = openPages.filter(page => page.href !== href)
      setSelectedPage(remainingPages.length > 0 ? remainingPages[remainingPages.length - 1].href : null)
    }
    if (loadingTimers.current[href]) {
      clearTimeout(loadingTimers.current[href]!);
      loadingTimers.current[href] = null;
    }
  }

  const handleRefreshPage = (href: string) => {
    const iframe = iframeRefs.current[href]
    if (iframe) {
      setIframeLoading(prev => ({ ...prev, [href]: true }))
      iframe.src = iframe.src
      checkIframeLoaded(href);
    }
  }

  useEffect(() => {
    return () => {
      Object.values(loadingTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const handleOpenProfileEdit = () => {
    setIsProfileEditOpen(true)
  }

  const handleSaveProfile = (nickname: string, avatarUrl: string) => {
    setUserData(prevData => ({ ...prevData, name: nickname }))
    setIsProfileEditOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/login');
  }

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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  const isAdmin = userEmail === '270148539@qq.com'

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${userData.email}`}
                        alt={userData.name}
                      />
                      <AvatarFallback className="rounded-lg">{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs">
                        {userData.email}
                      </span>
                    </div>
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel 
                    className="p-0 font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={handleOpenProfileEdit}
                  >
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${userData.email}`}
                          alt={userData.name}
                        />
                        <AvatarFallback className="rounded-lg">{userData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData.name}
                        </span>
                        <span className="truncate text-xs">
                          {userData.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>用户中心</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton onClick={() => handlePageClick(item)} tooltip={item.label}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    切换后台
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="start"
                  side="right"
                  sideOffset={8}
                >
                  <DropdownMenuItem onClick={() => switchBackend('user-center')}>
                    用户中心
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchBackend('tech-agent')}>
                    技术代理
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchBackend('admin')}>
                    管理控制台
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchBackend('gm')}>
                    GM后台
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 p-2 bg-gray-100 overflow-x-auto">
            {openPages.map((page) => (
              <div
                key={page.href}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-all duration-200 cursor-pointer ${
                  selectedPage === page.href ? 'bg-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedPage(page.href)}
              >
                <span>{page.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClosePage(page.href)
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 active:scale-95"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRefreshPage(page.href)
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 active:scale-95"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex-grow overflow-hidden relative">
            {openPages.map((page) => (
              <div 
                key={page.href} 
                className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                  selectedPage === page.href 
                    ? 'opacity-100 z-10 pointer-events-auto' 
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {iframeLoading[page.href] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
                <iframe
                  ref={el => iframeRefs.current[page.href] = el}
                  src={page.href}
                  className="w-full h-full"
                  title={page.label}
                  onLoad={() => checkIframeLoaded(page.href)}
                />
              </div>
            ))}
            {!selectedPage && (
              <div className="h-full overflow-auto p-8">
                <h2 className="text-3xl font-bold mb-6 gradient-text">用户中心概览</h2>
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
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
      <UserProfileEditDialog
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        onSave={handleSaveProfile}
        initialNickname={userData.name}
        initialAvatarUrl={`https://avatar.vercel.sh/${userData.email}`}
      />
    </SidebarProvider>
  )
}

<Footer />

