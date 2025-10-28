-- Drop unused frequency column
ALTER TABLE public.medications
DROP COLUMN frequency;

-- Change time_of_day to store array of timestamps
ALTER TABLE public.medications DROP COLUMN time_of_day;
ALTER TABLE public.medications ADD COLUMN time_of_day TIMESTAMPTZ[];



-- Add columns for tracking medication status
ALTER TABLE public.medications
ADD COLUMN last_taken_at TIMESTAMPTZ,
ADD COLUMN is_taken BOOLEAN DEFAULT FALSE;
