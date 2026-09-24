import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time from your account settings. You will continue to have access to your plan until the end of your current billing cycle.',
  },
  {
    question: 'How do custom domains work?',
    answer:
      'On the Professional and Business plans, you can link your Lumora blog to any domain you own. We provide simple DNS instructions, and we automatically provision an SSL certificate for you.',
  },
  {
    question: 'What happens if I exceed my usage?',
    answer:
      "We'll notify you when you approach your plan's limits. We offer a grace period, and if you consistently exceed limits, we'll reach out to discuss upgrading to a plan that better suits your needs.",
  },
  {
    question: 'Do you offer discounts for non-profits?',
    answer:
      'Yes, we offer a 50% discount on all plans for registered non-profit organizations. Please contact our support team with documentation to apply the discount.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="w-full max-w-[800px] mx-auto px-5 sm:px-8 md:px-16 py-10 md:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 md:mb-10 text-center text-[#141b2b]">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3 md:space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={faq.question}
              onClick={() => toggle(index)}
              className="bg-white border border-[#e9edff] rounded-2xl p-4 sm:p-6 shadow-sm cursor-pointer group"
            >
              <div className="flex justify-between items-center gap-3">
                <h4 className="text-sm sm:text-lg font-semibold text-[#141b2b] group-hover:text-[#3525cd] transition-colors">
                  {faq.question}
                </h4>
                <ChevronDown
                  size={20}
                  className={`text-[#464555] transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {isOpen && (
                <div className="mt-4 text-sm sm:text-base text-[#464555]">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
