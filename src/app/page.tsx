import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
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
        <Categories />
        <FeaturedListings />
        <Features />
      </main>
      <Footer />
    </div>
  )
}