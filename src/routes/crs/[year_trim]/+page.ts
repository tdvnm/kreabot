import type { PageLoad } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase';

type Course = {
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    elig_years: string;
    faculty: string;
    is_req: string;
    year_trim?: string;
    subject?: string;
    crosslisted?: string[];
};

function getSubjectFromCode(code: string): string {
    if (!code) return 'Other';
    code = code.toUpperCase();
    const firstPart = code.split(/[|,&]/)[0].trim();

    if (firstPart.includes('COMP')) return 'computer science';
    if (firstPart.includes('MATH')) return 'mathematics';
    if (firstPart.includes('POLT')) return 'political science';
    if (firstPart.includes('SOCL')) return 'sociology';
    if (firstPart.includes('PHYS')) return 'physics';
    if (firstPart.includes('CHEM')) return 'chemistry';
    if (firstPart.includes('BIOS')) return 'biology';
    if (firstPart.includes('ECON')) return 'economics';
    if (firstPart.includes('HIST')) return 'history';
    if (firstPart.includes('PSYC')) return 'psychology';
    if (firstPart.includes('ARTS')) return 'global arts';
    if (firstPart.includes('PHIL')) return 'philosophy';
    if (firstPart.includes('BUSI')) return 'business';
    if (firstPart.includes('DATA')) return 'data science';
    if (firstPart.includes('LITT')) return 'literature';
    if (firstPart.includes('ENVS')) return 'environmental science';


    return 'Other';
}

export const load: PageLoad = async ({ params }: { params: { year_trim: string } }) => {
    const { year_trim } = params;
    const collectionRef = collection(db, 'courses');
    const q = query(collectionRef, where('year_trim', '==', year_trim));
    const snapshot = await getDocs(q);

    const allCourses: Course[] = [];
    snapshot.docs.forEach((doc) => {
        const d = doc.data();
        const codeParts = (d.code || '').split('|').map(s => s.trim()).filter(Boolean);
        const mainCode = codeParts[0]?.slice(0, 7) || '';
        const crosslisted = codeParts.slice(1).map(s => s.slice(0, 7));

        allCourses.push({
            id: doc.id,
            code: mainCode,
            title: d.title,
            description: d.description,
            credits: d.credits,
            elig_years: d.elig_years,
            faculty: d.faculty,
            is_req: d.is_req,
            year_trim: d.year_trim,
            crosslisted,
            subject: d.subject || getSubjectFromCode(mainCode)
        });
    });

    const bySubject: Record<string, Course[]> = {};
    allCourses.forEach((course) => {
        const subject = course.subject || 'Other';
        if (!bySubject[subject]) bySubject[subject] = [];
        bySubject[subject].push(course);
    });
    for (const subject in bySubject) {
        bySubject[subject].sort((a, b) => a.title.localeCompare(b.title));
    }

    return {
        bySubject,
        allCourses
    };
};