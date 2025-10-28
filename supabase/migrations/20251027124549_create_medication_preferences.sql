CREATE TABLE public.medication_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  notify_daily_summary BOOLEAN NOT NULL DEFAULT TRUE,
  notify_before BOOLEAN NOT NULL DEFAULT TRUE,
  notify_after BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);