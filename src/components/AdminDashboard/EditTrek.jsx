import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoAdd, IoRemove } from "react-icons/io5";
import InputField from "../Common/InputField";
import { LuPencil } from "react-icons/lu";
import { LuIndianRupee } from "react-icons/lu";
import { FaRegComments } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import ImageKit from "imagekit";
import { toast } from "sonner";
import { HiUpload } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import SelectLoation from "./SelectLocation";
import { useParams } from "react-router-dom";
import { FaLongArrowAltUp as ArrowIcon } from "react-icons/fa";

const EditTrek = ({ id, setShowEditModal }) => {

  // document.body.style.overflowY = "hidden";
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // Initialize ImageKit with error handling
  const initializeImageKit = () => {
    try {
      return new ImageKit({
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
        privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: import.meta.env.VITE_IMAGEKIT_ENDPOINT,
        transformationPosition: "path",
        authenticationEndpoint: "http://localhost:5000/imagekit",
      });
    } catch (error) {
      console.error("Error initializing ImageKit:", error);
      toast.error("Error initializing image upload service");
      return null;
    }
  };

  const imagekit = initializeImageKit();

  const [trekDetails, setTrekDetails] = useState({
    name: "",
    guests: 1,
    noOfDay: 1,
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    noOfNight: 1,
    description: "",
    features: [],
    price: 0,
    reviews: 0,
    location: "",
    bannerImage: "",
    secondaryImages: [],
  });

  // Fetch trek data
  useEffect(() => {
    const fetchTrekData = async () => {
      if (!id) {
        toast.error("Trek ID is missing");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/treks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "refresh-token": refreshToken,
            },
          }
        );

        const trekData = response.data?.data?.trek;
        if (!trekData) throw new Error("Trek data not found");

        setTrekDetails({
          name: trekData.name || "",
          guests: trekData.guests || 1,
          noOfDay: trekData.noOfDay || 1,
          noOfNight: trekData.noOfNight || 1,
          description: trekData.description || "",
          features: trekData.features || [],
          price: trekData.price || 0,
          reviews: trekData.reviews || 0,
          location: trekData.location || "",
          coordinates: trekData.coordinates || { latitude: 0, longitude: 0 },
          bannerImage: trekData.bannerImage || "",
          secondaryImages: trekData.secondaryImages || [],
        });
      } catch (error) {
        console.error("Error fetching trek data:", error);
        toast.error(
          error.response?.data?.message || "Error fetching trek data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrekData();
  }, [id, token, refreshToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrekDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncrement = (field) => {
    setTrekDetails((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const handleDecrement = (field) => {
    setTrekDetails((prev) => ({
      ...prev,
      [field]: prev[field] > 1 ? prev[field] - 1 : 1,
    }));
  };

  const handleFeaturesChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newFeature = e.target.value.trim();
      setTrekDetails((prev) => ({
        ...prev,
        features: prev.features.includes(newFeature)
          ? prev.features
          : [...prev.features, newFeature],
      }));
      e.target.value = "";
    }
  };

  const removeFeature = (feature) => {
    setTrekDetails((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleImageUpload = async (e) => {
    if (!imagekit) {
      toast.error("Image upload service not available");
      return;
    }

    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        continue;
      }

      try {
        toast.info(`Uploading ${file.name}...`);
        const response = await imagekit.upload({
          file: file,
          fileName: `trek-${Date.now()}-${file.name}`,
          folder: "/treks/secondary",
        });

        setTrekDetails((prev) => ({
          ...prev,
          secondaryImages: [...prev.secondaryImages, response.url],
        }));
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(`Error uploading ${file.name}: ${error.message}`);
      }
    }
  };

  const handleBannerImageUpload = async (e) => {
    if (!imagekit) {
      toast.error("Image upload service not available");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Banner image exceeds 5MB size limit");
      return;
    }

    try {
      toast.info(`Uploading banner image...`);
      const response = await imagekit.upload({
        file: file,
        fileName: `trek-banner-${Date.now()}-${file.name}`,
        folder: "/treks/banners",
      });

      setTrekDetails((prev) => ({
        ...prev,
        bannerImage: response.url,
      }));
      toast.success("Banner image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error(`Error uploading banner image: ${error.message}`);
    }
  };

  const handleImageRemove = (index) => {
    setTrekDetails((prev) => ({
      ...prev,
      secondaryImages: prev.secondaryImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !refreshToken) {
      toast.error("Authentication required");
      nav("/login");
      return;
    }

    // Validate required fields
    const requiredFields = ["name", "description", "location", "price"];
    const missingFields = requiredFields.filter((field) => !trekDetails[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);

    try {
      // Create a clean payload with only the fields that should be updated
      const updatePayload = {
        name: trekDetails.name,
        guests: parseInt(trekDetails.guests),
        noOfDay: parseInt(trekDetails.noOfDay),
        noOfNight: parseInt(trekDetails.noOfNight),
        description: trekDetails.description,
        features: trekDetails.features,
        price: parseFloat(trekDetails.price),
        reviews: parseInt(trekDetails.reviews),
        location: trekDetails.location,
        coordinates: trekDetails.coordinates,
        bannerImage: trekDetails.bannerImage,
        secondaryImages: trekDetails.secondaryImages,
      };

      Object.values(updatePayload).map((value)=>{
        console.log("updatePayload value: "+value);
      });

      const response = await axios.patch(
        `http://localhost:5000/api/treks/${id}`,
        updatePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "refresh-token": refreshToken,
          },
        }
      );

      if (!response.data) {
        throw new Error("No response received from server");
      }

      toast.success("Trek updated successfully!");
      setShowEditModal(false);
      nav("/admin");
    } catch (error) {
      console.error("Error updating trek:", error);
      const errorMessage =
        error.response?.data?.message || "Error updating trek";

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        nav("/login");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="w-full p-4 text-center">Loading...</div>;
  }

  return (
    <div className="w-full lg:p-4 mx-auto bg-white rounded-lg">

      {/* scroll top */}
      <div className="p-2 rounded-full border border-gray-500">
        <ArrowIcon/>
      </div>

      <h2 className="text-2xl font-semibold mb-5">Edit Trek </h2>
      <div className="space-y-4">
        {/* Trek Name */}
        <InputField
          icon={LuPencil}
          name={"name"}
          type={"text"}
          title={"Trek Name"}
          value={trekDetails.name}
          handleChange={handleChange}
        />

        {/* Number of Guests */}
        <div className="flex flex-wrap gap-5 items-center w-full justify-between">
          <div className="w-1/2">
            <label className="block mb-2">Number of Guests</label>
            <div className="flex w-full items-center">
              <button
                type="button"
                onClick={() => handleDecrement("guests")}
                className="p-1 bg-[#9dc5e3] rounded-full"
              >
                <IoRemove className="text-white text-xl" />
              </button>
              <input
                type="number"
                name="guests"
                value={trekDetails.guests}
                readOnly
                className="mx-2 py-2 text-center border border-gray-300 rounded-[10px]"
              />
              <button
                type="button"
                onClick={() => handleIncrement("guests")}
                className="p-1 bg-[#70B4E8] rounded-full"
              >
                <IoAdd className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Number of Days */}
          <div className="">
            <label className="block mb-2">Number of Days</label>
            <div className="flex w-full items-center">
              <button
                type="button"
                onClick={() => handleDecrement("noOfDay")}
                className="p-1 bg-[#9dc5e3] rounded-full"
              >
                <IoRemove className="text-white text-xl" />
              </button>
              <input
                type="number"
                name="noOfDay"
                value={trekDetails.noOfDay}
                readOnly
                className="mx-2 py-2 text-center border border-gray-300 rounded-[10px]"
              />
              <button
                type="button"
                onClick={() => handleIncrement("noOfDay")}
                className="p-1 bg-[#70B4E8]   rounded-full"
              >
                <IoAdd className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Number of Nights */}
          <div className="">
            <label className="block mb-2">Number of Nights</label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleDecrement("noOfNight")}
                className="p-1 bg-[#9dc5e3] rounded-full"
              >
                <IoRemove className="text-white text-xl" />
              </button>
              <input
                type="number"
                name="noOfNight"
                value={trekDetails.noOfNight}
                readOnly
                className="mx-2 py-2 text-center border border-gray-300 rounded-[10px]"
              />
              <button
                type="button"
                onClick={() => handleIncrement("noOfNight")}
                className="p-1 bg-[#70B4E8] rounded-full"
              >
                <IoAdd className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={trekDetails.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none  focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block mb-1">Features</label>

          <div className="mb-2 flex flex-wrap gap-2">
            {trekDetails.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-zinc-200 rounded-[10px] px-3 py-1.5"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add feature and press Enter"
            onKeyDown={handleFeaturesChange}
            className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none  focus:ring focus:ring-blue-300"
          />
        </div>

        <InputField
          icon={LuIndianRupee}
          name={"price"}
          type={"number"}
          title={"Price"}
          value={trekDetails.price}
          handleChange={handleChange}
        />

        <InputField
          icon={FaRegComments}
          name={"reviews"}
          type={"number"}
          title={"Number of Reviews"}
          value={trekDetails.reviews}
          handleChange={handleChange}
        />
        <InputField
          icon={MdOutlineLocationOn}
          name={"location"}
          type={"text"}
          title={"Location"}
          value={trekDetails.location}
          handleChange={handleChange}
        />
        <SelectLoation
          trekDetails={trekDetails}
          setTrekDetails={setTrekDetails}
        />
        <div className="flex flex-col gap-1">
          <label className="block mb-1">Upload Banner Image</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="flex items-center justify-center border border-gray-300 rounded-[10px] p-3 bg-gray-50 hover:bg-gray-100 transition duration-200">
              <HiUpload className="text-gray-500 mr-2" />
              <span className="text-gray-700">Select a Banner Image</span>
              <div className="block">Maximum image size is 5MB</div>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2 rounded-[10px">
          {trekDetails.bannerImage && (
            <img
              src={trekDetails.bannerImage}
              alt="Banner Image"
              className="w-96 border p-2 object-cover rounded-[10px]"
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block mb-1">Upload Banner Image</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              multiple
            />
            <div className="flex items-center justify-center border border-gray-300 rounded-[10px] p-3 bg-gray-50 hover:bg-gray-100 transition duration-200">
              <HiUpload className="text-gray-500 mr-2 text-2xl" />
              <span className="text-gray-700">
                Select Multiple Secondary Images
              </span>
            </div>
          </div>
        </div>

        {/* Image Preview Section */}
        <div className="mt-4 flex flex-wrap gap-4 ">
          {trekDetails.secondaryImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Uploaded preview ${index + 1}`}
                className="w-56 h-56 border p-2 object-cover rounded-[10px]"
              />
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-[#4997D3] text-white rounded-[10px] hover:bg-[#4fabf1] focus:ring focus:ring-blue-300"
        >
          Update Trek
        </button>
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 w-full bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTrek;
