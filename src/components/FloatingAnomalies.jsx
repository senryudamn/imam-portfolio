import { motion } from 'framer-motion';

export default function FloatingAnomalies() {
  const anomalies = ["👁️", "∆", "X", "???", "★", "∑"];
  
  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
      {anomalies.map((symbol, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [0, Math.random() * 150 - 75, Math.random() * -150 + 75, 0], 
            y: [0, Math.random() * 300 - 150, Math.random() * -300 + 150, 0], 
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 35 + (i * 5), // Sangat lambat
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute text-parchment/10 text-6xl md:text-9xl font-creepy select-none"
          style={{
            top: `${15 + (i * 15)}%`,
            left: `${10 + (i * 15)}%`
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
}