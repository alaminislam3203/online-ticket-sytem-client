import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return null;
      }
      return { email: payload.email, role: payload.role, id: payload.id };
    } catch {
      return null;
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  const resetPassword = email => sendPasswordResetEmail(auth, email);
  const updateUserProfile = (name, photoURL) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL });

  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem('token');
    setUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    // Refresh হলে token থেকে user set করো
    const tokenUser = getUserFromToken();
    if (tokenUser) setUser(tokenUser);

    const unsubscribe = onAuthStateChanged(auth, () => {
      // Firebase state change হলে token recheck করো
      const tokenUser = getUserFromToken();
      if (tokenUser) {
        setUser(tokenUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signInUser,
    googleLogin,
    logOut,
    updateUserProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
