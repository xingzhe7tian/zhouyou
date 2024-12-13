'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuItem {
  text: string;
  href: string;
  items?: MenuItem[];
}

interface RightSideMenuProps {
  menuItems: MenuItem[];
}

export const RightSideMenu: React.FC<RightSideMenuProps> = ({ menuItems }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(prev => prev === sectionTitle ? null : sectionTitle);
  };

  const handleClick = (href: string, sectionTitle?: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      const headerHeight = (document.querySelector('header')?.clientHeight || 0) + 10;
      const top = element.offsetTop - headerHeight;
      try {
        window.scrollTo({ top, behavior: 'smooth' });
      } catch (error) {
        console.error('Error scrolling to element:', error instanceof Error ? error.message : String(error));
        window.scrollTo(0, top);
      }
    } else {
      console.warn(`Element with id "${href.substring(1)}" not found`);
    }

    if (sectionTitle) {
      toggleSection(sectionTitle);
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded-lg sticky top-[70px] border border-gray-200">
      <ul>
        {menuItems.map((item) => (
          <li key={item.text} className="mb-2">
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md flex justify-between items-center"
              onClick={() => handleClick(item.href, item.text)}
            >
              <span className="font-medium">{item.text}</span>
              {item.items && (
                expandedSection === item.text ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )
              )}
            </div>
            {item.items && expandedSection === item.text && (
              <ul className="pl-4 mt-2">
                {item.items.map((subItem) => (
                  <li key={subItem.href} className="mb-2">
                    <Link
                      href={subItem.href}
                      className="block cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(subItem.href);
                      }}
                    >
                      {subItem.text}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

