// Data storage utility functions for JSON file system
export const saveAssessmentData = (assessmentData: any) => {
  try {
    const existingData = getStoredAssessments();
    const newAssessment = {
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
      ...assessmentData
    };
    
    const updatedData = [...existingData, newAssessment];
    localStorage.setItem('inner-dna-assessments', JSON.stringify(updatedData));
    return newAssessment.id;
  } catch (error) {
    console.error('Error saving assessment data:', error);
    return null;
  }
};

export const getStoredAssessments = () => {
  try {
    const data = localStorage.getItem('inner-dna-assessments');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving assessment data:', error);
    return [];
  }
};

export const generateUniqueId = () => {
  return 'assessment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const clearAllData = () => {
  localStorage.removeItem('inner-dna-assessments');
};