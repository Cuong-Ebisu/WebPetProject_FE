import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import dogBackground from '../pictures/Home.jpg';
import dogImage2 from '../pictures/dog2.jpg';
import exitIcon from '../pictures/exit.png';
import clientApi from '../client-api/rest-client';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '', 
    role: 'customer',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let authen = clientApi.service('register');
    try {
      const response = await authen.create(formData); 
      if (response.EC === 0) {
        toast.success(response.EM); 
        setTimeout(() => {
          navigate('/authentication');
        }, 2000);
        setError('');
      }else {
        setError(response.EM);
      }
    } catch (error) {
      console.error('Error during register:', error);
      if(error.response.data.EM.msg){
        toast.error(error.response.data.EM.msg);
      }
      else if (error.response.data.EM){
        toast.error(error.response.data.EM);
      } else {
        toast.error(err.message || 'An unexpected error occurred');
      }
    }
  };

  const handleExit = () => {
    navigate('/authentication');
  };

  return (
    <div
      className="register-container h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${dogBackground})` }}
    >
      <div
        className="register-box bg-white bg-opacity-60 backdrop-blur-md rounded-lg shadow-lg flex overflow-hidden relative"
        style={{ width: '900px', height: '700px' }}
      >
        <button onClick={handleExit} className="absolute top-4 right-4">
          <img src={exitIcon} alt="Exit" className="w-6 h-6" />
        </button>

        <div className="register-form w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Register</h2>
          <p className="text-gray-600 mb-6">Let's explore services and information for your beloved pets</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Example@gmail.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Password Confirm"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 mb-4">
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Do you have an account?{' '}
            <button onClick={() => navigate('/authentication')} className="text-teal-600 font-semibold underline">
              Login
            </button>
          </p>
        </div>

        <div className="register-image w-1/2 flex items-center justify-center p-4">
          <img src={dogImage2} alt="Dog" className="rounded-lg shadow-md w-8/10 h-5/6 object-cover" />
        </div>
      </div>
      {/* Component ToastContainer để hiển thị các thông báo */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default Register;