import { createContext, useContext, ReactNode } from "react";
import { useHospital } from "./HospitalContext";
import { Patient } from "../types";

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "vitals" | "medicalHistory">) => string;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  addMedicalHistory: (patientId: string, diagnosis: string, treatment: string, notes?: string) => void;
  addVitals: (patientId: string, bp: string, hr: number, temp: number, spo2: number, weight?: number, recordedBy?: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const { patients, addPatient, updatePatient, deletePatient, addMedicalHistory, addVitals } = useHospital();

  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, addMedicalHistory, addVitals }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useHospital();
  return {
    patients: context.patients,
    addPatient: context.addPatient,
    updatePatient: context.updatePatient,
    deletePatient: context.deletePatient,
    addMedicalHistory: context.addMedicalHistory,
    addVitals: context.addVitals,
  };
}
