import { useState } from 'react';
import { Link } from 'react-router-dom';
import { questions } from '../data/questions';
import { useApp } from '../context/AppContext';
import { calculateProgressStats } from '../utils/helpers';
import { DynamicField } from '../data/types';
import './Settings.css';

const dynamicFieldLabels: Record<DynamicField, string> = {
  president: 'President of the United States',
  vicePresident: 'Vice President of the United States',
  speakerOfHouse: 'Speaker of the House',
  chiefJustice: 'Chief Justice of the United States',
  numberOfJustices: 'Number of Supreme Court Justices',
  presidentParty: 'Political Party of the President',
  senator: 'Your State\'s U.S. Senator(s)',
  representative: 'Your U.S. Representative',
  governor: 'Your State\'s Governor',
  stateCapital: 'Your State\'s Capital',
};

export default function Settings() {
  const { settings, progress, updateSettings, updateDynamicAnswers, resetProgress } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const stats = calculateProgressStats(progress, questions.length);

  const handleDynamicAnswerChange = (field: DynamicField, value: string) => {
    updateDynamicAnswers({ [field]: value });
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <Link to="/" className="back-link">← Home</Link>
        <h1>Settings & Progress</h1>
      </header>

      {/* Progress Section */}
      <section className="settings-section">
        <h2>📊 Your Progress</h2>
        
        <div className="progress-overview">
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${stats.seenPercentage}%` }}
            />
          </div>
          <div className="progress-label">
            {stats.seen} of {questions.length} questions seen ({stats.seenPercentage}%)
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.notSeen}</span>
            <span className="stat-label">Not Seen</span>
          </div>
          <div className="stat-card mastered">
            <span className="stat-value">{stats.mastered}</span>
            <span className="stat-label">Mastered</span>
          </div>
          <div className="stat-card learning">
            <span className="stat-value">{stats.learning}</span>
            <span className="stat-label">Learning</span>
          </div>
          <div className="stat-card needs-work">
            <span className="stat-value">{stats.needsWork}</span>
            <span className="stat-label">Needs Work</span>
          </div>
        </div>

        <div className="progress-tips">
          <p><strong>Mastered:</strong> 80%+ correct rate (minimum 2 attempts)</p>
          <p><strong>Needs Work:</strong> Below 60% correct rate</p>
        </div>
      </section>

      {/* Settings Section */}
      <section className="settings-section">
        <h2>⚙️ Test Settings</h2>

        <label className="toggle-setting">
          <span className="toggle-info">
            <span className="toggle-label">65/20 Mode</span>
            <span className="toggle-description">
              For applicants 65+ years old with 20+ years as a permanent resident. 
              Uses only the 20 asterisk-marked questions.
            </span>
          </span>
          <input 
            type="checkbox"
            checked={settings.is6520Mode}
            onChange={e => updateSettings({ is6520Mode: e.target.checked })}
            className="toggle-input"
          />
          <span className="toggle-switch" />
        </label>
      </section>

      {/* Dynamic Answers Section */}
      <section className="settings-section">
        <h2>📝 Current Officials & Answers</h2>
        <p className="section-description">
          Some answers change over time. Update these to ensure your practice is accurate.
        </p>

        <div className="dynamic-fields">
          {(Object.entries(dynamicFieldLabels) as [DynamicField, string][]).map(([field, label]) => (
            <div key={field} className="dynamic-field">
              <label htmlFor={field}>{label}</label>
              <input
                id={field}
                type="text"
                value={settings.dynamicAnswers[field]}
                onChange={e => handleDynamicAnswerChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Reset Section */}
      <section className="settings-section danger-zone">
        <h2>🗑️ Reset Data</h2>
        
        {!showResetConfirm ? (
          <button 
            className="reset-btn"
            onClick={() => setShowResetConfirm(true)}
          >
            Reset All Progress
          </button>
        ) : (
          <div className="reset-confirm">
            <p>Are you sure? This will delete all your progress data.</p>
            <div className="confirm-buttons">
              <button className="confirm-btn cancel" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn delete" onClick={handleReset}>
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="settings-section about">
        <h2>ℹ️ About</h2>
        <p>
          This app helps you prepare for the civics portion of the USCIS naturalization test. 
          It contains all 100 official civics questions from the 2008 version of the test.
        </p>
        <p>
          <strong>Note:</strong> This app stores all data locally in your browser. 
          Your progress will not sync across devices.
        </p>
        <p className="version">Version 1.0.0</p>
      </section>
    </div>
  );
}
