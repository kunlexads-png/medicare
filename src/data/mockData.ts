import { Department, Doctor, Patient, Medicine, Appointment, Invoice, LabTest, Bed, AuditLog, Notification } from "../types";

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "dep-1",
    name: "General Medicine",
    headOfDepartment: "Dr. Lisa Thompson",
    bedCount: 20,
    doctorCount: 8,
    description: "Primary care, health evaluations, and general medical treatment."
  },
  {
    id: "dep-2",
    name: "Cardiology",
    headOfDepartment: "Dr. Sarah Jenkins",
    bedCount: 10,
    doctorCount: 4,
    description: "Diagnosis and treatment of heart conditions and cardiovascular diseases."
  },
  {
    id: "dep-3",
    name: "Pediatrics",
    headOfDepartment: "Dr. James Wilson",
    bedCount: 15,
    doctorCount: 5,
    description: "Specialized medical care for infants, children, and adolescents."
  },
  {
    id: "dep-4",
    name: "Neurology",
    headOfDepartment: "Dr. Michael Chang",
    bedCount: 8,
    doctorCount: 3,
    description: "Brain, spinal cord, and nervous system diagnoses and therapeutic care."
  },
  {
    id: "dep-5",
    name: "Orthopedics",
    headOfDepartment: "Dr. Robert Vance",
    bedCount: 12,
    doctorCount: 4,
    description: "Treatment of musculoskeletal trauma, sports injuries, and degenerative diseases."
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Lisa Thompson",
    department: "General Medicine",
    specialization: "Family Medicine",
    email: "lisa.thompson@medicare.com",
    phone: "+1 (555) 123-4567",
    qualification: "MD, Board Certified in Family Medicine (Harvard Medical School)",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "Active",
    rating: 4.9
  },
  {
    id: "doc-2",
    name: "Dr. Sarah Jenkins",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    email: "sarah.jenkins@medicare.com",
    phone: "+1 (555) 234-5678",
    qualification: "MD, PhD, FACC (Johns Hopkins University)",
    availability: ["Monday", "Wednesday", "Thursday"],
    status: "Active",
    rating: 4.8
  },
  {
    id: "doc-3",
    name: "Dr. James Wilson",
    department: "Pediatrics",
    specialization: "Pediatric Endocrinology",
    email: "james.wilson@medicare.com",
    phone: "+1 (555) 345-6789",
    qualification: "MD, FAAP (Stanford School of Medicine)",
    availability: ["Tuesday", "Wednesday", "Friday"],
    status: "Active",
    rating: 4.7
  },
  {
    id: "doc-4",
    name: "Dr. Michael Chang",
    department: "Neurology",
    specialization: "Neuromuscular Medicine",
    email: "michael.chang@medicare.com",
    phone: "+1 (555) 456-7890",
    qualification: "MD, Board Certified in Neurology (Mayo Clinic College of Medicine)",
    availability: ["Monday", "Tuesday", "Thursday"],
    status: "Active",
    rating: 4.9
  },
  {
    id: "doc-5",
    name: "Dr. Robert Vance",
    department: "Orthopedics",
    specialization: "Joint Replacement Surgery",
    email: "robert.vance@medicare.com",
    phone: "+1 (555) 567-8901",
    qualification: "MD, FAAOS (University of Pennsylvania School of Medicine)",
    availability: ["Wednesday", "Thursday", "Friday"],
    status: "On Leave",
    rating: 4.6
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    name: "John Doe",
    age: 45,
    gender: "Male",
    dob: "1981-04-12",
    email: "john.doe@example.com",
    phone: "+1 (555) 987-6543",
    bloodGroup: "A+",
    allergies: ["Penicillin", "Peanuts"],
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 (555) 987-6544"
    },
    admissionStatus: "Admitted",
    bedId: "bed-101",
    admissionDate: "2026-06-20",
    medicalHistory: [
      {
        id: "hist-1",
        date: "2026-06-20",
        diagnosis: "Acute Coronary Syndrome",
        treatment: "Angioplasty and stent placement",
        notes: "Patient stable post-procedure. Undergoing observation."
      },
      {
        id: "hist-2",
        date: "2024-11-05",
        diagnosis: "Hypertension",
        treatment: "Lisinopril 10mg daily",
        notes: "Regular cardiovascular checkups required."
      }
    ],
    vitals: [
      {
        id: "vit-1",
        timestamp: "2026-06-26T08:00:00Z",
        bp: "118/76",
        hr: 72,
        temp: 98.6,
        spo2: 98,
        weight: 185,
        recordedBy: "Nurse Amanda Cooper"
      },
      {
        id: "vit-2",
        timestamp: "2026-06-25T20:00:00Z",
        bp: "122/80",
        hr: 75,
        temp: 98.8,
        spo2: 97,
        weight: 185,
        recordedBy: "Nurse Amanda Cooper"
      }
    ]
  },
  {
    id: "pat-2",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    dob: "1994-08-23",
    email: "jane.smith@example.com",
    phone: "+1 (555) 876-5432",
    bloodGroup: "O+",
    allergies: ["Sulfa Drugs"],
    emergencyContact: {
      name: "Mark Smith",
      relationship: "Father",
      phone: "+1 (555) 876-5430"
    },
    admissionStatus: "Outpatient",
    medicalHistory: [
      {
        id: "hist-3",
        date: "2026-06-15",
        diagnosis: "Seasonal Allergic Rhinitis",
        treatment: "Cetirizine 10mg daily",
        notes: "Advised to avoid pollen and allergen triggers."
      }
    ],
    vitals: [
      {
        id: "vit-3",
        timestamp: "2026-06-15T10:30:00Z",
        bp: "112/70",
        hr: 68,
        temp: 98.2,
        spo2: 99,
        weight: 135,
        recordedBy: "Nurse Amanda Cooper"
      }
    ]
  },
  {
    id: "pat-3",
    name: "Robert Johnson",
    age: 68,
    gender: "Male",
    dob: "1958-01-30",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 765-4321",
    bloodGroup: "B-",
    allergies: ["Shellfish"],
    emergencyContact: {
      name: "Sarah Johnson",
      relationship: "Daughter",
      phone: "+1 (555) 765-4322"
    },
    admissionStatus: "Admitted",
    bedId: "bed-105",
    admissionDate: "2026-06-24",
    medicalHistory: [
      {
        id: "hist-4",
        date: "2026-06-24",
        diagnosis: "Severe Knee Osteoarthritis",
        treatment: "Total Knee Arthroplasty (Knee Replacement)",
        notes: "Post-surgery recovery. Commenced physiotherapy."
      }
    ],
    vitals: [
      {
        id: "vit-4",
        timestamp: "2026-06-26T07:15:00Z",
        bp: "130/84",
        hr: 82,
        temp: 99.1,
        spo2: 96,
        weight: 210,
        recordedBy: "Nurse Amanda Cooper"
      }
    ]
  },
  {
    id: "pat-4",
    name: "Emily Davis",
    age: 9,
    gender: "Female",
    dob: "2017-11-15",
    email: "emily.davis@example.com",
    phone: "+1 (555) 654-3210",
    bloodGroup: "AB+",
    allergies: ["Aspirin", "Dairy"],
    emergencyContact: {
      name: "Helen Davis",
      relationship: "Mother",
      phone: "+1 (555) 654-3211"
    },
    admissionStatus: "Discharged",
    admissionDate: "2026-06-18",
    dischargeDate: "2026-06-21",
    medicalHistory: [
      {
        id: "hist-5",
        date: "2026-06-18",
        diagnosis: "Severe Asthma Exacerbation",
        treatment: "Nebulizer treatment, Prednisolone oral course",
        notes: "Discharged after complete resolution of wheezing and safe oxygen levels."
      }
    ],
    vitals: [
      {
        id: "vit-5",
        timestamp: "2026-06-21T09:00:00Z",
        bp: "102/64",
        hr: 90,
        temp: 98.4,
        spo2: 98,
        weight: 64,
        recordedBy: "Nurse Amanda Cooper"
      }
    ]
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    stock: 500,
    unit: "Tablets",
    price: 0.15,
    lowStockThreshold: 100,
    expiryDate: "2028-09-30",
    manufacturer: "PharmaCorp Ltd."
  },
  {
    id: "med-2",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    stock: 250,
    unit: "Tablets",
    price: 0.45,
    lowStockThreshold: 50,
    expiryDate: "2027-04-15",
    manufacturer: "BioPharma Lab"
  },
  {
    id: "med-3",
    name: "Atorvastatin 20mg",
    category: "Cardiovascular",
    stock: 350,
    unit: "Tablets",
    price: 0.85,
    lowStockThreshold: 60,
    expiryDate: "2028-01-10",
    manufacturer: "Apex Pharmaceuticals"
  },
  {
    id: "med-4",
    name: "Albuterol Nebulizer Soln 0.083%",
    category: "Respiratory",
    stock: 45,
    unit: "Inhalers",
    price: 15.00,
    lowStockThreshold: 50, // Low stock trigger!
    expiryDate: "2027-11-20",
    manufacturer: "AeroMed"
  },
  {
    id: "med-5",
    name: "Metformin 850mg",
    category: "Anti-Diabetic",
    stock: 400,
    unit: "Tablets",
    price: 0.30,
    lowStockThreshold: 100,
    expiryDate: "2028-03-05",
    manufacturer: "Glucolabs Corp"
  },
  {
    id: "med-6",
    name: "Lisinopril 10mg",
    category: "Cardiovascular",
    stock: 120,
    unit: "Tablets",
    price: 0.25,
    lowStockThreshold: 40,
    expiryDate: "2028-06-18",
    manufacturer: "Apex Pharmaceuticals"
  }
];

export const INITIAL_BEDS: Bed[] = [
  { id: "bed-101", roomNumber: "Room 101 (ICU)", type: "ICU", status: "Occupied", patientId: "pat-1", patientName: "John Doe" },
  { id: "bed-102", roomNumber: "Room 102 (ICU)", type: "ICU", status: "Available" },
  { id: "bed-103", roomNumber: "Room 103 (Private)", type: "Private", status: "Available" },
  { id: "bed-104", roomNumber: "Room 104 (Semi-Private)", type: "Semi-Private", status: "Available" },
  { id: "bed-105", roomNumber: "Room 105 (General)", type: "General", status: "Occupied", patientId: "pat-3", patientName: "Robert Johnson" },
  { id: "bed-106", roomNumber: "Room 106 (General)", type: "General", status: "Available" },
  { id: "bed-107", roomNumber: "Room 107 (General)", type: "General", status: "Available" },
  { id: "bed-108", roomNumber: "Room 108 (Private)", type: "Private", status: "Available" }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    patientId: "pat-2",
    patientName: "Jane Smith",
    doctorId: "doc-1",
    doctorName: "Dr. Lisa Thompson",
    department: "General Medicine",
    date: "2026-06-26",
    time: "09:30 AM",
    status: "Approved",
    notes: "Follow-up on rhinitis and medication response."
  },
  {
    id: "app-2",
    patientId: "pat-1",
    patientName: "John Doe",
    doctorId: "doc-2",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-06-26",
    time: "11:00 AM",
    status: "Approved",
    notes: "Post-surgery ward checkup."
  },
  {
    id: "app-3",
    patientId: "pat-4",
    patientName: "Emily Davis",
    doctorId: "doc-3",
    doctorName: "Dr. James Wilson",
    department: "Pediatrics",
    date: "2026-06-27",
    time: "02:00 PM",
    status: "Pending",
    notes: "Routine post-discharge asthma evaluation."
  },
  {
    id: "app-4",
    patientId: "pat-2",
    patientName: "Jane Smith",
    doctorId: "doc-4",
    doctorName: "Dr. Michael Chang",
    department: "Neurology",
    date: "2026-06-24",
    time: "10:00 AM",
    status: "Completed",
    notes: "Migraine history check."
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-2001",
    patientId: "pat-1",
    patientName: "John Doe",
    date: "2026-06-21",
    consultationFee: 150.00,
    medicineCharges: 120.00,
    labCharges: 250.00,
    totalAmount: 520.00,
    status: "Paid",
    paymentMethod: "Insurance",
    paymentHistory: [
      { id: "pay-101", date: "2026-06-21", amount: 520.00, paymentMethod: "Insurance" }
    ]
  },
  {
    id: "inv-2002",
    patientId: "pat-2",
    patientName: "Jane Smith",
    date: "2026-06-15",
    consultationFee: 75.00,
    medicineCharges: 15.50,
    labCharges: 0.00,
    totalAmount: 90.50,
    status: "Paid",
    paymentMethod: "Credit Card",
    paymentHistory: [
      { id: "pay-102", date: "2026-06-15", amount: 90.50, paymentMethod: "Credit Card" }
    ]
  },
  {
    id: "inv-2003",
    patientId: "pat-3",
    patientName: "Robert Johnson",
    date: "2026-06-25",
    consultationFee: 200.00,
    medicineCharges: 45.00,
    labCharges: 120.00,
    totalAmount: 365.00,
    status: "Pending",
    paymentHistory: []
  }
];

export const INITIAL_LABTESTS: LabTest[] = [
  {
    id: "lab-3001",
    patientId: "pat-1",
    patientName: "John Doe",
    testName: "Lipid Profile & Cardiac Troponin",
    doctorName: "Dr. Sarah Jenkins",
    date: "2026-06-20",
    status: "Completed",
    result: "Troponin T level elevated (0.05 ng/mL), LDL high (145 mg/dL). Confirming acute diagnostic profile.",
    notes: "Results sent to cardiologist immediately.",
    reportFile: "lipid_troponin_doe.pdf"
  },
  {
    id: "lab-3002",
    patientId: "pat-2",
    patientName: "Jane Smith",
    testName: "Complete Blood Count (CBC)",
    doctorName: "Dr. Lisa Thompson",
    date: "2026-06-15",
    status: "Completed",
    result: "WBC 7.2 x10^3/uL, RBC 4.5 x10^6/uL, Hemoglobin 13.8 g/dL. All levels in standard healthy parameters.",
    notes: "Routine screen.",
    reportFile: "cbc_smith_jane.pdf"
  },
  {
    id: "lab-3003",
    patientId: "pat-3",
    patientName: "Robert Johnson",
    testName: "Knee Joint X-Ray & Coagulation Screen",
    doctorName: "Dr. Robert Vance",
    date: "2026-06-24",
    status: "Pending",
    notes: "Pre-procedure verification."
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    userEmail: "admin@medicare.com",
    role: "Admin",
    action: "Staff Creation",
    timestamp: "2026-06-25T14:30:00Z",
    details: "Created record for Dr. Lisa Thompson (General Medicine)."
  },
  {
    id: "log-2",
    userEmail: "receptionist@medicare.com",
    role: "Receptionist",
    action: "Patient Registration",
    timestamp: "2026-06-24T10:15:00Z",
    details: "Registered patient Robert Johnson to database and assigned bed-105."
  },
  {
    id: "log-3",
    userEmail: "nurse@medicare.com",
    role: "Nurse",
    action: "Vitals Recording",
    timestamp: "2026-06-26T07:15:00Z",
    details: "Recorded daily vitals for Robert Johnson (BP: 130/84, HR: 82)."
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "not-1",
    title: "Low Stock Alert: Albuterol",
    message: "Albuterol Nebulizer Soln 0.083% has 45 items left in stock, which is below the threshold of 50.",
    type: "warning",
    timestamp: "2026-06-26T05:30:00Z",
    read: false
  },
  {
    id: "not-2",
    title: "New Appointment Booked",
    message: "Jane Smith scheduled a General Medicine follow-up for today at 09:30 AM.",
    type: "info",
    timestamp: "2026-06-26T06:00:00Z",
    read: false
  },
  {
    id: "not-3",
    title: "Lab Report Uploaded",
    message: "Troponin & Lipid Profile results for John Doe have been finalized and uploaded.",
    type: "success",
    timestamp: "2026-06-25T18:45:00Z",
    read: true
  }
];
