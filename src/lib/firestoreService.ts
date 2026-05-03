import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "./firebase";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ADS
export const createAd = async (adData: any) => {
  const path = "ads";
  try {
    const docRef = await addDoc(collection(db, path), {
      ...adData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getAds = async (filters: { category?: string; status?: string; limitCount?: number } = {}) => {
  const path = "ads";
  try {
    let q = query(collection(db, path), orderBy("createdAt", "desc"));
    
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const getAdById = async (id: string) => {
  const path = `ads/${id}`;
  try {
    const docRef = doc(db, "ads", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

// NEWS
export const getArticles = async () => {
  const path = "articles";
  try {
    const q = query(collection(db, path), where("status", "==", "published"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

// ADMIN
export const getPendingAds = async () => {
  const path = "ads";
  try {
    const q = query(collection(db, path), where("status", "==", "pending"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const approveAd = async (adId: string, adminId: string) => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await updateDoc(docRef, {
      status: 'approved',
      approvedBy: adminId,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const rejectAd = async (adId: string, reason: string) => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await updateDoc(docRef, {
      status: 'rejected',
      adminNotes: reason,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
