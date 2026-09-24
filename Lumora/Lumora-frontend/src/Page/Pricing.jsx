import { useState } from "react";
import PricingHero from "../components/pricing/PricingHero";
import PricingPlans from "../components/pricing/PricingPlans";
import TrustedBy from "../components/pricing/TrustedBy";
import FAQSection from "../components/pricing/FAQSection";
import CTASection from "../components/pricing/CTASection";

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <PricingHero yearly={yearly} setYearly={setYearly} />
      <PricingPlans yearly={yearly} />
      <TrustedBy />
      <FAQSection />
      <CTASection />
    </div>
  );
}
