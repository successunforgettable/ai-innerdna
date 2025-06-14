import { createContext, useContext, useState, ReactNode } from 'react';
import { AssessmentData, PersonalityResult, User } from '@shared/schema';

interface AssessmentContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  assessmentData: AssessmentData;
  setAssessmentData: (data: AssessmentData) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  currentStoneSet: number;
  setCurrentStoneSet: (set: number) => void;
  stoneSelections: number[];
  setStoneSelections: (selections: number[]) => void;
  updateStoneSelection: (setIndex: number, selection: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    foundationStones: [],
    buildingBlocks: [],
    colorStates: [],
    detailTokens: []
  });
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentStoneSet, setCurrentStoneSet] = useState(0);
  const [stoneSelections, setStoneSelections] = useState<number[]>([]);

  const updateStoneSelection = (setIndex: number, selection: number) => {
    const newSelections = [...stoneSelections];
    newSelections[setIndex] = selection;
    setStoneSelections(newSelections);
  };

  return (
    <AssessmentContext.Provider value={{
      currentUser,
      setCurrentUser,
      assessmentData,
      setAssessmentData,
      currentScreen,
      setCurrentScreen,
      currentStoneSet,
      setCurrentStoneSet,
      stoneSelections,
      setStoneSelections,
      updateStoneSelection
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
