import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Đảm bảo bạn đã cài react-select

const CustomDatePicker = ({ selectedDate, setSelectedDate, onApplyFilter }) => {
  const [year, setYear] = useState(selectedDate.year || '');
  const [month, setMonth] = useState(selectedDate.month || '');
  const [day, setDay] = useState(selectedDate.day || '');
  const [status, setStatus] = useState('');  // State cho status

  // Tạo danh sách năm từ 2020 đến năm hiện tại
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 2023; i--) {
    yearOptions.push(i);
  }

  // Cập nhật selectedDate khi thay đổi year, month, day
  useEffect(() => {
    setYear(selectedDate.year || '');
    setMonth(selectedDate.month || '');
    setDay(selectedDate.day || '');
  }, [selectedDate]);

  // Cập nhật tháng khi năm thay đổi
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // Cập nhật tháng khi tháng thay đổi
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  // Cập nhật ngày khi tháng thay đổi
  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  // Hàm xử lý thay đổi status
  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption ? selectedOption.value : '');
  };

  // Tạo danh sách ngày dựa trên tháng và năm
  const getDaysInMonth = (month, year) => {
    if (!month || !year) return [];
    const date = new Date(year, month, 0);
    const days = [];
    for (let i = 1; i <= date.getDate(); i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(month, year); // Lấy danh sách ngày trong tháng hiện tại

  // Hàm để áp dụng bộ lọc
  const handleApplyFilter = () => {
    // Chỉ truyền giá trị nếu year, month, day không phải là giá trị mặc định (rỗng)
    const filters = {};
    if (year) filters.year = year;
    if (month) filters.month = month;
    if (day) filters.day = day;
    if (status) filters.status = status;  // Thêm status vào bộ lọc

    onApplyFilter(filters);  // Truyền bộ lọc cho component cha
  };

  return (
    <div className="mb-4">
      <div className="flex space-x-4">
        {/* Chọn Năm */}
        <div>
          <label className="block text-teal-500 font-semibold">Year</label>
          <select
            value={year}
            onChange={handleYearChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Year</option>
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Tháng */}
        {year && (
          <div>
            <label className="block text-teal-500 font-semibold">Month</label>
            <select
              value={month}
              onChange={handleMonthChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Month</option>
              {[...Array(12)].map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {new Date(0, idx).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chọn Ngày */}
        {month && (
          <div>
            <label className="block text-teal-500 font-semibold">Day</label>
            <select
              value={day}
              onChange={handleDayChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Day</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Dropdown cho status */}
      <div className="status-dropdown-container mt-4">
        <label className="block text-teal-500 font-semibold">Status</label>
        <Select
          value={status ? { label: status, value: status } : null}
          onChange={handleStatusChange}
          options={[
            { label: "All", value: '' },
            { label: "Ordered", value: "ordered" },
            { label: "Waiting for shipping", value: "waitingship" },
            { label: "Shipping", value: "shipping" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancel", value: "cancel" },
          ]}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Nút Filter */}
      <div className="mt-4">
        <button
          onClick={handleApplyFilter}
          className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
