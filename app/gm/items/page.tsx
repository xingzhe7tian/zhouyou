'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Settings, MessageCircleQuestionIcon as QuestionMarkCircle } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb" // Import BreadcrumbList
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

interface GameItem {
  id: number;
  index: string;
  added: string;
  number: string;
  name: string;
}

interface Game {
  id: number;
  name: string;
  keywords: string[];
  stackLimit: string;
  inventorySize: string;
  currencies?: Array<{
    id: number;
    name: string;
    number: string;
  }>;
  filterConditions: string[];
}

// 模拟数据
const mockItems: GameItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  index: (i + 1).toString(),
  added: Math.random() > 0.5 ? "是" : "否",
  number: (Math.floor(Math.random() * 1000) + 1).toString(),
  name: `物品${i + 1}`,
}));


export default function ItemManagement() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get('id')

  const [items, setItems] = useState<GameItem[]>(mockItems);
  const [game, setGame] = useState<Game>({id: 1, name: "示例游戏", keywords: ["攻击", "防御"], stackLimit: "99", inventorySize: "99", currencies: [], filterConditions: []});
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10) // 将 itemsPerPage 变成状态
  const [newKeyword, setNewKeyword] = useState('')
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
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showManualSettingsModal, setShowManualSettingsModal] = useState(false);
  const [newFilterCondition, setNewFilterCondition] = useState('');


  useEffect(() => {
    // 模拟从服务器获取游戏数据
    const mockGameData: Game = {
      id: Number(gameId),
      name: `游戏${gameId}`,
      keywords: ["攻击", "防御"],
      stackLimit: "99",
      inventorySize: "99",
      currencies: [],
      filterConditions: ["等级", "稀有度", "类型", "价格", "名称"]
    };
    setGame(mockGameData);
    setGameSettings({
      [gameId]: {
        stackLimit: mockGameData.stackLimit,
        inventorySize: mockGameData.inventorySize,
        currencies: mockGameData.currencies
      }
    });
  }, [gameId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
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

    setItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    toast({
      title: "删除成功",
      description: `已删除 ${selectedItems.length} 个物品。`,
    })
  }

  const handleAddKeyword = () => {
    if (newKeyword && !game.keywords.includes(newKeyword)) {
      setGame(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword]
      }))
      setNewKeyword('')
      toast({
        title: "关键字添加成功",
        description: `已添加关键字 "${newKeyword}"。`,
      })
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setGame(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
    toast({
      title: "关键字删除成功",
      description: `已删除关键字 "${keyword}"。`,
    })
  }

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BreadcrumbNav
        items={[
          { href: '/gm/game', label: '游戏管理' },
        ]}
        currentPathLabel={'物品管理'}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            筛选条件管理
            <Link href="/gm/help?section=筛选条件" target="_blank" rel="noopener noreferrer">
              <QuestionMarkCircle className="w-4 h-4 text-gray-500 hover:text-gray-700" aria-label="帮助信息" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={newFilterCondition} onValueChange={(value) => setNewFilterCondition(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择筛选条件" />
                </SelectTrigger>
                <SelectContent>
                  {game.filterConditions.map((condition, index) => (
                    <SelectItem key={index} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder="输入新的筛选条件"
                onChange={(e) => setNewFilterCondition(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (newFilterCondition && !game.filterConditions.includes(newFilterCondition)) {
                  setGame(prev => ({ ...prev, filterConditions: [...prev.filterConditions, newFilterCondition] }))
                  setNewFilterCondition('');
                  toast({
                    title: "添加成功",
                    description: `已添加筛选条件: ${newFilterCondition}`,
                  });
                }
              }}
            >
              添加
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const lastCondition = game.filterConditions[game.filterConditions.length - 1];
                if (lastCondition) {
                  setGame(prev => ({ ...prev, filterConditions: prev.filterConditions.slice(0, -1) }))
                  toast({
                    title: "删除成功",
                    description: `已删除筛选条件: ${lastCondition}`,
                  });
                }
              }}
            >
              删除
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">当前游戏</Label>
              <div className="p-2 bg-gray-100 rounded">{game.name}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">物品叠加上限</Label>
              <div className="flex space-x-2">
                <Input
                  value={gameSettings[game.id]?.stackLimit || "99"}
                  onChange={(e) => {
                    setGameSettings(prev => ({
                      ...prev,
                      [game.id]: { ...prev[game.id], stackLimit: e.target.value }
                    }));
                  }}
                  className="w-full"
                />
                <Button variant="secondary" size="sm">更新</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">背包大小</Label>
              <div className="flex space-x-2">
                <Input
                  value={gameSettings[game.id]?.inventorySize || "99"}
                  onChange={(e) => {
                    setGameSettings(prev => ({
                      ...prev,
                      [game.id]: { ...prev[game.id], inventorySize: e.target.value }
                    }));
                  }}
                  className="w-full"
                />
                <Button variant="secondary" size="sm">更新</Button>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <div>游戏ID: {game.id}</div>
            <div>物品叠加上限: {gameSettings[game.id]?.stackLimit || "99"}</div>
            <div>背包大小: {gameSettings[game.id]?.inventorySize || "99"}</div>
            <div>叠加状态: 游戏特定设置</div>
            <div>当前游戏物品数量: {items.length}</div>
            {gameSettings[game.id]?.currencies?.length > 0 && (
              <div className="mt-2 space-y-2">
                {gameSettings[game.id].currencies.map((currency, index) => (
                  <div key={`${currency.id}-${index}`} className="flex items-center justify-between bg-gray-100 py-1 px-2 rounded-md">
                    <span>货币{index + 1}: {currency.number} {currency.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-100 transition-colors"
                      onClick={() => {
                        const updatedCurrencies = gameSettings[game.id].currencies.filter((_, i) => i !== index);
                        setGameSettings(prev => ({
                          ...prev,
                          [game.id]: {
                            ...prev[game.id],
                            currencies: updatedCurrencies
                          }
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
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowManualSettingsModal(true)}>手动设置</Button>
          <Button variant="outline" size="sm">+ 批量添加</Button>
          <Button variant="outline" size="sm">+ 手动添加</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>× 删除选中</Button>
          <Button variant="outline" size="sm" onClick={() => setShowColumnSettings(true)}>
            <Settings className="w-4 h-4 mr-1" />
            列设置
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>物品列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>序号</TableHead>
                <TableHead>编加</TableHead>
                <TableHead>编号</TableHead>
                <TableHead>物品名称</TableHead>
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
                  <TableCell>{item.index}</TableCell>
                  <TableCell>{item.added}</TableCell>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const currentSettings = gameSettings[game.id] || {};
                        const currencies = currentSettings.currencies || [];

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
                          [game.id]: {
                            ...prev[game.id],
                            currencies: [...currencies, newCurrency]
                          }
                        }));

                        toast({
                          title: "设置成功",
                          description: `已将 ${item.name} 设置为货币。`,
                        });
                      }}
                    >
                      设为货币
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span>显示 {indexOfFirstItem + 1} 到 {Math.min(indexOfLastItem, items.length)} 共 {items.length} 条</span>
              <span className="ml-2">每页显示:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-2">条</span>
            </div>
            <div className="space-x-2">
              {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => (
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
      {showManualSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">手动设置</h2>
            <p>这里是手动设置的内容，可以添加一些输入框或者其他控件来进行设置。</p>
            <Button onClick={() => setShowManualSettingsModal(false)} className="mt-4">关闭</Button>
          </div>
        </div>
      )}
    </div>
  )
}

