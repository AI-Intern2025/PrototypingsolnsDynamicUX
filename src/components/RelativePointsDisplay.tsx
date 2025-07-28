import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, CrownIcon, ZapIcon } from 'lucide-react';

interface RelativePointsDisplayProps {
  userPoints: number;
  leaderPoints: number;
  userRank: number;
  totalParticipants: number;
  pointsDifference: number;
  isImproving: boolean;
}

const RelativePointsDisplay: React.FC<RelativePointsDisplayProps> = ({
  userPoints,
  leaderPoints,
  userRank,
  totalParticipants,
  pointsDifference,
  isImproving
}) => {
  const progressPercentage = (userPoints / leaderPoints) * 100;
  const rankPercentile = ((totalParticipants - userRank) / totalParticipants) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ZapIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Your Performance</h3>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          isImproving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isImproving ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
          <span>{isImproving ? 'Improving' : 'Declining'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{userPoints}</div>
          <div className="text-sm text-gray-600">Your Points</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">#{userRank}</div>
          <div className="text-sm text-gray-600">Current Rank</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Points vs Leader</span>
            <span className="text-sm text-gray-600">
              {pointsDifference > 0 ? `${pointsDifference} behind` : `${Math.abs(pointsDifference)} ahead`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{leaderPoints} pts</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Rank Percentile</span>
            <span className="text-sm text-gray-600">Top {(100 - rankPercentile).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${rankPercentile}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <CrownIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Leader Comparison</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {pointsDifference > 0 ? (
              <span className="text-red-600">-{pointsDifference} points behind</span>
            ) : (
              <span className="text-green-600">+{Math.abs(pointsDifference)} points ahead</span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Leader has {leaderPoints} points
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelativePointsDisplay;