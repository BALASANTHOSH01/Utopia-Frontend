import React, { useState, useContext } from 'react';
import { IoPerson } from 'react-icons/io5';
import { toast } from 'sonner';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const HoverDropdown = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { user, clearUser } = useContext(UserContext);
  const role = JSON.parse(localStorage.getItem("user"))?.user?.role;

  const navigate = useNavigate();

  const showDropdown = () => setDropdownVisible(true);

  const hideDropdown = () => setDropdownVisible(false);

  const handleLogout = async () => {
    try {
      await fetch("https://tic-himalayan-utopia-backend-v1.onrender.com/api/auth/logout", {
        method: "POST",
      });
      toast.success("Logout successful");
      clearUser();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {!user ? (
        <div
          onClick={() => navigate("/signup")}
          style={{
            padding: '10px',
            // backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <IoPerson /> Sign In
        </div>
      ) : (
        <div
          onMouseEnter={showDropdown}
          onMouseLeave={hideDropdown}
          style={{
            padding: '10px',
            // backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IoPerson /> {user?.user?.name}

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                padding: '10px',
                minWidth: '150px',
                zIndex: 1,
              }}
            >
                
              <div
                onClick={
                    role === "admin"
                        ? () => navigate("/admin")
                        : () => navigate("/dashboard")
                }
                style={{ padding: '8px', cursor: 'pointer', color: 'black' }}
              >
                {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
              </div>
              <div
                onClick={handleLogout}
                style={{ padding: '8px', cursor: 'pointer', color: 'black' }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoverDropdown;
