import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBGc1w6Hd79Wg0g1vSGuS5KUUaVCSdTDQc",
  authDomain: "ttanggul-d8e19.firebaseapp.com",
  projectId: "ttanggul-d8e19",
  storageBucket: "ttanggul-d8e19.firebasestorage.app",
  messagingSenderId: "788744506991",
  appId: "1:788744506991:web:c45238597674dbb205479a",
};

const isFirstInit = getApps().length === 0;
export const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();
export const auth = isFirstInit
  ? initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) })
  : getAuth(app);
export const db = getFirestore(app);
