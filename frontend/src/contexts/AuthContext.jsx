import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth skal bruges inde i en AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tilmeld bruger
  const signup = async (email, password) => {
    // Opret bruger i Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Gem brugerdata i Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        uid: user.uid
      });
    } catch (error) {
      console.error('Fejl ved gem af brugerdata i Firestore:', error);
      // Fortsæt selvom Firestore fejler - brugeren er allerede oprettet i Authentication
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

  // Lyt til ændringer i authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

