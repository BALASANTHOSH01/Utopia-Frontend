import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);

const DatePicker = ({ formData, setFormData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialDate = formData instanceof Date ? formData : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  // Helper function to check if a date is today or in the past
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    // Prevent selecting disabled dates
    if (isDateDisabled(date)) return;

    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    
    setSelectedDate(newDate);
    setFormData(newDate);
    setIsOpen(false);
  };

  const togglePicker = () => setIsOpen(!isOpen);

  const renderDateGrid = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const dates = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(<div key={`empty-${i}`} className="w-full h-full"></div>);
    }

    // Render days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      date.setHours(0, 0, 0, 0);
      
      const isSelected = selectedDate && 
        selectedDate.getDate() === i && 
        selectedDate.getMonth() === selectedMonth &&
        selectedDate.getFullYear() === selectedYear;
        
      const isHovered = hoverDate && 
        hoverDate.getDate() === i && 
        hoverDate.getMonth() === selectedMonth &&
        hoverDate.getFullYear() === selectedYear;
        
      const disabled = isDateDisabled(date);

      dates.push(
        <div
          key={i}
          className={`w-full h-full popp flex items-center justify-center cursor-pointer rounded-md py-0.5
            ${isSelected ? 'bg-[#65b1eb] text-white' : ''}
            ${isHovered && !disabled ? 'bg-gray-300' : ''}
            ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && handleDateClick(date)}
          onMouseEnter={() => !disabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
        >
          {i}
        </div>
      );
    }

    return dates;
  };

  const handleMonthChange = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const formatDateWithoutYear = (date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative w-full">
      <div
        className="flex items-center justify-between border-b bg-transparent border-black/30 cursor-pointer mt-2 p-2"
        onClick={togglePicker}
      >
        <span className="popp text-sm text-black">
          {formatDateWithoutYear(selectedDate)}
        </span>
        <motion.div
          className="text-black"
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <IoIosArrowDown />
        </motion.div>
      </div>

      {isOpen && (
        <motion.div
          className="absolute popp w-[140%] md:w-full lg:w-[160%] bg-white p-4 mt-2 rounded-[10px] shadow-xl border z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => handleMonthChange(-1)} className="text-gray-600">
              <IoIosArrowBack />
            </button>
            <div className="flex flex-col items-center">
              <span className="popp font-bold text-sm md:text-lg">
                {months[selectedMonth]} {selectedYear}
              </span>
            </div>
            <button onClick={() => handleMonthChange(1)} className="text-gray-600">
              <IoIosArrowForward />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-gray-500 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="popp text-sm w-full">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 popp text-sm gap-2">{renderDateGrid()}</div>

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

export default DatePicker;