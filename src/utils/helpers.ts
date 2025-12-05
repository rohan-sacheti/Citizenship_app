import { Question, DynamicAnswers, DynamicField } from '../data/types';

/**
 * Get the display answers for a question, substituting dynamic values where needed
 */
export function getDisplayAnswers(question: Question, dynamicAnswers: DynamicAnswers): string[] {
  if (!question.isDynamicAnswer || !question.dynamicField) {
    return question.answers;
  }

  const dynamicValue = dynamicAnswers[question.dynamicField as DynamicField];
  if (dynamicValue) {
    return [dynamicValue];
  }

  return question.answers;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random questions from the pool
 */
export function getRandomQuestions(
  questions: Question[],
  count: number,
  is6520Mode: boolean
): Question[] {
  let pool = questions;
  
  if (is6520Mode) {
    pool = questions.filter(q => q.isAsterisk);
  }

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Calculate progress statistics
 */
export function calculateProgressStats(
  progress: Record<number, { seenCount: number; correctCount: number; incorrectCount: number }>,
  totalQuestions: number
) {
  const seen = Object.keys(progress).length;
  const seenPercentage = Math.round((seen / totalQuestions) * 100);

  let mastered = 0;
  let needsWork = 0;

  Object.values(progress).forEach(p => {
    const total = p.correctCount + p.incorrectCount;
    if (total >= 2) {
      const correctRate = p.correctCount / total;
      if (correctRate >= 0.8) {
        mastered++;
      } else if (correctRate < 0.6) {
        needsWork++;
      }
    }
  });

  return {
    seen,
    notSeen: totalQuestions - seen,
    seenPercentage,
    mastered,
    needsWork,
    learning: seen - mastered - needsWork,
  };
}
