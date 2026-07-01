import { createContext, useContext, ReactNode } from "react";
import { useHospital } from "./HospitalContext";
import { Invoice } from "../types";

interface BillingContextType {
  invoices: Invoice[];
  generateInvoice: (invoice: Omit<Invoice, "id" | "paymentHistory" | "status">) => void;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const { invoices, generateInvoice, payInvoice } = useHospital();

  return (
    <BillingContext.Provider value={{ invoices, generateInvoice, payInvoice }}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useHospital();
  return {
    invoices: context.invoices,
    generateInvoice: context.generateInvoice,
    payInvoice: context.payInvoice,
  };
}
