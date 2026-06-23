import type { PageServerLoad } from './$types';
import type { ProgrammeData } from '$lib/types';
import { deslugify } from '$lib/utils';
import { error } from '@sveltejs/kit';
import programmeData from '$lib/programme.json';

export const load: PageServerLoad = ({ params }) => {
	const subject = deslugify(params.subject);
	if (!subject) throw error(404, 'Subject not found');

	const data = (programmeData as Record<string, ProgrammeData>)[subject];
	if (!data) throw error(404, 'No programme data for this subject');

	return { faq: data.faq, subjectName: subject };
};
