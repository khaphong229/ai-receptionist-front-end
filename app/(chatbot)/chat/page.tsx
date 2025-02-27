"use client";

import VoiceWaveAnimation from "../components/VoiceWaveAnimation";
import ChatbotButton from "../components/ChatbotButton";
import Snowfall from "react-snowfall";

export default function ChatPage() {
  return (
    <>
      <Snowfall
        snowflakeCount={100}
        color="grey"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: -9,
        }}
        speed={[1, 3]}
        radius={[1, 3]}
      />
      <main className="relative min-h-screen flex items-center justify-center bg-background">
        <VoiceWaveAnimation />
        <ChatbotButton />
      </main>
    </>
  );
}
