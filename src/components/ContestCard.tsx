import React from 'react';
import { Contest } from '../types';
import { TrophyIcon, UsersIcon, ClockIcon } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
  onJoin?: (contestId: string) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, onJoin }) => {
  const spotsLeft = contest.totalSpots - contest.filledSpots;
  const fillPercentage = (contest.filledSpots / contest.totalSpots) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-900">{contest.name}</span>
        </div>
        {contest.isLive && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-sm font-medium">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{contest.prizePool.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Prize Pool</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              ₹{contest.entryFee}
            </div>
            <div className="text-sm text-gray-500">Entry Fee</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <UsersIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {contest.filledSpots.toLocaleString()} of {contest.totalSpots.toLocaleString()} joined
              </span>
            </div>
            <div className="text-gray-500">
              {spotsLeft.toLocaleString()} spots left
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 inline mr-1" />
            {contest.isLive ? 'Live now' : `Starts ${contest.startTime.toLocaleTimeString()}`}
          </div>
          <button
            onClick={() => onJoin?.(contest.id)}
            disabled={contest.isLive || spotsLeft === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              contest.isLive || spotsLeft === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {contest.isLive ? 'Live' : spotsLeft === 0 ? 'Full' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;