'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const storedUserEmail = localStorage.getItem('userEmail')

    if (!storedIsLoggedIn || !storedUserEmail) {
      // If not logged in, set default logged-in state
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', '270148539@qq.com')
      setIsLoggedIn(true)
      setUserEmail('270148539@qq.com')
    } else {
      setIsLoggedIn(storedIsLoggedIn)
      setUserEmail(storedUserEmail || '')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setUserEmail('')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold gradient-text mb-6">
              欢迎来到高端简约网站
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
              体验极简设计与强大功能的完美结合
            </p>
            {isLoggedIn ? (
              <div className="space-y-4">
                <p className="text-lg">欢迎回来，{userEmail}</p>
                <div className="space-x-4">
                  <Button asChild size="lg">
                    <Link href="/user-center">进入用户中心</Link>
                  </Button>
                  <Button onClick={handleLogout} variant="outline" size="lg">
                    登出
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/login">立即登录</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">免费注册</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main> 
      <Footer />
    </div>
  )
}

