import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Fundraiser, Donation } from '../types';
import { FundraiserProgress } from './FundraiserProgress';
import { ShareButton } from './ShareButton';
import { ArrowLeft, Calendar, User, Tag, IndianRupee, QrCode, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { useAuthStore } from '../store/authStore';

export function FundraiserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [isConfirmingDonation, setIsConfirmingDonation] = useState(false);

  useEffect(() => {
    const fetchFundraiserAndDonations = async () => {
      try {
        if (!id) return;

        const fundraiserDoc = await getDoc(doc(db, 'fundraisers', id));
        if (!fundraiserDoc.exists()) {
          setError('Fundraiser not found');
          return;
        }

        const fundraiserData = {
          id: fundraiserDoc.id,
          ...fundraiserDoc.data(),
          createdAt: fundraiserDoc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as Fundraiser;
        setFundraiser(fundraiserData);

        const donationsQuery = query(
          collection(db, 'donations'),
          where('fundraiserId', '==', id)
        );
        const donationsSnapshot = await getDocs(donationsQuery);
        const donationsData = donationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
        })) as Donation[];
        setDonations(donationsData);

      } catch (error) {
        console.error('Error fetching fundraiser details:', error);
        setError('Failed to load fundraiser details');
      } finally {
        setLoading(false);
      }
    };

    fetchFundraiserAndDonations();
  }, [id]);

  const generateQRCode = async (upiId: string, amount: number) => {
    try {
      const formattedAmount = amount.toFixed(2);
      const upiUrl = `upi://pay?pa=${upiId}&pn=Hope%20Hive&tn=Donation&am=${formattedAmount}`;
      const qrCode = await QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCode);
      setShowQRCode(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const handleCopyUPI = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied to clipboard!');
  };

  const handleDonationAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (amount > 0) {
      setDonationAmount(amount);
      if (fundraiser?.upiId) {
        generateQRCode(fundraiser.upiId, amount);
      }
    }
  };

  const confirmDonation = async () => {
    if (!fundraiser || !user) {
      toast.error('Please sign in to confirm donation');
      return;
    }

    try {
      setIsConfirmingDonation(true);

      // Add donation record
      await addDoc(collection(db, 'donations'), {
        amount: donationAmount,
        fundraiserId: fundraiser.id,
        userId: user.id,
        createdAt: new Date(),
      });

      // Update fundraiser amount
      const fundraiserRef = doc(db, 'fundraisers', fundraiser.id);
      const newAmount = fundraiser.currentAmount + donationAmount;
      await updateDoc(fundraiserRef, {
        currentAmount: newAmount
      });

      // Update local state
      setFundraiser({
        ...fundraiser,
        currentAmount: newAmount
      });

      // Add new donation to local state
      const newDonation: Donation = {
        id: Date.now().toString(), // temporary ID
        amount: donationAmount,
        fundraiserId: fundraiser.id,
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      setDonations([newDonation, ...donations]);

      toast.success('Thank you for your donation!');
      setShowQRCode(false);
    } catch (error) {
      console.error('Error confirming donation:', error);
      toast.error('Failed to confirm donation');
    } finally {
      setIsConfirmingDonation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !fundraiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Fundraiser not found'}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-rose-600 hover:text-rose-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(fundraiser.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Fundraisers
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={fundraiser.imageUrl}
                  alt={fundraiser.title}
                  className="w-full h-96 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-900 dark:text-rose-200 rounded-full">
                      {fundraiser.category}
                    </span>
                    <ShareButton fundraiserId={fundraiser.id} title={fundraiser.title} />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {fundraiser.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Ends {format(new Date(fundraiser.endDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      <span>{fundraiser.category}</span>
                    </div>
                  </div>
                  {fundraiser.upiId && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <IndianRupee className="h-5 w-5 text-rose-500 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">UPI ID: {fundraiser.upiId}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyUPI(fundraiser.upiId!)}
                            className="px-3 py-1 text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                          >
                            Copy UPI ID
                          </button>
                          <button
                            onClick={() => {
                              if (!showQRCode) {
                                generateQRCode(fundraiser.upiId!, donationAmount);
                              }
                              setShowQRCode(!showQRCode);
                            }}
                            className="flex items-center px-3 py-1 text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {showQRCode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col items-center"
                          >
                            <div className="mb-4 w-full max-w-xs">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Donation Amount (₹)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={donationAmount}
                                onChange={handleDonationAmountChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            {qrCodeUrl && (
                              <div className="bg-white p-4 rounded-lg shadow-md">
                                <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-64 h-64" />
                                <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                                  Scan to pay ₹{donationAmount} via UPI
                                </p>
                                <button
                                  onClick={confirmDonation}
                                  disabled={isConfirmingDonation}
                                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isConfirmingDonation ? (
                                    <span className="flex items-center">
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                      Confirming...
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      I've Completed the Payment
                                    </span>
                                  )}
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {fundraiser.description}
                  </p>
                </div>
              </div>

              {/* Donations List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Donations
                </h2>
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              Anonymous Donor
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-rose-600">
                          ₹{donation.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No donations yet. Be the first to donate!
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FundraiserProgress
                currentAmount={fundraiser.currentAmount}
                goalAmount={fundraiser.goalAmount}
                donorCount={donations.length}
                daysLeft={daysLeft}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}