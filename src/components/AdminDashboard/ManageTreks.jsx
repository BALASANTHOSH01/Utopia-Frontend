import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../services/useAuth";
import { toast } from "sonner";
import EditTrek from "./EditTrek";

const ManageTreks = () => {
  const [treks, setTreks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTrekId, setDeleteTrekId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editTrekId, setEditTrekId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const {api} = useAuth();

  if(showEditModal){
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "auto";
  }

  useEffect(() => {
    const fetchTreks = async () => {
      try {
    
        const response = await api.get("/api/treks/getall");
        setTreks(response.data.data.treks);
        console.log("Treks fetched:", response.data.data);
      } catch (error) {
        toast.error("Failed to fetch treks.");
        console.error("Error fetching treks:", error);
      }
    };
    fetchTreks();
  }, []);

  const handleDelete = async (trekId) => {
    try {
      

      await api.delete(
        `http://localhost:5000/api/treks/${trekId}`
      );
      setTreks((prevTreks) => prevTreks.filter((trek) => trek._id !== trekId));
      toast.success("Trek deleted successfully.");
      setShowModal(false); // Close modal after deletion
    } catch (error) {
      toast.error("Failed to delete trek.");
      console.error("Error deleting trek:", error);
    }
  };

  const openDeleteModal = (trekId) => {
    setDeleteTrekId(trekId);
    setShowModal(true);
  };

  const openEditModal = (trekId) => { 
    // setDeleteTrekId(trekId);
    setEditTrekId(trekId);
    setShowEditModal(true);
  };

  const filteredTreks = treks?.filter((trek) =>
    trek.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto md:px-[50px] lg:p-4">
      <div className="w-full flex-col md:flex-row flex items-center justify-between mb-4">
        <h1 className="w-full text-center md:text-start text-2xl font-semibold mb-4">Manage Treks</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search treks..."
          className="w-full md:w-3/5 p-2 mb-4 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Treks List */}
      <div className="bg-white flex flex-col gap-4 rounded-lg overflow-hidden">
        {filteredTreks.map((trek) => (
          <div
            key={trek._id}
            className="flex flex-col hover:bg-zinc-100/80 transition-all cursor-pointer md:flex-row justify-between p-4 border-b"
          >
            <img
              src={trek?.bannerImage}
              alt={trek.name}
              className="w-full lw-32 h-40 md:w-48 md:h-48 object-cover rounded-[10px] mb-4 md:mb-0 md:mr-4"
            />
            <div className="flex flex-col w-full justify-between md:h-48">
              <div className="flex-1 w-4/5">
                <h2 className="text-lg capitalize font-semibold">
                  {trek?.name}
                </h2>
                <p className="text-gray-600">{trek?.description}</p>
              </div>
              <div className="mt-4 md:mt-8 flex space-x-2">
                <button
                  onClick={() => navigate(`/package/${trek._id}`)}
                  className="flex items-center px-4 py-2 bg-[#4997D3] text-white rounded-lg hover:bg-blue-600 transition"
                >
                  View
                </button>
                <button
                  // onClick={() => navigate(`/package/edit/${trek._id}`)}
                  onClick={() => openEditModal(trek._id)}
                  className="flex items-center px-4 py-2 bg-[#2e8dd6] text-white rounded-[10px] hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(trek._id)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-[10px] hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTreks.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No treks found.</p>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-6 w-11/12 sm:w-8/12 lg:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this trek?</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleDelete(deleteTrekId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{/* Edit Model */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white flex flex-col rounded-[10px] no-scrollbar p-6 w-11/12 sm:w-10/12 lg:w-1/2 h-3/4 overflow-scroll">
            <EditTrek id={editTrekId} setShowEditModal={setShowEditModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTreks;
