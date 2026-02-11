
-- Drop the overly permissive policy on hero_stats
DROP POLICY IF EXISTS "Allow all insert/select/update for unauthenticated" ON public.hero_stats;

-- Allow anyone to read hero stats (public portfolio data)
CREATE POLICY "Anyone can view hero stats"
  ON public.hero_stats
  FOR SELECT
  USING (true);

-- Only admins can insert hero stats
CREATE POLICY "Admins can insert hero stats"
  ON public.hero_stats
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update hero stats
CREATE POLICY "Admins can update hero stats"
  ON public.hero_stats
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete hero stats
CREATE POLICY "Admins can delete hero stats"
  ON public.hero_stats
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
