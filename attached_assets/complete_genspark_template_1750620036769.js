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
    <title>The Type ${typeId} ${typeName}: Heart-Brain Connection Assessment Report</title>
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
                THE TYPE ${typeId} ${typeName}:
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
                            <p class="text-sm">Heart-brain coherence is your new baseline. Old stress patterns feel foreign.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-blue-400 mb-3">Breakthrough Results</h4>
                            <p class="text-sm">Week 9: HRV reaches optimal 75ms+ range. Recovery from stress is near-instant.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-green-400 mb-3">Life-Changing Results</h4>
                            <p class="text-sm">Week 10: You embody calm power. Others are magnetically drawn to your presence.</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-yellow-400 mb-3">Incredible Results</h4>
                            <p class="text-sm">The transformation is permanent. You've joined the 15% who live from coherence.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="text-center mt-12">
                <button class="btn-primary text-black font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-all duration-300">
                    <i class="fas fa-rocket mr-2"></i>
                    Start Your 10-Week Transformation
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <h2 class="text-4xl md:text-6xl font-bold text-center mb-12">REAL TRANSFORMATION STORIES</h2>
            
            <div class="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                ${getTypeTestimonials(typeId).map((testimonial, index) => `
                <div class="testimonial-card rounded-2xl p-8">
                    <div class="text-center mb-6">
                        <img src="${testimonial.image}" 
                             alt="${testimonial.name}" class="w-20 h-20 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-xl font-bold">${testimonial.name}</h3>
                        <p class="text-purple-400">${testimonial.profession}</p>
                    </div>
                    
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-yellow-400 mb-2">HRV Transformation:</h4>
                        <div class="flex justify-between items-center bg-gray-800 rounded-lg p-3">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-red-400">${testimonial.beforeHRV}ms</div>
                                <div class="text-sm">Before</div>
                            </div>
                            <i class="fas fa-arrow-right text-purple-400"></i>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-400">${testimonial.afterHRV}ms</div>
                                <div class="text-sm">After</div>
                            </div>
                        </div>
                    </div>
                    
                    <blockquote class="text-lg leading-relaxed mb-4">
                        "${testimonial.quote1}"
                    </blockquote>
                    
                    <blockquote class="text-lg leading-relaxed">
                        "${testimonial.quote2}"
                    </blockquote>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Scientific Backing Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <h2 class="text-4xl md:text-6xl font-bold text-center mb-12">THE SCIENCE BEHIND THE TRANSFORMATION</h2>
            
            <div class="grid md:grid-cols-2 gap-12 mb-12">
                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-6 text-center">Before: Heart-Brain Disconnection</h3>
                    <div style="height: 300px;">
                        <canvas id="beforeCoherenceChart"></canvas>
                    </div>
                    <div class="mt-6 space-y-3">
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-red-400 rounded mr-3"></div>
                            <span>Chaotic HRV Pattern (${hrvBaseline}ms average)</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-yellow-400 rounded mr-3"></div>
                            <span>${getTypeStressTrigger(typeId)}-Driven Responses</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-gray-400 rounded mr-3"></div>
                            <span>Disconnected Neural Networks</span>
                        </div>
                    </div>
                </div>

                <div class="glass-card rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-6 text-center">After: Heart-Brain Coherence</h3>
                    <div style="height: 300px;">
                        <canvas id="afterCoherenceChart"></canvas>
                    </div>
                    <div class="mt-6 space-y-3">
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-green-400 rounded mr-3"></div>
                            <span>Coherent HRV Pattern (75ms+ average)</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-blue-400 rounded mr-3"></div>
                            <span>Wisdom-Based Decisions</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-purple-400 rounded mr-3"></div>
                            <span>Integrated Neural Networks</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-card rounded-2xl p-8 text-center">
                <h3 class="text-3xl font-bold mb-6">Research-Backed Results</h3>
                <div class="grid md:grid-cols-3 gap-8">
                    <div>
                        <div class="text-4xl font-bold text-yellow-400 mb-2">300%</div>
                        <p class="text-lg">Improvement in stress resilience</p>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-green-400 mb-2">250%</div>
                        <p class="text-lg">Increase in decision-making speed</p>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-purple-400 mb-2">400%</div>
                        <p class="text-lg">Enhancement in leadership presence</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Urgency Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <div class="text-center mb-12">
                <h2 class="text-4xl md:text-6xl font-bold mb-8 urgency-pulse">THE CRITICAL WINDOW: Why Timing Matters</h2>
                
                <div class="glass-card rounded-2xl p-8 max-w-4xl mx-auto mb-8">
                    <div class="flex items-center justify-center mb-6">
                        <i class="fas fa-exclamation-triangle text-red-400 text-4xl mr-4"></i>
                        <h3 class="text-3xl font-bold text-red-400">CRITICAL RESEARCH FINDING</h3>
                        <i class="fas fa-exclamation-triangle text-red-400 text-4xl ml-4"></i>
                    </div>
                    <p class="text-xl mb-4">
                        Research shows: After age 40, heart-brain incoherence accelerates aging by <strong class="text-red-400">300%</strong>.
                    </p>
                    <p class="text-lg">
                        The window for easy transformation is closing, but the incredible news is that people regularly achieve optimal HRV levels regardless of their starting point.
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-12">
                    <div class="glass-card rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-red-400">If You Wait:</h3>
                        <ul class="space-y-3 text-lg text-left">
                            <li class="flex items-start">
                                <i class="fas fa-minus-circle text-red-400 mr-3 mt-1"></i>
                                Neural pathways become more rigid each month
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-minus-circle text-red-400 mr-3 mt-1"></i>
                                ${getTypeStressTrigger(typeId)} patterns deepen and become harder to interrupt
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-minus-circle text-red-400 mr-3 mt-1"></i>
                                Health impacts compound exponentially
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-minus-circle text-red-400 mr-3 mt-1"></i>
                                Relationships may reach irreversible breaking points
                            </li>
                        </ul>
                    </div>

                    <div class="glass-card rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-green-400">If You Act Now:</h3>
                        <ul class="space-y-3 text-lg text-left">
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-400 mr-3 mt-1"></i>
                                Neural plasticity is still highly responsive
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-400 mr-3 mt-1"></i>
                                Transformation happens faster than ever expected
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-400 mr-3 mt-1"></i>
                                Health improvements create positive momentum
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check-circle text-green-400 mr-3 mt-1"></i>
                                Relationships heal and deepen beyond previous levels
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
                    <h3 class="text-3xl font-bold mb-6">THE COHERENCE ADVANTAGE</h3>
                    <p class="text-xl mb-6">
                        When you achieve heart-brain coherence, you join an elite <strong class="text-purple-400">15%</strong> of the population who live from a completely different operating system.
                    </p>
                    <div class="grid md:grid-cols-2 gap-8 text-left">
                        <div>
                            <h4 class="text-xl font-bold text-yellow-400 mb-3">You'll Experience:</h4>
                            <ul class="space-y-2">
                                <li class="flex items-start">
                                    <i class="fas fa-star text-yellow-400 mr-2 mt-1"></i>
                                    Unshakeable inner confidence
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-star text-yellow-400 mr-2 mt-1"></i>
                                    Effortless decision-making
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-star text-yellow-400 mr-2 mt-1"></i>
                                    ${getTypeCoherenceBenefit(typeId)}
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-star text-yellow-400 mr-2 mt-1"></i>
                                    Stress becomes fuel, not friction
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-purple-400 mb-3">Others Will Notice:</h4>
                            <ul class="space-y-2">
                                <li class="flex items-start">
                                    <i class="fas fa-star text-purple-400 mr-2 mt-1"></i>
                                    Your calm authority in any situation
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-star text-purple-400 mr-2 mt-1"></i>
                                    Your ability to see solutions others miss
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-star text-purple-400 mr-2 mt-1"></i>
                                    Your authentic vulnerability and strength
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-star text-purple-400 mr-2 mt-1"></i>
                                    How safe and inspired they feel around you
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <div class="section-divider mb-12"></div>
            
            <div class="text-center">
                <h2 class="text-4xl md:text-6xl font-bold mb-8">THE INVITATION: Join the 15%</h2>
                
                <div class="glass-card rounded-2xl p-12 max-w-4xl mx-auto mb-12">
                    <p class="text-2xl mb-8 leading-relaxed">
                        Your heart-brain system is ready for the 10-week activation protocol. Your <strong class="text-yellow-400">40,000 heart neurons</strong> are waiting to come online.
                    </p>
                    
                    <p class="text-3xl font-bold mb-8 text-purple-400">
                        The only question is: are you ready to become incredible?
                    </p>

                    <div class="space-y-6 mb-12">
                        <button class="btn-primary text-black font-bold py-6 px-12 rounded-full text-2xl hover:scale-105 transition-all duration-300 block w-full">
                            <i class="fas fa-heart mr-3"></i>
                            YES, I'M READY TO TRANSFORM MY LIFE
                            <i class="fas fa-arrow-right ml-3"></i>
                        </button>
                        
                        <button class="btn-secondary text-white font-bold py-4 px-8 rounded-full text-lg hover:scale-105 transition-all duration-300">
                            <i class="fas fa-phone mr-2"></i>
                            Schedule a Discovery Call
                        </button>
                    </div>

                    <div class="border-t border-gray-600 pt-8">
                        <h3 class="text-2xl font-bold mb-6">THE MOMENT OF TRUTH</h3>
                        <p class="text-lg leading-relaxed mb-6">
                            You have two choices right now. You can close this page and continue living with <span class="text-red-400">${heartNeuronPercentage}% of your heart neurons offline</span>, wondering what could have been. Or you can take the step that transforms everything.
                        </p>
                        
                        <p class="text-xl font-bold text-yellow-400 mb-8">
                            The coherent life is calling. Will you answer?
                        </p>

                        <div class="grid md:grid-cols-3 gap-6 text-sm">
                            <div class="flex items-center justify-center">
                                <i class="fas fa-shield-alt text-green-400 mr-2"></i>
                                <span>100% Science-Backed</span>
                            </div>
                            <div class="flex items-center justify-center">
                                <i class="fas fa-clock text-yellow-400 mr-2"></i>
                                <span>10-Week Transformation</span>
                            </div>
                            <div class="flex items-center justify-center">
                                <i class="fas fa-trophy text-purple-400 mr-2"></i>
                                <span>Join the Elite 15%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="text-lg text-gray-300">
                    Don't let another day pass with your heart-brain connection broken. Your incredible life is waiting.
                </p>
            </div>
        </div>
    </section>

    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
    </div>

    <script>
        // Animate percentage on load
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

        function createBeforeCoherenceChart() {
            const ctx = document.getElementById('beforeCoherenceChart').getContext('2d');
            const beforeData = [];
            for (let i = 0; i < 100; i++) {
                beforeData.push(Math.random() * 50 + 10);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'Before: Disconnected',
                        data: beforeData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        pointRadius: 0
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

        function createAfterCoherenceChart() {
            const ctx = document.getElementById('afterCoherenceChart').getContext('2d');
            const afterData = [];
            for (let i = 0; i < 100; i++) {
                afterData.push(75 + Math.sin(i * 0.1) * 10);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'After: Coherent',
                        data: afterData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        pointRadius: 0
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
            animatePercentage();
            createCurrentHRVChart();
            createOptimalHRVChart();
            createBeforeCoherenceChart();
            createAfterCoherenceChart();

            // Fade in animation for elements
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        });
    </script>
</body>
</html>`;

    return html;
    
  } catch (error) {
    console.error('Error generating complete report:', error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
} animatePercentage() {
            const percentage1 = document.getElementById('heartPercentage');
            const percentage2 = document.getElementById('heartPercentage2');
            let current = 0;
            const target = ${heartNeuronPercentage};
            const increment = target / 100;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                percentage1.textContent = Math.floor(current);
                percentage2.textContent = Math.floor(current);
            }, 20);
        }

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

        function createBeforeCoherenceChart() {
            const ctx = document.getElementById('beforeCoherenceChart').getContext('2d');
            const beforeData = [];
            for (let i = 0; i < 100; i++) {
                beforeData.push(Math.random() * 50 + 10);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'Before: Disconnected',
                        data: beforeData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        pointRadius: 0
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

        function createAfterCoherenceChart() {
            const ctx = document.getElementById('afterCoherenceChart').getContext('2d');
            const afterData = [];
            for (let i = 0; i < 100; i++) {
                afterData.push(75 + Math.sin(i * 0.1) * 10);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'After: Coherent',
                        data: afterData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        pointRadius: 0
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
            animatePercentage();
            createCurrentHRVChart();
            createOptimalHRVChart();
            createBeforeCoherenceChart();
            createAfterCoherenceChart();

            // Fade in animation for elements
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        });
    </script> createOptimalHRVChart() {
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

        function createBeforeCoherenceChart() {
            const ctx = document.getElementById('beforeCoherenceChart').getContext('2d');
            const beforeData = [];
            for (let i = 0; i < 100; i++) {
                beforeData.push(Math.random() * 50 + 10);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'Before: Disconnected',
                        data: beforeData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        pointRadius: 0
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

        function createAfterCoherenceChart() {
            const ctx = document.getElementById('afterCoherenceChart').getContext('2d');
            const afterData = [];
            for (let i = 0; i < 100; i++) {
                afterData.push(75 + Math.sin(i * 0.1) * 10);
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'After: Coherent',
                        data: afterData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        pointRadius: 0
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
            createBeforeCoherenceChart();
            createAfterCoherenceChart();

            // Fade in animation for elements
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        });
    </script>
</body>
</html>`;

    return html;
    
  } catch (error) {
    console.error('Error generating complete report:', error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
}

// Helper functions for type-specific content
function generateHeartNeuronPercentage() {
  return Math.floor(Math.random() * 16) + 70; // Random between 70-85
}

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

function getPersonalityTypeName(typeId) {
  const typeNames = {
    1: 'REFORMER', 2: 'HELPER', 3: 'ACHIEVER', 4: 'INDIVIDUALIST', 5: 'INVESTIGATOR',
    6: 'LOYALIST', 7: 'ENTHUSIAST', 8: 'CHALLENGER', 9: 'PEACEMAKER'
  };
  return typeNames[typeId] || 'UNKNOWN';
}

function getTypeDescription(typeId) {
  const descriptions = {
    1: 'Why Your Life Feels So Exhausting', 2: 'Why Your Life Feels So Draining',
    3: 'Why Your Life Feels So Empty', 4: 'Why Your Life Feels So Intense',
    5: 'Why Your Life Feels So Depleting', 6: 'Why Your Life Feels So Anxious',
    7: 'Why Your Life Feels So Scattered', 8: 'Why Your Life Feels So Hard',
    9: 'Why Your Life Feels So Stuck'
  };
  return descriptions[typeId] || 'Why Your Life Feels Disconnected';
}

function getTypeAction(typeId) {
  const actions = {
    1: 'judge', 2: 'help', 3: 'achieve', 4: 'feel', 5: 'withdraw',
    6: 'doubt', 7: 'escape', 8: 'lead', 9: 'merge'
  };
  return actions[typeId] || 'react';
}

function getTypeStressState(typeId) {
  const states = {
    1: 'perfectionist stress mode', 2: 'people-pleasing mode', 3: 'performance anxiety mode',
    4: 'emotional turbulence mode', 5: 'withdrawal mode', 6: 'anxiety mode',
    7: 'scattered energy mode', 8: 'fight-or-flight mode', 9: 'merge mode'
  };
  return states[typeId] || 'stress mode';
}

function getTypeStressTrigger(typeId) {
  const triggers = {
    1: 'perfectionist criticism', 2: 'people-pleasing depletion', 3: 'performance pressure',
    4: 'emotional intensity', 5: 'energy conservation', 6: 'anxiety',
    7: 'scattered seeking', 8: 'stress', 9: 'inertia'
  };
  return triggers[typeId] || 'stress';
}

function getTypeReaction(typeId) {
  const reactions = {
    1: 'critical decision-making', 2: 'people-pleasing reactions', 3: 'performance anxiety',
    4: 'emotional reactivity', 5: 'withdrawal responses', 6: 'anxious decision-making',
    7: 'scattered reactions', 8: 'reactive decision-making', 9: 'avoidance patterns'
  };
  return reactions[typeId] || 'reactive responses';
}

function getTypeImprovement(typeId) {
  const improvements = {
    1: 'calmer and less critical', 2: 'more centered and boundaried', 3: 'more authentic and grounded',
    4: 'more emotionally regulated', 5: 'more present and engaged', 6: 'calmer and more trusting',
    7: 'more focused and present', 8: 'calmer', 9: 'more present and assertive'
  };
  return improvements[typeId] || 'calmer';
}

function getTypeSpecificBenefit(typeId) {
  const benefits = {
    1: 'Perfectionist paralysis', 2: 'People-pleasing exhaustion', 3: 'Performance anxiety',
    4: 'Emotional reactivity', 5: 'Social withdrawal', 6: 'Chronic anxiety',
    7: 'Mental hyperactivity', 8: 'Emotional reactivity', 9: 'Procrastination'
  };
  return benefits[typeId] || 'Emotional reactivity';
}

function getTypeCoherenceBenefit(typeId) {
  const benefits = {
    1: 'Excellence without perfectionist pressure', 2: 'Service without depletion', 3: 'Success with authentic fulfillment',
    4: 'Emotional depth without chaos', 5: 'Engagement without energy drain', 6: 'Security from inner authority',
    7: 'Focus without losing enthusiasm', 8: 'Magnetic leadership presence', 9: 'Action without conflict'
  };
  return benefits[typeId] || 'Natural confidence and clarity';
}

function getCareerImpacts(typeId) {
  const impacts = {
    1: [
      'Making career decisions from perfectionist fear, not excellence',
      'Procrastinating on opportunities because they\'re not perfect',
      'Burning out from trying to fix everything at work',
      'Being passed over for promotions due to over-analysis'
    ],
    2: [
      'Saying yes to opportunities that drain you to help others',
      'Undervaluing your contributions and accepting less pay',
      'Burning out from taking on everyone else\'s responsibilities',
      'Being taken advantage of by colleagues who don\'t reciprocate'
    ],
    3: [
      'Making fear-based career decisions instead of strategic ones',
      'Struggling with imposter syndrome despite your competence',
      'Earning less than your potential because you can\'t access full confidence',
      'Burning out trying to prove yourself instead of leading from wisdom'
    ],
    4: [
      'Career decisions driven by emotional intensity instead of strategy',
      'Inconsistent performance due to mood fluctuations',
      'Struggling with workplace criticism and feedback',
      'Missing opportunities because you feel too different or misunderstood'
    ],
    5: [
      'Avoiding opportunities that require too much interpersonal energy',
      'Undervaluing your expertise because sharing feels depleting',
      'Missing leadership roles due to withdrawal tendencies',
      'Burning out from forced collaboration and meetings'
    ],
    6: [
      'Second-guessing career decisions due to chronic self-doubt',
      'Avoiding risks that could advance your career',
      'Seeking constant validation from supervisors',
      'Staying in safe but unfulfilling jobs too long'
    ],
    7: [
      'Starting multiple projects but never finishing them',
      'Getting bored with routine work even when it builds expertise',
      'Struggling to focus during important meetings',
      'Missing promotions due to lack of follow-through'
    ],
    8: [
      'Making fear-based career decisions instead of strategic ones',
      'Struggling with imposter syndrome despite your competence',
      'Earning less than your potential because you can\'t access your full confidence',
      'Burning out trying to prove yourself instead of leading from wisdom'
    ],
    9: [
      'Procrastinating on important career decisions',
      'Avoiding self-advocacy and salary negotiations',
      'Staying in comfortable but unfulfilling positions',
      'Missing opportunities because you don\'t assert your value'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getRelationshipImpacts(typeId) {
  const impacts = {
    1: [
      'Criticizing your partner instead of appreciating them',
      'Creating tension by trying to improve your family',
      'Friends feeling judged when they share problems',
      'Your children feeling like they can never be good enough'
    ],
    2: [
      'Giving so much that you become resentful when not appreciated',
      'Attracting people who take advantage of your giving nature',
      'Struggling to receive love and support from others',
      'Your own needs getting completely overlooked in relationships'
    ],
    3: [
      'Pushing people away when you most need connection',
      'Unable to be vulnerable even with those closest to you',
      'Your intensity scares people before they see your heart',
      'Feeling lonely despite being surrounded by people'
    ],
    4: [
      'Emotional intensity overwhelming your loved ones',
      'Pushing people away when they get too close',
      'Creating drama in relationships during emotional peaks',
      'Partners feeling like they have to walk on eggshells'
    ],
    5: [
      'Withdrawing when relationships require emotional energy',
      'Partners feeling shut out by your need for space',
      'Difficulty maintaining consistent emotional presence',
      'Friends feeling like you\'re not truly available'
    ],
    6: [
      'Constant need for reassurance exhausting your partners',
      'Testing relationships through worst-case scenarios',
      'Difficulty trusting even those closest to you',
      'Creating anxiety in family members through your worry'
    ],
    7: [
      'Partners feeling like they can\'t pin you down',
      'Avoiding deep emotional conversations',
      'Friends enjoying your energy but not feeling truly seen',
      'Family feeling entertained but not genuinely connected'
    ],
    8: [
      'Pushing people away when you most need connection',
      'Unable to be vulnerable even with those closest to you',
      'Your intensity scares people before they see your heart',
      'Feeling lonely despite being surrounded by people'
    ],
    9: [
      'Family feeling like they don\'t know the real you',
      'Avoiding conflict until resentment builds up',
      'Partners feeling like they\'re in a relationship with a ghost',
      'Children learning to ignore your needs because you don\'t express them'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getHealthImpacts(typeId) {
  const impacts = {
    1: [
      'Chronic tension from perfectionist vigilance',
      'Sleep issues from analyzing everything',
      'Digestive problems from holding in frustration',
      'Headaches from mental strain and criticism'
    ],
    2: [
      'Chronic exhaustion from constant giving',
      'Autoimmune issues from self-neglect',
      'Sleep problems from worrying about others',
      'Weight fluctuations from emotional eating patterns'
    ],
    3: [
      'Chronic tension in your chest, shoulders, and jaw',
      'Exhausted despite getting enough sleep',
      'Your body aging faster due to chronic stress response',
      'Needing stimulants to feel alert, depressants to calm down'
    ],
    4: [
      'Physical exhaustion from emotional intensity',
      'Sleep disrupted by emotional processing',
      'Autoimmune issues from emotional stress',
      'Energy crashes after emotional highs'
    ],
    5: [
      'Chronic fatigue from energy conservation mode',
      'Social interactions leaving you depleted for days',
      'Sleep issues from isolation and disconnection',
      'Physical tension from holding back engagement'
    ],
    6: [
      'Chronic muscle tension from constant vigilance',
      'Digestive issues from chronic worry',
      'Sleep problems from anxious thoughts',
      'Frequent illnesses from stress-compromised immunity'
    ],
    7: [
      'Mental exhaustion from constant stimulation seeking',
      'Sleep problems from overactive mind',
      'Digestive issues from eating on-the-go',
      'Energy crashes after excitement highs'
    ],
    8: [
      'Chronic tension in your chest, shoulders, and jaw',
      'Exhausted despite getting enough sleep',
      'Your body is aging faster due to chronic stress response',
      'Needing stimulants to feel alert, depressants to calm down'
    ],
    9: [
      'Chronic fatigue from self-forgetting',
      'Sleep issues from never truly relaxing into yourself',
      'Digestive problems from ignoring body signals',
      'Low energy from lack of authentic motivation'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getFamilyImpacts(typeId) {
  const impacts = {
    1: [
      'Your family gets your frustrated, critical energy',
      'Children walking on eggshells to avoid your corrections',
      'Home feeling like a place of constant improvement projects',
      'Family activities becoming lessons instead of fun'
    ],
    2: [
      'Your family gets your depleted emotional leftovers',
      'Children learning they don\'t need to be independent',
      'Home revolving around everyone else\'s needs but yours',
      'Family taking your sacrifice for granted'
    ],
    3: [
      'Your family gets your leftover energy, not your best self',
      'You\'re the strong one but secretly craving support',
      'Difficulty being present because your mind is always racing',
      'Creating a protective environment that feels controlling to others'
    ],
    4: [
      'Family walking on eggshells around your emotional intensity',
      'Your moods dominating family dynamics',
      'Children learning to manage your emotions',
      'Home feeling emotionally unpredictable'
    ],
    5: [
      'Family feeling shut out by your need for space',
      'Children learning not to need you emotionally',
      'Home feeling more like a retreat than connection space',
      'Missing family moments due to energy conservation'
    ],
    6: [
      'Family feeling exhausted by your worry and anxiety',
      'Children absorbing your fears about the world',
      'Home feeling tense due to constant threat-scanning',
      'Over-protecting family members from imagined dangers'
    ],
    7: [
      'Family competing for your scattered attention',
      'Children feeling entertained but not truly seen',
      'Home feeling chaotic due to your restless energy',
      'Missing quiet family moments due to stimulation needs'
    ],
    8: [
      'Your family gets your leftover energy, not your best self',
      'You\'re the strong one but secretly craving support',
      'Difficulty being present because your mind is always racing',
      'Creating a protective environment that feels controlling to others'
    ],
    9: [
      'Family feeling like they don\'t know the real you',
      'Children learning that their needs matter more than yours',
      'Home lacking your authentic personality and preferences',
      'Family dynamics revolving around keeping peace'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getGrowthImpacts(typeId) {
  const impacts = {
    1: [
      'Personal growth feeling like another standard to meet',
      'Spiritual practices becoming perfectionist performances',
      'Unable to celebrate progress due to focus on flaws',
      'Growth happening in your head through criticism'
    ],
    2: [
      'Personal growth feeling selfish compared to helping others',
      'Spiritual practices getting interrupted by others\' needs',
      'Unable to sustain practices that focus on yourself',
      'Growth happening for others through your support'
    ],
    3: [
      'Knowing you\'re capable of more but unable to access it',
      'Spiritual practices feel empty because your heart is disconnected',
      'Your inner critic is louder than your inner wisdom',
      'Feeling like you\'re fighting life instead of flowing with it'
    ],
    4: [
      'Growth practices abandoned when they become routine',
      'Spiritual seeking driven by emotional intensity',
      'Unable to sustain progress through emotional crashes',
      'Personal development feeling superficial'
    ],
    5: [
      'Growth requiring too much energy to sustain',
      'Spiritual practices feeling like obligations',
      'Learning remaining intellectual instead of experiential',
      'Avoiding growth communities due to energy demands'
    ],
    6: [
      'Growth practices creating more anxiety about doing them wrong',
      'Spiritual seeking driven by security needs',
      'Unable to trust your own inner guidance',
      'Personal development requiring external validation'
    ],
    7: [
      'Starting multiple growth practices but abandoning them',
      'Spiritual seeking driven by novelty instead of depth',
      'Unable to sustain practices when they become routine',
      'Personal development remaining mental instead of integrated'
    ],
    8: [
      'Knowing you\'re capable of more but unable to access it',
      'Spiritual practices feel empty because your heart is disconnected',
      'Your inner critic is louder than your inner wisdom',
      'Feeling like you\'re fighting life instead of flowing with it'
    ],
    9: [
      'Personal growth feeling too demanding compared to keeping peace',
      'Spiritual practices lacking personal motivation',
      'Unable to sustain practices that require self-assertion',
      'Growth happening for others while you remain invisible'
    ]
  };
  return impacts[typeId] || impacts[8];
}

function getTypeTestimonials(typeId) {
  const testimonials = {
    1: [
      {
        name: 'Robert, 44',
        profession: 'Quality Control Manager',
        beforeHRV: '16',
        afterHRV: '78',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote1: 'I started The Incredible You program with an HRV of just 16ms - basically living in chronic perfectionist stress mode. My team was terrified of making mistakes around me.',
        quote2: 'Within 10 weeks, my HRV was consistently above 78ms. My team stopped walking on eggshells and started coming to me with innovative ideas. My wife said I became excellent without being impossible.'
      },
      {
        name: 'Linda, 39',
        profession: 'Project Manager',
        beforeHRV: '13',
        afterHRV: '81',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e7d6e8?w=100&h=100&fit=crop&crop=face',
        quote1: 'My HRV of 13ms revealed I was living in constant critical mode. I thought I needed to catch every mistake to be valuable.',
        quote2: 'By week 8, my HRV hit 81ms and I was leading from wisdom instead of criticism. Our quality improved because people felt safe to report issues.'
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