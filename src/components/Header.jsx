import React, { useState, useEffect, useRef } from "react";
import { FaPaw, FaSearch, FaUserCircle, FaHeart, FaBalanceScale,FaUser,  FaSignOutAlt, FaClipboardList, FaChartLine, FaRobot  } from "react-icons/fa";
import { IoSparklesOutline } from "react-icons/io5";
import { GiWhistle } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import logo from "../pictures/heart-with-dog.png";
import { LuDog } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/Header.css";
import clientApi from "../client-api/rest-client";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBreedMenuOpen, setIsBreedMenuOpen] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const breedMenuRef = useRef(null);
  const serviceMenuRef = useRef(null);
  const [isManager, setIsManager] = useState(false);
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullName: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      let authen = clientApi.service('users');
      try {
        const response = await authen.find();
        console.log(response);
        if (response.EC === 0) {
          const { firstName, lastName, email, role } = response.DT;
          setUserInfo({
            email,
            fullName: `${firstName} ${lastName}`,
            role,
          });
        } else {
          console.error(response.EM);
        }
      } catch (err) {
        console.error('Error during login:', err);
        setError('Something went wrong. Please try again later.');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Láº¥y role tá»« localStorage
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager'); // Kiá»ƒm tra náº¿u role lÃ  manager
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        breedMenuRef.current && !breedMenuRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target) &&
        serviceMenuRef.current && !serviceMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsBreedMenuOpen(false);
        setIsServiceMenuOpen(false);
      } else if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      } else if (breedMenuRef.current && !breedMenuRef.current.contains(event.target)) {
        setIsBreedMenuOpen(false);
      } else if (serviceMenuRef.current && !serviceMenuRef.current.contains(event.target)) {
        setIsServiceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsBreedMenuOpen(false);
    setIsServiceMenuOpen(false);
  };

  const toggleBreedMenu = () => {
    setIsBreedMenuOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsServiceMenuOpen(false);

  };

  const toggleServiceMenu = () => {
    setIsServiceMenuOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsBreedMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/authentication");
    setIsMenuOpen(false);
  };

  const handleAccount = () => {
    navigate("/account");
    setIsMenuOpen(false);
  };

  const handleFavor = () => {
    const id = localStorage.getItem("id");
    navigate(`/favorites/${id}`);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    toast.success('You are logged out!'); 
    navigate("/");
  };

  const handleViewAllBreeds = () => {
    navigate("/breedList");
    setIsBreedMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSpa = () => {
    navigate('/spas');
    setIsServiceMenuOpen(false);
  };

  const handleStore = () => {
    navigate('/products');
    setIsServiceMenuOpen(false);
  };

  const handleTrainer = () => {
    navigate('/trainers');
    setIsServiceMenuOpen(false);
  };

  const handleDogseller = () => {
    navigate('/dogsellers');
    setIsServiceMenuOpen(false);
  };

  const handlePost = () => {
    navigate('/posts');
    setIsServiceMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#16423C] p-4 flex justify-between items-center text-white relative z-30">
      <div className="text-2xl font-bold flex items-center cursor-pointer" onClick={handleLogoClick}>
        <img src={logo} alt="WoofHaven Logo" className="w-10 h-10 mr-2" />
        WoofHaven
      </div>
  
      <nav className="flex gap-6 text-lg relative">
        <button onClick={toggleBreedMenu} className="hover:text-teal-400 relative">{t('header.breeds')}</button>
        <button onClick={toggleServiceMenu} className="hover:text-teal-400 relative">{t('header.services')}</button>
        <button onClick={handleStore} className="hover:text-teal-400 relative">{t('header.store')}</button>
        <button onClick={handlePost} className="hover:text-teal-400 relative">{t('header.post')}</button>
        <button onClick={() => navigate("/cart")} className="hover:text-teal-400 relative">{t('header.cart')}</button>
        {isManager && (
          <button onClick={() => navigate("/manageorder")} className="hover:text-teal-400 relative">{t('header.order')}</button>
        )}
  
        {isBreedMenuOpen && (
          <div
            ref={breedMenuRef}
            className="absolute top-14 left-0 w-[700px] h-[260px] bg-white text-gray-700 p-6 rounded-lg shadow-lg z-10 flex justify-around"
          >
            <div className="flex flex-col items-start">
              <button onClick={handleViewAllBreeds} className="text-teal-600 font-bold mb-2">{t('header.exploreBreeds')}</button>
              <button onClick={handleViewAllBreeds} className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg">{t('header.seeAll')}</button>
            </div>
            <div className="flex flex-col items-start mx-6">
              <button onClick={() => navigate("/bestDog")} className="flex items-center text-teal-600 font-bold mb-2">
                <FaHeart className="mr-2" /> {t('header.findMatch')}
              </button>
              <span className="text-sm text-gray-500">{t('header.matchHint')}</span>
              <button onClick={() => navigate("/compareDogs")} className="flex items-center mt-2 text-teal-600 font-bold">
                <FaBalanceScale className="mr-2" /> {t('header.compareBreeds')}
              </button>
              <span className="text-sm text-gray-500">{t('header.compareHint')}</span>
              <button onClick={() => navigate("/dog-name-finder")} className="flex items-center mt-2 text-teal-600 font-bold">
                <FaPaw className="mr-2" /> {t('header.nameFinder')}
              </button>
              <span className="text-sm text-gray-500">{t('header.nameHint')}</span>
              <button onClick={() => navigate("/dogfoods")} className="flex items-center mt-2 text-teal-600 font-bold">
                <FaPaw className="mr-2" /> {t('header.foodGuide')}
              </button>
              <span className="text-sm text-gray-500">{t('header.foodHint')}</span>
              {/* <button onClick={() => window.location.href = "/botpress"} className="flex items-center mt-2 text-teal-600 font-bold">
                <FaRobot className="mr-2" /> {t('header.aiChat')}
              </button>
              <span className="text-sm text-gray-500">{t('header.aiChatHint')}</span> */}
            </div>
          </div>
        )}
  
        {isServiceMenuOpen && (
          <div
            ref={serviceMenuRef}
            className="absolute top-14 left-0 w-[300px] bg-white text-gray-700 p-4 rounded-lg shadow-lg z-10"
          >
            <p className="text-teal-600 font-bold mb-2">{t('header.lookingFor')}</p>
            <button onClick={handleSpa} className="flex items-center w-full text-left px-4 py-2 font-bold mb-2 hover:bg-gray-200">
              <IoSparklesOutline className="text-teal-500 mr-2" />
              <span className="text-gray-600">{t('header.spa')}</span>
            </button>
            <button onClick={handleTrainer} className="flex items-center w-full text-left px-4 py-2 font-bold mb-2 hover:bg-gray-200">
              <GiWhistle className="text-teal-500 mr-2" />
              <span className="text-gray-600">{t('header.trainer')}</span>
            </button>
            <button onClick={handleDogseller} className="flex items-center w-full text-left px-4 py-2 font-bold mb-2 hover:bg-gray-200">
              <LuDog className="text-teal-500 mr-2" />
              <span className="text-gray-600">{t('header.seller')}</span>
            </button>
          </div>
        )}
      </nav>
  
      <div className="flex items-center gap-4 relative">
        {isLoggedIn && (
          <span className="text-white text-lg italic">
            {t('header.greeting', { name: userInfo.fullName })}
          </span>
        )}
  
        <FaUserCircle className="text-3xl cursor-pointer" onClick={toggleMenu} />
  
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="user-menu absolute right-0 mt-12 w-40 bg-white rounded-md shadow-lg z-20 transform translate-y-0"
          >
            <ul className="py-2">
              {isLoggedIn ? (
                <>
                  <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer" onClick={handleAccount}>
                    <FaUser className="inline-block mr-2 text-gray-600" /> {t('header.account')}
                  </li>
                  <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/orderList")}>
                    <FaClipboardList className="inline-block mr-2 text-gray-600" /> {t('header.yourOrder')}
                  </li>
                  <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer" onClick={handleFavor}>
                    <FaHeart className="inline-block mr-2 text-red-500" /> {t('header.favorite')}
                  </li>
                  {isManager && (
                    <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/statistics")}>
                      <FaChartLine className="inline-block mr-2 text-gray-600" /> {t('header.statistics')}
                    </li>
                  )}
                  <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                    <FaSignOutAlt className="inline-block mr-2 text-gray-600" /> {t('header.logout')}
                  </li>
                </>
              ) : (
                <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer" onClick={handleLogin}>
                  <FaUser className="inline-block mr-2 text-gray-600" /> {t('header.login')}
                </li>
              )}
            </ul>
          </div>
        )}
  
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </div>
    </header>
  );  
  
};

export default Header;
