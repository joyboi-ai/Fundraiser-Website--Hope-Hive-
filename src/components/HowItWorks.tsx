import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, ArrowRight, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Heart className="w-12 h-12 text-rose-500" />,
      title: "Create Your Fundraiser",
      description: "Set up your fundraiser in minutes. Add a compelling story, photos, and your fundraising goal."
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Share With Others",
      description: "Share your fundraiser with friends, family, and your community through social media and email."
    },
    {
      icon: <Target className="w-12 h-12 text-green-500" />,
      title: "Receive Donations",
      description: "Accept donations securely. Keep track of your progress and thank your donors."
    }
  ];

  const features = [
    "0% platform fee - more money goes to your cause",
    "Secure payment processing",
    "24/7 expert support",
    "Mobile-optimized fundraising pages",
    "Real-time donation tracking",
    "Social media integration"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              How Hope Hive Works
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Start making a difference in just a few simple steps
            </p>
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose Hope Hive?
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              We provide the tools you need to raise funds effectively
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <CheckCircle className="h-6 w-6 text-rose-500" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-rose-500 dark:bg-rose-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to Start Your Fundraiser?
            </h2>
            <div className="mt-8 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/create"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-rose-600 bg-white hover:bg-gray-50"
                >
                  Start Fundraising
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}