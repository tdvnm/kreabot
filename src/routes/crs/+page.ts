import type { PageLoad } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

type Course = {
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    elig_years: string;
    faculty: string;
    is_req: string; // "Required" or "Elective"
    year_trim?: string;
    subject?: string;
};

function getSubjectFromCode(code: string): string {
    if (!code) return 'Other';
    code = code.toUpperCase();
    if (code.includes('PHYS')) return 'physics';
    if (code.includes('POLT')) return 'political Science';
    if (code.includes('BIOS')) return 'biological Sciences';
    if (code.includes('CHEM')) return 'chemistry';
    if (code.includes('ECON')) return 'economics';
    if (code.includes('HIST')) return 'history';
    if (code.includes('PSYC')) return 'psychology';
    if (code.includes('LITT')) return 'literature';
    if (code.includes('ARTS')) return 'art';
    if (code.includes('DATA')) return 'data Science';
    if (code.includes('MATH')) return 'mathematics';
    if (code.includes('COMP')) return 'computer Science';
    if (code.includes('PHIL')) return 'philosophy';
    if (code.includes('ENVS')) return 'environmental Science';
    return 'Other';
}

export const load: PageLoad = async () => {
    const collectionRef = collection(db, 'courses');
    const snapshot = await getDocs(collectionRef);

    const allCourses: Course[] = [];
    snapshot.docs.forEach((doc) => {
        const d = doc.data();
        allCourses.push({
            id: doc.id,
            code: d.code,
            title: d.title,
            description: d.description,
            credits: d.credits,
            elig_years: d.elig_years,
            faculty: d.faculty,
            is_req: d.is_req,
            year_trim: d.year_trim,
            subject: d.subject || getSubjectFromCode(d.code)
        });
    });

    // Group by subject
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
    };
};