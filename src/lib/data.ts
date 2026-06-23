import type { Professor, Course } from './types';
import departmentData from './department.json';
import coursesData from './courses.json';

export const professors: Professor[] = Object.entries(
	departmentData as Record<string, Omit<Professor, 'subject'>[]>
).flatMap(([subject, profs]) =>
	profs.map((p) => ({ ...p, subject }) as Professor)
);

export const courses: Course[] = Object.entries(
	coursesData as Record<string, Omit<Course, 'subject'>[]>
).flatMap(([subject, items]) =>
	items.map((c) => ({ ...c, subject }) as Course)
);