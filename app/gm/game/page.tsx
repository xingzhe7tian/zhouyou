'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'
import { MessageCircleQuestionIcon as QuestionMarkCircle } from 'lucide-react'

interface Game {
  id: number;
  name: string;
  createdAt: string;
  status: 'normal' | 'disabled';
  creatorId: number;
  keywords: string[];
}

// 模拟数据
const mockGames: Game[] = Array.from({ length: 20 }, (_, i) => ({
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
  creatorId: Math.floor(Math.random() * 5) + 1,
  keywords: ["攻击", "防御"]
}));

export default function GameManagement() {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [newGameName, setNewGameName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

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
      creatorId: 1,
      keywords: ["攻击", "防御"]
    }

    setGames([...games, newGame])
    setNewGameName('')
    toast({
      title: "游戏创建成功",
      description: `游戏 "${newGameName}" 已成功创建。`,
    })
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
    toast({
      title: "游戏状态已更新",
      description: `游戏状态已成功切换。`,
    })
  }

  const deleteGame = (gameId: number, gameName: string) => {
    if (window.confirm(`警告：删除游戏"${gameName}"将会删除与该游戏相关的所有数据，确定要删除吗？`)) {
      setGames(games.filter(game => game.id !== gameId))
    }
  }

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = games.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6">游戏管理
        <Link href="/gm/help?section=游戏管理" className="ml-2">
          <QuestionMarkCircle className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </Link>
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>创建新游戏</CardTitle>
          <CardDescription>在这里创建一个新的游戏。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGame} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameName">游戏名称</Label>
              <Input
                id="gameName"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
                placeholder="请输入游戏名称"
                required
              />
            </div>
            <Button type="submit">创建游戏</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>游戏列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>游戏名称</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>创建者ID</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>{game.id}</TableCell>
                  <TableCell>{game.creatorId}</TableCell>
                  <TableCell>
                    <Badge variant={game.status === 'normal' ? 'default' : 'destructive'}>
                      {game.status === 'normal' ? '正常' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>{game.createdAt}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleGameStatus(game.id)}>
                        {game.status === 'normal' ? '禁用' : '启用'}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteGame(game.id, game.name)}>
                        删除
                      </Button>
                      <Link href={`/gm/items?id=${game.id}`}>
                        <Button variant="outline" size="sm">
                          管理物品
                        </Button>
                      </Link>
                      <Link href={`/gm/qu?id=${game.id}`}>
                        <Button variant="outline" size="sm">
                          管理区服
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 分页 */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              显示 {indexOfFirstItem + 1} 到 {Math.min(indexOfLastItem, games.length)} 共 {games.length} 条
            </div>
            <div className="space-x-2">
              {Array.from({ length: Math.ceil(games.length / itemsPerPage) }, (_, i) => (
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
    </div>
  )
}

