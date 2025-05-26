
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, DollarSign, BookOpen, Users, Play, CheckCircle } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-8 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Course Image and Basic Info */}
          <div className="lg:col-span-1">
            {course.image && (
              <div className="aspect-video overflow-hidden rounded-xl shadow-2xl mb-6">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className={`${getLevelColor(course.level)} font-bold px-4 py-2`}>
                    {course.level}
                  </Badge>
                  {course.price > 0 && (
                    <div className="flex items-center text-3xl font-black text-gradient">
                      <DollarSign className="w-8 h-8" />
                      <span>{course.price}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-purple-700 bg-purple-50 rounded-lg p-3">
                    <Clock className="w-6 h-6" />
                    <span className="font-bold text-lg">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-purple-700 bg-purple-50 rounded-lg p-3">
                    <BookOpen className="w-6 h-6" />
                    <span className="font-bold text-lg">
                      {course.modules.length} Module{course.modules.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-purple-700 bg-purple-50 rounded-lg p-3">
                    <Users className="w-6 h-6" />
                    <span className="font-bold text-lg">Learn & Grow</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-black text-gradient mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Modules */}
            {course.modules.length > 0 && (
              <Card className="shadow-xl border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Course Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <div 
                        key={module.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{module.title}</h3>
                            <p className="text-gray-600">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-purple-600 font-bold">{module.duration}</span>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enroll Button */}
            <div className="mt-8">
              <Button className="w-full btn-primary text-xl py-6 font-bold shadow-xl">
                <Play className="w-6 h-6 mr-3" />
                Start Learning Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
