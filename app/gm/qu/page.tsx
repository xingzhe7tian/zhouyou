'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { MessageCircleQuestionIcon as QuestionMarkCircle } from 'lucide-react'


interface Server {
  id: number;
  name: string;
  ip: string;
  status: 'normal' | 'maintenance';
  endTime?: string;
}

interface Game {
  id: number;
  name: string;
}

// 模拟数据
const mockServers: Server[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `区服${i + 1}`,
  ip: `192.168.1.${i + 1}`,
  status: Math.random() > 0.2 ? 'normal' : 'maintenance',
  endTime: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 10000000000).toLocaleString('zh-CN') : undefined
}));

const mockGame: Game = {
  id: 1,
  name: "示例游戏"
};

export default function ServerManagement() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get('id')
  const router = useRouter();

  const [servers, setServers] = useState<Server[]>(mockServers);
  const [game, setGame] = useState<Game>(mockGame);
  const [newServerName, setNewServerName] = useState('')
  const [newServerIp, setNewServerIp] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null)
  const [cdkValue, setCdkValue] = useState('')
  const [cdkDialogOpen, setCdkDialogOpen] = useState(false)

  useEffect(() => {
    // 在实际应用中，这里应该根据 gameId 从服务器获取游戏和区服数据
    console.log(`Fetching data for game ID: ${gameId}`)
  }, [gameId])

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newServerName.trim() || !newServerIp.trim()) return

    const newServer: Server = {
      id: Math.max(...servers.map(s => s.id)) + 1,
      name: newServerName,
      ip: newServerIp,
      status: 'normal'
    }

    setServers([...servers, newServer])
    setNewServerName('')
    setNewServerIp('')
    toast({
      title: "区服创建成功",
      description: `区服 "${newServerName}" 已成功创建。`,
    })
  }

  const toggleServerStatus = (serverId: number) => {
    setServers(servers.map(server => {
      if (server.id === serverId) {
        return {
          ...server,
          status: server.status === 'normal' ? 'maintenance' : 'normal'
        }
      }
      return server
    }))
    toast({
      title: "区服状态已更新",
      description: `区服状态已成功切换。`,
    })
  }

  const deleteServer = (serverId: number, serverName: string) => {
    if (window.confirm(`确定要删除区服"${serverName}"吗？`)) {
      setServers(servers.filter(server => server.id !== serverId))
      toast({
        title: "删除成功",
        description: `区服 "${serverName}" 已被删除。`,
      })
    }
  }

  const handleOpenCdkDialog = (serverId: number) => {
    setSelectedServerId(serverId)
    setCdkDialogOpen(true)
  }

  const handleCdkSubmit = () => {
    if (!cdkValue.trim()) {
      toast({
        title: "验证失败",
        description: "请输入CDK",
        variant: "destructive",
      })
      return
    }

    // 这里应该实际验证CDK
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    setServers(servers.map(server => {
      if (server.id === selectedServerId) {
        return {
          ...server,
          endTime: oneMonthFromNow.toLocaleString('zh-CN')
        }
      }
      return server
    }))

    toast({
      title: "CDK使用成功",
      description: "服务器使用期限已延长1个月。",
    })

    setCdkDialogOpen(false)
    setCdkValue('')
    setSelectedServerId(null)
  }

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = servers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <BreadcrumbNav
        items={[
          { href: '/gm/game', label: '游戏管理' },
        ]}
        currentPathLabel={'区服管理'}
      />

      <h1 className="text-3xl font-bold mb-6 flex items-center">
        区服管理
        <Link href="/gm/help#区服管理" className="ml-2">
          <QuestionMarkCircle className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </Link>
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>创建新区服</CardTitle>
          <CardDescription>为当前游戏添加新的区服。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateServer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serverName">区服名称</Label>
              <Input
                id="serverName"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder="请输入区服名称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serverIp">服务器IP</Label>
              <Input
                id="serverIp"
                value={newServerIp}
                onChange={(e) => setNewServerIp(e.target.value)}
                placeholder="请输入服务器IP"
                required
              />
            </div>
            <Button type="submit">创建区服</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>区服列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>区服名称</TableHead>
                <TableHead>服务器IP</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>服务截止时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((server) => (
                <TableRow key={server.id}>
                  <TableCell>{server.name}</TableCell>
                  <TableCell>{server.ip}</TableCell>
                  <TableCell>
                    <Badge variant={server.status === 'normal' ? 'default' : 'destructive'}>
                      {server.status === 'normal' ? '正常' : '维护中'}
                    </Badge>
                  </TableCell>
                  <TableCell>{server.endTime || '未设置'}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleServerStatus(server.id)}>
                        {server.status === 'normal' ? '设为维护' : '恢复正常'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenCdkDialog(server.id)}>
                        使用CDK
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteServer(server.id, server.name)}>
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 分页 */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              显示 {indexOfFirstItem + 1} 到 {Math.min(indexOfLastItem, servers.length)} 共 {servers.length} 条
            </div>
            <div className="space-x-2">
              {Array.from({ length: Math.ceil(servers.length / itemsPerPage) }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={cdkDialogOpen} onOpenChange={setCdkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>使用CDK</DialogTitle>
            <DialogDescription>
              请输入CDK以延长服务器使用期限
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cdk" className="text-right">
                CDK
              </Label>
              <Input
                id="cdk"
                value={cdkValue}
                onChange={(e) => setCdkValue(e.target.value)}
                className="col-span-3"
                placeholder="请输入CDK"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCdkDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCdkSubmit}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

