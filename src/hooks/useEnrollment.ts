import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
}

interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  course_id: string;
  completed_at: string;
}

export const useEnrollment = (courseId?: string) => {
  const { supabaseUser } = useAuth();
  const { toast } = useToast();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enrollment status
  const fetchEnrollment = useCallback(async () => {
    if (!supabaseUser || !courseId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;

      setEnrollment(data);
      setIsEnrolled(!!data);
    } catch (error) {
      console.error('Error fetching enrollment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseUser, courseId]);

  // Fetch module progress
  const fetchModuleProgress = useCallback(async () => {
    if (!supabaseUser || !courseId) return;

    try {
      const { data, error } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .eq('course_id', courseId);

      if (error) throw error;

      setModuleProgress(data || []);
    } catch (error) {
      console.error('Error fetching module progress:', error);
    }
  }, [supabaseUser, courseId]);

  useEffect(() => {
    fetchEnrollment();
    fetchModuleProgress();
  }, [fetchEnrollment, fetchModuleProgress]);

  // Enroll in course
  const enroll = async () => {
    if (!supabaseUser || !courseId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to enroll in this course.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: supabaseUser.id,
          course_id: courseId,
        })
        .select()
        .single();

      if (error) throw error;

      setEnrollment(data);
      setIsEnrolled(true);
      toast({
        title: 'Enrolled Successfully!',
        description: 'You are now enrolled in this course.',
      });
      return true;
    } catch (error: any) {
      console.error('Error enrolling:', error);
      toast({
        title: 'Enrollment Failed',
        description: error.message || 'Could not enroll in this course.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Unenroll from course
  const unenroll = async () => {
    if (!supabaseUser || !courseId) return false;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('user_id', supabaseUser.id)
        .eq('course_id', courseId);

      if (error) throw error;

      // Also delete module progress
      await supabase
        .from('module_progress')
        .delete()
        .eq('user_id', supabaseUser.id)
        .eq('course_id', courseId);

      setEnrollment(null);
      setIsEnrolled(false);
      setModuleProgress([]);
      toast({
        title: 'Unenrolled',
        description: 'You have been unenrolled from this course.',
      });
      return true;
    } catch (error: any) {
      console.error('Error unenrolling:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not unenroll from this course.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Mark module as complete
  const completeModule = async (moduleId: string) => {
    if (!supabaseUser || !courseId) return false;

    try {
      const { data, error } = await supabase
        .from('module_progress')
        .insert({
          user_id: supabaseUser.id,
          module_id: moduleId,
          course_id: courseId,
        })
        .select()
        .single();

      if (error) throw error;

      setModuleProgress(prev => [...prev, data]);
      toast({
        title: 'Module Completed!',
        description: 'Your progress has been saved.',
      });
      return true;
    } catch (error: any) {
      // Handle duplicate (already completed)
      if (error.code === '23505') {
        toast({
          title: 'Already Completed',
          description: 'You have already completed this module.',
        });
        return false;
      }
      console.error('Error completing module:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not save progress.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Uncomplete module
  const uncompleteModule = async (moduleId: string) => {
    if (!supabaseUser || !courseId) return false;

    try {
      const { error } = await supabase
        .from('module_progress')
        .delete()
        .eq('user_id', supabaseUser.id)
        .eq('module_id', moduleId);

      if (error) throw error;

      setModuleProgress(prev => prev.filter(p => p.module_id !== moduleId));
      return true;
    } catch (error: any) {
      console.error('Error uncompleting module:', error);
      return false;
    }
  };

  // Check if a module is completed
  const isModuleCompleted = (moduleId: string) => {
    return moduleProgress.some(p => p.module_id === moduleId);
  };

  // Calculate progress percentage
  const getProgressPercentage = (totalModules: number) => {
    if (totalModules === 0) return 0;
    return Math.round((moduleProgress.length / totalModules) * 100);
  };

  // Mark course as completed
  const completeCourse = async () => {
    if (!supabaseUser || !courseId || !enrollment) return false;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', enrollment.id);

      if (error) throw error;

      setEnrollment(prev => prev ? { ...prev, completed_at: new Date().toISOString() } : null);
      toast({
        title: 'Course Completed! 🎉',
        description: 'Congratulations on completing this course!',
      });
      return true;
    } catch (error: any) {
      console.error('Error completing course:', error);
      return false;
    }
  };

  return {
    enrollment,
    isEnrolled,
    isLoading,
    moduleProgress,
    enroll,
    unenroll,
    completeModule,
    uncompleteModule,
    isModuleCompleted,
    getProgressPercentage,
    completeCourse,
    isCourseCompleted: !!enrollment?.completed_at,
    refetch: () => {
      fetchEnrollment();
      fetchModuleProgress();
    },
  };
};
