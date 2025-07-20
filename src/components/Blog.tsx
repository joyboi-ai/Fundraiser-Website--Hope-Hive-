import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Blog() {
  const posts = [
    {
      id: 1,
      title: "How to Create a Successful Fundraising Campaign",
      excerpt: "Learn the key strategies and best practices for creating a fundraising campaign that resonates with donors and achieves its goals.",
      author: "Sarah Johnson",
      date: "2025-03-15",
      image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&q=80&w=500",
      category: "Fundraising Tips"
    },
    {
      id: 2,
      title: "The Impact of Social Media on Modern Fundraising",
      excerpt: "Discover how social media platforms are revolutionizing the way we raise funds and connect with donors worldwide.",
      author: "Michael Chen",
      date: "2025-03-10",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=500",
      category: "Digital Strategy"
    },
    {
      id: 3,
      title: "Success Stories: Making a Difference Together",
      excerpt: "Read inspiring stories of successful fundraising campaigns and the positive impact they've had on communities.",
      author: "Emily Rodriguez",
      date: "2025-03-05",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=500",
      category: "Success Stories"
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
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Hope Hive Blog
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Insights, tips, and stories about fundraising and making a difference
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-900 dark:text-rose-200 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="mt-4 flex items-center text-rose-600 hover:text-rose-700"
                >
                  <Link to={`/blog/${post.id}`} className="flex items-center">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-rose-500 dark:bg-rose-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-rose-100 mb-8">
              Get the latest fundraising tips and success stories delivered to your inbox
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-white text-rose-600 rounded-md hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}