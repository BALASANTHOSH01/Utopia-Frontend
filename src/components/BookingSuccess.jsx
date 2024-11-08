import React from "react";
// import PDFDocument from "pdfkit";
// import blobStream from "blob-stream";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import { useLocation } from "react-router-dom";
import backdrop from "../assets/backdrop.png";
import MapView from "./MapView";
import jsPDF from "jspdf";

const BookingSuccess = () => {
  const location = useLocation();
  const data = location.state;
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(userData)

  const onDownloadInvoice = () => {
    const doc = new jsPDF();
  
    const primaryColor = '#1E3A8A'; // Deep blue color 
  
    // Header
    doc.setFontSize(26).setTextColor(primaryColor).text('Himalayan Utopia', 105, 20, { align: 'center' });
    doc.setFontSize(12).setTextColor('#555').text('Himalayan Utopia Adventures', 105, 30, { align: 'center' });
    doc.text('1234 Mountain Road, Scenic View, Nepal', 105, 36, { align: 'center' });
    doc.text('Email: info@himalayanutopia.com | Phone: (123) 456-7890', 105, 42, { align: 'center' });
  
    // Invoice Title
    doc.setFontSize(24).setTextColor(primaryColor).text('Payment Invoice', 105, 60, { align: 'center' });
  
    // Invoice Details Section
    doc.setTextColor(primaryColor).setFontSize(18).text('Invoice Details', 105, 70, { align: 'center' });
    doc.setFontSize(12).setTextColor('#000');
    doc.text(`Booking ID: ${data?.bookingData?.data?.booking?._id}`, 20, 80);
    doc.text(`Customer Name: ${userData?.user?.name}`, 20, 90);
    doc.text(`Customer Email: ${userData?.user?.email}`, 20, 100); 
    doc.text(`Amount Paid: INR ${data?.bookingData?.data?.booking?.amount}`, 20, 110);
    doc.text(`Payment Date: ${new Date().toDateString()}`, 20, 120);
  
    // // Divider Line
    // const pageWidth = doc.internal.pageSize.getWidth();
    // doc.setDrawColor(211, 211, 211); 
    // doc.setLineWidth(1);
    // doc.line(20, 130, pageWidth - 20, 130); 
  
    // // Summary Section
    // doc.setTextColor(primaryColor).setFontSize(16).text('Payment Summary', 105, 140, { align: 'center' });
    // doc.setFontSize(12).setTextColor('#000');
    // doc.text(`Booking ID: ${data?.bookingData?.data?.booking?._id}`, 20, 150);
    // doc.text(`Total Amount: $${data?.bookingData?.data?.booking?.amount}`, pageWidth - 20, 150, { align: 'right' });
  
    // Thank You Message
    doc.setTextColor(primaryColor).setFontSize(14).text('Thank you for your payment!', 105, 160, { align: 'center' });
    doc.setFontSize(12).setTextColor('#555').text('We look forward to serving you on your adventure!', 105, 166, { align: 'center' });
  
    // Footer
    doc.setFontSize(10).setTextColor('#999').text('Himalayan Utopia | www.himalayanutopia.com', 105, 180, { align: 'center' });
  
    // Finalize PDF
    doc.save('invoice.pdf');
  };
  

  return (
    <div className="w-full items-center flex flex-col ">
      <Navbar />
      {data ? (
        <div className="w-full lg:w-10/12 mt-[150px] mb-[150px] px-12 flex flex-col items-center justify-center">
          <img src={backdrop} alt="backdrop" className="w-full h-56 object-cover rounded-[20px]" />
          <h1 className="osw text-[40px] text-center font-semibold mt-10 text-[#4997D3] uppercase">
            All set you are going to {data?.details?.name}!
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <p>Amount paid</p>
            <p>$ {data?.bookingData?.data?.booking?.amount}</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <p className="whitespace-nowrap">Booking ID</p>
            <p className="text-sm md:text-md">{data?.bookingData?.data?.booking?._id}</p>
          </div>
          <button onClick={onDownloadInvoice} className="bg-[#4997D3] text-white px-4 py-2 rounded-[10px] hover:scale-105 transition-all mt-4">
                Download Invoice
              </button>
          <div className="w-full my-10 flex flex-col lg:flex-row items-center gap-4">
            <div className="w-full lg:w-1/2 ">
              <h1 className="text-black w-full text-center lg:text-start text-md">
                {new Date(data?.bookingData?.data?.booking?.checkIn).toLocaleDateString()} - {new Date(data?.bookingData?.data?.booking?.checkOut).toLocaleDateString()}
              </h1>
              <h1 className="text-black text-md w-full text-center lg:text-start">
                {data?.details?.name} - {data?.details?.location}
              </h1>
              <hr className="my-4 border" />
              <h1 className="text-black font-semibold text-2xl">{data?.details?.name}</h1>
              <p>
                {data?.details?.guests} guests • &nbsp;
                {data?.details?.noOfDay} days • &nbsp;
                {data?.details?.noOfNight} nights
              </p>
             
            </div>
            <div className="w-full lg:w-1/2">
              {data?.details?.coordinates && (
                <MapView
                  latitude={data?.details?.coordinates?.latitude}
                  longitude={data?.details?.coordinates?.longitude}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-10/12 px-12 mt-[150px] mb-[150px] flex flex-col justify-center items-center">
          <img src={backdrop} alt="backdrop" className="w-full h-56 object-cover rounded-[20px]" />
          <h1 className="text-4xl font-semibold mt-10">Please go back and select a trek to book</h1>
          <button className="bg-[#4997D3] text-white px-4 py-2 rounded-md mt-4">Go back</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookingSuccess;
