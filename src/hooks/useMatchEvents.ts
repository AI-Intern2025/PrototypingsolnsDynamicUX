import { useState, useEffect } from 'react';

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

export const useMatchEvents = (contestId: string) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    // Simulate real-time match events
    const eventTypes = [
      {
        type: 'boundary' as const,
        titles: ['Boundary Scored!', 'Four Runs!', 'Great Shot!'],
        messages: ['Your player just hit a boundary', 'Excellent batting performance', 'Points added to your total'],
        impact: 'positive' as const,
        pointsRange: [4, 6]
      },
      {
        type: 'wicket' as const,
        titles: ['Wicket Taken!', 'Great Bowling!', 'Player Out!'],
        messages: ['Your bowler took a wicket', 'Excellent bowling performance', 'Your batsman got out'],
        impact: 'positive' as const,
        pointsRange: [25, 50]
      },
      {
        type: 'rank_change' as const,
        titles: ['Rank Update!', 'Position Changed!', 'Leaderboard Move!'],
        messages: ['Your rank has improved', 'You moved up in the leaderboard', 'Your rank has dropped'],
        impact: 'neutral' as const,
        pointsRange: [0, 0]
      }
    ];

    const generateRandomEvent = (): MatchEvent => {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const title = eventType.titles[Math.floor(Math.random() * eventType.titles.length)];
      const message = eventType.messages[Math.floor(Math.random() * eventType.messages.length)];
      const pointsChange = Math.floor(Math.random() * (eventType.pointsRange[1] - eventType.pointsRange[0] + 1)) + eventType.pointsRange[0];
      
      return {
        id: Date.now().toString() + Math.random(),
        type: eventType.type,
        title,
        message,
        impact: eventType.impact,
        pointsChange: eventType.type === 'rank_change' ? 0 : pointsChange,
        timestamp: new Date(),
        playerName: ['V Sooryavanshi', 'A French', 'T Rew', 'S Morgan'][Math.floor(Math.random() * 4)],
        isRead: false
      };
    };

    // Generate initial events
    const initialEvents = Array.from({ length: 3 }, generateRandomEvent);
    setEvents(initialEvents);

    // Generate new events periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of new event
        const newEvent = generateRandomEvent();
        setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events
      }
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, [contestId]);

  const markEventAsRead = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, isRead: true } : event
    ));
  };

  const dismissEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    events,
    markEventAsRead,
    dismissEvent
  };
};