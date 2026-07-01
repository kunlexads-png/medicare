import { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useAuth } from "../../context/AuthContext";
import {
  Activity, Bed as BedIcon, Clipboard, Check, Search, Plus, Sparkles,
  Heart, User, Smartphone, Thermometer, ShieldAlert, BadgeInfo
} from "lucide-react";
import formatDate from "../../utils/formatDate";

export default function NurseDashboard() {
  const { patients, beds, addVitals, assignBed, releaseBed, updatePatient } = useHospital();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"vitals" | "beds" | "admissions">("vitals");
  const [searchQuery, setSearchQuery] = useState("");

  // Vitals form states
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [temp, setTemp] = useState("");
  const [spo2, setSpo2] = useState("");
  const [weight, setWeight] = useState("");
  const [recordedSuccess, setRecordedSuccess] = useState(false);

  // Bed assignment state
  const [activeBedAssign, setActiveBedAssign] = useState<string | null>(null); // bedId
  const [assignPatientId, setAssignPatientId] = useState("");

  const handleRecordVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !bp || !hr || !temp || !spo2) return;

    addVitals(
      selectedPatientId,
      bp,
      parseInt(hr),
      parseFloat(temp),
      parseInt(spo2),
      weight ? parseFloat(weight) : undefined,
      user?.name || "Amanda Cooper"
    );

    // Show Success, Reset form
    setRecordedSuccess(true);
    setBp("");
    setHr("");
    setTemp("");
    setSpo2("");
    setWeight("");
    setTimeout(() => setRecordedSuccess(false), 3000);
  };

  const handleAssignBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBedAssign || !assignPatientId) return;

    assignBed(activeBedAssign, assignPatientId);
    setActiveBedAssign(null);
    setAssignPatientId("");
  };

  const nonAdmittedPatients = patients.filter(p => p.admissionStatus !== "Admitted");
  const admittedPatientsNoBed = patients.filter(p => p.admissionStatus === "Admitted" && !p.bedId);

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
          onClick={() => { setActiveTab("vitals"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "vitals" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Vitals Monitor & Recorder
        </button>
        <button
          onClick={() => { setActiveTab("beds"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "beds" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Ward Bed Management
        </button>
        <button
          onClick={() => { setActiveTab("admissions"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "admissions" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Admissions Tracker
        </button>
      </div>

      {activeTab === "vitals" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Record vitals Form */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 h-fit lg:col-span-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-teal-500" /> Record Patient Vitals
            </h3>
            
            {recordedSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium flex items-center gap-2">
                <Check className="w-4 h-4" /> Vitals signs recorded securely!
              </div>
            )}

            <form onSubmit={handleRecordVitals} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Select Patient File</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">BP (e.g., 120/80)</label>
                  <input
                    type="text"
                    required
                    placeholder="120/80"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    required
                    placeholder="72"
                    value={hr}
                    onChange={(e) => setHr(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="98.6"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">SPO2 (%)</label>
                  <input
                    type="number"
                    required
                    placeholder="98"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Weight (kg/lbs) - Optional</label>
                <input
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all pt-3"
              >
                <Heart className="w-4 h-4 text-white" /> Commit Patient Vitals
              </button>
            </form>
          </div>

          {/* Vitals History Ledger */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-rose-500" />
              Patient Health Tracking Ledger
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient record to view medical history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl outline-none"
              />
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
              {filteredPatients.map(p => (
                <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{p.name} (ID: {p.id})</span>
                    <span className="text-xs text-slate-400 font-mono">Blood: <strong className="text-rose-600">{p.bloodGroup}</strong></span>
                  </div>

                  {p.vitals && p.vitals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                            <th className="pb-1.5">Timestamp</th>
                            <th className="pb-1.5 text-center">Blood Pressure</th>
                            <th className="pb-1.5 text-center">Pulse (bpm)</th>
                            <th className="pb-1.5 text-center">Temp (°F)</th>
                            <th className="pb-1.5 text-center">SPO2</th>
                            <th className="pb-1.5 text-right">Clinician</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                          {p.vitals.slice().reverse().map((v) => (
                            <tr key={v.id} className="hover:bg-slate-100 dark:hover:bg-slate-900/50">
                              <td className="py-2 text-slate-400">{formatDate(v.timestamp)}</td>
                              <td className="py-2 text-center font-bold text-slate-700 dark:text-slate-300">{v.bp}</td>
                              <td className="py-2 text-center text-slate-600 dark:text-slate-400">{v.hr}</td>
                              <td className="py-2 text-center text-slate-600 dark:text-slate-400">{v.temp}°F</td>
                              <td className="py-2 text-center">
                                <span className={`px-1.5 py-0.5 rounded-sm font-bold ${v.spo2 < 95 ? "bg-rose-500/10 text-rose-600" : "bg-teal-500/10 text-teal-600"}`}>
                                  {v.spo2}%
                                </span>
                              </td>
                              <td className="py-2 text-right text-slate-400 italic">{v.recordedBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-2">No clinical vitals recorded yet. Use the intake form to register vital metrics.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "beds" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Ward Bed Occupancy Planner</h3>
              <p className="text-xs text-slate-400">View live ward occupancy, allocate beds to admitted patients, or release ward beds</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> Occupied Bed</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-teal-500 rounded-full" /> Available Bed</span>
            </div>
          </div>

          {/* Beds Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {beds.map((bed) => (
              <div
                key={bed.id}
                className={`p-4 border rounded-2xl shadow-sm flex flex-col justify-between h-36 transition-all ${
                  bed.status === "Occupied"
                    ? "bg-rose-500/[0.02] border-rose-100 dark:border-rose-950/40"
                    : "bg-teal-500/[0.02] border-teal-100 dark:border-teal-950/40"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 font-mono">Room {bed.roomNumber}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${bed.status === "Occupied" ? "bg-rose-500" : "bg-teal-500"}`} />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    <BedIcon className="w-4 h-4 text-teal-500" />
                    Bed {bed.id}
                  </h4>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bed.type} Type</span>
                </div>

                <div className="border-t border-slate-50 dark:border-slate-800 pt-2 text-xs">
                  {bed.status === "Occupied" ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{bed.patientName}</span>
                      <button
                        onClick={() => releaseBed(bed.id)}
                        className="text-[10px] text-rose-600 hover:underline text-left font-bold"
                      >
                        Release Bed
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveBedAssign(bed.id)}
                      className="text-[10px] text-teal-600 hover:underline text-left font-bold"
                    >
                      Assign Patient
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bed Assignment Drawer Overlay */}
          {activeBedAssign && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Allocate Ward Bed: {activeBedAssign}</h4>
                  <button onClick={() => setActiveBedAssign(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>
                
                <form onSubmit={handleAssignBed} className="space-y-4">
                  {admittedPatientsNoBed.length === 0 ? (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl font-medium text-xs leading-relaxed">
                      ⚠️ No admitted patients currently require bed allocation. Make sure the patient's status is set to "Admitted" first in Admissions Tracker.
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Select Patient File</label>
                      <select
                        required
                        value={assignPatientId}
                        onChange={(e) => setAssignPatientId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none text-xs"
                      >
                        <option value="">-- Choose Patient --</option>
                        {admittedPatientsNoBed.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={admittedPatientsNoBed.length === 0}
                    className="w-full py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
                  >
                    Confirm Bed Allocation
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "admissions" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Ward Patient Admissions tracker</h3>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 text-xs">
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Allocated Bed</th>
                  <th className="p-4">Admission Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{pat.name}</div>
                      <div className="text-xs text-slate-400">ID: {pat.id} — {pat.age} yrs — {pat.gender}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pat.admissionStatus === "Admitted" ? "bg-rose-500/10 text-rose-600" :
                        pat.admissionStatus === "Outpatient" ? "bg-teal-500/10 text-teal-600" : "bg-slate-500/10 text-slate-600"
                      }`}>
                        {pat.admissionStatus}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-500 font-mono text-xs">
                      {pat.bedId ? `Bed ${pat.bedId}` : "None Allocation"}
                    </td>
                    <td className="p-4 space-x-2">
                      <select
                        value={pat.admissionStatus}
                        onChange={(e) => {
                          const nextStatus = e.target.value as any;
                          updatePatient({ ...pat, admissionStatus: nextStatus });
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg outline-none"
                      >
                        <option value="Outpatient">Outpatient</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Discharged">Discharged</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
