// src/components/Detail/Container.tsx
import { motion } from 'framer-motion';

interface ContainerProps {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tokenCount: number;
  onTokenClick: () => void;
}

export default function Container({ id, emoji, title, description, tokenCount, onTokenClick }: ContainerProps) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
      data-container-id={id}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      
      <p className="text-white/70 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="text-white font-medium">
          Tokens: {tokenCount}
        </div>
        
        <button
          onClick={onTokenClick}
          className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-200 text-sm transition-colors"
        >
          Add Token
        </button>
      </div>
      
      {/* Visual token display */}
      <div className="flex flex-wrap gap-1 mt-3">
        {Array.from({ length: tokenCount }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-orange-400 rounded-full opacity-80" />
        ))}
      </div>
    </motion.div>
  );
}