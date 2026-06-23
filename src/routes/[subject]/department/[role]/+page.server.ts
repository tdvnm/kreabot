import type { PageServerLoad } from './$types';
import type { Professor, Course } from '$lib/types';
import { ROLE_LABELS, deslugify } from '$lib/utils';
import { error } from '@sveltejs/kit';

function facultyMatches(courseFaculty: string, profName: string): boolean {
	return courseFaculty
		.split(/[,;&]|\band\b/i)
		.some((n) => n.trim() === profName);
}

export const load: PageServerLoad = async ({ params, parent }) => {
	const { allProfessors, allCourses } = await parent();
	const { role, subject } = params;

	if (!(role in ROLE_LABELS)) throw error(404, 'Invalid role');

	const subjectName = deslugify(subject);
	if (!subjectName) throw error(404, 'Subject not found');

	const professors = allProfessors.filter(
		(p: Professor) => p.subject === subjectName && p.role === role
	);

	const profCourses: Record<string, Course[]> = {};
	for (const prof of professors) {
		profCourses[prof.id] = allCourses.filter((c: Course) =>
			facultyMatches(c.faculty, prof.name)
		);
	}

	return {
		professors,
		profCourses,
		roleLabel: ROLE_LABELS[role]
	};
};
