
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// env variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan las credenciales de Supabase en el .env");
}

// Inicializamos el cliente
export const supabase = createClient(supabaseUrl, supabaseKey);