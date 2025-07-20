import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Auth } from './components/Auth';
import { CreateFundraiser } from './components/CreateFundraiser';
import { FeaturedFundraisers } from './components/FeaturedFundraisers';
import { MyFundraisers } from './components/MyFundraisers';
import { AllFundraisers } from './components/AllFundraisers';
import { FundraiserDetails } from './components/FundraiserDetails';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProfileModal } from './components/ProfileModal';
import { Heart, Moon, Sun, UserCircle, FolderHeart, Menu, X } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { NavbarSearch } from './components/NavbarSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { HowItWorks } from './components/HowItWorks';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { Privacy } from './components/Privacy';
import { Terms } from './components/Terms';

function AppContent() {
  const { user, initialize } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const NavLinks = () => (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleDarkMode}
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.button>

      {user ? (
        <>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/create"
              onClick={closeMobileMenu}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 w-full md:w-auto text-center"
            >
              Create Fundraiser
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/my-fundraisers"
              onClick={closeMobileMenu}
              className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <FolderHeart className="h-5 w-5 mr-1" />
              My Fundraisers
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsProfileModalOpen(true);
              closeMobileMenu();
            }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <UserCircle className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              signOut();
              closeMobileMenu();
            }}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Sign Out
          </motion.button>
        </>
      ) : (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/auth"
            onClick={closeMobileMenu}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Sign In
          </Link>
        </motion.div>
      )}
    </>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDarkMode ? '#374151' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          },
        }}
      />

      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
                  <Heart className="h-8 w-8 text-rose-500" />
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Hope Hive</span>
                </Link>
                <div className="hidden md:block ml-6">
                  <NavbarSearch />
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <NavLinks />
              </div>

              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            <div className="md:hidden -mt-2 pb-4">
              <NavbarSearch />
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="px-4 pt-2 pb-3 space-y-4 flex flex-col items-center">
                  <NavLinks />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/create" element={<CreateFundraiser />} />
              <Route path="/my-fundraisers" element={<MyFundraisers />} />
              <Route path="/donate" element={<AllFundraisers />} />
              <Route path="/fundraiser/:id" element={<FundraiserDetails />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/" element={
                <>
                  <Hero />
                  <FeaturedFundraisers />
                </>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;