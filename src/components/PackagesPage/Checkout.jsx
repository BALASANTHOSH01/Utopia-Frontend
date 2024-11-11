// Checkout.js
import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'sonner';
import useAuth from '../../services/useAuth';

const Checkout = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {api} = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    try {
      
      const response = await api.post('/api/bookings/verify-payment', {
        ...bookingData,
        paymentMethodId: paymentMethod.id,
      });

      window.location.href = '/success'; 
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default Checkout;
