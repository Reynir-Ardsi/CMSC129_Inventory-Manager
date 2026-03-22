import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBhrMSEnNrQVF6AoLjIwuZ6Rx5XGNT6j5g",
    authDomain: "inventory-manager-2a0b4.firebaseapp.com",
    projectId: "inventory-manager-2a0b4",
    storageBucket: "inventory-manager-2a0b4.firebasestorage.app",
    messagingSenderId: "362445290446",
    appId: "1:362445290446:web:577873fa0176714519099f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);