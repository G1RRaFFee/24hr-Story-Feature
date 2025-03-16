import { useEffect, useState } from "react";

interface ProgressBarProps {
  duration: number; // Время для каждого сегмента (в миллисекундах)
  segments: number; // Количество сегментов (элементов)
  currentSegment: number; // Текущий активный сегмент
  initialProgress?: number[]; // Начальный прогресс для каждого сегмента
  onSegmentComplete?: (segmentIndex: number) => void; // Коллбэк при завершении сегмента
  className?: string; // Дополнительные классы для стилизации
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  segments,
  currentSegment,
  initialProgress = Array(segments).fill(0), // По умолчанию прогресс = 0
  onSegmentComplete,
  className,
}) => {
  const [progress, setProgress] = useState<number[]>(initialProgress);

  useEffect(() => {
    if (currentSegment >= segments) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / duration) * 100;

      if (newProgress >= 100) {
        setProgress((prev) => {
          const updatedProgress = [...prev];
          updatedProgress[currentSegment] = 100;
          return updatedProgress;
        });

        clearInterval(interval);
        onSegmentComplete?.(currentSegment);
      } else {
        setProgress((prev) => {
          const updatedProgress = [...prev];
          updatedProgress[currentSegment] = newProgress;
          return updatedProgress;
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [currentSegment, duration, segments, onSegmentComplete]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {progress.map((value, index) => (
        <div
          key={index}
          className="h-2 bg-gray-200 rounded-full flex-1 relative overflow-hidden"
        >
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${value}%`, transition: "width 0.1s linear" }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
