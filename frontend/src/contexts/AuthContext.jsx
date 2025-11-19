import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Giv et korrekt default value – IKKE tomt objekt
const AuthContext = createContext({
  currentUser: null,
  signup: () => {},
  login: () => {},
  logout: () => {}
});

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Opret bruger
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        uid: user.uid
      });
    } catch (error) {
      console.error("Fejl ved gem af brugerdata i Firestore:", error);
    }

    return userCredential;
  };

  // Log ind
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Log ud
  const logout = () => {
    return signOut(auth);
  };

  // Auth lytter
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
