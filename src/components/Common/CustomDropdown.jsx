import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";

const CustomDropdown = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  
  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full text-[12px] md:text-md p-2 popp rounded-[8px] bg-[#F5F5F5] flex justify-between items-center"
      >
        {selectedValue || "Select an option"}
        <span className="ml-2">{isOpen ? <IoChevronUpOutline/> : <IoChevronDownOutline/>}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="p-2 text-[12px] hover:bg-[#4997D3] whitespace-nowrap rounded-lg hover:text-white cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
