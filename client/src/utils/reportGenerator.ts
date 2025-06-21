// Utility to generate and display AI reports using blob URLs to bypass Vite routing

export async function generateAndDisplayReport(assessmentData?: any, reportType: string = 'helper-3') {
  try {
    // Load the actual AI-generated Helper 3 report content
    const response = await fetch('/helper-3-clean-report.html');
    
    if (!response.ok) {
      throw new Error('Failed to load report template');
    }
    
    const reportHTML = await response.text();
    
    // Create blob URL to bypass Vite completely
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new window
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      // Clean up blob URL after window loads
      newWindow.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      });
      
      return {
        success: true,
        message: 'AI-generated transformation report opened successfully',
        reportType: 'Beyond Approval: The Helper\'s Journey to Inner Balance'
      };
    } else {
      throw new Error('Popup blocked - please allow popups for this site');
    }
    
  } catch (error) {
    console.error('Error generating report:', error);
    
    // Fallback: direct navigation to the existing working route
    const fallbackUrl = '/api/report/helper-3';
    window.open(fallbackUrl, '_blank');
    
    return {
      success: true,
      message: 'Report opened via fallback method',
      reportType: 'Helper 3 Transformation Report'
    };
  }
}

// Alternative method for dynamic report generation
export async function generateDynamicReport(assessmentData: any) {
  try {
    // For now, use the existing AI-generated Helper 3 content
    // Future enhancement: Use OpenAI to generate custom content based on assessmentData
    
    const reportHTML = await getHelperReportContent(assessmentData);
    
    // Create blob and open
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      newWindow.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      });
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Dynamic report generation failed:', error);
    // Fall back to static report
    return generateAndDisplayReport(assessmentData);
  }
}

// Helper function to get report content (can be enhanced with AI generation)
async function getHelperReportContent(assessmentData?: any): Promise<string> {
  const response = await fetch('/helper-3-clean-report.html');
  if (!response.ok) {
    throw new Error('Failed to load report content');
  }
  return response.text();
}