"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Webcam from "react-webcam";

interface WebcamRef {
  getScreenshot: () => string | null;
}

export default function CameraInterface() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl aspect-video relative overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <Button className="absolute bottom-4 left-4" onClick={capture}>
          Capture photo
        </Button>
        <Button
          className="absolute bottom-4 right-4"
          size="icon"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </Card>
      {isChatOpen && (
        <Card className="absolute bottom-20 right-4 w-64 h-80 p-4">
          <p className="text-center">Chatbot Interface</p>
        </Card>
      )}
    </div>
  );
}
