import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

export function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="h-8 w-8 text-rose-500" />,
      content: `We collect information that you provide directly to us, including:
        • Personal information (name, email, etc.)
        • Payment information
        • Communication preferences
        • Usage data and cookies`
    },
    {
      title: "How We Use Your Information",
      icon: <UserCheck className="h-8 w-8 text-blue-500" />,
      content: `Your information helps us:
        • Process donations
        • Send updates about fundraisers
        • Improve our services
        • Comply with legal obligations`
    },
    {
      title: "Data Security",
      icon: <Lock className="h-8 w-8 text-green-500" />,
      content: `We implement appropriate security measures to protect your personal information:
        • Encryption of sensitive data
        • Regular security assessments
        • Secure data storage
        • Limited access to personal information`
    },
    {
      title: "Your Rights",
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      content: `You have the right to:
        • Access your personal data
        • Request corrections
        • Delete your account
        • Opt-out of communications
        • File a complaint`
    }
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
            <Shield className="h-16 w-16 text-rose-500 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Your privacy is important to us. Learn how we protect and manage your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Last updated: March 20, 2025
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-12">
                This Privacy Policy describes how Hope Hive ("we," "us," or "our") collects, uses, and shares your personal information when you use our website and services.
              </p>

              <div className="grid gap-8 md:grid-cols-2">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                  >
                    <div className="flex items-center mb-4">
                      {section.icon}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                        {section.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-4">
                  <li>Email: privacy@hopehive.com</li>
                  <li>Address: 123 Hope Street, Charity City, CH 12345</li>
                  <li>Phone: (555) 123-4567</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}