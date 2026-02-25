import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const CheckoutButton = ({ tier, price, label }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/cancel'
        })
      });

      if (!response.ok) throw new Error('Checkout failed');

      const data = await response.json();
      // Use window.open to bypass iframe restrictions
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {loading ? 'Processing...' : label || `Subscribe - $${price}/mo`}
    </Button>
  );
};

export default CheckoutButton;