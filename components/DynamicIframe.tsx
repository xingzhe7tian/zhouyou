'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface DynamicIframeProps {
  src: string
}

const DynamicIframe: React.FC<DynamicIframeProps> = ({ src }) => {
  const [height, setHeight] = useState('100vh')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          const newHeight = `${iframeRef.current.contentWindow.document.documentElement.scrollHeight}px`
          setHeight(newHeight)
        } catch (e) {
          console.error('Error resizing iframe:', e)
        }
      }
    }

    const handleLoad = () => {
      setIsLoading(false)
      // 添加一个小延迟以确保内容完全加载
      setTimeout(handleResize, 100)
    }

    const handleError = () => {
      setError('加载页面时出错')
      setIsLoading(false)
    }

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', handleLoad)
      iframe.addEventListener('error', handleError)
      window.addEventListener('resize', handleResize)

      // 初始高度设置
      setHeight('100vh')
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad)
        iframe.removeEventListener('error', handleError)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [src])

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        style={{ height, width: '100%', border: 'none' }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        title="Dynamic Content"
      />
    </div>
  )
}

export default DynamicIframe

