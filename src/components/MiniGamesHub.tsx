import React, { useState, useEffect } from 'react';
import { GamepadIcon, BrainIcon, ZapIcon, GiftIcon, ClockIcon, TrophyIcon, StarIcon, CoinsIcon } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  reward: number;
  timeLimit: number;
  category: 'prediction' | 'stats' | 'trivia';
}

interface MiniGame {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'prediction' | 'streak' | 'milestone';
  reward: number;
  timeRemaining: number;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswer?: number;
}

interface MiniGamesHubProps {
  onRewardEarned: (amount: number, type: string) => void;
}

const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ onRewardEarned }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'quiz' | 'rewards'>('live');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [activeGame, setActiveGame] = useState<MiniGame | null>(null);
  const [gameTimeLeft, setGameTimeLeft] = useState(0);
  const [gameAnswer, setGameAnswer] = useState<number | null>(null);
  const [showGameResult, setShowGameResult] = useState(false);

  const [miniGames] = useState<MiniGame[]>([
    {
      id: 'next-wicket',
      title: 'Next Wicket Prediction',
      description: 'Predict who will take the next wicket',
      type: 'prediction',
      reward: 10,
      timeRemaining: 45,
      isActive: true,
      difficulty: 'easy',
      options: ['A French', 'S Morgan', 'D Devine', 'A Green'],
      correctAnswer: 0
    },
    {
      id: 'over-runs',
      title: 'Over Runs Challenge',
      description: 'Guess runs scored in next over',
      type: 'prediction',
      reward: 15,
      timeRemaining: 120,
      isActive: true,
      difficulty: 'medium',
      options: ['0-3 runs', '4-7 runs', '8-12 runs', '13+ runs'],
      correctAnswer: 1
    },
    {
      id: 'boundary-streak',
      title: 'Boundary Streak',
      description: 'Predict 3 boundaries in a row',
      type: 'streak',
      reward: 25,
      timeRemaining: 300,
      isActive: true,
      difficulty: 'hard',
      options: ['Yes, will happen', 'No, won\'t happen'],
      correctAnswer: 0
    }
  ]);

  const [quizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'Who has the highest strike rate in this match so far?',
      options: ['V Sooryavanshi', 'A French', 'T Rew', 'S Morgan'],
      correctAnswer: 0,
      reward: 5,
      timeLimit: 15,
      category: 'stats'
    },
    {
      id: 'q2',
      question: 'What will be the next scoring shot?',
      options: ['Single', 'Boundary', 'Six', 'Dot Ball'],
      correctAnswer: 1,
      reward: 8,
      timeLimit: 10,
      category: 'prediction'
    },
    {
      id: 'q3',
      question: 'Which player has taken the most wickets in U19 World Cup history?',
      options: ['Rashid Khan', 'Mustafizur Rahman', 'Kagiso Rabada', 'Anukul Roy'],
      correctAnswer: 2,
      reward: 12,
      timeLimit: 20,
      category: 'trivia'
    }
  ]);

  useEffect(() => {
    if (currentQuiz && quizTimeLeft > 0) {
      const timer = setTimeout(() => setQuizTimeLeft(quizTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentQuiz && quizTimeLeft === 0) {
      handleQuizTimeout();
    }
  }, [currentQuiz, quizTimeLeft]);

  useEffect(() => {
    if (activeGame && gameTimeLeft > 0) {
      const timer = setTimeout(() => setGameTimeLeft(gameTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (activeGame && gameTimeLeft === 0) {
      handleGameTimeout();
    }
  }, [activeGame, gameTimeLeft]);

  const startQuiz = (question: QuizQuestion) => {
    setCurrentQuiz(question);
    setQuizTimeLeft(question.timeLimit);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const startGame = (game: MiniGame) => {
    setActiveGame(game);
    setGameTimeLeft(30); // 30 seconds for live games
    setGameAnswer(null);
    setShowGameResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleGameAnswerSelect = (answerIndex: number) => {
    if (showGameResult) return;
    setGameAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return;
    
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      const reward = currentQuiz.reward;
      setTotalEarnings(prev => prev + reward);
      setStreakCount(prev => prev + 1);
      onRewardEarned(reward, 'quiz');
    } else {
      setStreakCount(0);
    }
  };

  const submitGameAnswer = () => {
    if (gameAnswer === null || !activeGame) return;
    
    const isCorrect = gameAnswer === activeGame.correctAnswer;
    setShowGameResult(true);
    
    if (isCorrect) {
      const reward = activeGame.reward;
      setTotalEarnings(prev => prev + reward);
      onRewardEarned(reward, 'live-game');
    }
  };

  const handleQuizTimeout = () => {
    setShowResult(true);
    setStreakCount(0);
  };

  const handleGameTimeout = () => {
    setShowGameResult(true);
  };

  const closeQuiz = () => {
    setCurrentQuiz(null);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const closeGame = () => {
    setActiveGame(null);
    setShowGameResult(false);
    setGameAnswer(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prediction': return <ZapIcon className="w-4 h-4" />;
      case 'stats': return <TrophyIcon className="w-4 h-4" />;
      case 'trivia': return <BrainIcon className="w-4 h-4" />;
      default: return <GamepadIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <GamepadIcon className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Mini Games & Challenges</h3>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <CoinsIcon className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">₹{totalEarnings} earned</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'live', label: 'Live Games', icon: ZapIcon },
          { id: 'quiz', label: 'Quick Quiz', icon: BrainIcon },
          { id: 'rewards', label: 'Rewards', icon: GiftIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Games Tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {activeGame ? (
            <div className="bg-white border-2 border-purple-500 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{activeGame.title}</h4>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-red-500" />
                  <span className={`font-bold ${gameTimeLeft <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                    {gameTimeLeft}s
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium text-gray-900 mb-4">{activeGame.description}</p>
                <div className="space-y-2">
                  {activeGame.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleGameAnswerSelect(index)}
                      disabled={showGameResult}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        showGameResult
                          ? index === activeGame.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : index === gameAnswer && index !== activeGame.correctAnswer
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : gameAnswer === index
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {showGameResult ? (
                <div className="text-center">
                  <div className={`text-lg font-bold mb-2 ${
                    gameAnswer === activeGame.correctAnswer ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gameAnswer === activeGame.correctAnswer ? 'Correct!' : 'Wrong Answer'}
                  </div>
                  {gameAnswer === activeGame.correctAnswer && (
                    <div className="text-green-600 mb-4">
                      You earned ₹{activeGame.reward}!
                    </div>
                  )}
                  <button
                    onClick={closeGame}
                    className="bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={submitGameAnswer}
                    disabled={gameAnswer === null}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      gameAnswer !== null
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={closeGame}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Live Match Challenges</h4>
                <p className="text-sm text-gray-600">
                  Earn instant cash rewards without affecting your main contest ranking!
                </p>
              </div>

              {miniGames.map((game) => (
                <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <GamepadIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{game.title}</div>
                        <div className="text-sm text-gray-600">{game.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">₹{game.reward}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{Math.floor(game.timeRemaining / 60)}:{(game.timeRemaining % 60).toString().padStart(2, '0')} left</span>
                    </div>
                    <button
                      onClick={() => startGame(game)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        game.isActive
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!game.isActive}
                    >
                      {game.isActive ? 'Play Now' : 'Ended'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {!currentQuiz ? (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Quick Quiz Challenges</h4>
                <p className="text-sm text-gray-600">
                  Test your cricket knowledge and earn instant rewards!
                </p>
                {streakCount > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">
                      {streakCount} question streak! Next reward: +{streakCount * 2} bonus
                    </span>
                  </div>
                )}
              </div>

              {quizQuestions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                        {getCategoryIcon(question.category)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{question.question}</div>
                        <div className="text-sm text-gray-600 capitalize">{question.category} • {question.timeLimit}s</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">₹{question.reward}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => startQuiz(question)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">Quiz Challenge</h4>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-red-500" />
                  <span className={`font-bold ${quizTimeLeft <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                    {quizTimeLeft}s
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium text-gray-900 mb-4">{currentQuiz.question}</p>
                <div className="space-y-2">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        showResult
                          ? index === currentQuiz.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : index === selectedAnswer && index !== currentQuiz.correctAnswer
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {showResult ? (
                <div className="text-center">
                  <div className={`text-lg font-bold mb-2 ${
                    selectedAnswer === currentQuiz.correctAnswer ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedAnswer === currentQuiz.correctAnswer ? 'Correct!' : 'Wrong Answer'}
                  </div>
                  {selectedAnswer === currentQuiz.correctAnswer && (
                    <div className="text-green-600 mb-4">
                      You earned ₹{currentQuiz.reward}!
                    </div>
                  )}
                  <button
                    onClick={closeQuiz}
                    className="bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedAnswer !== null
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={closeQuiz}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">Your Earnings Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{totalEarnings}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{streakCount}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Available Rewards</h5>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Streak Bonus</span>
                <span className="text-green-600 font-bold">₹{streakCount * 5}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get 5 questions right in a row for bonus rewards
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((streakCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {streakCount}/5 correct answers
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Daily Challenge</span>
                <span className="text-blue-600 font-bold">₹50</span>
              </div>
              <p className="text-sm text-gray-600">
                Complete 10 mini-games today to unlock bonus reward
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGamesHub;