import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';

const Spa = () => {
  const [spaList, setSpaList] = useState([]);
  const [page, setPage] = useState(1);
  const spaPerPage = 16;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ province: '', services: [] });
  const [userRole, setUserRole] = useState(null); // State lưu role của user

  // Lấy role từ localStorage khi component load
  useEffect(() => {
    const role = localStorage.getItem('role'); // Lấy role từ localStorage
    setUserRole(role); // Lưu role vào state
  }, []);

  // Fetch spa data từ API
  useEffect(() => {
    const fetchSpas = async () => {
      const params = {
        page,
        limit: spaPerPage,
        location: filters.province,
        services: filters.services.join(','),
      };

      try {
        let spa = clientApi.service('spas');
        const result = await spa.find(params);
        if (result && result.EC === 0) {
          const newSpas = Array.isArray(result.DT) ? result.DT : result.DT.spas || [];
          if (newSpas.length < spaPerPage) {
            setHasMore(false);
          }
          setSpaList((prevList) => (page === 1 ? newSpas : [...prevList, ...newSpas]));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching spas:', error);
        setHasMore(false);
      }
    };

    fetchSpas();
  }, [page, filters]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    setSpaList([]);
  };

  return (
    <div className="spa-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Bộ lọc */}
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="spa" />
        </div>

        {/* Danh sách spa */}
        <div className="w-3/4 p-6">
          {spaList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {spaList.map((spa) => (
                  <Card
                    key={spa._id}
                    id={spa._id}
                    image={spa.image || 'https://via.placeholder.com/150?text=Not+Available'}
                    name={spa.name}
                    location={spa.location}
                    services={spa.services}
                    contactInfo={spa.contactInfo}
                    type="spas"
                    action="update"
                    description={spa.description}
                    role={userRole} // Truyền role từ localStorage xuống Card
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-600">No Spas found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Spa;
