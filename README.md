# USCIS Civics Practice App

A lightweight web app to help you prepare for the civics portion of the USCIS naturalization test. Practice all 100 official civics questions from the 2008 version.

## Features

- **📚 Study Mode**: Browse all 100 questions by category, with filtering and search
- **⚡ Quick Quiz**: Random practice quizzes with configurable question count (5-20)
- **📝 Test Simulation**: Official format - 10 questions, pass with 6+ correct
- **📊 Progress Tracking**: Track which questions you've seen and your correct rate
- **★ 65/20 Mode**: Special mode for applicants 65+ with 20+ years as permanent resident
- **↻ Dynamic Answers**: Update answers that change (President, VP, Speaker, etc.)
- **📱 Mobile Friendly**: Responsive design that works on phone and desktop
- **🌓 Dark Mode**: Automatic dark mode based on system preference

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Data Storage

All progress and settings are stored locally in your browser's localStorage. Your data stays on your device and is not sent to any server.

## Official USCIS Resources

- [USCIS Civics Test Study Materials](https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test)
- [100 Civics Questions PDF](https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf)

## License

MIT License - Feel free to use and modify for personal or educational purposes.

## Disclaimer

This is an unofficial study tool. Always refer to the official USCIS materials for the most up-to-date information. Some answers (like the current President, Vice President, Speaker of the House, etc.) may change over time - use the Settings page to update these values.
