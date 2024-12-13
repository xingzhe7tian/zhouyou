import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RightSideMenu } from './RightSideMenu';

const siteStructure = [
  {
    title: '主页',
    path: '/',
    description: '网站的首页'
  },
  {
    title: '登录',
    path: '/login',
    description: '用户登录页面'
  },
  {
    title: '注册',
    path: '/register',
    description: '新用户注册页面'
  },
  {
    title: '控制台',
    path: '/dashboard',
    description: '用户控制台页面'
  },
  {
    title: '用户中心',
    path: '/user-center',
    description: '用户中心主页',
    subPages: [
      { title: '项目结构', path: '/user-center/project-structure', description: '查看项目文件结构' },
      { title: '个人信息', path: '/user-center/profile', description: '管理个人信息' },
      { title: '数据分析', path: '/user-center/analytics', description: '查看数据分析' },
      { title: '设置', path: '/user-center/settings', description: '用户设置' },
      { title: '玩家物品', path: '/user-center/player-items', description: '管理玩家物品' },
      { title: '物品交易', path: '/user-center/trade-items', description: '交易游戏物品' },
      { title: '聊天室', path: '/user-center/chat-room', description: '实时聊天室' },
    ]
  },
  {
    title: '技术代理',
    path: '/tech-agent',
    description: '技术代理主页',
    subPages: [
      { title: '代码管理', path: '/tech-agent/code', description: '管理代码' },
      { title: '服务器管理', path: '/tech-agent/servers', description: '管理服务器' },
      { title: '数据库管理', path: '/tech-agent/databases', description: '管理数据库' },
      { title: '安全设置', path: '/tech-agent/security', description: '安全设置' },
    ]
  },
  {
    title: '管理控制台',
    path: '/admin',
    description: '管理员控制台主页',
    subPages: [
      { title: '用户管理', path: '/admin/users', description: '管理用户' },
      { title: '数据分析', path: '/admin/analytics', description: '查看数据分析' },
      { title: '报告', path: '/admin/reports', description: '查看报告' },
      { title: '内容管理', path: '/admin/content', description: '管理内容' },
      { title: '设置', path: '/admin/settings', description: '系统设置' },
    ]
  },
  {
    title: 'GM 后台',
    path: '/gm',
    description: 'GM 管理后台主页',
    subPages: [
      { title: '游戏管理', path: '/gm/game-management', description: '管理游戏' },
      { title: '游戏管理2', path: '/gm/game', description: '管理游戏2' },
      { title: '物品管理', path: '/gm/items', description: '管理游戏物品' },
      { title: '区服管理', path: '/gm/qu', description: '管理游戏区服' },
      { title: '玩家管理', path: '/gm/player-management', description: '管理玩家账户' },
      { title: '公告管理', path: '/gm/announcement', description: '管理游戏公告' },
      { title: '数据统计', path: '/gm/statistics', description: '查看游戏数据统计' },
      { title: '系统设置', path: '/gm/settings', description: 'GM 系统设置' },
      { title: '物品管理帮助', path: '/gm/help', description: '物品管理帮助文档', rightSideMenu: true },
    ]
  },
  {
    title: '网站地图',
    path: '/sitemap',
    description: '网站结构概�������������'
  }
]

export function SiteMap() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>网站地图</CardTitle>
        <CardDescription>了解我们网站的结构</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteStructure.map((item) => (
            <li key={item.path}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href={item.path} className="hover:underline">
                      {item.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                  {item.subPages && (
                    <ul className="list-disc list-inside">
                      {item.subPages.map((subPage) => (
                        <li key={subPage.path} className="text-sm">
                          <Link href={subPage.path} className="hover:underline">
                            {subPage.title}
                          </Link>
                          {subPage.rightSideMenu && <RightSideMenu menuItems={
                            [
                              { text: '物品管理', href: '/gm/help#section1' },
                              { text: '页面功能说明', href: '/gm/help#section2' },
                              { text: '筛选条件管理', href: '/gm/help#section3' },
                              { text: '游戏物品数据分析', href: '/gm/help#section4' },
                              { text: '物品列表', href: '/gm/help#section5' },
                              { text: '其他说明', href: '/gm/help#section6' },
                            ]
                          } />}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

