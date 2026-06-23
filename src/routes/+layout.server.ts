import type { LayoutServerLoad } from './$types';
import { SUBJECTS } from '$lib/utils';
import { professors, courses } from '$lib/data';

export const prerender = true;

export const load: LayoutServerLoad = () => {
	return {
		subjects: SUBJECTS,
		allProfessors: professors,
		allCourses: courses
	};
};
