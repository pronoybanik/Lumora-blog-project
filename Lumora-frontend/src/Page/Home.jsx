import HeroSection from "../components/home/HeroSection";
import Stats from "../components/home/Stats";
import FeaturedStories from "../components/home/FeaturedStories";
import TrendingAndVoices from "../components/home/TrendingAndVoices";
import Testimonial from "../components/home/Testimonial";
import Newsletter from "../components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <HeroSection />
      <Stats />
      <FeaturedStories />
      <TrendingAndVoices />
      <Testimonial />
      <Newsletter />
    </div>
  );
}
