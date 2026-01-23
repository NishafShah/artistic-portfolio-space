import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Trash, GripVertical } from 'lucide-react';
import { CourseModule } from '@/types/course';

interface SortableModuleItemProps {
  module: CourseModule;
  courseId: string;
  onDelete: (courseId: string, moduleId: string) => void;
}

const SortableModuleItem = ({ module, courseId, onDelete }: SortableModuleItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center p-2 bg-muted/50 rounded border border-border"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
          aria-label="Drag to reorder module"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <p className="font-medium text-sm">{module.title}</p>
          <p className="text-xs text-muted-foreground">{module.duration}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(courseId, module.id)}
      >
        <Trash size={12} />
      </Button>
    </div>
  );
};

export default SortableModuleItem;
