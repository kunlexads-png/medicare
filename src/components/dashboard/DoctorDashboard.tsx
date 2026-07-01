import { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar, Check, X, Clipboard, Activity, Pill, User, Search,
  AlertCircle, ShieldCheck, Heart, UserCheck, Plus, Sparkles, FolderHeart
} from "lucide-react";
import formatDate from "../../utils/formatDate";

export default function DoctorDashboard() {
  const { appointments, patients, medicines, updateAppointmentStatus, addMedicalHistory, prescribeMedicine } = useHospital();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"schedule" | "patients">("schedule");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Consultation modal states
  const [activeConsultation, setActiveConsultation] = useState<string | null>(null); // appointmentId
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");
  const [prescribeName, setPrescribeName] = useState("");
  const [dosage, setDosage] = useState("");

  const doctorAppointments = appointments.filter(appt => appt.doctorName.toLowerCase().includes(user?.name?.toLowerCase() || ""));

  const handleStartConsultation = (apptId: string) => {
    setActiveConsultation(apptId);
    setDiagnosis("");
    setTreatment("");
    setNotes("");
    setPrescribeName("");
    setDosage("");
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsultation || !diagnosis || !treatment) return;

    const appt = appointments.find(a => a.id === activeConsultation);
    if (!appt) return;

    // 1. Add medical history item
    addMedicalHistory(appt.patientId, diagnosis, treatment, notes);

    // 2. Prescribe medicine if selected
    if (prescribeName && dosage) {
      prescribeMedicine(appt.patientId, user?.name || "Dr. Thompson", prescribeName, dosage);
    }

    // 3. Mark appointment completed
    updateAppointmentStatus(activeConsultation, "Completed");

    // Close consultation Modal
    setActiveConsultation(null);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("schedule"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "schedule" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          My Appointments & Schedule
        </button>
        <button
          onClick={() => { setActiveTab("patients"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "patients" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Patient Health Files
        </button>
      </div>

      {activeTab === "schedule" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Clinician Work Schedule</h3>
              <p className="text-xs text-slate-400">Manage incoming consultations, edit status, and complete diagnostic reporting</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-500 rounded-full" /> Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-teal-500 rounded-full" /> Approved</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Completed</span>
            </div>
          </div>

          {/* Appointments list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorAppointments.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold">No Scheduled Consultations</p>
                <p className="text-xs">Your scheduler is currently fully clear of assigned clinical patients.</p>
              </div>
            ) : (
              doctorAppointments.map(appt => {
                const patient = patients.find(p => p.id === appt.patientId);
                return (
                  <div key={appt.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Patient Identifier</span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-teal-500" />
                            {appt.patientName}
                          </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          appt.status === "Pending" ? "bg-yellow-500/10 text-yellow-600" :
                          appt.status === "Approved" ? "bg-teal-500/10 text-teal-600" :
                          appt.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        }`}>
                          {appt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-b border-slate-50 dark:border-slate-800 py-2">
                        <p>📅 <strong>Date:</strong> {formatDate(appt.date)}</p>
                        <p>🕒 <strong>Time slot:</strong> {appt.time}</p>
                        <p className="col-span-2">💬 <strong>Notes:</strong> {appt.notes || "No clinical description provided"}</p>
                      </div>

                      {patient && patient.vitals && patient.vitals.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-xs space-y-1">
                          <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Latest Recorded Vitals</span>
                          <div className="grid grid-cols-4 gap-1 text-center font-semibold text-slate-700 dark:text-slate-300">
                            <div className="p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="block text-[8px] text-slate-400">BP</span>
                              {patient.vitals[patient.vitals.length - 1].bp}
                            </div>
                            <div className="p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="block text-[8px] text-slate-400">HR</span>
                              {patient.vitals[patient.vitals.length - 1].hr} bpm
                            </div>
                            <div className="p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="block text-[8px] text-slate-400">Temp</span>
                              {patient.vitals[patient.vitals.length - 1].temp}°F
                            </div>
                            <div className="p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="block text-[8px] text-slate-400">SPO2</span>
                              {patient.vitals[patient.vitals.length - 1].spo2}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-50 dark:border-slate-800 pt-3">
                      {appt.status === "Pending" && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, "Approved")}
                            className="py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, "Cancelled")}
                            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </>
                      )}

                      {appt.status === "Approved" && (
                        <button
                          onClick={() => handleStartConsultation(appt.id)}
                          className="py-1.5 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Clipboard className="w-3.5 h-3.5" /> Diagnose & Prescribe
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Consultation Drawer Modal */}
          {activeConsultation && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    Clinical Diagnosis & Treatment Plan
                  </h4>
                  <button onClick={() => setActiveConsultation(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>

                <form onSubmit={handleSubmitConsultation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Primary Diagnosis / Clinical Findings</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acute Viral Bronchitis"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Prescribed Treatment Regimen</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Bed rest for 3 days, increase fluid intake, administer supportive respiratory medication."
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Additional Clinician Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Patient displays mild productive cough, lungs are clear to auscultation."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none text-xs"
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
                    <h5 className="font-bold text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-teal-500" />
                      HMS Pharmacy Prescription Dispatch
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Medicine</label>
                        <select
                          value={prescribeName}
                          onChange={(e) => setPrescribeName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none"
                        >
                          <option value="">No Medicine Prescribed</option>
                          {medicines.map(m => (
                            <option key={m.id} value={m.name} disabled={m.stock <= 0}>
                              {m.name} ({m.stock > 0 ? `${m.stock} in stock` : "OUT OF STOCK"})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Dosage Frequency</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Tablet every 8 hours"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          disabled={!prescribeName}
                          className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow-md transition-all pt-3"
                  >
                    <UserCheck className="w-4 h-4" /> Finalize Consultation
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "patients" && (
        <div className="space-y-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clinical patient records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map(pat => (
              <div key={pat.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <FolderHeart className="w-5 h-5 text-rose-500" />
                      {pat.name}
                    </h4>
                    <span className="text-xs text-slate-400">ID: {pat.id} — {pat.age} yrs — {pat.gender}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    pat.admissionStatus === "Admitted" ? "bg-rose-500/10 text-rose-600" :
                    pat.admissionStatus === "Outpatient" ? "bg-teal-500/10 text-teal-600" : "bg-slate-500/10 text-slate-600"
                  }`}>
                    {pat.admissionStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                  <p>🩸 <strong>Blood Group:</strong> <span className="font-bold text-rose-600">{pat.bloodGroup}</span></p>
                  <p>⚠️ <strong>Allergies:</strong> {pat.allergies.length > 0 ? pat.allergies.join(", ") : "No recorded allergies"}</p>
                  <p>📞 <strong>Phone:</strong> {pat.phone}</p>
                  <p>📧 <strong>Email:</strong> {pat.email}</p>
                </div>

                {/* Medical History Ledger list */}
                {pat.medicalHistory && pat.medicalHistory.length > 0 && (
                  <div className="space-y-2 border-t border-slate-50 dark:border-slate-800 pt-3">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Diagnosis History Ledger</span>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {pat.medicalHistory.slice().reverse().map(history => (
                        <div key={history.id} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1 text-xs">
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>{formatDate(history.date)}</span>
                            <span className="text-teal-600 font-bold">Diagnosed</span>
                          </div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">📋 {history.diagnosis}</p>
                          <p className="text-slate-500 leading-relaxed"><strong className="text-[10px]">Plan:</strong> {history.treatment}</p>
                          {history.notes && <p className="text-slate-400 text-[10px] italic">Notes: {history.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
