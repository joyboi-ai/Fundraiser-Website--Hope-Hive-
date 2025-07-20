import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Hope Hive</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Empowering communities through collective giving. Join us in making a difference, 
              one donation at a time.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="mailto:support@hopehive.com" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/how-it-works" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Hope Hive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
