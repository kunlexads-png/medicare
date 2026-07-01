export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export default function Badge({ children, variant = 'primary' }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-900/30";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
      case "danger":
        return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900/30";
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/30";
      case "neutral":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-800/30";
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30";
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getColors()}`}>
      {children}
    </span>
  );
}
