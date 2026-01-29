-- ==========================================
-- 1. LIMPIEZA TOTAL (Reset)
-- ==========================================
DROP TABLE IF EXISTS public.cards;
DROP TABLE IF EXISTS public.profiles;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.section_name;

-- ==========================================
-- 2. DEFINICIÓN DE TIPOS (Enums)
-- ==========================================
CREATE TYPE public.user_role AS ENUM ('Entrenador', 'Crew');
CREATE TYPE public.section_name AS ENUM ('Servicio', 'Cocina', 'Lobby', 'Centro de Postres');

-- ==========================================
-- 3. TABLA DE PERFILES
-- ==========================================
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  legajo text UNIQUE,
  role user_role DEFAULT 'Crew',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 4. TABLA DE TARJETAS (Con Auditoría)
-- ==========================================
CREATE TABLE public.cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  section section_name NOT NULL,
  
  -- Campos de trazabilidad
  created_by uuid REFERENCES public.profiles(id),
  updated_by uuid REFERENCES public.profiles(id),
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone -- Para Soft Delete
);

-- ==========================================
-- 5. SEGURIDAD DE NIVEL DE FILA (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Política: Perfiles legibles por todos
CREATE POLICY "Perfiles visibles por todos" ON public.profiles FOR SELECT USING (true);

-- Política: Crew solo puede VER tarjetas (Select)
CREATE POLICY "Crew puede ver tarjetas" 
ON public.cards FOR SELECT 
USING (deleted_at IS NULL);

-- Política: Entrenadores pueden hacer TODO (CRUD)
CREATE POLICY "Entrenadores control total" 
ON public.cards FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'Entrenador'
  )
);

-- ==========================================
-- 6. AUTOMATIZACIÓN (Auditoría Automática)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_card_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_card_update
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_card_update();