import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProfile, fetchProjects, fetchAchievements, fetchGallery } from '../data'; 
import Lanyard from '../components/Lanyard'; 
import FoldText from '../components/FoldText';
import StaggeredMenu from '../components/StaggeredMenu'; 
import ScrollVelocity from '../components/ScrollVelocity'; 
import TextType from '../components/TextType'; 
import { Terminal, ArrowUpRight, Send, Play, Pause, Sun, Moon, ArrowLeft, Loader2, Disc } from 'lucide-react';

// --- KOMPONEN PEMUTAR MUSIK MELAYANG (PREMIUM REDESIGN) ---
const FloatingMusicPlayer = ({ audioUrl, title, darkMode, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) return null; 

  const trackTitle = title || "Unknown Track";

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 flex items-center p-1.5 pr-5 gap-4 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-500 overflow-hidden group hover:scale-[1.02]"
      style={{ 
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)', 
        borderColor: theme.cardBorder 
      }}
    >
      <audio ref={audioRef} src={audioUrl} loop onEnded={() => setIsPlaying(false)} />
      
      {/* Tombol Play/Pause dengan Efek Denyut (Pulse) */}
      <button 
        onClick={togglePlay} 
        className="relative w-11 h-11 shrink-0 bg-[#10b981] rounded-full flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] z-10"
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        
        {/* Ring Ping Animasi saat Playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border-2 border-[#10b981] animate-ping opacity-50"></span>
        )}
      </button>
      
      <div className="flex flex-col justify-center overflow-hidden">
        
        <div className="flex items-center gap-2">
          {/* Ikon Vinyl Berputar */}
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="text-[#10b981] shrink-0"
          >
            <Disc size={14} />
          </motion.div>

          {/* Teks Berjalan dengan Efek Memudar di Ujung (Masking) */}
          <div 
            className="overflow-hidden w-24 md:w-36 relative flex items-center"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: '-webkit-linear-gradient(left, transparent 0%, black 10%, black 90%, transparent 100%)'
            }}
          >
            <motion.div 
              animate={{ x: isPlaying ? ["0%", "-50%"] : "0%" }}
              transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
              className="flex whitespace-nowrap gap-6 text-xs font-bold tracking-wide"
              style={{ color: theme.mainText }}
            >
              {/* Teks diduplikasi agar gulungannya tidak pernah putus (seamless) */}
              <span>{trackTitle}</span>
              <span>{trackTitle}</span>
              <span>{trackTitle}</span>
            </motion.div>
          </div>
        </div>

        {/* Audio Visualizer Mini (Bar Naik Turun) */}
        <div className="flex items-end gap-[3px] h-2.5 mt-1 ml-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] bg-[#10b981] rounded-t-sm"
              animate={isPlaying ? { height: ["3px", "10px", "4px", "8px", "3px"] } : { height: "3px" }}
              transition={{
                repeat: Infinity,
                duration: 0.6 + (i * 0.1),
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
              style={{ opacity: isPlaying ? 1 : 0.3 }}
            />
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default function MainPortfolio() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]); 
  
  // STATE STATISTIK GITHUB OTOMATIS
  const [githubStats, setGithubStats] = useState({ repos: 0, followers: 0, following: 0, isLoaded: false });
  
  // STATE DARK MODE
  const [darkMode, setDarkMode] = useState(false);
  
  // STATE VIRTUAL ROUTING
  const [activeView, setActiveView] = useState('home'); 
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

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
        const profileData = await fetchProfile();
        setProfile(profileData || {});
        setProjects(await fetchProjects());
        setAchievements(await fetchAchievements());
        setGallery(await fetchGallery());

        // --- MENGAMBIL DATA STATISTIK GITHUB SECARA OTOMATIS ---
        const rawGithubUrl = profileData?.github || 'https://github.com/senryudamn';
        const cleanUrl = rawGithubUrl.replace(/\/$/, ''); 
        const extractedUsername = cleanUrl.split('/').pop();

        try {
          const ghRes = await fetch(`https://api.github.com/users/${extractedUsername}`);
          if (ghRes.ok) {
            const ghData = await ghRes.json();
            setGithubStats({
              repos: ghData.public_repos || 0,
              followers: ghData.followers || 0,
              following: ghData.following || 0,
              isLoaded: true 
            });
          } else {
            // Jika limit API Github habis
            setGithubStats({ repos: '-', followers: '-', following: '-', isLoaded: true });
          }
        } catch (ghError) {
          // Jika gagal terkoneksi internet ke Github
          setGithubStats({ repos: '-', followers: '-', following: '-', isLoaded: true });
        }
        // -------------------------------------

      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#projects-all') {
        setActiveView('all-projects');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#project-detail')) {
        setActiveView('detail');
        window.scrollTo(0, 0);
      } else {
        setActiveView('home');
        setTimeout(() => {
          if (hash === '' || hash === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const el = document.getElementById(hash.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openProjectDetail = (proj) => {
    setSelectedProject(proj);
    window.location.hash = `#project-detail-${proj.id || proj.tempId}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert("Pesan terkirim!");
    e.target.reset();
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: darkMode ? '#0f172a' : '#fcfcfc' }} className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center text-[#10b981] font-mono text-5xl md:text-6xl mb-5 font-light tracking-tighter">
            <span>&gt;</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              _
            </motion.span>
          </div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#10b981] uppercase font-medium ml-2"
          >
            MEMUAT PORTFOLIO...
          </motion.p>
        </div>
      </div>
    );
  }

  // Gunakan logika pembersihan yang sama untuk username di bagian Chart
  const rawGithubUrl = profile?.github || 'https://github.com/senryudamn';
  const githubUsername = rawGithubUrl.replace(/\/$/, '').split('/').pop();
  
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'imam';
  const role = profile?.role || 'IoT & Automation';

  // MENU ITEMS DIPERBARUI DENGAN LINK ABOUT
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
    { label: 'About', ariaLabel: 'About me', link: '#about' }, // <-- Link About ditambahkan
    { label: 'Projects', ariaLabel: 'View our projects', link: '#projects-all' },
    { label: 'Experience', ariaLabel: 'View my experience', link: '#achievements' },
    { label: 'Gallery', ariaLabel: 'View photo gallery', link: '#gallery' }, 
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
  ];

  const socialItems = [
    ...(profile.linkedin ? [{ label: 'LinkedIn', link: profile.linkedin }] : []),
    ...(profile.github ? [{ label: 'GitHub', link: profile.github }] : []),
    ...(profile.email ? [{ label: 'Email', link: `mailto:${profile.email}` }] : [])
  ];

  const theme = {
    mainBg: darkMode ? '#0f172a' : '#fcfcfc',
    mainText: darkMode ? '#f8fafc' : '#0f172a',
    mutedText: darkMode ? '#94a3b8' : '#64748b',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    cardBorder: darkMode ? '#334155' : '#e2e8f0',
    sectionBg: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.5)'
  };

  // --- KOMPONEN KARTU PROJECT ---
  const ProjectCard = ({ proj }) => (
    <motion.div 
      onClick={() => openProjectDetail(proj)}
      whileHover={{ y: -8 }} 
      style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
      className="border p-6 flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl cursor-pointer"
    >
      <div 
        style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }} 
        className="h-64 overflow-hidden mb-6 relative rounded-2xl transition-colors"
      >
        <img 
          src={proj.image || (proj.images && proj.images[0])} 
          alt={proj.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-[#10b981] font-bold text-xs uppercase tracking-widest mb-3">
          {proj.category}
        </p>
        <h3 
          style={{ color: theme.mainText }} 
          className="text-2xl font-black mb-3 flex items-center justify-between transition-colors"
        >
          {proj.title}
          <ArrowUpRight className="text-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
        </h3>
        <p 
          style={{ color: theme.mutedText }} 
          className="mb-6 line-clamp-3 leading-relaxed transition-colors"
        >
          {proj.desc}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          {(proj.tech || "").split(',').map((tech, idx) => (
            <span 
              key={idx} 
              style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9', color: theme.mutedText, borderColor: theme.cardBorder }} 
              className="text-xs font-mono font-bold px-3 py-1 rounded-lg border transition-colors"
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div 
      style={{ backgroundColor: theme.mainBg, color: theme.mainText, transition: 'background-color 0.3s ease, color 0.3s ease' }} 
      className="min-h-screen font-sans selection:bg-[#10b981] selection:text-white relative pb-10"
    >
      
      {/* TOMBOL TOGGLE DARK MODE */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border text-[#10b981] hover:scale-110 transition-all duration-300"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <FloatingMusicPlayer 
        audioUrl={profile.audioUrl} 
        title={profile.audioTitle} 
        darkMode={darkMode} 
        theme={theme} 
      />

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

      <AnimatePresence mode="wait">
        
        {/* ======================================================== */}
        {/* VIEW 1: HALAMAN UTAMA (HOME) */}
        {/* ======================================================== */}
        {activeView === 'home' && (
          <motion.div 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            
            {/* HERO SECTION */}
            <section id="home" className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="flex-1 space-y-6">
                <p 
                  style={{ color: theme.mutedText }} 
                  className="text-sm font-bold tracking-widest uppercase mb-2 transition-colors"
                >
                  Based in Yogyakarta, Indonesia
                </p>
                <div className="h-auto md:h-[180px] w-full">
                  <FoldText 
                    key={darkMode ? 'dark' : 'light'} 
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
                <p 
                  style={{ color: theme.mutedText }} 
                  className="text-lg leading-relaxed max-w-xl font-medium transition-colors"
                >
                  {profile.bio}
                </p>
                <div className="flex gap-4 pt-6">
                  <a href="#projects" className="bg-[#10b981] text-white font-bold px-8 py-3.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-[#10b981]/30">
                    View Work
                  </a>
                  <a 
                    href="#contact" 
                    style={{ backgroundColor: theme.cardBg, color: theme.mainText, borderColor: theme.cardBorder }} 
                    className="border font-bold px-8 py-3.5 rounded-full transition hover:opacity-80"
                  >
                    Let's Talk
                  </a>
                </div>
              </div>
              <div className="flex-1 flex justify-center lg:justify-end">
                <div 
                  style={{ backgroundColor: darkMode ? '#0f172a' : '#e2e8f0' }} 
                  className="w-72 h-96 relative p-2 shadow-2xl rounded-[2rem] transition-colors"
                >
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover grayscale border rounded-[1.5rem]" 
                    style={{ borderColor: theme.cardBorder }} 
                  />
                  <div 
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
                    className="absolute -bottom-4 -left-4 p-3 shadow-lg border flex items-center gap-2 rounded-xl transition-colors"
                  >
                    <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                    <span 
                      style={{ color: theme.mainText }} 
                      className="text-xs font-bold font-mono transition-colors"
                    >
                      AVAILABLE FOR WORK
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW: ABOUT SECTION DENGAN EFEK TYPEWRITER (DIJADIKAN STRING TUNGGAL AGAR TIDAK DIHAPUS) */}
            <section 
              id="about" 
              className="py-32 px-6 sm:px-12 max-w-5xl mx-auto text-center flex items-center justify-center min-h-[50vh] border-t" 
              style={{ borderColor: theme.cardBorder }}
            >
              <TextType
                text={
                  profile.aboutTexts || 
                  "I build fullstack web systems\nwith clean user interfaces\nand database-driven workflows"
                }
                typingSpeed={50}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
                loop={false}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
                style={{ color: theme.mainText }}
              />
            </section>

            {/* GITHUB STATS OTOMATIS */}
            <section 
              className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t relative overflow-hidden" 
              style={{ borderColor: theme.cardBorder, backgroundColor: theme.mainBg, transition: 'background-color 0.3s ease' }}
            >
              <div className="absolute top-16 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none z-0">
                <span 
                  className="text-[8rem] md:text-[14rem] font-black tracking-tighter whitespace-nowrap transition-colors" 
                  style={{ color: theme.mainText, opacity: darkMode ? 0.03 : 0.04 }}
                >
                  CONTRIBUTIONS
                </span>
              </div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                  <div>
                    <p style={{ color: theme.mutedText }} className="text-sm font-bold tracking-widest uppercase mb-2">Coding Activity</p>
                    <h2 style={{ color: theme.mainText }} className="text-4xl md:text-5xl font-black tracking-tight uppercase">GitHub Contributions</h2>
                  </div>
                  <p style={{ color: theme.mutedText }} className="max-w-sm text-left md:text-right font-medium">
                    Automated open-source activity tracker pulled directly from GitHub API.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div 
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
                      className="border rounded-[2rem] p-8 flex-1 flex flex-col justify-center shadow-sm transition-colors hover:shadow-md"
                    >
                      <p style={{ color: theme.mutedText }} className="text-xs font-bold tracking-widest uppercase mb-4">Total Public Repos</p>
                      <h3 style={{ color: theme.mainText }} className="text-6xl md:text-7xl font-black mb-2 tracking-tighter">
                        {githubStats.isLoaded ? githubStats.repos : <Loader2 className="animate-spin text-[#10b981]" />}
                      </h3>
                      <p style={{ color: theme.mutedText }} className="text-sm font-medium">open-source repositories</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div 
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
                        className="border rounded-[2rem] p-6 flex flex-col justify-center shadow-sm transition-colors hover:shadow-md"
                      >
                        <p style={{ color: theme.mutedText }} className="text-[10px] font-bold tracking-widest uppercase mb-2">Followers</p>
                        <h4 style={{ color: theme.mainText }} className="text-2xl font-black">
                           {githubStats.isLoaded ? githubStats.followers : '-'}
                        </h4>
                      </div>
                      <div 
                        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
                        className="border rounded-[2rem] p-6 flex flex-col justify-center shadow-sm transition-colors hover:shadow-md"
                      >
                        <p style={{ color: theme.mutedText }} className="text-[10px] font-bold tracking-widest uppercase mb-2">Following</p>
                        <h4 style={{ color: theme.mainText }} className="text-2xl font-black">
                           {githubStats.isLoaded ? githubStats.following : '-'}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div 
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
                    className="lg:col-span-8 border rounded-[2rem] p-8 shadow-sm flex flex-col justify-between transition-colors hover:shadow-md"
                  >
                    <div className="overflow-x-auto pb-6 hide-scrollbar flex items-center justify-center flex-1">
                      <img 
                        src={`https://ghchart.rshah.org/10b981/${githubUsername}`} 
                        alt="GitHub Chart" 
                        className="min-w-[600px] w-full" 
                        style={{ opacity: darkMode ? 0.9 : 1 }} 
                      />
                    </div>
                    
                    <div 
                      className="mt-4 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center transition-colors" 
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <span style={{ color: theme.mutedText }} className="text-sm font-mono font-medium">@{githubUsername}</span>
                      <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.mutedText }}>
                        <span>Less</span>
                        <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></span>
                        <span className="w-3 h-3 rounded-sm bg-[#10b981]/40"></span>
                        <span className="w-3 h-3 rounded-sm bg-[#10b981]/60"></span>
                        <span className="w-3 h-3 rounded-sm bg-[#10b981]/80"></span>
                        <span className="w-3 h-3 rounded-sm bg-[#10b981]"></span>
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PROJECTS PREVIEW */}
            <section 
              id="projects" 
              className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t" 
              style={{ backgroundColor: theme.sectionBg, borderColor: theme.cardBorder, transition: 'background-color 0.3s ease' }}
            >
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 style={{ color: theme.mainText }} className="text-4xl font-black mb-4 tracking-tight transition-colors">Latest Projects</h2>
                  <p style={{ color: theme.mutedText }} className="font-medium transition-colors">A glimpse of what I've been working on recently.</p>
                </div>
                <button 
                  onClick={() => window.location.hash = '#projects-all'} 
                  className="bg-[#10b981] text-white font-bold px-6 py-3 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-[#10b981]/30 whitespace-nowrap"
                >
                  Lihat Semua Project
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {projects.slice(0, 2).map((proj) => (
                  <ProjectCard key={proj.id} proj={proj} />
                ))}
              </div>
            </section>

            {/* ACHIEVEMENTS */}
            <section 
              id="achievements" 
              className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t" 
              style={{ borderColor: theme.cardBorder }}
            >
              <div className="mb-16">
                <h2 style={{ color: theme.mainText }} className="text-4xl font-black mb-4 tracking-tight transition-colors">Experiences & Awards</h2>
              </div>
              <div className="space-y-6">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} 
                    className="border p-8 rounded-[2rem] flex flex-col md:flex-row md:items-start gap-8 hover:border-[#10b981] transition-colors shadow-sm"
                  >
                    <div style={{ color: theme.mutedText }} className="font-mono text-xl font-bold shrink-0 w-24 pt-1 transition-colors">{ach.year}</div>
                    <div>
                      <h3 style={{ color: theme.mainText }} className="text-2xl font-black mb-2 transition-colors">{ach.title}</h3>
                      <p style={{ color: theme.mutedText }} className="font-medium leading-relaxed transition-colors">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* GALLERY SECTION */}
            <section 
              id="gallery" 
              className="py-24 border-t overflow-hidden" 
              style={{ borderColor: theme.cardBorder, backgroundColor: theme.mainBg, transition: 'background-color 0.3s ease' }}
            >
              <div className="mb-16">
                <ScrollVelocity 
                  texts={['PHOTO GALLERY', 'MEMORIES & MOMENTS']} 
                  velocity={50} 
                  className="text-[#10b981] font-black tracking-tighter" 
                  numCopies={6} 
                  damping={50} 
                  stiffness={400} 
                />
              </div>
              <div className="px-6 sm:px-12 max-w-7xl mx-auto">
                {gallery.length === 0 ? (
                  <p style={{ color: theme.mutedText }} className="text-center italic">Belum ada foto di galeri.</p>
                ) : (
                  <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                    {gallery.map((gal) => (
                      <motion.div 
                        key={gal.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        whileHover={{ scale: 1.02 }} 
                        className="break-inside-avoid rounded-[2rem] overflow-hidden shadow-md border" 
                        style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}
                      >
                        <img src={gal.url} alt={gal.caption || 'Gallery Image'} className="w-full h-auto object-cover" />
                        {gal.caption && (
                          <div className="p-4">
                            <p style={{ color: theme.mainText }} className="text-sm font-medium">{gal.caption}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="w-full bg-[#0f172a] text-white pt-24 pb-32 relative overflow-hidden border-t-8 border-[#10b981]">
              <div className="max-w-7xl mx-auto px-6 z-20 relative">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">Let's Work <span className="text-[#10b981]">Together</span></h2>
                  <p className="text-slate-400 text-lg max-w-xl mx-auto">Reach out via email or drag the ID card below to connect!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                  <div className="w-full h-[550px] relative cursor-grab active:cursor-grabbing flex flex-col justify-center items-center bg-[#1e293b]/50 rounded-[2rem] border border-white/5 shadow-inner">
                    <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
                    <p className="absolute bottom-6 text-slate-500 font-mono text-xs tracking-widest uppercase">&lt; Drag ID Card /&gt;</p>
                  </div>

                  <div className="bg-[#1e293b]/30 p-8 md:p-10 rounded-[2rem] border border-white/5 flex flex-col h-[550px] justify-between shadow-2xl">
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3"><Send className="text-[#10b981]" /> Hubungi Saya</h3>
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
                        <button type="submit" className="bg-[#10b981] text-[#0f172a] font-black text-lg px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all w-full mt-2">Kirim Pesan Sekarang</button>
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
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: HALAMAN SEMUA PROJECT */}
        {/* ======================================================== */}
        {activeView === 'all-projects' && (
          <motion.div key="all-projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 sm:px-12 max-w-7xl mx-auto min-h-screen">
            <button 
              onClick={() => window.location.hash = '#home'} 
              className="flex items-center gap-2 font-bold mb-10 text-[#10b981] hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft size={20} /> Kembali ke Home
            </button>
            <div className="mb-16">
              <h2 style={{ color: theme.mainText }} className="text-4xl font-black mb-4 tracking-tight transition-colors">All Projects</h2>
              <p style={{ color: theme.mutedText }} className="font-medium transition-colors">A comprehensive list of everything I've built, created, and shipped.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {projects.map((proj) => <ProjectCard key={proj.id} proj={proj} />)}
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: HALAMAN DETAIL PROJECT */}
        {/* ======================================================== */}
        {activeView === 'detail' && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 sm:px-12 max-w-4xl mx-auto min-h-screen">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 font-bold mb-10 text-[#10b981] hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft size={20} /> Kembali
            </button>
            
            <div style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="border p-2 rounded-3xl shadow-xl mb-12 relative group overflow-hidden">
               {selectedProject.images && selectedProject.images.length > 1 ? (
                 <div className="w-full h-64 md:h-[450px] flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl bg-slate-100 dark:bg-slate-800">
                   {selectedProject.images.map((img, i) => (
                     <img key={i} src={img} alt={`${selectedProject.title} ${i}`} className="w-full h-full object-cover shrink-0 snap-center" />
                   ))}
                 </div>
               ) : (
                 <div className="w-full h-64 md:h-[450px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <img src={selectedProject.image || (selectedProject.images && selectedProject.images[0])} alt={selectedProject.title} className="w-full h-full object-cover" />
                 </div>
               )}
            </div>

            <div>
              <p className="text-[#10b981] font-bold text-sm uppercase tracking-widest mb-4">{selectedProject.category}</p>
              <h1 style={{ color: theme.mainText }} className="text-4xl md:text-6xl font-black mb-8 tracking-tight transition-colors">
                {selectedProject.title}
              </h1>
              <div style={{ color: theme.mutedText }} className="text-lg leading-relaxed whitespace-pre-wrap mb-10 transition-colors">
                {selectedProject.desc}
              </div>
              <div>
                <h3 style={{ color: theme.mainText }} className="text-lg font-bold mb-4 uppercase tracking-widest transition-colors">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {(selectedProject.tech || "").split(',').map((tech, idx) => (
                    <span 
                      key={idx} 
                      style={{ backgroundColor: theme.cardBg, color: theme.mainText, borderColor: theme.cardBorder }} 
                      className="font-mono font-bold px-4 py-2 rounded-lg border shadow-sm transition-colors text-sm"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}