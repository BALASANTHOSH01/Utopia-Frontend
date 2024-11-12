import React, { useState } from "react";
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
import useAuth from "../../services/useAuth";

const AddTrek = () => {
  const imagekit = new ImageKit({
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_ENDPOINT,
    transformationPosition: "path",
    // authenticationEndpoint: "http://localhost:5000/imagekit",
  });
  const nav = useNavigate();
  const {api} = useAuth();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrekDetails({
      ...trekDetails,
      [name]: value,
    });
  };

  const handleIncrement = (field) => {
    setTrekDetails({
      ...trekDetails,
      [field]: trekDetails[field] + 1,
    });
  };

  const handleDecrement = (field) => {
    if (trekDetails[field] > 1) {
      setTrekDetails({
        ...trekDetails,
        [field]: trekDetails[field] - 1,
      });
    }
  };

  const handleFeaturesChange = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newFeature = e.target.value.trim();
      if (!trekDetails.features.includes(newFeature)) {
        setTrekDetails((prev) => ({
          ...prev,
          features: [...prev.features, newFeature],
        }));
        e.target.value = ""; // Clear input field
      }
    }
  };

  const removeFeature = (feature) => {
    setTrekDetails({
      ...trekDetails,
      features: trekDetails.features.filter((f) => f !== feature),
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("public_id", `treks/${file.name}`);

      try {
        toast.info(`Uploading ${file.name}...`);

        const response = await imagekit.upload({
          file: file,
          fileName: file.name,
        });

        uploadedImages.push(response.url);
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(`Error uploading ${file.name}: ${error.message}`);
      }
    }

    setTrekDetails((prev) => ({
      ...prev,
      secondaryImages: [...prev.secondaryImages, ...uploadedImages],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/treks/",
        trekDetails
      );
      console.log("Trek added successfully:", response.data);
      setTrekDetails({
        name: "",
        guests: 1,
        noOfDay: 1,
        noOfNight: 1,
        description: "",
        features: [],
        price: 0,
        reviews: 0,
        location: "",
        bannerImage: "",
        secondaryImages: [],
      });
      toast.success("Trek added successfully!");
      nav("/packages");
    } catch (error) {
      console.error("Error adding trek:", error);
      toast.error(`Error adding trek: ${error.message}`);
    }
  };
  console.log(trekDetails);

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      toast.info(`Uploading banner image ${file.name}...`);

      const response = await imagekit.upload({
        file: file,
        fileName: file.name,
      });

      setTrekDetails((prev) => ({
        ...prev,
        bannerImage: response.url,
      }));

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error(`Error uploading banner image: ${error.message}`);
    }
  };

  const handleImageRemove = (index) => {
    const updatedImages = trekDetails.secondaryImages.filter(
      (_, i) => i !== index
    );
    setTrekDetails((prev) => ({
      ...prev,
      secondaryImages: updatedImages,
    }));
  };

  return (
    <div className="w-full md:px-[50px] lg:p-4 mx-auto max-w-5xl bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-5">Add New Trek</h2>
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
        <SelectLoation trekDetails={trekDetails} setTrekDetails={setTrekDetails}/>
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
            <div className="flex flex-col gap-4 md:flex-row items-center justify-center border border-gray-300 rounded-[10px] p-3 bg-gray-50 hover:bg-gray-100 transition duration-200">
              <div className="flex items-center">

              <HiUpload className="text-gray-500 mr-2 inline" />
              <span className=" text-gray-700">Select a Banner Image</span>
              </div>
              <div className=" block">Maximum image size is 5MB</div>
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
          Add Trek
        </button>
      </div>
    </div>
  );
};

export default AddTrek;
