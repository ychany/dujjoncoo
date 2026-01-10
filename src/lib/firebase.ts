import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, increment, onDisconnect } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCQcxd7ssTi2Q8Dw7Qrpd0ttbeOmX7mCsc",
  authDomain: "dujjoncoo.firebaseapp.com",
  databaseURL: "https://dujjoncoo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dujjoncoo",
  storageBucket: "dujjoncoo.firebasestorage.app",
  messagingSenderId: "821099930384",
  appId: "1:821099930384:web:0c143eff0671cf18bdfb95",
  measurementId: "G-BXMJVDRM2P"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

// 참조 경로
export const statsRef = ref(db, 'stats')
export const presenceRef = ref(db, 'presence')

export { ref, onValue, increment, onDisconnect }
