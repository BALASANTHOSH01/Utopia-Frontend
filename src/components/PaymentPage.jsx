import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const PaymentPage = (props) => {
  const { details } = props;
  const { bookingData } = props;
  const { clientSecret } = props;
  const navigate = useNavigate();
  // console.log("clientSecret", clientSecret);
  // console.log("details", details);
  // console.log("bookingData", bookingData);
  // console.log("customerName", customerName);
  const user = JSON.parse(localStorage.getItem("user"));
  const [customerName, setCustomerName] = useState(user?.user?.name);
  const [customerEmail, setCustomerEmail] = useState(user?.user?.email);

  console.log(bookingData.data.booking.checkIn)

  const handleSuccess = () => {
    toast.success("Payment successful!");
    navigate("/booking-success", { state: { bookingData, details } });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])

  return (
    <div className="w-full flex items-center flex-col">
      <div className="w-full xl:w-10/12 flex flex-col lg:flex-row mt-[150px] mb-[150px] lg:justify-center px-4 sm:px-12 gap-4 items-start lg:px-20">
        <Accordion clientSecret={clientSecret} handleSuccess={handleSuccess} customerName={customerName} setCustomerName={setCustomerName} customerEmail={customerEmail} setCustomerEmail={setCustomerEmail}/>
        {/* <PackageDetailForm details={details} /> */}
        <div className="w-full lg:w-1/2 border rounded-[10px] p-3 flex gap-4 flex-col items-center">
          <img
            src={details?.bannerImage}
            alt="package"
            className="w-full rounded-[10px]"
          />
          <h1 className="text-xl text-start w-full font-semibold">
            {details?.name}{" "}
            <span className="font-light text-sm">{details?.location}</span>
          </h1>
          <div className="flex items-center gap-4 w-full">
            <div className="w-full flex flex-col items-start">
              <p className="text-gray-700 text-sm">From</p>
              <input
                type="date"
                className="p-2 border focus:outline-none rounded-[10px] border-zinc-400/30 transition"
                value={new Date(bookingData?.data?.booking?.checkIn).toISOString().split('T')[0]}
                // do not change this 
                disabled
              />
            </div>
            <div className="w-full flex flex-col items-start">
              <p className="text-gray-700 text-sm">To</p>
              <input
                type="date"
                className="p-2 border focus:outline-none rounded-[10px] border-zinc-400/40 transition"
                value={new Date(bookingData?.data?.booking?.checkOut).toISOString().split('T')[0]}
                
                disabled
              />
            </div>
          </div>
          <div className="text-md text-start w-full font-semibold">
            Price Details
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-gray-700">Price per night</p>
            <p className="text-gray-700">{details?.price}</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-gray-700">Tax</p>
            <p className="text-gray-700">500 INR</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-gray-700">Fee</p>
            <p className="text-gray-700">750INR</p>
          </div>
          <div className="w-full flex font-semibold items-center justify-between">
            <p className="text-gray-700">Total</p>
            <p className="text-gray-700">{details?.price} INR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ clientSecret, handleSuccess, customerName, setCustomerName, setCustomerEmail, customerEmail }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="w-full lg:w-4/5 space-y-4 lg:pr-10">
      <p className="text-gray-700 text-sm">
        Do not refresh the page while processing the payment.
      </p>
      {/* <AccordionItem
        title="1. Customer Details"
        index={1}
        expanded={expanded}
        toggleAccordion={toggleAccordion}
      >
        <CustomerForm customerName={customerName} setCustomerName={setCustomerName} customerEmail={customerEmail} setCustomerEmail={setCustomerEmail}/>
      </AccordionItem> */}
      <AccordionItem
        title="1. Cancellation Policy"
        index={3}
        expanded={expanded}
        toggleAccordion={toggleAccordion}
      >
        <p className="text-gray-700 text-sm">
          By selecting the button below, I agree to the Himalayan Utopia
          guidelines, Booking and Refund rules.
        </p>
        <p className="text-gray-700 mt-4 text-sm">
          I also agree to the updated{" "}
          <a href="#" className="text-[#4997D3]">
            Terms of Service
          </a>
          ,{" "}
          <a href="#" className="text-[#4997D3]">
            Payments Terms of Service
          </a>
          , and acknowledge the{" "}
          <a href="#" className="text-[#4997D3]">
            Privacy Policy
          </a>
          .
        </p>
      </AccordionItem>


      <AccordionItem
        title="2. Payment Information"
        index={2}
        expanded={expanded}
        toggleAccordion={toggleAccordion}
      >
        <Elements stripe={stripePromise}>
          <PaymentForm clientSecret={clientSecret} onSuccess={handleSuccess} customerName={customerName}/>
        </Elements>
      </AccordionItem>
    </div>
  );
};

const AccordionItem = ({
  title,
  children,
  index,
  expanded,
  toggleAccordion,
}) => {
  const isOpen = expanded === index;

  return (
    <div className="border border-gray-300 rounded-[10px] overflow-hidden">
      <button
        onClick={() => toggleAccordion(index)}
        className="w-full text-left p-4 bg-zinc-50/50 hover:bg-gray-100/80 font-semibold flex justify-between items-center focus:outline-none"
      >
        {title}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white text-gray-700"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomerForm = ({ customerName, setCustomerName, customerEmail, setCustomerEmail }) => {
  // Customer form structure here
  return (
    <form className="space-y-4">
      <div className="flex w-full flex-col lg:flex-row items-center gap-2">
        <div className="flex w-full flex-col space-y-1">
          <label className="text-gray-950 ">Frist Name</label>
          <input
            className="p-2 border rounded-[10px] focus:outline-none focus:border-blue-500 transition"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col space-y-1">
          <label className="text-gray-950">Last Name</label>
          <input
            className="p-2 border rounded-[10px] focus:outline-none focus:border-blue-500 transition"
            type="text"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-gray-950">Email</label>
        <input
          className="p-2 border rounded-[10px] focus:outline-none focus:border-blue-500 transition"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-gray-950">Phone</label>
        <input
          className="p-2 border rounded-[10px] focus:outline-none focus:border-blue-500 transition"
          type="tel"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-gray-950">Address</label>
        <textarea className="p-2 border rounded-[10px] focus:outline-none focus:border-blue-500 transition resize-none" />
      </div>
      <div className="flex w-full flex-col lg:flex-row gap-2 items-center">
        <div className="w-full flex flex-col space-y-1">
          <label className="text-gray-950">Country</label>
          <input
            className="p-2  border rounded-[10px] focus:outline-none focus:border-blue-500 transition"
            type="text"
          />
        </div>
        <div className="w-full flex flex-col space-y-1">
          <label className="text-gray-950">Pin Code</label>
          <input
            className="p-2 border rounded-[10px] focus:outline-none focus:border-blue-500 transition"
            type="text"
          />
        </div>
      </div>
    </form>
  );
};

const PaymentForm = ({ clientSecret, onSuccess, customerName }) => {
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
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: customerName },
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      toast.error(stripeError.message);
    } else if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
      // navigate("/booking-success");
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="w-full">
      <CardElement options={{ hidePostalCode: true }} />
      <div className="w-full mt-4 flex justify-end">
        <button
          type="submit"
          className="mt-4 py-2 px-6 rounded-[10px] bg-[#4997D3] text-white hover:bg-[#4aa6ec] transition-all"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "Confirm and Pay"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default PaymentPage;
