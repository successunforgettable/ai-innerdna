import fs from 'fs';
import path from 'path';

// Read the complete test-genspark-design.html template
function getGensparkTemplateBase() {
  const templatePath = path.join(process.cwd(), 'public', 'test-genspark-design.html');
  return fs.readFileSync(templatePath, 'utf8');
}

export async function generateCompleteStyledReport(typeId, userData = null, calendlyUsername = 'your-calendly-username') {
  console.log(`🚀 New Genspark template generation for user ${typeId}`);
  
  // Get the base template
  let htmlContent = getGensparkTemplateBase();
  
  // Dynamic data generation
  const heartPercentage = Math.floor(Math.random() * 20) + 70; // 70-89%
  const hrvBaseline = getHRVBaseline(typeId);
  const personalityName = getPersonalityName(typeId);
  
  // Add PDF download buttons before closing body tag
  const pdfDownloadSection = `
<div class="text-center mt-12 mb-8">
  <div class="glass-card rounded-2xl p-8 max-w-2xl mx-auto" style="background: rgba(139, 69, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(139, 69, 255, 0.2);">
    <h3 class="text-2xl font-bold mb-4" style="color: #fbbf24;">Save Your Report</h3>
    <p class="text-lg mb-6" style="color: #e5e7eb;">Download your complete assessment report as a professional file (use Ctrl+P to print or save as PDF)</p>
    
    <div class="space-y-4">
      <button onclick="downloadReport(${typeId})" 
              class="w-full py-4 px-8 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105"
              style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000;">
        <i class="fas fa-download mr-2"></i>
        Download Report File
        <i class="fas fa-file-code ml-2"></i>
      </button>
      
      <button onclick="previewReport(${typeId})" 
              class="w-full py-3 px-6 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105"
              style="background: rgba(139, 69, 255, 0.2); color: #fff; border: 1px solid rgba(139, 69, 255, 0.4);">
        <i class="fas fa-eye mr-2"></i>
        Preview Report
      </button>
    </div>
    
    <div class="mt-6 p-4 rounded-lg" style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3);">
      <p class="text-sm" style="color: #fbbf24;">
        <i class="fas fa-lightbulb mr-2"></i>
        <strong>Tip:</strong> After downloading, open the file and use Ctrl+P (Windows) or Cmd+P (Mac) to save as PDF
      </p>
    </div>
  </div>
</div>

<script>
function downloadReport(typeId) {
  const button = event.target;
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating Report...';
  button.disabled = true;
  
  // Open download in new window
  const downloadWindow = window.open('/api/download-report/' + typeId, '_blank');
  
  // Reset button after delay
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.disabled = false;
  }, 2000);
}

function previewReport(typeId) {
  window.open('/api/preview-report/' + typeId, '_blank');
}
</script>
`;

  // Insert PDF section before closing body tag
  htmlContent = htmlContent.replace(/<\/body>/g, pdfDownloadSection + '</body>');

  // Replace dynamic content placeholders - Multiple replacement passes
  // Pass 1: JavaScript animation target (with exact whitespace)
  htmlContent = htmlContent.replace(/const target = 78;/g, `const target = ${heartPercentage};`);
  
  // Pass 2: HTML span elements (exact match)
  htmlContent = htmlContent.replace(/<span id="heartPercentage">78<\/span>/g, `<span id="heartPercentage">${heartPercentage}</span>`);
  htmlContent = htmlContent.replace(/<span id="heartPercentage2">78<\/span>/g, `<span id="heartPercentage2">${heartPercentage}</span>`);
  
  // Pass 3: Personality type references - Replace only "THE CHALLENGER:" in header
  htmlContent = htmlContent.replace(/THE CHALLENGER:/g, `THE ${personalityName.toUpperCase()}:`);
  
  // Remove ALL "Type X" references with comprehensive regex pattern
  htmlContent = htmlContent.replace(/Type \d+/g, personalityName);
  htmlContent = htmlContent.replace(/TYPE \d+/g, personalityName.toUpperCase());
  htmlContent = htmlContent.replace(/type \d+/g, personalityName.toLowerCase());
  
  // Remove remaining "THE TYPE X" patterns
  htmlContent = htmlContent.replace(/THE TYPE \d+/g, `THE ${personalityName.toUpperCase()}`);
  
  // Fix title tag and header content - specific patterns
  htmlContent = htmlContent.replace(/THE TYPE \d+ [^:]+:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/The Type \d+ [^:]+:/g, `The ${personalityName}:`);
  htmlContent = htmlContent.replace(/TYPE \d+ [^:]+:/g, `${personalityName.toUpperCase()}:`);
  
  // Fix the specific "TYPE X CHALLENGER:" pattern in the hero section for ALL types
  htmlContent = htmlContent.replace(/THE TYPE 8 CHALLENGER:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 8 CHALLENGER:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 7 ENTHUSIAST:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 7 ENTHUSIAST:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 6 SENTINEL:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 6 SENTINEL:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 5 INVESTIGATOR:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 5 INVESTIGATOR:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 4 INDIVIDUALIST:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 4 INDIVIDUALIST:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 3 ACHIEVER:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 3 ACHIEVER:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 2 HELPER:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 2 HELPER:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 1 REFORMER:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 1 REFORMER:/g, `${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/THE TYPE 9 PEACEMAKER:/g, `THE ${personalityName.toUpperCase()}:`);
  htmlContent = htmlContent.replace(/TYPE 9 PEACEMAKER:/g, `${personalityName.toUpperCase()}:`);
  
  // Pass 4: Remaining percentage and HRV references
  htmlContent = htmlContent.replace(/78%/g, `${heartPercentage}%`);
  htmlContent = htmlContent.replace(/22ms/g, `${hrvBaseline}ms`);
  htmlContent = htmlContent.replace(/Your HRV: 22ms/g, `Your HRV: ${hrvBaseline}ms`);
  
  // Pass 5: Calendly URL replacement
  htmlContent = htmlContent.replace(/CALENDLY_USERNAME_PLACEHOLDER/g, calendlyUsername);
  
  // Pass 6: User data placeholders for contact form
  if (userData) {
    htmlContent = htmlContent.replace(/USER_FIRSTNAME_PLACEHOLDER/g, userData.firstName || '');
    htmlContent = htmlContent.replace(/USER_LASTNAME_PLACEHOLDER/g, userData.lastName || '');
    htmlContent = htmlContent.replace(/USER_EMAIL_PLACEHOLDER/g, userData.email || '');
    htmlContent = htmlContent.replace(/USER_PHONE_PLACEHOLDER/g, userData.phoneNumber || '');
    htmlContent = htmlContent.replace(/PERSONALITY_TYPE_PLACEHOLDER/g, personalityName);
  } else {
    // Clear placeholders if no user data
    htmlContent = htmlContent.replace(/USER_FIRSTNAME_PLACEHOLDER/g, '');
    htmlContent = htmlContent.replace(/USER_LASTNAME_PLACEHOLDER/g, '');
    htmlContent = htmlContent.replace(/USER_EMAIL_PLACEHOLDER/g, '');
    htmlContent = htmlContent.replace(/USER_PHONE_PLACEHOLDER/g, '');
    htmlContent = htmlContent.replace(/PERSONALITY_TYPE_PLACEHOLDER/g, personalityName);
  }
  
  // Generate filename
  const timestamp = Date.now();
  const fileName = `emergency-report-${typeId}-${timestamp}.html`;
  
  // Save file
  fs.writeFileSync(fileName, htmlContent);
  
  // Return HTML content directly for viewing
  return htmlContent;
}

function getHRVBaseline(typeId) {
  const baselines = {
    1: 28, 2: 24, 3: 22, 4: 26, 5: 30,
    6: 25, 7: 23, 8: 22, 9: 27
  };
  return baselines[typeId] || 25;
}

function getPersonalityName(typeId) {
  const names = {
    1: "Reformer",
    2: "Helper", 
    3: "Achiever",
    4: "Individualist",
    5: "Investigator",
    6: "Sentinel",
    7: "Enthusiast",
    8: "Challenger",
    9: "Peacemaker"
  };
  return names[typeId] || "Challenger";
}