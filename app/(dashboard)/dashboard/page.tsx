"use client";

import { useState } from "react";
import CameraInterface from "@/app/(camera)/recognize/page";
import ChatbotButton from "@/app/(chatbot)/components/ChatbotButton";
import VoiceWaveAnimation from "@/app/(chatbot)/components/VoiceWaveAnimation";
import { Button } from "@/components/ui/button";
import { Calendar, Cloud, UserCheck } from "lucide-react";

export default function DashboardPage() {
  const [weatherData] = useState({
    temperature: "25°C",
    condition: "Sunny",
  });

  return (
    <div className="container mx-auto p-4 grid grid-cols-12 gap-4">
      {/* Top Row */}
      <div className="col-span-4 bg-card rounded-lg p-4 border-[1px] border-neutral-300 shadow-sm">
        <VoiceWaveAnimation />
      </div>

      <div className="col-span-4 bg-card rounded-lg p-4 flex items-center justify-center border-[1px] border-neutral-300 shadow-sm">
        <div className="text-center">
          <Cloud className="w-10 h-10 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{weatherData.temperature}</h3>
          <p>{weatherData.condition}</p>
        </div>
      </div>

      <div className="col-span-2 bg-card rounded-lg flex items-center">
        <Button className="w-full h-full flex flex-col" variant="outline">
          <Calendar className="w-10 h-10" />
          <span className="block text-xl">Book</span>
        </Button>
      </div>

      <div className="col-span-2 bg-card rounded-lg flex items-center">
        <Button className="w-full h-full flex flex-col" variant="outline">
          <UserCheck className="w-10 h-10" />
          <span className="block text-xl">Check-in</span>
        </Button>
      </div>

      {/* Bottom Row */}
      <div className="col-span-8 bg-card rounded-lg overflow-hidden h-[500px]">
        <CameraInterface />
      </div>

      <div className="col-span-4 bg-card rounded-lg overflow-hidden h-[500px]">
        <ChatbotButton defaultOpen={true} />
      </div>
    </div>
  );
}
