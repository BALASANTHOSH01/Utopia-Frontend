import React, { useState, useEffect } from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import PkgDetail from "../components/PackagesPage/PkgDetail";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import useAuth from "../services/useAuth";

const PackageDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/treks/${id}`);
        setPackageData(response.data.data); // Assuming the trek data is in `response.data.data`
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching package data:", error);
        setError("Error fetching package data");
        toast.error("Error fetching package data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, api]);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen relative">
      <Navbar />
      
      {loading && (
        <>
          <div className="h-[80vh] flex"></div>
          <div className="fixed inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-[99]">
            <ClipLoader size={60} color="#3498db" />
          </div>
        </>
      )}

      {!loading && packageData && (
        <PkgDetail data={packageData?.trek} /> 
      )}

      <Footer />
    </div>
  );
};

export default PackageDetail;
