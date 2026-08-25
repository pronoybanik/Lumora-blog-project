import NavBar from "../../shared/NavBar";
import HeroSection from "./HeroSection";
import Stats from "./Stats";
import FeaturedStories from "./FeaturedStories";
import TrendingAndVoices from "./TrendingAndVoices";
import Testimonial from "./Testimonial";
import Newsletter from "./Newsletter";
import Footer from "../../shared/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <NavBar />
      <HeroSection />
      <Stats />
      <FeaturedStories />
      <TrendingAndVoices />
      <Testimonial />
      <Newsletter />
      <Footer />
    </div>
  );
}