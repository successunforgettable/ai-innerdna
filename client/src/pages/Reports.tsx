import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { subtypeDescriptions } from "../utils/subtypeDescriptions";

interface UserReport {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  completedAt: string | null;
  assessmentData: any;
}

export default function Reports() {
  const [, setLocation] = useLocation();
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserReport(userData);
    } else {
      // No user data, redirect to login
      setLocation("/login");
    }
    setLoading(false);
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLocation("/");
  };

  const handleBackToAssessment = () => {
    setLocation("/");
  };

  // Get personality type information
  const getPersonalityInfo = (primaryType: string) => {
    const typeKey = `Type ${primaryType}`;
    const typeInfo = subtypeDescriptions[typeKey];
    
    if (!typeInfo) {
      return {
        name: 'Unknown',
        emoji: '❓',
        description: 'Personality type not found.'
      };
    }
    
    return {
      name: typeInfo.name,
      emoji: typeInfo.emoji,
      description: getPersonalityDescription(primaryType)
    };
  };

  // Get personality description based on type
  const getPersonalityDescription = (type: string) => {
    const descriptions = {
      '1': 'Principled, purposeful, self-controlled, and perfectionistic. They strive to be good and right, improve everything, and fear making mistakes.',
      '2': 'Caring, interpersonal type. They are empathetic, sincere, warm-hearted, and often put others\' needs before their own.',
      '3': 'Success-oriented, pragmatic, and driven. They are adaptable, excelling, and often focused on image and achievement.',
      '4': 'Sensitive, withdrawn type. They are expressive, dramatic, self-absorbed, and temperamental. They seek authenticity and meaning.',
      '5': 'Intense, cerebral type. They are perceptive, innovative, secretive, and isolated. They conserve energy and fear being overwhelmed.',
      '6': 'Committed, security-oriented type. They are engaging, responsible, anxious, and suspicious. They seek security and support.',
      '7': 'Spontaneous, versatile, acquisitive, and scattered. They seek to maintain their freedom and happiness while avoiding pain.',
      '8': 'Powerful, dominating type. Self-confident, decisive, willful, and confrontational. They seek control and resist vulnerability.',
      '9': 'Easygoing, self-effacing type. They are creative, optimistic, and supportive, but can be too willing to go along with others.'
    };
    
    return descriptions[type] || 'Personality type not found.';
  };

  // Get mood states based on type
  const getMoodStates = (type: string) => {
    const moodStates = {
      '1': {
        good: ['Principled and ethical', 'Self-disciplined and orderly', 'Rational and reasonable', 'Purposeful and dedicated'],
        bad: ['Critical and judgmental', 'Rigid and inflexible', 'Impatient and irritable', 'Controlling and perfectionist']
      },
      '2': {
        good: ['Loving and caring', 'Generous and giving', 'People-focused and helpful', 'Warm and encouraging'],
        bad: ['Manipulative and possessive', 'Self-sacrificing to get attention', 'Intrusive and controlling', 'Victim mentality']
      },
      '3': {
        good: ['Adaptable and driven', 'Optimistic and energetic', 'Practical and efficient', 'Self-assured and attractive'],
        bad: ['Image-conscious and deceptive', 'Narcissistic and exhibitionist', 'Grandiose and contemptuous', 'Malicious and relentless']
      },
      '4': {
        good: ['Self-aware and introspective', 'Sensitive and intuitive', 'Gentle and tactful', 'Inspired and creative'],
        bad: ['Moody and self-conscious', 'Withdrawn and stubborn', 'Self-indulgent and depressive', 'Alienated and despairing']
      },
      '5': {
        good: ['Perceptive and insightful', 'Curious and investigative', 'Independent and innovative', 'Inventive and pioneering'],
        bad: ['Detached and preoccupied', 'High-strung and intense', 'Provocative and abrasive', 'Obsessed and disturbed']
      },
      '6': {
        good: ['Engaging and responsible', 'Reliable and trustworthy', 'Committed and loyal', 'Defensive of others'],
        bad: ['Self-doubting and reactive', 'Anxious and pessimistic', 'Suspicious and aggressive', 'Panicky and depressive']
      },
      '7': {
        good: ['Spontaneous and versatile', 'Enthusiastic and productive', 'Practical and prolific', 'Cross-fertilizing areas of interest'],
        bad: ['Hyperactive and impulsive', 'Distracted and scattered', 'Self-centered and insensitive', 'Manic and compulsive']
      },
      '8': {
        good: ['Magnanimous and generous', 'Protective and championing', 'Self-restraining and merciful', 'Heroic and inspiring'],
        bad: ['Egocentric and willful', 'Confrontational and intimidating', 'Ruthless and dictatorial', 'Destructive and vengeful']
      },
      '9': {
        good: ['Receptive and agreeable', 'Trusting and stable', 'Creative and optimistic', 'Supportive and reassuring'],
        bad: ['Complacent and resigned', 'Passive-aggressive and stubborn', 'Disengaged and neglectful', 'Repressed and explosive']
      }
    };
    
    return moodStates[type] || {
      good: ['Positive traits not available'],
      bad: ['Negative traits not available']
    };
  };

  // Get wing influence information
  const getWingInfluence = (primaryType: string, wingType: string) => {
    const wingDescriptions = {
      '1': {
        '9': 'The 9 influence brings a peaceful, harmonizing quality to your principled nature. You seek improvement through gentle persuasion rather than harsh criticism.',
        '2': 'The 2 influence adds warmth and interpersonal focus to your principled nature. You improve things through helping and supporting others.'
      },
      '2': {
        '1': 'The 1 influence adds structure and high standards to your helping nature. You serve others with precision and integrity.',
        '3': 'The 3 influence brings goal-orientation and efficiency to your helping nature. You excel at organizing and achieving for others.'
      },
      '3': {
        '2': 'The 2 influence adds warmth and interpersonal connection to your achievement drive. You succeed through building relationships.',
        '4': 'The 4 influence brings depth and authenticity to your achievement drive. You strive for success that reflects your true self and deeper values.'
      },
      '4': {
        '3': 'The 3 influence adds practical achievement to your emotional depth. You channel your creativity into tangible, successful outcomes.',
        '5': 'The 5 influence brings intellectual depth and independence to your emotional nature. You seek understanding of your inner world.'
      },
      '5': {
        '4': 'The 4 influence adds emotional depth and creativity to your analytical nature. You bring personal meaning to your investigations.',
        '6': 'The 6 influence brings loyalty and security focus to your independent nature. You use your knowledge to serve and protect.'
      },
      '6': {
        '5': 'The 5 influence adds analytical depth to your security-seeking nature. You prepare thoroughly through research and understanding.',
        '7': 'The 7 influence brings optimism and versatility to your security-seeking nature. You find safety through multiple options and positive thinking.'
      },
      '7': {
        '6': 'The 6 influence adds loyalty and responsibility to your adventurous nature. You include others in your plans and consider consequences.',
        '8': 'The 8 influence brings power and directness to your enthusiastic nature. You pursue your interests with confidence and determination.'
      },
      '8': {
        '7': 'The 7 influence adds enthusiasm and versatility to your powerful nature. You approach challenges with optimism and multiple strategies.',
        '9': 'The 9 influence brings patience and harmony to your powerful nature. You lead through consensus and steady determination.'
      },
      '9': {
        '8': 'The 8 influence adds strength and directness to your peaceful nature. You stand firm for what matters while maintaining harmony.',
        '1': 'The 1 influence brings structure and improvement focus to your peaceful nature. You create positive change through patient, principled action.'
      }
    };
    
    return wingDescriptions[primaryType]?.[wingType] || `The ${wingType} influence adds complementary qualities to your ${primaryType} nature.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your report...</div>
      </div>
    );
  }

  if (!userReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">No report found. Please log in again.</div>
      </div>
    );
  }

  const hasCompletedAssessment = userReport.completedAt && userReport.assessmentData;
  const assessmentData = userReport.assessmentData;
  const primaryType = assessmentData?.result?.primaryType || '1';
  const buildingBlocks = assessmentData?.buildingBlocks || [];
  const wingType = buildingBlocks[0]?.wing || '1';
  const personalityInfo = getPersonalityInfo(primaryType);
  const moodStates = getMoodStates(primaryType);
  const wingInfluence = getWingInfluence(primaryType, wingType);
  
  // Get subtype distribution from detail tokens
  const detailTokens = assessmentData?.detailTokens || [];
  const getSubtypeDistribution = () => {
    const total = detailTokens.reduce((sum: number, token: any) => {
      const tokenCount = parseInt(token.token.split(' ')[0]) || 0;
      return sum + tokenCount;
    }, 0);
    
    return detailTokens.map((token: any) => {
      const tokenCount = parseInt(token.token.split(' ')[0]) || 0;
      const percentage = total > 0 ? Math.round((tokenCount / total) * 100) : 0;
      return {
        category: token.category,
        percentage,
        tokens: tokenCount
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                Welcome back, {userReport.firstName}!
              </h1>
              <p className="text-white/80">
                Here's your personality assessment report
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToAssessment}
                className="px-4 py-2 bg-blue-500/30 text-white border border-blue-400/50 rounded-lg hover:bg-blue-500/40 transition-all duration-300"
              >
                New Assessment
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/30 text-white border border-red-400/50 rounded-lg hover:bg-red-500/40 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {hasCompletedAssessment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl results-container"
          >
            {/* Results Header */}
            <div className="text-center mb-12 results-header">
              <h2 className="text-6xl font-bold text-yellow-400 mb-4 results-title">
                The {personalityInfo.name}
              </h2>
              <p className="text-xl text-white/90 mb-2 results-influence">
                Your primary personality influence
              </p>
              <p className="text-lg text-green-400 results-confidence">
                Confidence: {Math.round((assessmentData?.result?.confidence || 0) * 100)}%
              </p>
            </div>

            {/* Personality Description */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Inner DNA: The {personalityInfo.name}
              </h3>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-lg text-white/90 leading-relaxed">
                  {personalityInfo.description}
                </p>
              </div>
            </div>

            {/* Mood States */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Mood States
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-500/20 rounded-lg p-6 border border-green-400/30 backdrop-blur-sm">
                  <h4 className="text-xl font-semibold text-green-400 mb-3">
                    When you're in a good mood
                  </h4>
                  <ul className="space-y-2 text-white/90">
                    {moodStates.good.map((trait, index) => (
                      <li key={index}>• {trait}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-500/20 rounded-lg p-6 border border-red-400/30 backdrop-blur-sm">
                  <h4 className="text-xl font-semibold text-red-400 mb-3">
                    When you're in a bad mood
                  </h4>
                  <ul className="space-y-2 text-white/90">
                    {moodStates.bad.map((trait, index) => (
                      <li key={index}>• {trait}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Influence Description */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Influence: {wingType}
              </h3>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-lg text-white/90 leading-relaxed">
                  {wingInfluence}
                </p>
              </div>
            </div>

            {/* State Analysis */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Current State Distribution
              </h3>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {assessmentData?.colorStates?.map((state: any, index: number) => (
                    <div key={index}>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {index === 0 ? 'Primary' : 'Secondary'} State
                      </h4>
                      <p className="text-white/80">{state.title}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/90">
                  Your selected states reflect your current emotional patterns and how you navigate life's challenges.
                </p>
              </div>
            </div>

            {/* Subtype Analysis */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Subtype Focus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getSubtypeDistribution().map((subtype, index) => {
                  const colors = [
                    { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-400', emoji: '🛡️' },
                    { bg: 'bg-red-500/20', border: 'border-red-400/30', text: 'text-red-400', emoji: '🔥' },
                    { bg: 'bg-green-500/20', border: 'border-green-400/30', text: 'text-green-400', emoji: '🌱' }
                  ];
                  const color = colors[index] || colors[0];
                  const categoryMap = {
                    'Self-Preservation': 'Focus on personal security and routines',
                    'One-to-One': 'Focus on intense personal connections',
                    'Social': 'Focus on group dynamics and community'
                  };
                  
                  return (
                    <div key={subtype.category} className={`${color.bg} rounded-lg p-4 border ${color.border}`}>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{color.emoji}</span>
                        <h4 className={`text-lg font-semibold ${color.text}`}>
                          {subtype.category === 'One-to-One' ? 'Sexual' : subtype.category}
                        </h4>
                      </div>
                      <p className="text-sm text-white/80">
                        {subtype.percentage}% - {categoryMap[subtype.category as keyof typeof categoryMap] || 'Focus area'}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <p className="text-white/90">
                  Your energy distribution shows how you naturally prioritize and direct your attention across different life areas.
                </p>
              </div>
            </div>

            {/* Growth Recommendations */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Growth Recommendations
              </h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">For Personal Development:</h4>
                    <p className="text-white/90">
                      Practice vulnerability and emotional openness. Allow others to support you without 
                      seeing it as weakness. Develop patience with those who process differently than you.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">In Relationships:</h4>
                    <p className="text-white/90">
                      Work on expressing your softer emotions and needs. Practice listening without 
                      immediately moving to action or solutions. Show appreciation for others' contributions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">At Work:</h4>
                    <p className="text-white/90">
                      Delegate more and trust others' capabilities. Practice collaborative decision-making. 
                      Use your natural leadership to empower others rather than controlling outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Assessment Not Completed
            </h2>
            <p className="text-white/80 mb-6">
              You haven't completed your personality assessment yet.
            </p>
            <button
              onClick={handleBackToAssessment}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Assessment
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}