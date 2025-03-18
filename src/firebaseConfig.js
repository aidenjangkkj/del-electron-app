// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 기타 설정 값...
};

const app = initializeApp(firebaseConfig);

// Firestore 인스턴스 생성
const db = getFirestore(app);

export { db };
