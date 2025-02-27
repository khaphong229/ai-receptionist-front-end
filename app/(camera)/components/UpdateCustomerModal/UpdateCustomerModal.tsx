import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { ocrService } from "@/services/ocr";
import { CustomerId } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { Loader2, Maximize, Eye, EyeOff } from "lucide-react";

interface UpdateCustomerModalProps {
  type: string;
  customerInfo: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  capturedImage?: string | null;
}

const customerDefaultData = {
  customer_id: "",
  full_name: "",
  phone: "",
  email: "",
  id_number: "",
  date_of_birth: format(new Date(), "dd/MM/yyyy"),
  gender: "",
  nationality: "",
  place_of_origin: "",
  place_of_residence: "",
};

export function UpdateCustomerModal({
  type,
  customerInfo,
  open,
  onOpenChange,
  capturedImage,
}: UpdateCustomerModalProps) {
  const [formData, setFormData] = useState(customerDefaultData);
  const [showIdNumber, setShowIdNumber] = useState(false);

  useEffect(() => {
    setFormData(customerDefaultData);
    if (open) {
      if (type === "confirm") {
        setFormData(customerInfo);
      } else {
        const currentCustomerId = CustomerId.getCustomerId();
        setFormData((prev) => ({
          ...prev,
          customer_id: currentCustomerId || "",
        }));
      }
    }
  }, [open, type, customerInfo]);

  const [isLoading, setIsLoading] = useState(false);
  const [isExtractSuccess, setIsExtractSuccess] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanId = async () => {
    if (!webcamRef.current) return;

    try {
      setIsLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();
      const result = await ocrService.extractId(imageSrc);
      if (result.status === "success") {
        const formattedData = {
          ...result.data,
          date_of_birth: result.data.date_of_birth
            ? format(
                new Date(
                  result.data.date_of_birth.split("/").reverse().join("-")
                ),
                "dd/MM/yyyy"
              )
            : format(new Date(), "dd/MM/yyyy"),
        };

        setFormData((prev) => ({
          ...prev,
          ...formattedData,
        }));

        toast({
          title: "Success",
          description: "ID card scanned successfully",
        });
        setIsExtractSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan ID card",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadId = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await ocrService.extractId(file);
      if (result.status === "success") {
        setFormData((prev) => ({
          ...prev,
          ...result.data,
        }));
        toast({
          title: "Success",
          description: "ID card uploaded successfully",
        });
        setIsExtractSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload ID card",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentCustomerId = CustomerId.getCustomerId();
      const dataToSubmit = {
        ...formData,
        customer_id: currentCustomerId,
      };

      const response = await ocrService.updateCustomer(dataToSubmit);
      if (response.status === "success") {
        toast({
          title: "Success",
          description: `${
            type === "update"
              ? "Customer profile created successfully"
              : "Confirm information successfully"
          }`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to create customer profile",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer profile",
      });
    }
  };

  const handleChange =
    (field: keyof typeof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleRadioChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const formatDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const parseDate = (dateStr: string | undefined | null): Date => {
    if (!dateStr) return new Date();
    try {
      return new Date(dateStr.split("/").reverse().join("-"));
    } catch {
      return new Date();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === "confirm"
                ? "Confirm Customer Information"
                : "Create New Customer Profile"}
            </DialogTitle>
            <DialogDescription>
              {type === "confirm"
                ? "Please confirm the customer information in your profile."
                : "Please enter customer information to create a new profile."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-center">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange("email")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-center ">
                Phone
              </Label>
              <Input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange("phone")}
                className="col-span-3"
                required
              />
            </div>
            {type === "update" && (
              <div className="w-full">
                <Tabs defaultValue="scan">
                  <TabsList className="w-full">
                    <TabsTrigger className="w-full" value="scan">
                      Scan ID Card
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="upload">
                      Upload ID Card
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="scan" className="relative">
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="w-full h-[200px] rounded-xl object-cover"
                      />
                      <Button
                        type="button"
                        onClick={handleScanId}
                        disabled={isLoading}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Maximize className="w-4 h-4 mr-2" />
                        )}
                        Scan ID
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="upload">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadId}
                        disabled={isLoading}
                      />
                      {isLoading && (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            {(isExtractSuccess || type === "confirm") && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="id_number" className="text-center">
                      Card Number
                    </Label>
                    <div className="relative w-full">
                      <Input
                        type={showIdNumber ? "text" : "password"}
                        id="id_number"
                        value={formData.id_number}
                        onChange={handleChange("id_number")}
                        className="w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowIdNumber(!showIdNumber)}
                      >
                        {showIdNumber ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="full_name" className="text-center">
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange("full_name")}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="date_of_birth" className="text-center">
                      Date of Birth
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date_of_birth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {formData.date_of_birth || <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={parseDate(formData.date_of_birth)}
                          onSelect={(date) => {
                            if (date) {
                              setFormData((prev) => ({
                                ...prev,
                                date_of_birth: formatDate(date),
                              }));
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="gender" className="text-center">
                      Gender
                    </Label>
                    <RadioGroup
                      defaultValue="male"
                      className="flex my-2 gap-2"
                      onValueChange={handleRadioChange("gender")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="r1" />
                        <Label htmlFor="r1">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="r2" />
                        <Label htmlFor="r2">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="place_of_residence" className="text-center">
                      Address
                    </Label>
                    <Input
                      id="place_of_residence"
                      value={formData.place_of_residence}
                      onChange={handleChange("place_of_residence")}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">
              {type === "confirm" ? "Confirm" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
