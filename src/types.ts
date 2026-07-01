export type UserRole = 'Admin' | 'Doctor' | 'Receptionist' | 'Nurse' | 'Pharmacist' | 'Patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  department?: string;
  specialization?: string;
  avatarUrl?: string;
}

export interface MedicalHistoryItem {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface VitalItem {
  id: string;
  timestamp: string;
  bp: string; // Blood pressure (e.g. 120/80)
  hr: number; // Heart rate (bpm)
  temp: number; // Temperature (°F or °C)
  spo2: number; // Oxygen Saturation (%)
  weight?: number; // Weight in lbs/kg
  recordedBy: string; // Name of Nurse
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  email: string;
  phone: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  admissionStatus: 'Discharged' | 'Admitted' | 'Outpatient';
  bedId?: string; // If admitted
  admissionDate?: string;
  dischargeDate?: string;
  medicalHistory: MedicalHistoryItem[];
  vitals: VitalItem[];
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
  email: string;
  phone: string;
  qualification: string;
  availability: string[]; // Days of week or time slots (e.g., ["Monday", "Wednesday", "Friday"])
  status: 'Active' | 'On Leave' | 'Inactive';
  rating: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface PaymentItem {
  id: string;
  date: string;
  amount: number;
  paymentMethod: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  consultationFee: number;
  medicineCharges: number;
  labCharges: number;
  totalAmount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  paymentMethod?: string;
  paymentHistory: PaymentItem[];
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string; // e.g. "Tablets", "Syrup (ml)", "Injection"
  price: number;
  lowStockThreshold: number;
  expiryDate: string;
  manufacturer: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  doctorName: string;
  date: string;
  status: 'Pending' | 'Completed';
  result?: string;
  notes?: string;
  reportFile?: string; // Simulated file name
}

export interface Bed {
  id: string;
  roomNumber: string;
  type: 'General' | 'ICU' | 'Semi-Private' | 'Private';
  status: 'Available' | 'Occupied';
  patientId?: string;
  patientName?: string;
}

export interface Department {
  id: string;
  name: string;
  headOfDepartment: string;
  bedCount: number;
  doctorCount: number;
  description: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  role: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
  read: boolean;
}
