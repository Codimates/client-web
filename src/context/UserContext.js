import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Check if user is in localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Error parsing stored user data:', err);
          localStorage.removeItem('user'); // Clear invalid data
        }
      } else {
        try {
          const { data } = await axios.get('/user/profile');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []); // Empty dependency array - only run on mount

  const logout = async () => {
    try {
      await axios.post('/user/logout');
      setUser(null);
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </UserContext.Provider>
  );
}