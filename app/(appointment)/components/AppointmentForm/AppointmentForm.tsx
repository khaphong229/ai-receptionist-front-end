import React, { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomerId } from "@/utils/localStorage";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker24h } from "@/components/custom/date-time-picker";
import { appointmentService } from "@/services/appointment";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormData {
  customer_id: string;
  appointment_date: string;
  appointment_time: string;
  table_number: string;
  notes: string;
}

const formDefaultData: FormData = {
  customer_id: "",
  appointment_date: "",
  appointment_time: "",
  table_number: "",
  notes: "",
};

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  children: React.ReactNode;
}

interface DialogHeaderProps
  extends React.ComponentPropsWithoutRef<typeof DialogHeader> {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogTitle> {
  children: React.ReactNode;
}

export default function AppointmentForm({
  open,
  setOpen,
}: AppointmentFormProps) {
  const [date, setDate] = React.useState<Date>();
  const [isUser, setIsUser] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData>(formDefaultData);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");
  const [showQrCode, setShowQrCode] = React.useState<boolean>(false);

  useEffect(() => {
    const customerId = CustomerId.getCustomerId();
    if (customerId) {
      setIsUser(true);
      setFormData((prev) => ({
        ...prev,
        customer_id: customerId,
      }));
    }
  }, [open]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        appointment_date: format(date, "yyyy-MM-dd"),
        appointment_time: format(date, "HH:mm"),
      }));
    }
  };

  const handleTableChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      table_number: value,
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await appointmentService.createAppointment(formData);
      if (response.status === "success") {
        setQrCodeUrl(response.data.qr_code_url);
        setShowQrCode(true);
        toast({
          title: "Success",
          description: "Appointment booked successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to book appointment",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
      });
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          {showQrCode ? (
            <div className="sm:max-w-[425px]">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                  Your Appointment QR Code
                </DialogPrimitive.Title>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                <div className="relative w-64 h-64">
                  <Image
                    src={`http://localhost:5000/${qrCodeUrl}`}
                    alt="Appointment QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-center text-gray-500">
                  Please save this QR code. You'll need it to check in for your
                  appointment.
                </p>
                <button
                  type="button"
                  className={buttonVariants({ variant: "secondary" })}
                  onClick={() => {
                    setShowQrCode(false);
                    setOpen(false);
                    setFormData(formDefaultData);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : isUser ? (
            <div className="sm:max-w-[425px]">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                  Book Appointment
                </DialogPrimitive.Title>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Table Number</Label>
                  <Select
                    required={true}
                    onValueChange={(value) => handleTableChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a table number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Table Number</SelectLabel>
                        <SelectItem value="1">Table 1</SelectItem>
                        <SelectItem value="2">Table 2</SelectItem>
                        <SelectItem value="3">Table 3</SelectItem>
                        <SelectItem value="4">Table 4</SelectItem>
                        <SelectItem value="5">Table 5</SelectItem>
                        <SelectItem value="6">Table 6</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <DateTimePicker24h onChange={handleDateChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    placeholder="Enter notes"
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Book Appointment</Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="sm:max-w-[425px]">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                  Appointment Form
                </DialogPrimitive.Title>
              </div>
              <div className="flex flex-col items-center justify-center mt-4">
                <p>Please recognize your face to book an appointment</p>
              </div>
            </div>
          )}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
