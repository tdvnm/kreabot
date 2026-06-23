import type { PageServerLoad } from './$types';
import type { Programme } from '$lib/types';
import { deslugify } from '$lib/utils';
import { error } from '@sveltejs/kit';
import programmeData from '$lib/programme.json';

export const load: PageServerLoad = ({ params }) => {
	const subject = deslugify(params.subject);
	if (!subject) throw error(404, 'Subject not found');

	const requirements = (programmeData as Record<string, Programme[]>)[subject];
	if (!requirements) throw error(404, 'No programme data for this subject');

	return { requirements, subjectName: subject };
};
