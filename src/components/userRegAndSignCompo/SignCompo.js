import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'; // Adjust the path as needed

export default function SignCompo() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { email, password } = data;
      
      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }

      const response = await axios.post('/user/logincustomer', { email, password });
      const userData = response.data;

      if (userData.error) {
        toast.error(userData.error);
      } else {
        // Update context and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Clear form
        setData({ email: '', password: '' });
        
        // Show success message
        toast.success('Successfully logged in!');
        
        // Navigate based on role
        switch (userData.role) {
          case 'customer':
            navigate('/home');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            toast.error('Invalid user role');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterClick = () => navigate('/register');
  const handleForgotPassword = () => navigate('/forgot-password');
  
  return (
    <div className="flex items-center justify-center min-h-[800px] ">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[#19191A] bg-opacity-50 rounded-lg shadow-md border border-orange-500 md:max-w-md lg:max-w-lg">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-center text-white">Welcome Back</h2>
        
        {/* Form */}
        <form className="space-y-4" onSubmit={loginUser}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white text-start">
              Email
            </label>
            <div className="relative flex items-center mt-1">
              <FaEnvelope className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input 
                type="email" 
                name="email" 
                id="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 text-[16px] text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 h-12"
                value={data.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white text-start">
              Password
            </label>
            <div className="relative mt-1">
              <FaLock className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input 
                type="password" 
                name="password" 
                id="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 text-[16px] text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 h-12"
                value={data.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-sm text-blue-500 transition-colors hover:underline hover:text-blue-400"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <div>
            <button 
              type="submit" 
              className="flex items-center justify-center w-full h-12 px-4 py-2 space-x-2 text-[16px] font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">↻</span>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-3 pb-1">
            <hr className="border-gray-600" />
          </div>

          <div className="text-center">
            <h1 className="text-white text-[16px]">Don't have an account?</h1>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <button 
              onClick={handleRegisterClick} 
              type="button" 
              className="flex items-center justify-center w-full h-12 px-4 py-2 space-x-2 text-[16px] text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              <FaUserPlus />
              <span>Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
