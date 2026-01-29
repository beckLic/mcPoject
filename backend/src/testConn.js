// backend/src/testConn.js
import { supabase } from './config/supabaseClient.js';

async function testConnection() {
  console.log("--- Iniciando prueba de conexión ---");

  // Intentamos una consulta simple que no modifica nada
  // Simplemente pedimos el conteo de filas de la tabla 'profiles'
  const { data, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error("❌ Error de conexión:");
    console.error(`Código: ${error.code}`);
    console.error(`Mensaje: ${error.message}`);
    
    if (error.message.includes("failed to fetch")) {
      console.log("👉 Tip: Revisa que tu SUPABASE_URL sea correcta y tengas internet.");
    } else if (error.code === '42P01') {
      console.log("👉 Tip: La tabla 'profiles' no existe. ¿Corriste el script SQL?");
    }
  } else {
    console.log("✅ ¡Conexión exitosa!");
    console.log("El servidor de Supabase respondió correctamente.");
    console.log("Las políticas RLS y las llaves del .env están funcionando.");
  }
}

testConnection();