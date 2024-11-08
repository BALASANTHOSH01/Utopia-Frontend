import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IoPerson } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HoverDropdown from "./HoverDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { user, clearUser } = useContext(UserContext);
  // console.log(user);
  const [treks, setTreks] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("user"))?.user?.role;
  // console.log(role)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    
    setShowDropdown(!showDropdown);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch(
        "https://tic-himalayan-utopia-backend-v1.onrender.com/api/auth/logout",
        {
          method: "POST",
        }
      );
      toast.success("Logout successful");
      clearUser();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await axios.get(
          "https://tic-himalayan-utopia-backend-v1.onrender.com/api/treks/getall"
        );
        setTreks(response.data.data.treks);
        // console.log(treks);
      } catch (error) {
        console.error("Error fetching treks:", error);
      }
    };
    fetchTreks();
  }, []);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleDestinationChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    debounce(() => {
      const filtered = treks.filter((trek) =>
        trek?.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinations(filtered.map((trek) => trek?.name));
    }, 500)();
  };

  const handleClick = (e) => {
    // e.preventDefault();

    const destination = searchTerm;
    const queryParams = new URLSearchParams({
      destination,
    }).toString();

    navigate(`/packages?${queryParams}`);
    setSearchTerm("");
  };

  return (
    <>
      <div className="w-full flex items-center justify-between bg-black/20 z-[999] fixed top-0 left-0 px-5 lg:px-20 py-2 backdrop-blur">
        <a href="/" className="logo">
          <img src={logo} alt="logo" className="w-14 lg:w-16" />
        </a>

        <div className="hidden lg:flex gap-5 text-white items-center">
          <a
            href="/"
            className={`text-md popp rounded-xl transition-all py-1.5 px-4 ${
              isActive("/") ? "text-black" : "hover:text-black"
            }`}
          >
            Home
          </a>
          <a
            href="/packages"
            className={`text-md popp rounded-xl transition-all py-1.5 px-4 ${
              isActive("/packages") ? "text-black" : "hover:text-black"
            }`}
          >
            Packages
          </a>
          <a
            href="/blogs"
            className={`text-md popp rounded-xl transition-all py-1.5 px-4 ${
              isActive("/blogs") ? "text-black" : "hover:text-black"
            }`}
          >
            Blogs
          </a> 
          <a
            href="/custom-trek"
            className={`text-md popp whitespace-nowrap rounded-xl transition-all py-1.5 px-4 ${
              isActive("/custom-trek") ? "text-black" : "hover:text-black"
            }`}
          >
            Custom Trek
          </a> 

          <div className="relative flex items-center w-full justify-center rounded-[15px] px-2 py-1 gap-1 border border-white/40">
            <CiSearch className="text-xl" />
            <input
              type="text"
              placeholder="Search here.."
              value={searchTerm}
              onChange={handleDestinationChange}
              className="popp focus:outline-none w-[250px] placeholder:text-white font-light text-md text-white bg-transparent px-2"
            />
            <ul className="absolute w-full top-8 left-0 mt-2 bg-white/80 backdrop-blur-sm text-black rounded-[10px] overflow-y-auto max-h-40">
              {searchTerm.length > 0 &&
                filteredDestinations.map((dest, index) => (
                  <li
                    key={index}
                    className="cursor-pointer border px-4 py-2 hover:bg-gray-200"
                    onClick={() => {
                      // setFilteredDestinations([]);
                      handleClick();
                    }}
                  >
                    {dest}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="hidden lg:flex items-center relative">
          {/*  */}
          <HoverDropdown />
        </div>

        <div className="lg:hidden flex items-center">
          <a
            href={
              user ? (role === "admin" ? "/admin" : "/dashboard") : "/signup"
            }
          >
            <IoPerson className="text-white text-2xl mr-4" />
          </a>
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaTimes className="text-white text-2xl" />
            ) : (
              <FaBars className="text-white text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden z-[100] fixed top-0 left-0 w-full h-screen bg-black/90 text-white transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex relative flex-col items-center justify-center h-full gap-8">
          <button onClick={toggleMenu} className="absolute top-10 right-10">
            <FaTimes className="text-white text-2xl" />
          </button>
          <a
            href="/"
            onClick={toggleMenu}
            className={`text-lg popp transition-all py-2 px-6 rounded-lg ${
              isActive("/") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Home
          </a>
          <a
            href="/packages"
            onClick={toggleMenu}
            className={`text-lg popp transition-all py-2 px-6 rounded-lg ${
              isActive("/packages") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Packages
          </a>
          <a
            href="/blogs"
            onClick={toggleMenu}
            className={`text-lg popp transition-all py-2 px-6 rounded-lg ${
              isActive("/blogs") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Blogs
          </a> 
          <a
            href="/custom-trek"
            onClick={toggleMenu}
            className={`text-lg popp transition-all whitespace-nowrap py-2 px-6 rounded-lg ${
              isActive("/custom-trek") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Custom Trek
          </a> 
          <div className="relative flex items-center w-3/4 justify-start rounded-[15px] px-2 py-2 gap-1 border border-white/40">
            <CiSearch className="text-xl" />
            <input
              type="text"
              placeholder="Search here.."
              value={searchTerm}
              onChange={handleDestinationChange}
              className="popp focus:outline-none w-[250px] placeholder:text-white font-light text-md text-white bg-transparent px-2"
            />
            <ul className="absolute w-full top-8 left-0 mt-2 bg-white/80 backdrop-blur-sm text-black rounded-[10px] overflow-y-auto max-h-40">
              {filteredDestinations.map((dest, index) => (
                <li
                  key={index}
                  className="cursor-pointer border px-4 py-2 hover:bg-gray-200"
                  onClick={() => {
                    // setFilteredDestinations([]);
                    handleClick();
                  }}
                >
                  {dest}
                </li>
              ))}
            </ul>
          </div>
          {user && (
            <div className="flex w-3/4 justify-center items-center gap-5 ">
              <button className="flex items-center border px-5 py-2 gap-3 text-white rounded-xl"
                onClick={() => (window.location.href = role === "admin" ? "/admin" : "/dashboard")}
              >
                Dashboard
              </button>
              <button
                className="flex items-center gap-3 border px-5 py-2 text-white rounded-xl"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
