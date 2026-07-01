import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { HospitalProvider } from "./context/HospitalContext";
import { PatientProvider } from "./context/PatientContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { BillingProvider } from "./context/BillingContext";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <HospitalProvider>
            <PatientProvider>
              <AppointmentProvider>
                <BillingProvider>
                  <AppRouter />
                </BillingProvider>
              </AppointmentProvider>
            </PatientProvider>
          </HospitalProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
