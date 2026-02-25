import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch payment details');
      const data = await response.json();
      setPayment(data);
    } catch (error) {
      console.error('Fetch payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Payment Successful - RepurposeForge.ai`}</title>
        <meta name="description" content="Your payment was successful" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center"
          >
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-400 mb-8">
              Thank you for subscribing to RepurposeForge.ai
            </p>

            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
            ) : payment ? (
              <div className="bg-gray-900 rounded-xl p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-500 font-semibold">{payment.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">
                      ${((payment.amountTotal || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  {payment.customerEmail && (
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-semibold">{payment.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <p className="text-gray-400">
                Your subscription is now active. Start creating unlimited content!
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800 w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;