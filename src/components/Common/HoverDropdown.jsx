import { useState, useContext, useEffect } from 'react';
import { IoPerson } from 'react-icons/io5';
import { toast } from 'sonner';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../services/useAuth';

const HoverDropdown = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { user, clearUser } = useContext(UserContext);
  const role = user?.role;
  const navigate = useNavigate();
  const {api} = useAuth();

  useEffect(() => {
    if (!user) {
      console.warn("User data is missing, check UserContext for correct setup.");
    }
  }, [user]);

  const showDropdown = () => setDropdownVisible(true);
  const hideDropdown = () => setDropdownVisible(false);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      // await fetch("http://localhost:5000/api/auth/logout", { method: "POST" });
      toast.success("Logout successful");
      clearUser();

      navigate("/login");
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
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IoPerson /> Sign In
        </div>
      ) : (
        <div
          onMouseEnter={showDropdown}
          onMouseLeave={hideDropdown}
          onClick={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown on click for testing
          style={{
            padding: '10px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IoPerson /> {user.name || 'User'}

          {isDropdownVisible && (
            <div
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
                onClick={() => navigate(role === "admin" ? "/admin" : "/dashboard")}
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
