-- Fix 1: Remove public SELECT on reviews base table to prevent email exposure
-- The reviews_public view (without security_invoker) runs as owner and bypasses RLS,
-- so public users will still see approved reviews through the view without emails.
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;

-- Fix 2: Remove duplicate INSERT policy on contact_form
DROP POLICY IF EXISTS "Allow public insert" ON public.contact_form;