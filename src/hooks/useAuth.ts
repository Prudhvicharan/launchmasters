import { useState, useEffect, useCallback } from "react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import type { User as AppUser } from "../types";

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const fetchUserProfile = useCallback(async (user: SupabaseUser | null) => {
    if (!user) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthState({
        user: profile,
        session,
        loading: false,
        error: null,
        isAuthenticated: !!session,
      });
    } catch (error) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load user profile",
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetchUserProfile(session?.user ?? null);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserProfile(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { error: error.message, requiresConfirmation: false };
    }

    const requiresConfirmation = !!data.user && !data.session;
    setAuthState((prev) => ({ ...prev, loading: false }));
    return { error: null, requiresConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { error: error.message };
    }
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setAuthState((prev) => ({
      ...prev,
      loading: false,
      error: error?.message || null,
    }));
    return { error: error?.message || null };
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!authState.user) return { error: "Not authenticated" };
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", authState.user.id)
      .select()
      .single();

    if (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { error: error.message };
    }

    setAuthState((prev) => ({
      ...prev,
      user: data,
      loading: false,
      error: null,
    }));
    return { error: null };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}
