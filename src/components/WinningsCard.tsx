import React from 'react';
import { Contest, UserTeam } from '../types';
import { TrophyIcon, GiftIcon, StarIcon, TrendingUpIcon } from 'lucide-react';

interface WinningsCardProps {
  contest: Contest;
  userTeam: UserTeam;
  potentialWinning: number;
}

const WinningsCard: React.FC<WinningsCardProps> = ({ contest, userTeam, potentialWinning }) => {
  const getWinningTier = (rank: number) => {
    if (rank === 1) return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: TrophyIcon };
    if (rank <= 3) return { color: 'text-orange-600', bg: 'bg-orange-50', icon: GiftIcon };
    if (rank <= 10) return { color: 'text-blue-600', bg: 'bg-blue-50', icon: StarIcon };
    return { color: 'text-gray-600', bg: 'bg-gray-50', icon: TrendingUpIcon };
  };

  const tier = getWinningTier(userTeam.rank);
  const Icon = tier.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Your Performance</h3>
        <div className={`px-3 py-1 rounded-full ${tier.bg} ${tier.color} text-sm font-medium`}>
          Rank #{userTeam.rank}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${tier.bg}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Icon className={`w-5 h-5 ${tier.color}`} />
              <span className="text-sm font-medium text-gray-700">Current Points</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{userTeam.totalPoints}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Potential Winning</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ₹{potentialWinning.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Prize Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">1st Place:</span>
              <span className="font-medium">₹{contest.winnerPayouts[0]?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">2nd Place:</span>
              <span className="font-medium">₹{contest.winnerPayouts[1]?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">3rd Place:</span>
              <span className="font-medium">₹{contest.winnerPayouts[2]?.toLocaleString() || 0}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Total Prize Pool:</span>
                <span className="text-green-600">₹{contest.prizePool.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningsCard;