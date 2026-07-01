/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, Shield, Mail, Lock, User, Calendar, Phone, 
  ArrowRight, ShieldCheck, Sparkles, Check, HelpCircle, Key, Eye, EyeOff,
  Activity, Pill
} from 'lucide-react';

interface AuthPagesProps {
  onSuccess: () => void;
}

const ROSTER_ROLES = [
  {
    role: "Admin",
    label: "System Administrator",
    email: "admin@medicare.pro",
    icon: ShieldCheck,
    description: "Full clinical systems administration, audit logging ledger, user directory, and bed capacity control.",
    borderColor: "border-rose-500/10 hover:border-rose-500/30 dark:border-rose-500/5 dark:hover:border-rose-500/20",
    textColor: "text-rose-600 dark:text-rose-400",
    bgLightColor: "bg-rose-500/10",
    glowColor: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
    modules: ["Staff Roster", "Audit Logs", "Vitals Dashboard", "Bed Registry"]
  },
  {
    role: "Doctor",
    label: "Chief Medical Specialist",
    email: "doctor@medicare.pro",
    icon: Heart,
    description: "Write diagnoses, formulate prescriptions, check patient health cards, and analyze diagnostic queues.",
    borderColor: "border-sky-500/10 hover:border-sky-500/30 dark:border-sky-500/5 dark:hover:border-sky-500/20",
    textColor: "text-sky-600 dark:text-sky-400",
    bgLightColor: "bg-sky-500/10",
    glowColor: "bg-sky-500",
    gradient: "from-sky-500 to-blue-600",
    modules: ["Diagnosis EMR", "Digital RX", "Lab Orders", "Visit History"]
  },
  {
    role: "Nurse",
    label: "Clinical Ward Nurse",
    email: "nurse@medicare.pro",
    icon: Activity,
    description: "Register live vitals (pulse, BP, oxygen), oversee bed allocations, and handle incoming critical alerts.",
    borderColor: "border-emerald-500/10 hover:border-emerald-500/30 dark:border-emerald-500/5 dark:hover:border-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgLightColor: "bg-emerald-500/10",
    glowColor: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
    modules: ["Vitals Entry", "Active Alarms", "Bed Assigns", "Meds Scheduler"]
  },
  {
    role: "Pharmacist",
    label: "Chief Lead Pharmacist",
    email: "pharmacist@medicare.pro",
    icon: Pill,
    description: "Control medicine inventory stocks, check expiry schedules, dispense active doctor prescriptions, and log bills.",
    borderColor: "border-teal-500/10 hover:border-teal-500/30 dark:border-teal-500/5 dark:hover:border-teal-500/20",
    textColor: "text-teal-600 dark:text-teal-400",
    bgLightColor: "bg-teal-500/10",
    glowColor: "bg-teal-500",
    gradient: "from-teal-500 to-emerald-600",
    modules: ["Drug Stock", "Dispenser", "Reorder Alerts", "Billing Logs"]
  },
  {
    role: "Receptionist",
    label: "Front Desk Receptionist",
    email: "receptionist@medicare.pro",
    icon: Calendar,
    description: "Book doctor appointment slots, register new patient records, manage invoices, and search the directory.",
    borderColor: "border-violet-500/10 hover:border-violet-500/30 dark:border-violet-500/5 dark:hover:border-violet-500/20",
    textColor: "text-violet-600 dark:text-violet-400",
    bgLightColor: "bg-violet-500/10",
    glowColor: "bg-violet-500",
    gradient: "from-violet-500 to-purple-600",
    modules: ["Appointment Book", "Patient Files", "Invoice Panel", "Clinical Search"]
  },
  {
    role: "Patient",
    label: "Patient Portal",
    email: "patient@medicare.pro",
    icon: User,
    description: "Inspect personal diagnostic summaries, prescription directions, care histories, and billing receipts.",
    borderColor: "border-indigo-500/10 hover:border-indigo-500/30 dark:border-indigo-500/5 dark:hover:border-indigo-500/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
    bgLightColor: "bg-indigo-500/10",
    glowColor: "bg-indigo-500",
    gradient: "from-indigo-500 to-violet-600",
    modules: ["My Health EMR", "Visit Schedule", "My RX List", "Receipt Archive"]
  }
];

export default function AuthPages({ onSuccess }: AuthPagesProps) {
  const { login, register, forgotPassword } = useAuth();
  
  const [view, setView] = useState<'roster' | 'login' | 'register' | 'forgot'>('roster');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid login credentials. Please use one of the quick demo buttons or enter valid registered accounts.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!name || !email || !password || !dob || !phone) {
        setError('Please fill in all clinical registration fields.');
        return;
      }
      const success = await register({
        email,
        password,
        name,
        dob,
        gender,
        phone
      });
      if (success) {
        setSuccessMsg('Patient account registered successfully! You can now log in.');
        setView('login');
        setPassword('');
      } else {
        setError('An account with this email address already exists.');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const sent = await forgotPassword(email);
    if (sent) {
      setSuccessMsg(`A secure recovery link and temporary PIN have been transmitted to ${email}.`);
      setView('login');
    } else {
      setError('Email address not found in our medical database.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    const success = await login(demoEmail, 'password');
    if (success) {
      onSuccess();
    }
  };

  if (view === 'roster') {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm transition-colors duration-300">
        
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

        {/* Top bar with Brand Logo and standard login switches */}
        <header className="relative z-10 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-teal-500/20 text-xl tracking-tight">
              M
            </div>
            <div>
              <span className="block font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">MediCare Pro</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Clinical EMR Ecosystem</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setView('register');
                setError(null);
              }}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
            >
              Register Patient
            </button>
            <button
              onClick={() => {
                setView('login');
                setError(null);
              }}
              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold text-xs shadow-md shadow-teal-500/10 transition-colors cursor-pointer"
            >
              Secure Sign In
            </button>
          </div>
        </header>

        {/* Hero Title and Subtitle */}
        <main className="relative z-10 max-w-7xl w-full mx-auto py-8 flex-1 flex flex-col justify-center">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3 h-3" /> Live HMS Explorer
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-slate-100">
              Interactive EMR Portal & Quick-Access Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Authenticate and transition instantly into any of the 6 integrated clinical roles. Explore customized EMR modules, pharmacy controls, and real-time medical alarm systems.
            </p>
          </div>

          {/* 3x2 Bento Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROSTER_ROLES.map((role) => {
              const IconComponent = role.icon;
              return (
                <div
                  key={role.role}
                  className={`relative group bg-white dark:bg-slate-900 border ${role.borderColor} rounded-2xl p-5 shadow-xs hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Subtle color glow backplate */}
                  <div className={`absolute -right-12 -top-12 w-24 h-24 rounded-full ${role.glowColor}/10 blur-2xl opacity-40 group-hover:scale-150 transition-all duration-500`} />
                  
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${role.bgLightColor} ${role.textColor} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 select-all font-semibold">
                        {role.email}
                      </span>
                    </div>

                    {/* Role Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {role.label}
                      </h3>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Core Functions / Modules */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="block text-[9px] uppercase font-extrabold tracking-wider text-slate-400">
                        Integrated Clinical Modules
                      </span>
                      <ul className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {role.modules.map((mod, index) => (
                          <li key={index} className="flex items-center gap-1.5 truncate">
                            <span className={`${role.textColor}`}>•</span>
                            <span className="truncate">{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Action button */}
                  <div className="pt-5 mt-auto">
                    <button
                      onClick={() => handleQuickLogin(role.email)}
                      className={`w-full py-2 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 group-hover:border-transparent group-hover:bg-gradient-to-r ${role.gradient} group-hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer`}
                    >
                      Authenticate Session <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 max-w-7xl w-full mx-auto text-center pt-8 border-t border-slate-200/50 dark:border-slate-800/50 text-slate-400 text-[11px] font-medium">
          MediCare Pro EMR Console v1.4.0 — All sessions sandboxed and compliant with clinical demonstration protocol.
        </footer>

      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm">
      
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

      {/* Brand Header */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <button
          onClick={() => {
            setView('roster');
            setError(null);
          }}
          className="mx-auto h-12 w-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-teal-500/20 cursor-pointer"
        >
          M
        </button>
        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-slate-100">
          MediCare Pro
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Comprehensive Clinical Command and Patient Ledger Ecosystem
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl sm:px-10 space-y-6">
          
          {/* Status Alerts */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 font-medium leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" /> {successMsg}
            </div>
          )}

          {/* VIEW 1: LOGIN */}
          {view === 'login' && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Medical Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. doctor@medicare.pro"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold">Security Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-6"
                >
                  Authenticate Session <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Back to Interactive Roster Link */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Want to test specific clinical dashboards?</p>
                <button
                  type="button"
                  onClick={() => {
                    setView('roster');
                    setError(null);
                  }}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-600 dark:text-teal-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-100 dark:border-slate-800/60 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch Interactive Explorer Roster
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-slate-400">New patient? </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setError(null);
                  }}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Register Profile
                </button>
              </div>
            </>
          )}

          {/* VIEW 2: REGISTER */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Birth Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Sex</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Telephone Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 555-0199"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Choose Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-4"
              >
                Register Medical File <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError(null);
                  }}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="text-center space-y-2 mb-4">
                <Key className="w-10 h-10 text-teal-500 mx-auto" />
                <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 text-sm">Recover Security Account</h3>
                <p className="text-xs text-slate-400">Enter your clinical email address and we will dispatch password recovery instructions.</p>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Your Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@medicare.pro"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-4"
              >
                Transmit Recover Link <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError(null);
                  }}
                  className="font-semibold text-slate-500 hover:text-slate-700 hover:underline"
                >
                  Back to Log In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
