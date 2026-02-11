
-- =============================================
-- 1. Fix SECURITY DEFINER functions: add search_path and improvements
-- =============================================

-- Fix handle_new_user: add search_path, input validation, idempotency
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  safe_name TEXT;
BEGIN
  safe_name := TRIM(SUBSTRING(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 1, 255));
  
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, safe_name)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column: add search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_skills_updated_at: add search_path
CREATE OR REPLACE FUNCTION public.update_skills_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================
-- 2. Fix overly permissive RLS policies
-- =============================================

-- about_me: Drop permissive ALL policy, keep public SELECT, add admin-only writes
DROP POLICY IF EXISTS "Allow all for dev" ON public.about_me;

CREATE POLICY "Admins can insert about info"
  ON public.about_me FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can update about info"
  ON public.about_me FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can delete about info"
  ON public.about_me FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

-- course_modules: Drop permissive ALL policy, keep public SELECT, add admin-only writes
DROP POLICY IF EXISTS "Allow all access for testing" ON public.course_modules;

CREATE POLICY "Admins can insert course modules"
  ON public.course_modules FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can update course modules"
  ON public.course_modules FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can delete course modules"
  ON public.course_modules FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

-- courses: Drop permissive ALL policy, keep public SELECT, add admin-only writes
DROP POLICY IF EXISTS "Allow full access to courses" ON public.courses;

CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );
