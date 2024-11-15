import { useState, useEffect } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { FiGrid } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";
import { TbChevronCompactLeft, TbChevronCompactRight } from "react-icons/tb";
import { toast } from "sonner";
import CustomDropdown from "../Common/CustomDropdown";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import MultipleMapLocations from "./MultipleMapLocations";
import useAuth from "../../services/useAuth";

const Packages = () => {
  const location = useLocation();
  const { api } = useAuth();
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [viewType, setViewType] = useState("list");
  const [search, setSearch] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [priceSortOrder, setPriceSortOrder] = useState("");
  const [reviewsSortOrder, setReviewsSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapPackages, setMapPackages] = useState([]);

  // Calculate pagination
  const indexOfLastPackage = currentPage * itemsPerPage;
  const indexOfFirstPackage = indexOfLastPackage - itemsPerPage;
  const currentPackages = filteredPackages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const getParams = (param) => {
    const query = new URLSearchParams(location?.search);
    return query.get(param);
  };

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/treks/getall");

        Object.values(response.data.data.treks[0].coordinates).map((value)=>{
          console.log("values trek data : "+value);
        });
        Object.keys(response.data.data.treks[0].coordinates).map((value)=>{
          console.log("keys trek data : "+value);
        });
        // console.log("getall trek response : "+);
        setPackages(response.data.data.treks);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Error fetching packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [api]);

  // Filter and sort packages
  useEffect(() => {
    let tempPackages = [...packages];

    // Apply URL params filters
    const destination = getParams("destination");
    const min = getParams("min");
    const max = getParams("max");

    if (destination) {
      window.scrollTo(0, 1000);
      tempPackages = tempPackages.filter((p) =>
        p.name.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (min && max) {
      tempPackages = tempPackages.filter((p) => p.price >= min && p.price <= max);
    }

    // Apply search filter
    if (search) {
      tempPackages = tempPackages.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price sorting
    if (priceSortOrder === "low-to-high") {
      tempPackages.sort((a, b) => a.price - b.price);
    } else if (priceSortOrder === "high-to-low") {
      tempPackages.sort((a, b) => b.price - a.price);
    }

    // Apply reviews sorting
    if (reviewsSortOrder === "low-to-high") {
      tempPackages.sort((a, b) => a.reviews - b.reviews);
    } else if (reviewsSortOrder === "high-to-low") {
      tempPackages.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredPackages(tempPackages);

    // Prepare packages for map display
    const mapLocations = tempPackages.map((pkg) => ({
      ...pkg,
      coordinates: {
        latitude: pkg.coordinates?.latitude || 0,
        longitude: pkg.coordinates?.longitude || 0,
      },
    }));

    setMapPackages(mapLocations);

    Object.values(mapPackages).map((value)=>{
      console.log("mapLocation :"+value);
    });

  }, [search, priceSortOrder, reviewsSortOrder, packages, location.search]);

  // Pagination handlers
  const handleNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const handlePrevPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handlePageClick = (page) => setCurrentPage(page);
  const handleChangeView = (type) => setViewType(type);

  // Render package list view
  const renderListView = () => (
    <div className="w-full px-4 lg:px-0">
      {currentPackages.map((pkg) => (
        <a
          key={pkg._id}
          className="py-4 flex items-start space-x-4"
          href={`/package/${pkg._id}`}
        >
          <div className="w-[250px] h-[200px] md:w-[300px] md:h-[200px]">
            <img
              src={pkg.bannerImage}
              alt={pkg.name}
              className="w-full h-[200px] object-cover rounded-[20px]"
            />
          </div>
          <div className="flex items-start flex-col justify-between w-full h-[200px]">
            <div className="flex flex-col">
              <h3 className="popp capitalize text-[14px] md:text-[26px]">
                {pkg.name}
              </h3>
              <p className="popp text-sm md:text-md text-[#4997D3]">
                $ {pkg.price} / night
              </p>
            </div>
            <p className="popp text-xs md:text-sm">{pkg.description}</p>
            <div className="flex flex-col py-1 items-start">
              <p className="popp text-xs md:text-sm">
                {pkg.guests} guests • {pkg.noOfDay} Days
              </p>
              <p className="popp text-xs md:text-sm mt-1">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="mr-2 popp">
                    {index > 0 && "• "} {feature}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  // Render package grid view
  const renderGridView = () => (
    <div className="grid popp grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {currentPackages.map((pkg) => (
        <a
          href={`/package/${pkg._id}`}
          key={pkg._id}
          className="p-4 border hover:shadow transition-all rounded-[10px]"
        >
          <img
            src={pkg.bannerImage}
            alt={pkg.name}
            className="w-full h-40 object-cover rounded-[8px] mb-4"
          />
          <h3 className="text-xl font-semibold capitalize">{pkg.name}</h3>
          <p>Location: {pkg.location}</p>
          <p>Price: ${pkg.price}</p>
          <p>Reviews: {pkg.reviews} ⭐</p>
        </a>
      ))}
    </div>
  );

  // Main render function for packages
  const renderPackages = () => {
    if (loading) {
      return (
        <div className="h-[50vh] flex items-center justify-center w-full">
          <ClipLoader size={50} color="#3498db" loading={loading} />
        </div>
      );
    }

    if (currentPackages.length === 0) {
      return (
        <div className="w-full flex items-center justify-center">
          <h2 className="text-2xl">No packages found</h2>
        </div>
      );
    }

    return viewType === "map" ? null : viewType === "card" ? renderGridView() : renderListView();
  };

  return (
    <div className="w-full flex mt-[150px] mb-[150px] items-center justify-center">
      <div className="w-full md:w-10/12 flex flex-col md:flex-row">
        <div className="w-full md:w-full flex flex-col items-center justify-center xl:px-20 md:p-4">
          {/* Header */}
          <div className="flex items-center w-full flex-col gap-2">
            <div className="flex w-full px-8 py-8 lg:px-0 items-center justify-between">
              <h2 className="text-[18px] osw whitespace-nowrap lg:text-[28px] font-bold lg:mb-4">
                DESTINATIONS ({filteredPackages.length})
              </h2>
              <div className="flex border-b popp border-zinc-200 items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-[16px] focus:outline-none p-2 w-[150px] md:w-[300px] rounded"
                />
                <IoSearchSharp className="text-gray-950 text-xl lg:text-3xl" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex w-full flex-wrap gap-2 justify-center md:justify-between items-center lg:mb-4">
              <div className="flex items-center gap-3">
                <CustomDropdown
                  options={[
                    { value: "", label: "Sort by Price" },
                    { value: "low-to-high", label: "Low to High" },
                    { value: "high-to-low", label: "High to Low" },
                  ]}
                  selectedValue={
                    priceSortOrder === "low-to-high"
                      ? "Low to High"
                      : priceSortOrder === "high-to-low"
                      ? "High to Low"
                      : "Sort by Price"
                  }
                  onChange={setPriceSortOrder}
                />
                <CustomDropdown
                  options={[
                    { value: "", label: "Sort by Reviews" },
                    { value: "low-to-high", label: "Low to High" },
                    { value: "high-to-low", label: "High to Low" },
                  ]}
                  selectedValue={
                    reviewsSortOrder === "low-to-high"
                      ? "Low to High"
                      : reviewsSortOrder === "high-to-low"
                      ? "High to Low"
                      : "Sort by Reviews"
                  }
                  onChange={setReviewsSortOrder}
                />
              </div>

              <div className="flex space-x-2 mb md:mb-0">
                <button
                  onClick={() => handleChangeView("list")}
                  className={`p-2 md:p-3 rounded ${
                    viewType === "list"
                      ? "bg-[#70B3E6] text-white"
                      : "bg-[#F5F5F5]"
                  }`}
                >
                  <MdFormatListBulleted />
                </button>
                <button
                  onClick={() => handleChangeView("card")}
                  className={`p-2 md:p-3 rounded ${
                    viewType === "card"
                      ? "bg-[#70B3E6] text-white"
                      : "bg-[#F5F5F5]"
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => handleChangeView("map")}
                  className={`p-2 md:p-3 rounded ${
                    viewType === "map"
                      ? "bg-[#70B3E6] text-white"
                      : "bg-[#F5F5F5]"
                  }`}
                >
                  <GrMapLocation />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full flex flex-col lg:flex-row gap-20 py-12">
            {/* Main content area - adjusts width based on view type */}
            <div className={`w-full ${viewType === "map" ? "lg:w-1/2" : "lg:w-2/3"}`}>
              {renderPackages()}
              {/* Pagination - only show when not in map view */}
              {viewType !== "map" && currentPackages.length > 0 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handlePrevPage}
                    className="p-2 text-2xl rounded"
                  >
                    <TbChevronCompactLeft />
                  </button>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageClick(i + 1)}
                        className={`p-2 ${
                          currentPage === i + 1
                            ? "text-black font-semibold text-2xl"
                            : "text-gray-400 text-2xl"
                        }`}
                      >
                        0{i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextPage}
                    className="p-2 text-2xl rounded"
                  >
                    <TbChevronCompactRight />
                  </button>
                </div>
              )}
            </div>

            {/* Map Section - always render but control visibility */}
            <div
              className={`w-full ${
                viewType === "map" ? "lg:w-1/2" : "lg:w-1/3"
              } h-[600px] ${viewType === "map" ? "block" : "hidden lg:block"}`}
            >
              <MultipleMapLocations locations={mapPackages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;