import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Heart } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setIsForgotPassword(false);
      } else if (isSignIn) {
        await signIn(email, password);
        toast.success('Successfully signed in!');
        navigate('/');
      } else {
        await signUp(email, password, fullName);
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
            if (isSignIn) {
              toast.error('Email not registered. Please sign up instead.');
              setIsSignIn(false);
            } else {
              toast.error('Invalid email or password.');
            }
            break;
          case 'auth/email-already-in-use':
            toast.error('This email is already registered. Please sign in instead.');
            setIsSignIn(true);
            break;
          case 'auth/invalid-email':
            toast.error('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            toast.error('Password should be at least 6 characters long.');
            break;
          case 'auth/wrong-password':
            toast.error('Incorrect password. Please try again.');
            break;
          case 'auth/too-many-requests':
            toast.error('Too many attempts. Please try again later.');
            break;
          default:
            toast.error('An error occurred. Please try again.');
            console.error('Authentication error:', error);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Authentication error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Heart className="h-12 w-12 text-rose-500" />
        </motion.div>
        <motion.h2 
          className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isForgotPassword ? 'Reset Password' : (isSignIn ? 'Welcome Back' : 'Create Your Account')}
        </motion.h2>
        {!isForgotPassword && (
          <motion.p 
            className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-rose-600 hover:text-rose-500"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </motion.p>
        )}
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isSignIn && !isForgotPassword && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {isSignIn && !isForgotPassword && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm font-medium text-rose-600 hover:text-rose-500"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isForgotPassword ? (
                  'Send Reset Link'
                ) : isSignIn ? (
                  'Sign in'
                ) : (
                  'Sign up'
                )}
              </motion.button>
            </div>
          </form>

          {isForgotPassword && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-sm font-medium text-rose-600 hover:text-rose-500"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}