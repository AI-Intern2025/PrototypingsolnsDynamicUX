export interface Player {
  id: string;
  name: string;
  role: 'wicket-keeper' | 'batsman' | 'all-rounder' | 'bowler';
  team: string;
  points: number;
  avatar?: string;
  isPlaying: boolean;
  price: number;
  selectedBy: number;
  recentPerformance: number[];
}

export interface Contest {
  id: string;
  name: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  filledSpots: number;
  isLive: boolean;
  winnerPayouts: number[];
  startTime: Date;
  endTime: Date;
}

export interface UserTeam {
  id: string;
  name: string;
  players: Player[];
  captain: string;
  viceCaptain: string;
  totalPoints: number;
  rank: number;
  contestId: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  team1Score: string;
  team2Score: string;
  status: 'live' | 'upcoming' | 'completed';
  currentOver: number;
  currentBall: number;
  lastUpdate: string;
  isLive: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  teamName: string;
  points: number;
  rank: number;
  rankChange: number;
  avatar?: string;
  isCurrentUser: boolean;
}

export interface LiveUpdate {
  id: string;
  type: 'boundary' | 'wicket' | 'milestone' | 'over-end';
  message: string;
  pointsAffected: { playerId: string; points: number }[];
  timestamp: Date;
}

export interface DreamTeam {
  players: Player[];
  totalPoints: number;
  lastUpdated: Date;
}