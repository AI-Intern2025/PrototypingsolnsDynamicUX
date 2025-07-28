import React from 'react';
import { Match } from '../types';
import { RadioIcon, ClockIcon } from 'lucide-react';

interface LiveMatchCardProps {
  match: Match;
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <RadioIcon className="w-3 h-3 text-red-500" />
            <span className="text-red-500 text-sm font-medium">LIVE</span>
          </div>
        </div>
        <div className="text-gray-500 text-sm">
          {match.currentOver}.{match.currentBall} overs
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">IN</span>
            </div>
            <span className="font-semibold text-gray-900">{match.team1}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{match.team1Score}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">EN</span>
            </div>
            <span className="font-semibold text-gray-900">{match.team2}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{match.team2Score}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-600">{match.lastUpdate}</div>
      </div>
    </div>
  );
};

export default LiveMatchCard;