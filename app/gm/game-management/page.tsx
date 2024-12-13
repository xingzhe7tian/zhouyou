'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
import { MessageCircleQuestionIcon as QuestionMarkCircle } from 'lucide-react'
import Link from 'next/link'

const mockData = {
  games: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `游戏${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '/'),
    status: Math.random() > 0.2 ? 'normal' : 'disabled',
    creatorId: Math.floor(Math.random() * 5) + 1
  })),
  servers: Array.from({ length: 60 }, (_, i) => {
    const gameId = Math.floor(i / 3) + 1;
    return {
      id: i + 1,
      name: `游戏${gameId}-区服${(i % 3) + 1}`,
      ip: `192.168.${gameId}.${(i % 3) + 1}`,
      gameId: gameId,
      status: Math.random() > 0.1 ? 'normal' : 'maintenance',
      endTime: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 10000000000).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '/') : undefined
    };
  }),
  items: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    index: (i + 1).toString(),
    added: Math.random() > 0.5 ? "是" : "否",
    number: (Math.floor(Math.random() * 1000) + 1).toString(),
    name: `物品${i + 1}`,
    gameId: Math.floor(Math.random() * 20) + 1
  }))
};

interface Game {
  id: number;
  name: string;
  createdAt: string;
  status: 'normal' | 'disabled';
  creatorId: number;
}

interface Server {
  id: number;
  name: string;
  ip: string;
  gameId: number;
  status: 'normal' | 'maintenance';
  endTime?: string;
}

interface GameItem {
  id: number;
  index: string;
  added: string;
  number: string;
  name: string;
  gameId: number;
}


export default function GameManagement() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>(mockData.games);
  const [servers, setServers] = useState<Server[]>(mockData.servers);
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [serverName, setServerName] = useState('')
  const [serverIp, setServerIp] = useState('')
  const [newGameName, setNewGameName] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [stackLimit, setStackLimit] = useState("99")
  const [inventorySize, setInventorySize] = useState("99")
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showManualSettingsModal, setShowManualSettingsModal] = useState(false)
  const [cdkDialogOpen, setCdkDialogOpen] = useState(false)
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null)
  const [cdkValue, setCdkValue] = useState('')
  const [selectedItemGame, setSelectedItemGame] = useState<string>('')
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [columns, setColumns] = useState([
    { name: '序号', visible: true, isDefault: true },
    { name: '编加', visible: true, isDefault: true },
    { name: '编号', visible: true, isDefault: true },
    { name: '物品名称', visible: true, isDefault: true },
    ...customColumns.map(name => ({ name, visible: true, isDefault: false }))
  ])
  const [items, setItems] = useState<GameItem[]>(mockData.items);
  const [gameSettings, setGameSettings] = useState<{
    [key: string]: {
      stackLimit: string;
      inventorySize: string;
      currencies?: Array<{
        id: number;
        name: string;
        number: string;
      }>;
    };
  }>({});
  const [filteredServers, setFilteredServers] = useState<Server[]>(servers);
  const [filterableAttributes, setFilterableAttributes] = useState<string[]>([]); 
  const [newAttribute, setNewAttribute] = useState(''); 
  const [gameKeywords, setGameKeywords] = useState<{ [key: string]: string[] }>({})
  const [keywords, setKeywords] = useState<string[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<string>('')
  const [newKeyword, setNewKeyword] = useState('')


  const toggleColumnVisibility = (columnName: string) => {
    setColumns(columns.map(col =>
      col.name === columnName ? { ...col, visible: !col.visible } : col
    ))
  }

  const handleHelpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push('/gm/help?section=游戏管理')
  }

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGameId) {
      toast({
        title: "创建失败",
        description: "请先选择一个游戏",
        variant: "destructive",
      })
      return
    }
    const gameId = parseInt(selectedGameId)
    const newServer = {
      id: Math.max(...servers.map(s => s.id)) + 1,
      name: serverName,
      ip: serverIp,
      gameId: gameId,
      status: 'normal' as const
    }
    const updatedServers = [...servers, newServer];
    setServers(updatedServers)
    setFilteredServers(updatedServers.filter(server => server.gameId === gameId))
    toast({
      title: "区服创建成功",
      description: `服务器 "${serverName}" 已成功创建。`,
    })
    setServerName('')
    setServerIp('')
  }

  const handleDeleteServer = (serverId: number) => {
    const updatedServers = servers.filter(server => server.id !== serverId);
    setServers(updatedServers)
    setFilteredServers(updatedServers.filter(server => selectedGameId ? server.gameId === parseInt(selectedGameId) : true))
    toast({
      title: "删除成功",
      description: "服务器已成功删除",
    })
  }

  const handleToggleStatus = (serverId: number) => {
    const updatedServers = servers.map(server => {
      if (server.id === serverId) {
        return {
          ...server,
          status: server.status === 'normal' ? 'maintenance' : 'normal'
        }
      }
      return server
    })
    setServers(updatedServers)
    setFilteredServers(updatedServers.filter(server => selectedGameId ? server.gameId === parseInt(selectedGameId) : true))
    toast({
      title: "状态更新成功",
      description: "服务器状态已更新",
    })
  }

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGameName.trim()) return

    const newGame: Game = {
      id: Math.max(...games.map(g => g.id)) + 1,
      name: newGameName,
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '/'),
      status: 'normal',
      creatorId: 1
    }

    setGames([...games, newGame])

    // 为新游戏创建3个默认区服
    const newServers = Array.from({ length: 3 }, (_, i) => ({
      id: newGame.id * 100 + i + 1,
      name: `${newGame.name}-区服${i + 1}`,
      ip: `192.168.${newGame.id}.${i + 1}`,
      gameId: newGame.id,
      status: 'normal' as const,
      endTime: undefined
    }));

    setServers([...servers, ...newServers])
    setNewGameName('')
  }

  const toggleGameStatus = (gameId: number) => {
    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          status: game.status === 'normal' ? 'disabled' : 'normal'
        }
      }
      return game
    }))
  }

  const deleteGame = (gameId: number, gameName: string) => {
    if (window.confirm(`警告：删除游戏"${gameName}"将会删除与该游戏相关的所有数据，确定要删除吗？`)) {
      setGames(games.filter(game => game.id !== gameId))
      // 删除相关的服务器数据
      setServers(servers.filter(server => server.gameId !== gameId))
      // 删除相关的物品数据
      setItems(items.filter(item => item.gameId !== gameId))
      toast({
        title: "删除成功",
        description: `游戏 "${gameName}" 及其相关数据已被删除。`,
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId)
      } else {
        return [...prev, itemId]
      }
    })
  }

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "删除失败",
        description: "请先选择要删除的物品",
        variant: "destructive",
      })
      return
    }

    if (window.confirm(`确定要删除选中的 ${selectedItems.length} 个物品吗？`)) {
      setItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      toast({
        title: "删除成功",
        description: `已删除 ${selectedItems.length} 个物品。`,
      })
    }
  }

  const handleDeleteCurrentPage = () => {
    if (window.confirm(`确定要删除当前页的 ${currentItems.length} 个物品吗？`)) {
      const currentItemIds = new Set(currentItems.map(item => item.id));
      setItems(prevItems => prevItems.filter(item => !currentItemIds.has(item.id)));
      setSelectedItems(prev => prev.filter(id => !currentItemIds.has(id)));
      toast({
        title: "删除成功",
        description: `已删除当前页 ${currentItems.length} 个物品。`,
      });
    }
  };

  const handleManualSettings = () => {
    setShowManualSettingsModal(true)
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

    // Here you would typically validate the CDK with your backend
    // For this example, we'll simulate a successful validation
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    setServers(servers.map(server => {
      if (server.id === selectedServerId) {
        return {
          ...server,
          endTime: oneMonthFromNow.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })
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

  const filteredItems = items.filter(item => selectedGame ? item.gameId === parseInt(selectedGame) : true);
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => {
    const maxPage = Math.ceil(filteredItems.length / itemsPerPage);
    setCurrentPage(Math.min(Math.max(1, pageNumber), maxPage));
  };

  const handleUpdateItem = (itemId: number, updatedData: Partial<GameItem>) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updatedData };
      }
      return item;
    }));
    toast({
      title: "物品更新成功",
      description: "物品数据已成功更新",
    });
  };

  const handleAddFilterAttribute = () => {
    if (newAttribute.trim()) {
      setFilterableAttributes([...filterableAttributes, newAttribute.trim()]);
      setNewAttribute('');
    }
  };

  const handleRemoveFilterAttribute = (attribute: string) => {
    setFilterableAttributes(filterableAttributes.filter(attr => attr !== attribute));
  };

  const handleAddKeyword = () => {
    if (selectedGame && newKeyword.trim()) {
      setGameKeywords(prev => ({
        ...prev,
        [selectedGame]: [...(prev[selectedGame] || []), newKeyword.trim()]
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    if (selectedGame) {
      setGameKeywords(prev => ({
        ...prev,
        [selectedGame]: prev[selectedGame].filter(k => k !== keyword)
      }))
    }
  }

  useEffect(() => {
    const filteredItems = items.filter(item => selectedGame ? item.gameId === parseInt(selectedGame) : true);
    const maxPage = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [selectedGame, items, itemsPerPage]);

  useEffect(() => {
    const filtered = selectedGameId
      ? servers.filter(server => server.gameId === parseInt(selectedGameId))
      : servers;
    setFilteredServers(filtered);
    setCurrentPage(1); 
  }, [selectedGameId, servers]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        游戏管理
        <Link href="/gm/help?section=游戏管理" className="ml-2" onClick={handleHelpClick}>
          <QuestionMarkCircle className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </Link>
      </h1>
      <Tabs defaultValue="game" className="space-y-4">
        <TabsList>
          <TabsTrigger value="game">管理游戏</TabsTrigger>
          <TabsTrigger value="server">管理区服</TabsTrigger>
          <TabsTrigger value="item">管理游戏物品</TabsTrigger>
        </TabsList>

        <TabsContent value="game">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">创建新游戏</CardTitle>
              <CardDescription className="text-sm text-gray-500">在这里创建一个新的游戏。</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGame} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="gameName" className="text-sm font-medium">游戏名称</Label>
                  <Input
                    id="gameName"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    placeholder="请输入游戏名称"
                    required
                    className="h-8 text-sm"
                  />
                </div>
                <Button type="submit" className="w-full h-8 text-sm">创建游戏</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">游戏列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">游戏名称</TableHead>
                      <TableHead className="text-xs font-semibold">ID</TableHead>
                      <TableHead className="text-xs font-semibold">创建者ID</TableHead>
                      <TableHead className="text-xs font-semibold">状态</TableHead>
                      <TableHead className="text-xs font-semibold">创建时间</TableHead>
                      <TableHead className="text-xs font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((game) => (
                      <TableRow key={game.id} className="transition-colors hover:bg-gray-50">
                        <TableCell className="text-sm">{game.name}</TableCell>
                        <TableCell className="text-sm">ID: {game.id}</TableCell>
                        <TableCell className="text-sm">创建者ID: {game.creatorId}</TableCell>
                        <TableCell>
                          <Badge variant={game.status === 'normal' ? 'default' : 'destructive'} className="text-xs">
                            {game.status === 'normal' ? '正常' : '禁用'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">创建时间: {game.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleGameStatus(game.id)}
                              className="text-xs h-7 transition-colors hover:bg-gray-100"
                            >
                              {game.status === 'normal' ? '禁用' : '启用'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteGame(game.id, game.name)}
                              className="text-xs h-7 transition-colors hover:bg-gray-100"
                            >
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    显示 {(currentPage - 1) * itemsPerPage + 1} 到 {Math.min(currentPage * itemsPerPage, games.length)} 共 {games.length} 条
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(games.length / itemsPerPage), prev + 1))}
                      disabled={currentPage === Math.ceil(games.length / itemsPerPage)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">添加区服信息</CardTitle>
              <CardDescription className="text-sm text-gray-500">在这里添加新的游戏区服。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form onSubmit={handleCreateServer} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="gameSelect" className="sr-only">选择游戏</Label>
                    <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择游戏" />
                      </SelectTrigger>
                      <SelectContent>
                        {games.map((game) => (
                          <SelectItem key={game.id} value={game.id.toString()}>{game.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="serverName" className="sr-only">区服名称</Label>
                    <Input
                      id="serverName"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      placeholder="请输入区服名称"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="serverIp" className="sr-only">服务器IP</Label>
                    <Input
                      id="serverIp"
                      value={serverIp}
                      onChange={(e) => setServerIp(e.target.value)}
                      placeholder="请输入服务器IP"
                      required
                    />
                  </div>
                  <Button type="submit">添加区服</Button>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">游戏名称</TableHead>
                      <TableHead className="text-xs font-semibold">区服名称</TableHead>
                      <TableHead className="text-xs font-semibold">服务器IP</TableHead>
                      <TableHead className="text-xs font-semibold">区服ID</TableHead>
                      <TableHead className="text-xs font-semibold">状态</TableHead>
                      <TableHead className="text-xs font-semibold">服务截止时间</TableHead>
                      <TableHead className="text-xs font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServers
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((server) => (
                        <TableRow key={server.id} className="transition-colors hover:bg-gray-50">
                          <TableCell className="text-sm">{games.find(game => game.id === server.gameId)?.name}</TableCell>
                          <TableCell className="text-sm">{server.name}</TableCell>
                          <TableCell className="text-sm">{server.ip}</TableCell>
                          <TableCell className="text-sm">{server.id}</TableCell>
                          <TableCell>
                            <Badge variant={server.status === 'normal' ? 'default' : 'destructive'} className="text-xs">
                              {server.status === 'normal' ? '正常' : '维护中'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{server.endTime || '未设置'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(server.id)}
                                className="text-xs h-7 transition-colors hover:bg-gray-100"
                              >
                                {server.status === 'normal' ? '设为维护' : '恢复正常'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenCdkDialog(server.id)}
                                className="text-xs h-7 transition-colors hover:bg-gray-100"
                              >
                                使用CDK
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteServer(server.id)}
                                className="text-xs h-7 transition-colors hover:bg-gray-100"
                              >
                                删除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    显示 {Math.min((currentPage - 1) * itemsPerPage + 1, filteredServers.length)} 到 {Math.min(currentPage * itemsPerPage, filteredServers.length)} 共 {filteredServers.length} 条
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      {"<<"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      {"<"}
                    </Button>
                    <span className="text-sm">
                      第 {currentPage} 页，共 {Math.ceil(filteredServers.length / itemsPerPage)} 页
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredServers.length / itemsPerPage), prev + 1))}
                      disabled={currentPage === Math.ceil(filteredServers.length / itemsPerPage)}
                    >
                      {">"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.ceil(filteredServers.length / itemsPerPage))}
                      disabled={currentPage === Math.ceil(filteredServers.length / itemsPerPage)}
                    >
                      {">>"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="item">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">游戏物品数据分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">选择游戏</Label>
                    <Select value={selectedGame} onValueChange={(value) => {
                      setSelectedGame(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择游戏" />
                      </SelectTrigger>
                      <SelectContent>
                        {games.map((game) => (
                          <SelectItem key={game.id} value={game.id.toString()}>{game.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="space-y-4 mt-4">
                      <Label>游戏关键字</Label>
                      <div className="flex space-x-2">
                        <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="选择关键字" />
                          </SelectTrigger>
                          <SelectContent>
                            {keywords.map((keyword) => (
                              <SelectItem key={keyword} value={keyword}>{keyword}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setKeywords(keywords.filter(k => k !== selectedKeyword))
                            setSelectedKeyword('')
                          }}
                          disabled={!selectedKeyword}
                        >
                          删除
                        </Button>
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="输入新的关键字"
                        />
                        <Button
                          onClick={() => {
                            if (newKeyword && !keywords.includes(newKeyword)) {
                              setKeywords([...keywords, newKeyword])
                              setNewKeyword('')
                            }
                          }}
                          disabled={!newKeyword || keywords.includes(newKeyword)}
                        >
                          添加
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">物品叠加上限</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={selectedGame ? (gameSettings[selectedGame]?.stackLimit || "99") : ""}
                        onChange={(e) => {
                          if (selectedGame) {
                            setGameSettings(prev => ({
                              ...prev,
                              [selectedGame]: { ...prev[selectedGame], stackLimit: e.target.value }
                            }));
                          }
                        }}
                        className="w-full"
                        disabled={!selectedGame}
                      />
                      <Button variant="secondary" size="sm" disabled={!selectedGame}>更新</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">背包大小</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={selectedGame ? (gameSettings[selectedGame]?.inventorySize || "99") : ""}
                        onChange={(e) => {
                          if (selectedGame) {
                            setGameSettings(prev => ({
                              ...prev,
                              [selectedGame]: { ...prev[selectedGame], inventorySize: e.target.value }
                            }));
                          }
                        }}
                        className="w-full"
                        disabled={!selectedGame}
                      />
                      <Button variant="secondary" size="sm" disabled={!selectedGame}>更新</Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div>游戏ID: {selectedGame || '未选择'}</div>
                  <div>物品叠加上限: {selectedGame ? (gameSettings[selectedGame]?.stackLimit || "99") : "N/A"}</div>
                  <div>背包大小: {selectedGame ? (gameSettings[selectedGame]?.inventorySize || "99") : "N/A"}</div>
                  <div>叠加状态: {selectedGame ? "游戏特定设置" : "未选择游戏"}</div>
                  <div>当前游戏物品数量: {filteredItems.length}</div>
                  {selectedGame && gameSettings[selectedGame]?.currencies?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {gameSettings[selectedGame].currencies.map((currency, index) => (
                        <div key={`${currency.id}-${index}`} className="flex items-center justify-between bg-gray-100 py-1 px-2 rounded-md">
                          <span><span>货币{index + 1}: {currency.number} {currency.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-100 transition-colors"
                            onClick={() => {
                              const updatedCurrencies = gameSettings[selectedGame].currencies.filter((_, i) => i !== index);
                              setGameSettings(prev => ({
                                ...prev,
                                [selectedGame]: {
                                  ...prev[selectedGame],
                                  currencies: updatedCurrencies                                }
                              }));
                              toast({
                                title: "货币已删除",
                                description: `${currency.name} 已从货币列表中移除。`,
                              });
                            }}
                          >
                            删除
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handleManualSettings}>手动设置</Button>
                    <Button variant="outline" size="sm">+ 批量添加</Button>
                    <Button variant="outline" size="sm">+ 手动添加</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>× 删除选中</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteCurrentPage}>× 删除当前页</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowColumnSettings(true)}>
                      <Settings className="w-4 h-4 mr-1" />
                      列设置
                    </Button>
                  </div>
                </div>

                

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length === items.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        {columns.map((column) => (
                          column.visible && (
                            <TableHead key={column.name}>
                              {column.name === '物品名称' ? '叠加' : column.name}
                            </TableHead>
                          )
                        ))}
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                            />
                          </TableCell>
                          {columns[0].visible && <TableCell>{item.index}</TableCell>}
                          {columns[1].visible && <TableCell>{item.added}</TableCell>}
                          {columns[2].visible && <TableCell>{item.number}</TableCell>}
                          {columns[3].visible && <TableCell>{item.name}</TableCell>}
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => {
                                if (selectedGame) {
                                  const currentSettings = gameSettings[selectedGame] || {};
                                  const currencies = currentSettings.currencies|| [];
                                  
                                  if (currencies.length >= 2) {
                                    toast({
                                      title: "无法设置货币",
                                      description: "每个游戏最多只能设置两种货币。",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  
                                  const newCurrency = {
                                    id: `${item.id}-${Date.now()}`, 
                                    name: item.name,
                                    number: item.number
                                  };
                                  
                                  setGameSettings(prev => ({
                                    ...prev,
                                    [selectedGame]: {
                                      ...prev[selectedGame],
                                      currencies: [...currencies, newCurrency]
                                    }
                                  }));
                                  
                                  toast({
                                    title: "设置成功",
                                    description: `已将 ${item.name} 设置为货币。`,
                                  });
                                }
                              }}
                            >
                              设为货币
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <span>每页显示：</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span>
                        显示 {indexOfFirstItem + 1} 到 {Math.min(indexOfLastItem, filteredItems.length)}，
                        共 {filteredItems.length} 条
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                      >
                        {"<<"}</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        {"<"}
                      </Button>
                      <span className="text-sm">
                        第 {currentPage} 页，共 {Math.ceil(filteredItems.length / itemsPerPage)} 页
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                      >
                        {">"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.ceil(filteredItems.length / itemsPerPage))}
                        disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                      >
                        {">>"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {showManualSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">手动设置</h2>
            <p>这里是手动设置的内容，可以添加一些输入框或者其他控件来进行设置。</p>
            <Button onClick={() => setShowManualSettingsModal(false)}>关闭</Button>
          </div>
        </div>
      )}
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
      <Dialog open={showColumnSettings} onOpenChange={setShowColumnSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>列设置</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {columns.map((column) => (
              <div key={column.name} className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={column.name}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.name)}
                  />
                  <label
                    htmlFor={column.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.name}
                  </label>
                </div>
                {!column.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCustomColumns(customColumns.filter(c => c !== column.name));
                    }}
                  >
                    删除
                  </Button>
                )}
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">添加新列</h3>
              <div className="flex space-x-2">
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="新列名称"
                />
                <Button onClick={() => {
                  if (newColumnName) {
                    setCustomColumns([...customColumns, newColumnName]);
                    setNewColumnName('');
                  }
                }}>
                  添加
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowColumnSettings(false)}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

