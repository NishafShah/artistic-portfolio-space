import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, DollarSign, BookOpen, Users, Play, CheckCircle, Star, Award, Globe, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollment } from '@/hooks/useEnrollment';
import { CourseProgress } from '@/components/CourseProgress';
import { EnrollButton } from '@/components/EnrollButton';

interface CourseModule {
  id: string;
  title: string;
  description?: string;
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

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { 
    isEnrolled, 
    isLoading: enrollmentLoading,
    moduleProgress,
    completeModule,
    uncompleteModule,
    isModuleCompleted,
    getProgressPercentage,
    unenroll,
    isCourseCompleted,
    completeCourse,
  } = useEnrollment(courseId);

  const DEFAULT_COURSE_IMAGE_URL = 'https://images.unsplash.com/photo-1510519138101-570d1dfa3d5f';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      if (!courseId) {
        toast({
          title: "Error",
          description: "No course ID provided.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course details:', courseError.message);
        toast({
          title: "Error",
          description: "Failed to load course details. Please try again later.",
          variant: "destructive",
        });
        setCourse(null);
        setLoading(false);
        return;
      }

      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) {
        console.error('Error fetching course modules:', modulesError.message);
      }

      const formattedCourse: Course = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        image_url: courseData.image_url,
        level: courseData.level,
        duration: courseData.duration || '',
        price: courseData.price || 0,
        modules: (modulesData || []).map(m => ({
          id: m.id,
          title: m.title,
          duration: m.duration || '',
          description: '',
        })),
        order_index: courseData.order_index,
      };
      setCourse(formattedCourse);
      setLoading(false);
    };

    fetchCourseDetails();
  }, [courseId, toast]);

  const handleModuleToggle = async (moduleId: string) => {
    if (!isEnrolled) {
      toast({
        title: 'Enrollment Required',
        description: 'Please enroll in this course to track your progress.',
        variant: 'destructive',
      });
      return;
    }

    if (isModuleCompleted(moduleId)) {
      await uncompleteModule(moduleId);
    } else {
      await completeModule(moduleId);
      
      // Check if all modules are completed
      if (course && moduleProgress.length + 1 === course.modules.length && !isCourseCompleted) {
        await completeCourse();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-2xl font-semibold text-gray-700">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 p-10 rounded-xl shadow-lg border-2 border-purple-200">
          <h1 className="text-4xl font-black text-gray-800 mb-6">Course Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-3">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Courses
          </Button>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'Intermediate':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'Advanced':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const progressPercentage = getProgressPercentage(course.modules.length);

  return (
    <>
      {course && (
        <Helmet>
          <title>{`${course.title} | ${course.level} Course – Syed Nishaf Hussain Shah`}</title>
          <meta name="description" content={course.description.slice(0, 155)} />
          <meta property="og:title" content={`${course.title} – Online Course`} />
          <meta property="og:description" content={course.description.slice(0, 155)} />
          {course.image_url && <meta property="og:image" content={course.image_url} />}
          <meta property="og:type" content="website" />
          <link rel="canonical" href={`https://artistic-portfolio-space.lovable.app/course/${course.id}`} />
        </Helmet>
      )}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-8 hover:bg-purple-50 text-purple-700 border-purple-300 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Courses
        </Button>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative">
            <div className="w-full h-80 md:h-96 overflow-hidden rounded-2xl shadow-2xl mb-8">
              <img 
                src={course.image_url || DEFAULT_COURSE_IMAGE_URL}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_COURSE_IMAGE_URL;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
                  {course.title}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <Badge className={`${getLevelColor(course.level)} font-bold px-4 py-2 text-lg`}>
                    <Award className="w-5 h-5 mr-2" />
                    {course.level}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-lg text-white font-bold px-4 py-2 text-lg border border-white/30">
                    <Clock className="w-5 h-5 mr-2" />
                    {course.duration}
                  </Badge>
                  {isEnrolled && (
                    <Badge className="bg-green-500/80 backdrop-blur-lg text-white font-bold px-4 py-2 text-lg border border-green-400/30">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {isCourseCompleted ? 'Completed' : `${progressPercentage}% Complete`}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enrollment Card */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  {isEnrolled ? 'Your Progress' : 'Get Started'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled && (
                  <CourseProgress 
                    completedModules={moduleProgress.length}
                    totalModules={course.modules.length}
                    isCompleted={isCourseCompleted}
                    size="lg"
                  />
                )}
                
                {!isEnrolled ? (
                  <EnrollButton courseId={course.id} className="w-full text-lg py-6" />
                ) : (
                  <div className="space-y-3">
                    {isCourseCompleted ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Course Completed! 🎉
                      </Button>
                    ) : (
                      <p className="text-center text-muted-foreground">
                        Complete all modules to finish the course
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={unenroll}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Unenroll
                    </Button>
                  </div>
                )}

                {course.price > 0 && !isEnrolled && (
                  <div className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <DollarSign className="w-6 h-6 text-green-600 mr-1" />
                    <span className="font-bold text-green-700 text-3xl">{course.price}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Info Card */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center">
                  <Star className="w-6 h-6 mr-2" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-800">Duration</span>
                  </div>
                  <span className="font-bold text-purple-700 text-lg">{course.duration}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-800">Modules</span>
                  </div>
                  <span className="font-bold text-purple-700 text-lg">{course.modules.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-800">Format</span>
                  </div>
                  <span className="font-bold text-purple-700">Online</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800">
                  About This Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            {/* Modules */}
            {course.modules.length > 0 && (
              <Card className="shadow-xl border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Course Curriculum ({course.modules.length} Modules)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module, index) => {
                      const completed = isModuleCompleted(module.id);
                      return (
                        <div 
                          key={module.id}
                          className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                            completed 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                              : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100 hover:border-purple-300'
                          }`}
                          onClick={() => isEnrolled && handleModuleToggle(module.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                              completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-purple-600 text-white'
                            }`}>
                              {completed ? <CheckCircle className="w-6 h-6" /> : index + 1}
                            </div>
                            <div>
                              <h3 className={`font-bold text-xl ${completed ? 'text-green-800' : 'text-gray-800'}`}>
                                {module.title}
                              </h3>
                              {module.description && (
                                <p className="text-gray-600 mt-1">{module.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`font-bold text-lg ${completed ? 'text-green-600' : 'text-purple-600'}`}>
                              {module.duration}
                            </span>
                            {isEnrolled ? (
                              completed ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <Play className="w-6 h-6 text-purple-500" />
                              )
                            ) : (
                              <Play className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {!isEnrolled && isAuthenticated && (
                    <div className="mt-6 text-center">
                      <p className="text-muted-foreground mb-4">Enroll to track your progress through the modules</p>
                      <EnrollButton courseId={course.id} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseDetail;
