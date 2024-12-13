'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

// 更新模拟物品数据，包含交易热度
const mockItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `物品${i + 1}`,
  tradeHeat: Math.floor(Math.random() * 1000) // 随机生成交易热度
})).sort((a, b) => b.tradeHeat - a.tradeHeat) // 按交易热度降序排序

export default function TradeItems() {
  const [searchTerm, setSearchTerm] = useState('')
  const [displayItems, setDisplayItems] = useState(mockItems)

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayItems(mockItems)
      return
    }

    const results = mockItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setDisplayItems(results)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 触发 useEffect 中的搜索逻辑
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6">物品交易市场</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>搜索物品</CardTitle>
          <CardDescription>输入物品名称以查找交易，或浏览热门交易物品</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="输入物品名称"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">搜索</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{searchTerm ? "搜索结果" : "热门交易物品"}</CardTitle>
          <CardDescription>
            {searchTerm 
              ? "点击物品名称查看详细交易信息" 
              : "以下是当前交易热度最高的物品"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>物品名称</TableHead>
                <TableHead>交易热度</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/user-center/trade-items/${item.id}?name=${encodeURIComponent(item.name)}`} className="text-blue-600 hover:underline">
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.tradeHeat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

