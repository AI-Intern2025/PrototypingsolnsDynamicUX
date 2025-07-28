import React from 'react';
import { LiveUpdate } from '../types';
import { RadioIcon, TrendingUpIcon, AlertCircleIcon, ClockIcon } from 'lucide-react';

interface LiveUpdatesCardProps {
  updates: LiveUpdate[];
  onUpdateClick?: (update: LiveUpdate) => void;
}

const LiveUpdatesCard: React.FC<LiveUpdatesCardProps> = ({ updates, onUpdateClick }) => {
  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'boundary': return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'wicket': return <AlertCircleIcon className="w-4 h-4 text-red-500" />;
      case 'milestone': return <TrendingUpIcon className="w-4 h-4 text-blue-500" />;
      default: return <RadioIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUpdateBgColor = (type: string) => {
    switch (type) {
      case 'boundary': return 'bg-green-50 border-green-200';
      case 'wicket': return 'bg-red-50 border-red-200';
      case 'milestone': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <RadioIcon className="w-4 h-4 text-red-500" />
          <span>Live Updates</span>
        </h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {updates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ClockIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Waiting for live updates...</p>
          </div>
        ) : (
          <div className="space-y-1">
            {updates.map((update) => (
              <div
                key={update.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getUpdateBgColor(update.type)}`}
                onClick={() => onUpdateClick?.(update)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{update.message}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {update.timestamp.toLocaleTimeString()}
                    </div>
                    {update.pointsAffected.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {update.pointsAffected.map((effect, index) => (
                          <div key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Player affected: +{effect.points} pts
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveUpdatesCard;