import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SiteMap } from '@/components/SiteMap'

export default function SiteMapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 gradient-text">网站地图</h1>
        <SiteMap />
      </main>
      <Footer />
    </div>
  )
}

