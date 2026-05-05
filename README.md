# Portafolio de Educación Continuada — Ingeniería de Sistemas y Computación Ubaté

Sitio estático multipágina (HTML, CSS y JavaScript modular) con enfoque de **plataforma**: inicio con banner informativo y accesos a apartados dedicados del portafolio del programa de **Ingeniería de Sistemas y Computación**, Universidad de Cundinamarca, Seccional Ubaté.

## Mapa del sitio

| Archivo | Contenido |
|---------|-----------|
| [index.html](index.html) | Inicio: banner informativo y tarjetas de acceso a cada sección |
| [programa.html](programa.html) | Programa académico e institucional (misión, objetivos, perfiles, historia, investigación) |
| [cursos.html](cursos.html) | Catálogo, asistente (Gemini vía servidor), filtros y modal de tarifas |
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
├── package.json              ← `npm start` (Express) y pruebas (Vitest)
├── vitest.config.js
├── api/
│   └── chat.js               ← Vercel: POST /api/chat (Serverless)
├── server/
│   ├── index.mjs             ← local: estáticos + POST /api/chat (Express)
│   └── chatCore.mjs          ← lógica compartida con Vercel
├── vercel.json               ← opciones de la función (p. ej. maxDuration)
├── data/
│   ├── instructors.json
│   ├── courses.json
│   └── chatbot/
│       └── knowledge-base.json  ← contexto institucional del asistente
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
│   └── features/             ← catálogo, chat, modal precios, navegación, activeNav, formulario, etc.
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

Vitest ejecuta los archivos `*.spec.js` en `js/` y `server/` (p. ej. `sanitize`, relaciones instructor–curso, respuestas del asistente, `normalizeMessages` del chat y resolución del ítem activo del menú).

El catálogo en `data/courses.json` se elabora a partir de las fichas técnicas radicadas (carpeta **Cursos**). Esa carpeta está en `.gitignore` para no versionar documentos internos; conserve una copia local al clonar el repositorio.

## Asistente en cursos (Gemini)

El chatbot de [cursos.html](cursos.html) llama a `POST /api/chat` en el **mismo origen**. La clave de Google Gemini **no** va en el navegador: créela en [Google AI Studio](https://aistudio.google.com/apikey), cópiela en un archivo `.env` (vea [.env.example](.env.example)) y **no** la suba a git.

```bash
npm install
cp .env.example .env
# Edite .env y asigne GEMINI_API_KEY=...

npm start
```

Abra `http://localhost:3000/cursos.html` (puerto configurable con `PORT` en `.env`).

- Contexto institucional versionado: [data/chatbot/knowledge-base.json](data/chatbot/knowledge-base.json). Si actualiza textos en [programa.html](programa.html), revise o actualice la KB para evitar respuestas desalineadas.

### Despliegue en Vercel

El repositorio incluye [api/chat.js](api/chat.js) (Serverless Function) y la lógica compartida en [server/chatCore.mjs](server/chatCore.mjs), de modo que `POST /api/chat` deja de responder 404 en `*.vercel.app`.

1. Conecte el proyecto en [Vercel](https://vercel.com) (import desde Git).
2. En **Configuración del proyecto → Variables de entorno**, añada `GEMINI_API_KEY` para **Producción** (y **Preview** si lo desea).
3. Vuelva a **desplegar** el último commit.

[vercel.json](vercel.json) define `maxDuration` de 60 s para esa función (en planes gratuitos el máximo efectivo puede ser menor; si hay timeouts, revise el plan o acorte el contexto enviado a Gemini).

**GitHub Pages** (solo estático) no ejecuta `api/chat.js`; use Vercel u otro host con funciones serverless o un backend Node.

Si una clave se expuso en un chat o captura, **rótela** en la consola de Google.

## Cómo ver el sitio en local

Los datos se cargan con `fetch()` y el código usa **módulos ES** (`import`/`export`). Abrir `index.html` con `file://` suele fallar. Para **probar el sitio completo con el asistente**, use `npm start` (sección anterior).

Sin el asistente, puede usar un servidor HTTP simple, por ejemplo:

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
