// src/routes/professors/[slug]/+page.server.ts
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;

    const profsRef = collection(db, 'professors');
    const profSnapshot = await getDocs(profsRef);

    const match = profSnapshot.docs.find((doc) => {
        const data = doc.data();
        const url = data.url;
        return typeof url === 'string' && url.toLowerCase().endsWith(slug.toLowerCase());
    });

    if (!match) {
        throw error(404, 'Professor not found');
    }

    const professor = match.data();

    const coursesRef = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesRef);
    const courses = coursesSnapshot.docs
        .map(doc => doc.data())
        .filter(course => typeof course.faculty === 'string' && course.faculty.includes(professor.name));


    return {
        professor,
        courses
    };
};