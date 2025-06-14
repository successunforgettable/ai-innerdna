export interface StoneSet {
  title: string;
  stones: {
    content: string[];
    gradient: string;
  }[];
}

export const stoneSets: StoneSet[] = [
  {
    title: "Decision-Making Center",
    stones: [
      { content: ["ANALYSIS • LOGIC • THINKING"], gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
      { content: ["CONNECTION • EMPATHY • FEELING"], gradient: "linear-gradient(135deg, #10b981, #047857)" },
      { content: ["ACTION • INSTINCT • MOVEMENT"], gradient: "linear-gradient(135deg, #f59e0b, #d97706)" }
    ]
  },
  {
    title: "Core Motivation",
    stones: [
      { content: ["SECURITY • PREPARATION • CAUTION"], gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
      { content: ["AUTHENTICITY • IMAGE • MEANING"], gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
      { content: ["JUSTICE • CONTROL • STRENGTH"], gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" }
    ]
  },
  {
    title: "Energy Direction",
    stones: [
      { content: ["REFLECTION • DEPTH • PRIVACY"], gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
      { content: ["ACHIEVEMENT • INFLUENCE • IMPACT"], gradient: "linear-gradient(135deg, #f97316, #ea580c)" },
      { content: ["STRUCTURE • SUPPORT • HARMONY"], gradient: "linear-gradient(135deg, #84cc16, #65a30d)" }
    ]
  },
  {
    title: "Social Approach",
    stones: [
      { content: ["OBJECTIVITY", "PERSPECTIVE • SPACE"], gradient: "gradient-1" },
      { content: ["CLOSENESS", "INTIMACY • BONDING"], gradient: "gradient-2" },
      { content: ["INDEPENDENCE", "SELF-RELIANCE • FREEDOM"], gradient: "gradient-3" }
    ]
  },
  {
    title: "Processing Style",
    stones: [
      { content: ["SYSTEMS", "CONCEPTS • IDEAS"], gradient: "gradient-4" },
      { content: ["EXPRESSION", "MOOD • FEELING"], gradient: "gradient-5" },
      { content: ["RESULTS", "EFFICIENCY • UTILITY"], gradient: "gradient-6" }
    ]
  },
  {
    title: "Stress Reaction",
    stones: [
      { content: ["VIGILANCE", "ANALYSIS • FORESIGHT"], gradient: "gradient-7" },
      { content: ["RECOGNITION", "IDENTITY • UNIQUENESS"], gradient: "gradient-8" },
      { content: ["AUTHORITY", "POWER • DIRECTION"], gradient: "gradient-9" }
    ]
  },
  {
    title: "Conflict Style",
    stones: [
      { content: ["PEACE", "MEDIATION • COMPROMISE"], gradient: "gradient-1" },
      { content: ["SUPPORT", "FLEXIBILITY • ADAPTATION"], gradient: "gradient-2" },
      { content: ["DIRECTNESS", "CHALLENGE • HONESTY"], gradient: "gradient-3" }
    ]
  },
  {
    title: "Success Definition",
    stones: [
      { content: ["ACCURACY", "PRINCIPLES • IMPROVEMENT"], gradient: "gradient-4" },
      { content: ["CONNECTION", "ACKNOWLEDGMENT • APPRECIATION"], gradient: "gradient-5" },
      { content: ["MASTERY", "ACHIEVEMENT • CAPABILITY"], gradient: "gradient-6" }
    ]
  },
  {
    title: "Relationship Priority",
    stones: [
      { content: ["AUTONOMY", "SELF-SUFFICIENCY • SPACE"], gradient: "gradient-7" },
      { content: ["MUTUALITY", "SHARING • RECIPROCITY"], gradient: "gradient-8" },
      { content: ["LEADERSHIP", "MENTORSHIP • DIRECTION"], gradient: "gradient-9" }
    ]
  }
];

export const buildingBlocks = [
  { type: 1, name: "Reformer", description: "Principles & Improvement", gradient: "gradient-1" },
  { type: 2, name: "Helper", description: "Support & Care", gradient: "gradient-2" },
  { type: 3, name: "Achiever", description: "Success & Recognition", gradient: "gradient-3" },
  { type: 4, name: "Individualist", description: "Authenticity & Depth", gradient: "gradient-4" },
  { type: 5, name: "Investigator", description: "Knowledge & Understanding", gradient: "gradient-5" },
  { type: 6, name: "Sentinel", description: "Security & Loyalty", gradient: "gradient-6" },
  { type: 7, name: "Enthusiast", description: "Variety & Adventure", gradient: "gradient-7" },
  { type: 8, name: "Challenger", description: "Power & Control", gradient: "gradient-8" },
  { type: 9, name: "Peacemaker", description: "Harmony & Unity", gradient: "gradient-9" }
];

export const colorStates = [
  { state: "healthy", title: "Healthy State", color: "bg-green-500" },
  { state: "average", title: "Average State", color: "bg-yellow-500" },
  { state: "unhealthy", title: "Stress State", color: "bg-red-500" },
  { state: "calm", title: "Calm Energy", color: "bg-blue-500" },
  { state: "growth", title: "Growth Energy", color: "bg-green-600" },
  { state: "creative", title: "Creative Energy", color: "bg-purple-500" },
  { state: "dynamic", title: "Dynamic Energy", color: "bg-orange-500" },
  { state: "intense", title: "Intense Energy", color: "bg-red-600" },
  { state: "neutral", title: "Neutral State", color: "bg-gray-500" }
];

export const detailTokens = {
  "Communication Style": [
    { token: "direct", label: "Direct", color: "bg-blue-100 text-blue-800" },
    { token: "supportive", label: "Supportive", color: "bg-green-100 text-green-800" },
    { token: "expressive", label: "Expressive", color: "bg-orange-100 text-orange-800" },
    { token: "analytical", label: "Analytical", color: "bg-purple-100 text-purple-800" }
  ],
  "Work Approach": [
    { token: "systematic", label: "Systematic", color: "bg-red-100 text-red-800" },
    { token: "collaborative", label: "Collaborative", color: "bg-blue-100 text-blue-800" },
    { token: "innovative", label: "Innovative", color: "bg-green-100 text-green-800" },
    { token: "independent", label: "Independent", color: "bg-yellow-100 text-yellow-800" }
  ],
  "Decision Making": [
    { token: "intuitive", label: "Intuitive", color: "bg-indigo-100 text-indigo-800" },
    { token: "logical", label: "Logical", color: "bg-pink-100 text-pink-800" },
    { token: "values-based", label: "Values-Based", color: "bg-teal-100 text-teal-800" },
    { token: "consensus", label: "Consensus", color: "bg-gray-100 text-gray-800" }
  ]
};
