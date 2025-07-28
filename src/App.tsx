import React, { useState } from 'react';
import { ArrowLeftIcon, MoreVerticalIcon, HomeIcon, UsersIcon, TrophyIcon, UserIcon } from 'lucide-react';
import LiveMatchCard from './components/LiveMatchCard';
import TabNavigation, { TabType } from './components/TabNavigation';
import LeaderboardCard from './components/LeaderboardCard';
import WinningsCard from './components/WinningsCard';
import DreamTeamCard from './components/DreamTeamCard';
import LiveUpdatesCard from './components/LiveUpdatesCard';
import RelativePointsDisplay from './components/RelativePointsDisplay';
import MultipleTeamsManager from './components/MultipleTeamsManager';
import RealTimePointsGraph from './components/RealTimePointsGraph';
import MatchEventNotifications from './components/MatchEventNotifications';
import EndMatchSummary from './components/EndMatchSummary';
import TeamCompositionAnalytics from './components/TeamCompositionAnalytics';
import ExplainableRankChanges from './components/ExplainableRankChanges';
import LiveDeltaTracker from './components/LiveDeltaTracker';
import MiniGamesHub from './components/MiniGamesHub';
import { useRealTimeData } from './hooks/useRealTimeData';
import { useMatchEvents } from './hooks/useMatchEvents';
import { mockContest, mockUserTeam, mockPlayers } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard');
  const [selectedTeamId, setSelectedTeamId] = useState(mockUserTeam.id);
  const [showEndSummary, setShowEndSummary] = useState(false);
  const [showRankExplanation, setShowRankExplanation] = useState(false);
  const [miniGameEarnings, setMiniGameEarnings] = useState(0);
  const realTimeData = useRealTimeData('contest-1');
  const { events, markEventAsRead, dismissEvent } = useMatchEvents('contest-1');

  // Mock multiple teams for demonstration
  const mockTeams = [
    mockUserTeam,
    {
      ...mockUserTeam,
      id: 'team-2',
      name: 'T2',
      totalPoints: 89,
      rank: 12450
    },
    {
      ...mockUserTeam,
      id: 'team-3',
      name: 'T3',
      totalPoints: 134,
      rank: 3200
    }
  ];

  const currentTeam = mockTeams.find(team => team.id === selectedTeamId) || mockUserTeam;
  const leaderPoints = realTimeData.leaderboard[0]?.points || 156;
  const pointsDifference = leaderPoints - currentTeam.totalPoints;

  const handleMiniGameReward = (amount: number, type: string) => {
    setMiniGameEarnings(prev => prev + amount);
    // You could add a toast notification here
    console.log(`Earned ₹${amount} from ${type}!`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'winnings':
        return (
          <div className="space-y-4">
            <RelativePointsDisplay
              userPoints={currentTeam.totalPoints}
              leaderPoints={leaderPoints}
              userRank={currentTeam.rank}
              totalParticipants={mockContest.filledSpots}
              pointsDifference={pointsDifference}
              isImproving={Math.random() > 0.5}
            />
            <WinningsCard
              contest={mockContest}
              userTeam={currentTeam}
              potentialWinning={1500}
            />
            <MultipleTeamsManager
              teams={mockTeams}
              leaderPoints={leaderPoints}
              onTeamSelect={setSelectedTeamId}
              selectedTeamId={selectedTeamId}
            />
            <DreamTeamCard
              dreamTeam={realTimeData.dreamTeam}
              userTeamPlayers={currentTeam.players.map(p => p.id)}
            />
          </div>
        );
      case 'leaderboard':
        return (
          <div className="space-y-4">
            <RealTimePointsGraph
              userPoints={currentTeam.totalPoints}
              leaderPoints={leaderPoints}
              teamName={currentTeam.name}
            />
            <LiveDeltaTracker teamName={currentTeam.name} />
            <MiniGamesHub onRewardEarned={handleMiniGameReward} />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRankExplanation(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Why did my rank change?
              </button>
            </div>
            <TeamCompositionAnalytics 
              totalTeams={mockContest.filledSpots}
              userTeams={mockTeams}
            />
            <LeaderboardCard
              entries={realTimeData.leaderboard}
              totalEntries={mockContest.filledSpots}
              lastUpdated={realTimeData.lastUpdated}
            />
          </div>
        );
      case 'scorecard':
        return (
          <div className="space-y-4">
            <LiveMatchCard match={realTimeData.match} />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Your Team Performance</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentTeam.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.role}</div>
                      </div>
                      {player.id === currentTeam.captain && (
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">C</span>
                        </div>
                      )}
                      {player.id === currentTeam.viceCaptain && (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VC</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{player.points} pts</div>
                      <div className="text-sm text-gray-500">{player.team}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'commentary':
        return (
          <div className="space-y-4">
            <LiveMatchCard match={realTimeData.match} />
            <MatchEventNotifications
              events={events}
              onEventRead={markEventAsRead}
              onEventDismiss={dismissEvent}
            />
            <LiveUpdatesCard
              updates={realTimeData.liveUpdates}
              onUpdateClick={(update) => console.log('Update clicked:', update)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <ArrowLeftIcon className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">{mockContest.name}</h1>
              <p className="text-green-100 text-sm">Entry ₹{mockContest.entryFee}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowEndSummary(true)}
              className="text-sm bg-green-500 hover:bg-green-400 px-3 py-1 rounded-full transition-colors flex items-center space-x-1"
            >
              <span>End Summary</span>
            </button>
            {miniGameEarnings > 0 && (
              <div className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <span>₹{miniGameEarnings} earned</span>
              </div>
            )}
            <button className="text-sm bg-purple-500 hover:bg-purple-400 px-3 py-1 rounded-full transition-colors">
              Mini Games
            </button>
            <MoreVerticalIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="p-4">
        <LiveMatchCard match={realTimeData.match} />
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-4">
        {renderTabContent()}
      </div>

      {/* End Match Summary Modal */}
      {showEndSummary && (
        <EndMatchSummary
          userTeam={currentTeam}
          contest={mockContest}
          finalRank={currentTeam.rank}
          totalPoints={currentTeam.totalPoints}
          winnerPoints={leaderPoints}
          pointsDifference={pointsDifference}
          winnings={currentTeam.rank <= 10 ? 1500 : 0}
          keyEvents={[
            { event: 'Captain Choice', impact: 'V Sooryavanshi as captain gave you 2x points', points: 40 },
            { event: 'Wicket Bonus', impact: 'A French took 3 wickets', points: 75 },
            { event: 'Boundary Points', impact: 'Multiple boundaries scored', points: 24 }
          ]}
          onClose={() => setShowEndSummary(false)}
        />
      )}

      {/* Rank Change Explanation Modal */}
      {showRankExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ExplainableRankChanges
              currentRank={currentTeam.rank}
              previousRank={currentTeam.rank + 150}
              userPoints={currentTeam.totalPoints}
              onClose={() => setShowRankExplanation(false)}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex">
          <button className="flex-1 py-3 px-4 text-center">
            <HomeIcon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button className="flex-1 py-3 px-4 text-center">
            <UsersIcon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">Contests</span>
          </button>
          <button className="flex-1 py-3 px-4 text-center">
            <TrophyIcon className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <span className="text-xs text-green-600">My Contests</span>
          </button>
          <button className="flex-1 py-3 px-4 text-center">
            <UserIcon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;