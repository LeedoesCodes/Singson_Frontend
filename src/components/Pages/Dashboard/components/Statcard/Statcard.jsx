import React from "react";

const Statcard = ({ title, value }) => {
  return (
    <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h4 className="text-gray-600 text-sm mb-2 uppercase tracking-wide">
        {title}
      </h4>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default Statcard;
