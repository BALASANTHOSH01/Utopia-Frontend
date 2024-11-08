import React, { useState, Suspense } from "react";
const AddTrek = React.lazy(() =>
  import("../components/AdminDashboard/AddTrek")
);
const ManageTreks = React.lazy(() =>
  import("../components/AdminDashboard/ManageTreks")
);
const Bookings = React.lazy(() =>
  import("../components/AdminDashboard/Bookings")
);
const CustomTrek = React.lazy(() =>
  import("../components/AdminDashboard/CustomTrek")
);
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("EditTrek");

  const renderComponent = () => {
    switch (activeComponent) {
      case "AddTrek":
        return <AddTrek />;
      case "EditTrek":
        return <ManageTreks />;
      case "ViewBookings":
        return <Bookings />;
      case "CustomTrek":
        return <CustomTrek />;
      default:
        return <AddTrek />;
    }
  };

  return (
    <>
      <div className="flex flex-col ">
        <Navbar />
        <div className="flex flex-col px-2 lg:px-[120px] items-center mt-[150px] mb-[150px] flex-grow md:px-6 ">
          <h1 className="text-3xl px-6 w-full text-start font-semibold mb-5">
            Admin Dashboard
          </h1>
          <div className="flex flex-col lg:flex-row w-full">
            {/* Side Menu */}
            <aside className="w-full lg:w-1/4 p-4 lg:p-6 bg-white rounded-md mb-4 lg:mb-0">
              <ul className="space-y-2">
                <li
                  className={`cursor-pointer p-2 px-4 rounded-md text-start ${
                    activeComponent === "EditTrek"
                      ? "font-semibold bg-zinc-100 px-6 text-black"
                      : "hover:bg-zinc-50 transition-all"
                  }`}
                  onClick={() => setActiveComponent("EditTrek")}
                >
                  Manage Treks
                </li>
                <li
                  className={`cursor-pointer p-2 px-4 rounded-md text-start ${
                    activeComponent === "AddTrek"
                      ? "font-semibold bg-zinc-100 px-6 text-black"
                      : "hover:bg-zinc-50 transition-all"
                  }`}
                  onClick={() => setActiveComponent("AddTrek")}
                >
                  Add New Trek
                </li>
                <li
                  className={`cursor-pointer p-2 px-4 rounded-md text-start ${
                    activeComponent === "ViewBookings"
                      ? "font-semibold bg-zinc-100 px-6 text-black"
                      : "hover:bg-zinc-50 transition-all"
                  }`}
                  onClick={() => setActiveComponent("ViewBookings")}
                >
                  View Bookings
                </li>
                <li
                  className={`cursor-pointer p-2 px-4 rounded-md text-start ${
                    activeComponent === "CustomTrek"
                      ? "font-semibold bg-zinc-100 px-6 text-black"
                      : "hover:bg-zinc-50 transition-all"
                  }`}
                  onClick={() => setActiveComponent("CustomTrek")}
                >
                  Custom Treks
                </li>
              </ul>
            </aside>

            {/* Content Area */}
            <main className="w-full lg:w-3/4 p-4 lg:p-6">
              <Suspense fallback={<div>Loading...</div>}>
                {renderComponent()}
              </Suspense>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminPage;
