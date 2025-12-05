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
  president: 'Joe Biden',
  vicePresident: 'Kamala Harris',
  speakerOfHouse: 'Mike Johnson',
  chiefJustice: 'John Roberts',
  numberOfJustices: 'nine (9)',
  presidentParty: 'Democratic',
  senator: '(Answers will vary based on your state)',
  representative: '(Answers will vary based on your congressional district)',
  governor: '(Answers will vary based on your state)',
  stateCapital: '(Answers will vary based on your state)',
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
