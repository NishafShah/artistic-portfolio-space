import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollmentWithCourse {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  course: {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    level: string;
    duration: string | null;
  };
  progress_count: number;
  total_modules: number;
}

export const useUserEnrollments = () => {
  const { supabaseUser } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    if (!supabaseUser) {
      setEnrollments([]);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) throw enrollmentError;

      if (!enrollmentData || enrollmentData.length === 0) {
        setEnrollments([]);
        setIsLoading(false);
        return;
      }

      // Get course IDs
      const courseIds = enrollmentData.map(e => e.course_id);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, image_url, level, duration')
        .in('id', courseIds);

      if (coursesError) throw coursesError;

      // Fetch module counts per course
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('course_id')
        .in('course_id', courseIds);

      if (modulesError) throw modulesError;

      // Count modules per course
      const moduleCounts: Record<string, number> = {};
      (modulesData || []).forEach(m => {
        moduleCounts[m.course_id] = (moduleCounts[m.course_id] || 0) + 1;
      });

      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('module_progress')
        .select('course_id')
        .eq('user_id', supabaseUser.id)
        .in('course_id', courseIds);

      if (progressError) throw progressError;

      // Count progress per course
      const progressCounts: Record<string, number> = {};
      (progressData || []).forEach(p => {
        progressCounts[p.course_id] = (progressCounts[p.course_id] || 0) + 1;
      });

      // Combine data
      const enrichedEnrollments: EnrollmentWithCourse[] = enrollmentData.map(enrollment => {
        const course = coursesData?.find(c => c.id === enrollment.course_id);
        return {
          id: enrollment.id,
          course_id: enrollment.course_id,
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          course: course || {
            id: enrollment.course_id,
            title: 'Unknown Course',
            description: '',
            image_url: null,
            level: 'Unknown',
            duration: null,
          },
          progress_count: progressCounts[enrollment.course_id] || 0,
          total_modules: moduleCounts[enrollment.course_id] || 0,
        };
      });

      setEnrollments(enrichedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseUser]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    isLoading,
    refetch: fetchEnrollments,
  };
};
