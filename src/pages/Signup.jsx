import React, { useState, useEffect, useRef, useContext } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import lock from "../assets/Lock.png";
import mail from "../assets/Mail.png";
import logo from "../assets/logo.png";
import { CgProfile } from "react-icons/cg";
import { UserContext } from "../context/UserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";

const Signup = () => {
  const { saveUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [tempUser, setTempUser] = useState("");
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const {api} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!email || !password || !username || password !== confirmPassword) {
        toast.error("Please fill out all fields correctly.");
        return;
      }
  
      const response = await api.post(
        `/api/auth/signup`,
        {
          name: username,
          email,
          password,
          confirmPassword,
          role: "user",
        }
      );
  
      if (response.data?.status === 'success') {
        setTempUser(response.data.tempUserId);
        setShowOTP(true);
        toast.success("Please check your email for the OTP.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };
  


  // console.log(user);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };
  const handleOtpPaste = (e) => {
    const pastedOtp = e.clipboardData.getData('Text').slice(0, 6).split('');
    setOtp(pastedOtp);
  };
  

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    
    try {
      if (otpCode.length !== 6) {
        toast.error("Please enter a complete OTP");
        return;
      }
  
      const response = await api.post(
        `/api/auth/verify-otp`,
        {
          otp: otpCode,
          tempUserId: tempUser,
        }
      );
  
      if (response.data?.status === 'success') {
        toast.success("Account verified! Please login to continue.");
        navigate("/dashboard");
        // navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowOTP(false);
      toast.warning("OTP has expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [timer, showOTP]);

 

  const handleGoogleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <>
      {/* Signup Form */}
      <div className="flex flex-col lg:flex-row h-screen w-screen overflow-x-hidden lg:overflow-hidden">
        {/* Left Section (Logo) */}
        {/* <div className="h-2/3 relative lg:h-full lg:w-1/3"> */}
        <div className="h-2/3 relative lg:h-full lg:w-1/3 flex items-center justify-center p-10 lg:p-20 bg-gradient-to-tr from-[#3d5c89] via-[#98d2ec] to-white">
          <a
            href="/"
            className="w-1/2 lg:w-full flex items-center justify-center"
          >
            <img src={logo} alt="logo" className="w-full" />
          </a>
        </div>
        {/* </div> */}

        {/* Right Section (Signup Form) */}
        <div className="w-full lg:w-2/3 flex h-full p-6 md:p-16 lg:p-32 items-center justify-center bg-white">
          <div className="flex flex-col items-start justify-center gap-4 w-full max-w-md md:max-w-lg p-6 md:p-10 lg:p-12 rounded-lg ">
            <h1 className="text-[30px] md:text-[35px] lg:text-[40px] font-semibold popp">
              Let's get started...!
            </h1>
            <h2 className="text-[16px] md:text-[18px] lg:text-[20px] popp">
              Create your account
            </h2>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              {/* Username Input */}
              <div className="flex items-center justify-center border border-[#D0D5DD] rounded-[10px] px-4 relative w-full">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <CgProfile className="w-full text-xl" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-3 rounded-md focus:outline-none popp"
                />
              </div>

              {/* Email Input */}
              <div className="flex items-center justify-center border border-[#D0D5DD] rounded-[10px] px-4 relative w-full">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <img src={mail} alt="mail" className="w-full top-3 left-3" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@internetcompany.one"
                  className="w-full p-3 rounded-md focus:outline-none popp"
                />
              </div>

              {/* Password Input */}
              <div className="relative w-full flex items-center border border-[#D0D5DD] justify-center rounded-[10px] px-4">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <img src={lock} alt="lock" className="w-full top-3 left-3" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={showPassword ? "Password" : "********"}
                  className="w-full p-3 rounded-md focus:outline-none popp"
                />
                <div
                  className="w-[20px] flex cursor-pointer items-center justify-center h-full"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <IoEyeOff className="w-full" />
                  ) : (
                    <IoEye className="w-full" />
                  )}
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="relative w-full flex items-center border border-[#D0D5DD] justify-center rounded-[10px] px-4">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <img src={lock} alt="lock" className="w-full top-3 left-3" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={
                    showConfirmPassword ? "Confirm Password" : "********"
                  }
                  className="w-full p-3 rounded-md focus:outline-none popp"
                />
                <div
                  className="w-[20px] flex cursor-pointer items-center justify-center h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IoEyeOff className="w-full" />
                  ) : (
                    <IoEye className="w-full" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#4997D3] text-white p-3 rounded-[10px] hover:bg-[#43a3ec] transition duration-200"
              >
                Continue
              </button>
              </form>

              <div className="flex flex-col w-full gap-4 items-center">
                <button className="w-full p-3 text-[#565E6D] border border-[#565E6D] rounded-[10px] flex items-center justify-center gap-2 popp">
                  <FaFacebookF className="text-[#565E6D]" /> Login with Facebook
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full p-3 text-[#565E6D] border border-[#565E6D] rounded-[10px] flex items-center justify-center gap-2 popp"
                >
                  <FaGoogle /> Login with Google
                </button>
              </div>

              <p className="w-full text-center text-sm mt-4 popp">
                By continuing, you agree to our{" "}
                <a href="#" className="text-[#171A1F] font-semibold popp">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#171A1F] font-semibold popp">
                  Privacy Policy
                </a>
                .
              </p>

              <span className="w-full text-center mt-2 popp">
                Already have an account?{" "}
                <a href="/login" className="text-[#4997D3] font-semibold popp">
                  Login
                </a>
              </span>
          </div>
        </div>
      </div>

      {/* OTP Section */}
      {showOTP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 flex flex-col items-center gap-1 px-8 rounded-[20px] py-10 w-[90%] md:w-1/2 lg:w-1/3">
            <h2 className="xl:text-[32px] text-xl font-semibold text-center popp">
              Almost done..!
            </h2>
            <p className="text-sm text-center text-gray-500 py-2 popp">
              Please type the code we sent you in your email
            </p>
            <div className="flex justify-center gap-2 my-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpBackspace(e, index)}
                  onPaste={() => handleOtpPaste(e)}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-10 h-10 lg:w-14 lg:h-14 border border-gray-300 text-center rounded-md focus:outline-none popp"
                />
              ))}
            </div>
            <div className="px-6 w-full">
              <button
                onClick={handleOtpSubmit}
                className="w-full p-3 bg-[#4997D3] rounded-[10px] text-white hover:bg-[#3a7fbf] transition-all popp"
              >
                Continue
              </button>
            </div>
            <div className="text-center popp flex flex-col ">
              <span className="text-sm text-red-500 popp">
                Time remaining: {timer}s
              </span>

              <span className="text-sm cursor-pointer pt-8 popp">
                Can't access to your email?{" "}
                <a
                  href="#"
                  className="text-[#000] cursor-pointer font-semibold popp"
                >
                  Contact support
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
