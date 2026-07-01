import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHospital } from "../context/HospitalContext";
import { useTheme } from "../context/ThemeContext";
import AuthPages from "../components/auth/AuthPages";
import {
  Heart, LogOut, Search, Bell, Moon, Sun, Shield, Settings, HelpCircle,
  Menu, X, Sparkles, User, Check, Eye
} from "lucide-react";

// Dashboard Component Imports
import AdminDashboard from "../components/dashboard/AdminDashboard";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import NurseDashboard from "../components/dashboard/NurseDashboard";
import PharmacistDashboard from "../components/dashboard/PharmacistDashboard";
import ReceptionistDashboard from "../components/dashboard/ReceptionistDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";

export default function AppRouter() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, patients, doctors, medicines, logs } = useHospital();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Search states
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ type: string; name: string; info: string }[]>([]);

  // If not logged in, render Auth Form screen
  if (!user) {
    return <AuthPages onSuccess={() => {}} />;
  }

  // Handle global header search
  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    if (!val) {
      setSearchResults([]);
      return;
    }

    const matches: { type: string; name: string; info: string }[] = [];

    // Search patients
    patients.forEach(p => {
      if (p.name.toLowerCase().includes(val.toLowerCase()) || p.id.toLowerCase().includes(val.toLowerCase())) {
        matches.push({ type: "Patient Record", name: p.name, info: `ID: ${p.id} — Status: ${p.admissionStatus}` });
      }
    });

    // Search doctors
    doctors.forEach(d => {
      if (d.name.toLowerCase().includes(val.toLowerCase()) || d.specialization.toLowerCase().includes(val.toLowerCase())) {
        matches.push({ type: "Doctor Specialist", name: d.name, info: `${d.specialization} (${d.department})` });
      }
    });

    // Search medications
    medicines.forEach(m => {
      if (m.name.toLowerCase().includes(val.toLowerCase()) || m.category.toLowerCase().includes(val.toLowerCase())) {
        matches.push({ type: "Pharmacy Medicine", name: m.name, info: `Stock: ${m.stock} ${m.unit} — Cat: ${m.category}` });
      }
    });

    setSearchResults(matches.slice(0, 5));
  };

  const getRoleHeaderBg = () => {
    switch (user.role) {
      case "Admin": return "from-rose-500/10 to-rose-500/[0.02] border-rose-100/40 dark:border-rose-950/20";
      case "Doctor": return "from-sky-500/10 to-sky-500/[0.02] border-sky-100/40 dark:border-sky-950/20";
      case "Nurse": return "from-teal-500/10 to-teal-500/[0.02] border-teal-100/40 dark:border-teal-950/20";
      case "Pharmacist": return "from-emerald-500/10 to-emerald-500/[0.02] border-emerald-100/40 dark:border-emerald-950/20";
      case "Receptionist": return "from-violet-500/10 to-violet-500/[0.02] border-violet-100/40 dark:border-violet-950/20";
      default: return "from-teal-500/10 to-teal-500/[0.02] border-teal-100/40 dark:border-teal-950/20";
    }
  };

  const renderDashboardByRole = () => {
    switch (user.role) {
      case "Admin": return <AdminDashboard />;
      case "Doctor": return <DoctorDashboard />;
      case "Nurse": return <NurseDashboard />;
      case "Pharmacist": return <PharmacistDashboard />;
      case "Receptionist": return <ReceptionistDashboard />;
      case "Patient": return <PatientDashboard />;
      default:
        return (
          <div className="py-12 text-center text-slate-400 space-y-4">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold">Invalid Role Configuration</h3>
            <p className="text-xs">Your credential role (<strong>{user.role}</strong>) does not have a mapped HMS Dashboard.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Hospital Background Image backplate */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/src/assets/images/hospital_background_1782484391748.jpg" 
          alt="Hospital Background" 
          className="w-full h-full object-cover opacity-45 dark:opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-slate-50/80 via-transparent to-slate-100/30 dark:from-slate-950/80 dark:via-transparent dark:to-slate-900/30" />
      </div>

      {/* Primary Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 w-64 z-40 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-0 lg:-translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full justify-between">
          <div className="space-y-6">
            {/* Logo Brand Header */}
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-teal-500/20 text-xl tracking-tight">
                M
              </div>
              <div>
                <span className="block font-black text-slate-900 dark:text-white uppercase tracking-tight text-base">MediCare Pro</span>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Clinical EMR Ecosystem</span>
              </div>
            </div>

            {/* Profile Summary */}
            <div className={`p-4 rounded-2xl bg-linear-to-br ${getRoleHeaderBg()} border text-xs space-y-2`}>
              <div className="flex justify-between items-center">
                <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Active Staff Identity</span>
                <span className={`p-0.5 px-2 rounded-full text-[9px] font-extrabold ${
                  user.role === "Admin" ? "bg-rose-500/10 text-rose-600" :
                  user.role === "Doctor" ? "bg-sky-500/10 text-sky-600" :
                  user.role === "Nurse" ? "bg-teal-500/10 text-teal-600" :
                  user.role === "Pharmacist" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600"
                }`}>
                  {user.role}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{user.name}</h4>
                <p className="text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Info & Sign Out */}
          <div className="space-y-4 pt-5 border-t border-slate-50 dark:border-slate-800">
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-2">
              <span>Status: <strong className="text-emerald-500">● Live</strong></span>
              <span>Client v1.4.0</span>
            </div>
            <button
              onClick={() => logout()}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-100 dark:border-slate-800 shadow-xs"
            >
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Contents Stage */}
      <div className={`lg:pl-64 min-h-screen flex flex-col transition-all duration-300 relative z-10`}>
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 h-16 px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">MediCare Clinical Core</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hospital Command Center Console</p>
            </div>
          </div>

          {/* Header Controls and Settings */}
          <div className="flex items-center gap-4">
            {/* Global EMR Database Search */}
            <div className="relative max-w-xs hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Global Database EMR Query..."
                value={globalSearch}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                className="w-48 xl:w-64 pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-xs outline-none focus:ring-1 focus:ring-teal-500 transition-all"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-11 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-xl p-2.5 space-y-1.5 text-xs text-left">
                  <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400 pb-1 border-b border-slate-50 dark:border-slate-800">EMR Registry Matches</span>
                  {searchResults.map((res, i) => (
                    <div key={i} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-all">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{res.name}</span>
                        <span className="text-[8px] uppercase font-black bg-teal-500/10 text-teal-600 px-1.5 rounded-sm shrink-0">{res.type}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 truncate mt-0.5">{res.info}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light mode switcher */}
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative transition-colors"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-50 dark:ring-slate-950 animate-pulse" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-11 right-0 w-72 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-4 space-y-3 text-xs text-left max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">Live Alerts Feed ({notifications.length})</span>
                    <span className="text-[10px] text-teal-600 font-semibold">Real-time</span>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-center py-4 text-slate-400 italic">No incoming diagnostic alarms.</p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span className="font-bold">{notif.title}</span>
                            <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-500 leading-normal text-[11px]">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mini profile picker dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-1 px-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <User className="w-4 h-4 text-teal-500" /> Profile
              </button>
              {showProfileMenu && (
                <div className="absolute top-11 right-0 w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-xl p-2 space-y-1 text-xs text-left">
                  <div className="p-2 border-b border-slate-50 dark:border-slate-800">
                    <span className="block font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</span>
                    <span className="block text-[10px] text-slate-400">{user.role} Privilege</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left p-2 text-rose-600 hover:bg-rose-500/5 rounded-lg font-bold"
                  >
                    Terminate Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic Stage Area */}
        <main className="p-6 max-w-7xl w-full mx-auto flex-1">
          {renderDashboardByRole()}
        </main>
      </div>
    </div>
  );
}
