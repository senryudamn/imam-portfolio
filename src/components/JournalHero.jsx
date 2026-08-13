export default function JournalHero() {
  return (
    <section className="py-16 md:py-24 border-b border-slate-700/50">
      <div className="flex flex-col-reverse md:flex-row gap-12 items-center md:items-start justify-between">
        <div className="flex-1 space-y-6">
          <div>
            <p className="font-mono text-accent-cyan mb-2">Hello, I am</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">
              Imam Akbari Majid.
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-text-secondary">
              Mechatronics Engineer.
            </h2>
          </div>
          
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            I specialize in bridging the gap between hardware and software. 
            Passionate about automation, IoT architectures, and building intelligent embedded systems.
            <span className="block mt-2 text-sm font-mono text-accent-violet opacity-80">
              // The anomalies in the code are just features yet to be understood.
            </span>
          </p>

          <div className="flex gap-4 pt-4">
             <button className="px-6 py-3 bg-accent-cyan hover:bg-cyan-400 text-bg-dark font-semibold rounded transition-colors">
                View Projects
             </button>
             <button className="px-6 py-3 border border-slate-600 hover:border-text-primary text-text-primary rounded transition-colors">
                Contact Me
             </button>
          </div>
        </div>
        
        {/* Foto Profil - Bersih dan modern */}
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-bg-card shadow-[0_0_30px_rgba(6,182,212,0.15)] shrink-0">
          <img src="/gambar1.jpeg" alt="Imam Akbari Majid" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    </section>
  );
}