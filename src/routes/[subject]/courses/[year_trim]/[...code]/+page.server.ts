import type { PageServerLoad } from './$types';
import type { Course } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { allCourses } = await parent();
	const { code, year_trim } = params;

	const course = allCourses.find(
		(c: Course) => c.code.toUpperCase() === code.toUpperCase() && c.year_trim === year_trim
	);

	if (!course) throw error(404, 'Course not found');

	return { course };
};
