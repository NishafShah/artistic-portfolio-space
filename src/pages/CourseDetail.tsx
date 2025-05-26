
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, DollarSign, BookOpen, Users, Play, CheckCircle, Star, Award, Globe } from 'lucide-react';
import { Course } from '@/types/course';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('portfolio_courses') || '[]');
    const foundCourse = storedCourses.find((c: Course) => c.id === courseId);
    setCourse(foundCourse || null);
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-8 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Button>

        {/* Hero Section with Course Image and Title */}
        <div className="mb-12">
          <div className="relative">
            {course.image ? (
              <div className="w-full h-80 md:h-96 overflow-hidden rounded-2xl shadow-2xl mb-8">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover"
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
            ) : (
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gradient mb-6">
                  {course.title}
                </h1>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge className={`${getLevelColor(course.level)} font-bold px-6 py-3 text-lg`}>
                    <Award className="w-5 h-5 mr-2" />
                    {course.level}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 font-bold px-6 py-3 text-lg border border-purple-300">
                    <Clock className="w-5 h-5 mr-2" />
                    {course.duration}
                  </Badge>
                </div>
              </div>
            )}
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
                            <p className="text-gray-600 mt-1">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-purple-600 font-bold text-lg">{module.duration}</span>
                          <CheckCircle className="w-6 h-6 text-green-500" />
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
