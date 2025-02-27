"use client";

import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Volume2,
  VolumeX,
  Mic,
} from "lucide-react";
import { chatbotService } from "@/services/chatbot";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { speechService } from "@/services/speech";

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatbotButtonProps {
  defaultOpen?: boolean;
}

const ChatbotButton = ({ defaultOpen = false }: ChatbotButtonProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm Lysia - AI Restaurant Receptionist, How can I help you?",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hi! I'm your AI Assistant. How can I help you today?",
          isBot: true,
        },
      ]);
    }
  }, []);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage(ttsEnabled);
    }
  };

  const handleSendMessage = async (tts: boolean) => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text: inputMessage, isBot: false }]);

      const userMessage = inputMessage;
      setInputMessage("");

      const response = await chatbotService.sendMessage(
        userMessage,
        ttsEnabled
      );

      if (response.status === "success") {
        setMessages((prev) => [
          ...prev,
          { text: response.message, isBot: true },
        ]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (isRecording) {
        stopRecording();
        return;
      }

      setIsInitializing(true);
      await startRecording(async (audioBlob) => {
        try {
          setIsLoading(true);
          const text = await speechService.convertSpeechToText(audioBlob);
          if (text.trim()) {
            setInputMessage(text);
            setIsLoading(false);

            setTimeout(() => {
              if (submitButtonRef.current) {
                submitButtonRef.current.click();
              }
            }, 500);
          } else {
            toast({
              title: "No speech detected",
              description: "Please try speaking again",
              variant: "default",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to convert speech to text",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
          setIsInitializing(false);
        }
      });
    } catch (error) {
      setIsInitializing(false);
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-10">
      <button
        onClick={toggleChatbot}
        className="group relative rounded-full w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        {isChatbotOpen ? (
          <X className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 rotate-0 group-hover:rotate-90" />
        ) : (
          <Bot className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </button>

      {isChatbotOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-background rounded-2xl shadow-2xl flex flex-col border overflow-hidden">
          {/* Header with toggle TTS */}
          <div className="p-4 border-b bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-2 rounded-full transition-colors ${
                  ttsEnabled
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {ttsEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isBot={msg.isBot} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} /> {/* Element with scroll */}
          </div>

          {/* Input area */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : isInitializing
                    ? "bg-yellow-500 text-white"
                    : "bg-primary text-primary-foreground"
                } hover:bg-primary/90 disabled:opacity-50`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || isRecording}
                className="flex-1 px-4 py-2 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
              <button
                ref={submitButtonRef}
                onClick={() => handleSendMessage(ttsEnabled)}
                disabled={isLoading || isRecording}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;
