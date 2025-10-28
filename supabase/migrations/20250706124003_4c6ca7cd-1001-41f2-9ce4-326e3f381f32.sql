
-- Create circles table
CREATE TABLE public.circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🏆',
  creator_id UUID REFERENCES auth.users NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'base64'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circle_members table
CREATE TABLE public.circle_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.circles ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('creator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(circle_id, user_id)
);

-- Create circle_invites table for tracking email invitations
CREATE TABLE public.circle_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.circles ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  UNIQUE(circle_id, email)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for circles
CREATE POLICY "Users can view circles they are members of" 
  ON public.circles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.circle_members 
      WHERE circle_id = circles.id 
      AND user_id = auth.uid() 
      AND status = 'approved'
    )
  );

CREATE POLICY "Users can create circles" 
  ON public.circles 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Circle creators can update their circles" 
  ON public.circles 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

-- RLS Policies for circle_members
CREATE POLICY "Users can view circle members for their circles" 
  ON public.circle_members 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.circle_members cm 
      WHERE cm.circle_id = circle_members.circle_id 
      AND cm.user_id = auth.uid() 
      AND cm.status = 'approved'
    )
  );

CREATE POLICY "Users can request to join circles" 
  ON public.circle_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Circle creators can manage memberships" 
  ON public.circle_members 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.circles 
      WHERE id = circle_members.circle_id 
      AND creator_id = auth.uid()
    )
  );

-- RLS Policies for circle_invites
CREATE POLICY "Users can view invites for their circles" 
  ON public.circle_invites 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.circles 
      WHERE id = circle_invites.circle_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Circle creators can create invites" 
  ON public.circle_invites 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.circles 
      WHERE id = circle_id 
      AND creator_id = auth.uid()
    )
  );

-- Function to automatically add creator as approved member
CREATE OR REPLACE FUNCTION public.add_circle_creator()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.circle_members (circle_id, user_id, role, status)
  VALUES (NEW.id, NEW.creator_id, 'creator', 'approved');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add creator as member
CREATE TRIGGER on_circle_created
  AFTER INSERT ON public.circles
  FOR EACH ROW EXECUTE FUNCTION public.add_circle_creator();
