'use client'

import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  items: { href: string; label: string }[];
  currentPathLabel?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, currentPathLabel }) => (
  <Breadcrumb className="bg-gray-100 p-3 rounded-md shadow-sm flex items-center">
    <BreadcrumbList>
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          <BreadcrumbItem>
            {item.href ? (
              <Link href={item.href}>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 ease-in-out">
                  {item.label}
                </span>
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            )}
          </BreadcrumbItem>
          {index < items.length - 1 && <BreadcrumbSeparator className="mx-2 text-gray-400">/</BreadcrumbSeparator>}
        </React.Fragment>
      ))}
      {currentPathLabel && (
        <>
          <BreadcrumbSeparator className="mx-2 text-gray-400">/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <span className="text-gray-900 font-medium">{currentPathLabel}</span>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  </Breadcrumb>
);

