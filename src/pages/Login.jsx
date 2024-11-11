import { useState, useEffect } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import lock from "../assets/Lock.png";
import mail from "../assets/Mail.png";
import logo from "../assets/logo.png";
import { Toaster, toast } from "sonner";
import useAuth from "../services/useAuth.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {api} = useAuth();

  // Handle Google OAuth redirect
  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");
      const userData = queryParams.get("user");

      if (token && userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem("accessToken", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Clear URL parameters
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          toast.success("Login successful! Redirecting...");
          navigate("/");
        } catch (error) {
          console.error("OAuth callback error:", error);
          toast.error("Failed to process login");
        }
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please fill out all fields");
        return;
      }

      const response = await api.post(
        `/api/auth/login`,
        { email, password },
        { withCredentials: true }
      ); 

      if (response.data?.status === "success") {
        // Store user as JSON string in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // const authHeader = response.headers.get("Authorization");
        // if (authHeader && authHeader.startsWith("Bearer ")) {
        //   const accessToken = authHeader.split(" ")[1]; 
        //   localStorage.setItem("accessToken", accessToken);
        // }
        
        // const acesst = localStorage.getItem("accessToken");
        // console.log("accesstoken : " + acesst);
        
        // Object.values(response.data.user).map((data) => {
        //   console.log("data : " + data);
        // });

        console.log("userName : " + response.data.user.name);

        toast.success("Login successful! Redirecting...");
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    try {
      window.location.href = import.meta.env.VITE_API_URL;
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to initiate Google login");
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      <div className="flex flex-col lg:flex-row h-screen w-screen overflow-x-hidden lg:overflow-hidden">
        <div className="h-2/3 lg:h-full lg:w-1/3 flex items-center justify-center p-10 lg:p-20 bg-gradient-to-tr from-[#3d5c89] via-[#98d2ec] to-white">
          <a
            href="/"
            className="w-1/2 lg:w-full flex items-center justify-center"
          >
            <img src={logo} alt="logo" className="w-full" />
          </a>
        </div>

        <div className="w-full lg:w-2/3 flex h-full p-6 md:p-16 lg:p-32 items-center justify-center">
          <div className="flex flex-col items-start justify-center gap-4 w-full max-w-md md:max-w-lg p-6 md:p-10 lg:p-12 bg-white rounded-lg ">
            <h1 className="text-[30px] md:text-[35px] lg:text-[40px] font-semibold popp">
              Welcome back...!
            </h1>
            <h2 className="text-[16px] md:text-[18px] lg:text-[20px] popp">
              Sign in to your account
            </h2>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-3 bg-[#4997D3] rounded-[10px] text-white hover:bg-[#3a7fbf] transition-all popp"
              >
                Continue
              </button>
            </form>

            <span className="w-full text-center font-bold popp">or</span>

            {/* Social Login */}
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
            <a
              href="/forgot-password"
              className="w-full text-center hover:underline transition-all text-[#4997D3]"
            >
              Forgot Password?
            </a>
            <span className="w-full text-center mt-2 popp">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#4997D3] font-semibold popp">
                Signup
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
