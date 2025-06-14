export const prerender = true;

import type { PageLoad } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

type Course = {
    id: string;
    code: string;
    title: string;
    instructor: string[];
    credits: number;
    is_req: boolean;
    years: string;
    subject?: string;
};

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
            instructor: d.instructor,
            credits: d.credits,
            is_req: d.is_req,
            years: d.years,
            subject: d.subject || ''
        });
    });

    // Group by minimum year
    const byYear: Record<string, Course[]> = {};
    allCourses.forEach((course) => {
        const years = course.years.split(',').map((y: string) => Number(y.trim()));
        const minYear = Math.min(...years).toString();
        if (!byYear[minYear]) byYear[minYear] = [];
        byYear[minYear].push(course);
    });
    // Sort by subject (and then by title) within each year
    for (const year in byYear) {
        byYear[year].sort((a, b) =>
            (a.subject || '').localeCompare(b.subject || '') ||
            a.title.localeCompare(b.title)
        );
    }

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
        byYear,
        bySubject
    };
};