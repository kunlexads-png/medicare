import { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useAuth } from "../../context/AuthContext";
import {
  UserPlus, CalendarPlus, Landmark, Search, Plus, Check, DollarSign,
  Printer, Clipboard, Heart, AlertCircle, Sparkles, Receipt, CheckCircle2, FileSpreadsheet
} from "lucide-react";
import formatCurrency from "../../utils/currency";
import formatDate from "../../utils/formatDate";
import { exportToCSV } from "../../utils/helpers";

export default function ReceptionistDashboard() {
  const { patients, doctors, invoices, addPatient, bookAppointment, generateInvoice, payInvoice, departments } = useHospital();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"register" | "appointments" | "billing">("register");
  const [searchQuery, setSearchQuery] = useState("");

  // Patient Registration state
  const [patName, setPatName] = useState("");
  const [patAge, setPatAge] = useState("");
  const [patGender, setPatGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patDob, setPatDob] = useState("");
  const [patEmail, setPatEmail] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patBlood, setPatBlood] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [patAllergies, setPatAllergies] = useState("");
  const [emerName, setEmerName] = useState("");
  const [emerRel, setEmerRel] = useState("");
  const [emerPhone, setEmerPhone] = useState("");
  const [regSuccessMsg, setRegSuccessMsg] = useState("");

  // Appointment states
  const [apptPatientId, setApptPatientId] = useState("");
  const [apptDoctorId, setApptDoctorId] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptNotes, setApptNotes] = useState("");
  const [apptSuccessMsg, setApptSuccessMsg] = useState("");

  // Invoice states
  const [invPatientId, setInvPatientId] = useState("");
  const [consultFee, setConsultFee] = useState("");
  const [medFee, setMedFee] = useState("");
  const [labFee, setLabFee] = useState("");
  const [invSuccessMsg, setInvSuccessMsg] = useState("");

  // Payment states
  const [activeInvoicePaymentId, setActiveInvoicePaymentId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Credit Card");

  // Receipt printed modal state
  const [printedReceiptId, setPrintedReceiptId] = useState<string | null>(null);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patName || !patAge || !patDob || !patEmail || !patPhone) return;

    const patientId = addPatient({
      name: patName,
      age: parseInt(patAge),
      gender: patGender,
      dob: patDob,
      email: patEmail,
      phone: patPhone,
      bloodGroup: patBlood,
      allergies: patAllergies ? patAllergies.split(",").map(s => s.trim()) : [],
      emergencyContact: {
        name: emerName || "No Recorded Contact",
        relationship: emerRel || "Unspecified",
        phone: emerPhone || "None"
      },
      admissionStatus: "Outpatient"
    });

    setRegSuccessMsg(`Successfully registered ${patName} with clinical ID: ${patientId}.`);
    
    // Reset form
    setPatName("");
    setPatAge("");
    setPatDob("");
    setPatEmail("");
    setPatPhone("");
    setPatAllergies("");
    setEmerName("");
    setEmerRel("");
    setEmerPhone("");
    setTimeout(() => setRegSuccessMsg(""), 4000);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptPatientId || !apptDoctorId || !apptDate || !apptTime) return;

    const patient = patients.find(p => p.id === apptPatientId);
    const doctor = doctors.find(d => d.id === apptDoctorId);
    if (!patient || !doctor) return;

    bookAppointment({
      patientId: apptPatientId,
      patientName: patient.name,
      doctorId: apptDoctorId,
      doctorName: doctor.name,
      department: doctor.department,
      date: apptDate,
      time: apptTime,
      notes: apptNotes
    });

    setApptSuccessMsg(`Successfully booked appointment for ${patient.name} with ${doctor.name}.`);
    setApptPatientId("");
    setApptDoctorId("");
    setApptDate("");
    setApptTime("");
    setApptNotes("");
    setTimeout(() => setApptSuccessMsg(""), 4000);
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invPatientId || !consultFee) return;

    const patient = patients.find(p => p.id === invPatientId);
    if (!patient) return;

    const cFee = parseFloat(consultFee) || 0;
    const mFee = parseFloat(medFee) || 0;
    const lFee = parseFloat(labFee) || 0;

    generateInvoice({
      patientId: invPatientId,
      patientName: patient.name,
      date: new Date().toISOString().split("T")[0],
      consultationFee: cFee,
      medicineCharges: mFee,
      labCharges: lFee,
      totalAmount: cFee + mFee + lFee
    });

    setInvSuccessMsg(`Billing Invoice generated successfully for ${patient.name}.`);
    setInvPatientId("");
    setConsultFee("");
    setMedFee("");
    setLabFee("");
    setTimeout(() => setInvSuccessMsg(""), 4000);
  };

  const handlePayInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoicePaymentId || !payAmount) return;

    payInvoice(activeInvoicePaymentId, parseFloat(payAmount), payMethod);
    setActiveInvoicePaymentId(null);
    setPayAmount("");
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportInvoices = () => {
    const headers = ["Invoice ID", "Patient", "Date", "Consultation", "Medicines", "Lab", "Total Amount", "Status"];
    const rows = invoices.map(i => [
      i.id,
      i.patientName,
      i.date,
      formatCurrency(i.consultationFee),
      formatCurrency(i.medicineCharges),
      formatCurrency(i.labCharges),
      formatCurrency(i.totalAmount),
      i.status
    ]);
    exportToCSV("Invoices_Report.csv", headers, rows);
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("register"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "register" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Patient Intake Register
        </button>
        <button
          onClick={() => { setActiveTab("appointments"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "appointments" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Appointment Scheduler
        </button>
        <button
          onClick={() => { setActiveTab("billing"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "billing" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Billing & Invoices
        </button>
      </div>

      {activeTab === "register" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">New Patient Intake File</h3>
            <p className="text-xs text-slate-400 font-medium">Record personal credentials, emergency contacts, clinical allergies, and blood groups to register medical files</p>
          </div>

          {regSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> {regSuccessMsg}
            </div>
          )}

          <form onSubmit={handleRegisterPatient} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-teal-600 dark:text-teal-400 border-b border-slate-50 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Personal & Medical Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Full Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patName}
                    onChange={(e) => setPatName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="35"
                    value={patAge}
                    onChange={(e) => setPatAge(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Gender</label>
                  <select
                    value={patGender}
                    onChange={(e) => setPatGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Birth Date</label>
                  <input
                    type="date"
                    required
                    value={patDob}
                    onChange={(e) => setPatDob(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={patEmail}
                    onChange={(e) => setPatEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Telephone Contact</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 555-0199"
                    value={patPhone}
                    onChange={(e) => setPatPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Blood Group</label>
                  <select
                    value={patBlood}
                    onChange={(e) => setPatBlood(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Drug / Food Allergies (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts"
                    value={patAllergies}
                    onChange={(e) => setPatAllergies(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <h4 className="font-bold text-teal-600 dark:text-teal-400 border-b border-slate-50 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> Emergency Contact Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Martha Doe"
                    value={emerName}
                    onChange={(e) => setEmerName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse, Guardian"
                    value={emerRel}
                    onChange={(e) => setEmerRel(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="555-0144"
                    value={emerPhone}
                    onChange={(e) => setEmerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md transition-all pt-3 flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-5 h-5 text-white" /> Register Medical Profile File
            </button>
          </form>
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-1 h-fit">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
              <CalendarPlus className="w-5 h-5 text-teal-500" /> Book Consultation
            </h3>

            {apptSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium flex items-center gap-2">
                <Check className="w-4 h-4" /> {apptSuccessMsg}
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Patient Client</label>
                <select
                  required
                  value={apptPatientId}
                  onChange={(e) => setApptPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none text-xs"
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Doctor Clinician</label>
                <select
                  required
                  value={apptDoctorId}
                  onChange={(e) => setApptDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none text-xs"
                >
                  <option value="">-- Choose Specialist --</option>
                  {doctors.filter(d => d.status === "Active").map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization} — {d.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Schedule Date</label>
                  <input
                    type="date"
                    required
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Time slot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Clinical Indication notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Regular medical checkup, chest pain symptoms tracking"
                  value={apptNotes}
                  onChange={(e) => setApptNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all"
              >
                Schedule Appointment Slot
              </button>
            </form>
          </div>

          {/* Patient list search for bookings */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-teal-500" /> Clinic Medical Registrations Roster
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl outline-none"
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
              {patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{p.name}</span>
                    <span className="block text-xs text-slate-400">ID: {p.id} — Blood: <strong className="text-rose-600">{p.bloodGroup}</strong> — Emergency Contact: {p.emergencyContact.name} ({p.emergencyContact.phone})</span>
                  </div>
                  <button
                    onClick={() => setApptPatientId(p.id)}
                    className="py-1 px-3 border border-teal-500 text-teal-600 dark:text-teal-400 font-bold rounded-lg text-xs hover:bg-teal-500 hover:text-white transition-all"
                  >
                    Select Patient
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generate invoice Form */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-1 h-fit">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
              <Receipt className="w-5 h-5 text-teal-500" /> Generate Patient Invoice
            </h3>

            {invSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium flex items-center gap-2">
                <Check className="w-4 h-4" /> {invSuccessMsg}
              </div>
            )}

            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Select Patient File</label>
                <select
                  required
                  value={invPatientId}
                  onChange={(e) => setInvPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none text-xs"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 font-mono">Consultation Fee ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 150"
                  value={consultFee}
                  onChange={(e) => setConsultFee(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 font-mono">Medicine Fee ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={medFee}
                    onChange={(e) => setMedFee(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 font-mono">Lab Charges ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={labFee}
                    onChange={(e) => setLabFee(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all"
              >
                Compile billing Invoice
              </button>
            </form>
          </div>

          {/* Invoices list and table */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                <Landmark className="w-5 h-5 text-teal-500" /> Hospital Billing Ledger
              </h3>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleExportInvoices}
                  className="py-1.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient invoice billing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl outline-none"
              />
            </div>

            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-2">Invoice ID</th>
                    <th className="pb-2">Patient</th>
                    <th className="pb-2">Total Invoice</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-600 dark:text-slate-300">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                      <td className="py-2.5 font-mono text-slate-400">{inv.id}</td>
                      <td className="py-2.5 font-semibold">{inv.patientName}</td>
                      <td className="py-2.5 font-bold font-mono text-slate-800 dark:text-slate-200">{formatCurrency(inv.totalAmount)}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right space-x-2">
                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => {
                              setActiveInvoicePaymentId(inv.id);
                              setPayAmount(inv.totalAmount.toString());
                            }}
                            className="py-1 px-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            Record Payment
                          </button>
                        )}
                        <button
                          onClick={() => setPrintedReceiptId(inv.id)}
                          className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center text-slate-500"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record payment popover overlay */}
          {activeInvoicePaymentId && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <DollarSign className="w-5 h-5 text-teal-500" /> Record Billing Invoice Payment
                  </h4>
                  <button onClick={() => setActiveInvoicePaymentId(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>
                <form onSubmit={handlePayInvoice} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 font-mono">Invoice Total: <strong className="text-teal-600">{formatCurrency(parseFloat(payAmount) || 0)}</strong></label>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Payment Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Cash / Cheque">Cash / Cheque</option>
                      <option value="Insurance Coverage">Insurance Coverage</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all"
                  >
                    Confirm Invoice Receipt Payment
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Simulated printed receipt modal */}
          {printedReceiptId && (
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white text-slate-900 max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-2xl space-y-6 relative font-sans my-8">
                <button
                  onClick={() => setPrintedReceiptId(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl"
                >
                  ×
                </button>

                {/* Receipt Header */}
                <div className="text-center space-y-1 border-b border-dashed border-slate-200 pb-4">
                  <div className="inline-flex h-10 w-10 rounded-xl bg-teal-500 text-white font-bold text-xl items-center justify-center mb-1">M</div>
                  <h3 className="font-extrabold text-lg tracking-tight uppercase text-slate-900">MediCare Pro HMS</h3>
                  <p className="text-[10px] text-slate-500">100 Clinical Parkway, Metro Hospital District</p>
                  <p className="text-[10px] text-slate-400">Tel: (555) 0199 — HMS.MEDICARE.PRO</p>
                </div>

                {/* Receipt Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-mono">
                  <p><strong>Receipt ID:</strong> {printedReceiptId}</p>
                  <p className="text-right"><strong>Date:</strong> {invoices.find(i => i.id === printedReceiptId)?.date}</p>
                  <p><strong>Patient Name:</strong> {invoices.find(i => i.id === printedReceiptId)?.patientName}</p>
                  <p className="text-right"><strong>Recipient ID:</strong> {invoices.find(i => i.id === printedReceiptId)?.patientId}</p>
                </div>

                {/* Invoice Charges List */}
                <div className="border-t border-b border-dashed border-slate-200 py-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary consultation fees:</span>
                    <span className="font-semibold font-mono">{formatCurrency(invoices.find(i => i.id === printedReceiptId)?.consultationFee || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pharmacy medicine charges:</span>
                    <span className="font-semibold font-mono">{formatCurrency(invoices.find(i => i.id === printedReceiptId)?.medicineCharges || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Diagnostic lab fees:</span>
                    <span className="font-semibold font-mono">{formatCurrency(invoices.find(i => i.id === printedReceiptId)?.labCharges || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
                    <span>Total Bill:</span>
                    <span className="font-mono">{formatCurrency(invoices.find(i => i.id === printedReceiptId)?.totalAmount || 0)}</span>
                  </div>
                </div>

                {/* Receipt Footer */}
                <div className="text-center space-y-3.5 text-[10px] text-slate-500">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center gap-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> TRANSACTION COMPLETED & APPROVED
                  </div>
                  <p className="italic">Thank you for choosing MediCare Pro Hospital as your clinical command ecosystem.</p>
                  {/* Mock Barcode */}
                  <div className="mx-auto h-8 bg-slate-200 border border-slate-300 w-44 rounded-sm flex items-center justify-center gap-1 opacity-60">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <span key={i} className={`h-full bg-slate-800`} style={{ width: i % 3 === 0 ? "2px" : (i % 2 === 0 ? "4px" : "1px") }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
