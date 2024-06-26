import React from "react";

const ButtonPrimary = ({ children, addClass }) => {
  return (
    <button
      className={
        "py-3 lg:py-4 px-12 l g:px-16 text-yellow-100 font-semibold rounded-lg bg-blue-200 hover:bg-blue-300 hover:shadow-orange-md transition-all outline-none " +
        addClass
      }
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
