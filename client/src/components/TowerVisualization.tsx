import { motion, AnimatePresence } from 'framer-motion';

interface TowerVisualizationProps {
  title: string;
  blocks: Array<{
    gradient: string;
    width: string;
    height: string;
  }>;
}

export function TowerVisualization({ title, blocks }: TowerVisualizationProps) {
  return (
    <div className="tower-viz bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-center text-lg font-semibold mb-6">{title}</h3>
      <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`${block.gradient} ${block.width} ${block.height} rounded tower-block shadow-sm`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
