import { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useAuth } from "../../context/AuthContext";
import {
  Activity, Clipboard, Calendar, Landmark, BrainCircuit, Search, Heart,
  Thermometer, Check, CreditCard, Sparkles, Send, AlertTriangle, UserCheck, ShieldCheck, HelpCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import formatCurrency from "../../utils/currency";
import formatDate, { formatDateTime } from "../../utils/formatDate";
import Markdown from "react-markdown";

export default function PatientDashboard() {
  const { patients, appointments, invoices, payInvoice } = useHospital();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"portal" | "history" | "billing" | "ai">("portal");

  // AI Symptom Checker state
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Pay outstanding balance state
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paySuccessMsg, setPaySuccessMsg] = useState("");

  // Find current patient data
  const patientData = patients.find(p => p.email.toLowerCase() === user?.email.toLowerCase());

  const personalAppointments = appointments.filter(a => a.patientId === patientData?.id);
  const personalInvoices = invoices.filter(i => i.patientId === patientData?.id);

  // Process vitals history for charts
  const chartData = (patientData?.vitals || []).map(v => ({
    time: formatDate(v.timestamp),
    "Heart Rate (bpm)": v.hr,
    "SPO2 (%)": v.spo2,
    "Temperature (°F)": v.temp
  }));

  const handleSymptomCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms) return;

    setAiLoading(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/symptom-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          age: patientData?.age || 30,
          gender: patientData?.gender || "Male",
          duration
        })
      });

      const data = await res.json();
      if (data.advice) {
        setAiResponse(data.advice);
      } else {
        setAiResponse("⚠️ An unexpected error occurred while processing symptoms.");
      }
    } catch (err) {
      setAiResponse("⚠️ Failed to contact the AI clinical checker. Please verify server connection.");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePayInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoiceId || !cardNumber || !cardExpiry || !cardCvv) return;

    // Simulate 1s bank clearance
    payInvoice(payingInvoiceId, invoices.find(i => i.id === payingInvoiceId)?.totalAmount || 0, "Credit Card");
    setPaySuccessMsg("Transaction cleared! Your invoice has been paid.");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setTimeout(() => {
      setPayingInvoiceId(null);
      setPaySuccessMsg("");
    }, 2500);
  };

  if (!patientData) {
    return (
      <div className="py-12 text-center text-slate-400 space-y-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <HelpCircle className="w-12 h-12 mx-auto text-slate-300 animate-pulse" />
        <h3 className="font-bold text-slate-700 dark:text-slate-300">Intake File Not Registered</h3>
        <p className="text-xs max-w-sm mx-auto leading-relaxed">Your account email (<strong>{user?.email}</strong>) does not have an active patient intake file in the clinic records. Please consult our front-desk reception staff to open a clinical record.</p>
      </div>
    );
  }

  const latestVital = patientData.vitals && patientData.vitals.length > 0
    ? patientData.vitals[patientData.vitals.length - 1]
    : null;

  return (
    <div className="space-y-6 text-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("portal")}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "portal" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          My Health Portal
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "history" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Clinical Records
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "billing" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Invoices & Payments
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "ai" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          AI Symptom Checker
        </button>
      </div>

      {activeTab === "portal" && (
        <div className="space-y-6">
          {/* Welcome Panel */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Welcome Back, {patientData.name}</h3>
              <p className="text-xs text-slate-400">Track your vital stats history, upcoming consultations, and clinical diagnoses</p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <p>🧬 <strong>Blood:</strong> <span className="text-rose-600 font-bold">{patientData.bloodGroup}</span></p>
              <p>🗄️ <strong>File ID:</strong> {patientData.id}</p>
            </div>
          </div>

          {/* Vitals Cards */}
          {latestVital ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">{latestVital.bp}</span>
                <span className="text-[10px] text-slate-400 block font-mono">mmHg</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pulse rate</span>
                <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">{latestVital.hr}</span>
                <span className="text-[10px] text-slate-400 block font-mono">bpm</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SPO2</span>
                <span className={`text-2xl font-bold font-mono ${latestVital.spo2 < 95 ? "text-rose-500 animate-pulse" : "text-teal-500"}`}>{latestVital.spo2}%</span>
                <span className="text-[10px] text-slate-400 block font-mono">Oxygen Saturation</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temperature</span>
                <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">{latestVital.temp}°F</span>
                <span className="text-[10px] text-slate-400 block font-mono">Body Heat</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl text-center text-slate-400 italic">
              No clinical vital metrics are recorded on your chart yet.
            </div>
          )}

          {/* Vitals Line Chart */}
          {chartData.length > 0 && (
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Activity className="w-5 h-5 text-teal-500 animate-pulse" />
                Vitals Health Trend Log
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="Heart Rate (bpm)" stroke="#f43f5e" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="SPO2 (%)" stroke="#14b8a6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-teal-500" />
              Clinical Consultation & Diagnostics History
            </h3>
            <p className="text-xs text-slate-400">View official health records compiled by your primary hospital clinicians</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(!patientData.medicalHistory || patientData.medicalHistory.length === 0) ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Clipboard className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold">No Clinical Diagnosis History</p>
                <p className="text-xs">There are currently no physician consultations recorded in your medical dossier.</p>
              </div>
            ) : (
              patientData.medicalHistory.slice().reverse().map(history => (
                <div key={history.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-2">
                    <span className="font-mono text-xs text-slate-400">{formatDate(history.date)}</span>
                    <span className="p-1 px-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-full text-[10px]">Verified Record</span>
                  </div>
                  <div className="space-y-2">
                    <p>📋 <strong>Primary Diagnosis:</strong> <span className="font-bold text-slate-800 dark:text-slate-100">{history.diagnosis}</span></p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">💊 <strong>Treatment Plan:</strong> {history.treatment}</p>
                    {history.notes && (
                      <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-2 rounded-lg leading-relaxed">Notes: {history.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <Landmark className="w-5 h-5 text-teal-500" /> My Financial Statements
            </h3>
            <p className="text-xs text-slate-400">Review outstanding fees, generate billing files, and pay balances online securely</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalInvoices.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold">No Outstanding Invoices</p>
                <p className="text-xs">Your clinical account currently has zero outstanding billing statements.</p>
              </div>
            ) : (
              personalInvoices.map(inv => (
                <div key={inv.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-2">
                      <span className="text-[10px] text-slate-400 font-mono">Invoice ID: {inv.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 border-b border-slate-50 dark:border-slate-800 py-2">
                      <p>📋 <strong>Consultation:</strong> {formatCurrency(inv.consultationFee)}</p>
                      <p>💊 <strong>Medicines:</strong> {formatCurrency(inv.medicineCharges)}</p>
                      <p>🧪 <strong>Lab Fees:</strong> {formatCurrency(inv.labCharges)}</p>
                      <p className="col-span-2 text-sm font-extrabold text-slate-800 dark:text-slate-100 font-mono border-t border-slate-50 dark:border-slate-800 pt-2 flex justify-between items-center">
                        <span>Total Due:</span>
                        <span>{formatCurrency(inv.totalAmount)}</span>
                      </p>
                    </div>
                  </div>

                  {inv.status !== "Paid" && (
                    <button
                      onClick={() => setPayingInvoiceId(inv.id)}
                      className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <CreditCard className="w-4 h-4 text-white" /> Pay Outstanding Balance
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Secure Card Checkout overlay */}
          {payingInvoiceId && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-teal-500" /> Secure Card Payment
                  </h4>
                  <button onClick={() => setPayingInvoiceId(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>

                {paySuccessMsg ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl font-medium text-center space-y-2">
                    <Check className="w-6 h-6 mx-auto text-emerald-600" />
                    <p>{paySuccessMsg}</p>
                  </div>
                ) : (
                  <form onSubmit={handlePayInvoice} className="space-y-4 text-xs">
                    <div>
                      <p className="text-slate-400">Paying Statement Total:</p>
                      <h3 className="text-xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                        {formatCurrency(invoices.find(i => i.id === payingInvoiceId)?.totalAmount || 0)}
                      </h3>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Credit Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CVV / Security Code</label>
                        <input
                          type="text"
                          required
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all"
                    >
                      Authorize Transaction Payment
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "ai" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptoms Intake */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-1 h-fit">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
              <BrainCircuit className="w-5 h-5 text-teal-500" /> AI Symptom Checker
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">Enter current symptoms and duration to query the HMS clinical reasoning assistant and receive preliminary advice.</p>

            <form onSubmit={handleSymptomCheck} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Reported Symptoms</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Mild shortness of breath, headache behind eyes, throat tickle"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Symptom Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <BrainCircuit className="w-4 h-4 text-white" /> {aiLoading ? "Querying Clinical AI..." : "Consult AI Assistant"}
              </button>
            </form>
          </div>

          {/* AI Clinical Advice output */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 lg:col-span-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-teal-500" /> AI Assistant Clinical Guidance
            </h3>

            {aiLoading && (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <BrainCircuit className="w-10 h-10 mx-auto text-teal-500 animate-spin" />
                <p className="font-semibold text-xs text-slate-500">MediCare Pro clinical model is processing diagnostics...</p>
              </div>
            )}

            {!aiLoading && !aiResponse && (
              <div className="py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <BrainCircuit className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-xs">Awaiting Symptoms Report Submission</p>
                <p className="text-[11px]">Submit symptoms using the intake form to receive custom self-care guidance.</p>
              </div>
            )}

            {!aiLoading && aiResponse && (
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-4 text-slate-700 dark:text-slate-300">
                <div className="markdown-body">
                  <Markdown>{aiResponse}</Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
