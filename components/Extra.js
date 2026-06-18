import React from 'react'
import { Check } from 'lucide-react';

function Extra() {
    const pricingPlans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "Accept one-time support",
        "Basic customization",
        "Standard payment processing",
        "Community support"
      ],
      highlighted: false
    },
    {
      name: "Creator",
      price: "5",
      description: "For serious creators",
      features: [
        "Everything in Free",
        "Monthly memberships",
        "Advanced customization",
        "Priority support",
        "Analytics dashboard",
        "Custom branding"
      ],
      highlighted: true
    },
    {
      name: "Pro",
      price: "15",
      description: "For established creators",
      features: [
        "Everything in Creator",
        "Advanced analytics",
        "API access",
        "White-label options",
        "Dedicated account manager",
        "Custom integrations"
      ],
      highlighted: false
    }
  ];
  return (
    <div>
       <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Simple, transparent
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works for you. All plans include our core features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                plan.highlighted 
                  ? 'border-orange-500 shadow-lg bg-gradient-to-b from-orange-50 to-pink-50' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}>
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full text-center mb-6">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Extra
