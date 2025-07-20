import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Fundraiser } from '../types';
import { Target, TrendingUp, CalendarDays, Search, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

type SortOption = 'recent' | 'goal-high' | 'goal-low' | 'progress';

export function AllFundraisers() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [donationAmounts, setDonationAmounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const fetchFundraisers = async () => {
    try {
      const q = query(collection(db, 'fundraisers'), orderBy('createdAt', 'desc'));
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

      toast.success('Thank you for your donation!');
      fetchFundraisers();
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Failed to process donation');
    }
  };

  const filteredAndSortedFundraisers = React.useMemo(() => {
    let result = [...fundraisers];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(fundraiser => 
        fundraiser.title.toLowerCase().includes(searchLower) ||
        fundraiser.description.toLowerCase().includes(searchLower) ||
        fundraiser.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'goal-high':
        result.sort((a, b) => b.goalAmount - a.goalAmount);
        break;
      case 'goal-low':
        result.sort((a, b) => a.goalAmount - b.goalAmount);
        break;
      case 'progress':
        result.sort((a, b) => (b.currentAmount / b.goalAmount) - (a.currentAmount / a.goalAmount));
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [fundraisers, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Support a Cause</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Choose a fundraiser to support and make a difference today
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search fundraisers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none w-full px-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="goal-high">Highest Goal</option>
              <option value="goal-low">Lowest Goal</option>
              <option value="progress">Most Progress</option>
            </select>
            <SlidersHorizontal className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedFundraisers.map((fundraiser) => (
            <div
              key={fundraiser.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <img
                src={fundraiser.imageUrl}
                alt={fundraiser.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-sm font-medium text-rose-600 bg-rose-50 rounded-full dark:bg-rose-900 dark:text-rose-200">
                    {fundraiser.category}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {new Date(fundraiser.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-rose-100 dark:bg-rose-900">
                      <div
                        style={{
                          width: `${Math.min(
                            (fundraiser.currentAmount / fundraiser.goalAmount) * 100,
                            100
                          )}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 dark:text-gray-300">$</span>
                    <input
                      type="number"
                      min="1"
                      value={donationAmounts[fundraiser.id]}
                      onChange={(e) => setDonationAmounts({
                        ...donationAmounts,
                        [fundraiser.id]: Number(e.target.value)
                      })}
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleDonate(fundraiser)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedFundraisers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No fundraisers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}