import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: 파이어베이스 프로젝트 생성 후 여기에 Config 키를 넣어야 합니다.
// 추후 환경변수(.env)로 관리하도록 수정될 예정입니다.
const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "AUTH_DOMAIN_HERE",
  projectId: "PROJECT_ID_HERE",
  storageBucket: "STORAGE_BUCKET_HERE",
  messagingSenderId: "MESSAGING_SENDER_ID_HERE",
  appId: "APP_ID_HERE"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
