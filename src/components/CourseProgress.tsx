import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';

interface CourseProgressProps {
  completedModules: number;
  totalModules: number;
  isCompleted?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CourseProgress = ({
  completedModules,
  totalModules,
  isCompleted = false,
  showLabel = true,
  size = 'md',
}: CourseProgressProps) => {
  const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">Completed</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {completedModules} of {totalModules} modules
                </span>
              </>
            )}
          </div>
          <span className="font-semibold text-foreground">{percentage}%</span>
        </div>
      )}
      <Progress 
        value={percentage} 
        className={`${heightClass} ${isCompleted ? '[&>div]:bg-green-500' : ''}`}
      />
    </div>
  );
};
