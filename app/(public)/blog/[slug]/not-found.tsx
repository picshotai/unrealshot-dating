import PublicHeader from "@/components/Header"
import Footer from "@/components/main-landing/Footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileX } from "lucide-react"

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col font-[family-name:var(--font-inter)] text-gray-900">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center pt-28 pb-16">
        <div className="max-w-md mx-auto text-center px-4 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="mb-8">
            <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Guide Not Found</h1>
            <p className="text-gray-600 text-sm">
              The dating guide you&apos;re looking for doesn&apos;t exist or may have moved.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/blog" className="block">
              <Button className="w-full bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white font-semibold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Guides
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-gray-200">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}