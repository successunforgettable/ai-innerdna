export interface StoneSet {
  title: string;
  stones: {
    context: string;
    statements: string[];
    gradient: string;
  }[];
}

export const stoneSets: StoneSet[] = [
  {
    title: "Decision-Making Center",
    stones: [
      { 
        context: "When making decisions,",
        statements: [
          "I think things through",
          "I analyze the options", 
          "I gather information first"
        ],
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)" 
      },
      { 
        context: "When making decisions,",
        statements: [
          "I consider how people feel",
          "I think about relationships",
          "I focus on what matters emotionally"
        ],
        gradient: "linear-gradient(135deg, #10b981, #047857)" 
      },
      { 
        context: "When making decisions,",
        statements: [
          "I trust my gut",
          "I go with what feels right", 
          "I act on my instincts"
        ],
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)" 
      }
    ]
  },
  {
    title: "Core Motivation",
    stones: [
      { 
        context: "What motivates me is staying safe",
        statements: [
          "I need security and preparation",
          "I want to avoid danger"
        ],
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" 
      },
      { 
        context: "What motivates me is being authentic",
        statements: [
          "I need to express my true self",
          "I want to be special and meaningful"
        ],
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)" 
      },
      { 
        context: "What motivates me is doing what's right",
        statements: [
          "I need to be strong and in control",
          "I want justice and fairness"
        ],
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" 
      }
    ]
  },
  {
    title: "Energy Direction",
    stones: [
      { 
        context: "I direct my energy inward",
        statements: [
          "I prefer reflection and depth",
          "I need quiet time to recharge"
        ],
        gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" 
      },
      { 
        context: "I direct my energy outward",
        statements: [
          "I push for impact and results",
          "I assert myself confidently"
        ],
        gradient: "linear-gradient(135deg, #f97316, #ea580c)" 
      },
      { 
        context: "I direct my energy toward cooperation",
        statements: [
          "I work well with others",
          "I support and maintain harmony"
        ],
        gradient: "linear-gradient(135deg, #84cc16, #65a30d)" 
      }
    ]
  },
  {
    title: "Social Approach",
    stones: [
      { 
        context: "In social situations,",
        statements: [
          "I prefer smaller groups",
          "I need meaningful conversations",
          "I value independence and space"
        ],
        gradient: "linear-gradient(135deg, #64748b, #475569)" 
      },
      { 
        context: "In social situations,",
        statements: [
          "I seek close connections",
          "I want intimacy and bonding",
          "I build strong personal relationships"
        ],
        gradient: "linear-gradient(135deg, #ec4899, #db2777)" 
      },
      { 
        context: "In social situations,",
        statements: [
          "I maintain my autonomy",
          "I stay self-reliant",
          "I don't depend on others too much"
        ],
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" 
      }
    ]
  },
  {
    title: "Processing Style",
    stones: [
      { 
        context: "I process information through thinking",
        statements: [
          "I analyze systems and concepts",
          "I focus on ideas and frameworks"
        ],
        gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" 
      },
      { 
        context: "I process information through feelings",
        statements: [
          "I pay attention to emotions and moods",
          "I trust what resonates emotionally"
        ],
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)" 
      },
      { 
        context: "I process information practically",
        statements: [
          "I focus on what works",
          "I want efficient, useful results"
        ],
        gradient: "linear-gradient(135deg, #059669, #047857)" 
      }
    ]
  },
  {
    title: "Stress Reaction",
    stones: [
      { 
        context: "When stressed,",
        statements: [
          "I become more cautious",
          "I analyze potential problems",
          "I prepare for what could go wrong"
        ],
        gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" 
      },
      { 
        context: "When stressed,",
        statements: [
          "I focus on recognition",
          "I worry about my image and identity",
          "I need to feel special and valued"
        ],
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)" 
      },
      { 
        context: "When stressed,",
        statements: [
          "I take charge",
          "I assert my authority and control",
          "I become more directive and demanding"
        ],
        gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" 
      }
    ]
  },
  {
    title: "Conflict Style",
    stones: [
      { 
        context: "In conflict,",
        statements: [
          "I seek peace and harmony",
          "I prefer mediation and compromise",
          "I try to calm things down"
        ],
        gradient: "linear-gradient(135deg, #22c55e, #16a34a)" 
      },
      { 
        context: "In conflict,",
        statements: [
          "I offer support and flexibility",
          "I adapt to help resolve things",
          "I try to meet everyone's needs"
        ],
        gradient: "linear-gradient(135deg, #84cc16, #65a30d)" 
      },
      { 
        context: "In conflict,",
        statements: [
          "I address issues directly",
          "I challenge when necessary",
          "I speak honestly and straightforwardly"
        ],
        gradient: "linear-gradient(135deg, #f97316, #ea580c)" 
      }
    ]
  },
  {
    title: "Success Definition",
    stones: [
      { 
        context: "I define success by high standards",
        statements: [
          "I measure by principles and accuracy",
          "I focus on improvement and doing things right"
        ],
        gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" 
      },
      { 
        context: "I define success by relationships",
        statements: [
          "I measure by connection and acknowledgment",
          "I value appreciation from others"
        ],
        gradient: "linear-gradient(135deg, #10b981, #059669)" 
      },
      { 
        context: "I define success by mastery",
        statements: [
          "I measure by achievement and capability",
          "I value competence and expertise"
        ],
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)" 
      }
    ]
  },
  {
    title: "Relationship Priority",
    stones: [
      { 
        context: "In relationships, I prioritize independence",
        statements: [
          "I need personal space and self-sufficiency",
          "I value my autonomy"
        ],
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" 
      },
      { 
        context: "In relationships, I prioritize mutuality",
        statements: [
          "I want sharing and give-and-take",
          "I value reciprocity and balance"
        ],
        gradient: "linear-gradient(135deg, #ec4899, #db2777)" 
      },
      { 
        context: "In relationships, I provide leadership",
        statements: [
          "I naturally give direction and guidance",
          "I take responsibility for others"
        ],
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)" 
      }
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
      name: "Block A",
      description: "I stay calm in the face of tension and seek to maintain internal balance. I want clarity and order, but without pressure or chaos.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 1,
      wing: '2',
      name: "Block B", 
      description: "I help others grow and improve by gently guiding them. I care about people's progress and feel responsible for their success.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ],
  2: [
    {
      id: 0,
      type: 2,
      wing: '1',
      name: "Block A",
      description: "I serve others with conviction and structure. My care is purposeful, and I believe doing what's right is part of helping.", 
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 2,
      wing: '3',
      name: "Block B",
      description: "I lift people up by being both supportive and successful. I feel fulfilled when I'm appreciated and seen as capable.",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    }
  ],
  3: [
    {
      id: 0,
      type: 3,
      wing: '2',
      name: "Block A",
      description: "I feel most accomplished when I make others shine. My success is about lifting people up and proving I can deliver results for others.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      id: 1,
      type: 3,
      wing: '4',
      name: "Block B", 
      description: "I feel most fulfilled when success reflects my deeper truth. It matters more that I express who I really am through what I achieve.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    }
  ],
  4: [
    {
      id: 0,
      type: 4,
      wing: '3',
      name: "Block A",
      description: "I want to be noticed for my originality and impact. I enjoy being visible when it comes from something meaningful I've created.",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      id: 1,
      type: 4,
      wing: '5',
      name: "Block B",
      description: "I'm drawn to emotional depth and inner reflection. I want to understand myself, even if I stay behind the scenes.", 
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    }
  ],
  5: [
    {
      id: 0,
      type: 5,
      wing: '4',
      name: "Block A",
      description: "I take in the world through quiet observation and emotional insight. My thinking is personal, reflective, and often creative.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 5,
      wing: '6',
      name: "Block B",
      description: "I gather facts to make sense of things and stay prepared. I prefer clear systems, structure, and practical reasoning.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ],
  6: [
    {
      id: 0,
      type: 6,
      wing: '5',
      name: "Block A",
      description: "I seek answers and stay prepared for what could go wrong. Knowing more makes me feel safer and more capable.",
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    },
    {
      id: 1,
      type: 6,
      wing: '7',
      name: "Block B",
      description: "I lean into positivity and possibility. I stay light and hopeful, even when things are unclear.",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    }
  ],
  7: [
    {
      id: 0,
      type: 7,
      wing: '6',
      name: "Block A",
      description: "I crave excitement, but I feel most alive when I also have some kind of security or plan to fall back on.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      id: 1,
      type: 7,
      wing: '8',
      name: "Block B",
      description: "I don't wait — I dive into life with boldness and spontaneity. I want to experience everything without limits.",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    }
  ],
  8: [
    {
      id: 0,
      type: 8,
      wing: '7',
      name: "Block A",
      description: "I lead with energy, bold moves, and confidence. I like to keep things moving and push through resistance.", 
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      id: 1,
      type: 8,
      wing: '9',
      name: "Block B",
      description: "I lead with quiet conviction and strength. I protect what matters without needing to dominate.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    }
  ],
  9: [
    {
      id: 0,
      type: 9,
      wing: '1',
      name: "Block A",
      description: "I stay calm and grounded, but I don't hesitate to stand firm for what's right. Peace doesn't mean surrender.",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    },
    {
      id: 1,
      type: 9,
      wing: '8',
      name: "Block B", 
      description: "I ease tension by being warm but firm. I aim to unify people, even when I need to assert myself clearly.",
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
