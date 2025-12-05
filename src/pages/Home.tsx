import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { questions } from '../data/questions';
import { calculateProgressStats } from '../utils/helpers';
import './Home.css';

export default function Home() {
  const { progress, settings } = useApp();
  const stats = calculateProgressStats(progress, questions.length);

  return (
    <div className="home">
      <header className="home-header">
        <h1>🇺🇸 USCIS Civics Practice</h1>
        <p className="subtitle">Master the 100 Civics Questions for Your Naturalization Test</p>
      </header>

      <div className="home-actions">
        <Link to="/quiz?count=10" className="action-card primary">
          <span className="action-icon">⚡</span>
          <div className="action-content">
            <h2>Quick Quiz</h2>
            <p>10 random questions</p>
          </div>
        </Link>

        <Link to="/test" className="action-card accent">
          <span className="action-icon">📝</span>
          <div className="action-content">
            <h2>Test Simulation</h2>
            <p>Official format: 10 questions, pass with 6+</p>
          </div>
        </Link>

        <Link to="/study" className="action-card secondary">
          <span className="action-icon">📚</span>
          <div className="action-content">
            <h2>Study All Questions</h2>
            <p>Browse and learn all 100 questions</p>
          </div>
        </Link>

        <Link to="/settings" className="action-card tertiary">
          <span className="action-icon">⚙️</span>
          <div className="action-content">
            <h2>Settings & Progress</h2>
            <p>View your stats and customize</p>
          </div>
        </Link>
      </div>

      <div className="progress-summary">
        <h3>Your Progress</h3>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${stats.seenPercentage}%` }}
          />
        </div>
        <div className="progress-stats">
          <span>{stats.seen} of {questions.length} questions seen ({stats.seenPercentage}%)</span>
        </div>
        {stats.mastered > 0 && (
          <div className="mastery-stats">
            <span className="mastered">✓ {stats.mastered} mastered</span>
            {stats.needsWork > 0 && <span className="needs-work">⚠ {stats.needsWork} need work</span>}
          </div>
        )}
      </div>

      {settings.is6520Mode && (
        <div className="mode-indicator">
          <span>65/20 Mode Active</span>
          <small>Using only asterisk-marked questions</small>
        </div>
      )}
    </div>
  );
}
