import { Player, Contest, UserTeam } from '../types';

export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'V Sooryavanshi',
    role: 'batsman',
    team: 'IN-U19',
    points: 40.5,
    isPlaying: true,
    price: 9.5,
    selectedBy: 65,
    recentPerformance: [25, 40, 52, 40]
  },
  {
    id: 'player-2',
    name: 'A Mhatre',
    role: 'batsman',
    team: 'IN-U19',
    points: 5,
    isPlaying: true,
    price: 8.0,
    selectedBy: 45,
    recentPerformance: [12, 8, 15, 5]
  },
  {
    id: 'player-3',
    name: 'V Malhotra',
    role: 'batsman',
    team: 'IN-U19',
    points: 5,
    isPlaying: true,
    price: 8.5,
    selectedBy: 38,
    recentPerformance: [20, 15, 8, 5]
  },
  {
    id: 'player-4',
    name: 'B Mayes',
    role: 'batsman',
    team: 'EN-U19',
    points: 4,
    isPlaying: true,
    price: 7.5,
    selectedBy: 28,
    recentPerformance: [18, 12, 6, 4]
  },
  {
    id: 'player-5',
    name: 'T Rew',
    role: 'wicket-keeper',
    team: 'EN-U19',
    points: 12,
    isPlaying: true,
    price: 9.0,
    selectedBy: 72,
    recentPerformance: [8, 15, 20, 12]
  },
  {
    id: 'player-6',
    name: 'B Dawkins',
    role: 'wicket-keeper',
    team: 'EN-U19',
    points: 4,
    isPlaying: true,
    price: 7.0,
    selectedBy: 22,
    recentPerformance: [12, 8, 6, 4]
  },
  {
    id: 'player-7',
    name: 'H Pang',
    role: 'wicket-keeper',
    team: 'EN-U19',
    points: 4,
    isPlaying: true,
    price: 6.5,
    selectedBy: 18,
    recentPerformance: [10, 6, 8, 4]
  },
  {
    id: 'player-8',
    name: 'S Morgan',
    role: 'all-rounder',
    team: 'EN-U19',
    points: 12,
    isPlaying: true,
    price: 8.5,
    selectedBy: 55,
    recentPerformance: [15, 20, 18, 12]
  },
  {
    id: 'player-9',
    name: 'D Devine',
    role: 'all-rounder',
    team: 'EN-U19',
    points: 4,
    isPlaying: true,
    price: 7.0,
    selectedBy: 32,
    recentPerformance: [8, 12, 6, 4]
  },
  {
    id: 'player-10',
    name: 'A French',
    role: 'bowler',
    team: 'EN-U19',
    points: 58,
    isPlaying: true,
    price: 9.5,
    selectedBy: 85,
    recentPerformance: [35, 42, 55, 58]
  },
  {
    id: 'player-11',
    name: 'A Green',
    role: 'bowler',
    team: 'EN-U19',
    points: 4,
    isPlaying: true,
    price: 6.0,
    selectedBy: 15,
    recentPerformance: [8, 6, 5, 4]
  }
];

export const mockContest: Contest = {
  id: 'contest-1',
  name: '₹7 Lakhs',
  prizePool: 700000,
  entryFee: 49,
  totalSpots: 15286,
  filledSpots: 15286,
  isLive: true,
  winnerPayouts: [100000, 50000, 25000, 15000, 10000],
  startTime: new Date(Date.now() - 3600000), // 1 hour ago
  endTime: new Date(Date.now() + 7200000) // 2 hours from now
};

export const mockUserTeam: UserTeam = {
  id: 'team-1',
  name: 'T1',
  players: [
    mockPlayers[0], // V Sooryavanshi - Captain
    mockPlayers[1], // A Mhatre
    mockPlayers[2], // V Malhotra
    mockPlayers[3], // B Mayes
    mockPlayers[4], // T Rew - Vice Captain
    mockPlayers[5], // B Dawkins
    mockPlayers[6], // H Pang
    mockPlayers[7], // S Morgan
    mockPlayers[8], // D Devine
    mockPlayers[9], // A French
    mockPlayers[10] // A Green
  ],
  captain: 'player-1',
  viceCaptain: 'player-5',
  totalPoints: 106,
  rank: 8836,
  contestId: 'contest-1'
};