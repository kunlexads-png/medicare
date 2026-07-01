import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, roleOrPassword?: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, role: UserRole, extra?: { department?: string; specialization?: string; phone?: string }) => Promise<boolean>;
  register: (data: { email: string; password?: string; name: string; dob: string; gender: string; phone: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<boolean>;
  confirmPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define default test users for rapid role swapping
const TEST_USERS: Record<string, { name: string; role: UserRole; department?: string; specialization?: string; phone?: string }> = {
  "admin@medicare.com": { name: "System Admin", role: "Admin" },
  "doctor@medicare.com": { name: "Dr. Lisa Thompson", role: "Doctor", department: "General Medicine", specialization: "Family Medicine", phone: "+1 (555) 123-4567" },
  "receptionist@medicare.com": { name: "Sarah Connor", role: "Receptionist" },
  "nurse@medicare.com": { name: "Amanda Cooper", role: "Nurse" },
  "pharmacist@medicare.com": { name: "David Miller", role: "Pharmacist" },
  "patient@medicare.com": { name: "Jane Smith", role: "Patient", phone: "+1 (555) 876-5432" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to load user from localStorage
    const storedUser = localStorage.getItem("medicare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("medicare_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, roleOrPassword?: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Support mapping .pro addresses to our test users
    const lookupEmail = normalizedEmail.replace(".pro", ".com");
    const testUser = TEST_USERS[lookupEmail] || TEST_USERS[normalizedEmail];

    let role: UserRole = "Patient";
    if (testUser) {
      role = testUser.role;
    } else if (normalizedEmail.includes("admin")) {
      role = "Admin";
    } else if (normalizedEmail.includes("doctor")) {
      role = "Doctor";
    } else if (normalizedEmail.includes("nurse")) {
      role = "Nurse";
    } else if (normalizedEmail.includes("pharmacist")) {
      role = "Pharmacist";
    } else if (normalizedEmail.includes("receptionist")) {
      role = "Receptionist";
    } else if (roleOrPassword && ["Admin", "Doctor", "Receptionist", "Nurse", "Pharmacist", "Patient"].includes(roleOrPassword)) {
      role = roleOrPassword as UserRole;
    }

    let authenticatedUser: User;

    if (testUser) {
      authenticatedUser = {
        id: lookupEmail === "patient@medicare.com" ? "pat-2" : (lookupEmail === "doctor@medicare.com" ? "doc-1" : `usr-${Math.random().toString(36).substr(2, 9)}`),
        email: normalizedEmail,
        name: testUser.name,
        role: testUser.role,
        department: testUser.department,
        specialization: testUser.specialization,
        phone: testUser.phone,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(testUser.name)}`
      };
    } else {
      authenticatedUser = {
        id: `pat-${Math.random().toString(36).substr(2, 9)}`,
        email: normalizedEmail,
        name: email.split("@")[0].replace(".", " "),
        role: role,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`
      };
    }

    setUser(authenticatedUser);
    localStorage.setItem("medicare_user", JSON.stringify(authenticatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medicare_user");
  };

  const registerUser = async (
    name: string,
    email: string,
    role: UserRole,
    extra?: { department?: string; specialization?: string; phone?: string }
  ): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();
    
    TEST_USERS[normalizedEmail] = {
      name,
      role,
      department: extra?.department,
      specialization: extra?.specialization,
      phone: extra?.phone
    };

    return login(normalizedEmail, role);
  };

  const register = async (data: {
    email: string;
    password?: string;
    name: string;
    dob: string;
    gender: string;
    phone: string;
  }): Promise<boolean> => {
    const normalizedEmail = data.email.toLowerCase().trim();
    
    TEST_USERS[normalizedEmail] = {
      name: data.name,
      role: "Patient",
      phone: data.phone
    };

    return login(normalizedEmail, "Patient");
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulated forgot password request success
    console.log(`Password reset code dispatched to ${email}`);
    return true;
  };

  const resetPasswordRequest = async (email: string): Promise<boolean> => {
    return true;
  };

  const confirmPasswordReset = async (email: string): Promise<boolean> => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerUser,
        register,
        forgotPassword,
        resetPasswordRequest,
        confirmPasswordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
