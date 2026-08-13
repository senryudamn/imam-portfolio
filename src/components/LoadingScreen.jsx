import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

export default function LoadingScreen({ isLoading, onComplete }) {
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <TriangleAlert size={80} className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]" />
          </motion.div>
          <p className="mt-8 font-typewriter text-xl tracking-widest text-[#e8dcb8]">
            DECODING ANOMALIES...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}