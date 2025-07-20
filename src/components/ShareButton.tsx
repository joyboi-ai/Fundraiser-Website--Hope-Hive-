import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  fundraiserId: string;
  title: string;
}

export function ShareButton({ fundraiserId, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `${window.location.origin}/donate?id=${fundraiserId}`;
  
  const shareOptions = [
    {
      name: 'Copy Link',
      icon: '🔗',
      action: async () => {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        setIsOpen(false);
      },
    },
    {
      name: 'Facebook',
      icon: '📘',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        setIsOpen(false);
      },
    },
    {
      name: 'Twitter',
      icon: '🐦',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=Support this cause: ${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        setIsOpen(false);
      },
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Support this cause: ${title} ${shareUrl}`)}`, '_blank');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Share2 className="h-5 w-5 mr-2" />
        Share
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-40"
            >
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <span>{option.icon}</span>
                  <span className="text-gray-700 dark:text-gray-200">{option.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}