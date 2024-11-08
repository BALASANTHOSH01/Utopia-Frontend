import jwtDecode from "jwt-decode";
import axios from "axios";

function isTokenExpired(token) {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
}


async function refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post("https://tic-himalayan-utopia-backend-v1.onrender.com/api/refreshToken", { refreshToken });
      const { accessToken } = response.data;
      return accessToken;
    } catch (error) {
      // Handle refresh failure (e.g., log out user)
      console.error("Refresh token failed", error);
      return null;
    }
  }
  