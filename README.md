# Portafolio de Educación Continuada — Ingeniería de Sistemas y Computación Ubaté

Landing estática (HTML, CSS y JavaScript) para el portafolio de cursos de educación continuada del programa de **Ingeniería de Sistemas y Computación**, Universidad de Cundinamarca, Seccional Ubaté.

## Estructura

```
├── index.html
├── css/styles.css
├── js/main.js
├── data/
│   ├── instructors.json
│   └── courses.json
├── assets/
│   ├── escudo-color.png     ← escudo oficial de la Universidad
│   └── instructors/         ← fotos opcionales (referenciadas en JSON)
└── README.md
```

## Cómo ver el sitio en local

Los datos se cargan con `fetch()`. Abrir `index.html` directamente desde el disco (`file://`) suele fallar por políticas del navegador. Use un servidor HTTP local, por ejemplo:

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
