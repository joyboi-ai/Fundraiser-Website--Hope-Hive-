import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { Fundraiser } from '../types';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';

export function MyFundraisers() {
  const user = useAuthStore((state) => state.user);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFundraiser, setEditingFundraiser] = useState<Fundraiser | null>(null);

  useEffect(() => {
    fetchUserFundraisers();
  }, [user?.id]);

  const fetchUserFundraisers = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'fundraisers'),
        where('userId', '==', user.id)
      );
      
      const querySnapshot = await getDocs(q);
      const userFundraisers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      })) as Fundraiser[];

      setFundraisers(userFundraisers);
    } catch (error) {
      console.error('Error fetching fundraisers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (fundraiser: Fundraiser) => {
    try {
      const fundraiserRef = doc(db, 'fundraisers', fundraiser.id);
      await updateDoc(fundraiserRef, {
        title: editingFundraiser?.title,
        description: editingFundraiser?.description,
        goalAmount: Number(editingFundraiser?.goalAmount),
        category: editingFundraiser?.category,
        imageUrl: editingFundraiser?.imageUrl,
        endDate: editingFundraiser?.endDate,
      });

      setEditingFundraiser(null);
      fetchUserFundraisers();
    } catch (error) {
      console.error('Error updating fundraiser:', error);
    }
  };

  const handleDelete = async (fundraiserId: string) => {
    if (!window.confirm('Are you sure you want to delete this fundraiser?')) return;

    try {
      await deleteDoc(doc(db, 'fundraisers', fundraiserId));
      fetchUserFundraisers();
    } catch (error) {
      console.error('Error deleting fundraiser:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (fundraisers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No fundraisers</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You haven't created any fundraisers yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Fundraisers</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fundraisers.map((fundraiser) => (
          <div key={fundraiser.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {editingFundraiser?.id === fundraiser.id ? (
              <div className="p-6">
                <input
                  type="text"
                  value={editingFundraiser.title}
                  onChange={(e) => setEditingFundraiser({ ...editingFundraiser, title: e.target.value })}
                  className="mb-4 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Title"
                />
                <textarea
                  value={editingFundraiser.description}
                  onChange={(e) => setEditingFundraiser({ ...editingFundraiser, description: e.target.value })}
                  className="mb-4 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={editingFundraiser.goalAmount}
                  onChange={(e) => setEditingFundraiser({ ...editingFundraiser, goalAmount: Number(e.target.value) })}
                  className="mb-4 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Goal Amount"
                />
                <input
                  type="text"
                  value={editingFundraiser.imageUrl}
                  onChange={(e) => setEditingFundraiser({ ...editingFundraiser, imageUrl: e.target.value })}
                  className="mb-4 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Image URL"
                />
                <input
                  type="date"
                  value={editingFundraiser.endDate.split('T')[0]}
                  onChange={(e) => setEditingFundraiser({ ...editingFundraiser, endDate: new Date(e.target.value).toISOString() })}
                  className="mb-4 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingFundraiser(null)}
                    className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(fundraiser)}
                    className="px-3 py-1 text-sm text-white bg-rose-600 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={fundraiser.imageUrl}
                  alt={fundraiser.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {fundraiser.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {fundraiser.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Goal: ${fundraiser.goalAmount.toLocaleString()}</span>
                    <span>Raised: ${fundraiser.currentAmount.toLocaleString()}</span>
                  </div>
                  <div className="relative pt-1 mb-4">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-rose-100">
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
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingFundraiser(fundraiser)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fundraiser.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}