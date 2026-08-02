import { readFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { cert, deleteApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) throw new Error("Thiếu MONGODB_URI trong .env.local");

const keyPath = path.join(process.cwd(), "secrets", "firebase-service-account.json");
const serviceAccount = JSON.parse(await readFile(keyPath, "utf8"));
const firebaseApp = initializeApp({ credential: cert(serviceAccount) });
const firestore = getFirestore(firebaseApp);

const articleSchema = new mongoose.Schema({}, { strict: false, collection: "articles" });
const termSchema = new mongoose.Schema({}, { strict: false, collection: "terms" });
const adminSchema = new mongoose.Schema({}, { strict: false, collection: "admins" });
const Article = mongoose.models.MigrationArticle ?? mongoose.model("MigrationArticle", articleSchema);
const Term = mongoose.models.MigrationTerm ?? mongoose.model("MigrationTerm", termSchema);
const Admin = mongoose.models.MigrationAdmin ?? mongoose.model("MigrationAdmin", adminSchema);

function normalize(document) {
  const value = { ...document };
  delete value._id;
  delete value.__v;
  for (const [key, item] of Object.entries(value)) {
    if (item instanceof mongoose.Types.ObjectId) value[key] = item.toString();
  }
  return value;
}

async function migrateCollection(name, Model) {
  const documents = await Model.find().lean();
  let migrated = 0;
  for (let offset = 0; offset < documents.length; offset += 450) {
    const batch = firestore.batch();
    for (const document of documents.slice(offset, offset + 450)) {
      batch.set(firestore.collection(name).doc(String(document._id)), normalize(document), { merge: true });
      migrated++;
    }
    await batch.commit();
  }
  const target = await firestore.collection(name).count().get();
  return { source: documents.length, migrated, target: target.data().count };
}

try {
  await mongoose.connect(mongoUri, { dbName: "network_knowledge", serverSelectionTimeoutMS: 10000 });
  console.log(`Firebase project: ${serviceAccount.project_id}`);
  const results = {
    articles: await migrateCollection("articles", Article),
    terms: await migrateCollection("terms", Term),
    admins: await migrateCollection("admins", Admin),
  };
  console.log(JSON.stringify(results, null, 2));
  const valid = Object.values(results).every((item) => item.source === item.target);
  if (!valid) throw new Error("Số lượng Firestore không khớp MongoDB");
  console.log("Migration completed and verified.");
} finally {
  await mongoose.disconnect();
  await deleteApp(firebaseApp);
}
