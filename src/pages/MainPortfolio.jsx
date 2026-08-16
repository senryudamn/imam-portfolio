import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowUpRight, Send, Play, Pause, Sun, Moon } from 'lucide-react';
import { fetchProfile, fetchProjects, fetchAchievements, fetchGallery } from '../data'; 
import Lanyard from '../components/Lanyard'; 
import FoldText from '../components/FoldText';
import StaggeredMenu from '../components/StaggeredMenu'; 

// --- KOMPONEN PEMUTAR MUSIK MELAYANG ---
const FloatingMusicPlayer = ({ audioUrl, title, darkMode, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) return null; 

  return (
    <div 
      style={{ backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: theme.cardBorder }} 
      className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 flex items-center gap-3 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border transition-colors duration-300"
    >
      <audio ref={audioRef} src={audioUrl} loop />
      
      <button onClick={togglePlay} className="w-10 h-10 shrink-0 bg-[#10b981] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#10b981]/30">
        {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      
      <div className="overflow-hidden w-32 md:w-48 flex items-center">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
          className="text-sm font-bold whitespace-nowrap"
          style={{ color: theme.mainText }}
        >
          🎵 {title || "Unknown Track"}
        </motion.div>
      </div>
    </div>
  );
};

export default function MainPortfolio() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  // STATE DARK MODE (Default dari LocalStorage)
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

  // Memaksa background BODY berubah (Anti-Gagal)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fcfcfc';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setProfile(await fetchProfile());
        setProjects(await fetchProjects());
        setAchievements(await fetchAchievements());
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadData();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert("Pesan terkirim!");
    e.target.reset();
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#fcfcfc' }} className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
        <Terminal size={48} className="text-[#10b981] mb-4 animate-pulse" />
        <p className="font-mono text-sm tracking-widest text-[#10b981] uppercase">Memuat Portfolio...</p>
      </div>
    );
  }

  const githubUsername = profile.github ? profile.github.split('/').pop() : 'senryudamn';
  const firstName = profile.name ? profile.name.split(' ')[0] : 'imam';
  const role = profile.role || 'IoT & Automation';

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '#about' },
    { label: 'Projects', ariaLabel: 'View our projects', link: '#projects' },
    { label: 'Experience', ariaLabel: 'View my experience', link: '#achievements' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
  ];

  const socialItems = [
    ...(profile.linkedin ? [{ label: 'LinkedIn', link: profile.linkedin }] : []),
    ...(profile.github ? [{ label: 'GitHub', link: profile.github }] : []),
    ...(profile.email ? [{ label: 'Email', link: `mailto:${profile.email}` }] : [])
  ];

  // VARIABEL TEMA ABSOLUT (Bypass Tailwind)
  const theme = {
    mainBg: darkMode ? '#0f172a' : '#fcfcfc',
    mainText: darkMode ? '#f8fafc' : '#0f172a',
    mutedText: darkMode ? '#94a3b8' : '#64748b',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    cardBorder: darkMode ? '#334155' : '#e2e8f0',
    sectionBg: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.5)'
  };

  return (
    <div style={{ backgroundColor: theme.mainBg, color: theme.mainText, transition: 'background-color 0.3s ease, color 0.3s ease' }} className="min-h-screen font-sans selection:bg-[#10b981] selection:text-white relative">
      
      {/* TOMBOL TOGGLE DARK MODE */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border text-[#10b981] hover:scale-110 transition-all duration-300"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* PEMUTAR MUSIK */}
      <FloatingMusicPlayer audioUrl={profile.audioUrl} title={profile.audioTitle} darkMode={darkMode} theme={theme} />

      {/* MENU NAVIGASI */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        isFixed={true}
        darkMode={darkMode} 
        menuButtonColor={darkMode ? "#10b981" : "#0f172a"} 
        openMenuButtonColor="#10b981"
        changeMenuColorOnOpen={true}
        colors={darkMode ? ['#1e293b', '#334155'] : ['#f1f5f9', '#e2e8f0']} 
        accentColor="#10b981" 
      />

      <section id="about" className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-6">
          <p style={{ color: theme.mutedText }} className="text-sm font-bold tracking-widest uppercase mb-2 transition-colors">Based in Yogyakarta, Indonesia</p>
          
          <div className="h-auto md:h-[180px] w-full">
            <FoldText
              key={darkMode ? 'dark' : 'light'} // Merender ulang animasi teks agar sinkron
              text={`Hi, I'm ${firstName}.\n${role}`}
              splitBy="line"
              hinge="bottom"
              trigger="mount"
              duration={0.8}
              stagger={0.2}
              fontSize={72}
              fontWeight={900}
              color={theme.mainText}
            />
          </div>

          <p style={{ color: theme.mutedText }} className="text-lg leading-relaxed max-w-xl font-medium transition-colors">{profile.bio}</p>
          <div className="flex gap-4 pt-6">
            <a href="#projects" className="bg-[#10b981] text-white font-bold px-8 py-3.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-[#10b981]/30">View Work</a>
            <a href="#contact" style={{ backgroundColor: theme.cardBg, color: theme.mainText, borderColor: theme.cardBorder }} className="border font-bold px-8 py-3.5 rounded-full transition">Let's Talk</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <div style={{ backgroundColor: darkMode ? '#0f172a' : '#e2e8f0' }} className="w-72 h-96 relative p-2 shadow-2xl rounded-2xl transition-colors">
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover grayscale border rounded-xl" style={{ borderColor: theme.cardBorder }} />
            <div style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="absolute -bottom-4 -left-4 p-3 shadow-lg border flex items-center gap-2 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              <span style={{ color: theme.mainText }} className="text-xs font-bold font-mono transition-colors">AVAILABLE FOR WORK</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t" style={{ borderColor: theme.cardBorder }}>
        <h2 style={{ color: theme.mutedText }} className="text-sm font-bold tracking-widest uppercase mb-8 transition-colors">Github Contributions</h2>
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="p-8 border shadow-sm overflow-x-auto rounded-xl transition-colors">
          <img src={`https://ghchart.rshah.org/10b981/${githubUsername}`} alt="GitHub Chart" className="min-w-[700px] w-full mx-auto" />
        </div>
      </section>

      <section id="projects" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t" style={{ backgroundColor: theme.sectionBg, borderColor: theme.cardBorder, transition: 'background-color 0.3s ease' }}>
        <div className="mb-16">
          <h2 style={{ color: theme.mainText }} className="text-4xl font-black mb-4 tracking-tight transition-colors">Selected Projects</h2>
          <p style={{ color: theme.mutedText }} className="font-medium transition-colors">Things I've built and shipped.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((proj) => (
            <motion.div whileHover={{ y: -8 }} key={proj.id} style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="border p-6 flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
              <div style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }} className="h-64 overflow-hidden mb-6 relative rounded-xl transition-colors">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-[#10b981] font-bold text-xs uppercase tracking-widest mb-3">{proj.category}</p>
                <h3 style={{ color: theme.mainText }} className="text-2xl font-black mb-3 flex items-center justify-between transition-colors">
                  {proj.title}
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
                </h3>
                <p style={{ color: theme.mutedText }} className="mb-6 line-clamp-3 leading-relaxed transition-colors">{proj.desc}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {(proj.tech || "").split(',').map((tech, idx) => (
                    <span key={idx} style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9', color: theme.mutedText, borderColor: theme.cardBorder }} className="text-xs font-mono font-bold px-3 py-1 rounded border transition-colors">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="achievements" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t" style={{ borderColor: theme.cardBorder }}>
         <div className="mb-16">
          <h2 style={{ color: theme.mainText }} className="text-4xl font-black mb-4 tracking-tight transition-colors">Experiences & Awards</h2>
        </div>
        <div className="space-y-6">
          {achievements.map((ach) => (
            <div key={ach.id} style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="border p-8 rounded-2xl flex flex-col md:flex-row md:items-start gap-8 hover:border-[#10b981] transition-colors shadow-sm">
              <div style={{ color: theme.mutedText }} className="font-mono text-xl font-bold shrink-0 w-24 pt-1 transition-colors">{ach.year}</div>
              <div>
                <h3 style={{ color: theme.mainText }} className="text-2xl font-black mb-2 transition-colors">{ach.title}</h3>
                <p style={{ color: theme.mutedText }} className="font-medium leading-relaxed transition-colors">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="w-full bg-[#0f172a] text-white pt-24 pb-32 relative overflow-hidden border-t-8 border-[#10b981]">
        <div className="max-w-7xl mx-auto px-6 z-20 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
              Let's Work <span className="text-[#10b981]">Together</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Reach out via email or drag the ID card below to connect!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            <div className="w-full h-[550px] relative cursor-grab active:cursor-grabbing flex flex-col justify-center items-center bg-[#1e293b]/50 rounded-3xl border border-white/5 shadow-inner">
               <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
               <p className="absolute bottom-6 text-slate-500 font-mono text-xs tracking-widest uppercase">
                 &lt; Drag ID Card /&gt;
               </p>
            </div>

            <div className="bg-[#1e293b]/30 p-8 md:p-10 rounded-3xl border border-white/5 flex flex-col h-[550px] justify-between shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <Send className="text-[#10b981]" /> Hubungi Saya
                </h3>
                
                <form onSubmit={handleSendMessage} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2 pl-1">Nama</label>
                      <input type="text" placeholder="Nama Anda" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2 pl-1">Email</label>
                      <input type="email" placeholder="Email Anda" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 pl-1">Pesan</label>
                    <textarea rows="4" placeholder="Tuliskan pesan Anda..." className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] transition-all resize-none" required></textarea>
                  </div>
                  
                  <button type="submit" className="bg-[#10b981] text-[#0f172a] font-black text-lg px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all w-full mt-2">
                    Kirim Pesan Sekarang
                  </button>
                </form>
              </div>

              <div className="flex gap-6 mt-6 text-slate-500 font-bold tracking-widest text-sm uppercase justify-center pt-6 border-t border-slate-700/30">
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#10b981] transition">LinkedIn</a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-[#10b981] transition">GitHub</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}