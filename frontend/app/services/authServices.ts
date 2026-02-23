import { supabase } from "@/lib/supabase";

// Type definitions
interface Coach {
  full_name: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  legajo: string;
  role: string;
  [key: string]: unknown;
}

interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Fetches all coaches (users with role 'Entrenador') from the profiles table
 * @returns Array of coach names or empty array if none found
 */
export async function getCoaches(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('role', 'Entrenador');

    if (error) {
      console.error('Error fetching coaches:', error.message);
      return [];
    }

    return data?.map((coach: Coach) => coach.full_name) || [];
  } catch (err) {
    console.error('Unexpected error in getCoaches:', err);
    return [];
  }
}

/**
 * Validates if a user exists with the given name and legajo
 * @param name - Full name of the user
 * @param legajo - Employee ID number
 * @returns User object if found, null otherwise
 */
export async function validateCoach(name: string, legajo: string) {
  try {
    // Sanitización: quitamos espacios vacíos accidentales
    const cleanName = name.trim();
    const cleanLegajo = legajo.trim();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', cleanName)
      .eq('legajo', cleanLegajo)
      .single();

    if (error) {
      console.error('Validation error:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}

/**
 * Authenticates a user with email/password and returns its profile
 * @param email - User email
 * @param password - User password
 * @returns User profile if auth succeeds, null otherwise
 */
export async function loginUser(email: string, password: string): Promise<UserProfile | null> {
  try {
    const credentials: LoginCredentials = {
      email: email.trim(),
      password,
    };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error || !data.user) {
      console.error('Login error:', error?.message || 'No user returned by Supabase auth');
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError?.message || 'Profile not found');
      return null;
    }

    return profile as UserProfile;
  } catch (err) {
    console.error('Unexpected error in loginUser:', err);
    return null;
  }
}