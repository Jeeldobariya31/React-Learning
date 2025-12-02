// BoldCard.jsx
import React from "react";

const Card = ({
  title = "Bold Title",
  subtitle = "Strong subtitle text here.",
  buttonLabel = "Action",
}) => {
  return (
    <div
      className="
        w-[300px] h-[200px]
        bg-gradient-to-br from-blue-600 to-purple-600
        rounded-xl shadow-xl
        p-5
        text-white
        flex flex-col justify-between
        transition-all duration-400
        hover:scale-[1.05] hover:shadow-2xl
      "
    >
      {/* Text */}
      <div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="text-sm font-semibold mt-1 opacity-90">{subtitle}</p>
      </div>

      {/* Button */}
      <button
        className="
          w-full py-2 mt-2
          rounded-lg
          font-bold
          text-sm
          bg-white text-purple-700
          transition-all duration-300
          hover:bg-purple-200 hover:text-purple-900
        "
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default Card;
