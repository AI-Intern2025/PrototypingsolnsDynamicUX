import React from 'react';
import { TrophyIcon, StarIcon, TrendingUpIcon, GiftIcon, CrownIcon, TargetIcon } from 'lucide-react';
import { UserTeam, Contest } from '../types';

interface EndMatchSummaryProps {
  userTeam: UserTeam;
  contest: Contest;
  finalRank: number;
  totalPoints: number;
  winnerPoints: number;
  pointsDifference: number;
  winnings: number;
  keyEvents: Array<{
    event: string;
    impact: string;
    points: number;
  }>;
  onClose?: () => void;
}

const EndMatchSummary: React.FC<EndMatchSummaryProps> = ({
  userTeam,
  contest,
  finalRank,
  totalPoints,
  winnerPoints,
  pointsDifference,
  winnings,
  keyEvents,
  onClose
}) => {
  const getRankTier = (rank: number) => {
    if (rank === 1) return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: CrownIcon, tier: 'Champion' };
    if (rank <= 3) return { color: 'text-orange-600', bg: 'bg-orange-50', icon: TrophyIcon, tier: 'Podium' };
    if (rank <= 10) return { color: 'text-blue-600', bg: 'bg-blue-50', icon: StarIcon, tier: 'Top 10' };
    if (rank <= 100) return { color: 'text-green-600', bg: 'bg-green-50', icon: TrendingUpIcon, tier: 'Top 100' };
    return { color: 'text-gray-600', bg: 'bg-gray-50', icon: TargetIcon, tier: 'Participant' };
  };

  const rankTier = getRankTier(finalRank);
  const RankIcon = rankTier.icon;
  const performancePercentage = (totalPoints / winnerPoints) * 100;

  const topPerformer = userTeam.players.reduce((top, player) => 
    player.points > top.points ? player : top
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${rankTier.bg} p-6 rounded-t-2xl border-b`}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full ${rankTier.bg} border-4 border-white shadow-lg flex items-center justify-center`}>
                <RankIcon className={`w-8 h-8 ${rankTier.color}`} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Complete!</h2>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${rankTier.bg} ${rankTier.color} font-semibold`}>
              <span>Rank #{finalRank}</span>
              <span>•</span>
              <span>{rankTier.tier}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Your Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">₹{winnings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Winnings</div>
            </div>
          </div>

          {/* Performance vs Winner */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">Performance vs Winner</span>
              <span className="text-sm text-gray-600">{performancePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(performancePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>You: {totalPoints} pts</span>
              <span>Winner: {winnerPoints} pts</span>
            </div>
            <div className="text-center mt-2">
              <span className={`font-medium ${pointsDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {pointsDifference > 0 ? `${pointsDifference} points behind` : `${Math.abs(pointsDifference)} points ahead`}
              </span>
            </div>
          </div>

          {/* Top Performer */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-3">
              <StarIcon className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">Your Top Performer</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 font-medium">
                    {topPerformer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{topPerformer.name}</div>
                  <div className="text-sm text-gray-600">{topPerformer.role} • {topPerformer.team}</div>
                  {userTeam.captain === topPerformer.id && (
                    <div className="text-xs text-yellow-600 font-medium">Captain (2x points)</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">{topPerformer.points} pts</div>
                <div className="text-sm text-gray-500">
                  {((topPerformer.points / totalPoints) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Key Events */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Performance Moments</h3>
            <div className="space-y-2">
              {keyEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{event.event}</div>
                    <div className="text-sm text-gray-600">{event.impact}</div>
                  </div>
                  <div className={`font-bold ${event.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {event.points > 0 ? '+' : ''}{event.points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prize Breakdown */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <GiftIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">Prize Information</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Rank:</span>
                <span className="font-medium">#{finalRank} of {contest.filledSpots.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prize Pool:</span>
                <span className="font-medium">₹{contest.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="text-gray-900">Your Winnings:</span>
                <span className="text-green-600">₹{winnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              View Detailed Scorecard
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndMatchSummary;