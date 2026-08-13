export default function JournalTimeline() {
  return (
    <section 
      className="p-8 md:p-16 relative mt-16 bg-pine-green/10"
      // Efek Kertas Robek (Torn Edge) menggunakan clip-path
      style={{ 
        clipPath: 'polygon(0 0, 10% 2%, 20% 0, 30% 3%, 40% 0, 50% 2%, 60% 0, 70% 3%, 80% 0, 90% 2%, 100% 0, 100% 100%, 0 100%)' 
      }}
    >
      {/* Teks Latar Belakang Samar */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0 overflow-hidden">
        <span className="font-heading text-8xl md:text-9xl text-wood-brown rotate-[-10deg] whitespace-nowrap">
          TRUST NO ONE
        </span>
      </div>
      
      <div className="relative z-10">
        <h2 className="font-heading text-4xl text-pine-green mb-8 border-b-2 border-pine-green/30 inline-block pb-2">
          Timeline of Anomalies
        </h2>
        
        <div className="space-y-6 font-typewriter text-wood-brown text-lg">
          <div className="flex gap-4">
            <div className="w-16 font-bold text-blood-red shrink-0">2024</div>
            <div>Entered the dimension of Universitas Negeri Yogyakarta. The observation begins.</div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-16 font-bold text-blood-red shrink-0">2025</div>
            <div>Began tampering with embedded systems. The mechanical heliotropism and smart walker prototypes were born.</div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-16 font-bold text-blood-red shrink-0">2026</div>
            <div>The current timeline. Developing the ENZYRA reactor and Gambut Guardian. The anomalies in the code are increasing...</div>
          </div>
        </div>
      </div>
    </section>
  );
}