export const SUBJECTS = [
	'arts', 'biology', 'business studies', 'chemistry', 'computer science',
	'data science', 'economics', 'environmental studies', 'history', 'literature',
	'mathematics', 'philosophy', 'physics', 'political science', 'psychology', 'sociology'
];

export function slugify(str: string): string {
	return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const SLUG_TO_SUBJECT = new Map(SUBJECTS.map((s) => [slugify(s), s]));

export function deslugify(slug: string): string | undefined {
	return SLUG_TO_SUBJECT.get(slug);
}

export function formatYearTrim(yt: string): string {
	const [yearCode, trim] = yt.split('-');
	if (!yearCode || !trim) return yt;
	return `${yearCode.slice(2, 4)} T${trim}`;
}

export const ROLE_LABELS: Record<string, string> = {
	faculty: 'faculty',
	'visiting-faculty': 'visiting faculty',
	lecturer: 'lecturers',
	'post-doctoral-fellow': 'post-doctoral fellows'
};

export const ROLES = Object.keys(ROLE_LABELS);

export const LAB_SUBJECTS = ['biology', 'chemistry', 'computer science', 'data science', 'physics'];
