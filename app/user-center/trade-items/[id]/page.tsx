'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// 模拟用户数据
const mockUserData = {
  goldBalance: 10000,
  diamondBalance: 500
}

// 模拟物品详情数据
const mockItemDetails = {
  id: 1,
  name: "神秘宝箱",
  description: "一个神秘的宝箱，里面可能藏着稀有物品。",
  tradeHeat: 850,
  averagePriceGold: 1000,
  averagePriceDiamond: 100,
  specialAttributes: [
    "开启时有5%几率获得传说装备",
    "每天只能开启3次",
    "开启需要特殊钥匙"
  ]
}

// 模拟交易列表数据
const mockTradeList = [
  { 
    id: 1, 
    seller: "玩家A", 
    priceGold: 950, 
    priceDiamond: 95, 
    quantity: 1, 
    time: "2023-05-20 10:30",
    name: "神秘宝箱",
    description: "一个神秘的宝箱，里面可能藏着稀有物品。",
    specialAttributes: { "稀有度": 5, "每日开启次数": 3 },
    wearRequirements: { level: 10 }
  },
  { 
    id: 2, 
    seller: "玩家B", 
    priceGold: 980, 
    priceDiamond: 98, 
    quantity: 5, 
    time: "2023-05-20 11:15",
    name: "龙鳞护甲",
    description: "由龙鳞制成的坚固护甲，提供极高的防御力。",
    specialAttributes: { "防御": 50, "火抗": 20 },
    wearRequirements: { level: 30, strength: 50 }
  },
  { 
    id: 3, 
    seller: "玩家C", 
    priceGold: 1020, 
    priceDiamond: 102, 
    quantity: 3, 
    time: "2023-05-20 12:00",
    name: "魔法长袍",
    description: "注入强大魔力的长袍，增强施法者的能力。",
    specialAttributes: { "法力值": 100, "冷却时间减少": 10 },
    wearRequirements: { level: 25, intelligence: 40 }
  },
  { 
    id: 4, 
    seller: "玩家D", 
    priceGold: 990, 
    priceDiamond: 99, 
    quantity: 2, 
    time: "2023-05-20 13:45",
    name: "疾风靴",
    description: "轻盈的靴子，提供极快的移动速度。",
    specialAttributes: { "移动速度": 30, "闪避率": 5 },
    wearRequirements: { level: 20, agility: 35 }
  },
  { 
    id: 5, 
    seller: "玩家E", 
    priceGold: 1050, 
    priceDiamond: 105, 
    quantity: 4, 
    time: "2023-05-20 14:30",
    name: "力量护符",
    description: "蕴含强大力量的护符，显著提升佩戴者的力量。",
    specialAttributes: { "力量": 20, "暴击率": 5 },
    wearRequirements: { level: 15 }
  },
]

export default function ItemTradePage() {
  const params = useParams()
  const id = params?.id
  const [selectedCurrency, setSelectedCurrency] = useState('gold')
  const [itemDetails, setItemDetails] = useState(mockItemDetails)
  const [tradeList, setTradeList] = useState(mockTradeList)
  const [selectedTrade, setSelectedTrade] = useState<typeof mockTradeList[0] | null>(null)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [characterAttributes, setCharacterAttributes] = useState({
    level: 20,
    strength: 30,
    intelligence: 25,
    agility: 35
  })
  const [filterAttributes, setFilterAttributes] = useState<{ [key: string]: number }>({})
  const [availableAttributes, setAvailableAttributes] = useState<string[]>([])
  const [pendingFilterAttributes, setPendingFilterAttributes] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (id) {
      // 在实际应用中，这里应该从服务器获取物品详情和交易列表
      console.log(`Fetching details for item ID: ${id}`)
      setItemDetails({ ...mockItemDetails, id: Number(id) })
      setTradeList(mockTradeList)
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    const attributes = new Set<string>()
    tradeList.forEach(trade => {
      Object.keys(trade.specialAttributes).forEach(attr => attributes.add(attr))
    })
    setAvailableAttributes(Array.from(attributes))
  }, [tradeList])

  const handlePurchase = (trade: typeof mockTradeList[0]) => {
    setSelectedTrade(trade)
    setPurchaseQuantity(1)
    setIsDialogOpen(true)
  }

  const confirmPurchase = () => {
    if (selectedTrade && purchaseQuantity > 0) {
      // Check wear requirements
      const canWear = Object.entries(selectedTrade.wearRequirements).every(
        ([key, value]) => characterAttributes[key] >= value
      );

      if (!canWear) {
        toast({
          title: "无��购买",
          description: "您的角色属性不满足该物品的佩戴要求。请检查物品详情中的佩戴要求。",
          variant: "destructive",
        })
        return;
      }

      const cost = selectedCurrency === 'gold' 
        ? selectedTrade.priceGold * purchaseQuantity
        : selectedTrade.priceDiamond * purchaseQuantity
    
      // 检查用户余额是否足够
      if ((selectedCurrency === 'gold' && mockUserData.goldBalance < cost) ||
          (selectedCurrency === 'diamond' && mockUserData.diamondBalance < cost)) {
        toast({
          title: "余额不足",
          description: `您的${selectedCurrency === 'gold' ? '金币' : '钻石'}余额不足，无法完成购买。`,
          variant: "destructive",
        })
        return
      }

      // 这里应该实现实际的购买逻辑，比如调用API
      console.log(`Purchasing ${purchaseQuantity} items from trade ${selectedTrade.id} using ${selectedCurrency}`)
      
      // 更新本地状态
      setTradeList(prevList => 
        prevList.map(trade => 
          trade.id === selectedTrade.id 
            ? { ...trade, quantity: trade.quantity - purchaseQuantity }
            : trade
        ).filter(trade => trade.quantity > 0)
      )

      // 更新用户余额（这里只是模拟，实际应该从服务器获取更新后的余额）
      if (selectedCurrency === 'gold') {
        mockUserData.goldBalance -= cost
      } else {
        mockUserData.diamondBalance -= cost
      }

      // 提供用户反馈
      toast({
        title: "购买成功",
        description: `您已成功购买 ${purchaseQuantity} 个物品`,
      })

      // 重置状态
      setSelectedTrade(null)
      setPurchaseQuantity(1)
      setIsDialogOpen(false)
    }
  }

  const applyFilters = async () => {
    setFilterAttributes(pendingFilterAttributes)
    // Here you would typically fetch data from the server based on the filter attributes
    // For now, we'll just log the filter attributes
    console.log('Fetching data with filters:', pendingFilterAttributes)
    // TODO: Implement actual data fetching logic
    // const response = await fetch('/api/items?filters=' + JSON.stringify(pendingFilterAttributes))
    // const data = await response.json()
    // setTradeList(data)
  }

  const filteredTradeList = tradeList.filter(trade => 
    Object.entries(filterAttributes).every(([attr, value]) => 
      (trade.specialAttributes[attr] || 0) >= value
    )
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-2 max-w-full">
      <h1 className="text-3xl font-bold mb-6">物品交易详情</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>我的货币余额</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p>金币: {mockUserData.goldBalance}</p>
              <p>钻石: {mockUserData.diamondBalance}</p>
            </div>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择交易货币" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">金币</SelectItem>
                <SelectItem value="diamond">钻石</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{itemDetails.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>描述：</strong> {itemDetails.description}</p>
          <p><strong>交易热度：</strong> {itemDetails.tradeHeat}</p>
          <p><strong>平均价格：</strong> {selectedCurrency === 'gold' ? itemDetails.averagePriceGold : itemDetails.averagePriceDiamond} {selectedCurrency === 'gold' ? '金币' : '钻石'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>交易列表</CardTitle>
          <CardDescription>当前可用的交易</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-grow min-w-[200px]">
              <Label htmlFor="attribute-select">选择属性</Label>
              <Select onValueChange={(value) => setPendingFilterAttributes(prev => ({ ...prev, [value]: 0 }))}>
                <SelectTrigger id="attribute-select">
                  <SelectValue placeholder="选择属性" />
                </SelectTrigger>
                <SelectContent>
                  {availableAttributes.map(attr => (
                    <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {Object.entries(pendingFilterAttributes).map(([attr, value]) => (
              <div key={attr} className="flex items-center space-x-2">
                <Label htmlFor={`filter-${attr}`}>{attr}</Label>
                <Input
                  id={`filter-${attr}`}
                  type="number"
                  value={value}
                  onChange={(e) => setPendingFilterAttributes(prev => ({ ...prev, [attr]: Number(e.target.value) }))}
                  className="w-20"
                />
                <Button variant="outline" size="sm" onClick={() => setPendingFilterAttributes(prev => {
                  const { [attr]: _, ...rest } = prev
                  return rest
                })}>
                  删除
                </Button>
              </div>
            ))}
            <Button onClick={applyFilters} className="flex-shrink-0">确认筛选</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>卖家</TableHead>
                <TableHead>物品名称(详情)</TableHead>
                <TableHead>价格 ({selectedCurrency === 'gold' ? '金币' : '钻石'})</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>上架时间</TableHead>
                {Object.keys(filterAttributes).map(attr => (
                  <TableHead key={attr}>{attr}</TableHead>
                ))}
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTradeList.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.seller}</TableCell>
                  <TableCell className="relative group">
                    <span className="cursor-pointer hover:underline">{trade.name}</span>
                    <div className="absolute left-0 top-full mt-2 z-50 invisible group-hover:visible bg-black text-white p-2 rounded shadow-lg w-64">
                      <p className="font-bold mb-1">{trade.name}</p>
                      <p className="mb-2">{trade.description}</p>
                      {Object.entries(trade.specialAttributes).length > 0 && (
                        <>
                          <p className="font-bold mb-1">特殊属性：</p>
                          <ul className="list-disc list-inside">
                            {Object.entries(trade.specialAttributes).map(([attr, value]) => (
                              <li key={attr}>{attr} > {value}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {trade.wearRequirements && (
                        <>
                          <p className="font-bold mt-2 mb-1">佩戴要求：</p>
                          <ul className="list-disc list-inside">
                            {Object.entries(trade.wearRequirements).map(([key, value]) => (
                              <li key={key} className={characterAttributes[key] >= value ? "text-green-400" : "text-red-400"}>
                                {key}: {value}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{selectedCurrency === 'gold' ? trade.priceGold : trade.priceDiamond}</TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell>{trade.time}</TableCell>
                  {Object.keys(filterAttributes).map(attr => (
                    <TableCell key={attr}>{trade.specialAttributes[attr] || '-'}</TableCell>
                  ))}
                  <TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handlePurchase(trade)}>购买</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>确认购买</DialogTitle>
                          <DialogDescription>
                            请确认您要购买的数量。
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                              数量
                            </Label>
                            <Input
                              id="quantity"
                              type="number"
                              className="col-span-3"
                              value={purchaseQuantity}
                              onChange={(e) => setPurchaseQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), selectedTrade ? selectedTrade.quantity : 1))}
                              max={selectedTrade ? selectedTrade.quantity : 1}
                              min={1}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">总价</Label>
                            <div className="col-span-3">
                              {selectedTrade && (
                                <>
                                  {selectedCurrency === 'gold' 
                                    ? selectedTrade.priceGold * purchaseQuantity 
                                    : selectedTrade.priceDiamond * purchaseQuantity
                                  } {selectedCurrency === 'gold' ? '金币' : '钻石'}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={confirmPurchase}>确认购买</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>我的角色属性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(characterAttributes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  id={key}
                  type="number"
                  value={value}
                  onChange={(e) => setCharacterAttributes(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

