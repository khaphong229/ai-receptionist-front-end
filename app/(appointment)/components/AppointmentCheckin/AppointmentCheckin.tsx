"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { appointmentService } from "@/services/appointment";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerId } from "@/utils/localStorage";

interface AppointmentInfo {
  id: string;
  customer_name: string;
  appointment_datetime: string | { $date: string };
  appointment_time: string;
  table_number: string;
  notes: string;
  status: string;
}

// Function to safely parse date strings from different formats
const parseAppointmentDateTime = (dateValue: string | { $date: string }) => {
  try {
    // Handle MongoDB $date format
    if (typeof dateValue === "object" && dateValue.$date) {
      return new Date(dateValue.$date);
    }

    // Handle ISO string format
    return new Date(dateValue);
  } catch (error) {
    console.error("Error parsing date:", error);
    return new Date(); // Fallback to current date
  }
};

// Function to extract formatted time from appointment_datetime
const extractTimeFromDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Lấy giờ UTC
  const minutes = date.getUTCMinutes().toString().padStart(2, "0"); // Lấy phút UTC
  return `${hours}:${minutes}`;
};

export default function AppointmentCheckin() {
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentInfo, setAppointmentInfo] =
    useState<AppointmentInfo | null>(null);
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
  const [activeTab, setActiveTab] = useState("qr");
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    if (activeTab === "qr" && isScanning) {
      // Initialize QR Scanner
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const onScanSuccess = async (decodedText: string) => {
        console.log(decodedText, "plll");

        try {
          setIsScanning(false);
          scanner.clear();
          setIsLoading(true);
          const appointmentId = JSON.parse(decodedText).appointment_id;
          console.log(appointmentId, "appointmentId");

          // Get appointment info
          const response = await appointmentService.getAppointments(
            appointmentId
          );
          if (response.status === "success") {
            setAppointmentInfo(response.data);
          } else {
            toast({
              title: "Error",
              description: "Invalid QR code or appointment not found",
              variant: "destructive",
            });
            // Restart scanning
            setIsScanning(true);
            scanner.render(onScanSuccess, onScanError);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get appointment information",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      const onScanError = (error: any) => {
        console.warn(error);
      };

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [activeTab, isScanning]);

  // Auto fetch appointments on manual tab switch
  useEffect(() => {
    if (activeTab === "manual") {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchAppointments = async () => {
    try {
      setIsLoadingList(true);
      const customerId = CustomerId.getCustomerId();

      if (!customerId) {
        toast({
          title: "Customer ID not found",
          description: "Please recognize a customer profile first",
          variant: "destructive",
        });
        return;
      }

      const response = await appointmentService.getAllAppointments(customerId);
      if (response.status === "success" && response.data.length > 0) {
        setAppointments(response.data);
      } else {
        toast({
          title: "No appointments found",
          description: "No appointments found for your account",
        });
        setAppointments([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleCheckin = async (appointmentId: string) => {
    try {
      setIsLoading(true);
      const response = await appointmentService.verifyAppointment(
        appointmentId
      );

      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Check-in successful!",
        });
        // Remove checked-in appointment from the list
        setAppointments((prev) =>
          prev.filter((app) => app.id !== appointmentId)
        );
        setAppointmentInfo(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message === "Invalid check-in time"
            ? "It's not time to check in yet"
            : "Error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescan = () => {
    setAppointmentInfo(null);
    setIsScanning(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAppointmentInfo(null);

    if (value === "qr") {
      setIsScanning(true);
      setAppointments([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs
        defaultValue="qr"
        className="w-full flex flex-col h-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">QR Code Scanner</TabsTrigger>
          <TabsTrigger value="manual">My Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="flex-1 overflow-auto">
          {isScanning ? (
            <div className="flex-1 flex items-center justify-center">
              <div id="qr-reader" className="w-full max-w-[500px]" />
            </div>
          ) : appointmentInfo ? (
            <AppointmentDetails
              appointmentInfo={appointmentInfo}
              onCheckin={() => handleCheckin(appointmentInfo._id)}
              onRescan={handleRescan}
              isLoading={isLoading}
            />
          ) : null}
        </TabsContent>

        <TabsContent value="manual" className="flex-1 overflow-auto">
          <div className="p-4">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : appointments.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">My Appointments</h3>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">
                          {
                            JSON.parse(
                              localStorage.getItem("customerInfo") || "{}"
                            )?.full_name
                          }
                        </span>
                        <span>{appointment.customer_name}</span>
                        <span className="font-medium">Date:</span>
                        <span>
                          {format(
                            parseAppointmentDateTime(
                              appointment.appointment_datetime
                            ),
                            "MMMM d, yyyy"
                          )}
                        </span>
                        <span className="font-medium">Time:</span>
                        <span>
                          {extractTimeFromDateTime(
                            appointment.appointment_datetime.$date
                          )}
                        </span>
                        <span className="font-medium">Table Number:</span>
                        <span>{appointment.table_number}</span>
                        <span className="font-medium">Status:</span>
                        <span
                          className={
                            appointment.status === "pending"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleCheckin(appointment._id)}
                        disabled={isLoading || appointment.status !== "pending"}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking in...
                          </>
                        ) : (
                          "Check-in"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No appointments found for your account.</p>
                <Button
                  onClick={fetchAppointments}
                  variant="outline"
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AppointmentDetailsProps {
  appointmentInfo: AppointmentInfo;
  onCheckin: () => void;
  onRescan: () => void;
  isLoading: boolean;
}

function AppointmentDetails({
  appointmentInfo,
  onCheckin,
  onRescan,
  isLoading,
}: AppointmentDetailsProps) {
  return (
    <div className="flex-1 p-6 flex flex-col">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Appointment Details</h2>
        <div className="grid gap-2">
          <div className="grid grid-cols-2">
            <span className="font-medium">Customer Name:</span>
            <span>
              {
                JSON.parse(localStorage.getItem("customerInfo") || "{}")
                  ?.full_name
              }
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Date:</span>
            <span>
              {format(
                parseAppointmentDateTime(appointmentInfo.appointment_datetime),
                "MMMM d, yyyy"
              )}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Time:</span>
            <span>
              {extractTimeFromDateTime(
                appointmentInfo.appointment_datetime.$date
              )}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Table Number:</span>
            <span>{appointmentInfo.table_number}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Status:</span>
            <span
              className={
                appointmentInfo.status === "pending"
                  ? "text-yellow-500"
                  : "text-green-500"
              }
            >
              {appointmentInfo.status.charAt(0).toUpperCase() +
                appointmentInfo.status.slice(1)}
            </span>
          </div>
          {appointmentInfo.notes && (
            <div className="grid grid-cols-2">
              <span className="font-medium">Notes:</span>
              <span>{appointmentInfo.notes}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <Button onClick={onCheckin} className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking in...
            </>
          ) : (
            "Confirm Check-in"
          )}
        </Button>
        <Button onClick={onRescan} variant="outline" disabled={isLoading}>
          Scan Another
        </Button>
      </div>
    </div>
  );
}
