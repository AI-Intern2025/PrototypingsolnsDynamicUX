import { useState, useEffect, useRef } from 'react';
import { LeaderboardEntry, LiveUpdate, Match, DreamTeam } from '../types';

export interface RealTimeData {
  leaderboard: LeaderboardEntry[];
  liveUpdates: LiveUpdate[];
  match: Match;
  dreamTeam: DreamTeam;
  lastUpdated: Date;
}

export const useRealTimeData = (contestId: string) => {
  const [data, setData] = useState<RealTimeData>({
    leaderboard: [],
    liveUpdates: [],
    match: {
      id: 'match-1',
      team1: 'IN-U19',
      team2: 'EN-U19',
      team1Score: '27-2',
      team2Score: 'Yet to bat',
      status: 'live',
      currentOver: 5,
      currentBall: 2,
      lastUpdate: 'IN-U19 won the toss and elected to bat',
      isLive: true
    },
    dreamTeam: {
      players: [],
      totalPoints: 152.5,
      lastUpdated: new Date()
    },
    lastUpdated: new Date()
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Simulate real-time data updates
    const generateMockData = () => {
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          id: '1',
          username: 'DHRUV TEJA',
          teamName: 'T1',
          points: 106 + Math.floor(Math.random() * 50),
          rank: 8836,
          rankChange: Math.floor(Math.random() * 21) - 10,
          isCurrentUser: true
        },
        {
          id: '2',
          username: 'Lalit sutihar',
          teamName: 'T2',
          points: 156.5 + Math.floor(Math.random() * 30),
          rank: 1,
          rankChange: 0,
          isCurrentUser: false
        },
        {
          id: '3',
          username: 'ARUN HURRY',
          teamName: 'T1',
          points: 156.5 + Math.floor(Math.random() * 25),
          rank: 1,
          rankChange: 2,
          isCurrentUser: false
        },
        {
          id: '4',
          username: 'NZSVYJ 52',
          teamName: 'T1',
          points: 156.5 + Math.floor(Math.random() * 20),
          rank: 1,
          rankChange: -1,
          isCurrentUser: false
        },
        {
          id: '5',
          username: 'RANJANE GIRI',
          teamName: 'T1',
          points: 156.5 + Math.floor(Math.random() * 15),
          rank: 1,
          rankChange: 1,
          isCurrentUser: false
        }
      ];

      const mockUpdates: LiveUpdate[] = [
        {
          id: Date.now().toString(),
          type: 'boundary',
          message: 'V Sooryavanshi hits a boundary! 4 runs scored.',
          pointsAffected: [{ playerId: 'player-1', points: 4 }],
          timestamp: new Date()
        }
      ];

      return {
        leaderboard: mockLeaderboard,
        liveUpdates: mockUpdates,
        match: {
          id: 'match-1',
          team1: 'IN-U19',
          team2: 'EN-U19',
          team1Score: `${27 + Math.floor(Math.random() * 50)}-${2 + Math.floor(Math.random() * 3)}`,
          team2Score: 'Yet to bat',
          status: 'live' as const,
          currentOver: 5 + Math.floor(Math.random() * 10),
          currentBall: Math.floor(Math.random() * 6),
          lastUpdate: 'IN-U19 won the toss and elected to bat',
          isLive: true
        },
        dreamTeam: {
          players: [],
          totalPoints: 152.5 + Math.floor(Math.random() * 50),
          lastUpdated: new Date()
        },
        lastUpdated: new Date()
      };
    };

    // Initial data load
    setData(generateMockData());

    // Start real-time updates
    intervalRef.current = setInterval(() => {
      setData(generateMockData());
    }, 5000); // Update every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contestId]);

  return data;
};