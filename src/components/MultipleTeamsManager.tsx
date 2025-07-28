import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon, TrophyIcon, StarIcon } from 'lucide-react';
import { UserTeam } from '../types';

interface MultipleTeamsManagerProps {
  teams: UserTeam[];
  leaderPoints: number;
  onTeamSelect: (teamId: string) => void;
  selectedTeamId: string;
}

const MultipleTeamsManager: React.FC<MultipleTeamsManagerProps> = ({
  teams,
  leaderPoints,
  onTeamSelect,
  selectedTeamId
}) => {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  const nextTeam = () => {
    const nextIndex = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextIndex);
    onTeamSelect(teams[nextIndex].id);
  };

  const prevTeam = () => {
    const prevIndex = currentTeamIndex === 0 ? teams.length - 1 : currentTeamIndex - 1;
    setCurrentTeamIndex(prevIndex);
    onTeamSelect(teams[prevIndex].id);
  };

  const currentTeam = teams[currentTeamIndex];
  const pointsDifference = leaderPoints - currentTeam.totalPoints;
  const performancePercentage = (currentTeam.totalPoints / leaderPoints) * 100;

  // Find best performing team
  const bestTeam = teams.reduce((best, team) => 
    team.totalPoints > best.totalPoints ? team : best
  );

  // Find worst performing team
  const worstTeam = teams.reduce((worst, team) => 
    team.totalPoints < worst.totalPoints ? team : worst
  );

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-yellow-600 bg-yellow-50';
    if (rank <= 10) return 'text-orange-600 bg-orange-50';
    if (rank <= 100) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTopPerformer = () => {
    return currentTeam.players.reduce((top, player) => 
      player.points > top.points ? player : top
    );
  };

  const topPerformer = getTopPerformer();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-900">Your Teams ({teams.length})</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTeam}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={teams.length <= 1}
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm text-gray-500">
            {currentTeamIndex + 1} of {teams.length}
          </span>
          <button
            onClick={nextTeam}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={teams.length <= 1}
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Team Performance Summary */}
      {teams.length > 1 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3">Team Performance Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <TrophyIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Best Performer</span>
              </div>
              <div className="font-bold text-green-600">{bestTeam.name}</div>
              <div className="text-sm text-gray-600">{bestTeam.totalPoints} pts • Rank #{bestTeam.rank}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <div className="flex items-center space-x-2 mb-1">
                <StarIcon className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Needs Improvement</span>
              </div>
              <div className="font-bold text-orange-600">{worstTeam.name}</div>
              <div className="text-sm text-gray-600">{worstTeam.totalPoints} pts • Rank #{worstTeam.rank}</div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {/* Team Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div>
            <h4 className="font-bold text-lg text-gray-900">{currentTeam.name}</h4>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-2xl font-bold text-green-600">{currentTeam.totalPoints} pts</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRankColor(currentTeam.rank)}`}>
                Rank #{currentTeam.rank}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">vs Leader</div>
            <div className={`font-bold ${pointsDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {pointsDifference > 0 ? `-${pointsDifference}` : `+${Math.abs(pointsDifference)}`}
            </div>
          </div>
        </div>

        {/* Performance Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Performance vs Leader</span>
            <span className="text-sm text-gray-600">{performancePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${Math.min(performancePercentage, 100)}%` }}
            >
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <StarIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Top Performer</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900">{topPerformer.name}</div>
              <div className="text-sm text-gray-600">{topPerformer.role} • {topPerformer.team}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-yellow-600">{topPerformer.points} pts</div>
              <div className="text-sm text-gray-500">
                {((topPerformer.points / currentTeam.totalPoints) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>

        {/* Quick Team Selector */}
        <div className="grid grid-cols-3 gap-2">
          {teams.map((team, index) => (
            <button
              key={team.id}
              onClick={() => {
                setCurrentTeamIndex(index);
                onTeamSelect(team.id);
              }}
              className={`p-3 rounded-lg border transition-all ${
                team.id === selectedTeamId
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-sm">{team.name}</div>
              <div className="text-xs">{team.totalPoints} pts</div>
              <div className="text-xs">#{team.rank}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleTeamsManager;