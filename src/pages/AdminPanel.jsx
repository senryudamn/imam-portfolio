import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock } from 'lucide-react';
import { getProfile, getProjects, getAchievements, getGallery } from '../data';
import { Link } from 'react-router-dom';

// IMPORT KOMPONEN LANYARD 3D BARU KITA
import Lanyard from '../components/Lanyard';

export default function MainPortfolio() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    setProfile(getProfile());
    setProjects(getProjects());
    setAchievements(getAchievements());
    setGallery(getGallery());
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Terminal size={48} className="text-primary-green mb-4" />
        </motion.div>
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="font-mono text-primary-green">
          SYSTEM ONLINE... LOADING UI
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="min-h-screen">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 w-full glass-panel z-50 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="font-mono text-primary-green font-bold text-xl tracking-wider">IMAM.dev</div>
        <div className="hidden md:flex gap-6 text-sm font-semibold items-center">
          <a href="#about" className="hover:text-primary-green transition">About</a>
          <a href="#projects" className="hover:text-primary-green transition">Portfolio</a>
          <a href="#achievements" className="hover:text-primary-green transition">Prestasi</a>
          <a href="#gallery" className="hover:text-primary-green transition">Galeri</a>
          <Link to="/admin" className="flex items-center gap-1.5 text-text-muted hover:text-white transition bg-primary-green/10 px-3 py-1.5 rounded border border-primary-green/30">
            <Lock size={14}/> Admin Mode
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-32 pb-20 px-6 sm:px-12 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-20">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">{profile.name}</h1>
          <h2 className="text-2xl font-mono text-primary-green">{profile.role}</h2>
          <p className="text-lg text-text-muted leading-relaxed max-w-xl">{profile.bio}</p>

          {/* Social Icons */}
          <div className="flex gap-4 pt-4">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-3 glass-panel rounded-full hover:bg-primary-green hover:text-white transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noreferrer" className="p-3 glass-panel rounded-full hover:bg-primary-green hover:text-white transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="p-3 glass-panel rounded-full hover:bg-primary-green hover:text-white transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="p-3 glass-panel rounded-full hover:bg-primary-green hover:text-white transition">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* LANYARD 3D / ID CARD HACKER */}
        <div className="flex-1 w-full flex flex-col items-center gap-6 relative">
          <div className="w-full h-[450px] sm:h-[550px] relative shrink-0">
             {/* Menggunakan foto avatar (yang diunggah dari Admin) sebagai gambar kartu depan dan belakang */}
             <Lanyard 
               position={[0, 0, 20]} 
               gravity={[0, -40, 0]} 
               frontImage={profile.avatar} 
               backImage={profile.avatar} 
             />
          </div>
          
          <div className="w-full max-w-sm glass-panel rounded-xl p-4 shadow-lg font-mono text-xs text-left z-20 -mt-10">
            <div className="flex items-center gap-2 mb-2 border-b border-primary-green/20 pb-2">
              <Terminal size={14} className="text-primary-green"/>
              <span className="text-primary-green">system_status.sh</span>
            </div>
            <p className="text-green-400">&gt; Status: Online & Ready</p>
            <p className="text-text-muted">&gt; Location: Yogyakarta, Indonesia</p>
          </div>
        </div>
      </section>

      {/* 1. Portfolio Section */}
      <section id="projects" className="py-16 px-6 sm:px-12 max-w-6xl mx-auto border-t border-primary-green/10">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide">PORTFOLIO & PROJECTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <motion.div whileHover={{ y: -8 }} key={proj.id} className="glass-panel rounded-xl overflow-hidden group">
              <div className="h-48 overflow-hidden relative">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
              </div>
              <div className="p-6">
                <p className="text-primary-green font-mono text-xs mb-2 uppercase tracking-wider">{proj.category}</p>
                <h3 className="text-xl font-bold mb-3">{proj.title}</h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-3">{proj.desc}</p>
                <div className="text-xs font-mono text-gray-300 bg-black/60 p-2.5 rounded border border-gray-800">{proj.tech}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Achievements Section */}
      <section id="achievements" className="py-16 px-6 sm:px-12 max-w-6xl mx-auto border-t border-primary-green/10">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide">PENCAPAIAN & PRESTASI</h2>
        <div className="space-y-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="glass-panel p-6 rounded-lg flex flex-col md:flex-row md:items-center gap-4 hover:border-primary-green/50 transition-colors">
              <div className="font-mono text-xl text-primary-green font-bold shrink-0">{ach.year}</div>
              <div className="w-full h-px bg-primary-green/20 md:w-px md:h-12 hidden md:block"></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{ach.title}</h3>
                <p className="text-text-muted text-sm">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Gallery / Documentation Section */}
      <section id="gallery" className="py-16 px-6 sm:px-12 max-w-6xl mx-auto border-t border-primary-green/10 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide">GALERI & DOKUMENTASI</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((photo) => (
            <div key={photo.id} className="glass-panel p-3 rounded-xl group relative overflow-hidden">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src={photo.url} alt="Dokumentasi" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="absolute inset-0 bg-black/80 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium text-white">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}