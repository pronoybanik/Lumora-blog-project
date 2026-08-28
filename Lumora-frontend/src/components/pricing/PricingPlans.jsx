import { CheckCircle } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Essential features for new writers.',
    monthly: 0,
    yearly: 0,
    features: ['Basic analytics', 'Standard editor', 'Public blogs'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Professional',
    description: 'For serious creators.',
    monthly: 12,
    yearly: 120,
    features: [
      'Advanced analytics',
      'Custom domains',
      'Members-only content',
      'Priority support',
    ],
    cta: 'Upgrade Now',
    featured: true,
  },
  {
    name: 'Business',
    description: 'For teams and organizations.',
    monthly: 49,
    yearly: 490,
    features: [
      'Unlimited authors',
      'Team collaboration',
      'Dedicated manager',
      'API access',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

function PlanCard({ plan, yearly }) {
  const price = yearly ? plan.yearly : plan.monthly
  const period = yearly ? '/yr' : '/mo'

  if (plan.featured) {
    return (
      <div className="bg-[#3525cd] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col order-first md:order-none md:h-[105%]">
        <div className="absolute top-0 right-0 bg-[#0051d5] px-3 py-1 rounded-bl-xl text-[10px] sm:text-xs font-bold tracking-wide">
          MOST POPULAR
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
          <p className="text-sm text-white/80 mb-4">{plan.description}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-bold">${price}</span>
            <span className="text-base text-white/80">{period}</span>
          </div>
        </div>
        <div className="flex-grow">
          <ul className="space-y-3 mb-8">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-[#dbe1ff] flex-shrink-0" />
                <span className="text-sm sm:text-base">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="w-full py-3 rounded-xl bg-white text-[#3525cd] text-sm font-medium active:scale-95 transition-transform">
          {plan.cta}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col border border-[#e9edff]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1 text-[#141b2b]">{plan.name}</h3>
        <p className="text-sm text-[#464555] mb-4">{plan.description}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-bold text-[#141b2b]">${price}</span>
          <span className="text-base text-[#464555]">{period}</span>
        </div>
      </div>
      <div className="flex-grow">
        <ul className="space-y-3 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#3525cd] flex-shrink-0" />
              <span className="text-sm sm:text-base text-[#141b2b]">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className="w-full py-3 rounded-xl bg-[#e9edff] text-[#141b2b] text-sm font-medium active:scale-95 transition-transform">
        {plan.cta}
      </button>
    </div>
  )
}

export default function PricingPlans({ yearly }) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 md:px-16 mb-10 md:mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 md:items-end">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} yearly={yearly} />
        ))}
      </div>
    </section>
  )
}
