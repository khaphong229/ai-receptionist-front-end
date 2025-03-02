export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}; 