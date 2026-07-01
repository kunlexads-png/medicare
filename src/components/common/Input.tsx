import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2 text-xs rounded-lg border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-150 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-medium text-red-500 mt-0.5">{error}</span>
        )}
        {helperText && !error && (
          <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
