
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, code: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendOTP: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password: email, // Using email as password for OTP-based auth
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    return { error };
  };

  const sendOTP = async (email: string) => {
    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send custom email using our Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-auth-email', {
        body: {
          email,
          token: otp,
          type: 'signup'
        }
      });

      if (emailError) {
        console.error('Failed to send custom email:', emailError);
        // Fallback to Supabase's built-in OTP
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        return { error };
      }

      // Store the OTP temporarily for verification (in a real app, this would be server-side)
      sessionStorage.setItem(`otp_${email}`, JSON.stringify({
        code: otp,
        timestamp: Date.now(),
        expires: Date.now() + (10 * 60 * 1000) // 10 minutes
      }));

      return { error: null };
    } catch (error) {
      console.error('Error in sendOTP:', error);
      return { error };
    }
  };

  const signIn = async (email: string, code: string) => {
    try {
      // Check our custom OTP first
      const storedOTP = sessionStorage.getItem(`otp_${email}`);
      
      if (storedOTP) {
        const { code: expectedCode, expires } = JSON.parse(storedOTP);
        
        if (Date.now() > expires) {
          sessionStorage.removeItem(`otp_${email}`);
          return { error: { message: 'Verification code has expired' } };
        }
        
        if (code === expectedCode) {
          sessionStorage.removeItem(`otp_${email}`);
          
          // Create a session by signing up the user (for demo purposes)
          const { error } = await supabase.auth.signUp({
            email,
            password: email,
            options: {
              emailRedirectTo: `${window.location.origin}/`
            }
          });
          
          return { error };
        } else {
          return { error: { message: 'Invalid verification code' } };
        }
      }
      
      // Fallback to Supabase's built-in OTP verification
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });
      
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
