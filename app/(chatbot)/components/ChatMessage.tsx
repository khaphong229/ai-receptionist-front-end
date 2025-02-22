import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div className={`flex items-end space-x-2 mb-4 ${isBot ? "justify-start" : "justify-end"}`}>
        {/* AvaTar Bot */}
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
      )}
      
         {/* Bubble chat  - Content chat*/}
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] ${
          isBot 
            ? "bg-secondary text-secondary-foreground rounded-bl-none" 
            : "bg-primary text-primary-foreground rounded-br-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}; 