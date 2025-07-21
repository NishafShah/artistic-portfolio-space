import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash, Edit, Check, X, Upload } from 'lucide-react';
import { Course, CourseModule } from '@/types/course';
import { supabase } from '@/integrations/supabase/client';

const CoursesManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    modules: [],
    price: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadCourses = async () => {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (coursesError) {
        console.error('Error loading courses:', coursesError);
        return;
      }

      // Load modules for each course
      const coursesWithModules = await Promise.all(
        coursesData.map(async (course) => {
          const { data: modulesData, error: modulesError } = await supabase
            .from('course_modules')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index', { ascending: true });

          if (modulesError) {
            console.error('Error loading modules:', modulesError);
            return {
              id: course.id,
              title: course.title,
              description: course.description,
              duration: course.duration || '4 weeks',
              level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
              modules: [],
              price: course.price || 0,
              createdAt: course.created_at,
            };
          }

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            duration: course.duration || '4 weeks',
            level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
            modules: modulesData.map(module => ({
              id: module.id,
              title: module.title,
              duration: module.duration || '1 hour',
              description: '',
              completed: false,
            })),
            price: course.price || 0,
            createdAt: course.created_at,
            image: course.image_url,
            instructor: course.instructor,
            tags: course.tags || [],
          };
        })
      );

      setCourses(coursesWithModules);
    };
    
    loadCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([{
          title: newCourse.title,
          description: newCourse.description,
          duration: newCourse.duration || '4 weeks',
          level: newCourse.level,
          price: newCourse.price || 0,
          image_url: newCourse.image,
          instructor: newCourse.instructor,
          tags: newCourse.tags || [],
          order_index: courses.length,
        }])
        .select()
        .single();

      if (courseError) throw courseError;

      // Add modules if any
      if (newCourse.modules && newCourse.modules.length > 0) {
        const modulesData = newCourse.modules.map((module, index) => ({
          course_id: courseData.id,
          title: module.title,
          duration: module.duration,
          order_index: index,
        }));

        const { error: modulesError } = await supabase
          .from('course_modules')
          .insert(modulesData);

        if (modulesError) throw modulesError;
      }

      const newCourseWithModules: Course = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        duration: courseData.duration || '4 weeks',
        level: courseData.level as 'Beginner' | 'Intermediate' | 'Advanced',
        modules: newCourse.modules || [],
        price: courseData.price || 0,
        createdAt: courseData.created_at,
        image: courseData.image_url,
        instructor: courseData.instructor,
        tags: courseData.tags || [],
      };

      setCourses([...courses, newCourseWithModules]);
      setNewCourse({
        title: '',
        description: '',
        duration: '',
        level: 'Beginner',
        modules: [],
        price: 0,
      });
      setShowAddForm(false);

      toast({
        title: "Course added",
        description: "Your course has been added successfully",
      });
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      // Delete course (modules will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      
      toast({
        title: "Course deleted",
        description: "The course has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleAddModule = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert([{
          course_id: courseId,
          title: 'New Module',
          duration: '1 hour',
          order_index: courses.find(c => c.id === courseId)?.modules.length || 0,
        }])
        .select()
        .single();

      if (error) throw error;

      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const newModule: CourseModule = {
            id: data.id,
            title: data.title,
            description: '',
            duration: data.duration || '1 hour',
            completed: false,
          };
          return { ...course, modules: [...course.modules, newModule] };
        }
        return course;
      });
      setCourses(updatedCourses);

      toast({
        title: "Module added",
        description: "New module has been added to the course",
      });
    } catch (error) {
      console.error('Error adding module:', error);
      toast({
        title: "Error",
        description: "Failed to add module",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return { ...course, modules: course.modules.filter(module => module.id !== moduleId) };
        }
        return course;
      });
      setCourses(updatedCourses);

      toast({
        title: "Module deleted",
        description: "Module has been removed from the course",
      });
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, courseId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    
    if (courseId) {
      // Update existing course image would need Supabase Storage implementation
      // For now, just update local state
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, image: imageUrl } : course
      );
      setCourses(updatedCourses);
    } else {
      setNewCourse({ ...newCourse, image: imageUrl });
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Courses Management</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Add Course
        </Button>
      </div>

      {showAddForm && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input
                  id="courseTitle"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <Label htmlFor="courseDuration">Duration</Label>
                <Input
                  id="courseDuration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  placeholder="e.g., 4 weeks"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseLevel">Level</Label>
                <Select
                  value={newCourse.level}
                  onValueChange={(value) => setNewCourse({ ...newCourse, level: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coursePrice">Price ($)</Label>
                <Input
                  id="coursePrice"
                  type="number"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="courseDescription">Description</Label>
              <Textarea
                id="courseDescription"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                placeholder="Enter course description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="courseImage">Course Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="courseImage"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
                <label htmlFor="courseImage" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload course image</p>
                </label>
                {newCourse.image && (
                  <img src={newCourse.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded mx-auto" />
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddCourse} className="bg-green-600 hover:bg-green-700">
                <Check size={16} className="mr-1" />
                Add Course
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {course.image && (
                    <img src={course.image} alt={course.title} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600">{course.level} • {course.duration} • ${course.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddModule(course.id)}
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Module
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{course.description}</p>
              
              {course.modules.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Modules ({course.modules.length})</h4>
                  <div className="space-y-2">
                    {course.modules.map((module) => (
                      <div key={module.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{module.title}</p>
                          <p className="text-xs text-gray-600">{module.duration}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModule(course.id, module.id)}
                        >
                          <Trash size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && !showAddForm && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-500 mb-4">No courses added yet</p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Your First Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoursesManager;