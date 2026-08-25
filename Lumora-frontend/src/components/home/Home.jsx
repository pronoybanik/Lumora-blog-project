import HeroSection from "./HeroSection";
import Stats from "./Stats";
import FeaturedStories from "./FeaturedStories";
import TrendingAndVoices from "./TrendingAndVoices";
import Testimonial from "./Testimonial";
import Newsletter from "./Newsletter";

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
