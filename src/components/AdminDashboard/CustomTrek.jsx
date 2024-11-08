import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const CustomTrek = () => {
  const [treks, setTreks] = useState([]);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/customeTrek/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTreks(response.data.data.customTreks);
      } catch (error) {
        toast.error("Failed to fetch treks.");
        console.error("Error fetching treks:", error);
      }
    };
    fetchTreks();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  
  const handleApprove = async (trekId) => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount before approving.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/customeTrek/${trekId}/approval`,
        {
          approval: "approved",
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status === "success") {
        toast.success("Trek approved successfully!");
        setShowModal(false);
        setTreks((prev) =>
          prev.map((trek) =>
            trek._id === trekId ? { ...trek, approval: "approved", amount: amount } : trek
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve trek.");
      console.error("Error approving trek:", error);
    }
  };


  const handleCancel = async (trekId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/customeTrek/${trekId}/approval`,
        {
          approval: "cancelled",
          // Don't send amount for cancellation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status === "success") {
        toast.success("Trek cancelled successfully!");
        setShowModal(false);
        setTreks((prev) =>
          prev.map((trek) =>
            trek._id === trekId ? { ...trek, approval: "cancelled" } : trek
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel trek.");
      console.error("Error cancelling trek:", error);
    }
  };

  const renderModalButtons = (trek) => {
    switch (trek.approval) {
      case "waiting":
        return (
          <>
            <button
              className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => handleApprove(trek._id)}
            >
              Approve
            </button>
            <button
              className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => handleCancel(trek._id)}
            >
              Cancel Trip
            </button>
            <button
              className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </>
        );
      case "approved":
        return (
          <>
            <button
              className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => handleCancel(trek._id)}
            >
              Cancel Trip
            </button>
            <button
              className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </>
        );
      case "cancelled":
        return (
          <>
            <button
              className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => handleApprove(trek._id)}
            >
              Approve
            </button>
            <button
              className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </>
        );
      default:
        return (
          <button
            className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Custom Treks</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {treks.map((trek) => (
          <div
            key={trek._id}
            className="border p-4 rounded-[10px] hover:bg-zinc-100 transition-all cursor-pointer"
            onClick={() => {
              setSelectedTrek(trek);
              setShowModal(true);
            }}
          >
            <h3 className="text-xl capitalize font-semibold">
              {trek?.location}
            </h3>
            <p className="text-gray-600">User: {trek?.userId?.name}</p>
            <p className="text-gray-600">Email: {trek?.userId?.email}</p>
            <p className="text-gray-600">Guests: {trek?.guests}</p>
            <p className="text-gray-600">Amount: ${trek?.amount}</p>
            <p
              className={`text-sm ${
                trek?.approval === "approved"
                  ? "text-green-500"
                  : trek?.approval === "cancelled"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              Status: {trek?.approval}
            </p>
          </div>
        ))}
      </div>

      {showModal && selectedTrek && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white m-2 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Trek Details</h2>
            <p className="w-full justify-between flex items-center capitalize">
              <strong>Location:</strong> {selectedTrek?.location}
            </p>
            <p className="w-full justify-between flex items-center capitalize">
              <strong>Check-In:</strong>{" "}
              {new Date(selectedTrek?.checkIn).toLocaleDateString()}
            </p>
            <p className="w-full justify-between flex items-center capitalize">
              <strong>Check-Out:</strong>{" "}
              {new Date(selectedTrek?.checkOut).toLocaleDateString()}
            </p>
            <p className="w-full justify-between flex items-center capitalize">
              <strong>Amount:</strong> ${selectedTrek?.amount}
            </p>
            <p className="w-full justify-between flex items-center capitalize">
              <strong>Guests:</strong> {selectedTrek?.guests}
            </p>
            <p className="w-full justify-between flex items-center capitalize">
              <strong>Status:</strong> {selectedTrek?.status}
            </p>

            {selectedTrek.approval === "waiting" && (
              <label className="block mt-4">
                <span className="text-gray-700">Amount</span>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none"
                  value={amount}
                  placeholder="Enter Amount here..."
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
            )}
            
            <div className="w-full flex md:flex-row flex-col items-center gap-2">
              {renderModalButtons(selectedTrek)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTrek;