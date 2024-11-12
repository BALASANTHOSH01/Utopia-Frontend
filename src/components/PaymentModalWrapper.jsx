import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`);

const PaymentModal = ({ clientSecret, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; 

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);
    // const description = "Your detailed export description here";
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: "Customer Name" },
        // description,
      },
    });

    if (stripeError) {
      setError(stripeError.message);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="modal bg-white p-6 w-3/5 rounded-lg shadow-lg mx-auto">
      <button onClick={onClose} className="close-btn">X</button>
      <form onSubmit={handlePayment} className="w-full">
        <CardElement options={{ hidePostalCode: true }} />
        <button type="submit" className="pay-btn" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
      {error && <p className="error text-red-500">{error}</p>}
    </div>
  );
};

const PaymentModalWrapper = ({ clientSecret, onSuccess, onClose }) => (
  <div className="overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <Elements stripe={stripePromise}>
      <PaymentModal
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onClose={onClose}
        className=""
      />
    </Elements>
  </div>
);

export default PaymentModalWrapper;
