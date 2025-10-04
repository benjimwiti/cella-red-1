-- Create a simple test table
CREATE TABLE public.test_table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.test_table (name) VALUES ('First Test Row');