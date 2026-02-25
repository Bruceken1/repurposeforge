import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import CheckoutButton from '@/components/CheckoutButton.jsx';
import { Check, Zap } from 'lucide-react';

const PricingPage = () => {
  const tiers = [
    {
      name: 'Freemium',
      price: 0,
      tier: 'free',
      description: 'Perfect for trying out RepurposeForge',
      features: [
        '5 projects per day',
        'Basic asset generation',
        'All asset types',
        'Standard export options',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: 14,
      tier: 'pro',
      description: 'For serious content creators',
      features: [
        'Unlimited projects',
        'All asset types',
        'Priority processing',
        'Advanced exports',
        'Email support',
        'Performance analytics'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 29,
      tier: 'enterprise',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Voice cloning (ElevenLabs)',
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom integrations',
        'Team collaboration'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`Pricing - RepurposeForge.ai`}</title>
        <meta name="description" content="Choose the perfect plan for your content repurposing needs" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-400">
              Start free, scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-800 rounded-2xl p-8 border ${
                  tier.popular
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 relative'
                    : 'border-gray-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  {tier.price > 0 ? (
                    <CheckoutButton tier={tier.tier} price={tier.price} />
                  ) : (
                    <CheckoutButton tier={tier.tier} price={tier.price} label="Get Started Free" />
                  )}
                </div>

                <ul className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 max-w-3xl mx-auto border border-blue-500/30">
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">All plans include:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited asset types</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Multi-platform exports</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI-powered generation</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Regular updates</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;