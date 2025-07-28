import React from 'react';
import { TrophyIcon, UsersIcon, BarChart3Icon, MessageSquareIcon } from 'lucide-react';

export type TabType = 'winnings' | 'leaderboard' | 'scorecard' | 'commentary';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'winnings' as TabType, label: 'Winnings', icon: TrophyIcon },
    { id: 'leaderboard' as TabType, label: 'Leaderboard', icon: UsersIcon },
    { id: 'scorecard' as TabType, label: 'Scorecard', icon: BarChart3Icon },
    { id: 'commentary' as TabType, label: 'Commentary', icon: MessageSquareIcon },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;