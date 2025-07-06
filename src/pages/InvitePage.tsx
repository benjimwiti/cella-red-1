
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const InvitePage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found' | 'joined' | 'pending'>('loading');

  // Fetch circle by invite code
  const { data: circle, isLoading } = useQuery({
    queryKey: ['circle-invite', inviteCode],
    queryFn: async () => {
      if (!inviteCode) return null;
      
      const { data, error } = await supabase
        .from('circles')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();

      if (error) {
        setStatus('not-found');
        return null;
      }
      
      setStatus('found');
      return data;
    },
    enabled: !!inviteCode
  });

  // Check if user is already a member
  const { data: existingMembership } = useQuery({
    queryKey: ['existing-membership', circle?.id, user?.id],
    queryFn: async () => {
      if (!circle?.id || !user?.id) return null;
      
      const { data } = await supabase
        .from('circle_members')
        .select('*')
        .eq('circle_id', circle.id)
        .eq('user_id', user.id)
        .single();

      return data;
    },
    enabled: !!circle?.id && !!user?.id
  });

  // Join circle mutation
  const joinCircleMutation = useMutation({
    mutationFn: async () => {
      if (!circle?.id || !user?.id) throw new Error('Missing data');
      
      const { error } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circle.id,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setStatus('pending');
      queryClient.invalidateQueries({ queryKey: ['existing-membership'] });
    }
  });

  const handleJoinRequest = () => {
    if (!user) {
      // Redirect to auth with return URL
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    joinCircleMutation.mutate();
  };

  useEffect(() => {
    if (existingMembership) {
      if (existingMembership.status === 'approved') {
        setStatus('joined');
      } else if (existingMembership.status === 'pending') {
        setStatus('pending');
      }
    }
  }, [existingMembership]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
          <p className="mt-2 text-brand-charcoal/70">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-brand-red/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <X className="w-12 h-12 text-brand-red" />
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal mb-3">Invite Not Found</h1>
          <p className="text-brand-charcoal/70 mb-6">
            This invite link is invalid or has expired.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-brand-red hover:bg-brand-red/90 text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'joined') {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-brand-success rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal mb-3">You're already in this Circle!</h1>
          <p className="text-brand-charcoal/70 mb-6">
            Head to your Circle to see updates from your community.
          </p>
          <Button 
            onClick={() => navigate('/?tab=circle')}
            className="bg-brand-red hover:bg-brand-red/90 text-white"
          >
            Go to Circle
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-brand-warning/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-brand-warning" />
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal mb-3">Request Sent! 🎉</h1>
          <p className="text-brand-charcoal/70 mb-6">
            Your request has been sent to join <strong>{circle?.name}</strong>. 
            You'll be notified once the Circle creator approves it.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-brand-red hover:bg-brand-red/90 text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show circle preview and join option
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-brand-charcoal">Circle Invite</h1>
        </div>

        <Card className="bg-white shadow-card mb-6">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">{circle?.emoji || '🏆'}</div>
            <CardTitle className="text-2xl text-brand-charcoal">{circle?.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {circle?.description && (
              <p className="text-brand-charcoal/70 mb-6">{circle.description}</p>
            )}
            
            <div className="bg-blush-red rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-brand-charcoal mb-2">You're invited to join this Circle!</h3>
              <p className="text-sm text-brand-charcoal/70">
                Connect with other warriors and caregivers. Share progress, celebrate streaks, and support each other.
              </p>
            </div>

            {!user ? (
              <div className="space-y-4">
                <p className="text-sm text-brand-charcoal/70">
                  You need to sign in to join this Circle
                </p>
                <Button 
                  onClick={handleJoinRequest}
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white py-3 text-lg font-semibold rounded-xl"
                >
                  Sign In to Join
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleJoinRequest}
                disabled={joinCircleMutation.isPending}
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white py-3 text-lg font-semibold rounded-xl"
              >
                {joinCircleMutation.isPending ? 'Sending Request...' : 'Request to Join Circle'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvitePage;
