import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No records found",
  description = "There are no matches or data entries to display at this time.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-inner">
      <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 dark:text-slate-500 mb-3">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-tight">
        {title}
      </h3>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-normal">
        {description}
      </p>
    </div>
  );
}
export type { EmptyStateProps };
