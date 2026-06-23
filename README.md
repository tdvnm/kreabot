# Kreabot

Academic portal for Krea University. Browse departments, faculty profiles, and courses by subject.

## Site Structure

```
Subject (e.g. Computer Science)
├── Department
│   ├── Faculty
│   ├── Visiting Faculty
│   ├── Lecturer
│   └── Post-Doctoral Fellow
│       └── [Professor card — education, office hours, email, courses taught]
└── Courses
    └── Trimester (e.g. 2025-26 T1)
        └── [Course detail — description, prereqs, eligibility, required/elective]
```

Subjects available: arts, biology, business studies, chemistry, computer science, data science, economics, environmental studies, history, literature, mathematics, philosophy, physics, political science, psychology, sociology.

## Stack

| Tool | Version |
|------|---------|
| SvelteKit | ^2.16 |
| Svelte | ^5.0 |
| TypeScript | ^5.0 |
| SCSS (via sass) | ^1.101 |
| Vite | ^6.2 |

No backend, no database — all data is loaded from JSON files via SvelteKit `load` functions.

## Data

- `src/lib/department.json` — professors keyed by subject (manually maintained)
- `src/lib/courses.json` — courses keyed by subject (generated from school's CSV via a parser)

To update content, edit those JSON files directly. Trimester format: `"2526-1"` = year 2025–26, trimester 1.

## Dev

```bash
npm install
npm run dev
```

## Styling

All design tokens (colors, shadows, gradients) are in `src/lib/styles/_variables.scss`. Edit only that file to retheme the app. Components use `var(--color-*)` CSS variables — no hardcoded hex anywhere.

Spacing: rem units, `1rem = 10px` (base font-size 62.5%).
