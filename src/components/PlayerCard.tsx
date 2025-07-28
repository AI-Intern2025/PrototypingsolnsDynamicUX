import React from 'react';
import { Player } from '../types';
import { StarIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  showPoints?: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isInDreamTeam?: boolean;
  onSelect?: (player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  showPoints = true,
  isCaptain = false,
  isViceCaptain = false,
  isInDreamTeam = false,
  onSelect
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'wicket-keeper': return 'bg-blue-100 text-blue-800';
      case 'batsman': return 'bg-green-100 text-green-800';
      case 'all-rounder': return 'bg-purple-100 text-purple-800';
      case 'bowler': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'wicket-keeper': return 'WK';
      case 'batsman': return 'BAT';
      case 'all-rounder': return 'AR';
      case 'bowler': return 'BWL';
      default: return role.toUpperCase();
    }
  };

  const getPerformanceTrend = () => {
    if (player.recentPerformance.length < 2) return null;
    const recent = player.recentPerformance.slice(-2);
    return recent[1] > recent[0] ? 'up' : recent[1] < recent[0] ? 'down' : 'stable';
  };

  const trend = getPerformanceTrend();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${
        !player.isPlaying ? 'opacity-60' : ''
      } ${isInDreamTeam ? 'ring-2 ring-yellow-400' : ''}`}
      onClick={() => onSelect?.(player)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {(isCaptain || isViceCaptain) && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isCaptain ? 'bg-yellow-500' : 'bg-gray-400'
            }`}>
              <span className="text-white text-xs font-bold">
                {isCaptain ? 'C' : 'VC'}
              </span>
            </div>
          )}
          {isInDreamTeam && (
            <StarIcon className="w-4 h-4 text-yellow-500" />
          )}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(player.role)}`}>
          {getRoleBadge(player.role)}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium">
            {player.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 truncate">{player.name}</div>
          <div className="text-sm text-gray-500">{player.team}</div>
        </div>
      </div>
      
      {showPoints && (
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {player.points} pts
          </div>
          <div className="flex items-center space-x-1">
            {trend === 'up' && <TrendingUpIcon className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <TrendingDownIcon className="w-4 h-4 text-red-500" />}
            <span className="text-sm text-gray-500">
              {player.selectedBy}% selected
            </span>
          </div>
        </div>
      )}
      
      {!showPoints && (
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            ₹{player.price}
          </div>
          <div className="text-sm text-gray-500">
            {player.selectedBy}% selected
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;