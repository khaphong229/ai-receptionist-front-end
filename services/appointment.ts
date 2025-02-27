import { API } from "@/constants/api";

interface Appointment {
  customer_id: string;
  appointment_date: string;
  appointment_time: string;
  table_number: string;
  notes: string;
}

export const appointmentService = {
  getAppointments: async (appointmentId: string) => {
    try {
      const response = await fetch(`${API.APPOINTMENT.GET}/${appointmentId}`, {
        method: "GET",
      });
      return response.json();
    } catch (error) {
      throw new Error("Failed to get appointments");
    }
  },
  createAppointment: async (appointment: Appointment) => {
    try {
      const response = await fetch(API.APPOINTMENT.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to create appointment");
    }
  },
  verifyAppointment: async (appointmentId: string) => {
    try {
      const response = await fetch(`${API.APPOINTMENT.VERIFY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to verify appointment");
    }
  },
  getAllAppointments: async (id: string) => {
    try {
      const response = await fetch(
        `${API.APPOINTMENT.GET_ALL}/${id}/appointments`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to get all appointments");
    }
  },
};
