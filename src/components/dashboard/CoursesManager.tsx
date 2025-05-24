
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
    const storedCourses = JSON.parse(localStorage.getItem('portfolio_courses') || '[]');
    setCourses(storedCourses);
  }, []);

  const saveCourses = (updatedCourses: Course[]) => {
    localStorage.setItem('portfolio_courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const course: Course = {
      id: `course_${Date.now()}`,
      title: newCourse.title!,
      description: newCourse.description!,
      duration: newCourse.duration || '4 weeks',
      level: newCourse.level as 'Beginner' | 'Intermediate' | 'Advanced',
      modules: [],
      price: newCourse.price || 0,
      image: newCourse.image,
      createdAt: new Date().toISOString(),
    };

    const updatedCourses = [...courses, course];
    saveCourses(updatedCourses);
    setNewCourse({ title: '', description: '', duration: '', level: 'Beginner', modules: [], price: 0 });
    setShowAddForm(false);
    
    toast({
      title: "Course added",
      description: "New course has been created successfully",
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    saveCourses(updatedCourses);
    
    toast({
      title: "Course deleted",
      description: "Course has been removed successfully",
    });
  };

  const handleAddModule = (courseId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const newModule: CourseModule = {
          id: `module_${Date.now()}`,
          title: 'New Module',
          description: 'Module description',
          duration: '1 hour',
          completed: false,
        };
        return { ...course, modules: [...course.modules, newModule] };
      }
      return course;
    });
    saveCourses(updatedCourses);
  };

  const handleDeleteModule = (courseId: string, moduleId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return { ...course, modules: course.modules.filter(module => module.id !== moduleId) };
      }
      return course;
    });
    saveCourses(updatedCourses);
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
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, image: imageUrl } : course
      );
      saveCourses(updatedCourses);
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
