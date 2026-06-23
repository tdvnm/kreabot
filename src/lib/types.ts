export type ProfessorRole = 'faculty' | 'visiting-faculty' | 'lecturer' | 'post-doctoral-fellow';

export type Professor = {
	id: string;
	name: string;
	subject: string;
	email: string;
	location: string;
	office_hours: string;
	image_url: string;
	position: string;
	url: string;
	role: ProfessorRole;
	education: string[];
	date_of_joining: string;
};

export type Course = {
	code: string;
	title: string;
	year_trim: string;
	elig_years: string;
	type: 'required' | 'elective';
	faculty: string;
	required_for: string;
	description: string;
	prereqs: string;
	subject: string;
};

export type GridRow = {
	year: number;
	t1: string[];
	t2: string[];
	t3: string[];
};

export type Pathway = {
	label: string;
	grid: GridRow[];
};

export type Programme = {
	name: string;
	total_credits?: number;
	required: string[];
	elective_pick?: number;
	elective_pool?: string[];
	additional?: string;
	notes?: string;
	pathways?: Pathway[];
};

export type ProgrammeFaq = {
	q: string;
	a: string;
};

export type ProgrammeData = {
	requirements: Programme[];
	faq: ProgrammeFaq[];
};