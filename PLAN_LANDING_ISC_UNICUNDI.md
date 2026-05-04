# 🎓 Plan de Desarrollo: Landing Page – Portafolio de Cursos ISC Ubaté
> Universidad de Cundinamarca – Seccional Ubaté  
> Ingeniería de Sistemas y Computación – Educación Continuada

---

## 📌 Objetivo

Crear una **landing page moderna, responsiva y estática** que muestre el portafolio de cursos de educación continuada del programa de Ingeniería de Sistemas y Computación de la Universidad de Cundinamarca, Seccional Ubaté.  
Los datos serán gestionados mediante archivos JSON que simulan una base de datos relacional.

---

## 🗂️ Estructura de Archivos del Proyecto

```
landing-isc-unicundi/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── data/
│   ├── instructors.json       ← Gestores del conocimiento
│   └── courses.json           ← Cursos con módulos, precios y horas
├── assets/
│   └── logo-unicundi.png      ← Logo de la Universidad (agregar manualmente)
└── README.md
```

---

## 🎨 Paleta de Colores y Estilo

| Variable CSS         | Color           | Uso                         |
|----------------------|-----------------|-----------------------------|
| `--green-dark`       | `#1B5E20`       | Encabezados, botones CTA    |
| `--green-mid`        | `#2E7D32`       | Navbar, cards destacadas    |
| `--green-light`      | `#4CAF50`       | Íconos, badges, acentos     |
| `--green-pale`       | `#E8F5E9`       | Fondos de secciones alternas|
| `--white`            | `#FFFFFF`       | Fondo principal             |
| `--text-dark`        | `#1C1C1C`       | Texto principal             |
| `--text-muted`       | `#546E7A`       | Texto secundario            |

**Tipografía:**  
- Display: `Playfair Display` (títulos)  
- Body: `DM Sans` (texto general)  
- Mono (opcional): `JetBrains Mono` (códigos, badges técnicos)

---

## 📄 Secciones de la Landing Page

### 1. `<header>` — Barra de Navegación
- Logo Universidad de Cundinamarca + nombre del programa
- Links de anclaje a cada sección: Inicio, Cursos, Docentes, Precios, Contacto
- Sticky con fondo verde oscuro

---

### 2. `#hero` — Hero / Portada
- Título principal: *"Portafolio de Educación Continuada – ISC"*
- Subtítulo: Seccional Ubaté · Universidad de Cundinamarca
- Descripción breve del programa
- CTA: botón *"Ver Cursos"* → anclaje a sección cursos
- Fondo blanco con franja decorativa verde lateral o patrón geométrico suave

---

### 3. `#instructors` — Gestores del Conocimiento
- Renderizado dinámico desde `instructors.json`
- Cards con: nombre, foto placeholder, título académico, especialidad
- Grid responsivo 2 columnas (desktop) / 1 columna (móvil)

---

### 4. `#courses` — Catálogo de Cursos
- Renderizado dinámico desde `courses.json`
- Por cada curso mostrar:
  - Nombre del curso
  - Descripción
  - Total de horas (presenciales + autónomas) y modalidad
  - Lista de módulos (acordeón o sección expandible)
  - Botón *"Ver Precios"* que abre modal de tarifas
- Filtro por modalidad: Presencial / Virtual / Próximamente

---

### 5. `#pricing` — Tabla de Precios por Segmento
- Renderizado dinámico desde el objeto `prices` dentro de `courses.json`
- 4 columnas de precio por curso:
  - 🟢 Gestor del Conocimiento (docente)
  - 🎓 Graduado
  - 💼 Directivo
  - 🌐 Comunidad Externa
- Puede mostrarse como tabla comparativa o como cards de tarifa por curso

---

### 6. `#contact` — Contacto / Inscripción
- Formulario básico: Nombre, Correo, Teléfono, Curso de interés (select), Mensaje
- Texto con información de contacto institucional (placeholder)
- Botón de envío (puede ser mailto: o sin backend)

---

### 7. `<footer>` — Pie de Página
- Logo + nombre del programa
- Dirección: Seccional Ubaté, Universidad de Cundinamarca
- Redes sociales (íconos)
- Créditos: © 2025 ISC – Unicundi

---

## 🗃️ Estructura de los JSON (Base de Datos Relacional Simulada)

### `data/instructors.json`

```json
[
  {
    "id": "inst_001",
    "name": "Diego Fernando Pachón Maldonado",
    "title": "Ingeniero de Sistemas",
    "specialization": "Especialista en Gestión de Sistemas de Información Gerencial",
    "masters": "Maestrante en Ciberseguridad",
    "photo": "assets/instructors/diego-pachon.jpg",
    "courses": ["course_001"]
  },
  {
    "id": "inst_002",
    "name": "Fabio Alejandro Sastoque Rincón",
    "title": "Ingeniero de Sistemas",
    "specialization": "Especialista en Gestión de Sistemas de Información Gerencial",
    "masters": "Maestrante en Inteligencia Artificial y Ciencia de Datos",
    "photo": "assets/instructors/fabio-sastoque.jpg",
    "courses": ["course_002"]
  }
]
```

---

### `data/courses.json`

```json
[
  {
    "id": "course_001",
    "title": "Desarrollo Móvil con Flutter",
    "description": "Capacita en desarrollo de apps multiplataforma (iOS/Android) con Flutter, promoviendo una visión ética y sostenible de la tecnología.",
    "modality": "Presencial",
    "status": "active",
    "hours": {
      "total": 48,
      "in_person": 30,
      "autonomous": 18
    },
    "instructor_ids": ["inst_001"],
    "modules": [
      { "order": 1, "title": "Introducción a Flutter y Dart", "description": "Instalación, conceptos básicos de Dart y primeras apps de consola." },
      { "order": 2, "title": "Fundamentos y Widgets", "description": "Estructura de apps Flutter y construcción de interfaces simples." },
      { "order": 3, "title": "Diseño de Interfaces", "description": "Widgets avanzados, diseño responsivo y Material Design." },
      { "order": 4, "title": "Gestión del Estado", "description": "Stateful/Stateless Widgets, proveedores de estado y validación." },
      { "order": 5, "title": "Conexión a APIs", "description": "Consumo de APIs, parseo de JSON e integración de datos externos." },
      { "order": 6, "title": "Proyecto Final", "description": "Integración de conocimientos en un proyecto funcional." }
    ],
    "prices": {
      "instructor": 250000,
      "graduate": 350000,
      "executive": 450000,
      "community": 550000
    },
    "currency": "COP"
  },
  {
    "id": "course_002",
    "title": "Alfabetización Digital",
    "description": "Desarrolla competencias básicas en uso de dispositivos, navegación, comunicación y gestión de información digital.",
    "modality": "Virtual",
    "status": "active",
    "hours": {
      "total": 48,
      "in_person": 35,
      "autonomous": 13
    },
    "instructor_ids": ["inst_002"],
    "modules": [
      { "order": 1, "title": "Introducción", "description": "Conceptos básicos, dispositivos y uso del sistema operativo." },
      { "order": 2, "title": "Sistema Operativo y Archivos", "description": "Navegación, manejo y organización de archivos." },
      { "order": 3, "title": "Navegación Segura", "description": "Búsquedas efectivas y prácticas seguras de navegación." },
      { "order": 4, "title": "Correo y Comunicación", "description": "Gestión de cuentas de correo y plataformas de videollamadas." },
      { "order": 5, "title": "Productividad", "description": "Uso de Google Drive/OneDrive y creación de documentos." },
      { "order": 6, "title": "Ciudadanía Digital", "description": "Derechos, deberes, huella digital y prevención de ciberacoso." },
      { "order": 7, "title": "Aplicaciones Prácticas", "description": "Uso de apps para pagos, salud, transporte y servicios en línea." }
    ],
    "prices": {
      "instructor": 200000,
      "graduate": 280000,
      "executive": 380000,
      "community": 480000
    },
    "currency": "COP"
  },
  {
    "id": "course_003",
    "title": "Estadística y Análisis de Datos",
    "description": "Domina el mundo de los datos con fundamentos estadísticos y herramientas de análisis modernas.",
    "modality": "Virtual",
    "status": "coming_soon",
    "hours": {
      "total": null,
      "in_person": null,
      "autonomous": null
    },
    "instructor_ids": [],
    "modules": [],
    "prices": {
      "instructor": null,
      "graduate": null,
      "executive": null,
      "community": null
    },
    "currency": "COP"
  }
]
```

---

## ⚙️ Lógica JavaScript (`js/main.js`)

### Funciones principales a implementar:

```js
// 1. Cargar instructors.json y renderizar sección #instructors
async function loadInstructors() { ... }

// 2. Cargar courses.json y renderizar sección #courses
async function loadCourses() { ... }

// 3. Filtrar cursos por modalidad (Presencial / Virtual / Próximamente)
function filterCourses(modality) { ... }

// 4. Abrir modal con tabla de precios de un curso específico
function openPricingModal(courseId) { ... }

// 5. Formatear precio en pesos colombianos
function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
}

// 6. Relacionar instructor con curso (join simulado desde JSON)
function getInstructorsByCourse(courseId, instructors) { ... }

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadInstructors();
  loadCourses();
});
```

---

## ✅ Checklist de Desarrollo en Cursor

### Fase 1 – Estructura base
- [ ] Crear carpetas del proyecto
- [ ] Crear `index.html` con estructura semántica HTML5
- [ ] Crear `css/styles.css` con variables de color y tipografía
- [ ] Vincular Google Fonts: Playfair Display + DM Sans

### Fase 2 – Datos
- [ ] Crear `data/instructors.json` con al menos 2 instructores
- [ ] Crear `data/courses.json` con al menos 3 cursos (2 activos + 1 próximamente)
- [ ] Validar JSON en https://jsonlint.com

### Fase 3 – Renderizado dinámico
- [ ] Implementar `loadInstructors()` con fetch + template literals
- [ ] Implementar `loadCourses()` con fetch + template literals
- [ ] Implementar filtro de cursos por modalidad
- [ ] Implementar modal de precios con los 4 segmentos

### Fase 4 – Estilos y responsividad
- [ ] Navbar sticky verde oscuro
- [ ] Hero con degradado verde/blanco
- [ ] Cards de cursos y docentes con hover effect
- [ ] Tabla de precios responsiva
- [ ] Media queries para móvil (< 768px)

### Fase 5 – Pulido final
- [ ] Agregar logo de la Universidad
- [ ] Probar en Chrome, Firefox y móvil
- [ ] Verificar accesibilidad (alt en imágenes, contraste de color)
- [ ] Animaciones suaves de entrada (fade-in en scroll)

---

## 🧪 Prompt sugerido para Cursor AI

Puedes usar este prompt dentro de Cursor para arrancar rápido:

```
Crea una landing page estática en HTML/CSS/JS para mostrar el portafolio de 
educación continuada de la carrera de Ingeniería de Sistemas de la Universidad 
de Cundinamarca, Seccional Ubaté. 

Los datos deben cargarse dinámicamente desde dos archivos JSON ubicados en /data/:
- instructors.json: gestores del conocimiento con id, nombre, título, especialización, maestría
- courses.json: cursos con id, título, descripción, modalidad, estado (active/coming_soon), 
  horas (total/presenciales/autónomas), lista de módulos y precios para 4 segmentos: 
  instructor, graduado, directivo y comunidad externa (en COP)

Colores institucionales: verde oscuro (#1B5E20), verde medio (#2E7D32), 
verde claro (#4CAF50), fondo blanco. Tipografía: Playfair Display para títulos, 
DM Sans para texto. Diseño responsivo. Incluir navbar sticky, hero, sección de 
docentes, catálogo de cursos con filtros, tabla de precios en modal, y footer.
```

---

## 📝 Notas Adicionales

- Los precios mostrados son **valores de referencia**; actualiza los montos en `courses.json` según defina el programa.
- Para el curso *Estadística y Análisis de Datos*, el estado `"coming_soon"` hará que aparezca con badge **"Próximamente"** y sin mostrar precios ni módulos.
- Si en el futuro se conecta un backend, los archivos JSON se reemplazan por endpoints REST sin cambiar el HTML ni el CSS.
- Se recomienda alojar el sitio en **GitHub Pages** para publicación gratuita y rápida.
