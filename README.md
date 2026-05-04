# Portafolio de Educación Continuada — Ingeniería de Sistemas y Computación Ubaté

Landing estática (HTML, CSS y JavaScript) para el portafolio de cursos de educación continuada del programa de **Ingeniería de Sistemas y Computación**, Universidad de Cundinamarca, Seccional Ubaté.

## Estructura del proyecto (modular)

```
├── index.html
├── css/
│   ├── main.css              ← entrada de estilos (@import de módulos)
│   ├── styles.css            ← reexporta main.css (compatibilidad)
│   ├── base/                 ← variables, tipografía, layout base
│   ├── components/           ← botones, navbar, cards, modal, back-top
│   ├── sections/             ← hero, bloques institucionales, instructores, cursos, contacto
│   ├── layout/               ← breadcrumbs, footer, responsive
│   └── utilities/            ← reveal on scroll
├── js/
│   ├── app.js                ← entrada (ES modules)
│   ├── config.js             ← rutas JSON y textos UI
│   ├── state.js              ← caché en memoria (instructores / cursos)
│   ├── services/api.js       ← fetch JSON (sustituible por API)
│   ├── domain/               ← reglas (p. ej. relación curso–gestor)
│   ├── utils/                ← sanitize, format
│   ├── components/           ← plantillas HTML de tarjetas
│   └── features/             ← catálogo, modal precios, navegación, formulario, etc.
├── data/
│   ├── instructors.json
│   └── courses.json
├── assets/
│   ├── escudo-color.png
│   └── instructors/
├── Cursos/                   ← fichas fuente; ignorada por git (ver .gitignore)
└── README.md
```

**JavaScript:** `app.js` orquesta la carga; cada módulo tiene una responsabilidad acotada para facilitar pruebas y nuevas pantallas sin un monolito.

**CSS:** nuevos bloques pueden añadirse como archivos bajo `css/sections/` o `css/components/` e importarse desde `css/main.css` en el orden deseado.

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

El escudo de la Universidad se carga desde [assets/escudo-color.png](assets/escudo-color.png). Para actualizarlo, reemplace ese archivo manteniendo el mismo nombre (o cambie la ruta en `index.html` en el encabezado y en el pie de página).

## Identidad visual

| Uso            | Color     |
|----------------|-----------|
| Verde oscuro   | `#1B5E20` |
| Verde medio    | `#2E7D32` |
| Verde claro    | `#4CAF50` |
| Fondo suave    | `#E8F5E9` |

**Tipografías:** Playfair Display (títulos), DM Sans (cuerpo), enlazadas desde Google Fonts en `index.html`.

## Licencia / uso

Contenido académico de referencia; ajuste textos y datos según lineamientos institucionales vigentes.
