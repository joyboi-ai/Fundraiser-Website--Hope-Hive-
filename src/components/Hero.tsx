import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#FFF6EC] dark:bg-gray-800 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-20 pb-16 md:pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-2xl text-center lg:text-left"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] dark:text-white leading-tight"
            >
              Make a difference with every donation
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300"
            >
              Join our community of changemakers who believe in the power of collective giving.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/donate"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-[#FF7043] hover:bg-[#FF5722] transition-colors"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Donating
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/create"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-[#FF7043] bg-white dark:bg-gray-700 border-2 border-[#FF7043] hover:bg-[#FFF6EC] dark:hover:bg-gray-600 transition-colors"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Fundraiser
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full max-w-lg lg:max-w-none"
          >
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600"
              alt="Helping hands"
              className="rounded-2xl shadow-2xl w-full"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#FF7043] flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2D2D2D] dark:text-white">$2.5M+</p>
                  <p className="text-gray-600 dark:text-gray-300">Raised so far</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-white dark:bg-gray-900 rounded-t-3xl"
      >
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] dark:text-white">Why Choose Us</h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">We make giving back simple and impactful</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              icon: "🤝",
              title: "Trust & Safety",
              description: "Verified campaigns and secure donations"
            },
            {
              icon: "⚡",
              title: "Quick Setup",
              description: "Start fundraising in minutes"
            },
            {
              icon: "💰",
              title: "0% Platform Fee",
              description: "More money goes to causes"
            },
            {
              icon: "🌍",
              title: "Global Reach",
              description: "Connect with donors worldwide"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              className="bg-[#FFF6EC] dark:bg-gray-800 p-6 rounded-xl text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#2D2D2D] dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}