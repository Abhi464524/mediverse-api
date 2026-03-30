import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Path to your service account key file
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let auth: admin.auth.Auth | null = null;

if (fs.existsSync(serviceAccountPath)) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
        });
        auth = admin.auth();
        console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin:', error);
    }
} else {
    console.warn('⚠️ Firebase serviceAccountKey.json not found in src/config/. Phone login will not work.');
}

export { auth };
