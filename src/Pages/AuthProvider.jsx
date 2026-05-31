import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { AuthContext } from '../Context/AuthContext';
import { auth } from '../firebase/Firebase.init';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signInUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleProvider = new GoogleAuthProvider();
  const googleLogin = () => signInWithPopup(auth, googleProvider);

  const signOutUser = () => signOut(auth);

  const updateUserProfile = profile => {
    return updateProfile(auth.currentUser, profile);
  };

  // 🔥 Auth observer
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      //
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const res = await axiosSecure.get(`/users/role/${currentUser.email}`);
          console.log('Role fetch response:', res.data);
          setRole(res.data.role);
          setLoading(false);
        } catch (error) {
          console.error('Role fetch error', error);
          setRole('user');
          setLoading(false);
        }
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosSecure]);

  const authInfo = {
    user,
    setUser,
    role,
    loading,
    setLoading,
    createUser,
    signInUser,
    googleLogin,
    signOutUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
