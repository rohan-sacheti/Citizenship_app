import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { useApp } from '../context/AppContext';
import { getDisplayAnswers } from '../utils/helpers';
import './QuestionDetail.css';

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings, progress, markDifficulty } = useApp();
  const [showAnswer, setShowAnswer] = useState(false);

  const questionId = parseInt(id || '1', 10);
  const question = questions.find(q => q.id === questionId);
  
  const questionProgress = progress[questionId];
  const currentDifficulty = questionProgress?.difficulty;

  const displayAnswers = useMemo(() => {
    if (!question) return [];
    return getDisplayAnswers(question, settings.dynamicAnswers);
  }, [question, settings.dynamicAnswers]);

  if (!question) {
    return (
      <div className="question-detail">
        <header className="detail-header">
          <Link to="/study" className="back-link">← Back to Study</Link>
        </header>
        <div className="not-found">
          <h2>Question not found</h2>
          <Link to="/study">Return to Study</Link>
        </div>
      </div>
    );
  }

  const prevId = questionId > 1 ? questionId - 1 : null;
  const nextId = questionId < 100 ? questionId + 1 : null;

  return (
    <div className="question-detail">
      <header className="detail-header">
        <Link to="/study" className="back-link">← Back to Study</Link>
        <span className="question-counter">Question {questionId} of 100</span>
      </header>

      <div className="question-card">
        <div className="question-meta">
          <span className="category-badge">{question.category}</span>
          <span className="subcategory">{question.subcategory}</span>
          {question.isAsterisk && (
            <span className="asterisk-indicator" title="65/20 eligible question">★ 65/20</span>
          )}
        </div>

        <h2 className="question-text">{question.question}</h2>

        {question.isDynamicAnswer && (
          <div className="dynamic-notice">
            ↻ This answer may change based on current office holders.
            <Link to="/settings">Update in Settings</Link>
          </div>
        )}

        <div className={`answer-section ${showAnswer ? 'revealed' : ''}`}>
          {!showAnswer ? (
            <button 
              className="reveal-btn"
              onClick={() => setShowAnswer(true)}
            >
              Show Answer
            </button>
          ) : (
            <div className="answers">
              <h3>Acceptable Answer(s):</h3>
              <ul>
                {displayAnswers.map((answer, idx) => (
                  <li key={idx}>{answer}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="difficulty-buttons">
        <span className="difficulty-label">Mark as:</span>
        <button
          className={`difficulty-btn easy ${currentDifficulty === 'easy' ? 'active' : ''}`}
          onClick={() => markDifficulty(questionId, currentDifficulty === 'easy' ? undefined : 'easy')}
        >
          😊 Easy
        </button>
        <button
          className={`difficulty-btn hard ${currentDifficulty === 'hard' ? 'active' : ''}`}
          onClick={() => markDifficulty(questionId, currentDifficulty === 'hard' ? undefined : 'hard')}
        >
          😰 Hard
        </button>
      </div>

      {questionProgress && (
        <div className="question-stats">
          <span>Seen {questionProgress.seenCount} time(s)</span>
          <span>✓ {questionProgress.correctCount} correct</span>
          <span>✗ {questionProgress.incorrectCount} incorrect</span>
        </div>
      )}

      <div className="navigation-buttons">
        <button
          className="nav-btn"
          disabled={!prevId}
          onClick={() => {
            setShowAnswer(false);
            navigate(`/study/${prevId}`);
          }}
        >
          ← Previous
        </button>
        <button
          className="nav-btn"
          disabled={!nextId}
          onClick={() => {
            setShowAnswer(false);
            navigate(`/study/${nextId}`);
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
