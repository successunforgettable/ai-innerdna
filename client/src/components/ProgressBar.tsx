interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const progressPercent = (current / total) * 100;

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className="text-sm font-medium text-blue-600">
            {current} of {total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="progress-bar bg-blue-600 h-2 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
