// firebase.js (Firebase 설정 파일)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 프로젝트 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyDeB32_Bqt93ZDiA8NAO5uV2fLz1uAopzo",
  authDomain: "task-manager-98629.firebaseapp.com",
  projectId: "task-manager-98629",
  storageBucket: "task-manager-98629.appspot.com",
  messagingSenderId: "891285756089",
  appId: "1:891285756089:web:16e76f045855d83c506368",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
