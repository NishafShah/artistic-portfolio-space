import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, DollarSign, Users, Play, Star, Zap, User, ImageOff, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnrollButton } from '@/components/EnrollButton';
import { CourseProgress } from '@/components/CourseProgress';
import { useUserEnrollments } from '@/hooks/useUserEnrollments';

interface CourseModule {
  id: string;
  title: string;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  level: string;
  duration: string;
  price: number;
  modules: CourseModule[];
  order_index?: number;
}

const DEFAULT_COURSE_IMAGE = '/placeholder.svg';

const CourseImage = memo(({ src, alt }: { src: string | null; alt: string }) => {
  const [imageSrc, setImageSrc] = useState<string>(src || DEFAULT_COURSE_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
    setImageSrc(DEFAULT_COURSE_IMAGE);
  }, []);

  if (hasError && !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <ImageOff className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      onError={handleError}
    />
  );
});

CourseImage.displayName = 'CourseImage';

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300';
    case 'Intermediate':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300';
    case 'Advanced':
      return 'bg-gradient-to-r from-red-400 to-pink-500 text-white border-red-300';
    default:
      return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300';
  }
};

interface CourseCardProps {
  course: Course;
  enrollmentData?: {
    progress_count: number;
    total_modules: number;
    completed_at: string | null;
  };
  supabaseUser: any;
}

const CourseCard = memo(({ course, enrollmentData, supabaseUser }: CourseCardProps) => {
  const isEnrolled = !!enrollmentData;
  const isCompleted = !!enrollmentData?.completed_at;

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-purple-300 bg-white/95 backdrop-blur-lg relative overflow-hidden ${
      isEnrolled ? 'ring-2 ring-green-400 ring-offset-2' : ''
    }`}>
      {/* Enrolled Badge */}
      {isEnrolled && (
        <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 shadow-lg`}>
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          {isCompleted ? 'Completed' : 'Enrolled'}
        </div>
      )}

      {/* Course Image */}
      <div className="aspect-video overflow-hidden rounded-t-lg relative">
        <CourseImage src={course.image_url} alt={course.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/80 backdrop-blur-lg rounded-full px-3 py-1.5 sm:px-4 sm:py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-white font-bold text-xs sm:text-sm flex items-center">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-yellow-400" />
            Course Content
          </span>
        </div>
      </div>

      <CardHeader className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <CardTitle className="text-lg sm:text-2xl font-heading font-bold group-hover:text-purple-600 transition-colors duration-500 line-clamp-2">
            {course.title}
          </CardTitle>
          <Badge className={`${getLevelColor(course.level)} font-bold border-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 flex-shrink-0 self-start`}>
            {course.level}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm sm:text-lg text-gray-600">
          <div className="flex items-center space-x-2 bg-purple-50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-purple-200">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="font-bold text-purple-700">{course.duration}</span>
          </div>
          {course.price > 0 && (
            <div className="flex items-center space-x-1 font-black text-xl sm:text-2xl text-gradient">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{course.price}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
        <p className="text-gray-700 text-sm sm:text-lg leading-relaxed line-clamp-3 font-medium">{course.description}</p>

        {/* Progress bar for enrolled courses */}
        {isEnrolled && enrollmentData && (
          <CourseProgress 
            completedModules={enrollmentData.progress_count}
            totalModules={enrollmentData.total_modules}
            isCompleted={isCompleted}
            size="sm"
          />
        )}

        {course.modules.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
              <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-lg text-purple-700">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-bold">
                  {course.modules.length} Module{course.modules.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-lg text-purple-700">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-bold">Learn</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Course Modules:</p>
              <div className="space-y-1.5 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                {course.modules.slice(0, 3).map((module) => (
                  <div key={module.id} className="flex items-center justify-between text-xs sm:text-sm bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-gray-100 hover:border-purple-200 transition-colors duration-300 shadow-sm">
                    <span className="font-bold text-gray-800 truncate flex-1">{module.title}</span>
                    <span className="text-purple-600 ml-2 sm:ml-3 font-bold flex-shrink-0">{module.duration}</span>
                  </div>
                ))}
                {course.modules.length > 3 && (
                  <div className="text-xs sm:text-sm text-center text-purple-600 font-bold bg-purple-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 border border-purple-200">
                    +{course.modules.length - 3} more modules
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 sm:mt-6">
          {isEnrolled ? (
            <Link to={`/course/${course.id}`}>
              <Button className={`w-full text-sm sm:text-lg py-3 sm:py-4 font-bold shadow-xl ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                {isCompleted ? 'Review Course' : 'Continue Learning'}
              </Button>
            </Link>
          ) : supabaseUser ? (
            <EnrollButton courseId={course.id} className="w-full text-sm sm:text-lg py-3 sm:py-4 font-bold shadow-xl" />
          ) : (
            <Link to={`/course/${course.id}`}>
              <Button className="w-full btn-primary group text-sm sm:text-lg py-3 sm:py-4 font-bold shadow-xl">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                View Course Details
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CourseCard.displayName = 'CourseCard';

const CoursesSection = memo(() => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, supabaseUser } = useAuth();
  const { toast } = useToast();
  const { enrollments } = useUserEnrollments();

  const getEnrollmentData = useCallback((courseId: string) => {
    return enrollments.find(e => e.course_id === courseId);
  }, [enrollments]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const [coursesRes, modulesRes] = await Promise.all([
          supabase.from('courses').select('*').order('order_index', { ascending: true }),
          supabase.from('course_modules').select('*').order('order_index', { ascending: true }),
        ]);

        if (coursesRes.error) throw coursesRes.error;
        if (modulesRes.error) throw modulesRes.error;

        const modulesData = modulesRes.data || [];
        const formattedCourses: Course[] = (coursesRes.data || []).map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          image_url: course.image_url,
          level: course.level,
          duration: course.duration || '',
          price: course.price || 0,
          modules: modulesData
            .filter(m => m.course_id === course.id)
            .map(m => ({
              id: m.id,
              title: m.title,
              duration: m.duration || '',
            })),
          order_index: course.order_index,
        }));
        
        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  // Loading skeleton
  if (loading) {
    return (
      <section id="courses" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 reveal">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-10 sm:h-12 bg-gray-200 rounded-full w-48 sm:w-64 mx-auto mb-6 sm:mb-8" />
            <div className="h-12 sm:h-16 bg-gray-200 rounded w-72 sm:w-96 mx-auto mb-6 sm:mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg h-80 sm:h-96" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <section id="courses" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 reveal">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-purple-200 text-purple-700 font-bold mb-6 sm:mb-8 text-sm sm:text-base">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Knowledge Sharing
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-gradient mb-6 sm:mb-8">Featured Courses</h2>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl border-2 border-purple-200 p-8 sm:p-12">
            <BookOpen className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-purple-400" />
            <p className="text-xl sm:text-2xl text-gray-600 font-semibold">No courses available yet</p>
            <p className="text-base sm:text-lg text-gray-500 mt-2">Check back soon for exciting learning opportunities!</p>
            {isAuthenticated && (
              <div className="mt-4 sm:mt-6">
                <Link to="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Add Courses
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 reveal relative overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-200/20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-200/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-purple-200 text-purple-700 font-bold mb-6 sm:mb-8 shadow-lg text-sm sm:text-base">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Featured Courses
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black text-gradient mb-4 sm:mb-8">
            My Courses
          </h2>
          <p className="text-base sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Explore the courses I've created to help you learn and grow in your journey.
          </p>
          <div className="flex justify-center mt-6 sm:mt-8">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-purple-200 shadow-lg text-sm sm:text-base">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="text-purple-700 font-bold">{courses.length} Course{courses.length !== 1 ? 's' : ''} Available</span>
            </div>
          </div>
          {isAuthenticated && (
            <div className="mt-4 sm:mt-6">
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Manage Courses
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrollmentData={getEnrollmentData(course.id)}
              supabaseUser={supabaseUser}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

CoursesSection.displayName = 'CoursesSection';

export default CoursesSection;
