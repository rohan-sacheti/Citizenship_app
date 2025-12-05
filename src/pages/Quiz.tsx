import { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { questions } from '../data/questions';
import { useApp } from '../context/AppContext';
import { getRandomQuestions, getDisplayAnswers } from '../utils/helpers';
import { Question } from '../data/types';
import './Quiz.css';

type QuizState = 'setup' | 'active' | 'results';

interface QuizResult {
  question: Question;
  wasCorrect: boolean;
}

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const { settings, recordAnswer } = useApp();
  
  const initialCount = parseInt(searchParams.get('count') || '10', 10);
  const [questionCount, setQuestionCount] = useState(initialCount);
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);

  const startQuiz = useCallback(() => {
    const selected = getRandomQuestions(questions, questionCount, settings.is6520Mode);
    setQuizQuestions(selected);
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
    setQuizState('active');
  }, [questionCount, settings.is6520Mode]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    const currentQuestion = quizQuestions[currentIndex];
    recordAnswer(currentQuestion.id, isCorrect);
    
    setResults(prev => [...prev, { question: currentQuestion, wasCorrect: isCorrect }]);

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setQuizState('results');
    }
  }, [currentIndex, quizQuestions, recordAnswer]);

  const currentQuestion = quizQuestions[currentIndex];
  const displayAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    return getDisplayAnswers(currentQuestion, settings.dynamicAnswers);
  }, [currentQuestion, settings.dynamicAnswers]);

  const correctCount = results.filter(r => r.wasCorrect).length;
  const incorrectResults = results.filter(r => !r.wasCorrect);

  if (quizState === 'setup') {
    return (
      <div className="quiz">
        <header className="quiz-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1>Quick Quiz</h1>
        </header>

        <div className="setup-card">
          <h2>Quiz Settings</h2>
          
          <div className="setting-group">
            <label htmlFor="count">Number of Questions:</label>
            <div className="count-selector">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  className={`count-btn ${questionCount === count ? 'active' : ''}`}
                  onClick={() => setQuestionCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {settings.is6520Mode && (
            <div className="mode-notice">
              ★ 65/20 Mode is active – using only asterisk-marked questions
            </div>
          )}

          <button className="start-btn" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'results') {
    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    
    return (
      <div className="quiz">
        <header className="quiz-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1>Quiz Results</h1>
        </header>

        <div className="results-card">
          <div className="score-display">
            <span className="score-number">{correctCount}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{quizQuestions.length}</span>
          </div>
          <div className="score-percentage">{percentage}% Correct</div>

          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {incorrectResults.length > 0 && (
          <div className="missed-section">
            <h3>Questions to Review ({incorrectResults.length})</h3>
            <div className="missed-list">
              {incorrectResults.map(({ question }) => (
                <Link 
                  key={question.id} 
                  to={`/study/${question.id}`}
                  className="missed-item"
                >
                  <span className="missed-number">#{question.id}</span>
                  <span className="missed-text">{question.question}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="results-actions">
          <button className="action-btn primary" onClick={startQuiz}>
            Try Again
          </button>
          <Link to="/" className="action-btn secondary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Active quiz state
  return (
    <div className="quiz">
      <header className="quiz-header">
        <Link to="/" className="back-link">← Exit</Link>
        <div className="progress-indicator">
          Question {currentIndex + 1} of {quizQuestions.length}
        </div>
      </header>

      <div className="progress-dots">
        {quizQuestions.map((_, idx) => (
          <span 
            key={idx} 
            className={`dot ${idx < currentIndex ? (results[idx]?.wasCorrect ? 'correct' : 'incorrect') : ''} ${idx === currentIndex ? 'current' : ''}`}
          />
        ))}
      </div>

      <div className="question-card">
        <div className="question-badges">
          {currentQuestion.isAsterisk && <span className="badge asterisk">★ 65/20</span>}
          {currentQuestion.isDynamicAnswer && <span className="badge dynamic">↻ Dynamic</span>}
        </div>
        
        <h2 className="question-text">{currentQuestion.question}</h2>

        {!showAnswer ? (
          <button 
            className="reveal-btn"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        ) : (
          <div className="answer-revealed">
            <h3>Acceptable Answer(s):</h3>
            <ul className="answer-list">
              {displayAnswers.map((answer, idx) => (
                <li key={idx}>{answer}</li>
              ))}
            </ul>

            <div className="answer-buttons">
              <button 
                className="answer-btn correct"
                onClick={() => handleAnswer(true)}
              >
                ✓ I was Correct
              </button>
              <button 
                className="answer-btn incorrect"
                onClick={() => handleAnswer(false)}
              >
                ✗ I was Wrong
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
