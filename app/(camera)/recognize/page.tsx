"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader, MessageCircle, UserRound } from "lucide-react";
import Webcam from "react-webcam";
import Snowfall from "react-snowfall";
import { useToast } from "@/hooks/use-toast";
import UpdateCustomerModal from "@/app/(camera)/components/UpdateCustomerModal";
import { API } from "@/constants/api";
import { faceService } from "@/services/face";
import { CustomerId } from "@/utils/localStorage";

export default function CameraInterface() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [captureCount, setCaptureCount] = useState<number>(0);
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [type, setType] = useState<string>("");
  const [isUpdateCustomerModalOpen, setIsUpdateCustomerModalOpen] =
    useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);

  const { toast } = useToast();

  const capture = async () => {
    if (webcamRef.current) {
      try {
        setIsLoading(true);
        setCaptureCount(0);
        const images: string[] = [];

        // Chụp 10 ảnh
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          const imageSrc = webcamRef.current?.getScreenshot();
          if (imageSrc) {
            images.push(imageSrc.split(",")[1]);
            setCaptureCount((prev) => prev + 1);
          }
        }

        setImageSrc(
          images.length > 0
            ? `data:image/jpeg;base64,${images[images.length - 1]}`
            : null
        );

        const result = await faceService.recognize(images);

        if (result.status === "success") {
          // Xóa customer_id cũ trước khi set mới
          CustomerId.deleteCustomerId();
          setCustomerInfo({});
          setType("");

          toast({
            title: "Success",
            description: result.message,
          });

          if (result.message === "Customer found") {
            CustomerId.setCustomerId(result.customer.id);
            setCustomerInfo(result.customer);
            setType("confirm");
            setIsUpdateCustomerModalOpen(true);
          } else if (result.message === "New customer created") {
            const newCustomerId = result.customer_id;
            CustomerId.setCustomerId(newCustomerId);
            setType("update");
            setIsUpdateCustomerModalOpen(true);
          }
        } else {
          toast({
            title: "Failed",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed",
          description:
            error instanceof Error ? error.message : "An error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <UpdateCustomerModal
        type={type}
        customerInfo={customerInfo}
        open={isUpdateCustomerModalOpen}
        onOpenChange={setIsUpdateCustomerModalOpen}
        capturedImage={imageSrc}
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Button
            onClick={capture}
            disabled={isLoading}
            className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-md hover:bg-background/90 transition-colors text-primary"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Camera className="w-4 h-4 mr-2" />
            )}
            {isLoading ? `Capturing... (${captureCount}/10)` : "Capture photos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
