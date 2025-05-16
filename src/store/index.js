import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { Alert } from 'react-native';
import { getFirestore, doc, setDoc, onSnapshot } from '@react-native-firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';

const MyContext = createContext(null);

const initialState = {
  userLogin: null,
  services: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, userLogin: action.value };
    case 'USER_LOGOUT':
      return { ...state, userLogin: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const MyContextControllerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

const useMyContextController = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContextController must be used within a MyContextControllerProvider');
  }
  return context;
};

const signup = async (email, password, fullname, phone, role) => {
  try {
    const auth = getAuth();
    const firestore = getFirestore();

    await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(firestore, 'USERS', email), {
      email,
      password,
      fullname,
      phone,
      role,
    });

    Alert.alert('Create account success with ' + email);
  } catch (e) {
    Alert.alert('Signup error: ' + e.message);
  }
};

const login = async (dispatch, email, password) => {
  try {
    const auth = getAuth();
    const firestore = getFirestore();

    await signInWithEmailAndPassword(auth, email, password);

    const userDocRef = doc(firestore, 'USERS', email);
    onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        Alert.alert('Login success with ' + docSnap.id);
        dispatch({ type: 'USER_LOGIN', value: docSnap.data() });
      } else {
        Alert.alert('User document not found!');
      }
    });
  } catch (e) {
    Alert.alert('Wrong email or password');
    console.log('Login error:', e.message);
  }
};

const logout = async (dispatch) => {
  try {
    const auth = getAuth();
    await signOut(auth);
    dispatch({ type: 'USER_LOGOUT' });
  } catch (e) {
    Alert.alert('Logout error: ' + e.message);
  }
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
  signup,
};
