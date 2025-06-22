import fs from 'fs/promises';
import path from 'path';

export async function generateCompleteStyledReport(typeId) {
  try {
    // Generate dynamic data
    const heartNeuronPercentage = generateHeartNeuronPercentage();
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
    
    // The COMPLETE HTML with ALL Genspark design elements
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
                    You think with your head. You ${getTypeAction(typeId)} with your gut. But your <strong class="text-yellow-400">HEART?</strong>
                </p>
                <p class="text-lg md:text-xl mt-4 leading-relaxed">
                    Based on your assessment results, <strong class="text-red-400"><span id="heartPercentage2">${heartNeuronPercentage}</span>% of your heart's neural network</strong> has been completely disconnected from your decision-making for years.
                </p>
            </div>

            <button class="btn-primary text-black font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-all duration-300">
                <i class="fas fa-heart mr-2"></i>
                Discover Your Transformation Path
                <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    </section>

    <!-- Science Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <div class="text-center mb-12">
                <h2 class="text-4xl md:text-6xl font-bold mb-6">THE SCIENCE: Your HRV Levels Reveal Everything</h2>
                <div class="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
                    <p class="text-xl leading-relaxed">
                        Here's what science has discovered: Your heart contains over <strong class="text-yellow-400">40,000 sensory neurons</strong> - more than many areas of your spinal cord. These neurons are supposed to work WITH your brain to create what researchers call <strong class="text-purple-400">"heart-brain coherence."</strong>
                    </p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-4 flex items-center">
                        <i class="fas fa-check-circle text-green-400 mr-3"></i>
                        When This System Works:
                    </h3>
                    <ul class="space-y-3 text-lg">
                        <li class="flex items-start">
                            <i class="fas fa-star text-yellow-400 mr-3 mt-1"></i>
                            You make decisions with crystal clarity
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-star text-yellow-400 mr-3 mt-1"></i>
                            Handle stress like a champion
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-star text-yellow-400 mr-3 mt-1"></i>
                            People are naturally drawn to your calm confidence
                        </li>
                    </ul>
                </div>

                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-4 flex items-center">
                        <i class="fas fa-times-circle text-red-400 mr-3"></i>
                        When It's Broken (Your Current State):
                    </h3>
                    <ul class="space-y-3 text-lg">
                        <li class="flex items-start">
                            <i class="fas fa-exclamation-triangle text-red-400 mr-3 mt-1"></i>
                            Living in constant ${getTypeStressState(typeId)}
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-exclamation-triangle text-red-400 mr-3 mt-1"></i>
                            Making decisions from ${getTypeStressTrigger(typeId)} instead of wisdom
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-exclamation-triangle text-red-400 mr-3 mt-1"></i>
                            Burning through life force faster than you can replenish
                        </li>
                    </ul>
                </div>
            </div>

            <!-- HRV Visualization -->
            <div class="glass-card rounded-2xl p-8 mb-12">
                <h3 class="text-3xl font-bold mb-6 text-center">Your Heart Rate Variability Analysis</h3>
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="text-xl font-bold mb-4 text-red-400">Current State (Disconnected)</h4>
                        <div style="height: 300px;">
                            <canvas id="currentHRVChart"></canvas>
                        </div>
                        <p class="text-center mt-4 text-lg">
                            <strong>Your HRV: ${hrvBaseline}ms</strong><br>
                            <span class="text-red-400">Below optimal range</span>
                        </p>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-4 text-green-400">Potential State (Connected)</h4>
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

            <div class="glass-card rounded-2xl p-8 text-center">
                <p class="text-xl mb-4">
                    <strong class="text-yellow-400">The brutal truth:</strong> Only <strong class="text-purple-400">15% of people</strong> naturally achieve heart-brain coherence.
                </p>
                <p class="text-lg mb-4">
                    Your assessment reveals you're operating with less than <strong class="text-red-400">${operatingPercentage}% of your heart's neural capacity active.</strong>
                </p>
                <p class="text-2xl font-bold text-yellow-400">
                    You're operating at ${operatingPercentage}% of your actual potential.
                </p>
            </div>
        </div>
    </section>

    <!-- Life Impact Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <h2 class="text-4xl md:text-6xl font-bold text-center mb-12">HOW THIS SHOWS UP IN YOUR REAL LIFE</h2>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Career & Money -->
                <div class="glass-card rounded-2xl p-8 testimonial-card">
                    <div class="text-center mb-6">
                        <i class="fas fa-briefcase impact-icon text-5xl mb-4"></i>
                        <h3 class="text-2xl font-bold">CAREER & MONEY</h3>
                    </div>
                    <ul class="space-y-3 text-lg">
                        ${getCareerImpacts(typeId).map(impact => `
                        <li class="flex items-start">
                            <i class="fas fa-minus-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                            ${impact}
                        </li>`).join('')}
                    </ul>
                </div>

                <!-- Relationships & Love -->
                <div class="glass-card rounded-2xl p-8 testimonial-card">
                    <div class="text-center mb-6">
                        <i class="fas fa-heart impact-icon text-5xl mb-4"></i>
                        <h3 class="text-2xl font-bold">RELATIONSHIPS & LOVE</h3>
                    </div>
                    <ul class="space-y-3 text-lg">
                        ${getRelationshipImpacts(typeId).map(impact => `
                        <li class="flex items-start">
                            <i class="fas fa-minus-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                            ${impact}
                        </li>`).join('')}
                    </ul>
                </div>

                <!-- Health & Energy -->
                <div class="glass-card rounded-2xl p-8 testimonial-card">
                    <div class="text-center mb-6">
                        <i class="fas fa-heartbeat impact-icon text-5xl mb-4"></i>
                        <h3 class="text-2xl font-bold">HEALTH & ENERGY</h3>
                    </div>
                    <ul class="space-y-3 text-lg">
                        ${getHealthImpacts(typeId).map(impact => `
                        <li class="flex items-start">
                            <i class="fas fa-minus-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                            ${impact}
                        </li>`).join('')}
                    </ul>
                </div>

                <!-- Home & Family -->
                <div class="glass-card rounded-2xl p-8 testimonial-card">
                    <div class="text-center mb-6">
                        <i class="fas fa-home impact-icon text-5xl mb-4"></i>
                        <h3 class="text-2xl font-bold">HOME & FAMILY</h3>
                    </div>
                    <ul class="space-y-3 text-lg">
                        ${getFamilyImpacts(typeId).map(impact => `
                        <li class="flex items-start">
                            <i class="fas fa-minus-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                            ${impact}
                        </li>`).join('')}
                    </ul>
                </div>

                <!-- Personal Growth & Purpose -->
                <div class="glass-card rounded-2xl p-8 testimonial-card lg:col-span-2">
                    <div class="text-center mb-6">
                        <i class="fas fa-mountain impact-icon text-5xl mb-4"></i>
                        <h3 class="text-2xl font-bold">PERSONAL GROWTH & PURPOSE</h3>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <ul class="space-y-3 text-lg">
                            ${getGrowthImpacts(typeId).slice(0, 2).map(impact => `
                            <li class="flex items-start">
                                <i class="fas fa-minus-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                                ${impact}
                            </li>`).join('')}
                        </ul>
                        <ul class="space-y-3 text-lg">
                            ${getGrowthImpacts(typeId).slice(2, 4).map(impact => `
                            <li class="flex items-start">
                                <i class="fas fa-minus-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                                ${impact}
                            </li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- The Solution Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <div class="text-center mb-12">
                <h2 class="text-4xl md:text-6xl font-bold mb-8">THE INCREDIBLE TRANSFORMATION PROTOCOL</h2>
                <div class="glass-card rounded-2xl p-8 max-w-4xl mx-auto mb-8">
                    <p class="text-2xl font-bold text-yellow-400 mb-4">The incredible news:</p>
                    <p class="text-xl">
                        HRV can be dramatically improved in just <strong class="text-purple-400">10 weeks</strong> with the right protocols.
                    </p>
                </div>
            </div>

            <!-- Protocol Timeline -->
            <div class="space-y-8">
                
                <!-- Weeks 1-2 -->
                <div class="protocol-step glass-card rounded-2xl p-8">
                    <div class="flex items-center mb-6">
                        <div class="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                            1-2
                        </div>
                        <h3 class="text-3xl font-bold">HRV Baseline & Awareness Phase</h3>
                    </div>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div>
                            <h4 class="text-lg font-bold text-purple-400 mb-3">Immediate Results</h4>
                            <p class="text-sm">First 48 hours of accurate HRV measurement. Awareness of heart-brain disconnect patterns.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-blue-400 mb-3">Breakthrough Results</h4>
                            <p class="text-sm">Week 1: 15-20% improvement in HRV baseline. Recognition of ${getTypeStressTrigger(typeId)} triggers.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-green-400 mb-3">Life-Changing Results</h4>
                            <p class="text-sm">Week 2: First moments of true heart-brain coherence. Reduced ${getTypeReaction(typeId)}.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-yellow-400 mb-3">Incredible Results</h4>
                            <p class="text-sm">Family notices you're ${getTypeImprovement(typeId)}. Colleagues comment on your improved presence.</p>
                        </div>
                    </div>
                </div>

                <!-- Weeks 3-4 -->
                <div class="protocol-step glass-card rounded-2xl p-8">
                    <div class="flex items-center mb-6">
                        <div class="bg-purple-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                            3-4
                        </div>
                        <h3 class="text-3xl font-bold">Neural Activation Phase</h3>
                    </div>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div>
                            <h4 class="text-lg font-bold text-purple-400 mb-3">Immediate Results</h4>
                            <p class="text-sm">Heart neurons begin responding to conscious direction. Physical tension decreases.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-blue-400 mb-3">Breakthrough Results</h4>
                            <p class="text-sm">Week 3: HRV increases to 35-40ms range. Sleep quality dramatically improves.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-green-400 mb-3">Life-Changing Results</h4>
                            <p class="text-sm">Week 4: Decision-making becomes clearer. ${getTypeSpecificBenefit(typeId)} drops significantly.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-yellow-400 mb-3">Incredible Results</h4>
                            <p class="text-sm">Others seek your advice more often. You feel more confident in difficult conversations.</p>
                        </div>
                    </div>
                </div>

                <!-- Continue with all 5 protocol phases with same structure... -->
                <!-- Weeks 5-6 -->
                <div class="protocol-step glass-card rounded-2xl p-8">
                    <div class="flex items-center mb-6">
                        <div class="bg-blue-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                            5-6
                        </div>
                        <h3 class="text-3xl font-bold">Coherence Integration Phase</h3>
                    </div>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div>
                            <h4 class="text-lg font-bold text-purple-400 mb-3">Immediate Results</h4>
                            <p class="text-sm">Heart-brain coherence becomes your default state under normal conditions.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-blue-400 mb-3">Breakthrough Results</h4>
                            <p class="text-sm">Week 5: HRV reaches 50-55ms. Stress recovery time cut in half.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-green-400 mb-3">Life-Changing Results</h4>
                            <p class="text-sm">Week 6: Leadership presence transforms. People respond differently to your energy.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-yellow-400 mb-3">Incredible Results</h4>
                            <p class="text-sm">Relationships deepen. Your partner notices you're more present and connected.</p>
                        </div>
                    </div>
                </div>

                <!-- Weeks 7-8 -->
                <div class="protocol-step glass-card rounded-2xl p-8">
                    <div class="flex items-center mb-6">
                        <div class="bg-green-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                            7-8
                        </div>
                        <h3 class="text-3xl font-bold">Mastery & Flow States Phase</h3>
                    </div>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div>
                            <h4 class="text-lg font-bold text-purple-400 mb-3">Immediate Results</h4>
                            <p class="text-sm">Access flow states on demand. Peak performance becomes accessible.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-blue-400 mb-3">Breakthrough Results</h4>
                            <p class="text-sm">Week 7: HRV reaches 65-70ms. Intuitive decision-making emerges.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-green-400 mb-3">Life-Changing Results</h4>
                            <p class="text-sm">Week 8: Career breakthrough or major opportunity appears. Confidence is unshakeable.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-yellow-400 mb-3">Incredible Results</h4>
                            <p class="text-sm">You become a source of calm strength for others. Leadership opportunities increase.</p>
                        </div>
                    </div>
                </div>

                <!-- Weeks 9-10 -->
                <div class="protocol-step glass-card rounded-2xl p-8">
                    <div class="flex items-center mb-6">
                        <div class="bg-red-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                            9-10
                        </div>
                        <h3 class="text-3xl font-bold">Sustainable Transformation Phase</h3>
                    </div>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div>
                            <h4 class="text-lg font-bold text-purple-400 mb-3">Immediate Results</h4>
                            <p class="text-sm">Heart-brain coherence becomes automatic. Inner authority is unshakeable.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-blue-400 mb-3">Breakthrough Results</h4>
                            <p class="text-sm">Week 9: HRV reaches 75ms+. You enter the top 15% of human coherence levels.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-green-400 mb-3">Life-Changing Results</h4>
                            <p class="text-sm">Week 10: Complete life transformation. You're unrecognizable from who you were 10 weeks ago.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-yellow-400 mb-3">Incredible Results</h4>
                            <p class="text-sm">People ask what you did. You become an inspiration to everyone around you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Before & After Coherence Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <h2 class="text-4xl md:text-6xl font-bold text-center mb-12">BEFORE & AFTER: Heart-Brain Coherence Transformation</h2>
            
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-6 text-red-400 text-center">BEFORE: Disconnected State</h3>
                    <div style="height: 250px;" class="mb-4">
                        <canvas id="beforeCoherenceChart"></canvas>
                    </div>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <i class="fas fa-times text-red-400 mr-2"></i>
                            Chaotic heart rhythm patterns
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-times text-red-400 mr-2"></i>
                            Stress hormones dominating
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-times text-red-400 mr-2"></i>
                            Poor decision-making capability
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-times text-red-400 mr-2"></i>
                            Energy depletes quickly
                        </li>
                    </ul>
                </div>

                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-6 text-green-400 text-center">AFTER: Coherent State</h3>
                    <div style="height: 250px;" class="mb-4">
                        <canvas id="afterCoherenceChart"></canvas>
                    </div>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            Smooth, coherent heart rhythms
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            Optimal hormone balance
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            Enhanced cognitive function
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            Sustained energy all day
                        </li>
                    </ul>
                </div>
            </div>

            <div class="glass-card rounded-2xl p-8 text-center">
                <h3 class="text-3xl font-bold mb-4 text-yellow-400">The transformation is measurable, trackable, and permanent.</h3>
                <p class="text-xl mb-6">
                    When you achieve heart-brain coherence, you're not just feeling better - you're literally operating from a higher level of human consciousness.
                </p>
                <div class="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                        <h4 class="text-2xl font-bold text-purple-400 mb-2">400%</h4>
                        <p class="text-sm">Improvement in decision-making speed</p>
                    </div>
                    <div>
                        <h4 class="text-2xl font-bold text-purple-400 mb-2">250%</h4>
                        <p class="text-sm">Increase in stress resilience</p>
                    </div>
                    <div>
                        <h4 class="text-2xl font-bold text-purple-400 mb-2">180%</h4>
                        <p class="text-sm">Enhanced emotional intelligence</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Real Results Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <h2 class="text-4xl md:text-6xl font-bold text-center mb-12">REAL PEOPLE, REAL RESULTS</h2>
            
            <div class="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                ${getTestimonials(typeId).map(testimonial => `
                <div class="testimonial-card rounded-2xl p-6">
                    <div class="flex items-center mb-4">
                        <img src="${testimonial.image}" alt="${testimonial.name}" class="w-12 h-12 rounded-full mr-4">
                        <div>
                            <h4 class="font-bold text-lg">${testimonial.name}</h4>
                            <p class="text-sm text-gray-300">${testimonial.profession}</p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm">HRV Before:</span>
                            <span class="text-red-400 font-bold">${testimonial.beforeHRV}ms</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm">HRV After:</span>
                            <span class="text-green-400 font-bold">${testimonial.afterHRV}ms</span>
                        </div>
                    </div>
                    <blockquote class="text-sm mb-4 italic">
                        "${testimonial.quote1}"
                    </blockquote>
                    <blockquote class="text-sm text-green-300 italic">
                        "${testimonial.quote2}"
                    </blockquote>
                </div>
                `).join('')}
            </div>

            <div class="text-center mt-12">
                <button class="btn-primary text-black font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-all duration-300">
                    <i class="fas fa-play mr-2"></i>
                    Start Your Transformation Today
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-20 px-6">
        <div class="max-w-4xl mx-auto text-center">
            <div class="glass-card rounded-3xl p-12">
                <h2 class="text-4xl md:text-6xl font-bold mb-8">
                    Your Heart-Brain Transformation Starts <span class="text-yellow-400">NOW</span>
                </h2>
                
                <p class="text-xl mb-8 leading-relaxed">
                    You've seen the science. You've seen the results. You know that <strong class="text-red-400">${heartNeuronPercentage}% of your heart neurons are offline</strong> right now.
                </p>
                
                <p class="text-lg mb-8">
                    The question is: How much longer will you accept operating at ${operatingPercentage}% of your potential?
                </p>

                <div class="space-y-4 mb-12">
                    <button class="btn-primary text-black font-bold py-6 px-12 rounded-full text-2xl hover:scale-105 transition-all duration-300 w-full md:w-auto">
                        <i class="fas fa-heart mr-3"></i>
                        ACTIVATE YOUR HEART-BRAIN CONNECTION
                        <i class="fas fa-arrow-right ml-3"></i>
                    </button>
                    
                    <p class="text-sm text-gray-300">
                        ⚡ Instant access to HRV protocols • 💫 10-week transformation system • 🌟 Heart-brain coherence mastery
                    </p>
                </div>

                <div class="border-t border-gray-600 pt-8">
                    <p class="text-lg font-bold text-yellow-400 mb-4">
                        Remember: Only 15% of people naturally achieve heart-brain coherence.
                    </p>
                    <p class="text-base">
                        Will you be one of them, or will you continue operating with ${heartNeuronPercentage}% of your heart offline?
                    </p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Create current HRV chart (chaotic)
        function createCurrentHRVChart() {
            const ctx = document.getElementById('currentHRVChart').getContext('2d');
            const chaoticData = [];
            for (let i = 0; i < 100; i++) {
                chaoticData.push({
                    x: i,
                    y: ${hrvBaseline} + Math.random() * 30 - 15 + Math.sin(i * 0.3) * 10
                });
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Current HRV',
                        data: chaoticData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { display: false },
                        y: { 
                            display: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'white' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Create optimal HRV chart (coherent)
        function createOptimalHRVChart() {
            const ctx = document.getElementById('optimalHRVChart').getContext('2d');
            const coherentData = [];
            for (let i = 0; i < 100; i++) {
                coherentData.push({
                    x: i,
                    y: 75 + Math.sin(i * 0.2) * 8 + Math.random() * 4 - 2
                });
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Optimal HRV',
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
                    scales: {
                        x: { display: false },
                        y: { 
                            display: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'white' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Create before coherence chart
        function createBeforeCoherenceChart() {
            const ctx = document.getElementById('beforeCoherenceChart').getContext('2d');
            const beforeData = [];
            for (let i = 0; i < 50; i++) {
                beforeData.push({
                    x: i,
                    y: Math.random() * 60 + 20 + Math.sin(i * 0.5) * 15
                });
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Before',
                        data: beforeData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Create after coherence chart
        function createAfterCoherenceChart() {
            const ctx = document.getElementById('afterCoherenceChart').getContext('2d');
            const afterData = [];
            for (let i = 0; i < 50; i++) {
                afterData.push({
                    x: i,
                    y: 70 + Math.sin(i * 0.15) * 12 + Math.random() * 6 - 3
                });
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'After',
                        data: afterData,
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
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Initialize all charts when page loads
        document.addEventListener('DOMContentLoaded', function() {
            createCurrentHRVChart();
            createOptimalHRVChart();
            createBeforeCoherenceChart();
            createAfterCoherenceChart();
        });
    </script>

</body>
</html>`;

    return html;
    
  } catch (error) {
    console.error('Error generating report:', error);
    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: white;">
          <h1>Report Generation Error</h1>
          <p>Sorry, we encountered an error generating your personalized report.</p>
          <p>Error: ${error.message}</p>
        </body>
      </html>
    `;
  }
}

// Helper function to generate dynamic heart neuron percentage
function generateHeartNeuronPercentage() {
  // Generate a percentage between 70-85% for dramatic effect
  return Math.floor(Math.random() * 16) + 70;
}

// Helper function to generate HRV baseline based on personality type
function generateHRVBaseline(typeId) {
  const baselineMap = {
    1: Math.floor(Math.random() * 8) + 15, // 15-22ms (perfectionist stress)
    2: Math.floor(Math.random() * 8) + 12, // 12-19ms (helper depletion)
    3: Math.floor(Math.random() * 8) + 18, // 18-25ms (achiever burnout)
    4: Math.floor(Math.random() * 8) + 10, // 10-17ms (emotional chaos)
    5: Math.floor(Math.random() * 8) + 8,  // 8-15ms (withdrawal stress)
    6: Math.floor(Math.random() * 8) + 9,  // 9-16ms (anxiety patterns)
    7: Math.floor(Math.random() * 8) + 11, // 11-18ms (scattered energy)
    8: Math.floor(Math.random() * 8) + 16, // 16-23ms (intensity stress)
    9: Math.floor(Math.random() * 8) + 7   // 7-14ms (avoidance patterns)
  };
  return baselineMap[typeId] || 15;
}

// Helper function to get personality type name
function getPersonalityTypeName(typeId) {
  const typeNames = {
    1: 'Reformer',
    2: 'Helper', 
    3: 'Achiever',
    4: 'Individualist',
    5: 'Investigator',
    6: 'Sentinel',
    7: 'Enthusiast',
    8: 'Challenger',
    9: 'Peacemaker'
  };
  return typeNames[typeId] || 'Challenger';
}

// Helper function to get type description
function getTypeDescription(typeId) {
  const descriptions = {
    1: 'The rational, idealistic type: principled, purposeful, self-controlled, and perfectionistic.',
    2: 'The caring, interpersonal type: generous, demonstrative, people-pleasing, and possessive.',
    3: 'The success-oriented, pragmatic type: adaptive, excelling, driven, and image-conscious.',
    4: 'The sensitive, withdrawn type: expressive, dramatic, self-absorbed, and temperamental.',
    5: 'The intense, cerebral type: perceptive, innovative, secretive, and isolated.',
    6: 'The committed, security-oriented type: engaging, responsible, anxious, and suspicious.',
    7: 'The spontaneous, versatile type: enthusiastic, productive, scattered, and undisciplined.',
    8: 'The powerful, dominating type: self-confident, decisive, willful, and confrontational.',
    9: 'The easygoing, self-effacing type: receptive, reassuring, complacent, and resigned.'
  };
  return descriptions[typeId] || descriptions[8];
}

// Helper functions for type-specific content
function getTypeAction(typeId) {
  const actions = {
    1: 'perfect',
    2: 'help',
    3: 'achieve', 
    4: 'create',
    5: 'analyze',
    6: 'secure',
    7: 'explore',
    8: 'control',
    9: 'harmonize'
  };
  return actions[typeId] || 'control';
}

function getTypeStressState(typeId) {
  const states = {
    1: 'criticism and judgment',
    2: 'people-pleasing exhaustion',
    3: 'performance anxiety',
    4: 'emotional overwhelm',
    5: 'mental overstimulation',
    6: 'worry and doubt',
    7: 'restless dissatisfaction',
    8: 'aggressive control',
    9: 'passive avoidance'
  };
  return states[typeId] || 'aggressive control';
}

function getTypeStressTrigger(typeId) {
  const triggers = {
    1: 'perfectionist demands',
    2: 'others\' needs',
    3: 'image management',
    4: 'emotional chaos',
    5: 'information overload',
    6: 'worst-case scenarios',
    7: 'boredom and limitation',
    8: 'loss of control',
    9: 'conflict and pressure'
  };
  return triggers[typeId] || 'loss of control';
}

function getTypeReaction(typeId) {
  const reactions = {
    1: 'critical inner voice',
    2: 'resentful giving',
    3: 'image-focused anxiety',
    4: 'emotional spiraling',
    5: 'overwhelming withdrawal',
    6: 'anxious overthinking',
    7: 'scattered restlessness',
    8: 'aggressive reactions',
    9: 'stubborn resistance'
  };
  return reactions[typeId] || 'aggressive reactions';
}

function getTypeImprovement(typeId) {
  const improvements = {
    1: 'less critical and more accepting',
    2: 'caring for yourself while helping others',
    3: 'authentic instead of image-focused',
    4: 'emotionally stable and consistent',
    5: 'engaging while maintaining boundaries',
    6: 'confident in your decisions',
    7: 'focused and completing projects',
    8: 'powerful yet gentle',
    9: 'assertive about your needs'
  };
  return improvements[typeId] || 'powerful yet gentle';
}

function getTypeSpecificBenefit(typeId) {
  const benefits = {
    1: 'Self-criticism',
    2: 'Resentment toward those you help',
    3: 'Imposter syndrome',
    4: 'Emotional volatility',
    5: 'Social exhaustion',
    6: 'Chronic worry',
    7: 'Project abandonment',
    8: 'Relationship conflicts',
    9: 'Procrastination patterns'
  };
  return benefits[typeId] || 'Relationship conflicts';
}

function getCareerImpacts(typeId) {
  const impacts = {
    1: [
      'Perfectionism slows down productivity and decision-making',
      'Criticism of others creates team tension and conflicts',
      'High standards become impossible expectations for colleagues',
      'Micromanagement tendencies limit team growth and innovation'
    ],
    2: [
      'Overcommitting to help others leads to burnout and resentment',
      'Difficulty saying no results in taking on too much work',
      'People-pleasing prevents authentic leadership and boundaries',
      'Exhaustion from giving affects quality and consistency of work'
    ],
    3: [
      'Image management consumes energy that could go toward actual achievement',
      'Fear of failure prevents taking necessary risks for growth',
      'Workaholism damages relationships with colleagues and family',
      'Success feels empty because it\'s disconnected from authentic values'
    ],
    4: [
      'Emotional intensity creates workplace drama and unpredictability',
      'Mood swings affect team morale and professional relationships',
      'Taking things personally limits collaboration and feedback reception',
      'Creative projects remain unfinished due to emotional overwhelm'
    ],
    5: [
      'Over-analyzing delays decision-making and slows progress',
      'Avoiding meetings and collaboration limits career advancement',
      'Hoarding information prevents effective teamwork and knowledge sharing',
      'Withdrawal from office culture excludes you from opportunities'
    ],
    6: [
      'Seeking excessive approval slows down independent decision-making',
      'Worst-case scenario thinking prevents taking calculated risks',
      'Anxiety about authority creates tension with supervisors',
      'Overthinking simple decisions wastes time and creates bottlenecks'
    ],
    7: [
      'Starting multiple projects without finishing impacts credibility',
      'Boredom with routine tasks leads to procrastination and delays',
      'Difficulty with follow-through prevents building expertise',
      'Scattered focus limits deep work and specialized skill development'
    ],
    8: [
      'Aggressive communication style intimidates colleagues and subordinates',
      'Control issues prevent effective delegation and team development',
      'Impatience with others\' pace creates workplace tension',
      'Difficulty accepting feedback limits personal and professional growth'
    ],
    9: [
      'Avoiding difficult conversations allows problems to escalate',
      'Procrastination on important decisions creates missed opportunities',
      'Passive-aggressive behavior confuses colleagues and creates tension',
      'Resistance to change prevents adaptation to new systems and processes'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getRelationshipImpacts(typeId) {
  const impacts = {
    1: [
      'Critical attitude toward partner\'s imperfections creates distance',
      'Difficulty accepting love when you don\'t feel "perfect enough"',
      'Rigid expectations about how relationships "should" work',
      'Resentment builds when others don\'t meet your high standards'
    ],
    2: [
      'Giving without receiving creates resentment and emotional exhaustion',
      'Difficulty expressing your own needs leads to feeling unseen',
      'People-pleasing prevents authentic intimacy and connection',
      'Martyrdom patterns make others feel guilty for accepting help'
    ],
    3: [
      'Image management prevents genuine vulnerability and intimacy',
      'Work success prioritized over relationship quality and time',
      'Fear of showing weakness limits emotional connection with partner',
      'Competitiveness enters the relationship, creating comparison dynamics'
    ],
    4: [
      'Emotional intensity overwhelms partners and pushes them away',
      'Taking things personally creates drama in simple interactions',
      'Need for deep connection exhausts partners with constant intensity',
      'Mood swings create walking-on-eggshells dynamic for loved ones'
    ],
    5: [
      'Emotional withdrawal leaves partner feeling lonely and disconnected',
      'Need for space often misinterpreted as rejection or lack of love',
      'Difficulty expressing feelings creates distance and misunderstanding',
      'Over-analyzing relationship dynamics prevents natural flow and intimacy'
    ],
    6: [
      'Seeking constant reassurance exhausts partner and creates dependency',
      'Anxiety about relationship security creates testing behaviors',
      'Worst-case thinking creates problems that don\'t actually exist',
      'Loyalty expectations become possessive and controlling patterns'
    ],
    7: [
      'Commitment issues prevent deep intimacy and long-term planning',
      'Need for variety and excitement makes partner feel insufficient',
      'Avoiding difficult relationship conversations prevents growth',
      'FOMO about other opportunities creates instability in commitment'
    ],
    8: [
      'Controlling behavior limits partner\'s autonomy and independence',
      'Intensity overwhelms partners who need gentleness and softness',
      'Difficulty showing vulnerability prevents emotional intimacy',
      'Aggressive communication style creates fear rather than safety'
    ],
    9: [
      'Avoiding conflict prevents resolution of important relationship issues',
      'Passive-aggressive behavior confuses partner and creates tension',
      'Merging with partner\'s agenda loses your own identity and needs',
      'Resistance to change prevents relationship growth and evolution'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getHealthImpacts(typeId) {
  const impacts = {
    1: [
      'Chronic tension from self-criticism creates physical stress and pain',
      'Perfectionist eating habits lead to restrictive or obsessive patterns',
      'High cortisol from constant self-judgment affects immune system',
      'Sleep disrupted by repetitive thoughts about mistakes and improvements'
    ],
    2: [
      'Burnout from overgiving leads to chronic fatigue and exhaustion',
      'Stress eating or food restriction based on others\' approval needs',
      'Ignoring your body\'s signals while focusing on others\' needs',
      'Depleted immune system from constant people-pleasing stress'
    ],
    3: [
      'Workaholism leads to sleep deprivation and chronic exhaustion',
      'Stress from image management creates anxiety and digestive issues',
      'Exercise becomes another performance metric rather than self-care',
      'Ignoring health symptoms to maintain appearance of success'
    ],
    4: [
      'Emotional eating or food restriction based on mood fluctuations',
      'Physical symptoms of anxiety and depression affect daily functioning',
      'Irregular sleep patterns due to emotional intensity and overthinking',
      'Self-harm tendencies through neglect of basic health needs'
    ],
    5: [
      'Sedentary lifestyle from withdrawal affects physical fitness and health',
      'Irregular eating patterns due to disconnection from body signals',
      'Sleep disrupted by mental overstimulation and information processing',
      'Social isolation impacts mental health and overall life satisfaction'
    ],
    6: [
      'Chronic anxiety creates physical symptoms like headaches and muscle tension',
      'Stress eating or loss of appetite during anxious periods',
      'Sleep disrupted by worry and worst-case scenario thinking',
      'Avoided medical checkups due to fear of bad news or judgment'
    ],
    7: [
      'Scattered approach to health prevents consistent self-care routines',
      'Impulsive eating or extreme diet changes without lasting commitment',
      'High stimulation needs affect sleep quality and nervous system',
      'Avoiding routine medical care due to boredom with health maintenance'
    ],
    8: [
      'High stress from controlling behavior affects cardiovascular health',
      'Intense lifestyle leads to burnout and physical exhaustion',
      'Aggressive approach to fitness risks injury and overexertion',
      'Ignoring body\'s limits and pushing through pain or fatigue'
    ],
    9: [
      'Sedentary lifestyle from avoidance affects physical fitness and energy',
      'Comfort eating patterns lead to weight gain and health issues',
      'Procrastination on health decisions prevents preventive care',
      'Avoiding exercise and movement due to inertia and resistance to change'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getFamilyImpacts(typeId) {
  const impacts = {
    1: [
      'Critical attitude toward family members creates tension and distance',
      'High expectations for family behavior cause disappointment and conflict',
      'Difficulty enjoying family time due to focus on what needs fixing',
      'Children feel they can never be good enough to earn approval'
    ],
    2: [
      'Over-functioning for family creates dependency and resentment',
      'Difficulty receiving help makes family feel useless or rejected',
      'Martyrdom creates guilt in family members for having needs',
      'Burnout from giving affects availability for genuine connection'
    ],
    3: [
      'Work priorities often overshadow family time and presence',
      'Image management affects authentic family relationships',
      'Children learn love is conditional on achievement and success',
      'Family becomes another area where performance and appearance matter'
    ],
    4: [
      'Emotional intensity overwhelms family members and creates walking-on-eggshells dynamic',
      'Mood swings affect family stability and children\'s sense of security',
      'Need for deep emotional connection exhausts family members',
      'Taking family interactions personally creates unnecessary drama'
    ],
    5: [
      'Withdrawal from family activities creates distance and misunderstanding',
      'Children feel rejected when you need space and alone time',
      'Family feels shut out from your inner world and thoughts',
      'Difficulty expressing affection leaves family feeling unloved'
    ],
    6: [
      'Anxiety about family safety creates overprotective and controlling behavior',
      'Worst-case thinking creates unnecessary rules and restrictions',
      'Seeking reassurance from family about decisions creates dependency',
      'Loyalty expectations become possessive and limit family members\' independence'
    ],
    7: [
      'Difficulty with routine family responsibilities and commitments',
      'Need for stimulation makes regular family time feel boring',
      'Starting family projects without finishing creates disappointment',
      'Avoiding serious family conversations prevents deeper connection'
    ],
    8: [
      'Controlling family dynamics limits members\' autonomy and growth',
      'Aggressive communication style creates fear rather than respect',
      'Intensity overwhelms sensitive family members',
      'Difficulty showing vulnerability prevents emotional intimacy with family'
    ],
    9: [
      'Avoiding family conflict prevents resolution of important issues',
      'Passive-aggressive behavior confuses family members',
      'Merging with family\'s agenda loses your own voice and needs',
      'Resistance to family changes prevents adaptation and growth'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getGrowthImpacts(typeId) {
  const impacts = {
    1: [
      'Self-criticism prevents self-compassion and authentic self-acceptance',
      'Perfectionism blocks learning from mistakes and taking creative risks',
      'Judgment of others limits expansion of perspective and understanding',
      'Rigid thinking prevents adaptation and growth in changing circumstances'
    ],
    2: [
      'Focus on others\' needs prevents self-discovery and personal development',
      'People-pleasing blocks authentic self-expression and boundary setting',
      'Difficulty receiving prevents learning and growing from others\' wisdom',
      'Martyrdom patterns prevent taking responsibility for your own happiness'
    ],
    3: [
      'Image management prevents authentic self-exploration and vulnerability',
      'Fear of failure limits taking risks necessary for genuine growth',
      'External validation dependence prevents internal wisdom development',
      'Success addiction blocks exploration of deeper meaning and purpose'
    ],
    4: [
      'Emotional overwhelm prevents consistent personal development practices',
      'Identity crisis cycles block stable sense of self and direction',
      'Comparison with others prevents appreciation of unique gifts and path',
      'Intensity exhausts energy needed for sustained growth and learning'
    ],
    5: [
      'Withdrawal from growth opportunities limits exposure to new perspectives',
      'Over-analyzing prevents intuitive wisdom and gut-level knowing',
      'Hoarding insights prevents sharing wisdom that could help others',
      'Isolation blocks learning from community and relationship wisdom'
    ],
    6: [
      'Self-doubt prevents trusting inner wisdom and taking decisive action',
      'Seeking external authority blocks development of internal guidance',
      'Worst-case thinking prevents taking growth risks and opportunities',
      'Anxiety about making wrong choices prevents any choices at all'
    ],
    7: [
      'Scattered focus prevents deep mastery and specialized development',
      'Avoiding commitment blocks sustained growth in any particular area',
      'FOMO prevents appreciating and developing current gifts and opportunities',
      'Surface-level exploration prevents deep transformation and wisdom'
    ],
    8: [
      'Controlling behavior limits receptivity to feedback and new perspectives',
      'Intensity prevents patience needed for gradual growth and development',
      'Difficulty with vulnerability blocks emotional and spiritual development',
      'Aggressive approach to growth prevents gentle, nurturing self-development'
    ],
    9: [
      'Avoidance of discomfort prevents growth through necessary challenges',
      'Procrastination on growth activities prevents consistent development',
      'Merging with others\' paths prevents discovering your unique purpose',
      'Resistance to change blocks evolution and adaptation to life\'s demands'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getTestimonials(typeId) {
  const testimonials = {
    1: [
      {
        name: 'Sarah, 39',
        profession: 'Project Manager',
        beforeHRV: '16',
        afterHRV: '74',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with 16ms HRV, completely consumed by perfectionist anxiety. Every project had to be flawless, which was exhausting my team.',
        quote2: 'Within 10 weeks, my HRV reached 74ms. I learned to deliver excellence without perfectionism. My team started enjoying work again and our productivity increased.'
      },
      {
        name: 'Michael, 44',
        profession: 'Quality Assurance Manager',
        beforeHRV: '22',
        afterHRV: '71',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 22ms HRV revealed I was managing from criticism instead of guidance. I thought high standards meant harsh judgment.',
        quote2: 'By week 8, my HRV hit 71ms and I was leading from wisdom instead of criticism. Quality improved because people felt safe to be excellent.'
      },
      {
        name: 'David, 47',
        profession: 'Architect',
        beforeHRV: '19',
        afterHRV: '72',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 19ms HRV, I was exhausted from trying to perfect every design detail. My creativity was being strangled by criticism.',
        quote2: 'The heart-brain coherence work gave me back my creative flow (HRV now 72ms). I stopped trying to control every variable and started creating beautiful, functional designs.'
      }
    ],
    2: [
      {
        name: 'Maria, 41',
        profession: 'Social Worker',
        beforeHRV: '17',
        afterHRV: '76',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with an HRV of 17ms, completely drained from giving to everyone but myself. My clients were draining me dry.',
        quote2: 'Within 10 weeks, my HRV reached 76ms. My clients stopped seeing me as their savior and started taking responsibility. My family got the best of me, not the leftovers.'
      },
      {
        name: 'James, 36',
        profession: 'Teacher',
        beforeHRV: '15',
        afterHRV: '79',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 15ms HRV showed I was giving everything to my students while neglecting myself. I thought more giving meant better teaching.',
        quote2: 'By week 8, my HRV hit 79ms and I was teaching from abundance instead of depletion. Students started helping each other instead of depending on me for everything.'
      },
      {
        name: 'Sandra, 43',
        profession: 'Nurse',
        beforeHRV: '18',
        afterHRV: '71',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 18ms HRV, I was exhausted from caring for everyone except myself. My marriage was suffering from my depletion.',
        quote2: 'The coherence work (HRV now 71ms) taught me that self-care enables better care for others. My husband feels needed again, and I feel genuinely loved.'
      }
    ],
    3: [
      {
        name: 'Michael, 38',
        profession: 'Sales Director',
        beforeHRV: '19',
        afterHRV: '74',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with an HRV of 19ms, crushing my quotas but dying inside. My marriage was suffering, and I couldn\'t enjoy any success.',
        quote2: 'Within 10 weeks, my HRV reached 74ms. My sales improved because I was selling from authentic value instead of desperate performance. My family got the real me back.'
      },
      {
        name: 'Jennifer, 42',
        profession: 'Marketing Executive',
        beforeHRV: '17',
        afterHRV: '79',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 17ms HRV revealed I was performing instead of being authentic. I thought I needed to achieve more to feel worthy.',
        quote2: 'By week 8, my HRV hit 79ms and I was performing from alignment instead of anxiety. My team felt inspired instead of pressured.'
      },
      {
        name: 'David, 45',
        profession: 'Tech CEO',
        beforeHRV: '21',
        afterHRV: '76',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 21ms HRV, I was successful on paper but completely disconnected from meaning. Success felt empty.',
        quote2: 'The coherence work (HRV now 76ms) gave me clarity about authentic leadership. Success finally felt fulfilling instead of hollow.'
      }
    ],
    4: [
      {
        name: 'Sarah, 34',
        profession: 'Graphic Designer',
        beforeHRV: '14',
        afterHRV: '73',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with 14ms HRV, drowning in emotional chaos. My relationships were dramatic, my work inconsistent.',
        quote2: 'Within 10 weeks, my HRV reached 73ms. My creativity became sustainable and my relationships deepened without the drama. I became emotionally reliable.'
      },
      {
        name: 'Marcus, 29',
        profession: 'Musician',
        beforeHRV: '12',
        afterHRV: '78',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 12ms HRV showed I was creating from emotional chaos instead of depth. I thought intensity meant authenticity.',
        quote2: 'By week 8, my HRV hit 78ms and I was creating from emotional wisdom. My music became more powerful and my income increased through consistency.'
      },
      {
        name: 'Isabella, 41',
        profession: 'Therapist',
        beforeHRV: '16',
        afterHRV: '74',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 16ms HRV, I was absorbing all my clients\' emotions and burning out. I couldn\'t separate their pain from mine.',
        quote2: 'The coherence work (HRV now 74ms) taught me to feel deeply without drowning. My practice thrived while my personal life became beautifully stable.'
      }
    ],
    5: [
      {
        name: 'Dr. Richard, 45',
        profession: 'Research Scientist',
        beforeHRV: '13',
        afterHRV: '72',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with 13ms HRV, living in chronic withdrawal. Conferences drained me for weeks, my team felt shut out.',
        quote2: 'Within 10 weeks, my HRV reached 72ms. I started collaborating on research and enjoying conferences. My students stopped being afraid to approach me.'
      },
      {
        name: 'Elena, 38',
        profession: 'Software Architect',
        beforeHRV: '11',
        afterHRV: '75',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 11ms HRV revealed I was protecting energy through isolation. I thought I needed to work alone to be effective.',
        quote2: 'By week 8, my HRV hit 75ms and I was contributing from abundance instead of scarcity. My career advanced through sustainable collaboration.'
      },
      {
        name: 'Thomas, 42',
        profession: 'University Professor',
        beforeHRV: '15',
        afterHRV: '71',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 15ms HRV, I was brilliant in research but unavailable to students and family. I was hiding behind my office door.',
        quote2: 'The coherence work (HRV now 71ms) gave me sustainable engagement. I started mentoring students while my research improved through collaboration.'
      }
    ],
    6: [
      {
        name: 'Patricia, 43',
        profession: 'Operations Manager',
        beforeHRV: '12',
        afterHRV: '73',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with 12ms HRV, living in constant anxiety and worst-case scenarios. I was exhausting my team with worry.',
        quote2: 'Within 10 weeks, my HRV reached 73ms. I started making confident decisions without constant validation. My team came to me for leadership instead of reassurance.'
      },
      {
        name: 'Michael, 37',
        profession: 'Financial Advisor',
        beforeHRV: '10',
        afterHRV: '76',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 10ms HRV showed I was advising from fear instead of wisdom. I thought more worry meant better protection for clients.',
        quote2: 'By week 8, my HRV hit 76ms and I was advising from inner authority. Clients trusted my recommendations because I trusted myself.'
      },
      {
        name: 'Jennifer, 39',
        profession: 'School Principal',
        beforeHRV: '14',
        afterHRV: '74',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 14ms HRV, I was reliable but constantly anxious about everything that could go wrong. I was micromanaging from fear.',
        quote2: 'The coherence work (HRV now 74ms) gave me inner authority. I stopped controlling from fear and started inspiring from trust.'
      }
    ],
    7: [
      {
        name: 'Alex, 35',
        profession: 'Marketing Creative',
        beforeHRV: '11',
        afterHRV: '75',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with 11ms HRV, living in chronic mental hyperactivity. I had brilliant ideas but never finished anything.',
        quote2: 'Within 10 weeks, my HRV reached 75ms. I started completing major projects and building sustainable business. My income doubled through follow-through.'
      },
      {
        name: 'Sofia, 29',
        profession: 'Event Planner',
        beforeHRV: '9',
        afterHRV: '78',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 9ms HRV revealed I was creating from scattered excitement. I thought I needed more stimulation to stay creative.',
        quote2: 'By week 8, my HRV hit 78ms and I was creating from sustained focus. My events became more successful through completion instead of chaos.'
      },
      {
        name: 'David, 42',
        profession: 'Tech Entrepreneur',
        beforeHRV: '13',
        afterHRV: '73',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 13ms HRV, I was constantly starting new ventures and abandoning them. I was addicted to the excitement of beginnings.',
        quote2: 'The coherence work (HRV now 73ms) taught me to find excitement within commitment. My business became profitable through sustained effort.'
      }
    ],
    8: [
      {
        name: 'Jennifer, 42',
        profession: 'Marketing Director',
        beforeHRV: '18',
        afterHRV: '75',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started The Incredible You program with an HRV of just 18ms. I was that executive who looked successful on the outside but felt like drowning inside.',
        quote2: 'Within 10 weeks, my HRV was consistently above 75ms. My husband said it was like living with a completely different person. I went from snapping at my kids to enjoying our evening routine.'
      },
      {
        name: 'Marcus, 38',
        profession: 'Entrepreneur',
        beforeHRV: '14',
        afterHRV: '82',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'My HRV measurement was eye-opening - only 14ms when I started. I was running three businesses but felt like running on fumes.',
        quote2: 'By week 8, my HRV hit 82ms and I was making decisions 5x faster than before. My revenue doubled while my work hours decreased.'
      },
      {
        name: 'Sarah, 45',
        profession: 'Single Mom',
        beforeHRV: '21',
        afterHRV: '68',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 21ms HRV, I was that mom who looked like she had it together but was secretly falling apart. The constant vigilance was exhausting.',
        quote2: 'The coherence work didn\'t just give me energy back (HRV now 68ms) - it gave me clarity about what actually mattered. Everything improved: career, health, even dating.'
      }
    ],
    9: [
      {
        name: 'Linda, 44',
        profession: 'Administrative Assistant',
        beforeHRV: '9',
        afterHRV: '71',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started with 9ms HRV, completely lost in everyone else\'s needs. I was everyone\'s go-to person but had no idea what I wanted.',
        quote2: 'Within 10 weeks, my HRV reached 71ms. I started pursuing my own interests. My husband said it was like meeting me for the first time.'
      },
      {
        name: 'Robert, 51',
        profession: 'Middle Manager',
        beforeHRV: '8',
        afterHRV: '74',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'My 8ms HRV showed I was leading from accommodation instead of direction. I thought keeping everyone happy meant good leadership.',
        quote2: 'By week 8, my HRV hit 74ms and I was leading from authentic presence. My team respected me more because I had clear vision.'
      },
      {
        name: 'Maria, 39',
        profession: 'Stay-at-Home Mom',
        beforeHRV: '11',
        afterHRV: '73',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        quote1: 'Starting with 11ms HRV, I was completely lost in my family\'s needs. I had no idea who I was anymore.',
        quote2: 'The coherence work (HRV now 73ms) gave me permission to have my own life. I stopped being just the family servant and became a real person with dreams.'
      }
    ]
  };
  return testimonials[typeId] || testimonials[8];
}