import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function createFirebaseApp(): App {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  const localKeyPath = path.join(process.cwd(), "secrets", "firebase-service-account.json");
  if (existsSync(localKeyPath)) {
    return initializeApp({
      credential: cert(localKeyPath),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  throw new Error(
    "Thiếu cấu hình Firebase Admin. Hãy đặt file secrets/firebase-service-account.json hoặc cấu hình FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL và FIREBASE_PRIVATE_KEY.",
  );
}

let firestoreInstance: Firestore | undefined;
let storageInstance: Storage | undefined;

export function getAdminFirestore(): Firestore {
  firestoreInstance ??= getFirestore(createFirebaseApp());
  return firestoreInstance;
}

export function getFirebaseAdminApp(): App {
  return createFirebaseApp();
}

export function getAdminStorage(): Storage {
  storageInstance ??= getStorage(createFirebaseApp());
  return storageInstance;
}
