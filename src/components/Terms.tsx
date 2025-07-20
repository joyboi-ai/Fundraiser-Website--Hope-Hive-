import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Shield, AlertCircle, HelpCircle } from 'lucide-react';

export function Terms() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing and using Hope Hive, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`
    },
    {
      title: "User Accounts",
      content: `You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.`
    },
    {
      title: "Fundraising Rules",
      content: `• All fundraisers must comply with our guidelines
        • Accurate and truthful information must be provided
        • No fraudulent or misleading campaigns
        • No campaigns for illegal purposes
        • We reserve the right to remove any campaign`
    },
    {
      title: "Donations",
      content: `• All donations are final and non-refundable
        • We charge no platform fees
        • Payment processing fees may apply
        • Donors are responsible for verifying campaign legitimacy
        • Tax receipts are provided where applicable`
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
            <ScrollText className="h-16 w-16 text-rose-500 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using our platform
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

              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {section.content}
                  </p>
                </motion.div>
              ))}

              <div className="mt-12 space-y-8">
                <div className="bg-rose-50 dark:bg-rose-900 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="h-6 w-6 text-rose-500 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Important Notice
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    We reserve the right to modify these terms at any time. Your continued use of the platform after changes constitutes acceptance of the new terms.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-blue-500 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Your Rights
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    You retain all rights to your content. By posting content, you grant us a license to use it for platform purposes.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <HelpCircle className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Need Help?
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    If you have any questions about these terms, please contact our support team at support@hopehive.com
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}