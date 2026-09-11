import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import SmartSearch from "@/components/SmartSearch"
import Categories from "@/components/Categories"
import FeaturedListings from "@/components/FeaturedListings"
import Features from "@/components/Features"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <main>
        <Hero />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-2 sm:-mt-4 relative z-20 mb-6">
        <SmartSearch />
      </div>
        <Categories />
        <FeaturedListings />
        <Features />
      </main>
      <Footer />
    </div>
  )
}