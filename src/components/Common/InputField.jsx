import React from "react";

const InputField = (props) => {
  const { icon: Icon, name, title, value, handleChange, type} = props;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-black font-medium">{title}</label>
      <div className="flex items-center border border-[#D0D5DD] rounded-[10px] overflow-hidden">
        <div className="flex items-center bg-zinc-100 border-r py-3 px-3">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type={type}
          value={value}
          name={name}
          onChange={handleChange}
          placeholder={`Enter ${title.toLowerCase()}`}
          className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
};

export default InputField;
