'use client'

import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { ScrollSpyNav } from '@/components/ScrollSpyNav'
import { EnhancedTabbedContent } from "@/components/EnhancedTabbedContent"
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export const metadata: Metadata = {
  title: 'GM 帮助文档',
  description: 'GM 后台帮助文档',
}

const sections = [
  {
    id: '游戏管理',
    title: '游戏管理',
    items: [
      { id: '创建游戏', title: '创建游戏' },
      { id: '游戏列表', title: '游戏列表' },
    ],
  },
  {
    id: '区服管理',
    title: '区服管理',
    items: [
      { id: '区服概述', title: '区服概述' },
      { id: '创建新区服', title: '创建新区服' },
      { id: '区服列表', title: '区服列表' },
      { id: '区服操作', title: '区服操作' },
    ],
  },
  {
    id: '物品管理',
    title: '物品管理',
    items: [
      { id: '页面功能说明', title: '页面功能说明' },
      { id: '筛选条件管理', title: '筛选条件管理' },
      { id: '游戏物品数据分析', title: '游戏物品数据分析' },
      { id: '物品列表', title: '物品列表' },
    ],
  },
  {
    id: '玩家管理',
    title: '玩家管理',
    items: [
      { id: '玩家信息', title: '玩家信息' },
      { id: '玩家行为', title: '玩家行为' },
    ],
  },
  {
    id: 'API',
    title: 'API', // Update here
    items: [
      { id: '系统交互说明', title: '系统交互说明' },
      { id: '交互代码展示', title: '交互代码展示' },
      { id: '玩家数据说明', title: '玩家数据说明' },
      { id: '物品属性说明', title: '物品属性说明' },
    ],
  },
  {
    id: '其他说明',
    title: '其他说明',
    items: [
      { id: '模拟数据', title: '模拟数据' },
    ],
  },
];

export default function GmHelp() {
  const searchParams = useSearchParams()
  const section = searchParams.get('section')

  useEffect(() => {
    if (section) {
      const scrollToSection = () => {
        const element = document.getElementById(section)
        if (element) {
          const headerHeight = document.querySelector('header')?.clientHeight || 0;
          const yOffset = -headerHeight - 20; // 额外的偏移量，以确保标题完全可见
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }

      // 尝试立即滚动
      scrollToSection();

      // 如果立即滚动失败，等待一段时间后再次尝试
      const timer = setTimeout(scrollToSection, 500);

      // 如果内容还在加载，监听 load 事件
      if (document.readyState !== 'complete') {
        window.addEventListener('load', scrollToSection);
      }

      // 清理函数
      return () => {
        clearTimeout(timer);
        window.removeEventListener('load', scrollToSection);
      }
    }
  }, [section])

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <BreadcrumbNav
        items={[
          { href: '/gm', label: 'GM后台' },
        ]}
        currentPathLabel="帮助文档"
      />

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="lg:w-3/4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">GM 帮助文档</CardTitle>
            </CardHeader>
            <CardContent className="prose lg:prose-lg max-w-none">
              <h2 id="物品管理" className="text-2xl font-semibold mt-8 mb-4">物品管理</h2>
              <hr className="my-6 border-gray-200" />
              <p className="mb-4">本页面用于管理游戏内的所有物品，包括添加、修改、删除、设置货币等操作。</p>

              <h3 id="页面功能说明" className="text-xl font-semibold mt-6 mb-3">页面功能说明</h3>
              <h4 id="筛选条件管理" className="text-lg font-semibold mt-4 mb-2">筛选条件管理</h4>
              <p className="mb-4">这个筛选条件是指在交易页面中对装备或物品特殊属性进行筛选，一般情况指一件装备有自己特殊的随机独立属性，它对应的数据是物品属性JSON字段</p>
              <ol className="list-decimal list-inside mb-4">
                <li className="mb-2">选择筛选条件：从下拉框中选择一个现有的筛选条件。</li>
                <li className="mb-2">输入新的筛选条件：在输入框中输入您想要添加的新筛选条件。</li>
                <li className="mb-2">添加：点击"添加"按钮，将输入框中的新筛选条件添加到筛选条件列表中。</li>
                <li className="mb-2">删除：点击"删除"按钮，将最后一个筛选条件从筛选条件列表中移除。</li>
              </ol>

              <h4 id="游戏物品数据分析" className="text-lg font-semibold mt-4 mb-2">游戏物品数据分析</h4>
              <p className="mb-4">此区域显示当前所选游戏的物品数据，并允许您进行一些设置。</p>
              <ol className="list-decimal list-inside mb-4">
                <li className="mb-2">选择游戏：从下拉框中选择您想要管理物品的游戏。</li>
                <li className="mb-2">物品叠加上限：设置游戏中物品的叠加上限。</li>
                <li className="mb-2">背包大小：设置游戏中玩家背包的大小。</li>
                <li className="mb-2">货币设置：
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li className="mb-1">选择一个物品，点击"设为货币"按钮，可以将其设置为游戏内的货币。</li>
                    <li className="mb-1">每个游戏最多可以设置两种货币。</li>
                    <li className="mb-1">点击货币旁的"删除"按钮可以移除该货币。</li>
                  </ul>
                </li>
                <li className="mb-2">游戏关键字：
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li className="mb-1">选择一个关键字，点击"删除"按钮可以移除该关键字。</li>
                    <li className="mb-1">在输入框中输入新的关键字，点击"添加"按钮可以添加新的关键字。</li>
                  </ul>
                </li>
              </ol>

              <h4 id="物品列表" className="text-lg font-semibold mt-4 mb-2">物品列表</h4>
              <p className="mb-4">此区域显示当前所选游戏的物品列表，并允许您进行批量操作。</p>
              <ol className="list-decimal list-inside mb-4">
                <li className="mb-2">选择：通过勾选复选框，可以选择单个或多个物品。</li>
                <li className="mb-2">序号、编加、编号、物品名称：显示物品的详细信息。</li>
                <li className="mb-2">设为货币：点击"设为货币"按钮，可以将选中的物品设置为游戏内的货币。</li>
                <li className="mb-2">批量添加：(待实现)</li>
                <li className="mb-2">手动添加：(待实现)</li>
                <li className="mb-2">删除选中：点击"删除选中"按钮，可以删除所有选中的物品。</li>
                <li className="mb-2">列设置：点击"列设置"按钮，可以自定义显示的列。</li>
                <li className="mb-2">手动设置：点击"手动设置"按钮，可以进行一些手动设置。(待实现)</li>
                <li className="mb-2">分页：通过分页控件，可以浏览不同页面的物品数据。</li>
              </ol>

              <h2 id="游戏管理" className="text-2xl font-semibold mt-8 mb-4">游戏管理</h2>
              <hr className="my-6 border-gray-200" />
              <p className="mb-4">此区域用于管理游戏信息，包括添加、修改、删除游戏等操作。</p>

              <h3 id="创建游戏" className="text-xl font-semibold mt-6 mb-3">创建游戏</h3>
              <p className="mb-4">点击"创建游戏"按钮，填写游戏名称等信息，即可创建新的游戏。</p>

              <h3 id="游戏列表" className="text-xl font-semibold mt-6 mb-3">游戏列表</h3>
              <p className="mb-4">显示所有已创建的游戏，并可以对游戏进行管理。</p>
              <ul className="list-disc list-inside mb-4">
                <li className="mb-2">游戏名称：显示游戏的名称。</li>
                <li className="mb-2">ID：显示游戏的唯一标识符。</li>
                <li className="mb-2">创建者 ID：显示创建该游戏的用户的 ID。</li>
                <li className="mb-2">状态：显示游戏当前的状态，是正常还是禁用。</li>
                <li className="mb-2">创建时间：显示游戏的创建时间。</li>
                <li className="mb-2">操作：可以对游戏进行禁用、启用和删除操作。</li>
              </ul>

              <h2 id="区服管理" className="text-2xl font-semibold mt-8 mb-4">区服管理</h2>
              <hr className="my-6 border-gray-200" />
              <p className="mb-4">区服管理页面允许您管理游戏的不同服务器。您可以创建新的区服、查看现有区服列表、更改区服状态，以及执行其他相关操作。</p>

              <h3 id="区服概述" className="text-xl font-semibold mt-6 mb-3">区服概述</h3>
              <p className="mb-4">区服是游戏中的独立服务器，每个区服可以容纳一定数量的玩家。管理员可以通过区服管理页面来控制这些服务器的状态和设置。</p>

              <h3 id="创建新区服" className="text-xl font-semibold mt-6 mb-3">创建新区服</h3>
              <p className="mb-4">要创建新的区服，请按照以下步骤操作：</p>
              <ol className="list-decimal list-inside mb-4">
                <li className="mb-2">在"创建新区服"卡片中，输入新区服的名称。</li>
                <li className="mb-2">输入新区服的服务器IP地址。</li>
                <li className="mb-2">点击"创建区服"按钮来添加新的区服。</li>
              </ol>

              <h3 id="区服列表" className="text-xl font-semibold mt-6 mb-3">区服列表</h3>
              <p className="mb-4">区服列表显示了当前游戏的所有区服。每个区服的信息包括：</p>
              <ul className="list-disc list-inside mb-4">
                <li className="mb-2">区服名称：区服的唯一标识名称。</li>
                <li className="mb-2">服务器IP：区服的IP地址。</li>
                <li className="mb-2">状态：显示区服是否正常运行或处于维护状态。</li>
                <li className="mb-2">服务截止时间：显示区服的服务期限。</li>
              </ul>

              <h3 id="区服操作" className="text-xl font-semibold mt-6 mb-3">区服操作</h3>
              <p className="mb-4">对于每个区服，您可以执行以下操作：</p>
              <ul className="list-disc list-inside mb-4">
                <li className="mb-2">切换状态：将区服状态在"正常"和"维护中"之间切换。</li>
                <li className="mb-2">使用CDK：输入CDK来延长区服的使用期限。</li>
                <li className="mb-2">删除：从列表中删除区服。请谨慎使用此操作，因为它可能会永久删除区服及其所有数据。</li>
              </ul>
              <p className="mb-4">请注意，这些操作可能会直接影响玩家的游戏体验，因此在执行任何操作之前，请确保您了解其影响。</p>

              <h2 id="玩家管理" className="text-2xl font-semibold mt-8 mb-4">玩家管理</h2>
              <hr className="my-6 border-gray-200" />
              <p className="mb-4">此区域用于管理玩家信息和行为。</p>

              <h3 id="玩家信息" className="text-xl font-semibold mt-6 mb-3">玩家信息</h3>
              <p className="mb-4">查看和修改玩家的个人信息，例如昵称、等级、装备等。</p>

              <h3 id="玩家行为" className="text-xl font-semibold mt-6 mb-3">玩家行为</h3>
              <p className="mb-4">监控玩家的游戏行为，例如登录时间、在线时长、交易记录等。</p>

              <h2 id="API" className="text-2xl font-semibold mt-8 mb-4">API</h2>
              <hr className="my-6 border-gray-200" />
              <p className="mb-4">本节介绍如何使用开发 API 与游戏系统进行交互。</p>

              <h3 id="系统交互说明" className="text-xl font-semibold mt-6 mb-3">系统交互说明</h3>
              <p className="mb-4">
                开发 API 允许开发者通过 HTTP 请求与游戏系统进行交互，例如获取玩家数据、修改物品属性等。API 使用 RESTful 风格设计，并使用 JSON 格式进行数据传输。
              </p>

              <h3 id="交互代码展示" className="text-xl font-semibold mt-6 mb-3">交互代码展示</h3>
              <p className="mb-4">以下是使用不同编程语言与API交互的代码示例：</p>

              <EnhancedTabbedContent />

              <h3 id="玩家数据说明" className="text-xl font-semibold mt-6 mb-3">玩家数据说明</h3>
              <p className="mb-4">玩家数据包含以下字段：</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">字段名</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">player_id</td>
                      <td className="border border-gray-300 px-4 py-2">玩家的唯一标识符</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">username</td>
                      <td className="border border-gray-300 px-4 py-2">玩家的用户名</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">level</td>
                      <td className="border border-gray-300 px-4 py-2">玩家的当前等级</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">experience</td>
                      <td className="border border-gray-300 px-4 py-2">玩家的当前经验值</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">inventory</td>
                      <td className="border border-gray-300 px-4 py-2">玩家背包中的物品列表</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">currency</td>
                      <td className="border border-gray-300 px-4 py-2">玩家拥有的游戏货币数量</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="物品属性说明" className="text-xl font-semibold mt-6 mb-3">物品属性说明</h3>
              <p className="mb-4">物品属性包含以下字段：</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">字段名</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">item_id</td>
                      <td className="border border-gray-300 px-4 py-2">物品的唯一标识符</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">name</td>
                      <td className="border border-gray-300 px-4 py-2">物品的名称</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">description</td>
                      <td className="border border-gray-300 px-4 py-2">物品的描述</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">type</td>
                      <td className="border border-gray-300 px-4 py-2">物品的类型（如武器、防具、消耗品等）</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">rarity</td>
                      <td className="border border-gray-300 px-4 py-2">物品的稀有度</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">attributes</td>
                      <td className="border border-gray-300 px-4 py-2">物品的特殊属性（如攻击力、防御力等）</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">price</td>
                      <td className="border border-gray-300 px-4 py-2">物品的价格</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 id="其他说明" className="text-2xl font-semibold mt-8 mb-4">其他说明</h2>
              <hr className="my-6 border-gray-200" />
              <h3 id="模拟数据" className="text-xl font-semibold mt-6 mb-3">模拟数据</h3>
              <p className="mb-4">页面中的数据均为模拟数据，实际应用中需要连接数据库或 API 获取真实数据。</p>
              <h3 className="text-xl font-semibold mt-6 mb-3">操作提示</h3>
              <p className="mb-4">进行任何操作后，页面都会显示相应的提示信息。</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/4">
          <div className="sticky top-[70px]">
            <ScrollSpyNav items={sections} />
          </div>
        </div>
      </div>
    </div>
  )
}

