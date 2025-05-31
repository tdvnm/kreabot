// src/routes/professors/[slug]/+page.server.ts
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;

    const collectionRef = collection(db, 'professors');
    const snapshot = await getDocs(collectionRef);

   const match = snapshot.docs.find((doc) => {
        const data = doc.data();
        const url = data.url;
        return typeof url === 'string' && url.toLowerCase().endsWith(slug.toLowerCase());
    });

    if (!match) {
        throw error(404, 'Professor not found');
    }

    const professor = match.data();
    console.log(professor);

    return {
        professor,
    };
};