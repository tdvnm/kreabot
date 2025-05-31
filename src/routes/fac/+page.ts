export const prerender = true;  

import type { PageLoad } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

type Professor = {
    id: string;
    name: string;
    subject: string;
    email: string;
    location: string;
    office_hours: string;
    image_url: string;
    position: string;
};

export const load: PageLoad = async () => {
    const collectionRef = collection(db, 'professors');
    const snapshot = await getDocs(collectionRef);

    const subject: Record<string, Professor[]> = {};
    const allProfessors: Professor[] = [];

    snapshot.docs.forEach((doc) => {
        const d = doc.data();
        const professor: Professor = {
            id: doc.id,
            name: d.name,
            subject: d.subject,
            email: d.email,
            location: d.location,
            office_hours: d.office_hours,
            image_url: d.image_url,
            position: d.position
        };
        allProfessors.push(professor);
        if (!subject[professor.subject]) subject[professor.subject] = [];
        subject[professor.subject].push(professor);
    });

    const alphabetical = [...allProfessors].sort((a, b) => a.name.localeCompare(b.name));
    const sortedSubject = Object.keys(subject)
        .sort((a, b) => a.localeCompare(b))
        .reduce(
            (acc, key) => {
                acc[key] = subject[key];
                return acc;
            },
            {} as Record<string, Professor[]>
        );

    return {
        subject: sortedSubject,
        alphabetical
    };
};