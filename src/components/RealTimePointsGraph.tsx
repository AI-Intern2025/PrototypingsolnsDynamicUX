import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, ZapIcon, TargetIcon, InfoIcon } from 'lucide-react';

interface PointsDataPoint {
  time: string;
  userPoints: number;
  leaderPoints: number;
  event?: string;
  rankChange?: number;
  explanation?: string;
}

interface RealTimePointsGraphProps {
  userPoints: number;
  leaderPoints: number;
  teamName: string;
}

const RealTimePointsGraph: React.FC<RealTimePointsGraphProps> = ({
  userPoints,
  leaderPoints,
  teamName
}) => {
  const [pointsHistory, setPointsHistory] = useState<PointsDataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PointsDataPoint | null>(null);
  const [baseUserPoints] = useState(userPoints);
  const [baseLeaderPoints] = useState(leaderPoints);

  useEffect(() => {
    // Simulate dynamic point changes for user's team
    const pointsVariation = Math.sin(Date.now() / 10000) * 20 + Math.random() * 10 - 5;
    const leaderVariation = Math.sin(Date.now() / 8000) * 15 + Math.random() * 8 - 4;
    
    const newDataPoint: PointsDataPoint = {
      time: new Date().toLocaleTimeString(),
      userPoints: Math.max(0, baseUserPoints + pointsVariation),
      leaderPoints: Math.max(0, baseLeaderPoints + leaderVariation),
      event: Math.random() > 0.7 ? 'Wicket taken!' : undefined,
      rankChange: Math.random() > 0.5 ? Math.floor(Math.random() * 100) - 50 : undefined,
      explanation: Math.random() > 0.7 ? 'A French took a wicket - 85% players had him, 1,234 overtook you!' : undefined
    };

    setPointsHistory(prev => [...prev.slice(-20), newDataPoint]);
  }, [baseUserPoints, baseLeaderPoints]);

  // Update points history every 3 seconds for dynamic tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const pointsVariation = Math.sin(Date.now() / 10000) * 20 + Math.random() * 10 - 5;
      const leaderVariation = Math.sin(Date.now() / 8000) * 15 + Math.random() * 8 - 4;
      
      const newDataPoint: PointsDataPoint = {
        time: new Date().toLocaleTimeString(),
        userPoints: Math.max(0, baseUserPoints + pointsVariation),
        leaderPoints: Math.max(0, baseLeaderPoints + leaderVariation),
        event: Math.random() > 0.8 ? ['Boundary scored!', 'Wicket taken!', 'Milestone reached!'][Math.floor(Math.random() * 3)] : undefined,
        rankChange: Math.random() > 0.6 ? Math.floor(Math.random() * 20) - 10 : undefined,
        explanation: Math.random() > 0.8 ? 'Live event affected your ranking!' : undefined
      };

      setPointsHistory(prev => [...prev.slice(-19), newDataPoint]);
    }, 3000);

    return () => clearInterval(interval);
  }, [baseUserPoints, baseLeaderPoints]);

  const maxPoints = Math.max(...pointsHistory.map(p => Math.max(p.userPoints, p.leaderPoints)), 100);
  const minPoints = Math.min(...pointsHistory.map(p => Math.min(p.userPoints, p.leaderPoints)), 0);
  const pointsRange = maxPoints - minPoints;

  const getYPosition = (points: number) => {
    return 200 - ((points - minPoints) / pointsRange) * 180;
  };

  const createPath = (points: number[]) => {
    if (points.length < 2) return '';
    
    const pathData = points.map((point, index) => {
      const x = (index / (points.length - 1)) * 300;
      const y = getYPosition(point);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  };

  const userPath = createPath(pointsHistory.map(p => p.userPoints));
  const leaderPath = createPath(pointsHistory.map(p => p.leaderPoints));

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUpIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Live Points Tracking</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{teamName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Leader</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height="220" viewBox="0 0 320 220" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="300" height="200" fill="url(#grid)" />
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const points = minPoints + (pointsRange * ratio);
            const y = 200 - (ratio * 180);
            return (
              <g key={index}>
                <line x1="0" y1={y} x2="300" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x="-5" y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
                  {Math.round(points)}
                </text>
              </g>
            );
          })}

          {/* Leader line */}
          {leaderPath && (
            <path
              d={leaderPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* User line */}
          {userPath && (
            <path
              d={userPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {pointsHistory.map((point, index) => {
            const x = (index / (pointsHistory.length - 1)) * 300;
            const userY = getYPosition(point.userPoints);
            const leaderY = getYPosition(point.leaderPoints);
            
            return (
              <g key={index}>
                {/* Leader point */}
                <circle
                  cx={x}
                  cy={leaderY}
                  r="4"
                  fill="#ef4444"
                  className="cursor-pointer hover:r-6 transition-all"
                  onClick={() => setSelectedPoint(point)}
                />
                
                {/* User point */}
                <circle
                  cx={x}
                  cy={userY}
                  r="4"
                  fill="#3b82f6"
                  className="cursor-pointer hover:r-6 transition-all"
                  onClick={() => setSelectedPoint(point)}
                />

                {/* Event marker */}
                {point.event && (
                  <g>
                    <circle cx={x} cy={userY - 15} r="6" fill="#fbbf24" />
                    <ZapIcon className="w-3 h-3" x={x - 6} y={userY - 21} fill="white" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {selectedPoint && (
          <div className="absolute top-4 right-4 bg-gray-900 text-white p-3 rounded-lg shadow-lg z-10">
            <div className="text-sm font-medium">{selectedPoint.time}</div>
            <div className="text-xs text-blue-300">Your Team: {selectedPoint.userPoints} pts</div>
            <div className="text-xs text-red-300">Leader: {selectedPoint.leaderPoints} pts</div>
            {selectedPoint.event && (
              <div className="text-xs text-yellow-300 mt-1">{selectedPoint.event}</div>
            )}
            {selectedPoint.explanation && (
              <div className="text-xs text-blue-300 mt-1 flex items-center space-x-1">
                <InfoIcon className="w-3 h-3" />
                <span>{selectedPoint.explanation}</span>
              </div>
            )}
            <button
              onClick={() => setSelectedPoint(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 rounded-full text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{userPoints}</div>
          <div className="text-sm text-gray-600">Your Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{leaderPoints}</div>
          <div className="text-sm text-gray-600">Leader Points</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            userPoints >= leaderPoints ? 'text-green-600' : 'text-red-600'
          }`}>
            {userPoints >= leaderPoints ? '+' : ''}{userPoints - leaderPoints}
          </div>
          <div className="text-sm text-gray-600">Difference</div>
        </div>
      </div>
    </div>
  );
};

export default RealTimePointsGraph;