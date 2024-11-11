import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';
import { useCallback, useContext, useEffect, useRef, useState, useMemo } from 'react';

const useAuth = () => {
  const navigate = useNavigate();
  const { saveUser, clearUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const isRefreshingToken = useRef(false);
  const refreshCooldown = useRef(false);

  const API_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000';

  // Memoize API instance
  const api = useMemo(() => { 
    return axios.create({
      baseURL: API_URL,
      withCredentials: true, // Important for sending/receiving cookies
      headers: { 'Content-Type': 'application/json' }
    });
  }, [API_URL]);

  const clearAuthData = useCallback(() => {
    clearUser();
    setIsAuthenticated(false);
  }, [clearUser]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await api.post('/api/auth/logout');
      console.log("Logout successful");
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuthData();
      setIsLoading(false);
      navigate('/login');
    }
  }, [navigate, api, clearAuthData]);

  const refreshAccessToken = useCallback(async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingToken.current || refreshCooldown.current) {
      return false;
    }

    isRefreshingToken.current = true;
    try {
      const response = await api.post('/api/refreshToken');
      
      if (response.status === 200) {
        console.log("Token refresh successful");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (error.response?.status === 401) {
        // If refresh token is invalid/expired, logout user
        await logout();
      }
      return false;
    } finally {
      isRefreshingToken.current = false;
      // Prevent rapid successive refresh attempts
      refreshCooldown.current = true;
      setTimeout(() => {
        refreshCooldown.current = false;
      }, 5000); // 5 second cooldown
    }
  }, [api, logout]);

  const checkAuthStatus = useCallback(async () => {
    if (!isInitialLoad.current) return;
    isInitialLoad.current = false;

    try {
      console.log("Verifying user status...");
      setIsLoading(true);
      
      const response = await api.get('/api/auth/verifyUser');
      
      if (response.data?.user) {
        saveUser(response.data.user);
        setIsAuthenticated(true);
        console.log("User verification successful");
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      if (error.response?.status === 401) {
        // Try to refresh token once if verification fails
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          await logout();
        } else {
          // If refresh successful, try verification again
          try {
            const retryResponse = await api.get('/api/auth/verifyUser');
            if (retryResponse.data?.user) {
              saveUser(retryResponse.data.user);
              setIsAuthenticated(true);
            }
          } catch (retryError) {
            console.error('Error in retry verification:', retryError);
            await logout();
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [api, logout, saveUser, refreshAccessToken]);

  useEffect(() => {
    // Queue for pending requests during token refresh
    let refreshQueue = [];
    let isRefreshing = false;

    // Add response interceptor for handling 401s
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (isRefreshing) {
            // Queue the request if a refresh is already in progress
            try {
              await new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
              });
              // Retry the original request after token refresh
              return api(originalRequest);
            } catch (error) {
              return Promise.reject(error);
            }
          }

          isRefreshing = true;

          try {
            const refreshed = await refreshAccessToken();
            
            if (refreshed) {
              // Process all queued requests
              refreshQueue.forEach(({ resolve }) => resolve());
              refreshQueue = [];
              // Retry the original request
              return api(originalRequest);
            } else {
              // Reject all queued requests
              refreshQueue.forEach(({ reject }) => reject());
              refreshQueue = [];
              await logout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // Reject all queued requests
            refreshQueue.forEach(({ reject }) => reject());
            refreshQueue = [];
            await logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    // Check auth status on mount
    checkAuthStatus();

    // Cleanup on unmount
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [checkAuthStatus, logout, refreshAccessToken, api]);

  return {
    isAuthenticated,
    isLoading,
    user: useContext(UserContext).user,
    logout,
    api,
  };
};

export default useAuth;