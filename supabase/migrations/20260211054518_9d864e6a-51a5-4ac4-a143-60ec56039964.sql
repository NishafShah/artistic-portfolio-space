
-- 1. Remove overly permissive policies on projects table
DROP POLICY IF EXISTS "Public CRUD for Projects" ON public.projects;
DROP POLICY IF EXISTS "Allow insert for all" ON public.projects;
DROP POLICY IF EXISTS "Allow read for all" ON public.projects;

-- Keep user-specific policies + add public SELECT for portfolio viewing
CREATE POLICY "Anyone can view projects"
ON public.projects FOR SELECT
USING (true);

-- 2. Remove overly permissive policies on skills table
DROP POLICY IF EXISTS "Public CRUD for Skills" ON public.skills;
DROP POLICY IF EXISTS "Allow insert for all" ON public.skills;

-- 3. Create a public view for reviews that excludes email
CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = on) AS
SELECT id, reviewer_name, rating, review_text, created_at, is_approved
FROM public.reviews
WHERE is_approved = true;

GRANT SELECT ON public.reviews_public TO anon, authenticated;
