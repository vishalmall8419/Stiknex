import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all group flex items-center justify-center"
        aria-label="Send Feedback or Message"
      >
        <MessageSquarePlus size={24} />
      </button>
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FeedbackFloatingButton;
