import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, Target } from 'lucide-react';

interface DonationStatsProps {
  totalDonations: number;
  totalDonors: number;
  recentDonations: Array<{
    date: string;
    amount: number;
  }>;
}

export function DonationStats({ totalDonations, totalDonors, recentDonations }: DonationStatsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const chartData = recentDonations.map(donation => ({
    date: format(new Date(donation.date), 'MMM d'),
    amount: donation.amount,
  }));

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={ref} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Donation Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          variants={statsVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-rose-50 dark:bg-gray-700 p-6 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalDonations.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-rose-500" />
          </div>
        </motion.div>

        <motion.div
          variants={statsVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {totalDonors.toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          variants={statsVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Average Donation</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalDonors ? Math.round(totalDonations / totalDonors) : 0}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      <div className="h-[300px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="amount" fill="#FF7043" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}