'use client'

import React, { useState, useEffect } from 'react'
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cva } from "class-variance-authority"

const menuItemStyles = cva(
  "flex-grow px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
  {
    variants: {
      isActive: {
        true: "bg-gray-200 text-gray-900 font-bold border-l-4 border-gray-900",
        false: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }
    },
    defaultVariants: {
      isActive: false
    }
  }
)

interface MenuItem {
  id: string
  title: string
  items?: MenuItem[]
}

interface ScrollSpyNavProps {
  items: MenuItem[]
  offset?: number
}

export function ScrollSpyNav({ items, offset = 70 }: ScrollSpyNavProps) { // Reduced offset for earlier expansion
  const [activeId, setActiveId] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `-${offset}px 0px -${window.innerHeight - offset}px 0px` }
    )

    const observeItems = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) observer.observe(element)
        if (item.items) observeItems(item.items)
      })
    }

    observeItems(items)

    return () => observer.disconnect()
  }, [items, offset])

  useEffect(() => {
    // Automatically expand parent section when a child is active
    if (activeId) {
      let currentId = activeId
      while (currentId) {
        const activeItem = items.find(item => item.id === currentId || (item.items && item.items.some(subItem => subItem.id === currentId)))
        if (activeItem && activeItem.items && !expandedSections.includes(currentId)) {
          setExpandedSections([...expandedSections, currentId])
        }
        currentId = items.find(item => item.items && item.items.some(subItem => subItem.id === currentId))?.id || null
      }
    }
  }, [activeId, items, expandedSections])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedSections.includes(item.id)
    const isActive = activeId === item.id || (item.items && item.items.some(subItem => activeId === subItem.id))

    return (
      <div key={item.id} className={cn("mb-2 transition-all duration-200 ease-in-out", level > 0 && "ml-4")}>
        <div className="flex items-center">
          <a
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={cn(
              menuItemStyles({ isActive }),
              "block"
            )}
          >
            {item.title}
          </a>
          {item.items && item.items.length > 0 && (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
        {item.items && item.items.length > 0 && isExpanded && (
          <div className="mt-2 space-y-2 transition-all duration-200 ease-in-out">
            {item.items.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return <nav className="space-y-1 p-4 bg-white shadow-md rounded-lg">{items.map((item) => renderMenuItem(item))}</nav>
}

