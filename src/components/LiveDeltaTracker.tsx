import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, TrendingDownIcon, ZapIcon, AlertTriangleIcon, CrownIcon, ShieldIcon } from 'lucide-react';

interface DeltaEvent {
  id: string;
  event: string;
  pointsChange: number;
  rankChange: number;
  player: string;
  playerRole: 'C' | 'VC' | 'Regular';
  timestamp: Date;
  isPositive: boolean;
}

interface LiveDeltaTrackerProps {
  teamName: string;
}

const LiveDeltaTracker: React.FC<LiveDeltaTrackerProps> = ({ teamName }) => {
  const [deltaEvents, setDeltaEvents] = useState<DeltaEvent[]>([]);

  useEffect(() => {
    // Generate initial events
    const initialEvents: DeltaEvent[] = [
      {
        id: '1',
        event: 'V Sooryavanshi scores boundary',
        pointsChange: 4,
        rankChange: 1,
        player: 'V Sooryavanshi',
        playerRole: 'C',
        timestamp: new Date(Date.now() - 30000),
        isPositive: true
      },
      {
        id: '2',
        event: 'A French takes wicket',
        pointsChange: 25,
        rankChange: 12,
        player: 'A French',
        playerRole: 'Regular',
        timestamp: new Date(Date.now() - 60000),
        isPositive: true
      },
      {
        id: '3',
        event: 'T Rew gets out',
        pointsChange: 0,
        rankChange: -4,
        player: 'T Rew',
        playerRole: 'VC',
        timestamp: new Date(Date.now() - 90000),
        isPositive: false
      }
    ];

    setDeltaEvents(initialEvents);

    // Generate new events every 5 seconds
    const interval = setInterval(() => {
      const players = [
        { name: 'V Sooryavanshi', role: 'C' as const },
        { name: 'A French', role: 'Regular' as const },
        { name: 'T Rew', role: 'VC' as const },
        { name: 'S Morgan', role: 'Regular' as const },
        { name: 'B Mayes', role: 'Regular' as const }
      ];

      const events = [
        'scores boundary', 'takes wicket', 'hits six', 'gets out', 'completes fifty',
        'takes catch', 'runs out opponent', 'bowls maiden', 'scores single', 'hits double'
      ];

      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      const isPositive = !['gets out', 'drops catch'].some(neg => randomEvent.includes(neg));
      const pointsChange = isPositive ? 
        Math.floor(Math.random() * 30) + 1 : 
        0;
      const rankChange = isPositive ? 
        Math.floor(Math.random() * 15) + 1 : 
        -(Math.floor(Math.random() * 8) + 1);

      const newEvent: DeltaEvent = {
        id: Date.now().toString(),
        event: `${randomPlayer.name} ${randomEvent}`,
        pointsChange: randomPlayer.role === 'C' ? pointsChange * 2 : pointsChange,
        rankChange,
        player: randomPlayer.name,
        playerRole: randomPlayer.role,
        timestamp: new Date(),
        isPositive
      };

      setDeltaEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'C': return <CrownIcon className="w-4 h-4 text-yellow-500" />;
      case 'VC': return <ShieldIcon className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getRoleMultiplier = (role: string) => {
    switch (role) {
      case 'C': return '(2x)';
      case 'VC': return '(1.5x)';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ZapIcon className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-900">Live Delta Tracker</h3>
        </div>
        <div className="text-sm text-gray-500">
          Updates every 5s • {teamName}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {deltaEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ZapIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Waiting for live events...</p>
          </div>
        ) : (
          deltaEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                event.isPositive 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    event.isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{event.event}</span>
                  {getRoleIcon(event.playerRole)}
                </div>
                <div className="text-xs text-gray-500">
                  {event.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    event.pointsChange > 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {event.pointsChange > 0 ? '+' : ''}{event.pointsChange} pts
                  </div>
                  <div className="text-xs text-gray-500">Points Change</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-lg font-bold flex items-center justify-center space-x-1 ${
                    event.rankChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {event.rankChange > 0 ? (
                      <TrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4" />
                    )}
                    <span>{Math.abs(event.rankChange)}</span>
                  </div>
                  <div className="text-xs text-gray-500">Rank Change</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 flex items-center justify-center space-x-1">
                    <span>{event.player.split(' ')[0]}</span>
                    {event.playerRole !== 'Regular' && (
                      <span className="text-xs text-gray-500">
                        {getRoleMultiplier(event.playerRole)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Player</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Positive Impact</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Negative Impact</span>
            </div>
          </div>
          <div className="text-gray-500">
            Live trading feed style
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDeltaTracker;