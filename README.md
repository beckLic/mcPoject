Idea del proyecto

Una web de las 4 secciones de trabajo de McDonalds (LObby,Cocina,Servicio y CDP), en cada secciòn se podràn visualizar
tarjetas con informaciòn de las politicas de seguridad e higiene que tiene la empresa, la web tiene dos roles, Crew y Entrenador, el acceso como Crew solo te permite navegar y visualizar por las 4 secciones de la web, mientras que como Entrenador podes hacer un CRUD sobre las tarjetas. Estas mismas estàn conformadas por un titulo, una textbox donde està la informacion relacionada con el titulo, fecha de creaciòn y autor, si es editada entonces va a mostrar su fecha de update y quien lo hizo.
Esta idea surge de que en esta empresa toman pruebas constantemente a los empleados sobre informacion que no esta muy a mano y es de dificil acceso, con esta web lo que se busca es que los Entrenadores proporcionen estos datos de manera mas transparente y facil.
-------------------------------------------------------------------------------------------------------
Tecnologias:

Frontend: Next.js + Tailwind CSS para una interfaz rápida y responsiva.
Backend: Node.js como capa de validación y lógica de negocio compleja.
BaaS: Supabase para persistencia, autenticación y notificaciones en tiempo real.
----------------------------------------------------------------------------------------------------
Roadmap
Fase 1: Cimientos y Modelo de Datos 
Definición de Esquema: Creación de tablas profiles y cards en Supabase.

Lógica de Negocio en DB: Implementación de Tipos ENUM para secciones (Servicio, Cocina, Lobby, Postres) y roles.

Automatización: Configuración de Triggers SQL para auditoría automática de actualizaciones.

Fase 2: Backend y Seguridad (En Proceso) 
Conexión Segura: Integración de Node.js con Supabase mediante variables de entorno (.env).

Sistema de Roles (RBAC): Configuración de políticas de seguridad a nivel de fila (RLS).

Autenticación: Desarrollo de la lógica de registro y login para Entrenadores validando el legajo.

Fase 3: Frontend y Tiempo Real 
Interfaz Dinámica: Construcción del dashboard con Next.js y Tailwind CSS.

Sincronización: Implementación de WebSockets (Supabase Realtime) para que el Crew vea cambios al instante sin refrescar.

Modo Lectura/Escritura: UI condicional basada en el rol detectado.

Conceptos de Ingeniería Aplicados
1. Row Level Security (RLS) y POLP
Concepto: Principio de Menor Privilegio (Principle of Least Privilege).

Por qué: El Crew no debe tener permisos de escritura a nivel de base de datos. Si un usuario malintencionado intenta usar la API Key desde la consola del navegador para borrar datos, la base de datos rechazará la petición por sí sola, sin depender del frontend.

2. Borrado Lógico (Soft Deletes)
Concepto: En lugar de DELETE físico, se usa una columna deleted_at.

Por qué: En el entorno de alta presión de un local de comida, los errores humanos son comunes. El borrado lógico permite la recuperación instantánea de datos y mantiene la integridad histórica de quién eliminó qué información.

3. Idempotencia
Concepto: Garantizar que una operación realizada múltiples veces produzca el mismo resultado.

Por qué: Previene la creación de tarjetas duplicadas en caso de fallos de red o clics dobles en el botón de guardado por parte de los Entrenadores.

4. Trazabilidad y Auditoría Automática
Concepto: Uso de Triggers y funciones de base de datos para metadatos.

Por qué: Para el control de calidad, es vital saber quién creó o editó cada instrucción. Al delegar esto a la base de datos mediante triggers, eliminamos el riesgo de que el desarrollador olvide registrar estos datos en el código del servidor.

5. Integridad Referencial y Tipado Fuerte
Concepto: Uso de Enums y Foreign Keys (FK).

Por qué: Evita "datos basura". No se puede asignar una tarjeta a una sección que no existe, ni vincular una edición a un usuario inexistente. Esto asegura que el sistema sea consistente a largo plazo.
