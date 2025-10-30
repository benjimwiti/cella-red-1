
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signInWithPassword: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, code: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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


 const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      console.error('❌ Sign-up failed:', error.message);
      return { data: null, error };
    }

    console.log('✅ Sign-up initiated:', data);
    return { data, error: null };

  } catch (err) {
    console.error('🚨 Unexpected error during signup flow:', err);
    return { data: null, error: err };
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

  const signInWithPassword = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign-in failed:', error.message);
        return { data: null, error };
      }

      console.log('✅ Sign-in successful:', data);
      return { data, error: null };
    } catch (err) {
      console.error('🚨 Unexpected error during sign-in:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const projectRef = supabaseUrl.split('//')[1].split('.')[0]; // e.g. "wnmmtawxyuionwhbfnbh"
    const storageKey = `sb-${projectRef}-auth-token`;

    const {data, error} = await supabase.auth.signOut();
    console.log("attempting sign out:", {data, error});
    if(!error) {
      localStorage.removeItem(storageKey);
      console.log('✅ Signed out successfully');
    } else {
      console.error('Error signing out:', error);
    }
};




  const value = {
    user,
    session,
    loading,
    signUp,
    signInWithPassword,
    signIn,
    signOut,
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
