import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IoPerson } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import HoverDropdown from "./HoverDropdown";
import useAuth from "../../services/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('user'));
  const {  logout, isAuthenticated } = useAuth();
  
  const [treks, setTreks] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Safely access user role
  const role = user?.role || 'user';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}/api/treks/getall`
        );
        setTreks(response.data.data.treks);
      } catch (error) {
        console.error("Error fetching treks:", error);
        setTreks([]); // Set empty array on error
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
        trek?.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinations(filtered.map((trek) => trek?.name).filter(Boolean));
    }, 500)();
  };

  const handleClick = () => {
    const queryParams = new URLSearchParams({
      destination: searchTerm,
    }).toString();

    navigate(`/packages?${queryParams}`);
    setSearchTerm("");
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return "/login";
    return role === "admin" ? "/admin" : "/dashboard";
  };

  // Mobile menu user display
  const getMobileUserDisplay = () => {
    if (!isAuthenticated) {
      return <IoPerson className="text-white text-2xl mr-4" />;
    }
    return (
      <div className="flex items-center text-white">
        <IoPerson className="text-2xl mr-2" />
        <span className="mr-4">{user?.name || 'User'}</span>
      </div>
    );
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
            {searchTerm.length > 0 && filteredDestinations.length > 0 && (
              <ul className="absolute w-full top-8 left-0 mt-2 bg-white/80 backdrop-blur-sm text-black rounded-[10px] overflow-y-auto max-h-40">
                {filteredDestinations.map((dest, index) => (
                  <li
                    key={index}
                    className="cursor-pointer border px-4 py-2 hover:bg-gray-200"
                    onClick={handleClick}
                  >
                    {dest}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center relative">
          <HoverDropdown />
          {/* <span className="mr-4 text-white">{user?.name || 'User'}</span> */}
        </div>

        <div className="lg:hidden flex items-center">
          <a href={getDashboardLink()}>
            {getMobileUserDisplay()}
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
          {/* Navigation Links */}
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
              isActive("/") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Packages
          </a>

          <a
            href="/blogs"
            onClick={toggleMenu}
            className={`text-lg popp transition-all py-2 px-6 rounded-lg ${
              isActive("/") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Blogs
          </a>

          <a
            href="/custom-trek"
            onClick={toggleMenu}
            className={`text-lg popp transition-all py-2 px-6 rounded-lg ${
              isActive("/") ? "text-[#51acf2]" : "hover:text-[#51acf2]"
            }`}
          >
            Custom Trek
          </a>
          
          
          {/* Search Bar */}
          <div className="relative flex items-center w-3/4 justify-start rounded-[15px] px-2 py-2 gap-1 border border-white/40">
            <CiSearch className="text-xl" />
            <input
              type="text"
              placeholder="Search here.."
              value={searchTerm}
              onChange={handleDestinationChange}
              className="popp focus:outline-none w-[250px] placeholder:text-white font-light text-md text-white bg-transparent px-2"
            />
            {searchTerm.length > 0 && filteredDestinations.length > 0 && (
              <ul className="absolute w-full top-8 left-0 mt-2 bg-white/80 backdrop-blur-sm text-black rounded-[10px] overflow-y-auto max-h-40">
                {filteredDestinations.map((dest, index) => (
                  <li
                    key={index}
                    className="cursor-pointer border px-4 py-2 hover:bg-gray-200"
                    onClick={() => {
                      handleClick();
                      toggleMenu();
                    }}
                  >
                    {dest}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Authentication Buttons */}
          {isAuthenticated ? (
            <div className="flex w-3/4 justify-center items-center gap-5">
              <button 
                className="flex items-center border px-5 py-2 gap-3 text-white rounded-xl"
                onClick={() => {
                  navigate(getDashboardLink());
                  toggleMenu();
                }}
              >
                Dashboard
              </button>
              <button
                className="flex items-center gap-3 border px-5 py-2 text-white rounded-xl"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex w-3/4 justify-center items-center gap-5">
              <button 
                className="flex items-center border px-5 py-2 gap-3 text-white rounded-xl"
                onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}
              >
                Login
              </button>
              <button
                className="flex items-center gap-3 border px-5 py-2 text-white rounded-xl"
                onClick={() => {
                  navigate('/signup');
                  toggleMenu();
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;