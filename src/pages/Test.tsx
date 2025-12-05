import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { questions } from '../data/questions';
import { useApp } from '../context/AppContext';
import { getRandomQuestions, getDisplayAnswers } from '../utils/helpers';
import { Question } from '../data/types';
import './Test.css';

type TestState = 'intro' | 'active' | 'results';

interface TestResult {
  question: Question;
  wasCorrect: boolean;
}

const PASSING_SCORE = 6;
const TOTAL_QUESTIONS = 10;

export default function Test() {
  const { settings, recordAnswer } = useApp();
  
  const [testState, setTestState] = useState<TestState>('intro');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const startTest = useCallback(() => {
    const selected = getRandomQuestions(questions, TOTAL_QUESTIONS, settings.is6520Mode);
    setTestQuestions(selected);
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
    setTestState('active');
  }, [settings.is6520Mode]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    const currentQuestion = testQuestions[currentIndex];
    recordAnswer(currentQuestion.id, isCorrect);
    
    setResults(prev => [...prev, { question: currentQuestion, wasCorrect: isCorrect }]);

    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setTestState('results');
    }
  }, [currentIndex, testQuestions, recordAnswer]);

  const currentQuestion = testQuestions[currentIndex];
  const displayAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    return getDisplayAnswers(currentQuestion, settings.dynamicAnswers);
  }, [currentQuestion, settings.dynamicAnswers]);

  const correctCount = results.filter(r => r.wasCorrect).length;
  const passed = correctCount >= PASSING_SCORE;
  const incorrectResults = results.filter(r => !r.wasCorrect);

  if (testState === 'intro') {
    return (
      <div className="test">
        <header className="test-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1>Test Simulation</h1>
        </header>

        <div className="intro-card">
          <div className="intro-icon">📝</div>
          <h2>USCIS Civics Test Simulation</h2>
          
          <div className="test-info">
            <div className="info-item">
              <span className="info-label">Questions</span>
              <span className="info-value">10</span>
            </div>
            <div className="info-item">
              <span className="info-label">Passing Score</span>
              <span className="info-value">6+ correct</span>
            </div>
            <div className="info-item">
              <span className="info-label">Format</span>
              <span className="info-value">Oral response</span>
            </div>
          </div>

          <div className="intro-description">
            <p>
              This simulates the actual USCIS civics portion of the naturalization interview. 
              A USCIS officer will ask you up to 10 questions from the 100 civics questions. 
              You must answer at least 6 correctly to pass.
            </p>
          </div>

          {settings.is6520Mode && (
            <div className="mode-notice">
              ★ 65/20 Mode Active – Using only the 20 asterisk-marked questions for applicants 65+ years old with 20+ years as a permanent resident.
            </div>
          )}

          <button className="start-btn" onClick={startTest}>
            Begin Test
          </button>
        </div>
      </div>
    );
  }

  if (testState === 'results') {
    return (
      <div className="test">
        <header className="test-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1>Test Results</h1>
        </header>

        <div className={`results-card ${passed ? 'passed' : 'failed'}`}>
          <div className="result-badge">
            {passed ? (
              <>
                <span className="result-icon">✓</span>
                <span className="result-text">PASSED</span>
              </>
            ) : (
              <>
                <span className="result-icon">✗</span>
                <span className="result-text">DID NOT PASS</span>
              </>
            )}
          </div>

          <div className="score-display">
            <span className="score-number">{correctCount}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{TOTAL_QUESTIONS}</span>
          </div>
          
          <div className="score-message">
            {passed 
              ? `Congratulations! You correctly answered ${correctCount} out of 10 questions.`
              : `You needed ${PASSING_SCORE} correct answers to pass. Keep studying!`
            }
          </div>
        </div>

        {incorrectResults.length > 0 && (
          <div className="review-section">
            <h3>Review Missed Questions ({incorrectResults.length})</h3>
            <div className="review-list">
              {incorrectResults.map(({ question }) => (
                <Link 
                  key={question.id} 
                  to={`/study/${question.id}`}
                  className="review-item"
                >
                  <span className="review-number">#{question.id}</span>
                  <span className="review-text">{question.question}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="results-actions">
          <button className="action-btn primary" onClick={startTest}>
            Take Another Test
          </button>
          <Link to="/study" className="action-btn secondary">
            Study Questions
          </Link>
          <Link to="/" className="action-btn tertiary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Active test state
  return (
    <div className="test">
      <header className="test-header">
        <Link to="/" className="back-link">← Exit Test</Link>
        <div className="test-progress">
          Question {currentIndex + 1} of {TOTAL_QUESTIONS}
        </div>
      </header>

      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question}</h2>

        {!showAnswer ? (
          <button 
            className="reveal-btn"
            onClick={() => setShowAnswer(true)}
          >
            Reveal Answer
          </button>
        ) : (
          <div className="answer-revealed">
            <h3>Acceptable Answer(s):</h3>
            <ul className="answer-list">
              {displayAnswers.map((answer, idx) => (
                <li key={idx}>{answer}</li>
              ))}
            </ul>

            <p className="self-assess">Did you answer correctly?</p>

            <div className="answer-buttons">
              <button 
                className="answer-btn correct"
                onClick={() => handleAnswer(true)}
              >
                ✓ Yes, I was correct
              </button>
              <button 
                className="answer-btn incorrect"
                onClick={() => handleAnswer(false)}
              >
                ✗ No, I was wrong
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="current-score">
        Current: {correctCount} correct out of {currentIndex} answered
        {currentIndex >= 5 && correctCount >= PASSING_SCORE && (
          <span className="on-track"> – On track to pass!</span>
        )}
      </div>
    </div>
  );
}
