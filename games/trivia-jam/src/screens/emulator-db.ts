import { initializeApp } from '@firebase/app';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';

// TODO make this configurable in storybook ui
// also might not need all of it
const firebaseConfig = {
  apiKey: 'AIzaSyCb8N1Fi09VPX30u2X8JukJUX9apA8z7Zs',
  authDomain: 'explorers-club-staging.firebaseapp.com',
  projectId: 'explorers-club-staging',
  storageBucket: 'explorers-club-staging.appspot.com',
  messagingSenderId: '115019364533',
  appId: '1:115019364533:web:17432a5ea8b5c8c0c366fc',
  databaseURL: 'https://explorers-club-staging-default-rtdb.firebaseio.com',
};

initializeApp(firebaseConfig);
export const db = getDatabase();
// Point to the RTDB emulator running on localhost.
connectDatabaseEmulator(db, 'localhost', 9000);
