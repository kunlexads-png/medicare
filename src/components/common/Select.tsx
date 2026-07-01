import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = "", id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-3.5 py-2 text-xs rounded-lg border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-150 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
          } ${className}`}
          {...props}
        >
          {children
            ? children
            : options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>
        {error && (
          <span className="text-[10px] font-medium text-red-500 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
