interface ProgressBarProps {
  progress: number // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between text-sm text-amber-700 mb-1">
        <span>먹는 중...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-4 bg-amber-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-200 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
