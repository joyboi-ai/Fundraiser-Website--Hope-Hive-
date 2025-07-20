import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Target, TrendingUp, Users, Calendar } from 'lucide-react';

interface FundraiserProgressProps {
  currentAmount: number;
  goalAmount: number;
  donorCount: number;
  daysLeft: number;
}

export function FundraiserProgress({ currentAmount, goalAmount, donorCount, daysLeft }: FundraiserProgressProps) {
  const progressWidth = Math.min((currentAmount / goalAmount) * 100, 100);
  
  const progressAnimation = useSpring({
    width: `${progressWidth}%`,
    from: { width: '0%' },
    config: { tension: 100, friction: 10 },
  });

  const numberAnimation = useSpring({
    number: currentAmount,
    from: { number: 0 },
    config: { tension: 100, friction: 10 },
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <animated.p className="text-3xl font-bold text-gray-900 dark:text-white">
              {numberAnimation.number.to(n => `₹${n.toFixed(0)}`)}
            </animated.p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              raised of ₹{goalAmount.toLocaleString()} goal
            </p>
          </div>
          <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
            {progressWidth.toFixed(0)}%
          </p>
        </div>

        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <animated.div
            style={progressAnimation}
            className="absolute top-0 left-0 h-full bg-rose-500 rounded-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{donorCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Donors</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{donorCount ? Math.round(currentAmount / donorCount) : 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Donation</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{daysLeft}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Days Left</p>
          </div>
        </div>
      </div>
    </div>
  );
}