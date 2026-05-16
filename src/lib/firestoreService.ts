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
      priority: 'normal', // default priority
      featured: false,    // default featured status
      rankingWeight: 0,   // default ranking weight
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getAds = async (filters: { category?: string; status?: string; limitCount?: number; prioritized?: boolean; featured?: boolean; minPrice?: number; maxPrice?: number } = {}) => {
  const path = "ads";
  try {
    let q;
    
    if (filters.prioritized) {
      // Prioritize rankingWeight, then priority, then by date
      q = query(collection(db, path), orderBy("rankingWeight", "desc"), orderBy("priority", "desc"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, path), orderBy("createdAt", "desc"));
    }
    
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters.featured !== undefined) {
      q = query(q, where("featured", "==", filters.featured));
    }
    if (filters.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    
    if (filters.minPrice !== undefined) {
      results = results.filter(ad => Number(ad.price) >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(ad => Number(ad.price) <= filters.maxPrice!);
    }
    
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const updateAdPriority = async (adId: string, priority: 'normal' | 'premium' | 'high') => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await updateDoc(docRef, {
      priority,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const toggleFeaturedAd = async (adId: string, featured: boolean) => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await updateDoc(docRef, {
      featured,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const getAdById = async (id: string) => {
  const path = `ads/${id}`;
  try {
    const docRef = doc(db, "ads", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as any) };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

// NEWS
export const getArticles = async (limitCount?: number) => {
  const path = "articles";
  try {
    let q = query(collection(db, path), where("status", "==", "published"), orderBy("createdAt", "desc"));
    if (limitCount) q = query(q, limit(limitCount));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (error) {
    // For public news, we don't necessarily want to throw the hard JSON error that triggers the AI debugger 
    // unless it's a real failure. But we'll keep the handler for consistency.
    console.error("Public news fetch error:", error);
    return [];
  }
};

export const getArticleBySlug = async (slug: string) => {
  const path = "articles";
  try {
    const q = query(collection(db, path), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...(doc.data() as any) };
    }
    return null;
  } catch (error) {
    console.error("Public article fetch error:", error);
    return null;
  }
};

export const getUsers = async () => {
  const path = "users";
  try {
    const q = query(collection(db, path), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const setAdRanking = async (adId: string, rankingWeight: number) => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await updateDoc(docRef, {
      rankingWeight,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const updateAdStatus = async (adId: string, status: string, notes?: string) => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await updateDoc(docRef, {
      status,
      adminNotes: notes || "",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
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

export const deleteAd = async (adId: string) => {
  const path = `ads/${adId}`;
  try {
    const docRef = doc(db, "ads", adId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
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
