'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

// 模拟用户数据
const mockUsers = [
  { id: 1, name: "张三", email: "zhangsan@example.com", type: "普通用户", lastLogin: "2023-05-15 10:30" },
  { id: 2, name: "李四", email: "lisi@example.com", type: "GM用户", lastLogin: "2023-05-14 15:45" },
  { id: 3, name: "王五", email: "wangwu@example.com", type: "普通用户", lastLogin: "2023-05-13 09:20" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com", type: "GM用户", lastLogin: "2023-05-12 14:10" },
  // 可以继续添加更多模拟用户...
]

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [userTypeFilter, setUserTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    let result = users
    if (userTypeFilter !== "all") {
      result = result.filter(user => user.type === userTypeFilter)
    }
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredUsers(result)
  }, [users, userTypeFilter, searchTerm])

  const handleUserTypeChange = (value: string) => {
    setUserTypeFilter(value)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleLoginAs = (user: typeof mockUsers[0]) => {
    // 这里应该是实际的登录逻辑，现在我们只是显示一个通知
    toast({
      title: "登录成功",
      description: `您现在以 ${user.name} (${user.type}) 的身份登录`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Select onValueChange={handleUserTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择用户类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有用户</SelectItem>
              <SelectItem value="普通用户">普通用户</SelectItem>
              <SelectItem value="GM用户">GM用户</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>用户类型</TableHead>
              <TableHead>最后登录</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <Button onClick={() => handleLoginAs(user)} variant="outline" size="sm">
                    以此身份登录
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

