import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "guest" | "user" | "verified_seller" | "admin" | "editor";
  profileImage?: string;
  phone?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Fetch or create profile
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data() as UserProfile;
            // Auto-upgrade this specific user to admin if they are not already
            if (firebaseUser.email === "samarsultan838@gmail.com" && profileData.role !== "admin") {
              const updatedProfile = { ...profileData, role: "admin" as const };
              await setDoc(doc(db, "users", firebaseUser.uid), updatedProfile);
              setProfile(updatedProfile);
            } else {
              setProfile(profileData);
            }
          } else {
            // Check if this should be an admin
            const isAdmin = firebaseUser.email === "samarsultan838@gmail.com";
            
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Unknown User",
              email: firebaseUser.email || "",
              role: isAdmin ? "admin" : "user",
              profileImage: firebaseUser.photoURL || "",
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Profile load error:", error);
          // If we fail to load the profile, we still have the user object
          // but some features might be hidden.
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(`Google Sign-In is currently disabled for project "${auth.app.options.projectId}". Please enable it in the Firebase Console under Authentication > Sign-in method for this specific project.`);
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error("Login popup was blocked by your browser. Please allow popups or try opening the app in a new tab.");
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await firebaseSignInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(`Email/Password login is currently disabled for project "${auth.app.options.projectId}". Please enable it in the Firebase Console under Authentication > Sign-in method for this specific project.`);
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(`Email/Password registration is currently disabled for project "${auth.app.options.projectId}". Please enable it in the Firebase Console under Authentication > Sign-in method for this specific project.`);
      }
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
