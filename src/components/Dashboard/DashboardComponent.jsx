import React, { useState, Suspense, useContext } from "react";
const PersonalInfo = React.lazy(() => import("./PersonalInfo"));
const PaymentDetails = React.lazy(() => import("./PaymentDetails"));
const Security = React.lazy(() => import("./Security"));
const Preferences = React.lazy(() => import("./Preferences"));
const EmailNotifications = React.lazy(() => import("./EmailNotifications"));
const MyBookings = React.lazy(() => import("./MyBookings"));
import profile from "../../assets/profile.png";
import creditcard from "../../assets/creditcard.png";
import bell from "../../assets/bell.png";
import lock from "../../assets/Lock.png";
import preferences from "../../assets/preferences.png";
import { UserContext } from "../../context/UserContext";

const DashboardComponent = () => {
  const [activeComponent, setActiveComponent] = useState("PersonalInfo");
  const { user } = useContext(UserContext); 

  const renderComponent = () => {
    switch (activeComponent) {
      case "PersonalInfo":
        return <PersonalInfo user={user}/>;
      case "PaymentDetails":
        return <PaymentDetails />;
      case "MyBookings":
        return <MyBookings />;
      case "Security":
        return <Security />;
      case "Preferences":
        return <Preferences />;
      case "EmailNotifications":
        return <EmailNotifications />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="flex items-center w-full mt-[150px] mb-[150px] flex-col xl:px-48">
      <div className="w-full flex items-start">
        <h1 className="text-3xl popp pb-10 px-8 font-">Account Settings</h1>
      </div>
      <div className="flex w-full flex-col md:flex-row">
        {/* Side Menu */}
        <aside className="w-full md:w-1/4 p-6">
          <ul className="space-y-4">
            <li
              className={`cursor-pointer popp flex p-2 rounded-[10px] items-center gap-2 ${
                activeComponent === "MyBookings"
                  ? "font-semibold bg-zinc-100 text-black"
                  : "hover:bg-zinc-50 transition-all"
              }`}
              onClick={() => setActiveComponent("MyBookings")}
            >
              <span className="hidden p-2 md:flex items-center justify-center bg-gray-100 ">
                <img
                  src={profile}
                  alt="profile"
                  className="w-[16px] h-[16px] inline"
                />
              </span>
              My Bookings
            </li>
            <li
              className={`cursor-pointer popp flex p-2 rounded-[10px] items-center gap-2 ${
                activeComponent === "PersonalInfo"
                  ? "font-semibold bg-zinc-100 text-black"
                  : "hover:bg-zinc-50 transition-all"
              }`}
              onClick={() => setActiveComponent("PersonalInfo")}
            >
              <span className="p-2 hidden md:flex items-center justify-center bg-gray-100 ">
                <img
                  src={profile}
                  alt="profile"
                  className="w-[16px] h-[16px] inline"
                />
              </span>
              Personal Info
            </li>
            <li
              className={`cursor-pointer popp flex p-2 rounded-[10px] items-center gap-2 ${
                activeComponent === "PaymentDetails"
                  ? "font-semibold bg-zinc-100 text-black"
                  : "hover:bg-zinc-50 transition-all"
              }`}
              onClick={() => setActiveComponent("PaymentDetails")}
            >
              <span className="p-2 hidden md:flex items-center justify-center bg-gray-100 ">
                <img
                  src={creditcard}
                  alt="profile"
                  className="w-[16px] h-[16px] inline"
                />
              </span>
              Payment Details
            </li>
            {/* <li
              className={`cursor-pointer popp flex p-2 rounded-[10px] items-center gap-2 ${
                activeComponent === "Security" ? "font-semibold bg-zinc-100 text-black" : "hover:bg-zinc-50 transition-all"
              }`}
              onClick={() => setActiveComponent("Security")}
            >
              <span className="p-2 hidden md:flex items-center justify-center bg-gray-100 ">
                <img
                  src={lock}
                  alt="profile"
                  className="w-[16px] h-[16px] inline"
                />
              </span>
              Security
            </li> */}
            {/* <li
              className={`cursor-pointer popp flex p-2 rounded-[10px] items-center gap-2 ${
                activeComponent === "Preferences"
                  ? "font-semibold bg-zinc-100 text-black"
                  : "hover:bg-zinc-50 transition-all"
              }`}
              onClick={() => setActiveComponent("Preferences")}
            >
              <span className="p-2 hidden md:flex items-center justify-center bg-gray-100 ">
                <img
                  src={preferences}
                  alt="profile"
                  className="w-[16px] h-[16px] inline"
                />
              </span>
              Preferences
            </li> */}
            <li
              className={`cursor-pointer popp flex p-2 rounded-[10px] items-center gap-2 ${
                activeComponent === "EmailNotifications"
                  ? "font-semibold bg-zinc-100 text-black"
                  : "hover:bg-zinc-50 transition-all"
              }`}
              onClick={() => setActiveComponent("EmailNotifications")}
            >
              <span className="p-2 hidden md:flex items-center justify-center bg-gray-100 ">
                <img
                  src={bell}
                  alt="profile"
                  className="w-[16px] h-[16px] inline"
                />
              </span>
              Email Notifications
            </li>
          </ul>
        </aside>

        {/* Content Area */}
        <main className="w-full md:w-3/4 p-6">
          <Suspense fallback={<div>Loading...</div>}>
            {renderComponent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardComponent;
