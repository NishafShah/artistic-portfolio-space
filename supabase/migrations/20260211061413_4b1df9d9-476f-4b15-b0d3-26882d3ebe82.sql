
-- Enable RLS on contact_form table
ALTER TABLE public.contact_form ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous) to submit contact form
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_form
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view contact submissions
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_form
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete contact submissions
CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_form
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
