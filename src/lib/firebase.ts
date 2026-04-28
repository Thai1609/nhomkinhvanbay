import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const config: any = firebaseConfig;
const app = initializeApp(config);

// Sử dụng long polling để tránh lỗi kết nối trong môi trường proxy/iframe
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, config.firestoreDatabaseId || '(default)');

export const auth = getAuth(app);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Đang kết nối Firestore... (Nếu quá lâu, vui lòng tắt Ad-blocker hoặc Brave Shields)");
    } else if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
      // Permission denied means it successfully connected to the backend. Ignore this.
    } else {
      console.error("Error connecting to Firebase:", error);
    }
  }
}
testConnection();
