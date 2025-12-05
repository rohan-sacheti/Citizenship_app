import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { questions, categories } from '../data/questions';
import { useApp } from '../context/AppContext';
import { Category } from '../data/types';
import './Study.css';

export default function Study() {
  const navigate = useNavigate();
  const { settings, progress } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [asteriskOnly, setAsteriskOnly] = useState(settings.is6520Mode);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedCategory !== 'all' && q.category !== selectedCategory) {
        return false;
      }
      if (asteriskOnly && !q.isAsterisk) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return q.question.toLowerCase().includes(query) ||
               q.answers.some(a => a.toLowerCase().includes(query));
      }
      return true;
    });
  }, [selectedCategory, asteriskOnly, searchQuery]);

  const getQuestionStatus = (id: number) => {
    const p = progress[id];
    if (!p) return 'not-seen';
    const total = p.correctCount + p.incorrectCount;
    if (total >= 2) {
      const rate = p.correctCount / total;
      if (rate >= 0.8) return 'mastered';
      if (rate < 0.6) return 'needs-work';
    }
    return 'learning';
  };

  return (
    <div className="study">
      <header className="study-header">
        <Link to="/" className="back-link">← Back</Link>
        <h1>Study Questions</h1>
      </header>

      <div className="filters">
        <div className="filter-row">
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value as Category | 'all')}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={asteriskOnly}
              onChange={e => setAsteriskOnly(e.target.checked)}
            />
            <span>65/20 Only</span>
          </label>
        </div>

        <input
          type="search"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="question-count">
        Showing {filteredQuestions.length} of {questions.length} questions
      </div>

      <div className="question-list">
        {filteredQuestions.map(q => (
          <button
            key={q.id}
            className={`question-item ${getQuestionStatus(q.id)}`}
            onClick={() => navigate(`/study/${q.id}`)}
          >
            <span className="question-number">#{q.id}</span>
            <span className="question-text">{q.question}</span>
            {q.isAsterisk && <span className="asterisk-badge">★</span>}
            {q.isDynamicAnswer && <span className="dynamic-badge">↻</span>}
          </button>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="no-results">
          <p>No questions match your filters.</p>
          <button onClick={() => {
            setSelectedCategory('all');
            setAsteriskOnly(false);
            setSearchQuery('');
          }}>Clear Filters</button>
        </div>
      )}
    </div>
  );
}
