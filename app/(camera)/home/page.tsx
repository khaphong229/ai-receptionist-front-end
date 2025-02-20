"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Webcam from "react-webcam";
import Snowfall from "react-snowfall";
import { useToast } from "@/hooks/use-toast";
import UpdateCustomerModal from "@/app/(camera)/components/UpdateCustomerModal";
import { API } from "@/constants/api";

export default function CameraInterface() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [customer, setCustomer] = useState<any>({});
  const [isUpdateCustomerModalOpen, setIsUpdateCustomerModalOpen] =
    useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);

  const { toast } = useToast();

  const capture = async () => {
    if (webcamRef.current) {
      try {
        setIsLoading(true);
        const imageSrc = webcamRef.current.getScreenshot();

        const base64Data = imageSrc?.split(",")[1];
        const response = await fetch(API.FACE.RECOGNIZE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Data,
          }),
        });
        const data = await response.json();
        console.log(data);

        if (data.status === "success") {
          toast({
            title: "Success",
            description: data.message,
          });
          if (data.message === "Customer found") {
            setCustomer(data.customer);
          } else {
            setIsUpdateCustomerModalOpen(true);
          }
        }
      } catch (error) {
        toast({
          title: "Failed",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <UpdateCustomerModal
        open={isUpdateCustomerModalOpen}
        onOpenChange={setIsUpdateCustomerModalOpen}
        captureImage={imageSrc}
      />
      <Snowfall
        snowflakeCount={20}
        color="grey"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
        speed={[1, 3]}
        radius={[1, 3]}
      />
      <div className="w-full max-w-5xl aspect-video relative overflow-hidden rounded-lg bg-background shadow-xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4">
          <Button
            onClick={capture}
            disabled={isLoading}
            className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-md hover:bg-background/90 transition-colors text-primary"
          >
            {isLoading ? "Capturing..." : "Capture photo"}
          </Button>
        </div>
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-primary p-2 bg-background/80 backdrop-blur-sm rounded-md hover:bg-background/90 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {isChatOpen && (
        <div className="absolute bottom-20 right-4 w-64 h-80 bg-background rounded-lg shadow-xl p-4">
          <p className="text-center">Chatbot Interface</p>
        </div>
      )}
    </div>
  );
}
