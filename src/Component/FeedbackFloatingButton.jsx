import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#134E5E] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:bg-[#0F3944] hover:scale-110 transition-all group flex items-center justify-center cursor-pointer"
        aria-label="Send Feedback or Message"
      >
        <MessageSquarePlus size={24} />
      </button>
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FeedbackFloatingButton;
