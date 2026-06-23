import type { LayoutServerLoad } from './$types';
import type { Professor, Course } from '$lib/types';
import { deslugify } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const subject = deslugify(params.subject);
	if (!subject) throw error(404, 'Subject not found');

	const { allProfessors, allCourses } = await parent();

	const faculty = allProfessors.filter((p: Professor) => p.subject === subject);
	const subjectCourses = allCourses.filter((c: Course) => c.subject === subject);

	const coursesByTrim: Record<string, Course[]> = {};
	for (const c of subjectCourses) {
		const yt = c.year_trim || 'unknown';
		if (!coursesByTrim[yt]) coursesByTrim[yt] = [];
		coursesByTrim[yt].push(c);
	}
	for (const yt in coursesByTrim) {
		coursesByTrim[yt].sort((a, b) => a.code.localeCompare(b.code));
	}

	return { subjectName: subject, faculty, coursesByTrim };
};
