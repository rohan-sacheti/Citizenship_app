import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Study from './pages/Study';
import QuestionDetail from './pages/QuestionDetail';
import Quiz from './pages/Quiz';
import Test from './pages/Test';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study" element={<Study />} />
            <Route path="/study/:id" element={<QuestionDetail />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/test" element={<Test />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
