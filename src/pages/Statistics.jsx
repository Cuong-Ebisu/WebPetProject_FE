import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import RevenueDatePicker from '../components/revenueFilter';
import { message } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Product from './Product';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // Thêm trạng thái lỗi
  const [filters, setFilters] = useState({ year: '', month: '', day: '' });
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // Dữ liệu doanh thu theo tháng
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();


  
  // Fetch dữ liệu đơn hàng từ API
  const fetchOrders = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { year, month, day } = filters;
      const params = { year, month, day, status: 'delivered' };

      const response = await clientApi.service('orders/all').find(params);

      if (response.EC === 0) {
        setTotalOrders(response.DT.totalOrders);
        setTotalRevenue(response.DT.totalAmount);
        //setMonthlyRevenue(response.DT.monthlyRevenue); // Dữ liệu doanh thu theo tháng
        setError(''); // Xóa lỗi nếu dữ liệu thành công
      } else {
        setError('Failed to load data'); // Cập nhật lỗi khi có lỗi
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  const handleCardClick = (e) => {
    navigate(`/products/${e}`);
  };

  const fetchTopProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { year, month, day } = filters;
      const params = { year, month, day };

      const response = await clientApi.service('top').find(params); // Assuming this is the correct endpoint for top products

      if (response.EC === 0) {
        setTopProducts(response.DT); // Lưu danh sách sản phẩm bán chạy
      } else {
        message.error(response.EM);
      }
    } catch (err) {
      message.error(err.message || 'Error loading Products');
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { year } = filters;
      const params = { year, status: 'delivered' };

      const response = await clientApi.service('orders/all').find(params);

      if (response.EC === 0) {
        setMonthlyRevenue(response.DT.monthlyRevenue); // Dữ liệu doanh thu theo tháng
        setError(''); // Xóa lỗi nếu dữ liệu thành công
      } else {
        setError('Failed to load data'); // Cập nhật lỗi khi có lỗi
      }
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  // Handle khi áp dụng bộ lọc
  const handleApplyFilter = (newFilters) => {
    setTotalOrders(0);
    setTotalRevenue(0);
    setFilters(newFilters);
    setError(''); // Reset lỗi khi thay đổi bộ lọc
  };

  // Render thông báo đang làm việc
  const renderWorkingMessage = () => (
    <div className="text-center text-teal-500 text-lg font-semibold">
      <p>Working...</p>
    </div>
  );

  // Render thông báo lỗi hoặc "No data available"
  const renderErrorMessage = () => (
    <div className="text-center text-red-500 text-lg font-semibold">
      <p>{'No data available'}</p>
    </div>
  );

  // Thiết lập mặc định cho filters (năm hiện tại)
  useEffect(() => {
    fetchOrders();
    fetchChart();
    fetchTopProducts();
    const currentYear = new Date().getFullYear();
    setFilters({
      year: currentYear,
      month: '',
      day: '',
    });
  }, []);

  // Khi filters thay đổi, gọi lại hàm fetchOrders
  useEffect(() => {
    fetchOrders();
    fetchChart();
    fetchTopProducts();
  }, [filters]);

  // Cấu hình biểu đồ cột
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue.length ? monthlyRevenue : Array(12).fill(0), // Dữ liệu doanh thu theo tháng, mặc định là 0 nếu không có
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Revenue Chart for ${filters.year}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${value.toLocaleString()} VND`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (VND)',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 10000000,
        },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex flex-grow flex-col">
        {/* Buttons to switch between sections */}
        <div className="p-6 flex space-x-4 bg-teal-50">
          <button
            onClick={() => setActiveSection('revenue')}
            className={`flex-1 text-lg font-semibold ${activeSection === 'revenue' ? 'bg-teal-500 text-white' : 'text-teal-500'} flex justify-center items-center space-x-3 py-4 rounded-lg border-b-4 border-transparent hover:bg-gray-100 
            ${activeSection === 'revenue' ? 'hover:bg-teal-500' : 'hover:bg-gray-300'}`}
          >
            <i className="fas fa-chart-line"></i>
            <span>Revenue</span>
          </button>
          <button
            onClick={() => setActiveSection('topProducts')}
            className={`flex-1 text-lg font-semibold ${activeSection === 'topProducts' ? 'bg-teal-500 text-white' : 'text-teal-500'} flex justify-center items-center space-x-3 py-4 rounded-lg border-b-4 border-transparent hover:bg-gray-100 
            ${activeSection === 'topProducts' ? 'hover:bg-teal-500' : 'hover:bg-gray-300'}`}
          >
            <i className="fas fa-cogs"></i>
            <span>Top Products</span>
          </button>
        </div>

        {/* Content based on selected section */}
        <div className="flex-grow flex p-6">
          {activeSection === 'revenue' && (
            <div className="w-full flex">
              {/* First part: 2/3 width */}
              <div className="w-2/3 pr-4">
                {/* Content for the first section */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-teal-600">Revenue Overview</h3>
                  {error ? (
                    renderErrorMessage() // Nếu có lỗi, hiển thị thông báo lỗi
                  ) : monthlyRevenue.length ? (
                    <Bar data={chartData} options={chartOptions} /> // Hiển thị biểu đồ khi có dữ liệu
                  ) : (
                    renderErrorMessage() // Nếu không có dữ liệu, hiển thị "No data available"
                  )}
                </div>
              </div>

              {/* Second part: 1/3 width */}
              <div className="w-1/3 pl-4">
                {/* Content for the second section */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <RevenueDatePicker
                    selectedDate={filters}
                    setSelectedDate={setFilters}
                    onApplyFilter={handleApplyFilter}
                  />
                  <div className="mb-4 text-lg font-semibold text-teal-500">
                    <span>Total Delivered Orders: </span>
                    <span className="font-bold text-teal-700">{totalOrders}</span>
                  </div>
                  <div className="mb-4 text-lg font-semibold text-teal-500">
                    <span>Total Revenue: </span>
                    <span className="font-bold text-teal-700">
                      {new Intl.NumberFormat('vi-VN').format(totalRevenue)} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'topProducts' && (
            <div className="w-full flex m-0 p-0">
              {/* First part: 3/4 width */}
              <div className="w-3/4 pr-2 m-0 p-0">
                {/* Content for the first section */}
                <div className="bg-gray-200 rounded-lg p-2">
                  {topProducts.length ? (
                    <div className="flex flex-nowrap justify-start gap-2 m-0 p-0">
                      {/* Hiển thị danh sách sản phẩm bán chạy */}
                      {topProducts.map((product, index) => (
                        <div key={index} className="w-1/4 p-1 m-0 cursor-pointer" onClick={() => handleCardClick(product.productId)}>
                          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img
                              src={product.productImage}
                              alt={product.productName}
                              className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <div className="text-left">
                              <div className="font-semibold text-teal-600 mb-2">{product.productName}</div>
                              <div className="text-sm text-black">{product.productPrice} VND</div>
                              <div className="text-sm text-black">Selled Quantity: {product.totalQuantity}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    renderWorkingMessage()
                  )}
                </div>
              </div>

              {/* Second part: 1/4 width */}
              <div className="w-1/4 pl-2 m-0 p-0">
                {/* Content for the second section */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <RevenueDatePicker
                    selectedDate={filters}
                    setSelectedDate={setFilters}
                    onApplyFilter={handleApplyFilter}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default Statistics;

