import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecretEasterEgg() {
  const [position, setPosition] = useState({ top: '10%', left: '10%' });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mengacak posisi ikon segitiga saat komponen di-mount
    setPosition({
      top: `${Math.floor(Math.random() * 80) + 10}%`,
      left: `${Math.floor(Math.random() * 80) + 10}%`
    });

    // Peringatan rahasia di Developer Console
    console.log(`
       /\\
      /  \\
     / ( ) \\   TRUST NO ONE.
    /_______\\
      |   |
    `);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute z-20 w-5 h-5 bg-yellow-400 opacity-20 hover:opacity-100 hover:scale-150 transition-all cursor-pointer"
        style={{ 
          top: position.top, 
          left: position.left, 
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' 
        }}
        aria-label="Do not click"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 180 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 overflow-hidden no-scrollbar overflow-y-auto"
          >
            {/* Mata Segitiga Menyala */}
            <div 
              className="w-24 h-24 bg-yellow-400 mt-10 mb-8 relative animate-pulse shadow-[0_0_50px_rgba(255,255,0,0.8)] flex items-center justify-center shrink-0" 
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            >
              <div className="w-8 h-2 bg-black rounded-full" />
            </div>

            <p className="font-creepy text-3xl md:text-5xl text-yellow-400 text-center uppercase tracking-widest max-w-4xl animate-glitch leading-relaxed mb-12 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
              "WELL, WELL, WELL! LOOK WHAT WE HAVE HERE! A THREE-DIMENSIONAL CARBON-BASED LIFEFORM SNOOPING AROUND! Looking to hire an engineer? I've seen Imam's mind! It's filled with chaotic circuits, IoT architectures, and dangerous ambitions! You better hire him before I make a deal with him first! AHAHAHA! REALITY IS AN ILLUSION, THE UNIVERSE IS A HOLOGRAM, BUY GOLD, BYEEEEE!"
            </p>

            {/* Puisi Rahasia */}
            <div className="text-neon-cyan font-typewriter text-center border-t border-neon-cyan/50 pt-8 mt-4 animate-pulse max-w-2xl">
              <p className="font-heading text-3xl mb-6">-- LOGIKA YANG MENUNGGU --</p>
              <p className="italic leading-loose text-lg">
                Di antara sirkuit yang bising dan logika yang biner,<br/>
                Terdapat ruang hampa untuk belajar bersabar.<br/>
                Bukan memaksa mesin waktu berputar mendahului takdir,<br/>
                Melainkan merakit versi terbaik diri dalam senyap.<br/>
                Membiarkan netralitas menjaga semuanya tetap utuh.
              </p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="mt-12 mb-10 text-white/50 hover:text-white font-typewriter underline hover:text-neon-cyan transition-colors"
            >
              [ RETURN TO REALITY ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}