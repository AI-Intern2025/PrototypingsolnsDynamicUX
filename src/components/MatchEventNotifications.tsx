import React, { useState, useEffect } from 'react';
import { BellIcon, XIcon, TrendingUpIcon, TrendingDownIcon, ZapIcon, AlertTriangleIcon } from 'lucide-react';

interface MatchEvent {
  id: string;
  type: 'wicket' | 'boundary' | 'milestone' | 'rank_change' | 'player_performance';
  title: string;
  message: string;
  impact: 'positive' | 'negative' | 'neutral';
  pointsChange: number;
  timestamp: Date;
  playerName?: string;
  isRead: boolean;
}

interface MatchEventNotificationsProps {
  events: MatchEvent[];
  onEventRead: (eventId: string) => void;
  onEventDismiss: (eventId: string) => void;
}

const MatchEventNotifications: React.FC<MatchEventNotificationsProps> = ({
  events,
  onEventRead,
  onEventDismiss
}) => {
  const [activeNotification, setActiveNotification] = useState<MatchEvent | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<MatchEvent[]>([]);

  useEffect(() => {
    const unreadEvents = events.filter(event => !event.isRead);
    if (unreadEvents.length > 0 && !activeNotification) {
      const nextEvent = unreadEvents[0];
      setActiveNotification(nextEvent);
      onEventRead(nextEvent.id);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setActiveNotification(null);
      }, 5000);
    }
  }, [events, activeNotification, onEventRead]);

  const getEventIcon = (type: string, impact: string) => {
    switch (type) {
      case 'wicket':
        return <AlertTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'boundary':
        return <ZapIcon className="w-5 h-5 text-green-500" />;
      case 'rank_change':
        return impact === 'positive' ? 
          <TrendingUpIcon className="w-5 h-5 text-green-500" /> : 
          <TrendingDownIcon className="w-5 h-5 text-red-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getEventColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-500 bg-green-50';
      case 'negative':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const dismissNotification = () => {
    if (activeNotification) {
      onEventDismiss(activeNotification.id);
      setActiveNotification(null);
    }
  };

  return (
    <>
      {/* Active Notification Popup */}
      {activeNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`max-w-sm rounded-lg shadow-lg border-l-4 p-4 ${getEventColor(activeNotification.impact)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getEventIcon(activeNotification.type, activeNotification.impact)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {activeNotification.title}
                  </h4>
                  <p className="text-gray-700 text-sm mt-1">
                    {activeNotification.message}
                  </p>
                  {activeNotification.pointsChange !== 0 && (
                    <div className={`text-sm font-medium mt-2 ${
                      activeNotification.pointsChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activeNotification.pointsChange > 0 ? '+' : ''}{activeNotification.pointsChange} points
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {activeNotification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <button
                onClick={dismissNotification}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification History Panel */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BellIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Match Events</h3>
          </div>
          <div className="text-sm text-gray-500">
            {events.filter(e => !e.isRead).length} unread
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No events yet. Match events will appear here.</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  event.isRead ? 'bg-gray-50 border-gray-200' : getEventColor(event.impact)
                }`}
                onClick={() => onEventRead(event.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getEventIcon(event.type, event.impact)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium text-sm ${
                        event.isRead ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${
                      event.isRead ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {event.message}
                    </p>
                    {event.pointsChange !== 0 && (
                      <div className={`text-sm font-medium mt-1 ${
                        event.pointsChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {event.pointsChange > 0 ? '+' : ''}{event.pointsChange} points
                      </div>
                    )}
                    {event.playerName && (
                      <div className="text-xs text-gray-500 mt-1">
                        Player: {event.playerName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MatchEventNotifications;