import { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export default function Table({ headers, children, className = "" }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-900">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-150 dark:divide-slate-900 text-xs text-slate-700 dark:text-slate-300">
          {children}
        </tbody>
      </table>
    </div>
  );
}
export type { TableProps };
