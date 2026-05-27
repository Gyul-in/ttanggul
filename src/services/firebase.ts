import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDG-UvuXWOLLtgPxVJF5gb_0qe5WjHeZPc",
  authDomain: "ttanggul-d8e19.firebaseapp.com",
  projectId: "ttanggul-d8e19",
  storageBucket: "ttanggul-d8e19.firebasestorage.app",
  messagingSenderId: "788744506991",
  appId: "1:788744506991:web:c45238597674dbb205479a",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
