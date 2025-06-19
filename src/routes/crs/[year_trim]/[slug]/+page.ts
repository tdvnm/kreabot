import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const slug = params.slug;

    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('code', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw error(404, 'Course not found');
    }

    const course = snapshot.docs[0].data();

    return { course };
};