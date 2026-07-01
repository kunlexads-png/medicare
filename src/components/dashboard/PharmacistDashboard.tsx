import { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { useAuth } from "../../context/AuthContext";
import {
  Package, Pill, Check, Search, ShoppingBag, PlusCircle, AlertCircle,
  Truck, ArrowRight, CheckCircle2, History, Trash2, Calendar
} from "lucide-react";
import formatCurrency from "../../utils/currency";
import formatDate from "../../utils/formatDate";

export default function PharmacistDashboard() {
  const { medicines, patients, restockMedicine, dispensePrescription } = useHospital();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"inventory" | "dispenser">("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Restock states
  const [activeRestockId, setActiveRestockId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [restockSuccessMsg, setRestockSuccessMsg] = useState("");

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRestockId || !restockQty) return;

    const qty = parseInt(restockQty);
    if (qty <= 0) return;

    restockMedicine(activeRestockId, qty);
    
    // Success feedback
    const med = medicines.find(m => m.id === activeRestockId);
    setRestockSuccessMsg(`Successfully refilled ${qty} units of ${med?.name || "medicine"}.`);
    setActiveRestockId(null);
    setRestockQty("");
    setTimeout(() => setRestockSuccessMsg(""), 3000);
  };

  const handleDispense = (patientId: string, prescriptionId: string) => {
    dispensePrescription(patientId, prescriptionId);
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract prescriptions list from medical records of all patients
  const activePrescriptions: Array<{
    patientId: string;
    patientName: string;
    id: string;
    date: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
  }> = [];

  patients.forEach(pat => {
    if (pat.medicalHistory) {
      pat.medicalHistory.forEach(history => {
        // Simple logic: if treatment contains clinical indications or prescriptions, parse it
        if (history.treatment.toLowerCase().includes("prescribe") || history.treatment.toLowerCase().includes("take") || history.treatment.toLowerCase().includes("mg") || history.treatment.toLowerCase().includes("tablet")) {
          activePrescriptions.push({
            patientId: pat.id,
            patientName: pat.name,
            ...history
          });
        }
      });
    }
  });

  return (
    <div className="space-y-6 text-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("inventory"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "inventory" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Drug Inventory Ledger
        </button>
        <button
          onClick={() => { setActiveTab("dispenser"); setSearchQuery(""); }}
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all shrink-0 ${activeTab === "dispenser" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Prescription Dispensing console
        </button>
      </div>

      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search drug inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> Critical Out of Stock</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" /> Low Stock Warning</span>
            </div>
          </div>

          {restockSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> {restockSuccessMsg}
            </div>
          )}

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map(med => {
              const isOutOfStock = med.stock <= 0;
              const isLowStock = med.stock <= med.lowStockThreshold;

              return (
                <div
                  key={med.id}
                  className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                    isOutOfStock ? "border-rose-300 bg-rose-500/[0.01]" : (isLowStock ? "border-yellow-200 bg-yellow-500/[0.01]" : "border-slate-100 dark:border-slate-800")
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-teal-500" />
                          {med.name}
                        </h4>
                        <span className="text-xs text-slate-400">{med.category} — {med.manufacturer}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        isOutOfStock ? "bg-rose-500/10 text-rose-600" : (isLowStock ? "bg-yellow-500/10 text-yellow-600" : "bg-teal-500/10 text-teal-600")
                      }`}>
                        {isOutOfStock ? "Out of Stock" : (isLowStock ? "Low Stock" : "In Stock")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-50 dark:border-slate-800 pt-2 text-slate-500">
                      <p>📦 <strong>Stock Level:</strong> <span className={`font-bold ${isLowStock ? "text-rose-600" : "text-slate-700 dark:text-slate-300"}`}>{med.stock} {med.unit}</span></p>
                      <p>💰 <strong>Unit Price:</strong> {formatCurrency(med.price)}</p>
                      <p className="col-span-2 text-[10px] text-slate-400">📅 Expiry Date: {formatDate(med.expiryDate)}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-800 pt-3 flex justify-between items-center gap-2">
                    <button
                      onClick={() => setActiveRestockId(med.id)}
                      className="py-1 px-3 border border-teal-500/10 bg-teal-500/[0.02] hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                    >
                      <Truck className="w-3.5 h-3.5" /> Quick Restock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Restock Form overlay */}
          {activeRestockId && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Truck className="w-5 h-5 text-teal-500" /> Restock Medication
                  </h4>
                  <button onClick={() => setActiveRestockId(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>
                <form onSubmit={handleRestock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Medication: <strong className="text-teal-600">{medicines.find(m => m.id === activeRestockId)?.name}</strong>
                    </label>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Procured Refill Quantity</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={restockQty}
                      onChange={(e) => setRestockQty(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all"
                  >
                    Confirm Inventory Procurement
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "dispenser" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Clinician Medication Orders</h3>
            <p className="text-xs text-slate-400">Review clinical prescriptions from physicians, verify local drug inventories, and record dispensed orders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePrescriptions.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Pill className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                <p className="font-semibold">No Pending Clinical Prescriptions</p>
                <p className="text-xs">There are currently no active patient medical folders requesting medication dispensation.</p>
              </div>
            ) : (
              activePrescriptions.map(pres => (
                <div key={pres.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 border-b border-slate-50 dark:border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Patient Recipient</span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{pres.patientName} (ID: {pres.patientId})</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">{formatDate(pres.date)}</span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                      <p>📋 <strong>Diagnosis:</strong> <span className="font-semibold text-slate-700 dark:text-slate-300">{pres.diagnosis}</span></p>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl">
                        <strong className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Prescribed Regimen</strong>
                        <p className="font-mono text-teal-600 font-semibold">{pres.treatment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-800 pt-3 flex justify-between items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">Verify stock level in inventory before dispensing.</span>
                    <button
                      onClick={() => handleDispense(pres.patientId, pres.id)}
                      className="py-1.5 px-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dispense Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
