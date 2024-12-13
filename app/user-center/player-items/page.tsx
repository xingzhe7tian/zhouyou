'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Coins } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface Item {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  sellPrice: number
  sellMethod?: 'fixed' | 'auction'
  currency?: 'gold' | 'diamond'
  duration?: number
  status: number
}

interface Currency {
  id: number
  name: string
  onlineAmount: number
  gameAmount: number
}

// Updated mock data with quantity and status
const initialOnlineItems: Item[] = [
  { id: 1, name: "神秘宝箱", description: "一个神秘的宝箱，里面可能藏着稀有物品。", price: 100, quantity: 198, sellPrice: 100, currency: 'gold', sellMethod: 'fixed', status: 0 },
  { id: 2, name: "强化石", description: "用于强化装备的神奇石头。", price: 50, quantity: 297, sellPrice: 50, currency: 'gold', sellMethod: 'fixed', status: 1 },
  { id: 3, name: "经验药水", description: "喝下后可以快速获得经验值。", price: 30, quantity: 99, sellPrice: 30, currency: 'gold', sellMethod: 'fixed', status: 0 },
  { id: 4, name: "传送卷轴", description: "使用后可以快速传送到指定位置。", price: 80, quantity: 99, sellPrice: 80, currency: 'gold', sellMethod: 'fixed', status: 1 },
  { id: 5, name: "金币袋", description: "装满金币的袋子，可以用来交易。", price: 1000, quantity: 99, sellPrice: 1000, currency: 'gold', sellMethod: 'fixed', status: 0 },
  { id: 6, name: "复活羽毛", description: "可以在死亡时自动复活的神奇羽毛。", price: 500, quantity: 99, sellPrice: 500, currency: 'gold', sellMethod: 'fixed', status: 1 },
  { id: 7, name: "神秘宝箱", description: "一个神秘的宝箱，里面可能藏着稀有物品。", price: 100, quantity: 50, sellPrice: 100, currency: 'gold', sellMethod: 'fixed', status: 0 },
  { id: 8, name: "强化石", description: "用于强化装备的神奇石头。", price: 50, quantity: 30, sellPrice: 50, currency: 'gold', sellMethod: 'fixed', status: 1 },
]

const initialGameItems: Item[] = [
  { id: 9, name: "钻石剑", description: "锋利的钻石打造的剑，攻击力极高。", price: 500, quantity: 1, sellPrice: 500, currency: 'gold', sellMethod: 'fixed', status: 0 },
  { id: 10, name: "魔法长袍", description: "蕴含强大魔力的长袍，可以增加法术威力。", price: 300, quantity: 2, sellPrice: 300, currency: 'gold', sellMethod: 'fixed', status: 1 },
  { id: 11, name: "治疗药水", description: "可以快速恢复生命值的神奇药水。", price: 20, quantity: 15, sellPrice: 20, currency: 'gold', sellMethod: 'fixed', status: 0 },
]

const initialCurrencies: Currency[] = [
  { id: 1, name: '金币', onlineAmount: 1000, gameAmount: 500 },
  { id: 2, name: '钻石', onlineAmount: 50, gameAmount: 20 },
]

const ItemDetails = ({ item }: { item: Item }) => {
  const [currentPrice, setCurrentPrice] = useState(item.price)

  const checkPrice = () => {
    const fluctuation = Math.random() * 20 - 10
    setCurrentPrice(Math.max(0, Math.round(item.price + fluctuation)))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{item.name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p>当前价格: {currentPrice} 金币</p>
          <p>数量: {item.quantity}</p>
          <Button onClick={checkPrice} className="mt-2">查询最新价格</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const SplitItemDialog = ({ item, onSplit }: { item: Item, onSplit: (id: number, amount: number) => void }) => {
  const [splitAmount, setSplitAmount] = useState(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{item.quantity}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>分解 {item.name}</DialogTitle>
          <DialogDescription>当前数量: {item.quantity}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="splitAmount" className="text-right">
              分解数量
            </Label>
            <Input
              id="splitAmount"
              type="number"
              value={splitAmount}
              onChange={(e) => setSplitAmount(Math.min(Math.max(1, parseInt(e.target.value) || 1), item.quantity - 1))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onSplit(item.id, splitAmount)} 
            disabled={splitAmount >= item.quantity || item.status === 1}
          >
            确认分解
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const MergeItemsDialog = ({ items, selectedItems, onMerge }: { 
  items: Item[], 
  selectedItems: number[], 
  onMerge: () => void 
}) => {
  const selectedItemsData = items.filter(item => selectedItems.includes(item.id))
  const canMerge = selectedItemsData.every(item => item.name === selectedItemsData[0].name)
  const totalQuantity = selectedItemsData.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={selectedItems.length < 2 || !canMerge}>合并物品</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>合并物品</DialogTitle>
          <DialogDescription>
            {canMerge 
              ? `选中的物品总数量: ${totalQuantity}`
              : "只能合并相同名称的物品"}
          </DialogDescription>
        </DialogHeader>
        {canMerge && (
          <>
            <div className="py-4">
              <p>合并后将创建 {Math.floor(totalQuantity / 99)} 组 99 个物品，剩余 {totalQuantity % 99} 个。</p>
            </div>
            <DialogFooter>
              <Button onClick={onMerge}>确认合并</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

const SellItemDialog = React.forwardRef<HTMLButtonElement, {
  item: Item | null, 
  onSell: (id: number, price: number, method: 'fixed' | 'auction', duration?: number, currency: 'gold' | 'diamond') => void,
  onClose: () => void,
  isOpen: boolean
}>(({ item, onSell, onClose, isOpen }, ref) => {
  const [sellPrice, setSellPrice] = useState(item?.sellPrice ?? 0)
  const [sellMethod, setSellMethod] = useState<'fixed' | 'auction'>('fixed')
  const [duration, setDuration] = useState(24)
  const [currency, setCurrency] = useState<'gold' | 'diamond'>('gold')
  const [marketPrice, setMarketPrice] = useState(0)

  useEffect(() => {
    if (item) {
      const newMarketPrice = Math.round(item.price * (currency === 'gold' ? (0.9 + Math.random() * 0.4) : (0.5 + Math.random() * 0.3)))
      setMarketPrice(newMarketPrice)
      setSellPrice(newMarketPrice)
    }
  }, [currency, item])

  if (!item) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>出售 {item.name}</DialogTitle>
          <DialogDescription>设置 {item.name} 的出售方式和价格</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>出售方式</Label>
            <Select value={sellMethod} onValueChange={(value: 'fixed' | 'auction') => setSellMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择出售方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">一口价</SelectItem>
                <SelectItem value="auction">拍卖</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>交易货币</Label>
            <Select value={currency} onValueChange={(value: 'gold' | 'diamond') => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择交易货币" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">金币</SelectItem>
                <SelectItem value="diamond">钻石</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            当前市场参考价格: {marketPrice} {currency === 'gold' ? '金币' : '钻石'}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sellPrice" className="text-right">
              {sellMethod === 'fixed' ? '出售价格' : '起拍价格'}
            </Label>
            <Input
              id="sellPrice"
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="col-span-3"
            />
          </div>

          {sellMethod === 'auction' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                拍卖时长
              </Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择拍卖时长" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12小时</SelectItem>
                  <SelectItem value="24">24小时</SelectItem>
                  <SelectItem value="48">48小时</SelectItem>
                  <SelectItem value="72">72小时</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => {
            onSell(item.id, sellPrice, sellMethod, sellMethod === 'auction' ? duration : undefined, currency)
            onClose()
          }}>
            确认{sellMethod === 'fixed' ? '出售价格' : '开始拍卖'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

SellItemDialog.displayName = 'SellItemDialog'

const ItemList = ({ items, selectedItems, onItemSelect, onSelectAll, onSplitItem, showSplit, onSell, handleStatusClick }: { 
  items: Item[], 
  selectedItems: number[], 
  onItemSelect: (id: number) => void,
  onSelectAll: () => void,
  onSplitItem: (id: number, amount: number) => void,
  showSplit: boolean,
  onSell: (id: number, price: number, method: 'fixed' | 'auction', duration?: number, currency: 'gold' | 'diamond') => void,
  handleStatusClick: (item: Item) => void,
}) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>物品列表</CardTitle>
        <Checkbox
          checked={selectedItems.length === items.length}
          onCheckedChange={onSelectAll}
        />
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">选择</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>出售价格</TableHead>
              <TableHead>出售方式</TableHead>
              <TableHead>交易货币</TableHead>
              <TableHead>拍卖时长</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => onItemSelect(item.id)}
                    disabled={item.status === 1}
                  />
                </TableCell>
                <TableCell>
                  <ItemDetails item={item} />
                </TableCell>
                <TableCell>
                  {showSplit ? (
                    item.status === 1 ? (
                      <span className="text-gray-500">{item.quantity}</span>
                    ) : (
                      <SplitItemDialog item={item} onSplit={onSplitItem} />
                    )
                  ) : (
                    item.quantity
                  )}
                </TableCell>
                <TableCell>{item.sellPrice} {item.currency === 'diamond' ? '钻石' : '金币'}</TableCell>
                <TableCell>{item.sellMethod === 'auction' ? '拍卖' : '一口价'}</TableCell>
                <TableCell>{item.currency === 'diamond' ? '钻石' : '金币'}</TableCell>
                <TableCell>{item.sellMethod === 'auction' ? `${item.duration}小时` : '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => handleStatusClick(item)}
                  >
                    {item.status === 1 ? '出售中' : '仓库中'}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <SellItemDialog item={item} onSell={onSell} onClose={() => {}} isOpen={false}/>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
)

const CurrencyDisplay = React.forwardRef<
  HTMLDivElement,
  { 
    currencies: Currency[], 
    isOnline: boolean,
    onTransfer: (currencyId: number, currencyName: string, toOnline: boolean) => void
  }
>(({ currencies, isOnline, onTransfer }, ref) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Coins className="mr-2" />
        {isOnline ? "线上仓库货币" : "游戏仓库货币"}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4" ref={ref}>
        {currencies.map((currency) => (
          <div key={currency.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <span className="font-semibold">{currency.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{isOnline ? currency.onlineAmount : currency.gameAmount}</span>
              <Button 
                size="sm" 
                onClick={() => onTransfer(currency.id, currency.name, !isOnline)}
              >
                转移{currency.name}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
))

CurrencyDisplay.displayName = 'CurrencyDisplay'

const TransferCurrencyDialog = React.forwardRef<
  HTMLDivElement,
  {
    isOpen: boolean
    onClose: () => void
    onConfirm: (amount: number) => void
    currencyName: string
    maxAmount: number
  }
>(({ isOpen, onClose, onConfirm, currencyName, maxAmount }, ref) => {
  const [amount, setAmount] = useState(0)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent ref={ref}>
        <AlertDialogHeader>
          <AlertDialogTitle>转移{currencyName}</AlertDialogTitle>
          <AlertDialogDescription>
            请输入要转移的{currencyName}数量。当前最大可转移数量：{maxAmount}。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.min(Math.max(0, parseInt(e.target.value) || 0), maxAmount))}
            placeholder={`输入${currencyName}数量`}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(amount)} disabled={amount <= 0 || amount > maxAmount}>
            确认转移
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

TransferCurrencyDialog.displayName = 'TransferCurrencyDialog'

export default function PlayerItems() {
  const { toast } = useToast()
  const [onlineItems, setOnlineItems] = useState(initialOnlineItems)
  const [gameItems, setGameItems] = useState(initialGameItems)
  const [selectedOnlineItems, setSelectedOnlineItems] = useState<number[]>([])
  const [selectedGameItems, setSelectedGameItems] = useState<number[]>([])
  const [currencies, setCurrencies] = useState(initialCurrencies)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [currentTransfer, setCurrentTransfer] = useState<{ id: number, name: string, isOnline: boolean } | null>(null)
  const [playerInfo, setPlayerInfo] = useState({
    gameName: "幻想世界",
    serverName: "永恒之地",
    characterName: "勇者小明"
  })
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  const handleOnlineItemSelect = (id: number) => {
    setSelectedOnlineItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleGameItemSelect = (id: number) => {
    setSelectedGameItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleOnlineSelectAll = () => {
    setSelectedOnlineItems(prev => 
      prev.length === onlineItems.length ? [] : onlineItems.map(item => item.id)
    )
  }

  const handleGameSelectAll = () => {
    setSelectedGameItems(prev => 
      prev.length === gameItems.length ? [] : gameItems.map(item => item.id)
    )
  }

  const transferToGame = () => {
    const itemsToTransfer = onlineItems.filter(item => selectedOnlineItems.includes(item.id) && item.status !== 1)
    setGameItems(prev => [...prev, ...itemsToTransfer])
    setOnlineItems(prev => prev.filter(item => !selectedOnlineItems.includes(item.id) || item.status === 1))
    setSelectedOnlineItems([])
    
    // 如果有物品未被转移（因为它们正在出售中），显示一个提示
    const unmovedItems = selectedOnlineItems.filter(id => onlineItems.find(item => item.id === id)?.status === 1)
    if (unmovedItems.length > 0) {
      toast({
        title: "部分物品未转移",
        description: `${unmovedItems.length} 个物品因正在出售中而无法转移到游戏仓库。`,
        variant: "warning",
      })
    }
  }

  const transferToOnline = () => {
    const itemsToTransfer = gameItems.filter(item => selectedGameItems.includes(item.id))
    setOnlineItems(prev => [...prev, ...itemsToTransfer])
    setGameItems(prev => prev.filter(item => !selectedGameItems.includes(item.id)))
    setSelectedGameItems([])
  }

  const handleSplitOnlineItem = (id: number, amount: number) => {
    setOnlineItems(prev => {
      const itemIndex = prev.findIndex(item => item.id === id)
      if (itemIndex === -1 || prev[itemIndex].status === 1) return prev

      const newItems = [...prev]
      const item = { ...newItems[itemIndex] }
      const newItem = { ...item, id: Math.max(...prev.map(i => i.id)) + 1, quantity: amount }
      
      item.quantity -= amount
      newItems[itemIndex] = item
      return [...newItems, newItem]
    })
  }

  const handleMergeOnlineItems = () => {
    const itemsToMerge = onlineItems.filter(item => selectedOnlineItems.includes(item.id))
    if (itemsToMerge.length < 2 || !itemsToMerge.every(item => item.name === itemsToMerge[0].name)) {
      return; // 如果选中的物品少于2个或不是相同名称，则不执行合并
    }

    const totalQuantity = itemsToMerge.reduce((sum, item) => sum + item.quantity, 0)
    const newItems: Item[] = []

    for (let i = 0; i < Math.floor(totalQuantity / 99); i++) {
      newItems.push({
        id: Math.max(...onlineItems.map(item => item.id)) + i + 1,
        name: itemsToMerge[0].name,
        description: itemsToMerge[0].description,
        price: itemsToMerge[0].price,
        quantity: 99,
        sellPrice: itemsToMerge[0].sellPrice,
        status: itemsToMerge[0].status
      })
    }

    if (totalQuantity % 99 > 0) {
      newItems.push({
        id: Math.max(...onlineItems.map(item => item.id)) + newItems.length + 1,
        name: itemsToMerge[0].name,
        description: itemsToMerge[0].description,
        price: itemsToMerge[0].price,
        quantity: totalQuantity % 99,
        sellPrice: itemsToMerge[0].sellPrice,
        status: itemsToMerge[0].status
      })
    }

    setOnlineItems(prev => [
      ...prev.filter(item => !selectedOnlineItems.includes(item.id)),
      ...newItems
    ])
    setSelectedOnlineItems([])
  }

  const handleOrganizeBackpack = () => {
    const organizedItems: Item[] = []
    const itemGroups: { [key: string]: Item[] } = {}
    const sellingItems: Item[] = []

    // 将物品按名称分组，同时分离出售中的物品
    onlineItems.forEach(item => {
      if (item.status === 1) {
        sellingItems.push(item)
      } else {
        if (!itemGroups[item.name]) {
          itemGroups[item.name] = []
        }
        itemGroups[item.name].push(item)
      }
    })

    // 合并每组物品
    Object.values(itemGroups).forEach(group => {
      const totalQuantity = group.reduce((sum, item) => sum + item.quantity, 0)
      const firstItem = group[0]

      for (let i = 0; i < Math.floor(totalQuantity / 99); i++) {
        organizedItems.push({
          ...firstItem,
          id: Math.max(...onlineItems.map(item => item.id)) + organizedItems.length + 1,
          quantity: 99,
          status: 0
        })
      }

      if (totalQuantity % 99 > 0) {
        organizedItems.push({
          ...firstItem,
          id: Math.max(...onlineItems.map(item => item.id)) + organizedItems.length + 1,
          quantity: totalQuantity % 99,
          status: 0
        })
      }
    })

    // 将出售中的物品添加回整理后的列表
    setOnlineItems([...organizedItems, ...sellingItems])

    // 如果有出售中的物品，显示一个提示
    if (sellingItems.length > 0) {
      toast({
        title: "部分物品未整理",
        description: `${sellingItems.length} 个正在出售中的物品未被整理。`,
        variant: "warning",
      })
    }
  }

  const handleTransferCurrency = (currencyId: number, currencyName: string, toOnline: boolean) => {
    const currency = currencies.find(c => c.id === currencyId)
    if (currency) {
      const maxAmount = toOnline ? currency.gameAmount : currency.onlineAmount
      setCurrentTransfer({ id: currencyId, name: currencyName, isOnline: toOnline })
      setTransferDialogOpen(true)
    }
  }

  const confirmTransfer = (amount: number) => {
    if (currentTransfer) {
      setCurrencies(prevCurrencies =>
        prevCurrencies.map(currency =>
          currency.id === currentTransfer.id
            ? {
                ...currency,
                onlineAmount: currentTransfer.isOnline ? currency.onlineAmount + amount : currency.onlineAmount - amount,
                gameAmount: currentTransfer.isOnline ? currency.gameAmount - amount : currency.gameAmount + amount
              }
            : currency
        )
      )
      setTransferDialogOpen(false)
      setCurrentTransfer(null)
    }
  }

  const handleSellItem = (
    id: number, 
    price: number, 
    method: 'fixed' | 'auction', 
    duration?: number,
    currency: 'gold' | 'diamond' = 'gold'
  ) => {
    setOnlineItems(prev => prev.map(item => 
      item.id === id ? { ...item, sellPrice: price, sellMethod: method, duration: duration, currency: currency, status: 1 } : item
    ))
    setGameItems(prev => prev.map(item => 
      item.id === id ? { ...item, sellPrice: price, sellMethod: method, duration: duration, currency: currency, status: 1 } : item
    ))
    toast({
      title: method === 'fixed' ? "出售价格已更新" : "拍卖已开始",
      description: method === 'fixed' 
        ? `物品的出售价格已更新为 ${price} ${currency === 'gold' ? '金币' : '钻石'}。`
        : `物品已开始拍卖，起拍价 ${price} ${currency === 'gold' ? '金币' : '钻石'}，持续 ${duration} 小时。`,
    })
  }

  const handleStatusClick = (item: Item) => {
    if (item.status === 0) {
      // 如果是仓库中，打开出售对话框
      setSelectedItem(item);
      setIsSellDialogOpen(true);
    } else {
      // 如果是出售中，询问是否下架
      if (window.confirm(`确定要下架 ${item.name} 吗？`)) {
        handleUnlistItem(item.id);
      }
    }
  };

  const handleUnlistItem = (itemId: number) => {
    setOnlineItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 0 } : item
    ));
    setGameItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 0 } : item
    ));
    toast({
      title: "物品已下架",
      description: "物品已成功从交易市场下架。",
    });
  };

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{playerInfo.gameName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{playerInfo.serverName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{playerInfo.characterName}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-6">玩家物品数据</h1>
      <Tabs defaultValue="online">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="online">线上仓库</TabsTrigger>
          <TabsTrigger value="game">游戏仓库</TabsTrigger>
        </TabsList>
        <TabsContent value="online">
          <div className="space-y-4">
            <ItemList 
              items={onlineItems} 
              selectedItems={selectedOnlineItems}
              onItemSelect={handleOnlineItemSelect}
              onSelectAll={handleOnlineSelectAll}
              onSplitItem={handleSplitOnlineItem}
              showSplit={true}
              onSell={handleSellItem}
              handleStatusClick={handleStatusClick}
            />
            <div className="flex space-x-4">
              <Button 
                onClick={transferToGame} 
                disabled={selectedOnlineItems.length === 0 || !selectedOnlineItems.some(id => onlineItems.find(item => item.id === id)?.status !== 1)}
              >
                转移到游戏仓库
              </Button>
              <MergeItemsDialog
                items={onlineItems}
                selectedItems={selectedOnlineItems}
                onMerge={handleMergeOnlineItems}
              />
              <Button 
                onClick={handleOrganizeBackpack} 
                disabled={onlineItems.every(item => item.status === 1)}
              >
                整理背包
              </Button>
            </div>
            <CurrencyDisplay 
              currencies={currencies} 
              isOnline={true} 
              onTransfer={handleTransferCurrency}
            />
          </div>
        </TabsContent>
        <TabsContent value="game">
          <div className="space-y-4">
            <ItemList 
              items={gameItems}
              selectedItems={selectedGameItems}
              onItemSelect={handleGameItemSelect}
              onSelectAll={handleGameSelectAll}
              onSplitItem={() => {}}
              showSplit={false}
              onSell={handleSellItem}
              handleStatusClick={handleStatusClick}
            />
            <Button onClick={transferToOnline} disabled={selectedGameItems.length === 0}>
              转移到线上仓库
            </Button>
            <CurrencyDisplay 
              currencies={currencies} 
              isOnline={false} 
              onTransfer={handleTransferCurrency}
            />
          </div>
        </TabsContent>
      </Tabs>
      <SellItemDialog
        item={selectedItem}
        onSell={handleSellItem}
        onClose={() => setIsSellDialogOpen(false)}
        isOpen={isSellDialogOpen}
      >
      <TransferCurrencyDialog
        isOpen={transferDialogOpen}
        onClose={() => setTransferDialogOpen(false)}
        onConfirm={confirmTransfer}
        currencyName={currentTransfer?.name || ''}
        maxAmount={currentTransfer 
          ? (currentTransfer.isOnline 
            ? currencies.find(c => c.id === currentTransfer.id)?.gameAmount || 0
            : currencies.find(c => c.id === currentTransfer.id)?.onlineAmount || 0)
          : 0
        }
      />
    </div>
  )
}

