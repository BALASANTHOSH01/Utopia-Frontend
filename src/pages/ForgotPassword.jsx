import React, { useState, useEffect, useRef } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import lock from "../assets/Lock.png";
import mail from "../assets/Mail.png";
import logo from "../assets/logo.png";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";

const ForgotPassword = () => {
  const { api } = useAuth(); // Use the authenticated API instance
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [resetToken,setRestToken] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await api.post('/api/auth/forgotPassword', {
        email: email,
      });

      if (response.status === 200) {
        setShowOTP(true);
        toast.success(
          response.data.message || "An email has been sent to you with the OTP."
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Network error. Please try again.");
    }
  };

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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (!password || password !== confirmPassword) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await api.post('/api/auth/resetPassword', {
        otp: otpCode,
        resetToken:resetToken,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Password reset successful.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed.");
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

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-x-hidden lg:overflow-hidden">
      {/* Left Section (Logo) */}
      <div className="h-2/3 lg:h-full lg:w-1/3 flex items-center justify-center p-10 lg:p-20 bg-gradient-to-tr from-[#3d5c89] via-[#98d2ec] to-white">
        <a
          href="/"
          className="w-1/2 lg:w-full flex items-center justify-center"
        >
          <img src={logo} alt="logo" className="w-full" />
        </a>
      </div>

      <div className="w-full lg:w-2/3 flex h-full p-6 md:p-16 lg:p-32 items-center justify-center bg-white">
        <div className="flex flex-col items-start justify-center gap-4 w-full max-w-md md:max-w-lg p-6 md:p-10 lg:p-12 rounded-lg">
          <h1 className="text-[30px] md:text-[35px] lg:text-[35px] font-semibold popp">
            Reset your password...!
          </h1>

          {!showOTP ? (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <h2 className="text-[16px] md:text-[16px] lg:text-[16px] popp">
                Enter your email to reset your password
              </h2>

              <div className="flex items-center justify-center border border-[#D0D5DD] rounded-[10px] px-4 relative w-full">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <img
                    src={mail}
                    alt="mail"
                    className="w-full top-3 left-3"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@internetcompany.one"
                  className="w-full p-3 rounded-md focus:outline-none popp"
                />
              </div>

              <button
                type="submit"
                className="bg-[#4997d3] text-white p-3 rounded-[10px] hover:bg-[#48a5eb] transition duration-200"
              >
                Continue
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleOtpSubmit}
              className="w-full flex flex-col gap-4"
            >
              <h2 className="text-[16px] md:text-[16px] lg:text-[16px] popp">
                Please type the code we sent you in your email
              </h2>
              <div className="flex justify-center gap-2 w-full my-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpBackspace(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-full h-10 lg:w-full lg:h-14 border border-gray-300 text-center rounded-md focus:ring-2 focus:ring-[#4997d3] focus:outline-none popp"
                  />
                ))}
              </div>

              {/* resettoken */}
              <div>
                <input
                value={resetToken}
                type="text"
                onChange={(e)=>setRestToken(e.target.value)}
                placeholder="Enter te reset token "
                className="w-full p-4 rounded-[10px] focus:outline-none border popp"
                />
              </div>

              {/* Password Input */}
              <div className="relative w-full flex items-center border border-[#D0D5DD] justify-center rounded-[10px] px-4">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <img
                    src={lock}
                    alt="lock"
                    className="w-full top-3 left-3"
                  />
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

              <div className="relative w-full flex items-center border border-[#D0D5DD] justify-center rounded-[10px] px-4">
                <div className="w-[20px] flex items-center justify-center h-full">
                  <img
                    src={lock}
                    alt="lock"
                    className="w-full top-3 left-3"
                  />
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

              <div className="w-full">
                <button
                  type="submit"
                  className="w-full p-3 bg-[#4997D3] rounded-[10px] text-white hover:bg-[#3a7fbf] transition-all popp"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

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
  );
};

export default ForgotPassword;