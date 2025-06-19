import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TawkToWidget from '../components/TawkToWidget';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Đảm bảo import AOS stylesheet
import '../css/Home.css';
import clientApi from '../client-api/rest-client';
import { Link } from 'react-router-dom';
import { FaPaw, FaSearch, FaBalanceScale, FaDog } from 'react-icons/fa'; // Icons for buttons
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import dogVideo from '../pictures/Dog.mp4';
import dogVideo1 from '../pictures/Dog1.mp4';
import dogVideo2 from '../pictures/Dog2.mp4';
import dogVideo3 from '../pictures/Dog3.mp4';
import dogVideo4 from '../pictures/Dog4.mp4';
import dogImage5 from '../pictures/Dog5.jpg';
import dogImage6 from '../pictures/Dog6.jpg';
import dogImage7 from '../pictures/Dog7.jpg';
import dogImage8 from '../pictures/Dog8.jpg';

const Home = () => {
  const [postList, setPostList] = useState([]);
  const [randomDogBreed, setRandomDogBreed] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Khởi tạo AOS
    AOS.init({
      duration: 1200,  // Thời gian cho mỗi animation
      easing: 'ease-out-back',
    });

    // Fetch bài đăng từ API
    const fetchPosts = async () => {
      try {
        const result = await clientApi.service('posts').find({ limit: 50 });
        if (result && result.EC === 200) {
          const newPosts = result.DT.map(post => ({
            _id: post._id || post.id,
            title: post.title || 'Untitled',
            image: post.image || 'https://via.placeholder.com/150?text=No+Image',
            category: post.category || 'Uncategorized',
            datePosted: post.datePosted || '2024-01-01T00:00:00.000+00:00',
          }));

          newPosts.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
          const latestPosts = newPosts.slice(0, 5);
          setPostList(latestPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    // Fetch thông tin giống chó ngẫu nhiên
    const fetchRandomDogBreed = async () => {
      try {
        const result = await clientApi.service('dogbreeds').find({ limit: 100 });
        if (result && result.EC === 0 && result.DT.length > 0) {
          const randomIndex = Math.floor(Math.random() * result.DT.length);
          const randomDog = result.DT[randomIndex];
          setRandomDogBreed(randomDog);
        }
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      }
    };

    fetchPosts();
    fetchRandomDogBreed();

    // Inject Botpress Chatbot Scripts
    const script1 = document.createElement('script');
    script1.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
    script1.async = true;
    document.body.appendChild(script1);



    const script2 = document.createElement('script');
    script2.src = "https://files.bpcontent.cloud/2025/06/05/08/20250605082434-RMTZSK24.js";
    script2.async = true;
    document.body.appendChild(script2);



    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };



  }, []);

  return (
    <div className="home-container text-white flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="hero-section h-screen relative flex flex-col justify-center items-center p-20 lg:p-30">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={dogVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Language Switcher on top-right corner */}
        <div className="absolute top-4 right-4 z-20">
          <div className="flex space-x-2">
            <button
              onClick={() => i18n.changeLanguage('en')}
              className="px-3 py-1 border border-white text-white bg-black bg-opacity-30 rounded text-sm hover:bg-opacity-50 transition"
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage('vi')}
              className="px-3 py-1 border border-white text-white bg-black bg-opacity-30 rounded text-sm hover:bg-opacity-50 transition"
            >
              VI
            </button>
          </div>
        </div>
        {/* Overlay */}
        <div className="hero-overlay absolute top-0 left-0 right-0 bottom-0 bg-black opacity-40 z-10"></div>

        <div className="max-w-lg text-center space-y-4 z-20 relative">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-aos="fade-up">
            {t('hero.title')}
          </h1>
          <p className="text-lg mb-6" data-aos="fade-up" data-aos-delay="200">
            {t('hero.subtitle')}
          </p>
          {/* <button
            className="mt-4 px-6 py-3 bg-teal-500 rounded-lg text-lg font-semibold hover:bg-teal-700 transition duration-300"
            data-aos="fade-up"
            data-aos-delay="400"
            onClick={() => window.location.href = '/products'} // Navigate to /products
          >
            {t('hero.button')}
          </button> */}
        </div>
      </div>
      <TawkToWidget />
      <div
        className="dog-breed-feature-section flex flex-col lg:flex-row items-center gap-12 px-6 py-10 bg-gray-900 rounded-lg"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        {/* Content bên trái */}
        <div
          className="content w-full lg:w-1/2 text-white text-justify space-y-6"
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <p className="description text-lg leading-relaxed">
            {t('featuredDogBreed.descriptionExtended') || (
              <>
                Chúng tôi cam kết mang đến cho bạn những thông tin chính xác và chi tiết nhất về các giống chó nổi bật hiện nay.
                Từ dịch vụ chăm sóc sức khỏe, spa chuyên nghiệp, huấn luyện viên giàu kinh nghiệm,
                đến danh sách các địa chỉ mua bán chó uy tín và đáng tin cậy.
                Mục tiêu của chúng tôi là giúp bạn tìm được người bạn bốn chân hoàn hảo cho gia đình và lối sống của bạn.
                Hãy để chúng tôi đồng hành cùng bạn trên hành trình chăm sóc và nuôi dưỡng những chú chó thân yêu!
              </>
            )}
          </p>

          {/* 3 Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <a
              href="http://localhost:5173/spas"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-teal-600 transition"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              🧼 {t('featuredDogBreed.buttons.spa') || 'Spa Services'}
            </a>
            <a
              href="http://localhost:5173/trainers"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-teal-600 transition"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              🐾 {t('featuredDogBreed.buttons.trainer') || 'Dog Trainers'}
            </a>
            <a
              href="http://localhost:5173/dogsellers"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-teal-600 transition"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              🏪 {t('featuredDogBreed.buttons.seller') || 'Dog Sellers'}
            </a>
          </div>
        </div>

        {/* Videos bên phải */}
        <div
          className="videos w-full lg:w-1/2 grid grid-cols-1 gap-4 md:grid-cols-3"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <div className="video-small rounded-lg overflow-hidden shadow-lg col-span-1">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-lg">
              <source src={dogVideo1} type="video/mp4" />
            </video>
          </div>

          <div className="video-large rounded-lg overflow-hidden shadow-xl col-span-2 row-span-2">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-lg">
              <source src={dogVideo2} type="video/mp4" />
            </video>
          </div>

          <div className="video-small rounded-lg overflow-hidden shadow-lg col-span-1">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-lg">
              <source src={dogVideo3} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="additional-content bg-gray-100 text-gray-800 p-8 lg:p-20 flex flex-col items-center space-y-8">
        <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
          {t('latestStories.title')}
        </h2>

        {/* Display Latest Posts */}
        <div className="posts-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          {postList.map((post, index) => (
            <Link to={`/posts/${post._id}`} key={post._id} className="post-link">
              <div className="card-home" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <img src={post.image} alt={post.title} />
                <div className="content p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{t(post.title)}</h3>
                  <p className="text-sm text-gray-600 mt-2">{post.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer Section Below Latest Stories */}
      <div className="spacer-section flex items-center justify-start">
        {/* Video bên trái */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-left h-full object-cover"
          data-aos="fade-right"
          data-aos-duration="1200"
        >
          <source src={dogVideo4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Nội dung bên phải */}
        <div
          className="spacer-content text-white px-10 py-6 w-full lg:w-1/2 space-y-4"
          data-aos="fade-left"
          data-aos-duration="1200"
        >
          <h2 className="text-3xl font-bold" data-aos="fade-up" data-aos-delay="200">
            {t('dogFoodGuide2.title')}
          </h2>
          <p className="text-lg" data-aos="fade-up" data-aos-delay="400">
            {t('dogFoodGuide2.description')}
          </p>
          <a
            href="http://localhost:5173/dogfoods"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            {t('dogFoodGuide2.button')}
          </a>
        </div>
      </div>

      {/* Image Section with 4 Vertical Images aligned to the left */}
      <div className="flex flex-col lg:flex-row items-center lg:items-center px-4 py-16 bg-white gap-6 ml-20">
        {/* LEFT: 2x2 Floating Images */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[380px]">
          <img
            src={dogImage5}
            alt="Dog 5"
            className="vertical-image object-cover rounded-lg shadow-md float-animate"
            data-aos="fade-up"
            data-aos-delay="0"
          />
          <img
            src={dogImage6}
            alt="Dog 6"
            className="vertical-image object-cover rounded-lg shadow-md float-animate"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ animationDelay: '0.5s' }}
          />
          <img
            src={dogImage7}
            alt="Dog 7"
            className="vertical-image object-cover rounded-lg shadow-md float-animate"
            data-aos="fade-up"
            data-aos-delay="200"
            style={{ animationDelay: '1s' }}
          />
          <img
            src={dogImage8}
            alt="Dog 8"
            className="vertical-image object-cover rounded-lg shadow-md float-animate"
            data-aos="fade-up"
            data-aos-delay="300"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        {/* RIGHT: Text content */}
        <div className="flex flex-col justify-center items-start space-y-4 px-2 w-full">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800" data-aos="fade-up">
            {t('storePreview.title')}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay="150">
            {t('storePreview.description')}
          </p>
          <a
            href="http://localhost:5173/products"
            className="bg-teal-500 text-white px-5 py-2 text-lg rounded-md font-medium hover:bg-teal-600 transition"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            {t('storePreview.button')}
          </a>
        </div>
      </div>

      {/* Featured Dog Breed Section */}
      {randomDogBreed && (
        <div className="random-dog-section bg-[#C4DACB] text-[#16423C] p-8 lg:p-20 flex flex-col items-center space-y-8" data-aos="fade-up" data-aos-duration="1500">
          <h2 className="text-3xl font-bold mb-4 text-center" data-aos="fade-up" data-aos-delay="200">
            {t('featured.title')}: <span className="text-teal-600">{randomDogBreed.name}</span>
          </h2>
          <Link to={`/dogbreeds/${randomDogBreed._id}`} className="dog-link w-full text-center" data-aos="zoom-in" data-aos-delay="400">
            <div className="dog-details flex flex-col items-center cursor-pointer hover:opacity-80">
              <img src={randomDogBreed.image} alt={randomDogBreed.name} className="w-72 h-72 object-cover rounded-lg shadow-xl mb-4" />
              <p className="text-lg text-[#16423C] text-center" data-aos="fade-up" data-aos-delay="600">
                {t('featured.breedName')}: <span className="font-semibold">{randomDogBreed.name}</span>
              </p>
              <p className="text-sm text-[#16423C] mt-2 text-center" data-aos="fade-up" data-aos-delay="800">
                {t('featured.description')}
              </p>
            </div>
          </Link>

          {/* Breed Functionality Buttons */}
          <div className="breed-buttons grid grid-cols-2 gap-6 mt-8">
            <Link to="/breedList" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="100">
              <FaPaw className="text-3xl mb-2" />
              <span>{t('breedButtons.explore')}</span>
            </Link>
            <Link to="/bestDog" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="200">
              <FaSearch className="text-3xl mb-2" />
              <span>{t('breedButtons.findMatch')}</span>
            </Link>
            <Link to="/compareDogs" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="300">
              <FaBalanceScale className="text-3xl mb-2" />
              <span>{t('breedButtons.compare')}</span>
            </Link>
            <Link to="/dog-name-finder" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="400">
              <FaDog className="text-3xl mb-2" />
              <span>{t('breedButtons.nameFinder')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
