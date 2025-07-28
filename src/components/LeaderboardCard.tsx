import React from 'react';
import { LeaderboardEntry } from '../types';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon, CrownIcon } from 'lucide-react';

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  totalEntries: number;
  lastUpdated: Date;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ entries, totalEntries, lastUpdated }) => {
  const getRankIcon = (rankChange: number) => {
    if (rankChange > 0) return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (rankChange < 0) return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank <= 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Leaderboard</h3>
          <div className="text-sm text-gray-500">
            Last updated {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          ALL TEAMS ({totalEntries.toLocaleString()})
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
              entry.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {entry.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                {entry.rank === 1 && (
                  <CrownIcon className="absolute -top-2 -right-1 w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{entry.username}</div>
                <div className="text-sm text-gray-500">{entry.teamName}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg">{entry.points}</div>
              <div className={`text-sm font-medium ${getRankColor(entry.rank)}`}>
                #{entry.rank}
              </div>
            </div>
            
            <div className="flex items-center ml-2">
              {getRankIcon(entry.rankChange)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;