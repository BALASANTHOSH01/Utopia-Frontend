import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import { IoEye, IoEyeOff } from "react-icons/io5";
import lock from "../../assets/Lock.png";

const PersonalInfo = (props) => {
  const { user } = props;
  const data = user && user.user;
  

  const [userInfo, setUserInfo] = useState({
    name: data?.name,
    email: data?.email,
    gender: "Male",
    phone: "+1234567890",
    dob: "1995-08-15",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    gender: false,
    phone: false,
    dob: false,
  });

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  // const [otp, setOtp] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const [showPassword, setShowPassword] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  useEffect(() => {
    let interval;
    if (otpModalVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowOTP(false);
      toast.warning("OTP has expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [timer, otpModalVisible]);

  const handleEmailUpdate = async () => {
    try {
      const response = await fetch(
        "https://tic-himalayan-utopia-backend-v1.onrender.com/api/auth/updateEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "refresh-token": refreshToken,
          },
          body: JSON.stringify({
            currentEmail: userInfo.email,
            newEmail,
            password,
          }),
        }
      );

      const result = await response.json();
      // console.log(response);
      console.log(result);
      if (response.ok) {
        toast.success("OTP sent to the new email. Please verify.");
        setTempUserId(result?.data?.userId);
        setPasswordModalVisible(false); 
        setOtpModalVisible(true);
        showOTP(true);
      } else {
        toast.error(result.message || "Failed to update email.");
      }
    } catch (error) {
      toast.error("Error updating email.");
    }
  };
  // console.log(tempUserId);


  const handleOtpVerification = async () => {
    console.log(tempUserId);
    const otpCode = otp.join("");
    try {
      const response = await fetch(
        "https://tic-himalayan-utopia-backend-v1.onrender.com/api/auth/verifyEmailUp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "refresh-token": refreshToken,
          },
          body: JSON.stringify({
            otp: otpCode,
            userId: tempUserId,
          }),
        }
      );

      

      const result = await response.json();
      if (response.ok) {
        toast.success("Email verified successfully!");
        setUserInfo((prev) => ({ ...prev, email: newEmail }));
        setOtpModalVisible(false);
        setNewEmail("");
        // Update the localStorage 'user' item with the new email
        const updatedUser = {
          ...user,
          user: {
            ...user.user,
            email: newEmail,
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(result.message || "Failed to verify OTP.");
      }
    } catch (error) {
      toast.error("Error verifying OTP.");
    }
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

  return (
    <div className="w-full mx-auto px-8 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

      {Object.entries(userInfo).map(([field, value]) => (
        <div key={field} className="mb-4 border-b border-gray-200 pb-4">
          <label className="block text-gray-600 capitalize">{field}</label>
          <div className="flex items-center">
            {editMode[field] ? (
              <input
                type={field === "dob" ? "date" : "text"}
                name={field}
                value={field === "email" ? newEmail : value}
                onChange={(e) =>
                  field === "email"
                    ? setNewEmail(e.target.value)
                    : handleChange(e)
                }
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
              />
            ) : (
              <p className="flex-1 text-gray-800">{value}</p>
            )}
            <button
              onClick={() => {
                toggleEdit(field);
                if (field === "email" && editMode[field]) {
                  setPasswordModalVisible(true);
                }
              }}
              className="ml-4 text-blue-600 hover:underline"
            >
              {editMode[field] ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      ))}

      {/* Password Modal */}
      {passwordModalVisible && (
        <Modal onClose={() => setPasswordModalVisible(false)}>
          <h2 className="text-xl font-semibold">Enter Password</h2>

          <div className="relative mt-4 w-full flex items-center border border-[#D0D5DD] justify-center rounded-[10px] px-4">
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
              className="w-[24px] flex cursor-pointer items-center justify-center h-full"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <IoEyeOff className="w-full text-xl" />
              ) : (
                <IoEye className="w-full text-xl" />
              )}
            </div>
          </div>
          <button
            onClick={handleEmailUpdate}
            className="mt-4 w-full bg-[#4997D3] text-white rounded-[10px] px-4 py-2"
          >
            Submit
          </button>
        </Modal>
      )}

      {/* OTP Modal */}
      {otpModalVisible && (
        <Modal onClose={() => setOtpModalVisible(false)}>

          <div className="bg-white p-6 flex flex-col items-center gap-1 px-8 rounded-[20px] py-10 w-[90%] md:w-1/2 lg:w-full">
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
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-10 h-10 lg:w-14 lg:h-14 border border-gray-300 text-center rounded-md focus:outline-none popp"
                />
              ))}
            </div>
            <div className="px-6 w-full">
              <button
                onClick={handleOtpVerification}
                className="w-full p-3 bg-[#4997D3] rounded-[10px] text-white hover:bg-[#3a7fbf] transition-all popp"
              >
                Continue
              </button>
            </div>
            <div className="text-center popp flex flex-col ">
              <span className="text-sm text-red-500 popp">
                Time remaining: {timer}s
              </span>
            </div>
          </div>
      </Modal>
      )}
    </div>
  );
};

export default PersonalInfo;
