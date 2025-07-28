import React, { useState } from 'react';
import { BarChart3Icon, PieChartIcon, TrendingUpIcon, UsersIcon, StarIcon, ShieldIcon } from 'lucide-react';

interface TeamComposition {
  indPlayers: number;
  engPlayers: number;
  count: number;
  percentage: number;
  avgRank: number;
  topRank: number;
}

interface PlayerPopularity {
  playerId: string;
  playerName: string;
  selectedBy: number;
  captainBy: number;
  viceCaptainBy: number;
  avgPoints: number;
  role: string;
  team: string;
}

interface TeamCompositionAnalyticsProps {
  totalTeams: number;
  userTeams?: any[];
}

const TeamCompositionAnalytics: React.FC<TeamCompositionAnalyticsProps> = ({ 
  totalTeams,
  userTeams = []
}) => {
  const [activeTab, setActiveTab] = useState<'composition' | 'players' | 'insights'>('composition');

  // Mock data for team compositions (in real app, this would come from API)
  const teamCompositions: TeamComposition[] = [
    { indPlayers: 8, engPlayers: 3, count: 4521, percentage: 29.6, avgRank: 3245, topRank: 1 },
    { indPlayers: 7, engPlayers: 4, count: 3892, percentage: 25.4, avgRank: 4123, topRank: 2 },
    { indPlayers: 9, engPlayers: 2, count: 2156, percentage: 14.1, avgRank: 5678, topRank: 15 },
    { indPlayers: 6, engPlayers: 5, count: 1987, percentage: 13.0, avgRank: 6234, topRank: 8 },
    { indPlayers: 10, engPlayers: 1, count: 1234, percentage: 8.1, avgRank: 7890, topRank: 45 },
    { indPlayers: 5, engPlayers: 6, count: 987, percentage: 6.5, avgRank: 8456, topRank: 23 },
    { indPlayers: 11, engPlayers: 0, count: 509, percentage: 3.3, avgRank: 9123, topRank: 156 }
  ];

  // Mock popular players data
  const popularPlayers: PlayerPopularity[] = [
    { playerId: 'player-1', playerName: 'V Sooryavanshi', selectedBy: 89.2, captainBy: 34.5, viceCaptainBy: 28.1, avgPoints: 42.3, role: 'Batsman', team: 'IN-U19' },
    { playerId: 'player-10', playerName: 'A French', selectedBy: 85.7, captainBy: 12.3, viceCaptainBy: 45.2, avgPoints: 58.1, role: 'Bowler', team: 'EN-U19' },
    { playerId: 'player-5', playerName: 'T Rew', selectedBy: 72.4, captainBy: 8.9, viceCaptainBy: 15.6, avgPoints: 28.7, role: 'WK', team: 'EN-U19' },
    { playerId: 'player-8', playerName: 'S Morgan', selectedBy: 68.3, captainBy: 15.7, viceCaptainBy: 12.4, avgPoints: 35.2, role: 'All-Rounder', team: 'EN-U19' },
    { playerId: 'player-2', playerName: 'A Mhatre', selectedBy: 45.1, captainBy: 5.2, viceCaptainBy: 8.9, avgPoints: 18.4, role: 'Batsman', team: 'IN-U19' }
  ];

  // Analyze user's teams
  const analyzeUserTeams = () => {
    if (!userTeams.length) return null;

    const playerCounts: { [key: string]: { total: number; captain: number; viceCaptain: number; name: string } } = {};
    
    userTeams.forEach(team => {
      team.players.forEach((player: any) => {
        if (!playerCounts[player.id]) {
          playerCounts[player.id] = { total: 0, captain: 0, viceCaptain: 0, name: player.name };
        }
        playerCounts[player.id].total++;
        if (team.captain === player.id) playerCounts[player.id].captain++;
        if (team.viceCaptain === player.id) playerCounts[player.id].viceCaptain++;
      });
    });

    return Object.entries(playerCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.total - a.total);
  };

  const userPlayerAnalysis = analyzeUserTeams();

  const getCompositionColor = (indPlayers: number) => {
    if (indPlayers >= 8) return 'bg-blue-500';
    if (indPlayers >= 6) return 'bg-green-500';
    return 'bg-orange-500';
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'batsman': return <BarChart3Icon className="w-4 h-4" />;
      case 'bowler': return <TrendingUpIcon className="w-4 h-4" />;
      case 'all-rounder': return <StarIcon className="w-4 h-4" />;
      case 'wk': return <ShieldIcon className="w-4 h-4" />;
      default: return <UsersIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <PieChartIcon className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Contest Analytics</h3>
        </div>
        <div className="text-sm text-gray-500">
          {totalTeams.toLocaleString()} teams analyzed
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'composition', label: 'Team Mix', icon: PieChartIcon },
          { id: 'players', label: 'Popular Picks', icon: StarIcon },
          { id: 'insights', label: 'Your Teams', icon: UsersIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Team Composition Analysis */}
      {activeTab === 'composition' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">Team Composition Breakdown</h4>
            <p className="text-sm text-gray-600">
              How players are distributing their picks between IND-U19 and EN-U19
            </p>
          </div>

          <div className="space-y-3">
            {teamCompositions.map((comp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getCompositionColor(comp.indPlayers)}`}></div>
                    <span className="font-medium text-gray-900">
                      {comp.indPlayers} IND - {comp.engPlayers} ENG
                    </span>
                    <span className="text-sm text-gray-500">
                      ({comp.percentage}% of teams)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {comp.count.toLocaleString()} teams
                    </div>
                    <div className="text-xs text-gray-500">
                      Best: #{comp.topRank}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${getCompositionColor(comp.indPlayers)}`}
                    style={{ width: `${comp.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Avg Rank: #{comp.avgRank.toLocaleString()}</span>
                  <span>Success Rate: {comp.topRank <= 100 ? 'High' : comp.topRank <= 1000 ? 'Medium' : 'Low'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Players Analysis */}
      {activeTab === 'players' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">Most Selected Players</h4>
            <p className="text-sm text-gray-600">
              Player popularity and captaincy choices across all teams
            </p>
          </div>

          <div className="space-y-3">
            {popularPlayers.map((player, index) => (
              <div key={player.playerId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {player.playerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{player.playerName}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {getRoleIcon(player.role)}
                        <span>{player.role} • {player.team}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{player.selectedBy}%</div>
                    <div className="text-xs text-gray-500">selected by</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-blue-600">{player.captainBy}%</div>
                    <div className="text-xs text-gray-600">Captain</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-purple-600">{player.viceCaptainBy}%</div>
                    <div className="text-xs text-gray-600">Vice Captain</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-green-600">{player.avgPoints}</div>
                    <div className="text-xs text-gray-600">Avg Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Team Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {userPlayerAnalysis && userPlayerAnalysis.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-2">Your Team Analysis</h4>
                <p className="text-sm text-gray-600">
                  Player distribution across your {userTeams.length} teams
                </p>
              </div>

              <div className="space-y-3">
                {userPlayerAnalysis.slice(0, 10).map((player, index) => (
                  <div key={player.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{player.name}</div>
                      <div className="text-sm text-gray-500">
                        In {player.total}/{userTeams.length} teams
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(player.total / userTeams.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-4 text-xs">
                        {player.captain > 0 && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            C: {player.captain}
                          </span>
                        )}
                        {player.viceCaptain > 0 && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            VC: {player.viceCaptain}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UsersIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No team data available for analysis</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamCompositionAnalytics;