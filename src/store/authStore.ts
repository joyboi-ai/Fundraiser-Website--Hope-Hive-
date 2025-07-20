import { create } from 'zustand';
import { User } from '../types';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  ActionCodeSettings
} from 'firebase/auth';
import toast from 'react-hot-toast';

/**
 * Interface defining the authentication state and available actions
 */
interface AuthState {
  /** Current authenticated user or null if not authenticated */
  user: User | null;
  /** Loading state during authentication operations */
  loading: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Create new user account */
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  /** Sign out current user */
  signOut: () => Promise<void>;
  /** Send password reset email */
  resetPassword: (email: string) => Promise<void>;
  /** Initialize authentication state listener */
  initialize: () => void;
}

/**
 * Configuration for password reset functionality
 * Uses Firebase hosting URL to ensure authorized domain
 */
const actionCodeSettings: ActionCodeSettings = {
  // Firebase hosting URL for the project
  url: 'https://hopehive-c660c.firebaseapp.com/auth',
  // Use email-link based reset instead of in-app handling
  handleCodeInApp: false
};

/**
 * Authentication store using Zustand
 * Manages user authentication state and provides authentication methods
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  /**
   * Initializes authentication state listener
   * Updates store when auth state changes
   */
  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Transform Firebase user to app User type
        set({
          user: {
            id: user.uid,
            email: user.email!,
            fullName: user.displayName || '',
            avatarUrl: user.photoURL || undefined
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });

    return () => unsubscribe();
  },

  /**
   * Signs in a user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Will throw an error if authentication fails
   */
  signIn: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({
        user: {
          id: result.user.uid,
          email: result.user.email!,
          fullName: result.user.displayName || '',
          avatarUrl: result.user.photoURL || undefined
        }
      });
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  },

  /**
   * Creates a new user account and signs them in
   * 
   * @param email - New user's email address
   * @param password - New user's password
   * @param fullName - User's full name
   * @throws Will throw an error if account creation fails
   */
  signUp: async (email, password, fullName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set user's display name after account creation
      await updateProfile(result.user, { displayName: fullName });
      set({
        user: {
          id: result.user.uid,
          email: result.user.email!,
          fullName,
          avatarUrl: result.user.photoURL || undefined
        }
      });
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  },

  /**
   * Signs out the current user
   * 
   * @throws Will throw an error if sign out fails
   */
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  },

  /**
   * Sends a password reset email to the specified address
   * 
   * @param email - Email address to send reset link to
   * @throws Will throw an error if sending reset email fails
   */
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success('Password reset email sent! Please check your inbox and spam folder.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      // Handle specific error cases with user-friendly messages
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.');
          break;
        case 'auth/missing-android-pkg-name':
        case 'auth/missing-continue-uri':
        case 'auth/missing-ios-bundle-id':
        case 'auth/invalid-continue-uri':
        case 'auth/unauthorized-continue-uri':
          toast.error('Configuration error. Please contact support.');
          console.error('Action code settings error:', error);
          break;
        default:
          toast.error('Failed to send password reset email. Please try again later.');
      }
      throw error;
    }
  }
}));