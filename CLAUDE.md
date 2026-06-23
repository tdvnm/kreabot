# Kreabot

Academic portal for Krea University — browse departments, faculty, and courses.

## Quick Start

```bash
npm install
npm run dev
```

## Architecture

```
src/
├── app.html              # HTML shell
├── app.scss              # Imports global styles (variables + reset)
├── lib/
│   ├── data.ts           # Hardcoded placeholder data (subjects, 1 prof, 5 courses)
│   ├── types.ts          # TypeScript interfaces (Professor, Course, Resource)
│   ├── utils.ts          # Helpers (slugify, formatYearTrim) + constants (ROLES)
│   └── styles/
│       ├── _variables.scss   # ALL design tokens (colors, shadows, gradients)
│       ├── _reset.scss       # Global reset + font import
│       └── _mixins.scss      # Reusable SCSS mixins for components
└── routes/
    ├── +layout.ts            # Root data: provides subjects + professors + courses
    ├── +layout.svelte        # App shell: top bar + subjects sidebar
    ├── +page.svelte          # Home: "select a subject" placeholder
    └── [subject]/
        ├── +layout.ts        # Filters data for this subject
        ├── +layout.svelte    # Subject sidebar: department roles + course tree
        ├── +page.svelte      # Subject home: "select a category" placeholder
        ├── department/
        │   └── [role]/
        │       ├── +page.ts      # Filters professors by role
        │       └── +page.svelte  # Professor cards (expandable, with courses taught)
        └── courses/
            └── [year_trim]/
                └── [code]/
                    ├── +page.ts      # Finds course by code + trimester
                    └── +page.svelte  # Course detail (info, syllabus, papers, rubric)
```

## Design System

All colors live in `src/lib/styles/_variables.scss`. To change the theme, edit ONLY that file.

Key variables:
- `--color-text` / `--color-text-muted` — primary & secondary text
- `--color-border` / `--color-border-light` — strong & subtle borders
- `--color-hover` / `--color-active` — interactive state backgrounds
- `--color-bg-*` — various background gradients

Reusable patterns (in `_mixins.scss`):
- `@include card` — standard card surface with border + shine
- `@include card-header` — warmer card variant for page headers
- `@include section-label` — uppercase muted headings
- `@include info-row(width)` — label/value grid rows
- `@include nav-link` — sidebar navigation item with hover/active
- `@include empty-text` — italic placeholder text

## Data Flow

```
+layout.ts (root) → provides { subjects, allProfessors, allCourses }
    └─ [subject]/+layout.ts → filters by subject → { faculty, coursesByTrim }
        ├─ department/[role]/+page.ts → filters by role → { professors, profCourses }
        └─ courses/[year_trim]/[code]/+page.ts → finds course → { course }
```

Currently uses hardcoded data in `src/lib/data.ts`. To swap in real data,
replace the arrays in that file (or import from a JSON/API).

## Conventions

- CSS: use `var(--color-*)` variables, never hardcode hex in components
- Spacing: rem units (1rem = 10px due to 62.5% base)
- Naming: kebab-case for CSS classes, camelCase for TS
- Trimester format: `"2526-1"` = year 2025–26, trimester 1
