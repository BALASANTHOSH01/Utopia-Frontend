import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PackageSearch from "./pages/PackageSearch";
import PackageDetail from "./pages/PackageDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import axios from "axios";
import { Toaster } from "sonner";
import useAuth from "./services/useAuth.js";
import NotFound from "./pages/NotFound.jsx";
import BookingSuccess from "./components/BookingSuccess.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import CustomTrek from "./pages/CustomTrek.jsx";
import Blogs from "./pages/Blogs.jsx";
import EditTrek from "./components/AdminDashboard/EditTrek.jsx";

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/api`;

const App = () => {
  const {user} = useAuth();

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <Toaster richColors position="top-center" className="popp" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PackageSearch />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/package/edit/:id" element={<EditTrek />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/custom-trek" element={<CustomTrek />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
          <Route path="/admin" element={user ? <AdminPage /> : <Login />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
