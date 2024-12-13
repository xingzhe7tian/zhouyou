'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// 模拟交易列表数据
const mockTradeList = [
  { id: 1, seller: "玩家A", price: 950, quantity: 1, time: "2023-05-20 10:30" },
  { id: 2, seller: "玩家B", price: 980, quantity: 5, time: "2023-05-20 11:15" },
  { id: 3, seller: "玩家C", price: 1020, quantity: 3, time: "2023-05-20 12:00" },
  { id: 4, seller: "玩家D", price: 990, quantity: 2, time: "2023-05-20 13:45" },
  { id: 5, seller: "玩家E", price: 1050, quantity: 4, time: "2023-05-20 14:30" },
]

export default function TradeList({ itemId }: { itemId: number }) {
  const [tradeList, setTradeList] = useState(mockTradeList)
  const [selectedTrade, setSelectedTrade] = useState<typeof mockTradeList[0] | null>(null)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)

  useEffect(() => {
    // 在实际应用中，这里应该从服务器获取交易列表
    console.log(`Fetching trade list for item ID: ${itemId}`)
    // 模拟 API 调用
    setTradeList(mockTradeList)
  }, [itemId])

  const handlePurchase = (trade: typeof mockTradeList[0]) => {
    setSelectedTrade(trade)
    setPurchaseQuantity(trade.quantity)
  }

  const confirmPurchase = () => {
    // 这里应该实现实际的购买逻辑
    console.log(`Purchasing ${purchaseQuantity} items from trade ${selectedTrade?.id}`)
    setSelectedTrade(null)
    // 重置购买数量
    setPurchaseQuantity(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>交易列表</CardTitle>
        <CardDescription>当前可用的交易</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>卖家</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>上架时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeList.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.seller}</TableCell>
                <TableCell>{trade.price} 金币</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{trade.time}</TableCell>
                <TableCell>
                  <Dialog>
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
                            onChange={(e) => setPurchaseQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), trade.quantity))}
                            max={trade.quantity}
                            min={1}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">总价</Label>
                          <div className="col-span-3">
                            {trade.price * purchaseQuantity} 金币
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={confirmPurchase}>确认购买</Button>
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
  )
}

