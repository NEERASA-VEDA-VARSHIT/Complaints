import React from 'react';
import ComplaintDetail from '../components/ComplaintDetail';

const ComplaintDetailModal = ({ complaint, onClose }) => {
  if (!complaint) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-gray-800 rounded-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <ComplaintDetail complaint={complaint} />
      </div>
    </div>
  );
};

export default ComplaintDetailModal;