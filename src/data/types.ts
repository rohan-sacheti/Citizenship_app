// Types for USCIS Civics Questions
export interface Question {
  id: number;
  question: string;
  answers: string[];
  category: Category;
  subcategory: string;
  isAsterisk: boolean; // 65/20 eligible
  isDynamicAnswer: boolean;
  dynamicField?: DynamicField;
}

export type Category = 
  | 'American Government'
  | 'American History'
  | 'Integrated Civics';

export type DynamicField = 
  | 'president'
  | 'vicePresident'
  | 'speakerOfHouse'
  | 'chiefJustice'
  | 'numberOfJustices'
  | 'presidentParty'
  | 'senator'
  | 'representative'
  | 'governor'
  | 'stateCapital';

export interface DynamicAnswers {
  president: string;
  vicePresident: string;
  speakerOfHouse: string;
  chiefJustice: string;
  numberOfJustices: string;
  presidentParty: string;
  senator: string;
  representative: string;
  governor: string;
  stateCapital: string;
}

export const defaultDynamicAnswers: DynamicAnswers = {
  president: 'Donald Trump',
  vicePresident: 'JD Vance',
  speakerOfHouse: 'Mike Johnson',
  chiefJustice: 'John Roberts',
  numberOfJustices: 'nine (9)',
  presidentParty: 'Republican',
  senator: 'Charles "Chuck" Schumer, Kirsten Gillibrand',
  representative: 'Jerrold Nadler',
  governor: 'Kathy Hochul',
  stateCapital: 'Albany, NY',
};

export interface UserProgress {
  [questionId: number]: {
    seenCount: number;
    correctCount: number;
    incorrectCount: number;
    lastSeenAt: string;
    difficulty?: 'easy' | 'hard';
  };
}

export interface AppSettings {
  is6520Mode: boolean;
  dynamicAnswers: DynamicAnswers;
}
