import { createContext, useContext, ReactNode } from "react";
import { useHospital } from "./HospitalContext";
import { Appointment } from "../types";

interface AppointmentContextType {
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, "id" | "status">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const { appointments, bookAppointment, updateAppointmentStatus } = useHospital();

  return (
    <AppointmentContext.Provider value={{ appointments, bookAppointment, updateAppointmentStatus }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useHospital();
  return {
    appointments: context.appointments,
    bookAppointment: context.bookAppointment,
    updateAppointmentStatus: context.updateAppointmentStatus,
  };
}
