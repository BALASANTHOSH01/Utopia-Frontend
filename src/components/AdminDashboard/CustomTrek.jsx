import { useState, useEffect } from "react";
import useAuth from "../../services/useAuth";
import { toast } from "sonner";

const CustomTrek = () => {
  const [treks, setTreks] = useState([]);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { api } = useAuth();

  // Define headers configuration
  const getRequestConfig = (method, data = null) => ({
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: true,
    ...(data && { data })
  });

  // Fetch treks with proper config
  const fetchTreks = async () => {
    try {
      setIsLoading(true);
      const response = await api.request({
        ...getRequestConfig('GET'),
        url: "/api/customeTrek/all"
      });

      if (response.data?.data?.customTreks) {
        setTreks(response.data.data.customTreks);
      }
    } catch (error) {
      console.error("Error fetching treks:", error);
      toast.error(error.response?.data?.message || "Failed to fetch treks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setAmount("");
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleApprove = async (trekId) => {
    try {
      setIsLoading(true);
      
      const numAmount = Number(amount);
      if (!numAmount || numAmount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
  
      const data = {
        approval: "approved",
        amount: numAmount
      };
  
      const response = await api.request({
        ...getRequestConfig('PATCH', data),
        url: `/api/customeTrek/${trekId}/approval`
      });
      
      if (response.data?.status === "success") {
        toast.success("Trek approved successfully!");
        setShowModal(false);
        setTreks(prev =>
          prev.map(trek =>
            trek._id === trekId 
              ? { ...trek, approval: "approved", amount: numAmount }
              : trek
          )
        );
      }
    } catch (error) {
      console.error("Error approving trek:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      toast.error(error.response?.data?.message || "Failed to approve trek");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (trekId) => {
    try {
      setIsLoading(true);
      
      const response = await api.request({
        ...getRequestConfig('PATCH', { approval: "cancelled" }),
        url: `/api/customeTrek/${trekId}/approval`
      });
      
      if (response.data?.status === "success") {
        toast.success("Trek cancelled successfully!");
        setShowModal(false);
        setTreks(prev =>
          prev.map(trek =>
            trek._id === trekId ? { ...trek, approval: "cancelled" } : trek
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling trek:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      toast.error(error.response?.data?.message || "Failed to cancel trek");
    } finally {
      setIsLoading(false);
    }
  };

  const renderModalButtons = (trek) => {
    const buttonClasses = {
      approve: "w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
      cancel: "w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed",
      close: "w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
    };

    const buttons = {
      waiting: (
        <>
          <button
            className={buttonClasses.approve}
            onClick={() => handleApprove(trek._id)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve"}
          </button>
          <button
            className={buttonClasses.cancel}
            onClick={() => handleCancel(trek._id)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Cancel Trip"}
          </button>
        </>
      ),
      approved: (
        <button
          className={buttonClasses.cancel}
          onClick={() => handleCancel(trek._id)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Cancel Trip"}
        </button>
      ),
      cancelled: (
        <button
          className={buttonClasses.approve}
          onClick={() => handleApprove(trek._id)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Approve"}
        </button>
      )
    };

    return (
      <>
        {buttons[trek.approval]}
        <button
          className={buttonClasses.close}
          onClick={() => setShowModal(false)}
          disabled={isLoading}
        >
          Close
        </button>
      </>
    );
  };

  return (
    <div className="p-6 z-[9999999] relative">
      <h2 className="text-2xl font-bold mb-4">Custom Treks</h2>
      
      {isLoading && !treks.length ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {treks.map((trek) => (
            <div
              key={trek._id}
              className="border p-4 rounded-[10px] hover:bg-zinc-100 transition-all cursor-pointer"
              onClick={() => {
                setSelectedTrek(trek);
                setShowModal(true);
                setAmount(trek.amount?.toString() || "");
              }}
            >
              <h3 className="text-xl capitalize font-semibold">
                {trek?.location || "N/A"}
              </h3>
              <p className="text-gray-600">User: {trek?.userId?.name || "N/A"}</p>
              <p className="text-gray-600">Email: {trek?.userId?.email || "N/A"}</p>
              <p className="text-gray-600">Guests: {trek?.guests || 0}</p>
              <p className="text-gray-600">Amount: ${trek?.amount || 0}</p>
              <p className={`text-sm ${
                trek?.approval === "approved"
                  ? "text-green-500"
                  : trek?.approval === "cancelled"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}>
                Status: {trek?.approval || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedTrek && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white m-2 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Trek Details</h2>
            
            <div className="space-y-2">
              <p className="flex justify-between items-center">
                <strong>Location:</strong> 
                <span className="capitalize">{selectedTrek?.location || "N/A"}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong>Check-In:</strong>
                <span>{selectedTrek?.checkIn ? new Date(selectedTrek.checkIn).toLocaleDateString() : "N/A"}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong>Check-Out:</strong>
                <span>{selectedTrek?.checkOut ? new Date(selectedTrek.checkOut).toLocaleDateString() : "N/A"}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong>Current Amount:</strong>
                <span>${selectedTrek?.amount || 0}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong>Guests:</strong>
                <span>{selectedTrek?.guests || 0}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong>Status:</strong>
                <span className="capitalize">{selectedTrek?.approval || "N/A"}</span>
              </p>
            </div>

            {(selectedTrek.approval === "waiting" || selectedTrek.approval === "cancelled") && (
              <label className="block mt-4">
                <span className="text-gray-700">Set Amount</span>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={amount}
                  placeholder="Enter amount..."
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </label>
            )}
            
            <div className="mt-4 space-y-2">
              {renderModalButtons(selectedTrek)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTrek;