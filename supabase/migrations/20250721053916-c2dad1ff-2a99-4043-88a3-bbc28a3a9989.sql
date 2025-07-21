-- Create courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  duration text,
  level text NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  price numeric DEFAULT 0,
  image_url text,
  instructor text,
  tags text[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_modules table
CREATE TABLE public.course_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text,
  order_index integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Create policies for courses
CREATE POLICY "Anyone can view courses" 
ON public.courses 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage courses" 
ON public.courses 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create policies for course_modules
CREATE POLICY "Anyone can view course modules" 
ON public.course_modules 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage course modules" 
ON public.course_modules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();