import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { onAuthStateChanged  } from "firebase/auth";
import type { User } from "firebase/auth";
import { writable } from "svelte/store";



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCWscd9aIIAl6qBZkcxrARQbrDrWPg8XeM",
    authDomain: "kreabot-eee07.firebaseapp.com",
    projectId: "kreabot-eee07",
    storageBucket: "kreabot-eee07.firebasestorage.app",
    messagingSenderId: "887264935678",
    appId: "1:887264935678:web:7b4843c1bc50be10c46faf",
    measurementId: "G-Q98FW6YXEC"
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();


/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();