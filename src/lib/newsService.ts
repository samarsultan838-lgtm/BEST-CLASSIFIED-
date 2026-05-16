import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  getDoc,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface Article {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image?: string;
  videoUrl?: string; // Support for video links (YouTube/Vimeo)
  authorId: string;
  authorName: string;
  published: boolean;
  featured: boolean;
  publishedAt: any;
  updatedAt: any;
  scheduledAt?: any;
  tags: string[];
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

const NEWS_COLLECTION = "news";

export async function createArticle(articleData: Omit<Article, 'id' | 'publishedAt' | 'updatedAt'>) {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
    ...articleData,
    publishedAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getArticles(onlyPublished = true, limitCount = 10) {
  const q = query(
    collection(db, NEWS_COLLECTION),
    orderBy("publishedAt", "desc"),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Article[];
}

export async function getArticleBySlug(slug: string) {
  const q = query(collection(db, NEWS_COLLECTION));
  const snapshot = await getDocs(q); // In production, use a more efficient index
  const article = snapshot.docs.find(d => d.data().slug === slug);
  if (article) {
    return { id: article.id, ...article.data() } as Article;
  }
  return null;
}

export async function deleteArticle(id: string) {
  await deleteDoc(doc(db, NEWS_COLLECTION, id));
}

export async function updateArticle(id: string, data: Partial<Article>) {
  const docRef = doc(db, NEWS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
}
