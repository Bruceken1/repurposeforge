import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Zap, Video, FileText, Share2, TrendingUp, Sparkles } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Video,
      title: 'AI-Powered Shorts',
      description: 'Transform long-form content into viral TikToks, Reels, and YouTube Shorts automatically'
    },
    {
      icon: FileText,
      title: 'Multi-Platform Content',
      description: 'Generate threads, carousels, newsletters, and posts for every platform'
    },
    {
      icon: Sparkles,
      title: 'Voice Cloning',
      description: 'Clone your voice for audio teasers and voiceovers with ElevenLabs integration'
    },
    {
      icon: Share2,
      title: 'One-Click Export',
      description: 'Export to WhatsApp, Buffer, and all major platforms with a single click'
    },
    {
      icon: TrendingUp,
      title: 'Performance Prediction',
      description: 'AI-powered analytics predict engagement before you post'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate unlimited assets in seconds, not hours'
    }
  ];

  const pricingTiers = [
    {
      name: 'Freemium',
      price: 0,
      features: ['5 projects per day', 'Basic asset generation', 'Standard export options']
    },
    {
      name: 'Pro',
      price: 14,
      features: ['Unlimited projects', 'All asset types', 'Priority processing', 'Advanced exports']
    },
    {
      name: 'Enterprise',
      price: 29,
      features: ['Everything in Pro', 'Voice cloning', 'Performance analytics', 'API access', 'Priority support']
    }
  ];

  return (
    <>
      <Helmet>
        <title>RepurposeForge.ai - Transform One Piece of Content Into Unlimited Assets</title>
        <meta name="description" content="AI-powered content repurposing platform. Turn one video, podcast, or article into shorts, threads, carousels, newsletters, and more in seconds." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
          <div className="container mx-auto px-4 py-20 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Transform One Piece of Content Into{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Unlimited Assets
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  AI-powered content repurposing that turns your videos, podcasts, and articles into shorts, threads, carousels, newsletters, and more—in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
                    <Link to="/signup">
                      <Zap className="mr-2 h-5 w-5" />
                      Start Repurposing Free
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-600 text-lg">
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b"
                  alt="Content creation workspace with laptop and creative tools"
                  className="rounded-2xl shadow-2xl border border-gray-800"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent rounded-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Everything You Need to Dominate Every Platform</h2>
              <p className="text-xl text-gray-400">One upload. Unlimited possibilities.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-400">Start free, scale as you grow</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gray-800 rounded-xl p-8 border ${
                    index === 1 ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link to="/pricing">Get Started</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Ready to 10x Your Content Output?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are repurposing their content with AI
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
                <Link to="/signup">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Today
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2026 RepurposeForge.ai. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;