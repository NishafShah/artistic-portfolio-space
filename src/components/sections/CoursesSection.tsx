import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, DollarSign, Users, Play, Star, Zap, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { useToast } from '@/hooks/use-toast'; // Import useToast for error handling

// Define the Course interface to match your Supabase table schema
// Ensure the keys match your Supabase column names (e.g., 'image_url' instead of 'image')
interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string; // Changed from 'image' to 'image_url' for Supabase schema
  level: string;
  duration: string;
  price: number;
  modules: Array<{ id: string; title: string; duration: string }>;
  order_index?: number; // Assuming you might have an order_index for sorting
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [visibleCourses, setVisibleCourses] = useState<number>(0);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses') // Ensure 'courses' is your actual table name
        .select('*')
        .order('order_index', { ascending: true }); // Order by order_index if you have one

      if (error) {
        console.error('Error fetching courses:', error.message);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
      } else {
        // Map Supabase data to your frontend Course interface if column names differ
        const formattedCourses: Course[] = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          image_url: course.image_url, // Assuming Supabase column is 'image_url'
          level: course.level,
          duration: course.duration,
          price: course.price,
          // Ensure modules is an array, as it might be stored as JSONB
          modules: Array.isArray(course.modules) ? course.modules : [],
          order_index: course.order_index,
        }));
        setCourses(formattedCourses);
      }
    };

    fetchCourses();
  }, [toast]); // Added toast to dependency array

  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCourses(prev => Math.max(prev, index + 1));
        }, index * 200);
      });
    }
  }, [courses]);

  const DEFAULT_COURSE_IMAGE_URL = 'https://images.unsplash.com/photo-1510519138101-570d1dfa3d5f'; // Add a default image URL

  if (courses.length === 0) {
    return (
      <section id="courses" className="py-24 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 reveal">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-purple-200 text-purple-700 font-bold mb-8 animate-bounce">
            <BookOpen className="w-5 h-5 mr-3 animate-pulse" />
            Knowledge Sharing
          </div>
          <h2 className="text-5xl md:text-6xl font-heading font-black text-gradient mb-8 animate-fade-in">Featured Courses</h2>
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border-2 border-purple-200 p-12 animate-float">
            <BookOpen className="w-24 h-24 mx-auto mb-6 text-purple-400 animate-pulse" />
            <p className="text-2xl text-gray-600 font-semibold">No courses available yet</p>
            <p className="text-lg text-gray-500 mt-2">Check back soon for exciting learning opportunities!</p>
            {isAuthenticated && (
              <div className="mt-6">
                <Link to="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <User className="w-5 h-5 mr-2" />
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300 shadow-lg shadow-green-200';
      case 'Intermediate':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-lg shadow-yellow-200';
      case 'Advanced':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white border-red-300 shadow-lg shadow-red-200';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300 shadow-lg shadow-gray-200';
    }
  };

  return (
    <section id="courses" className="py-24 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 reveal relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full animate-float opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-pink-200 rounded-full animate-bounce opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-purple-200 text-purple-700 font-bold mb-8 animate-bounce shadow-xl">
            <BookOpen className="w-5 h-5 mr-3 animate-pulse" />
            Featured Courses
          </div>
          <h2 className="text-5xl md:text-7xl font-heading font-black text-gradient mb-8 animate-fade-in">
            My Courses
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Explore the courses I've created to help you learn and grow in your journey.
          </p>
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg rounded-full px-6 py-3 border-2 border-purple-200 shadow-lg">
              <Star className="w-5 h-5 text-yellow-500 animate-spin" />
              <span className="text-purple-700 font-bold">{courses.length} Course{courses.length !== 1 ? 's' : ''} Available</span>
            </div>
          </div>
          {isAuthenticated && (
            <div className="mt-6">
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <User className="w-5 h-5 mr-2" />
                  Manage Courses
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className={`group hover:shadow-2xl transition-all duration-700 hover:scale-110 border-4 border-gray-200 hover:border-purple-300 bg-white/95 backdrop-blur-lg animate-fade-in relative overflow-hidden ${
                index < visibleCourses ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
                transform: index < visibleCourses ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.7s ease-out'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-gradient"></div>

              {/* Changed course.image to course.image_url */}
              {course.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <img
                    src={course.image_url || DEFAULT_COURSE_IMAGE_URL} // Use default if image_url is null/empty
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    onError={(e) => { // Fallback on image loading error
                      (e.target as HTMLImageElement).src = DEFAULT_COURSE_IMAGE_URL;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-lg rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-white font-bold text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                      Course Content
                    </span>
                  </div>
                </div>
              )}

              <CardHeader className="space-y-6 relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-heading font-bold group-hover:text-purple-600 transition-colors duration-500 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <Badge className={`${getLevelColor(course.level)} font-bold border-2 text-sm px-4 py-2 transform group-hover:scale-110 transition-transform duration-300`}>
                    {course.level}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-lg text-gray-600">
                  <div className="flex items-center space-x-2 bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-purple-700">{course.duration}</span>
                  </div>
                  {course.price > 0 && (
                    <div className="flex items-center space-x-2 font-black text-2xl text-gradient">
                      <DollarSign className="w-6 h-6" />
                      <span>{course.price}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed line-clamp-3 font-medium">{course.description}</p>

                {course.modules.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center space-x-3 text-lg text-purple-700">
                        <BookOpen className="w-6 h-6" />
                        <span className="font-bold">
                          {course.modules.length} Module{course.modules.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-lg text-purple-700">
                        <Users className="w-6 h-6" />
                        <span className="font-bold">Learn</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Course Modules:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {course.modules.slice(0, 3).map((module, idx) => (
                          <div key={module.id} className="flex items-center justify-between text-sm bg-white rounded-xl p-3 border-2 border-gray-100 hover:border-purple-200 transition-colors duration-300 shadow-sm">
                            <span className="font-bold text-gray-800 truncate flex-1">{module.title}</span>
                            <span className="text-purple-600 ml-3 font-bold">{module.duration}</span>
                          </div>
                        ))}
                        {course.modules.length > 3 && (
                          <div className="text-sm text-center text-purple-600 font-bold bg-purple-50 rounded-xl p-2 border border-purple-200">
                            +{course.modules.length - 3} more modules
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Link to={`/course/${course.id}`}>
                  <Button className="w-full btn-primary group mt-6 text-lg py-4 font-bold shadow-xl">
                    <Play className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform duration-300" />
                    View Course Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;