
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, DollarSign, Users, Play } from 'lucide-react';
import { Course } from '@/types/course';

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('portfolio_courses') || '[]');
    setCourses(storedCourses);
  }, []);

  if (courses.length === 0) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section id="courses" className="py-24 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 font-medium mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Knowledge Sharing
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-gradient mb-6">Featured Courses</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expand your skills with our comprehensive courses designed for all levels of expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card 
              key={course.id} 
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-gray-100 hover:border-purple-200 bg-white/90 backdrop-blur-sm animate-fade-in" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {course.image && (
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Button
                    size="sm"
                    className="absolute top-4 right-4 bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
              )}
              
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-heading font-bold group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <Badge className={`${getLevelColor(course.level)} font-semibold border text-xs px-2 py-1`}>
                    {course.level}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-lg text-gradient">
                    <DollarSign className="w-4 h-4" />
                    <span>{course.price}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{course.description}</p>
                
                {course.modules.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium">
                          {course.modules.length} module{course.modules.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">1.2k students</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Course Modules:</p>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {course.modules.slice(0, 3).map((module, idx) => (
                          <div key={module.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
                            <span className="font-medium text-gray-700 truncate flex-1">{module.title}</span>
                            <span className="text-gray-500 ml-2">{module.duration}</span>
                          </div>
                        ))}
                        {course.modules.length > 3 && (
                          <div className="text-xs text-center text-gray-500 font-medium">
                            +{course.modules.length - 3} more modules
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <Button className="w-full btn-primary group mt-4">
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
