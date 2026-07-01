import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Department,
  Doctor,
  Patient,
  Medicine,
  Appointment,
  Invoice,
  LabTest,
  Bed,
  AuditLog,
  Notification,
  MedicalHistoryItem,
  VitalItem,
  PaymentItem,
} from "../types";
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_MEDICINES,
  INITIAL_BEDS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_LABTESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from "../data/mockData";
import { useAuth } from "./AuthContext";

export interface HospitalContextType {
  departments: Department[];
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  invoices: Invoice[];
  beds: Bed[];
  medicines: Medicine[];
  labTests: LabTest[];
  logs: AuditLog[];
  notifications: Notification[];

  addPatient: (patientData: Omit<Patient, "id" | "vitals" | "medicalHistory">) => string;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;

  addDoctor: (doctorData: Omit<Doctor, "id" | "rating">) => void;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (id: string) => void;

  bookAppointment: (appointmentData: Omit<Appointment, "id" | "status">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;

  addMedicalHistory: (patientId: string, diagnosis: string, treatment: string, notes?: string) => void;
  addVitals: (patientId: string, bp: string, hr: number, temp: number, spo2: number, weight?: number, recordedBy?: string) => void;

  prescribeMedicine: (patientId: string, doctorName: string, medicineName: string, dosage: string) => void;
  dispensePrescription: (patientId: string, prescriptionId: string) => void;
  restockMedicine: (id: string, qty: number) => void;

  generateInvoice: (invoiceData: Omit<Invoice, "id" | "paymentHistory" | "status">) => void;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: string) => void;

  releaseBed: (bedId: string) => void;
  assignBed: (bedId: string, patientId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  globalSearch: (query: string) => { patients: Patient[]; doctors: Doctor[]; medicines: Medicine[] };
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Load state from localStorage or use mock seed values
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem("medicare_patients");
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem("medicare_doctors");
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("medicare_appointments");
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem("medicare_invoices");
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem("medicare_beds");
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem("medicare_medicines");
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [labTests, setLabTests] = useState<LabTest[]>(() => {
    const saved = localStorage.getItem("medicare_labtests");
    return saved ? JSON.parse(saved) : INITIAL_LABTESTS;
  });

  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("medicare_logs");
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("medicare_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("medicare_patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("medicare_doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("medicare_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("medicare_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("medicare_beds", JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem("medicare_medicines", JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem("medicare_labtests", JSON.stringify(labTests));
  }, [labTests]);

  useEffect(() => {
    localStorage.setItem("medicare_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("medicare_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Logging & Notification Helpers
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userEmail: user?.email || "system@medicare.com",
      role: user?.role || "System",
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const notify = (title: string, message: string, type: "info" | "warning" | "success" = "info") => {
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Patient Operations
  const addPatient = (patientData: Omit<Patient, "id" | "vitals" | "medicalHistory">) => {
    const id = `pat-${Math.floor(100 + Math.random() * 900)}`;
    const newPatient: Patient = {
      ...patientData,
      id,
      vitals: [],
      medicalHistory: [],
    };
    setPatients((prev) => [...prev, newPatient]);
    logAction("Register Patient", `Registered new patient: ${patientData.name} (${id})`);
    notify("Patient Registered", `Patient ${patientData.name} has been added to the system.`, "success");
    return id;
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
    logAction("Update Patient", `Updated medical record for: ${updatedPatient.name}`);
  };

  const deletePatient = (id: string) => {
    const target = patients.find((p) => p.id === id);
    if (!target) return;
    setPatients((prev) => prev.filter((p) => p.id !== id));
    logAction("Delete Patient", `Deleted patient chart: ${target.name} (${id})`);
    notify("Patient Chart Deleted", `Removed patient ${target.name} from Medicare.`, "warning");
  };

  // Doctor Operations
  const addDoctor = (doctorData: Omit<Doctor, "id" | "rating">) => {
    const id = `doc-${Math.floor(100 + Math.random() * 900)}`;
    const newDoctor: Doctor = {
      ...doctorData,
      id,
      rating: 5.0,
    };
    setDoctors((prev) => [...prev, newDoctor]);
    logAction("Add Doctor", `Added specialist physician: ${doctorData.name}`);
    notify("Doctor Enrolled", `Dr. ${doctorData.name} added to ${doctorData.department}.`, "success");
  };

  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctors((prev) => prev.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d)));
    logAction("Update Doctor", `Updated profiles of Dr. ${updatedDoctor.name}`);
  };

  const deleteDoctor = (id: string) => {
    const target = doctors.find((d) => d.id === id);
    if (!target) return;
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    logAction("Delete Doctor", `Removed Doctor profile: ${target.name} (${id})`);
  };

  // Appointment Operations
  const bookAppointment = (appointmentData: Omit<Appointment, "id" | "status">) => {
    const id = `app-${Math.floor(100 + Math.random() * 900)}`;
    const newAppointment: Appointment = {
      ...appointmentData,
      id,
      status: "Pending",
    };
    setAppointments((prev) => [...prev, newAppointment]);
    logAction("Book Appointment", `Booked visit for ${appointmentData.patientName} with Dr. ${appointmentData.doctorName}`);
    notify("Appointment Booked", `New appointment request created for ${appointmentData.patientName}.`, "info");
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const target = appointments.find((a) => a.id === id);
    if (target) {
      logAction("Update Appointment Status", `Set appointment ${id} status to ${status}`);
      notify("Appointment Status", `Appointment with Dr. ${target.doctorName} is now ${status}.`, status === "Completed" ? "success" : "info");
    }
  };

  // Medical Records and Vitals
  const addMedicalHistory = (patientId: string, diagnosis: string, treatment: string, notes?: string) => {
    const newItem: MedicalHistoryItem = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      diagnosis,
      treatment,
      notes,
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, medicalHistory: [newItem, ...p.medicalHistory] }
          : p
      )
    );
    logAction("Add Medical History", `Added diagnostic note to patient: ${patientId}`);
  };

  const addVitals = (
    patientId: string,
    bp: string,
    hr: number,
    temp: number,
    spo2: number,
    weight?: number,
    recordedBy: string = "Nursing Station"
  ) => {
    const newVitals: VitalItem = {
      id: `vit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      bp,
      hr,
      temp,
      spo2,
      weight,
      recordedBy,
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, vitals: [newVitals, ...p.vitals] } : p
      )
    );
    logAction("Record Vitals", `Recorded physiological vital markers for patient: ${patientId}`);
  };

  // Medicine & Prescriptions
  const prescribeMedicine = (patientId: string, doctorName: string, medicineName: string, dosage: string) => {
    // Locate standard medicine details
    const targetMed = medicines.find((m) => m.name.toLowerCase() === medicineName.toLowerCase());
    
    // Add to patient's clinical prescription list
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        
        // Let's model current patient prescriptions. Since we need to match dynamic prescriptions,
        // we can store them. Wait, let's keep it safe. If patient has prescriptions:
        // Wait! In typescript, Patient has medicalHistory & vitals. Does it have prescriptions?
        // Let's extend Patient object if prescriptions doesn't exist, or just append it.
        // Let's cast patient or update its prescriptions array:
        const updatedPrescriptions = (p as any).prescriptions || [];
        const newPres: any = {
          id: `prx-${Math.floor(100 + Math.random() * 900)}`,
          medicineName,
          dosage,
          doctorName,
          date: new Date().toISOString().split("T")[0],
          status: "Pending",
        };
        return {
          ...p,
          prescriptions: [newPres, ...updatedPrescriptions],
        };
      })
    );

    logAction("Prescribe Medication", `Dr. ${doctorName} prescribed ${medicineName} to ${patientId}`);
    notify("Prescription Sent", `${medicineName} prescription sent to pharmacy department.`, "info");
  };

  const dispensePrescription = (patientId: string, prescriptionId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const currentPres = (p as any).prescriptions || [];
        const updatedPres = currentPres.map((pr: any) => {
          if (pr.id === prescriptionId) {
            // Deduct drug stock if matching medicine
            const med = medicines.find((m) => m.name.toLowerCase() === pr.medicineName.toLowerCase());
            if (med) {
              setMedicines((prevMeds) =>
                prevMeds.map((m) =>
                  m.id === med.id ? { ...m, stock: Math.max(0, m.stock - 10) } : m
                )
              );
            }
            return { ...pr, status: "Dispensed" };
          }
          return pr;
        });
        return {
          ...p,
          prescriptions: updatedPres,
        };
      })
    );
    logAction("Dispense Prescription", `Dispensed medicine prescription ${prescriptionId}`);
  };

  const restockMedicine = (id: string, qty: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: m.stock + qty } : m))
    );
    const target = medicines.find((m) => m.id === id);
    if (target) {
      logAction("Restock Pharmacy", `Restocked ${qty} units of ${target.name}`);
      notify("Pharmacy Replenished", `Restocked ${qty} units of ${target.name}.`, "success");
    }
  };

  // Billing Operations
  const generateInvoice = (invoiceData: Omit<Invoice, "id" | "paymentHistory" | "status">) => {
    const id = `inv-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id,
      status: "Unpaid",
      paymentHistory: [],
    };
    setInvoices((prev) => [...prev, newInvoice]);
    logAction("Generate Billing Invoice", `Issued Invoice ${id} totaling ${invoiceData.totalAmount}`);
    notify("Billing Invoice Generated", `Outstanding invoice of $${invoiceData.totalAmount} issued for ${invoiceData.patientName}.`, "info");
  };

  const payInvoice = (invoiceId: string, amount: number, paymentMethod: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newHistory: PaymentItem = {
            id: `pay-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            amount,
            paymentMethod,
          };
          return {
            ...inv,
            status: "Paid",
            paymentMethod,
            paymentHistory: [...inv.paymentHistory, newHistory],
          };
        }
        return inv;
      })
    );
    logAction("Pay Invoice Bill", `Processed invoice payment of ${amount} via ${paymentMethod}`);
    notify("Payment Successful", `Cleared invoice bill ${invoiceId} successfully.`, "success");
  };

  // Bed Operations
  const releaseBed = (bedId: string) => {
    const bed = beds.find((b) => b.id === bedId);
    if (!bed) return;

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: "Available", patientId: undefined, patientName: undefined }
          : b
      )
    );

    // Update patient status to outpatient
    if (bed.patientId) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === bed.patientId
            ? { ...p, admissionStatus: "Discharged", bedId: undefined }
            : p
        )
      );
    }

    logAction("Release Inpatient Bed", `Cleared bed ${bed.roomNumber}`);
    notify("Ward Bed Released", `Bed ${bed.roomNumber} is now vacant and clean.`, "success");
  };

  const assignBed = (bedId: string, patientId: string) => {
    const bed = beds.find((b) => b.id === bedId);
    const patientObj = patients.find((p) => p.id === patientId);
    if (!bed || !patientObj) return;

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: "Occupied", patientId, patientName: patientObj.name }
          : b
      )
    );

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              admissionStatus: "Admitted",
              bedId,
              admissionDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );

    logAction("Assign Bed Ward", `Assigned patient ${patientObj.name} to bed ${bed.roomNumber}`);
    notify("Patient Bed Allocated", `Allocated Bed ${bed.roomNumber} to ${patientObj.name}.`, "info");
  };

  // Notification read managers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const globalSearch = (query: string) => {
    const q = query.toLowerCase();
    const matchedPatients = patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
    const matchedDoctors = doctors.filter(
      (d) => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.department.toLowerCase().includes(q)
    );
    const matchedMedicines = medicines.filter(
      (m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    );
    return {
      patients: matchedPatients,
      doctors: matchedDoctors,
      medicines: matchedMedicines,
    };
  };

  return (
    <HospitalContext.Provider
      value={{
        departments,
        patients,
        doctors,
        appointments,
        invoices,
        beds,
        medicines,
        labTests,
        logs,
        notifications,

        addPatient,
        updatePatient,
        deletePatient,

        addDoctor,
        updateDoctor,
        deleteDoctor,

        bookAppointment,
        updateAppointmentStatus,

        addMedicalHistory,
        addVitals,

        prescribeMedicine,
        dispensePrescription,
        restockMedicine,

        generateInvoice,
        payInvoice,

        releaseBed,
        assignBed,

        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        globalSearch,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
}
