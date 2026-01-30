import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions
interface Coach {
  full_name: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  legajo: string;
  role: string;
  [key: string]: unknown;
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
export async function validateCoach(
  name: string,
  legajo: string
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', name)
      .eq('legajo', legajo)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" error, which is expected
      console.error('Error validating coach:', error.message);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error('Unexpected error in validateCoach:', err);
    return null;
  }
} 