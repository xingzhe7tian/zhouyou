import { setupGlobalErrorHandler } from '../utils/errorHandler'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

