import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    // const accessToken = params.get('accessToken');
    // const refreshToken = params.get('refreshToken');
    const error = params.get('error');

    if (success) {
      // Handle successful login, e.g., save the access token and redirect
    
      window.location.href = '/dashboard'; // Redirect to a protected route
    } else if (error) {
      // Handle error by displaying a message to the user
      console.error('Authentication error:', error);
      alert(`Authentication failed: ${decodeURIComponent(error)}`);
      window.location.href = '/login'; // Redirect back to login
    }
  }, [location]);

  return <div>Loading...</div>;
};

export default AuthCallback;
