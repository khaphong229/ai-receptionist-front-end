import VoiceWaveAnimation from "../components/VoiceWaveAnimation";
import ChatbotButton from "../components/ChatbotButton";

export default function ChatPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background">
      <VoiceWaveAnimation />
      <ChatbotButton />
    </main>
  );
}
