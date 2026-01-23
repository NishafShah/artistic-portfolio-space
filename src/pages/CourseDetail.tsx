import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, DollarSign, BookOpen, Users, Play, CheckCircle, Star, Award, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { useToast } from '@/hooks/use-toast'; // Import useToast for error handling

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
  const { courseId } = useParams<{ courseId: string }>(); // Specify type for useParams
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const { toast } = useToast(); // Initialize toast

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

      // Fetch course data
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

      // Fetch modules for this course
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
  }, [courseId, toast]); // Re-fetch if courseId changes or toast instance changes

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700 animate-pulse">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Course not found state
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

  // Helper function for badge colors
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-8 hover:bg-purple-50 text-purple-700 border-purple-300 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Courses
        </Button>

        {/* Hero Section with Course Image and Title */}
        <div className="mb-12">
          <div className="relative">
            <div className="w-full h-80 md:h-96 overflow-hidden rounded-2xl shadow-2xl mb-8">
              <img 
                src={course.image_url || DEFAULT_COURSE_IMAGE_URL} // Use image_url and fallback
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => { // Fallback on image loading error
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
                  <Badge className="bg-white/20 backdrop-blur-lg text-white font-bold px-4 py-2 text-lg border border-white/30">
                    <Globe className="w-5 h-5 mr-2" />
                    Online Course
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
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
                    <Award className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-800">Level</span>
                  </div>
                  <Badge className={`${getLevelColor(course.level)} font-bold px-3 py-1`}>
                    {course.level}
                  </Badge>
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
                    <Users className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-800">Format</span>
                  </div>
                  <span className="font-bold text-purple-700">Online</span>
                </div>

                {course.price > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <span className="font-bold text-gray-800">Price</span>
                    </div>
                    <span className="font-bold text-green-700 text-2xl">${course.price}</span>
                  </div>
                )}
                {/* Consider adding a "Buy Now" or "Enroll" button here if applicable */}
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center">
                  <Star className="w-6 h-6 mr-2" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Lifetime Access</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Certificate of Completion</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Expert Support</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Mobile & Desktop Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800">
                  About This Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {course.description}
                </p>
                
                {/* This button could link to an external platform or a "start learning" section if you have one */}
                <Button className="w-full btn-primary text-xl py-6 font-bold shadow-xl">
                  <Play className="w-6 h-6 mr-3" />
                  Start Learning Now
                </Button>
              </CardContent>
            </Card>

            {/* Course Modules */}
            {course.modules.length > 0 && (
              <Card className="shadow-xl border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Course Curriculum ({course.modules.length} Modules)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <div 
                        key={module.id}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-800">{module.title}</h3>
                            {/* Display module description if available */}
                            {module.description && <p className="text-gray-600 mt-1">{module.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-purple-600 font-bold text-lg">{module.duration}</span>
                          {/* Consider dynamically showing if a module is completed/playable */}
                          <Play className="w-6 h-6 text-purple-500 cursor-pointer hover:text-purple-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;