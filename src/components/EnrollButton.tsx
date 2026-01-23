import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollment } from '@/hooks/useEnrollment';
import { BookOpen, LogIn, Loader2, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EnrollButtonProps {
  courseId: string;
  variant?: 'default' | 'card';
  className?: string;
}

export const EnrollButton = ({ courseId, variant = 'default', className = '' }: EnrollButtonProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isEnrolled, isLoading: enrollmentLoading, enroll, isCourseCompleted } = useEnrollment(courseId);

  const isLoading = authLoading || enrollmentLoading;

  if (isLoading) {
    return (
      <Button disabled className={className}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button asChild className={className}>
        <Link to="/login">
          <LogIn className="w-4 h-4 mr-2" />
          Sign in to Enroll
        </Link>
      </Button>
    );
  }

  if (isCourseCompleted) {
    return (
      <Button variant="outline" className={`${className} border-green-500 text-green-600 hover:bg-green-50`} asChild>
        <Link to={`/course/${courseId}`}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed - Review
        </Link>
      </Button>
    );
  }

  if (isEnrolled) {
    return (
      <Button className={`${className} bg-green-600 hover:bg-green-700`} asChild>
        <Link to={`/course/${courseId}`}>
          <Play className="w-4 h-4 mr-2" />
          Continue Learning
        </Link>
      </Button>
    );
  }

  return (
    <Button onClick={enroll} className={className}>
      <BookOpen className="w-4 h-4 mr-2" />
      Enroll Now
    </Button>
  );
};
