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
      { content: ["OBJECTIVITY • PERSPECTIVE • SPACE"], gradient: "linear-gradient(135deg, #64748b, #475569)" },
      { content: ["CLOSENESS • INTIMACY • BONDING"], gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
      { content: ["INDEPENDENCE • SELF-RELIANCE • FREEDOM"], gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" }
    ]
  },
  {
    title: "Processing Style",
    stones: [
      { content: ["SYSTEMS • CONCEPTS • IDEAS"], gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
      { content: ["EXPRESSION • MOOD • FEELING"], gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
      { content: ["RESULTS • EFFICIENCY • UTILITY"], gradient: "linear-gradient(135deg, #059669, #047857)" }
    ]
  },
  {
    title: "Stress Reaction",
    stones: [
      { content: ["VIGILANCE • ANALYSIS • FORESIGHT"], gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
      { content: ["RECOGNITION • IDENTITY • UNIQUENESS"], gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
      { content: ["AUTHORITY • POWER • DIRECTION"], gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" }
    ]
  },
  {
    title: "Conflict Style",
    stones: [
      { content: ["PEACE • MEDIATION • COMPROMISE"], gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
      { content: ["SUPPORT • FLEXIBILITY • ADAPTATION"], gradient: "linear-gradient(135deg, #84cc16, #65a30d)" },
      { content: ["DIRECTNESS • CHALLENGE • HONESTY"], gradient: "linear-gradient(135deg, #f97316, #ea580c)" }
    ]
  },
  {
    title: "Success Definition",
    stones: [
      { content: ["ACCURACY • PRINCIPLES • IMPROVEMENT"], gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
      { content: ["CONNECTION • ACKNOWLEDGMENT • APPRECIATION"], gradient: "linear-gradient(135deg, #10b981, #059669)" },
      { content: ["MASTERY • ACHIEVEMENT • CAPABILITY"], gradient: "linear-gradient(135deg, #f59e0b, #d97706)" }
    ]
  },
  {
    title: "Relationship Priority",
    stones: [
      { content: ["AUTONOMY • SELF-SUFFICIENCY • SPACE"], gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
      { content: ["MUTUALITY • SHARING • RECIPROCITY"], gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
      { content: ["LEADERSHIP • MENTORSHIP • DIRECTION"], gradient: "linear-gradient(135deg, #ef4444, #dc2626)" }
    ]
  }
];

// Wing Options Data - Exact from Section 5.2 of replit_innerdna_spec.md
export const buildingBlocks = {
  1: [
    {
      id: 0,
      type: 1,
      wing: '9',
      name: "Reformer 9",
      description: "I seek peace while upholding standards",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 1,
      wing: '2',
      name: "Reformer 2", 
      description: "I help others improve responsibly",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ],
  2: [
    {
      id: 0,
      type: 2,
      wing: '1',
      name: "Helper 1",
      description: "I help through principled service", 
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 2,
      wing: '3',
      name: "Helper 3",
      description: "I help while staying successful",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    }
  ],
  3: [
    {
      id: 0,
      type: 3,
      wing: '2',
      name: "Achiever 2",
      description: "I achieve through helping others",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      id: 1,
      type: 3,
      wing: '4',
      name: "Achiever 4", 
      description: "I achieve with authentic expression",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    }
  ],
  4: [
    {
      id: 0,
      type: 4,
      wing: '3',
      name: "Individualist 3",
      description: "I express uniqueness successfully",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      id: 1,
      type: 4,
      wing: '5',
      name: "Individualist 5",
      description: "I explore identity through knowledge", 
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    }
  ],
  5: [
    {
      id: 0,
      type: 5,
      wing: '4',
      name: "Investigator 4",
      description: "I analyze with emotional depth",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 5,
      wing: '6',
      name: "Investigator 6",
      description: "I analyze for security",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ],
  6: [
    {
      id: 0,
      type: 6,
      wing: '5',
      name: "Sentinel 5", // CRITICAL: Never "Loyalist"
      description: "I seek security through knowledge",
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    },
    {
      id: 1,
      type: 6,
      wing: '7',
      name: "Sentinel 7",
      description: "I stay positive while preparing",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    }
  ],
  7: [
    {
      id: 0,
      type: 7,
      wing: '6',
      name: "Enthusiast 6",
      description: "I enjoy while staying secure",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      id: 1,
      type: 7,
      wing: '8',
      name: "Enthusiast 8",
      description: "I pursue experiences boldly",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    }
  ],
  8: [
    {
      id: 0,
      type: 8,
      wing: '7',
      name: "Challenger 7",
      description: "I lead with enthusiasm", 
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      id: 1,
      type: 8,
      wing: '9',
      name: "Challenger 9",
      description: "I use strength peacefully",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    }
  ],
  9: [
    {
      id: 0,
      type: 9,
      wing: '1',
      name: "Peacemaker 1",
      description: "I maintain peace with standards",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    },
    {
      id: 1,
      type: 9,
      wing: '8',
      name: "Peacemaker 8", 
      description: "I harmonize while asserting",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    }
  ]
};

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
