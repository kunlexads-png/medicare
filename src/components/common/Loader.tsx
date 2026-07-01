interface LoaderProps {
  type?: 'spinner' | 'page' | 'skeleton-card' | 'skeleton-table';
}

export default function Loader({ type = 'spinner' }: LoaderProps) {
  if (type === "page") {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <span className="text-xs text-slate-400 font-medium">Securing records, please wait...</span>
      </div>
    );
  }

  if (type === "skeleton-card") {
    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-full bg-white dark:bg-slate-950 animate-pulse space-y-3 shrink-0">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
      </div>
    );
  }

  if (type === "skeleton-table") {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-xl w-full"></div>
        <div className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full"></div>
        <div className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full"></div>
        <div className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}
export type { LoaderProps };
