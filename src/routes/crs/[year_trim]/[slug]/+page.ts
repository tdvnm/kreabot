import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const slug = params.slug;

    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);

    const courseDoc = snapshot.docs.find(doc => {
        const code = (doc.data().code ?? '').toUpperCase();
        return code.substring(0, 7) === slug.toUpperCase();
    });

    if (!courseDoc) {
        throw error(404, 'Course not found');
    }

    const course = courseDoc.data();

    return { course };
};