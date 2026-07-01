import { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useAuth } from "../../context/AuthContext";
import {
  Users, Activity, ShieldAlert, BarChart3, Plus, Search,
  TrendingUp, Calendar, Trash2, Shield, Settings, HelpCircle, CheckCircle2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import formatCurrency from "../../utils/currency";
import formatDate, { formatDateTime } from "../../utils/formatDate";

export default function AdminDashboard() {
  const { doctors, patients, beds, medicines, logs, departments, addDoctor, deleteDoctor, updateDoctor } = useHospital();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"overview" | "staff" | "departments" | "audit">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Doctor form state
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPhone, setDocPhone] = useState("");
  const [docDept, setDocDept] = useState("General Medicine");
  const [docSpec, setDocSpec] = useState("Family Medicine");
  const [docQual, setDocQual] = useState("M.D.");
  
  // Calculate high level metrics
  const totalPatients = patients.length;
  const admittedPatients = patients.filter(p => p.admissionStatus === "Admitted").length;
  const occupiedBeds = beds.filter(b => b.status === "Occupied").length;
  const activeDoctors = doctors.filter(d => d.status === "Active").length;
  const lowStockMeds = medicines.filter(m => m.stock <= m.lowStockThreshold).length;

  // Chart data: daily billing aggregated
  const revenueData = [
    { name: "Mon", revenue: 4200, costs: 2400 },
    { name: "Tue", revenue: 5100, costs: 1800 },
    { name: "Wed", revenue: 6800, costs: 3000 },
    { name: "Thu", revenue: 7200, costs: 2900 },
    { name: "Fri", revenue: 9500, costs: 4200 },
    { name: "Sat", revenue: 5300, costs: 2000 },
    { name: "Sun", revenue: 4100, costs: 1500 },
  ];

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docEmail || !docPhone) return;
    
    addDoctor({
      name: docName,
      email: docEmail,
      phone: docPhone,
      department: docDept,
      specialization: docSpec,
      qualification: docQual,
      availability: ["Monday", "Wednesday", "Friday"],
      status: "Active"
    });

    // Reset Form
    setDocName("");
    setDocEmail("");
    setDocPhone("");
    setShowAddDoctor(false);
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("overview"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "overview" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Hospital Overview
        </button>
        <button
          onClick={() => { setActiveTab("staff"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "staff" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Staff & Clinicians
        </button>
        <button
          onClick={() => { setActiveTab("departments"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "departments" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Departments
        </button>
        <button
          onClick={() => { setActiveTab("audit"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "audit" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          System Audit Log
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">Total Patients</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{totalPatients}</span>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-teal-600 font-medium">
                {admittedPatients} currently admitted
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">Bed Occupancy</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{occupiedBeds} / {beds.length}</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all" 
                  style={{ width: `${(occupiedBeds / (beds.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">Active Clinicians</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{activeDoctors} / {doctors.length}</span>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-violet-600 font-medium">
                Full diagnostic coverage
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">Stock Warnings</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{lowStockMeds} Medicines</span>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-rose-600 font-medium">
                {lowStockMeds > 0 ? "Requires restock action" : "All inventories stable"}
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-500" />
                  HMS Cashflow Ledger
                </h3>
                <p className="text-xs text-slate-400">Weekly clinical invoicing revenue vs inventory procurement cost</p>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-teal-500 rounded-full" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full" /> Costs</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v}`, "Amount"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#14b8a6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="costs" stroke="#94a3b8" fillOpacity={0} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff clinicians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={() => setShowAddDoctor(true)}
              className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm shrink-0 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Doctor
            </button>
          </div>

          {/* Add Doctor Drawer Overlay */}
          {showAddDoctor && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Register New Clinical Doctor</h4>
                  <button onClick={() => setShowAddDoctor(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>
                <form onSubmit={handleAddDoctor} className="space-y-3.5 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Full Doctor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Arthur Pendelton"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="arthur@medicare.com"
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Phone</label>
                      <input
                        type="text"
                        required
                        placeholder="555-4321"
                        value={docPhone}
                        onChange={(e) => setDocPhone(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Department</label>
                      <select
                        value={docDept}
                        onChange={(e) => setDocDept(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none"
                      >
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Specialization</label>
                      <input
                        type="text"
                        required
                        value={docSpec}
                        onChange={(e) => setDocSpec(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Qualification Credentials</label>
                    <input
                      type="text"
                      required
                      value={docQual}
                      onChange={(e) => setDocQual(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all"
                  >
                    Submit Clinical Credentials
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Clinicians Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{doc.name}</h4>
                      <span className="text-xs text-slate-400">{doc.qualification} — {doc.specialization}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600"}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>🏢 {doc.department}</p>
                    <p>📧 {doc.email}</p>
                    <p>📞 {doc.phone}</p>
                  </div>
                </div>
                <div className="flex border-t border-slate-100 dark:border-slate-800 pt-3 justify-between items-center gap-2">
                  <button
                    onClick={() => {
                      const nextStatus = doc.status === "Active" ? "On Leave" : "Active";
                      updateDoctor({ ...doc, status: nextStatus });
                    }}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    Set {doc.status === "Active" ? "Leave" : "Active"}
                  </button>
                  <button
                    onClick={() => deleteDoctor(doc.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "departments" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Hospital Departments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 text-xs">
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Head clinician</th>
                  <th className="p-4">Staff Doctors</th>
                  <th className="p-4">Beds Count</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-100">{dept.name}</td>
                    <td className="p-4 text-slate-500">{dept.headOfDepartment}</td>
                    <td className="p-4 text-slate-500">{dept.doctorCount}</td>
                    <td className="p-4 text-slate-500">{dept.bedCount} beds</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate text-xs">{dept.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Clinical Event Audit Ledger</h3>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter logs..."
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
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Operator Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-500">
                {filteredLogs.slice().reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 text-slate-400 font-mono">{formatDateTime(log.timestamp)}</td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{log.userEmail}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.role === "Admin" ? "bg-rose-500/10 text-rose-600" :
                        log.role === "Doctor" ? "bg-sky-500/10 text-sky-600" :
                        log.role === "Nurse" ? "bg-teal-500/10 text-teal-600" : "bg-slate-500/10 text-slate-600"
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{log.action}</td>
                    <td className="p-4 text-slate-400 max-w-sm leading-relaxed">{log.details}</td>
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
