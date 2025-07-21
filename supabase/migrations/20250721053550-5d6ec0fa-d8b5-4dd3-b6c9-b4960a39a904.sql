-- Create skills table
CREATE TABLE public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  level integer NOT NULL DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  category text NOT NULL CHECK (category IN ('Language', 'Framework')),
  icon text,
  image_url text,
  order_index integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies for skills
CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage skills" 
ON public.skills 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create about_me table
CREATE TABLE public.about_me (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  title text,
  bio text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_me ENABLE ROW LEVEL SECURITY;

-- Create policies for about_me
CREATE POLICY "Anyone can view about info" 
ON public.about_me 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage about info" 
ON public.about_me 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add triggers for updated_at
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_me_updated_at
BEFORE UPDATE ON public.about_me
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();