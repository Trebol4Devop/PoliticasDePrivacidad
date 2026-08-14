# Política de Privacidad — PEMTREE (Web App)

**App:** PEMTREE (Grafo de Estudios USAC)  
**Plataforma:** Web App (`https://pemtree.netlify.app/`)  
**Desarrollador / Administrador:** Trebol4Devop (Proyecto Comunitario Independiente)  
**Público Objetivo:** Estudiantes, docentes y comunidad universitaria de la Facultad de Ingeniería de la Universidad de San Carlos de Guatemala (FIUSAC)  
**Última actualización:** 13 de agosto de 2026  
**Fecha de vigencia:** 13 de agosto de 2026  

---

## 1. Información General y Deslinde Institucional

Esta Política de Privacidad describe cómo **PEMTREE** ("la Plataforma", "la Web App", "nosotros", "nuestro"), desarrollada y administrada por la iniciativa comunitaria **Trebol4Devop**, recopila, almacena, procesa y protege la información de los usuarios ("usted") al acceder y utilizar nuestro sitio web oficial [https://pemtree.netlify.app/](https://pemtree.netlify.app/).

### Deslinde Institucional y Naturaleza del Servicio
PEMTREE es un proyecto de código abierto independiente creado por y para la comunidad estudiantil de la **Facultad de Ingeniería de la Universidad de San Carlos de Guatemala (FIUSAC)**.

- **Sin afiliación institucional:** PEMTREE **no** tiene afiliación formal, vinculación administrativa, patrocinio ni representación oficial de la Universidad de San Carlos de Guatemala (USAC) ni de las autoridades de la Facultad de Ingeniería (FIUSAC).
- **Carácter informativo:** La información de mallas curriculares (pensum CLAR 2022/2025), códigos de cursos, prerrequisitos y horarios de cátedra son datos de carácter público con fines estrictamente pedagógicos y de orientación académica.

---

## 2. Arquitectura de Privacidad y Modelo Híbrido

PEMTREE está construida bajo un principio fundamental de **privacidad por diseño y minimización de datos**:
- **Herramientas de uso anónimo y local:** El visualizador de malla curricular, el planificador semestral/vacacional y el constructor de horarios funcionan al 100% en el dispositivo del usuario sin requerir registro, cuentas ni envío de datos personales a servidores externos.
- **Herramientas comunitarias autenticadas:** El foro de discusión, la publicación de comentarios, la emisión de recomendaciones sobre docentes y auxiliares, el directorio de grupos de WhatsApp y las notificaciones push requieren autenticación voluntaria mediante Google OAuth para salvaguardar la integridad de la comunidad y prevenir abusos o spam.

---

## 3. Uso Anónimo y Almacenamiento Local (localStorage)

Cualquier usuario puede acceder y utilizar las herramientas académicas principales de PEMTREE de forma anónima sin proporcionar ningún dato personal:

1. **Visualizador de Malla Curricular (Grafo interactivo):** Marcado de cursos aprobados, cursos en curso, verificación de prerrequisitos desbloqueados y cálculo de ruta crítica.
2. **Planificador Semestral y de Vacaciones (Planner):** Distribución y proyección de cursos por semestre y escuelas de vacaciones.
3. **Constructor de Horarios (ScheduleBuilder):** Selección de secciones, consulta de catedráticos y detección inteligente de traslapes horarios.

### ¿Dónde y cómo se guardan estos datos?
Toda la información anterior se almacena **exclusiva y localmente en el almacenamiento del navegador web del usuario (`localStorage`)**. En ningún momento estos registros son transferidos, vendidos ni sincronizados con bases de datos externas.

**Claves técnicas empleadas en `localStorage`:**
- `pemtree_progreso_<pensumKey>`: Arreglo JSON con los códigos de cursos marcados como aprobados o cursando para el pensum seleccionado.
- `pemtree_plan`: Objeto JSON con la distribución personalizada de cursos planificados por bloque semestral o vacacional.
- `pemtree_pensum_actual`: Nombre e identificador del pensum activo (ej. `ciencias_y_sistemas_22.json`).
- `pemtree_theme`: Preferencia visual de interfaz del usuario (`"dark"` o `"light"`).
- `pemtree_guia_visto`: Bandera booleana para evitar mostrar repetidamente la guía de bienvenida inicial.
- `pemtree_last_post_timestamp` / `pemtree_last_comment_timestamp`: Marcas temporales locales para control anti-spam y cooldown.

> **Control y eliminación directa:** Puede borrar inmediatamente todos estos datos locales en cualquier instante limpiando la memoria caché y datos de sitio de su navegador web.

---

## 4. Uso Autenticado e Identidad Digital (OAuth 2.0)

Para participar activamente en las funciones comunitarias, publicar contenido o emitir recomendaciones, los usuarios pueden iniciar sesión de forma libre y voluntaria.

### Proveedor de Autenticación
- **Proveedor:** Google LLC mediante **Supabase Auth**.
- **Protocolo:** Flujo estándar OAuth 2.0 (Google Sign-In).

### Datos personales obtenidos de Google:
- **Identificador Único Universal (UUID):** Identificador interno generado por el servicio de autenticación (`auth.users.id`).
- **Nombre Completo / Nombre Público:** Proporcionado por su cuenta de Google (`name` / `full_name`).
- **Dirección de Correo Electrónico:** Correo verificado asociado a su cuenta de Google (`email`).
- **Fotografía de Perfil (Avatar):** URL pública del avatar provisto por Google (`avatar_url`).

### Finalidades del Tratamiento de Datos de Cuenta:
- Identificar y atribuir la autoría de publicaciones, comentarios y grupos registrados.
- Habilitar el panel de gestión personal ("Mis Publicaciones") para editar o eliminar aportes propios.
- Prevenir la creación masiva de cuentas falsas, ataques de denegación de servicio, suplantación de identidad y spam en el foro.
- Evitar la manipulación maliciosa de calificaciones y recomendaciones sobre docentes.
- Facilitar el envío de alertas y notificaciones sobre respuestas a sus consultas.

---

## 5. Contenido Generado por el Usuario (UGC)

Al interactuar en los módulos comunitarios, se procesan los siguientes datos:

### A. Foro Comunitario de Discusión
- **Publicaciones y Respuestas:** Títulos, descripciones, contenido markdown, categorías temáticas y carreras académicas vinculadas.
- **Archivos e Imágenes Adjuntas:** Las imágenes subidas por los usuarios son optimizadas y comprimidas en el cliente antes de ser transferidas al almacenamiento seguro en la nube (Supabase Storage).
- **Reacciones y Votos ("Likes"):** Vinculados de forma unívoca al ID del usuario autenticado para asegurar exactamente un voto por usuario y evitar votos duplicados.

### B. Reseñas y Recomendaciones de Docentes y Auxiliares
- **Mecanismo de Calificación:** Voto booleano estructurado (Recomienda: Sí / No). No se habilitan campos de texto libre para prevenir difamaciones personales, calumnias o ataques verbales.
- **Unicidad:** Cada recomendación está restringida a un único voto por docente y usuario autenticado mediante restricciones de integridad `(docente_id, user_id)`.
- **Privacidad y Agregación:** La vista pública (`docente_reputation`) expone únicamente métricas estadísticas consolidadas (número total de votos, cantidad de recomendaciones y porcentaje de aprobación). Los votos individuales no son expuestos públicamente con la identidad del votante a otros usuarios ordinarios.

### C. Directorio Colaborativo de Grupos de WhatsApp
- **Enlaces Públicos:** Hipervínculos a grupos de WhatsApp (`chat.whatsapp.com`) organizados por carrera, curso o semestre.
- **Metadatos:** Nombre del grupo, descripción, carrera/curso asociado y el identificador del usuario que compartió el enlace.
- **Votos y Reportes:** Contador comunitario de utilidad y reporte de enlaces caídos, obsoletos o con contenido inapropiado.
- **Privacidad Externa:** PEMTREE solo aloja el hipervínculo de enlace. No accede, procesa ni almacena números telefónicos, listas de miembros, mensajes privados ni archivos intercambiados dentro de WhatsApp.

### D. Sistema de Moderación y Reportes
- Los usuarios pueden reportar contenido o enlaces que infrinjan las normas de convivencia o la legislación aplicable.
- Datos registrados: Identificador del usuario reportante, referencia al contenido o cuenta reportada, motivo del reporte y fecha.

---

## 6. Notificaciones Web Push

PEMTREE ofrece un sistema opcional de notificaciones push en tiempo real para alertarle sobre respuestas a sus publicaciones o interacciones relevantes:

- **Tecnología:** Implementado con el estándar W3C Web Push API, Service Workers (`/sw.js`) y el protocolo de cifrado VAPID (RFC 8292).
- **Consentimiento Expreso:** Solo se activan tras la autorización explícita solicitada mediante el navegador web (`Notification.requestPermission()`).
- **Información Almacenada (`notification_subscriptions`):**
  - Identificador del usuario (`user_id`).
  - URL de extremo único (`endpoint`) provista por el servicio push del navegador (Google FCM, Mozilla Push Service, Apple Web Push).
  - Claves públicas de cifrado de extremo a extremo (`p256dh` y `auth`).
  - Cadena técnica identificadora del navegador y dispositivo (`user_agent`).
- **Revocación:** Puede desactivar las alertas push en cualquier momento desde el panel de Notificaciones de PEMTREE o cancelando los permisos directamente en la configuración de su navegador web.

---

## 7. Proveedores de Servicios y Terceros (Subprocesadores)

Para garantizar la disponibilidad, seguridad y rendimiento de la plataforma, PEMTREE se apoya en los siguientes proveedores de infraestructura:

| Proveedor | Función / Servicio | Tratamiento y Seguridad | Política de Privacidad |
|---|---|---|---|
| **Supabase Inc.** | Base de datos PostgreSQL, Supabase Auth (OAuth 2.0), Storage y Edge Functions. | Servidores seguros en la nube con cifrado en reposo y en tránsito (TLS/HTTPS). Políticas RLS activas. | [Supabase Privacy Policy](https://supabase.com/privacy) |
| **Netlify Inc.** | Hosting estático, distribución global CDN y certificados SSL. | Red global de distribución de contenido y registros de acceso estándar para seguridad operativa. | [Netlify Privacy Policy](https://www.netlify.com/privacy/) |
| **Google LLC** | Autenticación federada (Google Sign-In) y Google AdSense (`ca-pub-8195828335046911`). | Gestión de identidad segura y despliegue de publicidad digital para sostenibilidad del proyecto. | [Google Privacy & Terms](https://policies.google.com/privacy) |
| **Meta Platforms Inc. / WhatsApp** | Redirección externa a grupos de estudio estudiantiles. | Enlaces de hipervínculo externo. PEMTREE no procesa datos internos de WhatsApp. | [WhatsApp Privacy Policy](https://www.whatsapp.com/legal/privacy-policy) |

---

## 8. Cookies y Almacenamiento Web

- **Cookies Propias:** PEMTREE **no** utiliza cookies invasivas de seguimiento, rastreo entre sitios ni perfiles publicitarios propios. Utiliza exclusivamente `localStorage` para recordar su configuración de interfaz (tema visual) y su progreso académico local.
- **Cookies y Almacenamiento de Terceros:**
  - **Supabase Auth:** Almacena tokens de sesión JWT cifrados en el almacenamiento web del navegador para mantener su sesión activa de forma segura.
  - **Google AdSense:** Si la publicidad está activa, Google y sus socios pueden utilizar cookies para publicar anuncios relevantes basados en las visitas previas de los usuarios a este y otros sitios web.
  - **Control Publicitario:** Los usuarios pueden inhabilitar la publicidad personalizada accediendo a la [Configuración de anuncios de Google](https://adssettings.google.com/) o mediante [aboutads.info](https://www.aboutads.info/choices/).

---

## 9. Medidas de Seguridad y Protección de Datos

Implementamos medidas técnicas, arquitectónicas y criptográficas para proteger la información de los usuarios:

1. **Cifrado en Tránsito (HTTPS/TLS):** Todo el tráfico entre el navegador del usuario, Netlify y los servidores de Supabase se realiza bajo protocolo seguro cifrado HTTPS / TLS.
2. **Seguridad a Nivel de Filas (Row-Level Security - RLS):** Nuestra base de datos aplica políticas RLS estrictas:
   - Usuarios anónimos únicamente pueden consultar contenido público aprobado.
   - Los usuarios autenticados únicamente pueden modificar o eliminar sus propias publicaciones, comentarios y grupos.
   - Las funciones administrativas y de moderación se ejecutan bajo procedimientos protegidos (`SECURITY DEFINER` con verificación de roles).
3. **Filtros Automatizados de Moderación:**
   - Detección automática de lenguaje ofensivo, spam, flooding de caracteres y enlaces no autorizados.
   - Flujo estructurado de estados de revisión (`PENDING`, `APPROPRIATE`, `INAPPROPRIATE`, `ERROR`).
   - Límite de frecuencia de peticiones (cooldown anti-saturación) en cliente y servidor.

---

## 10. Derechos de los Usuarios (Acceso, Rectificación y Supresión)

Los usuarios de PEMTREE gozan de pleno control sobre su información:

- **Acceso y Gestión:** Puede consultar y administrar todas sus publicaciones, comentarios y grupos registrados desde la sección **"Mis Publicaciones"**.
- **Derecho de Supresión:** Puede eliminar sus posts y comentarios en cualquier momento. Al hacerlo, el contenido se retira inmediatamente del acceso público.
- **Derecho de Desconexión y Olvido Local:** Los usuarios no autenticados pueden borrar todo su avance académico, materias y planes con un solo clic eliminando los datos de sitio en su navegador.
- **Desuscripción de Notificaciones:** Puede revocar los permisos de notificaciones push de forma instantánea desde la interfaz o desde su navegador.
- **Solicitud de Eliminación de Cuenta:** Posibilidad de solicitar la eliminación total y definitiva de su registro y datos vinculados contactando al administrador del proyecto.

---

## 11. Privacidad de Menores de Edad

PEMTREE está orientada a la comunidad universitaria de educación superior (estudiantes mayores de 13 años). No recopilamos intencionalmente información personal de menores de 13 años. Si considera que se han recopilado datos de un menor de forma involuntaria, contáctenos de inmediato para proceder con su eliminación.

---

## 12. Cambios y Actualizaciones de la Política de Privacidad

Nos reservamos el derecho de actualizar esta Política de Privacidad para reflejar mejoras técnicas, nuevas funciones o exigencias normativas. Cualquier modificación sustancial se reflejará con la fecha de "Última actualización" en el encabezado de este documento.

---

## 13. Canales de Contacto

Para dudas, consultas sobre privacidad, ejercicio de derechos o reportes de seguridad, puede comunicarse a través de:

- **Correo Electrónico:** [trebol4devop@proton.me](mailto:trebol4devop@proton.me)
- **Repositorio Oficial en GitHub:** [https://github.com/Trebol4Devop/PEMTREE](https://github.com/Trebol4Devop/PEMTREE)
- **Sitio Web Oficial:** [https://pemtree.netlify.app/](https://pemtree.netlify.app/)
- **Centro de Privacidad:** [https://politicasdeprivacidad.netlify.app/](https://politicasdeprivacidad.netlify.app/)
