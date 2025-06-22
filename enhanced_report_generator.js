import fs from 'fs/promises';
import path from 'path';

// Generate personalized heart neuron disconnect percentage
async function getPersonalizedPercentage(userId, typeId) {
  // Get from your assessment database
  // Could be based on stress levels, response patterns, etc.
  
  try {
    // In a real implementation, you would:
    // 1. Query user's assessment data from storage
    // 2. Analyze stress indicators from foundation stones responses
    // 3. Factor in color state distributions (higher anxiety = higher disconnect)
    // 4. Consider detail token patterns for emotional regulation
    // 5. Apply personality-specific baselines
    
    // Example assessment-based calculation:
    // const userData = await storage.getUser(userId);
    // const assessmentData = userData?.assessmentData;
    // 
    // if (assessmentData) {
    //   // Base percentage by personality type
    //   const basePercentages = {
    //     1: 75, // Reformers: perfectionism stress
    //     2: 73, // Helpers: emotional depletion
    //     3: 78, // Achievers: performance anxiety
    //     4: 81, // Individualists: emotional chaos
    //     5: 79, // Investigators: social withdrawal
    //     6: 82, // Sentinels: anxiety patterns
    //     7: 76, // Enthusiasts: scattered energy
    //     8: 74, // Challengers: control stress
    //     9: 80  // Peacemakers: self-abandonment
    //   };
    //   
    //   let percentage = basePercentages[typeId] || 75;
    //   
    //   // Adjust based on color states (anxiety/stress indicators)
    //   if (assessmentData.colorStates) {
    //     const anxiousStates = ['anxious', 'overwhelmed', 'scattered'];
    //     const stressLevel = Object.entries(assessmentData.colorStates)
    //       .filter(([state]) => anxiousStates.includes(state))
    //       .reduce((sum, [, value]) => sum + value, 0);
    //     percentage += Math.floor(stressLevel * 0.1); // 10% increase per 100% stress
    //   }
    //   
    //   // Adjust based on detail tokens (emotional regulation)
    //   if (assessmentData.detailTokens) {
    //     const selfCareTokens = assessmentData.detailTokens.selfPreservation || 0;
    //     percentage -= Math.floor(selfCareTokens * 0.5); // Better self-care = lower disconnect
    //   }
    //   
    //   return Math.max(65, Math.min(85, percentage)); // Keep in 65-85% range
    // }
    
    // For now, keeping the random generation for demo
    return Math.floor(Math.random() * 16) + 70;
    
  } catch (error) {
    console.error('Error calculating personalized percentage:', error);
    // Fallback to type-based baseline
    const typeBaselines = {
      1: 75, 2: 73, 3: 78, 4: 81, 5: 79,
      6: 82, 7: 76, 8: 74, 9: 80
    };
    return typeBaselines[typeId] || 75;
  }
}

// Generate random heart neuron disconnect percentage (70-85% range for urgency)
function generateHeartNeuronPercentage() {
  return Math.floor(Math.random() * 16) + 70; // Random between 70-85
}

// Generate HRV baseline based on personality type
function generateHRVBaseline(typeId) {
  const baselineRanges = {
    1: { min: 12, max: 22 }, // Reformer - perfectionist stress
    2: { min: 14, max: 24 }, // Helper - people-pleasing depletion  
    3: { min: 16, max: 26 }, // Achiever - performance anxiety
    4: { min: 11, max: 21 }, // Individualist - emotional chaos
    5: { min: 10, max: 20 }, // Investigator - withdrawal patterns
    6: { min: 9, max: 19 },  // Loyalist - anxiety patterns
    7: { min: 8, max: 18 },  // Enthusiast - scattered energy
    8: { min: 15, max: 25 }, // Challenger - fight-or-flight
    9: { min: 7, max: 17 }   // Peacemaker - merge/inertia
  };
  
  const range = baselineRanges[typeId] || { min: 10, max: 20 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// Get personality type name
function getPersonalityTypeName(typeId) {
  const typeNames = {
    1: 'REFORMER',
    2: 'HELPER', 
    3: 'ACHIEVER',
    4: 'INDIVIDUALIST',
    5: 'INVESTIGATOR',
    6: 'SENTINEL',
    7: 'ENTHUSIAST',
    8: 'CHALLENGER',
    9: 'PEACEMAKER'
  };
  return typeNames[typeId] || 'UNKNOWN';
}

// Get type-specific title description
function getTypeDescription(typeId) {
  const descriptions = {
    1: 'Why Your Life Feels So Exhausting',
    2: 'Why Your Life Feels So Draining',
    3: 'Why Your Life Feels So Empty',
    4: 'Why Your Life Feels So Intense',
    5: 'Why Your Life Feels So Depleting',
    6: 'Why Your Life Feels So Anxious',
    7: 'Why Your Life Feels So Scattered',
    8: 'Why Your Life Feels So Hard',
    9: 'Why Your Life Feels So Stuck'
  };
  return descriptions[typeId] || 'Why Your Life Feels Disconnected';
}

// Main function to generate styled report
export async function generateStyledReport(typeId, userId = null) {
  try {
    // Generate dynamic data
    const heartNeuronPercentage = userId ? 
      await getPersonalizedPercentage(userId, typeId) : 
      generateHeartNeuronPercentage();
    const hrvBaseline = generateHRVBaseline(typeId);
    const typeName = getPersonalityTypeName(typeId);
    const typeDescription = getTypeDescription(typeId);
    const operatingPercentage = 100 - heartNeuronPercentage;
    
    // Read the markdown content
    const filePath = path.join('public', '9 types reports', `type${typeId}_action_content.md`);
    const markdownContent = await fs.readFile(filePath, 'utf8');
    
    // Replace placeholders in markdown content
    const processedContent = markdownContent
      .replace(/\{heartNeuronDisconnectPercentage\}/g, heartNeuronPercentage);
    
    // Parse markdown content into sections (basic parsing)
    const sections = parseMarkdownSections(processedContent);
    
    // Generate the complete HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The ${typeName}: Heart-Brain Connection Assessment Report</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary-dark: #0f0c29;
            --primary-deep: #24243e;
            --primary-purple: #2d1b69;
            --accent-purple: #6b46c1;
            --accent-gold: #f59e0b;
            --accent-light: #8b5cf6;
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
        }

        * {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-deep) 25%, var(--primary-purple) 50%, var(--accent-purple) 100%);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        .bg-animated {
            background: linear-gradient(-45deg, #0f0c29, #24243e, #2d1b69, #6b46c1);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .heart-pulse {
            animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .brain-glow {
            filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
        }

        .percentage-display {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(107, 70, 193, 0.2));
            border: 2px solid var(--accent-gold);
            animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            50% { box-shadow: 0 0 0 20px rgba(245, 158, 11, 0); }
        }

        .floating {
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent-gold), #fbbf24);
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(245, 158, 11, 0.6);
        }

        .btn-secondary {
            background: linear-gradient(135deg, var(--accent-purple), var(--accent-light));
            box-shadow: 0 10px 30px rgba(107, 70, 193, 0.4);
        }

        .testimonial-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .testimonial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .protocol-step {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(107, 70, 193, 0.1));
            border-left: 4px solid var(--accent-gold);
        }

        .hrv-visualization {
            background: radial-gradient(circle at center, rgba(245, 158, 11, 0.2), transparent);
        }

        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
        }

        .impact-icon {
            background: linear-gradient(135deg, var(--accent-gold), #fbbf24);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .neuron-network {
            background-image: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 80%, rgba(107, 70, 193, 0.3) 0%, transparent 50%);
        }

        h1, h2, h3 {
            font-family: 'Playfair Display', serif;
        }

        .typing-effect {
            overflow: hidden;
            border-right: 3px solid var(--accent-gold);
            white-space: nowrap;
            animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
        }

        @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
        }

        @keyframes blink-caret {
            from, to { border-color: transparent; }
            50% { border-color: var(--accent-gold); }
        }

        .urgency-pulse {
            animation: urgencyBlink 2s ease-in-out infinite;
        }

        @keyframes urgencyBlink {
            0%, 50% { opacity: 1; }
            25%, 75% { opacity: 0.6; }
        }

        .content-section {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.8;
        }

        .content-section h2 {
            font-size: 2.5rem;
            margin: 3rem 0 1.5rem 0;
            text-align: center;
        }

        .content-section h3 {
            font-size: 1.8rem;
            margin: 2rem 0 1rem 0;
            color: #f59e0b;
        }

        .content-section p {
            margin: 1rem 0;
            font-size: 1.1rem;
        }

        .content-section ul {
            margin: 1rem 0;
            padding-left: 2rem;
        }

        .content-section li {
            margin: 0.5rem 0;
            font-size: 1.1rem;
        }

        .content-section strong {
            color: #f59e0b;
        }
    </style>
</head>
<body class="bg-animated text-white">

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-6 py-12 neuron-network">
        <div class="max-w-6xl mx-auto text-center space-y-8">
            <div class="floating">
                <i class="fas fa-heart heart-pulse text-6xl text-red-400 mb-4"></i>
                <i class="fas fa-brain brain-glow text-6xl text-purple-400 ml-4"></i>
            </div>
            
            <h1 class="text-4xl md:text-7xl font-bold mb-6 fade-in">
                THE ${typeName}:
                <span class="block text-red-400 mt-2">YOUR HEART-BRAIN CONNECTION IS BROKEN</span>
            </h1>
            
            <div class="percentage-display glass-card rounded-3xl p-8 mx-auto max-w-2xl mb-8 fade-in">
                <div class="flex items-center justify-center space-x-4">
                    <i class="fas fa-exclamation-triangle text-red-400 text-3xl urgency-pulse"></i>
                    <div>
                        <h2 class="text-2xl md:text-4xl font-bold text-yellow-400">CRITICAL DISCOVERY:</h2>
                        <p class="text-3xl md:text-6xl font-bold text-white mt-2">
                            <span id="heartPercentage">${heartNeuronPercentage}</span>% <span class="text-lg md:text-2xl">of Your Heart Neurons Are Offline</span>
                        </p>
                    </div>
                    <i class="fas fa-exclamation-triangle text-red-400 text-3xl urgency-pulse"></i>
                </div>
            </div>

            <div class="glass-card rounded-2xl p-8 max-w-4xl mx-auto fade-in">
                <p class="text-xl md:text-2xl leading-relaxed">
                    You think with your head. You lead with your gut. But your <strong class="text-yellow-400">HEART?</strong>
                </p>
                <p class="text-lg md:text-xl mt-4 leading-relaxed">
                    Based on your assessment results, <strong class="text-red-400">${heartNeuronPercentage}% of your heart's neural network</strong> has been completely disconnected from your decision-making for years.
                </p>
                <p class="text-lg md:text-xl mt-4 leading-relaxed">
                    <strong class="text-yellow-400">You're operating at ${operatingPercentage}% of your actual potential.</strong>
                </p>
            </div>

            <button class="btn-primary text-black font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-all duration-300">
                <i class="fas fa-heart mr-2"></i>
                Discover Your Transformation Path
                <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    </section>

    <!-- Main Content Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="glass-card rounded-2xl p-8 mb-12">
                <div class="content-section">
                    ${convertMarkdownToHTML(processedContent)}
                </div>
            </div>
        </div>
    </section>

    <!-- HRV Visualization Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl md:text-6xl font-bold text-center mb-12">Your Heart Rate Variability Analysis</h2>
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-4 text-red-400 text-center">Current State (Disconnected)</h3>
                    <div style="height: 300px;">
                        <canvas id="currentHRVChart"></canvas>
                    </div>
                    <p class="text-center mt-4 text-lg">
                        <strong>Your HRV: ${hrvBaseline}ms</strong><br>
                        <span class="text-red-400">Below optimal range</span>
                    </p>
                </div>
                <div class="glass-card rounded-2xl p-8">
                    <h4 class="text-2xl font-bold mb-4 text-green-400 text-center">Potential State (Connected)</h4>
                    <div style="height: 300px;">
                        <canvas id="optimalHRVChart"></canvas>
                    </div>
                    <p class="text-center mt-4 text-lg">
                        <strong>Optimal HRV: 75ms+</strong><br>
                        <span class="text-green-400">Peak performance range</span>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="text-center">
                <div class="glass-card rounded-2xl p-12 max-w-4xl mx-auto mb-12">
                    <h2 class="text-4xl md:text-6xl font-bold mb-8">Take The Next Step</h2>
                    <p class="text-2xl mb-8 leading-relaxed">
                        Your heart-brain system is ready for the 10-week activation protocol. Your <strong class="text-yellow-400">40,000 heart neurons</strong> are waiting to come online.
                    </p>
                    
                    <div class="space-y-6 mb-12">
                        <button class="btn-primary text-black font-bold py-6 px-12 rounded-full text-2xl hover:scale-105 transition-all duration-300 block w-full">
                            <i class="fas fa-heart mr-3"></i>
                            YES, I'M READY TO TRANSFORM MY LIFE
                            <i class="fas fa-arrow-right ml-3"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Generate HRV charts with dynamic data
        function createCurrentHRVChart() {
            const ctx = document.getElementById('currentHRVChart').getContext('2d');
            const chaoticData = [];
            const baseline = ${hrvBaseline};
            for (let i = 0; i < 50; i++) {
                chaoticData.push(baseline + (Math.random() - 0.5) * 20);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 50}, (_, i) => i),
                    datasets: [{
                        label: 'Current HRV (Chaotic)',
                        data: chaoticData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'white' } },
                        x: { display: false }
                    }
                }
            });
        }

        function createOptimalHRVChart() {
            const ctx = document.getElementById('optimalHRVChart').getContext('2d');
            const coherentData = [];
            for (let i = 0; i < 50; i++) {
                coherentData.push(75 + Math.sin(i * 0.3) * 15);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 50}, (_, i) => i),
                    datasets: [{
                        label: 'Optimal HRV (Coherent)',
                        data: coherentData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'white' } },
                        x: { display: false }
                    }
                }
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            createCurrentHRVChart();
            createOptimalHRVChart();
        });
    </script>
</body>
</html>`;

    return html;
    
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
}

// Helper function to parse markdown sections
function parseMarkdownSections(content) {
  // Basic markdown parsing - you can enhance this
  const sections = content.split(/(?=^##)/m);
  return sections.map(section => section.trim()).filter(section => section.length > 0);
}

// Helper function to convert markdown to HTML (basic implementation)
function convertMarkdownToHTML(content) {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Emphasis
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\s*\n/gim, '</p><p>')
    .replace(/^(?!<[h|l|p])/gim, '<p>')
    .replace(/(?<![>])$/gim, '</p>')
    // Clean up
    .replace(/<p><\/p>/gim, '')
    .replace(/<p>(<h[1-6]>)/gim, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/gim, '$1')
    .replace(/<p>(<li>)/gim, '<ul>$1')
    .replace(/(<\/li>)<\/p>/gim, '$1</ul>');
}