import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CourseModule } from '@/types/course';
import SortableModuleItem from './SortableModuleItem';

interface SortableModuleListProps {
  courseId: string;
  modules: CourseModule[];
  onDeleteModule: (courseId: string, moduleId: string) => void;
  onReorderModules: (courseId: string, oldIndex: number, newIndex: number) => void;
}

const SortableModuleList = ({
  courseId,
  modules,
  onDeleteModule,
  onReorderModules,
}: SortableModuleListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      onReorderModules(courseId, oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={modules.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {modules.map((module) => (
            <SortableModuleItem
              key={module.id}
              module={module}
              courseId={courseId}
              onDelete={onDeleteModule}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableModuleList;
