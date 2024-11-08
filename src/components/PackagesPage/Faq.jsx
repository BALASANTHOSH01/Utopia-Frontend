import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "What type of travel packages do we offer?",
    answer: "You can book a tour by visiting our website and selecting the tour you want to go on. You can also call us to book a tour.",
  },
  {
    question: "How do I book a trip with Himalayan Utopia?",
    answer: "You can pay for the tour by using your credit card or by using PayPal.",
  },
  {
    question: "What is the payment process for Himalayan Utopia?",
    answer: "You can cancel your tour up to 24 hours before the tour starts. If you cancel within 24 hours of the tour, you will be charged a cancellation fee.",
  },
  {
    question: "How is the cancellation process for my booking?",
    answer: "The tour includes transportation, a tour guide, and entrance fees to the attractions you will visit.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full py-36 px-6 lg:px-20 flex items-center justify-center">
      <div className="w-full lg:w-10/12 items-center justify-center flex flex-col gap-12">
        {/* FAQ Header */}
        <div className="w-full flex flex-col items-start lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h1 className="text-blue-400 tracking-widest popp text-2xl">FAQ</h1>
            <h1 className="text-4xl lg:text-6xl osw font-semibold">FREQUENTLY ASKED QUESTIONS</h1>
            <p className="popp">What our clients usually ask about our services and tours.</p>
          </div>
          {/* FAQ Questions */}
          <div className="w-full lg:w-2/3">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`border-b pb-4 mb-4 ${
                  openIndex === index ? " py-2 px-6" : "shadow-lg/80 rounded-[20px] py-2 px-4 md:px-6"
                }`}
              >
                <div
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between cursor-pointer py-4"
                >
                  <h1 className="text-[16px] md:text-[24px] popp lg:text-2xl font-semibold">
                    {item.question}
                  </h1>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openIndex === index ? (
                      <FaChevronUp className="bg-[#4997D3] text-white border rounded-full p-2 text-3xl border-[#4997D3]" />
                    ) : (
                      <FaChevronDown className="text-[#4997D3] border rounded-full p-2 text-3xl border-[#4997D3]" />
                    )}
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <p className="popp text-sm lg:text-base pt-2">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
