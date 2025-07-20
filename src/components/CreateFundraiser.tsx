import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';

const CATEGORIES = [
  'Medical',
  'Education',
  'Emergency',
  'Community',
  'Animals',
  'Environment',
  'Other'
];

export function CreateFundraiser() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [endDate, setEndDate] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a fundraiser');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Firestore will automatically create the collection if it doesn't exist
      await addDoc(collection(db, 'fundraisers'), {
        title,
        description,
        goalAmount: parseFloat(goalAmount),
        currentAmount: 0,
        category,
        imageUrl,
        userId: user.id,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        endDate: new Date(endDate).toISOString(),
        upiId: upiId.trim(),
        status: 'active',
        donors: [],
        updates: []
      });

      navigate('/');
    } catch (err) {
      console.error('Error creating fundraiser:', err);
      setError('Failed to create fundraiser. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create a Fundraiser</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title*</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            required
            minLength={5}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            required
            minLength={20}
            maxLength={2000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Goal Amount ($)*</label>
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            required
            min="1"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category*</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL*</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            required
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="username@upi"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9]+"
            title="Enter a valid UPI ID (e.g., username@upi)"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Add your UPI ID for direct payments</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date*</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Creating...' : 'Create Fundraiser'}
        </button>
      </form>
    </div>
  );
}