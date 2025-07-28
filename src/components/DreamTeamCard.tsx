import React from 'react';
import { DreamTeam } from '../types';
import { StarIcon, TrophyIcon, LocateIcon as UpdateIcon } from 'lucide-react';
import PlayerCard from './PlayerCard';

interface DreamTeamCardProps {
  dreamTeam: DreamTeam;
  userTeamPlayers: string[];
  onPlayerSelect?: (playerId: string) => void;
}

const DreamTeamCard: React.FC<DreamTeamCardProps> = ({
  dreamTeam,
  userTeamPlayers,
  onPlayerSelect
}) => {
  const getFormationCounts = () => {
    const counts = {
      'wicket-keeper': 0,
      'batsman': 0,
      'all-rounder': 0,
      'bowler': 0
    };
    
    dreamTeam.players.forEach(player => {
      counts[player.role]++;
    });
    
    return counts;
  };

  const formation = getFormationCounts();
  const userMatchedPlayers = dreamTeam.players.filter(p => userTeamPlayers.includes(p.id));
  const matchPercentage = (userMatchedPlayers.length / dreamTeam.players.length) * 100;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-900">Dream Team</span>
          <span className="text-sm text-gray-500">
            (updates as the match progresses)
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {dreamTeam.totalPoints} pts
          </div>
          <div className="text-sm text-gray-500">
            <UpdateIcon className="w-3 h-3 inline mr-1" />
            {dreamTeam.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Your team matches {userMatchedPlayers.length}/11 players
          </span>
          <span className="text-sm font-bold text-green-600">
            {matchPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${matchPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Formation:</div>
        <div className="flex space-x-4 text-sm">
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{formation['wicket-keeper']} WK</span>
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{formation.batsman} BAT</span>
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>{formation['all-rounder']} AR</span>
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>{formation.bowler} BWL</span>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {dreamTeam.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showPoints={true}
            isInDreamTeam={true}
            onSelect={() => onPlayerSelect?.(player.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DreamTeamCard;