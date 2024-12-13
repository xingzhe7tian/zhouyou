'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Users, Settings, BarChart2, Shield, X, RefreshCw, Loader2, Command, SquareTerminal, Bot, BookOpen, Edit, LogOut, ChevronsUpDown, Home } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
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

// Generate 50 mock users
const generateMockUsers = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    email: `user${i + 1}@example.com`,
    role: i === 0 ? 'Admin' : 'User',
    name: `User ${i + 1}`,
  }))
}

const mockUsers = generateMockUsers()

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
        {
          title: "Reports",
          url: "/admin/reports",
        },
      ],
    },
    {
      title: "用户管理",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "所有用户",
          url: "/admin/users",
        },
        {
          title: "普通用户",
          url: "/admin/users?type=normal",
        },
        {
          title: "GM用户",
          url: "/admin/users?type=gm",
        },
      ],
    },
    {
      title: "Content Management",
      url: "/admin/content",
      icon: BookOpen,
      items: [
        {
          title: "Pages",
          url: "/admin/content/pages",
        },
        {
          title: "Posts",
          url: "/admin/content/posts",
        },
        {
          title: "Media",
          url: "/admin/content/media",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Security",
          url: "/admin/settings/security",
        },
        {
          title: "Appearance",
          url: "/admin/settings/appearance",
        },
      ],
    },
  ],
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userData, setUserData] = useState({ name: '', email: '' })
  const router = useRouter()
  const [openPages, setOpenPages] = useState<Array<{ href: string; label: string }>>([])
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({})
  const [iframeLoading, setIframeLoading] = useState<{ [key: string]: boolean }>({})
  const loadingTimers = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail !== '270148539@qq.com') {
      router.push('/dashboard')
    } else {
      setUserEmail(userEmail)
      // 模拟从服务器获取用户数据
      setUserData({ name: 'Admin User', email: userEmail })
      setIsLoading(false)
    }
  }, [router])

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

  const handlePageClick = (item: { href: string; label: string }) => {
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

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    router.push('/login')
  }, [router])

  const handleOpenProfileEdit = () => {
    setIsProfileEditOpen(true);
  };

  const handleSaveProfile = (nickname: string, avatarUrl: string) => {
    // 这里应该实现保存逻辑，例如发送API请求
    console.log('Saving profile:', { nickname, avatarUrl });
    setUserData(prevData => ({ ...prevData, name: nickname }));
    setIsProfileEditOpen(false);
  };

  useEffect(() => {
    return () => {
      Object.values(loadingTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

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
                    <div 
                      className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenProfileEdit();
                      }}
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
                  <DropdownMenuItem
                    onClick={() => router.push('/')}
                    className="gap-2 p-2"
                  >
                    <Home className="size-4 shrink-0" />
                    返回网站首页
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    {/* Add team option removed */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>平台</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  open={openItems[item.title] || false}
                  onOpenChange={(isOpen) => setOpenItems(prev => ({ ...prev, [item.title]: isOpen }))}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} onClick={() => setOpenItems(prev => ({ ...prev, [item.title]: !prev[item.title] }))}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url} onClick={(e) => {
                                e.preventDefault();
                                handlePageClick({ href: subItem.url, label: subItem.title });
                              }}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
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
                      <AvatarFallback className="rounded-lg">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs">
                        {userData.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${userData.email}`}
                          alt={userData.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          AD
                        </AvatarFallback>
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
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleOpenProfileEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      修改昵称
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Admin Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedPage || 'Overview'}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
                <h2 className="text-3xl font-bold mb-6 gradient-text">管理员控制台概览</h2>
                <p className="text-xl mb-8 text-gray-600">欢迎回来, {userEmail}</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>总用户</CardTitle>
                      <CardDescription>系统总用户数</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">10,234</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>今日活跃</CardTitle>
                      <CardDescription>今日活跃用户数</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">1,256</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>系统负载</CardTitle>
                      <CardDescription>当前系统负载情况</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">65%</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>最近登录用户</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>名称</TableHead>
                          <TableHead>邮箱</TableHead>
                          <TableHead>角色</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsers.slice(0, 5).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>快速操作</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Button onClick={() => handlePageClick({ href: '/admin/users', label: '用户管理' })}>管理用户</Button>
                    <Button onClick={() => handlePageClick({ href: '/admin/analytics', label: '数据分析' })}>查看数据分析</Button>
                    <Button onClick={() => handlePageClick({ href: '/admin/settings', label: '系统设置' })}>系统设置</Button>
                  </CardContent>
                </Card>
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

