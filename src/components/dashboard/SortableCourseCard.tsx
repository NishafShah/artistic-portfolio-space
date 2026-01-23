import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash, GripVertical } from 'lucide-react';
import { Course } from '@/types/course';
import SortableModuleList from './SortableModuleList';

interface SortableCourseCardProps {
  course: Course;
  onAddModule: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onDeleteModule: (courseId: string, moduleId: string) => void;
  onReorderModules: (courseId: string, oldIndex: number, newIndex: number) => void;
}

const SortableCourseCard = ({
  course,
  onAddModule,
  onDeleteCourse,
  onDeleteModule,
  onReorderModules,
}: SortableCourseCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
                aria-label="Drag to reorder course"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-16 h-16 object-cover rounded"
                  loading="lazy"
                />
              )}
              <div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.level} • {course.duration} • ${course.price}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddModule(course.id)}
              >
                <PlusCircle size={14} className="mr-1" />
                Add Module
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteCourse(course.id)}
              >
                <Trash size={14} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{course.description}</p>

          {course.modules.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Modules ({course.modules.length})</h4>
              <SortableModuleList
                courseId={course.id}
                modules={course.modules}
                onDeleteModule={onDeleteModule}
                onReorderModules={onReorderModules}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableCourseCard;
