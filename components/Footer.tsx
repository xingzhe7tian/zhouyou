import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} 高端简约网站. 保留所有权利.
          </p>
          <Link href="/sitemap" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            网站地图
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">隐私政策</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">使用条款</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">联系我们</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

