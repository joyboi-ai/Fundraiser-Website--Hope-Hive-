import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Fundraiser } from '../types';
import { CalendarDays, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export function FeaturedFundraisers() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmounts, setDonationAmounts] = useState<Record<string, number>>({});
  const [processingDonation, setProcessingDonation] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const fetchFundraisers = async () => {
    try {
      setError(null);
      const q = query(
        collection(db, 'fundraisers'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedFundraisers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      })) as Fundraiser[];

      setFundraisers(fetchedFundraisers);
      
      const initialDonationAmounts = fetchedFundraisers.reduce((acc, fundraiser) => ({
        ...acc,
        [fundraiser.id]: 10
      }), {});
      setDonationAmounts(initialDonationAmounts);
    } catch (error) {
      console.error('Error fetching fundraisers:', error);
      setError('Failed to load fundraisers. Please try again later.');
      toast.error('Failed to load fundraisers');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (fundraiser: Fundraiser) => {
    if (!user) {
      toast.error('Please sign in to donate');
      return;
    }

    const amount = donationAmounts[fundraiser.id];
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    try {
      setProcessingDonation(fundraiser.id);
      
      await addDoc(collection(db, 'donations'), {
        amount,
        fundraiserId: fundraiser.id,
        userId: user.id,
        createdAt: new Date(),
      });

      const fundraiserRef = doc(db, 'fundraisers', fundraiser.id);
      await updateDoc(fundraiserRef, {
        currentAmount: fundraiser.currentAmount + amount
      });

      setFundraisers(prev => prev.map(f => 
        f.id === fundraiser.id 
          ? { ...f, currentAmount: f.currentAmount + amount }
          : f
      ));

      toast.success('Thank you for your donation!');
      
      setDonationAmounts(prev => ({
        ...prev,
        [fundraiser.id]: 10
      }));
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setProcessingDonation(null);
    }
  };

  const handleFundraiserClick = (fundraiserId: string) => {
    navigate(`/fundraiser/${fundraiserId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7043]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={fetchFundraisers}
          className="px-4 py-2 bg-[#FF7043] text-white rounded-md hover:bg-[#FF5722] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#2D2D2D] dark:text-white">Featured Fundraisers</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Support these amazing causes</p>
          </div>
          <Link 
            to="/donate" 
            className="flex items-center text-[#FF7043] hover:text-[#FF5722] transition-colors"
          >
            View All
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {fundraisers.map((fundraiser) => (
            <motion.div
              key={fundraiser.id}
              variants={item}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer"
              onClick={() => handleFundraiserClick(fundraiser.id)}
            >
              <img
                src={fundraiser.imageUrl}
                alt={fundraiser.title}
                className="h-48 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=500';
                }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1 text-sm font-medium text-[#FF7043] bg-[#FFF6EC] dark:bg-gray-700 rounded-full">
                    {fundraiser.category}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {new Date(fundraiser.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-[#2D2D2D] dark:text-white mb-2">
                  {fundraiser.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {fundraiser.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Target className="w-4 h-4 mr-1" />
                      Goal: ${fundraiser.goalAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Raised: ${fundraiser.currentAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-[#FFF6EC] dark:bg-gray-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(
                            (fundraiser.currentAmount / fundraiser.goalAmount) * 100,
                            100
                          )}%` 
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FF7043]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-gray-700 dark:text-gray-300">$</span>
                    <input
                      type="number"
                      min="1"
                      value={donationAmounts[fundraiser.id]}
                      onChange={(e) => setDonationAmounts({
                        ...donationAmounts,
                        [fundraiser.id]: Math.max(1, Number(e.target.value))
                      })}
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDonate(fundraiser)}
                      disabled={processingDonation === fundraiser.id}
                      className={`px-4 py-2 rounded-md text-white transition-colors ${
                        processingDonation === fundraiser.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#FF7043] hover:bg-[#FF5722]'
                      }`}
                    >
                      {processingDonation === fundraiser.id ? 'Processing...' : 'Donate'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {fundraisers.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No fundraisers available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}