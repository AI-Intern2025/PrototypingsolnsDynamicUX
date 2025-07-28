import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, TrendingDownIcon, ZapIcon, AlertTriangleIcon, InfoIcon, XIcon } from 'lucide-react';

interface RankChangeEvent {
  id: string;
  eventType: 'wicket' | 'boundary' | 'milestone' | 'over_end';
  playerName: string;
  playerTeam: string;
  eventDescription: string;
  pointsGained: number;
  oldRank: number;
  newRank: number;
  playersAffected: number;
  playerOwnership: number;
  playersWhoOvertook: number;
  timestamp: Date;
  isPositive: boolean;
}

interface ExplainableRankChangesProps {
  currentRank: number;
  previousRank: number;
  userPoints: number;
  onClose?: () => void;
}

const ExplainableRankChanges: React.FC<ExplainableRankChangesProps> = ({
  currentRank,
  previousRank,
  userPoints,
  onClose
}) => {
  const [recentEvents, setRecentEvents] = useState<RankChangeEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<RankChangeEvent | null>(null);

  useEffect(() => {
    // Simulate rank change events
    const mockEvents: RankChangeEvent[] = [
      {
        id: '1',
        eventType: 'wicket',
        playerName: 'A French',
        playerTeam: 'EN-U19',
        eventDescription: 'took a wicket (V Sooryavanshi caught)',
        pointsGained: 25,
        oldRank: 8836,
        newRank: 7245,
        playersAffected: 13456,
        playerOwnership: 85.7,
        playersWhoOvertook: 1591,
        timestamp: new Date(Date.now() - 120000),
        isPositive: true
      },
      {
        id: '2',
        eventType: 'boundary',
        playerName: 'T Rew',
        playerTeam: 'EN-U19',
        eventDescription: 'hit a boundary (4 runs)',
        pointsGained: 4,
        oldRank: 7245,
        newRank: 7180,
        playersAffected: 11234,
        playerOwnership: 72.4,
        playersWhoOvertook: 65,
        timestamp: new Date(Date.now() - 60000),
        isPositive: true
      },
      {
        id: '3',
        eventType: 'wicket',
        playerName: 'V Sooryavanshi',
        playerTeam: 'IN-U19',
        eventDescription: 'got out (caught by A French)',
        pointsGained: 0,
        oldRank: 7180,
        newRank: 8836,
        playersAffected: 14567,
        playerOwnership: 89.2,
        playersWhoOvertook: -1656,
        timestamp: new Date(Date.now() - 30000),
        isPositive: false
      }
    ];

    setRecentEvents(mockEvents);
  }, [currentRank, previousRank]);

  const getEventIcon = (eventType: string, isPositive: boolean) => {
    if (eventType === 'wicket') {
      return isPositive ? 
        <TrendingUpIcon className="w-5 h-5 text-green-500" /> : 
        <AlertTriangleIcon className="w-5 h-5 text-red-500" />;
    }
    if (eventType === 'boundary') {
      return <ZapIcon className="w-5 h-5 text-blue-500" />;
    }
    return <InfoIcon className="w-5 h-5 text-gray-500" />;
  };

  const getEventColor = (isPositive: boolean) => {
    return isPositive ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
  };

  const getRankChangeText = (event: RankChangeEvent) => {
    const rankDiff = Math.abs(event.newRank - event.oldRank);
    if (event.isPositive) {
      return `You moved up ${rankDiff} positions to rank #${event.newRank}`;
    } else {
      return `You dropped ${rankDiff} positions to rank #${event.newRank}`;
    }
  };

  const getOwnershipImpact = (event: RankChangeEvent) => {
    if (event.isPositive) {
      return `${event.playerOwnership}% of players had ${event.playerName}, giving you an advantage over ${(100 - event.playerOwnership).toFixed(1)}% who didn't`;
    } else {
      return `${event.playerOwnership}% of players were affected by this negative event, including you`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUpIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Rank Change Analysis</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Current Rank Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Current Rank</div>
            <div className="text-2xl font-bold text-gray-900">#{currentRank}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Rank Change</div>
            <div className={`text-lg font-bold flex items-center space-x-1 ${
              currentRank < previousRank ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentRank < previousRank ? (
                <>
                  <TrendingUpIcon className="w-4 h-4" />
                  <span>+{previousRank - currentRank}</span>
                </>
              ) : (
                <>
                  <TrendingDownIcon className="w-4 h-4" />
                  <span>-{currentRank - previousRank}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Recent Events Affecting Your Rank</h4>
        
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${getEventColor(event.isPositive)}`}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {getEventIcon(event.eventType, event.isPositive)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">
                    {event.playerName} {event.eventDescription}
                  </div>
                  <div className="text-xs text-gray-500">
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-2">
                  {getRankChangeText(event)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <div className="font-medium text-gray-700">Player Ownership</div>
                    <div className="text-gray-600">{event.playerOwnership}% had this player</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <div className="font-medium text-gray-700">Impact</div>
                    <div className="text-gray-600">
                      {event.isPositive ? 
                        `${event.playersWhoOvertook} players overtaken` : 
                        `${Math.abs(event.playersWhoOvertook)} players overtook you`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Event Impact Analysis</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${getEventColor(selectedEvent.isPositive)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {getEventIcon(selectedEvent.eventType, selectedEvent.isPositive)}
                  <span className="font-medium text-gray-900">
                    {selectedEvent.playerName} ({selectedEvent.playerTeam})
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  {selectedEvent.eventDescription}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">Points Gained</div>
                  <div className={`text-lg font-bold ${selectedEvent.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedEvent.isPositive ? '+' : ''}{selectedEvent.pointsGained}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">Rank Change</div>
                  <div className={`text-lg font-bold ${selectedEvent.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    #{selectedEvent.oldRank} → #{selectedEvent.newRank}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="font-medium text-gray-900 mb-2">Ownership Analysis</div>
                <div className="text-sm text-gray-700">
                  {getOwnershipImpact(selectedEvent)}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="font-medium text-gray-900 mb-2">Contest Impact</div>
                <div className="text-sm text-gray-700">
                  This event affected {selectedEvent.playersAffected.toLocaleString()} players in the contest.
                  {selectedEvent.isPositive ? 
                    ` You gained an advantage over ${selectedEvent.playersWhoOvertook.toLocaleString()} players who didn't have ${selectedEvent.playerName}.` :
                    ` ${Math.abs(selectedEvent.playersWhoOvertook).toLocaleString()} players without ${selectedEvent.playerName} overtook you.`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplainableRankChanges;