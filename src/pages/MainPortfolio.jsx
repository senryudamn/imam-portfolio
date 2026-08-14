import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock, ArrowUpRight } from 'lucide-react';
import { getProfile, getProjects, getAchievements, getGallery } from '../data';
import Lanyard from '../components/Lanyard'; 
import FoldText from '../components/FoldText';

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
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc]">
        <Terminal size={48} className="text-[#10b981] mb-4 animate-pulse" />
        <p className="font-mono text-sm tracking-widest text-[#10b981] uppercase">Memuat Portfolio...</p>
      </div>
    );
  }

  const githubUsername = profile.github ? profile.github.split('/').pop() : 'senryudamn';

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#10b981] selection:text-white">
      
      {/* NAVBAR MINIMALIS */}
      <nav className="fixed top-0 w-full bg-[#fcfcfc]/90 backdrop-blur-md z-50 py-5 px-6 md:px-12 flex justify-between items-center border-b border-slate-200">
        <div className="font-black text-xl tracking-tighter flex items-center gap-2">
          <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
          IMAM.dev
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
          <a href="#about" className="hover:text-[#10b981] transition-colors">Home</a>
          <a href="#projects" className="hover:text-[#10b981] transition-colors">Projects</a>
          <a href="#achievements" className="hover:text-[#10b981] transition-colors">Experience</a>
          <a href="#contact" className="hover:text-[#10b981] transition-colors">Contact</a>
          
          {/* FIX MUTLAK ADMIN STUCK: Menggunakan tag <a> biasa untuk hard-reload server */}
          <a href="/admin" className="flex items-center gap-1.5 text-[#10b981] hover:text-white hover:bg-[#10b981] transition-all px-4 py-1.5 rounded-full border border-[#10b981]">
            <Lock size={14}/> Admin Mode
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="about" className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-2">Based in Yogyakarta, Indonesia</p>
          
          <div className="h-auto md:h-[180px]">
            <FoldText
              text={`Hi, I'm ${profile.name?.split(' ')[0] || "Imam"}.\n${profile.role || "Mechatronics Engineer"}`}
              splitBy="line"
              hinge="bottom"
              trigger="mount"
              duration={0.8}
              stagger={0.2}
              fontSize={72}
              fontWeight={900}
              color="#0f172a"
            />
          </div>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-medium">{profile.bio}</p>

          <div className="flex gap-4 pt-6">
            <a href="#projects" className="bg-[#10b981] text-white font-bold px-8 py-3.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30">View Work</a>
            <a href="#contact" className="bg-white text-slate-900 border border-slate-200 font-bold px-8 py-3.5 rounded-full hover:bg-slate-50 transition">Let's Talk</a>
          </div>
        </div>

        {/* FOTO PROFIL KOTAK & HITAM PUTIH */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="w-72 h-96 relative bg-slate-200 p-2 shadow-2xl">
            <img 
              src={profile.avatar} 
              alt="Profile" 
              className="w-full h-full object-cover grayscale border border-slate-300"
            />
            {/* Dekorasi tech kecil */}
            <div className="absolute -bottom-4 -left-4 bg-white p-3 shadow-lg border border-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold font-mono">AVAILABLE FOR WORK</span>
            </div>
          </div>
        </div>
      </section>

      {/* GITHUB CONTRIBUTIONS */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">Github Contributions</h2>
        <div className="bg-white p-8 border border-slate-200 shadow-sm overflow-x-auto">
          <img src={`https://ghchart.rshah.org/10b981/${githubUsername}`} alt="GitHub Chart" className="min-w-[700px] w-full mx-auto" />
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200 bg-slate-100/50">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Selected Projects</h2>
          <p className="text-slate-500 font-medium">Things I've built and shipped.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((proj) => (
            <motion.div whileHover={{ y: -8 }} key={proj.id} className="bg-white border border-slate-200 p-6 flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-64 overflow-hidden mb-6 relative bg-slate-100">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-[#10b981] font-bold text-xs uppercase tracking-widest mb-3">{proj.category}</p>
                <h3 className="text-2xl font-black mb-3 text-slate-900 flex items-center justify-between">
                  {proj.title}
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
                </h3>
                <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">{proj.desc}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {proj.tech.split(',').map((tech, idx) => (
                    <span key={idx} className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded border border-slate-200">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200">
         <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Experiences & Awards</h2>
        </div>
        <div className="space-y-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-white border border-slate-200 p-8 flex flex-col md:flex-row md:items-start gap-8 hover:border-[#10b981] transition-colors shadow-sm">
              <div className="font-mono text-xl text-slate-400 font-bold shrink-0 w-24 pt-1">{ach.year}</div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{ach.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT & LANYARD SECTION PADA BAGIAN PALING BAWAH */}
      <section id="contact" className="w-full bg-[#0f172a] text-white pt-24 pb-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center z-20 relative text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Let's Work <br/><span className="text-[#10b981]">Together</span></h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md">
            Reach out via email or drag the ID card below to connect!
          </p>
          
          {/* LANYARD 3D KECIL & DI TENGAH */}
          <div className="w-full h-[500px] relative -mt-8 mb-12 cursor-grab active:cursor-grabbing">
             <Lanyard position={[0, 0, 12]} gravity={[0, -30, 0]} frontImage={profile.avatar} backImage={profile.avatar} />
          </div>

          <a href={`mailto:${profile.email}`} className="bg-[#10b981] text-white font-black text-xl px-12 py-5 rounded-full hover:bg-emerald-400 transition shadow-2xl z-20 relative -mt-16 border-4 border-[#0f172a]">
            {profile.email || "Email Me"}
          </a>

          <div className="flex gap-6 mt-16 text-slate-400 font-semibold tracking-widest text-sm uppercase">
            {profile.linkedin && <a href={profile.linkedin} className="hover:text-white transition">LinkedIn</a>}
            {profile.github && <a href={profile.github} className="hover:text-white transition">GitHub</a>}
            {profile.instagram && <a href={profile.instagram} className="hover:text-white transition">Instagram</a>}
          </div>
        </div>
      </section>

    </div>
  );
}