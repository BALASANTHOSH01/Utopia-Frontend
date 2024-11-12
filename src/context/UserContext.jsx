import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  
  const savedUser = localStorage.getItem("user");
const [user, setUser] = useState(() => {
  try {
    console.log("saved USer : "+savedUser);
    const API_URL = import.meta.env.VITE_LOCAL_API_URL ;
  console.log("api-url : ");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null; // Return null if parsing fails
  }
});


  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, saveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
