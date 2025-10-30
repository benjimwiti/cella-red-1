CREATE TABLE public.medication_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  notify_daily_summary BOOLEAN NOT NULL DEFAULT TRUE,
  notify_before BOOLEAN NOT NULL DEFAULT TRUE,
  notify_after BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on medication_preferences table
ALTER TABLE public.medication_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for medication_preferences
CREATE POLICY "Users can view their own medication preferences"
  ON public.medication_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medication preferences"
  ON public.medication_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication preferences"
  ON public.medication_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication preferences"
  ON public.medication_preferences
  FOR DELETE
  USING (auth.uid() = user_id);
