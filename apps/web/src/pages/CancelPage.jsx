import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const CancelPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Payment Cancelled - RepurposeForge.ai`}</title>
        <meta name="description" content="Your payment was cancelled" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center"
          >
            <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-xl text-gray-400 mb-8">
              Your payment was not completed. No charges were made.
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8">
              <p className="text-gray-300 mb-4">
                If you experienced any issues during checkout, please try again or contact our support team.
              </p>
              <p className="text-sm text-gray-500">
                You can still use RepurposeForge.ai with the free plan (5 projects per day).
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full">
                <Link to="/pricing">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800 w-full">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CancelPage;