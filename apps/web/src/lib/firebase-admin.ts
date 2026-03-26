import * as admin from "firebase-admin";

const initializeFirebase = () => {
  if (admin.apps.length > 0) return admin.app();

  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
    
    // Normalize private key: 
    // 1. Remove surrounding quotes if present
    privateKey = privateKey.replace(/^['"]|['"]$/g, '');
    
    // 2. Replace escaped \n with literal newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // 3. Ensure it starts and ends correctly (trim whitespace)
    privateKey = privateKey.trim();

    if (!privateKey || !process.env.FIREBASE_PROJECT_ID) {
      console.warn("Firebase credentials missing. Skipping initialization.");
      return null;
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error: any) {
    console.error("Firebase admin initialization error:", error.message);
    return null;
  }
};

// Initialize once
initializeFirebase();

export const messaging = admin.apps.length > 0 ? admin.messaging() : null;
