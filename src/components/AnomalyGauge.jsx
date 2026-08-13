export default function AnomalyGauge({ percent }) {
  const rotation = -90 + (percent * 1.8);
  const isAnomaly = percent >= 95;

  return (
    <div className="fixed right-6 bottom-12 z-50 flex flex-col items-center">
      <p className={`font-heading text-lg mb-2 ${isAnomaly ? 'text-blood-red animate-glitch font-bold' : 'text-parchment'}`}>
        {isAnomaly ? 'ANOMALY FOUND (100%)' : `NORMAL (${Math.round(percent)}%)`}
      </p>
      
      <div className="relative w-32 aspect-[2/1] rounded-t-full overflow-hidden border-2 border-b-0 border-parchment bg-pine-green/80 backdrop-blur-sm">
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-[90%] bg-neon-cyan origin-bottom transition-transform duration-100 ease-out drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-wood-brown rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}