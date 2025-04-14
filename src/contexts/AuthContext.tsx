
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  checkUserRole: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user role if authenticated
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      setIsLoading(false);
    });

    // Set up a periodic token refresh to ensure session stays active
    const refreshInterval = setInterval(() => {
      if (session) {
        console.log("Refreshing auth session");
        supabase.auth.refreshSession();
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } else {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      setUserRole(null);
    }
  };

  const checkUserRole = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      } 
      
      return data.role;
    } catch (error) {
      console.error("Failed to check user role:", error);
      return null;
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    setIsLoading(false);
    return { error };
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    setIsLoading(false);
    return { error };
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    setUserRole(null);
    navigate('/login');
  };

  const value = {
    user,
    session,
    userRole,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    checkUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
