"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatbotButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="fixed bottom-10 right-10 z-10">
      <Button
        onClick={toggleChatbot}
        className="rounded-full w-12 h-12 bg-background text-primary hover:bg-background/80 transition-colors duration-200"
      >
        {isChatbotOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      {isChatbotOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-background rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Chatbot</h2>
          {/* Add your chatbot implementation here */}
          <p>Your chatbot content goes here.</p>
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;
