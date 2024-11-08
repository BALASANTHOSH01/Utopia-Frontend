import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoIosArrowDown } from "react-icons/io";

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);

const DateRangePicker = ({ formData, setFormData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleDateClick = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setFormData({
      ...formData,
      startDate: startDate,
      endDate: endDate,
    });
  };

  const togglePicker = () => setIsOpen(!isOpen);

  const renderDateGrid = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const dates = [];

    // Create empty slots for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(<div key={`empty-${i}`} className="w-full h-full"></div>);
    }

    // Create slots for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      const isSelectedStart = startDate && startDate.getDate() === i && startDate.getMonth() === selectedMonth;
      const isSelectedEnd = endDate && endDate.getDate() === i && endDate.getMonth() === selectedMonth;
      const isInRange = startDate && endDate && date >= startDate && date <= endDate;
      const isHovered = hoverDate && hoverDate.getDate() === i && hoverDate.getMonth() === selectedMonth;

      dates.push(
        <div
          key={i}
          className={`w-full h-full popp flex items-center justify-center cursor-pointer rounded-md py-0.5 
            ${isSelectedStart ? 'bg-[#65b1eb] text-white' : ''}
            ${isSelectedEnd ? 'bg-[#4dacf6] text-black' : ''}
            ${isInRange && !isSelectedStart && !isSelectedEnd ? 'bg-blue-200' : ''}
            ${isHovered ? 'bg-gray-300' : 'text-black'}
          `}
          onClick={() => handleDateClick(date, !startDate || endDate ? 'start' : 'end')}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
        >
          {i}
        </div>
      );
    }

    return dates;
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const formatDateWithoutYear = (date) => {
    return date
      ? date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : null;
  };

  return (
    <div className="relative w-full ">
      <div
        className="flex items-center justify-between bg-transparent border-white cursor-pointer mt-2 p-2"
        onClick={togglePicker}
      >
        <span className="popp text-white">
          {startDate ? formatDateWithoutYear(startDate) : 'FROM'} -{' '}
          {endDate ? formatDateWithoutYear(endDate) : 'TO'}
        </span>
        <motion.div
          className="text-white"
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <IoIosArrowDown />
        </motion.div>
      </div>

      {isOpen && (
        <motion.div
          className="absolute popp bg-white p-4 mt-2 rounded-lg shadow-lg z-[999] w-full lg:w-[120%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Month and Year Selectors */}
          <div className="flex justify-between mb-4">
            <select
              className="appearance-none p-2 px-4 border popp rounded-lg bg-white text-black"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {months.map((month, index) => (
                <option className='popp' key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              className="appearance-none p-2 px-4 border popp rounded-lg bg-white text-black"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option className='popp' key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 text-center text-gray-500 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="popp w-full">
                {day}
              </div>
            ))}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 popp gap-2">{renderDateGrid()}</div>

          <button
            className="mt-4 popp p-2 bg-[#70B4E8] hover:bg-[#51acf2] transition-all text-white w-full rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DateRangePicker;
