import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowUpRight, Send, Play, Pause, Sun, Moon } from 'lucide-react';
import { fetchProfile, fetchProjects, fetchAchievements, fetchGallery } from '../data'; 
import Lanyard from '../components/Lanyard'; 
import FoldText from '../components/FoldText';
import StaggeredMenu from '../components/StaggeredMenu'; 

// --- KOMPONEN PEMUTAR MUSIK MELAYANG ---
const FloatingMusicPlayer = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Jika admin belum mengupload lagu, pemutar musik disembunyikan
  if (!audioUrl) return null; 

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 flex items-center gap-3 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <audio ref={audioRef} src={audioUrl} loop />
      
      <button onClick={togglePlay} className="w-10 h-10 shrink-0 bg-[#10b981] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#10b981]/30">
        {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      
      <div className="overflow-hidden w-32 md:w-48 flex items-center">
        {/* Animasi teks berjalan menggunakan Framer Motion */}
        <motion.div 
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
          className="text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap"
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
  
  // STATE DARK MODE
  const [darkMode, setDarkMode] = useState(false);

  // Menerapkan class 'dark' ke elemen <html> saat darkMode berubah
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-[#0f172a] transition-colors duration-300">
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

  return (
    // Perhatikan penambahan dark:bg-[#0f172a] dan dark:text-slate-100
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#10b981] selection:text-white relative transition-colors duration-500">
      
      {/* TOMBOL TOGGLE DARK MODE */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-12 h-12 bg-white dark:bg-[#1e293b] rounded-full flex items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all duration-300"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* PEMUTAR MUSIK DENGAN DATA DARI DATABASE */}
      <FloatingMusicPlayer audioUrl={profile.audioUrl} title={profile.audioTitle} />

      {/* MENU NAVIGASI */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        isFixed={true}
        menuButtonColor="#10b981" 
        openMenuButtonColor="#10b981"
        changeMenuColorOnOpen={true}
        colors={darkMode ? ['#0f172a', '#1e293b'] : ['#ffffff', '#f8fafc']} 
        accentColor="#10b981" 
      />

      <section id="about" className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2">Based in Yogyakarta, Indonesia</p>
          
          <div className="h-auto md:h-[180px] w-full">
            <FoldText
              text={`Hi, I'm ${firstName}.\n${role}`}
              splitBy="line"
              hinge="bottom"
              trigger="mount"
              duration={0.8}
              stagger={0.2}
              fontSize={72}
              fontWeight={900}
              color={darkMode ? "#ffffff" : "#0f172a"} // Warna teks fold adaptif
            />
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-medium">{profile.bio}</p>
          <div className="flex gap-4 pt-6">
            <a href="#projects" className="bg-[#10b981] text-white font-bold px-8 py-3.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-[#10b981]/30">View Work</a>
            <a href="#contact" className="bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold px-8 py-3.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition">Let's Talk</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="w-72 h-96 relative bg-slate-200 dark:bg-slate-800 p-2 shadow-2xl">
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover grayscale border border-slate-300 dark:border-slate-600" />
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#1e293b] p-3 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold font-mono dark:text-white">AVAILABLE FOR WORK</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-8">Github Contributions</h2>
        <div className="bg-white dark:bg-[#1e293b] p-8 border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto rounded-xl">
          <img src={`https://ghchart.rshah.org/10b981/${githubUsername}`} alt="GitHub Chart" className="min-w-[700px] w-full mx-auto" />
        </div>
      </section>

      <section id="projects" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Selected Projects</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Things I've built and shipped.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((proj) => (
            <motion.div whileHover={{ y: -8 }} key={proj.id} className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 p-6 flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
              <div className="h-64 overflow-hidden mb-6 relative bg-slate-100 dark:bg-slate-800 rounded-xl">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-[#10b981] font-bold text-xs uppercase tracking-widest mb-3">{proj.category}</p>
                <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white flex items-center justify-between">
                  {proj.title}
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">{proj.desc}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {(proj.tech || "").split(',').map((tech, idx) => (
                    <span key={idx} className="text-xs font-mono font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="achievements" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
         <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Experiences & Awards</h2>
        </div>
        <div className="space-y-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 p-8 rounded-2xl flex flex-col md:flex-row md:items-start gap-8 hover:border-[#10b981] dark:hover:border-[#10b981] transition-colors shadow-sm">
              <div className="font-mono text-xl text-slate-400 dark:text-slate-500 font-bold shrink-0 w-24 pt-1">{ach.year}</div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{ach.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian Contact biarkan tetap tema gelap mutlak seperti sebelumnya agar Lanyard 3D terlihat keren */}
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