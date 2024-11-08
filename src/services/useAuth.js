import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Constants
  const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
  const API_URL = 'https://tic-himalayan-utopia-backend-v1.onrender.com/api';

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Get stored tokens
  const getStoredTokens = () => ({
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken')
  });

  // Set new tokens
  const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  // Clear tokens and auth state
  const clearTokens = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  }, []);

  // Handle logout
  const logout = useCallback(() => {
    clearTokens();
    navigate('/login');
  }, [clearTokens, navigate]);

  // Refresh access token
  const refreshAccessToken = useCallback(async (silent = false) => {
    const { token, refreshToken } = getStoredTokens();

    if (!token || !refreshToken) {
      if (!silent) {
        console.warn("No token or refresh token available for refreshing.");
        logout();
      }
      return null;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'refresh-token': refreshToken
        }
      });

      const data = await response.json();

      if (response.ok && data?.data?.tokens) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data.tokens;
        setTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      } else {
        throw new Error(data.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      if (!silent) {
        logout();
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Check auth status
  const checkAuthStatus = useCallback(async () => {
    const { token, refreshToken } = getStoredTokens();

    if (!token || !refreshToken) {
      clearTokens();
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      const newToken = await refreshAccessToken(true);
      if (!newToken) {
        clearTokens();
      }
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [refreshAccessToken, clearTokens]);

  // Setup automatic token refresh
  useEffect(() => {
    let refreshInterval;

    if (isAuthenticated) {
      refreshInterval = setInterval(() => {
        refreshAccessToken(true);
      }, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated, refreshAccessToken]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Create authenticated fetch function
  const authFetch = useCallback(async (url, options = {}) => {
    const { token } = getStoredTokens();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // If token is expired, try to refresh and retry the request
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
          return fetch(url, {
            ...options,
            headers
          });
        }
      }

      return response;
    } catch (error) {
      console.error('Error making authenticated request:', error);
      throw error;
    }
  }, [refreshAccessToken]);

  return {
    isAuthenticated,
    isLoading,
    refreshAccessToken,
    logout,
    authFetch
  };
};

export default useAuth;