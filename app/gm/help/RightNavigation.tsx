'use client'

import React, { useRef, useEffect } from 'react'

interface RightNavigationProps {
  headings: { id: string; text: string }[];
}

export function RightNavigation({ headings }: RightNavigationProps) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 获取 header 的高度
      const headerHeight = document.querySelector('header')?.clientHeight || 0;
      window.scrollTo({
        top: element.offsetTop - headerHeight - 10, // 减去 header 高度和一点边距
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg sticky top-[70px]"> {/* 调整 sticky 定位 */}
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className="cursor-pointer hover:bg-blue-600 p-2 rounded-md mb-2" onClick={() => handleClick(heading.id)}>
            {heading.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

