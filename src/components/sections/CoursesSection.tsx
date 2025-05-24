
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  return (
    <section id="courses" className="py-24 px-4 bg-gradient-to-br from-purple-50 to-indigo-50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">Learning</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expand your skills with our comprehensive courses designed for all levels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              {course.image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {course.level}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{course.duration}</span>
                  <span className="font-semibold text-purple-600">${course.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">{course.description}</p>
                {course.modules.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {course.modules.length} module{course.modules.length !== 1 ? 's' : ''}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
