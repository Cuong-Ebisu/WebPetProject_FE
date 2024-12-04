import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import arrowRightIcon from '../pictures/icons8-arrow-right-50.png';
import arrowDownIcon from '../pictures/icons8-arrow-down-50.png';
import clientApi from '../client-api/rest-client';

const FilterSection = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState({
    group: false,
    activityLevel: false,
    barkingLevel: false,
    characteristics: false,
    coatType: false,
    sheddingLevel: false,
    size: false,
    trainability: false,
  });

  const [filters, setFilters] = useState({});
  const [dogBreeds, setDogBreeds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBreeds, setTotalBreeds] = useState(0);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedBreedsDetails, setSelectedBreedsDetails] = useState([]);

  // Lấy selectedBreeds từ localStorage khi load trang
  useEffect(() => {
    const savedSelectedBreeds = JSON.parse(localStorage.getItem('selectedBreeds')) || [];
    setSelectedBreeds(savedSelectedBreeds);
  }, []);

  // Lưu selectedBreeds vào localStorage mỗi khi có sự thay đổi
  useEffect(() => {
    localStorage.setItem('selectedBreeds', JSON.stringify(selectedBreeds));
  }, [selectedBreeds]);

  // Fetch dog breeds data
  const fetchDogBreeds = async () => {
    setLoading(true);
    setError(null);

    let authen = clientApi.service('dogbreeds');

    const requestPayload = {
      page: currentPage,
      limit: itemsPerPage,
      ...filters,
    };

    console.log("Payload Sent to API:", requestPayload);

    try {
      const response = await authen.find(requestPayload);
      if (response.EC === 0) {
        setDogBreeds(response.DT);
        setTotalBreeds(response.totalBreeds);
      } else {
        setError(response.EM);
        setDogBreeds([]);
        setTotalBreeds(0);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("No dog breeds match the filters.");
      setDogBreeds([]);
      setTotalBreeds(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogBreeds();
  }, [currentPage, filters]);

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle filter sections
  const toggleFilter = (filterName) => {
    setFiltersOpen((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (value) {
        updatedFilters[filterKey] = value;
      } else {
        delete updatedFilters[filterKey];
      }
      return updatedFilters;
    });

    setCurrentPage(1);
  };

  const renderFilterSection = (title, filterKey, options) => (
    <div className="filter-group mb-6">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">{title}</h4>
        <img
          src={filtersOpen[filterKey] ? arrowDownIcon : arrowRightIcon}
          alt="Toggle Filter"
          className="w-5 h-5 cursor-pointer"
          onClick={() => toggleFilter(filterKey)}
        />
      </div>
      {filtersOpen[filterKey] && (
        <div className="grid grid-cols-2 gap-y-2 mt-2">
          {options.map((label) => (
            <label key={label} className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) =>
                  handleFilterChange(filterKey, e.target.checked ? label : null)
                }
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const handleViewDetails = (breedId) => {
    navigate(`/dogbreeds/${breedId}`);
  };

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCompareChange = (breed, checked) => {
    if (checked) {
      if (selectedBreedsDetails.length < 5) {
        setSelectedBreedsDetails((prev) => [...prev, breed]);
      }
    } else {
      setSelectedBreedsDetails((prev) =>
        prev.filter((selected) => selected._id !== breed._id)
      );
    }
  };

  const handleCompareBreeds = () => {
    localStorage.setItem('selectedBreedsDetails', JSON.stringify(selectedBreedsDetails)); // Store selected breeds in localStorage
    console.log('Selected breeds to compare:', selectedBreedsDetails); // Log selected breeds for debugging
    navigate('/compareDogs'); // Redirect to the CompareDogs page
  };

  return (
    <div className="home-container text-white flex flex-col min-h-screen">
      <Header />
      <div className="flex p-6 space-x-4">
        <div className="filter-section p-6 bg-white rounded-lg shadow-lg w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">FILTER BREEDS</h3>
          </div>
          {/* Filters */}
          {renderFilterSection("GROUP", "group", [
            "Sporting Group", "Hound Group", "Working Group", "Terrier Group", 
            "Toy Group", "Non-Sporting Group", "Herding Group", "Miscellaneous Class", 
            "Foundation Stock",
          ])}
          {renderFilterSection("ACTIVITY LEVEL", "activityLevel", [
            "Needs Lots Of Activity", "Regular Exercise", "Energetic", "Calm",
          ])}
          {renderFilterSection("BARKING LEVEL", "barkingLevelDescription", [
            "When Necessary", "Infrequent", "Medium", "Frequent", "Likes To Be Vocal",
          ])}
          {renderFilterSection("CHARACTERISTICS", "characteristics", [
            "Smallest Dog Breeds", "Medium Dog Breeds", "Largest Dog Breeds", 
            "Smartest Breeds Of Dogs", "Hypoallergenic Dogs", "Best Dog Breeds For Kids",
            "Hairless Dog Breeds", "Best Dogs For Apartment Dwellers", "Large Dog Breeds",
          ])}
          {renderFilterSection("COAT TYPE", "coatType", [
            "Curly", "Wavy", "Rough", "Corded", "Hairless", "Short", "Medium", "Long", 
            "Smooth", "Wiry", "Silky", "Double",
          ])}
          {renderFilterSection("SHEDDING", "sheddingLevel", [
            "Infrequent", "Seasonal", "Frequent", "Occasional", "Regularly",
          ])}
          {renderFilterSection("SIZE", "size", [
            "XSmall", "Small", "Medium", "Large", "XLarge",
          ])}
          {renderFilterSection("TRAINABILITY", "trainability", [
            "May be Stubborn", "Agreeable", "Eager To Please", "Independent", "Easy Training",
          ])}

          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg" onClick={fetchDogBreeds}>
              Filter
            </button>
          </div>
        </div>

        {/* Breed List Section */}
        <div className="breed-list-section flex-1 p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Dog Breed List</h2>
            <p className="text-sm text-gray-600 mt-2">
              <strong>What's a dog breed? </strong>
              {isExpanded ? (
                <span>
                  People have been breeding dogs since prehistoric times. The earliest dog breeders used wolves to create domestic dogs...
                </span>
              ) : (
                <span>
                  People have been breeding dogs since prehistoric times...
                </span>
              )}
            </p>
            <button
              onClick={toggleContent}
              className="text-teal-600 mt-2 hover:underline"
            >
              {isExpanded ? "Less" : "More"}
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {dogBreeds.map((breed, index) => (
                <div key={index} className="breed-card bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <h4 className="text-lg font-semibold text-gray-800 mt-2">{breed.name}</h4>
                  <p className="text-sm text-gray-600 mt-2" style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: '2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {breed.description}
                  </p>
                  <button
                    onClick={() => handleViewDetails(breed._id)}
                    className="mt-2 text-teal-600 hover:underline"
                  >
                    View Details
                  </button>
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedBreedsDetails.some(
                        (selected) => selected._id === breed._id  // Kiểm tra sự tồn tại của giống chó trong selectedBreedsDetails
                      )}
                      onChange={(e) =>
                        handleCompareChange(breed, e.target.checked)  // Lưu thông tin chi tiết giống chó khi chọn hoặc bỏ chọn
                      }
                      disabled={selectedBreeds.length >= 5 && !selectedBreeds.includes(breed._id)}
                    />
                    <span className="text-sm text-gray-600">COMPARE BREED</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="pagination flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(totalBreeds / itemsPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalBreeds / itemsPerPage)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Thanh so sánh giống chó */}
      {selectedBreedsDetails.length > 0 && (
        <div className="compare-breeds fixed bottom-0 left-0 w-full bg-teal-600 text-white p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xl">COMPARE BREED</h3>
            <span className="text-sm">{selectedBreedsDetails.length} / 5</span>
          </div>
          <div className="mt-2">
            <ul className="text-sm">
              {selectedBreedsDetails.map((breed) => (
                <li key={breed._id}>{breed.name}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleCompareBreeds}
            className="mt-4 px-6 py-2 bg-white text-teal-600 font-semibold rounded-lg"
          >
            COMPARE BREED
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FilterSection;
