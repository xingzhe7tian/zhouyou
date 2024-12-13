'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 模拟物品详情数据
const mockItemDetails = {
  id: 1,
  name: "神秘宝箱",
  description: "一个神秘的宝箱，里面可能藏着稀有物品。",
  tradeHeat: 850,
  averagePrice: 1000,
}

export default function ItemDetails({ itemId }: { itemId: number }) {
  const [itemDetails, setItemDetails] = useState(mockItemDetails)

  useEffect(() => {
    // 在实际应用中，这里应该从服务器获取物品详情
    console.log(`Fetching details for item ID: ${itemId}`)
    // 模拟 API 调用
    setItemDetails({ ...mockItemDetails, id: itemId })
  }, [itemId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{itemDetails.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>描述：</strong> {itemDetails.description}</p>
        <p><strong>交易热度：</strong> {itemDetails.tradeHeat}</p>
        <p><strong>平均价格：</strong> {itemDetails.averagePrice} 金币</p>
      </CardContent>
    </Card>
  )
}

