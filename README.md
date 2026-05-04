# Portafolio de Educación Continuada — Ingeniería de Sistemas y Computación Ubaté

Sitio estático multipágina (HTML, CSS y JavaScript modular) con enfoque de **plataforma**: inicio con banner informativo y accesos a apartados dedicados del portafolio del programa de **Ingeniería de Sistemas y Computación**, Universidad de Cundinamarca, Seccional Ubaté.

## Mapa del sitio

| Archivo | Contenido |
|---------|-----------|
| [index.html](index.html) | Inicio: banner informativo y tarjetas de acceso a cada sección |
| [programa.html](programa.html) | Programa académico e institucional (misión, objetivos, perfiles, historia, investigación) |
| [cursos.html](cursos.html) | Catálogo de educación continuada, filtros y modal de tarifas |
| [gestores.html](gestores.html) | Gestores del conocimiento |
| [contacto.html](contacto.html) | Formulario de contacto e inscripción (Formspree) |

El menú superior y el pie de página se repiten en cada HTML; si cambia la navegación o el footer, actualícelos en **todas** las vistas para mantener el shell alineado.

Las rutas de archivo también están centralizadas en `CONFIG.routes` dentro de [js/config.js](js/config.js) para enlaces desde JavaScript (por ejemplo, el botón de búsqueda del navbar).

## Estructura del proyecto (modular)

```
├── index.html
├── programa.html
├── cursos.html
├── gestores.html
├── contacto.html
├── package.json              ← scripts de prueba (Vitest)
├── vitest.config.js
├── css/
│   ├── main.css              ← entrada de estilos (@import de módulos)
│   ├── styles.css            ← reexporta main.css (compatibilidad)
│   ├── base/                 ← variables, tipografía, layout base
│   ├── components/           ← botones, navbar, cards, modal, back-top
│   ├── sections/             ← hero, bloques institucionales, instructores, cursos, contacto
│   ├── layout/               ← breadcrumbs, footer, home-hub, responsive
│   └── utilities/            ← reveal on scroll
├── js/
│   ├── app.js                ← entrada (ES modules); ramifica por data-page en body
│   ├── config.js             ← rutas JSON, rutas de vistas y textos UI
│   ├── state.js              ← caché en memoria (instructores / cursos)
│   ├── services/api.js       ← fetch JSON (sustituible por API)
│   ├── domain/               ← reglas (p. ej. relación curso–gestor)
│   ├── utils/                ← sanitize, format
│   ├── components/           ← plantillas HTML de tarjetas
│   └── features/             ← catálogo, modal precios, navegación, activeNav, formulario, etc.
├── data/
│   ├── instructors.json
│   └── courses.json
├── assets/
│   ├── escudo-color.png
│   └── instructors/
├── Cursos/                   ← fichas fuente; ignorada por git (ver .gitignore)
└── README.md
```

**JavaScript:** `app.js` ejecuta solo los módulos necesarios según `document.body.dataset.page` (`home`, `programa`, `cursos`, `gestores`, `contacto`). Los cursos se cargan con `ensureCoursesLoaded()` para poder llenar el formulario de contacto sin renderizar la rejilla del catálogo.

**CSS:** nuevos bloques pueden añadirse como archivos bajo `css/sections/`, `css/components/` o `css/layout/` e importarse desde `css/main.css` en el orden deseado.

## Pruebas unitarias

Después de `npm install`:

```bash
npm test
```

Vitest ejecuta los archivos `*.spec.js` junto a los módulos en `js/` (p. ej. `sanitize`, relaciones instructor–curso y resolución del ítem activo del menú).

El catálogo en `data/courses.json` se elabora a partir de las fichas técnicas radicadas (carpeta **Cursos**). Esa carpeta está en `.gitignore` para no versionar documentos internos; conserve una copia local al clonar el repositorio.

## Cómo ver el sitio en local

Los datos se cargan con `fetch()` y el código usa **módulos ES** (`import`/`export`). Abrir `index.html` con `file://` suele fallar. Use un servidor HTTP local, por ejemplo:

```bash
# Python 3
cd portafolio_isu
python -m http.server 8000
```

Luego abra `http://localhost:8000`.

Alternativa con Node:

```bash
npx --yes serve .
```

## Editar cursos y gestores del conocimiento

- **[data/instructors.json](data/instructors.json)** — Gestores: `id`, `name`, `title`, `specialization`, `masters`, `photo`, `courses` (ids de cursos).
- **[data/courses.json](data/courses.json)** — Cursos: `id`, `title`, `description`, `modality`, `status` (`active` | `coming_soon`), `hours` (`total`, `in_person`, `autonomous`), `instructor_ids`, `modules`, `prices` (`instructor`, `graduate`, `executive`, `community`), `currency`.

Los precios están en **COP**. Un curso con `coming_soon` puede tener `hours` y `prices` en `null`; el sitio muestra “Próximamente” y oculta tarifas hasta definirlas.

## Marca e imagen institucional

El escudo de la Universidad se carga desde [assets/escudo-color.png](assets/escudo-color.png). Para actualizarlo, reemplace ese archivo manteniendo el mismo nombre (o cambie la ruta en el encabezado y pie de cada página HTML).

## Identidad visual

| Uso            | Color     |
|----------------|-----------|
| Verde oscuro   | `#1B5E20` |
| Verde medio    | `#2E7D32` |
| Verde claro    | `#4CAF50` |
| Fondo suave    | `#E8F5E9` |

**Tipografías:** Playfair Display (títulos), DM Sans (cuerpo), enlazadas desde Google Fonts en cada página HTML.

## Licencia / uso

Contenido académico de referencia; ajuste textos y datos según lineamientos institucionales vigentes.
