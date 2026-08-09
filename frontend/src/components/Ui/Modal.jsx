import React from "react";

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface rounded-2xl py-3 px-6">
      {children}
        </div>
    </div>
  );
};

export default Modal;