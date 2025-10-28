-- Create mood_logs table
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  mood_level INTEGER NOT NULL CHECK (mood_level >= 1 AND mood_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mood_logs
CREATE POLICY "Users can view their own mood logs"
  ON public.mood_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood logs"
  ON public.mood_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood logs"
  ON public.mood_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_mood_logs_user_date ON public.mood_logs(user_id, date);
