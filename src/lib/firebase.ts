import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

/** .env.local 이 없으면 false — 쿼리는 조용한 에러로 처리된다 (흰 화면 금지) */
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.storageBucket)

if (!isFirebaseConfigured) {
  console.warn('[firebase] VITE_FIREBASE_* 환경변수가 없습니다. .env.example 을 참고해 .env.local 을 만드세요.')
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const storageBucket: string = firebaseConfig.storageBucket ?? ''
