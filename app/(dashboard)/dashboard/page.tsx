"use client";

import { useState } from "react";
import CameraInterface from "@/app/(camera)/recognize/page";
import ChatbotButton from "@/app/(chatbot)/components/ChatbotButton";
import VoiceWaveAnimation from "@/app/(chatbot)/components/VoiceWaveAnimation";
import { Button } from "@/components/ui/button";
import { Calendar, Cloud, UserCheck } from "lucide-react";
import AppointmentForm from "@/app/(appointment)/components/AppointmentForm";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [weatherData] = useState({
    temperature: "25°C",
    condition: "Sunny",
  });

  const openAppointmentForm = () => {
    setIsOpenForm(true);
  };

  const openCheckInCamera = () => {
    setIsOpenCamera(true);
  };

  return (
    <>
      <div className="container mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Top Row */}
        <div className="col-span-4 bg-card rounded-lg p-4 border-[1px] border-input shadow-sm">
          <VoiceWaveAnimation />
        </div>

        <div className="col-span-4 bg-card rounded-lg p-4 flex items-center justify-center border-[1px] border-input shadow-sm">
          <div className="text-center">
            <Cloud className="w-10 h-10 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{weatherData.temperature}</h3>
            <p>{weatherData.condition}</p>
          </div>
        </div>

        <div className="col-span-2 rounded-lg flex items-center">
          <Button
            variant="outline"
            className="w-full h-full flex flex-col items-center justify-center p-4 "
            onClick={openAppointmentForm}
          >
            <Calendar className="w-10 h-10" />
            <span className="block text-xl mt-2">Book</span>
          </Button>
        </div>

        <div className="col-span-2 rounded-lg flex items-center">
          <Button
            variant="outline"
            className="w-full h-full flex flex-col items-center justify-center p-4 "
            onClick={openCheckInCamera}
          >
            <UserCheck className="w-10 h-10" />
            <span className="block text-xl mt-2">Check-in</span>
          </Button>
        </div>

        {/* Bottom Row */}
        <div className="col-span-8 bg-card rounded-lg overflow-hidden h-[600px]">
          <CameraInterface />
        </div>

        <div className="col-span-4 bg-card rounded-lg overflow-hidden h-[600px]">
          <ChatbotButton defaultOpen={true} />
        </div>
      </div>

      <AppointmentForm open={isOpenForm} setOpen={setIsOpenForm} />

      <DialogPrimitive.Root open={isOpenCamera} onOpenChange={setIsOpenCamera}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[600px]">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                Check-in QR Scanner
              </DialogPrimitive.Title>
            </div>
            <div className="h-[400px]">
              <CameraInterface />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
