import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowUpRight, Send } from 'lucide-react';
import { fetchProfile, fetchProjects, fetchAchievements, fetchGallery } from '../data'; 
import Lanyard from '../components/Lanyard'; 
import FoldText from '../components/FoldText';
import StaggeredMenu from '../components/StaggeredMenu'; 

export default function MainPortfolio() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await fetchProfile();
        const projectsData = await fetchProjects();
        const achievementsData = await fetchAchievements();
        const galleryData = await fetchGallery();

        setProfile(profileData);
        setProjects(projectsData);
        setAchievements(achievementsData);
        setGallery(galleryData);
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
    alert("Pesan Anda telah terkirim! (Ini adalah simulasi)");
    e.target.reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc]">
        <Terminal size={48} className="text-[#10b981] mb-4 animate-pulse" />
        <p className="font-mono text-sm tracking-widest text-[#10b981] uppercase">Memuat Portfolio...</p>
      </div>
    );
  }

  const githubUsername = profile.github ? profile.github.split('/').pop() : 'senryudamn';

  // LOGIKA NAMA: Ambil kata pertama dari nama lengkap, lalu jadikan Huruf Kapital awalnya
  const rawName = profile.name ? profile.name.split(' ')[0] : 'Imam';
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const role = profile.role || 'Mechatronics Engineer';

  // HAPUS ADMIN MODE DARI SINI (Kita pindahkan ke komponen menu langsung)
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
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-[#10b981] selection:text-white relative">
      
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
        colors={['#ffffff', '#f8fafc']} 
        accentColor="#10b981" 
      />

      <section id="about" className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-2">Based in Yogyakarta, Indonesia</p>
          
          {/* FOLD TEXT SEKARANG MENGGUNAKAN DATA YANG SUDAH DIFORMAT */}
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
              color="#0f172a"
            />
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-medium">{profile.bio}</p>
          <div className="flex gap-4 pt-6">
            <a href="#projects" className="bg-[#10b981] text-white font-bold px-8 py-3.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30">View Work</a>
            <a href="#contact" className="bg-white text-slate-900 border border-slate-200 font-bold px-8 py-3.5 rounded-full hover:bg-slate-50 transition">Let's Talk</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="w-72 h-96 relative bg-slate-200 p-2 shadow-2xl">
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover grayscale border border-slate-300" />
            <div className="absolute -bottom-4 -left-4 bg-white p-3 shadow-lg border border-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold font-mono">AVAILABLE FOR WORK</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">Github Contributions</h2>
        <div className="bg-white p-8 border border-slate-200 shadow-sm overflow-x-auto">
          <img src={`https://ghchart.rshah.org/10b981/${githubUsername}`} alt="GitHub Chart" className="min-w-[700px] w-full mx-auto" />
        </div>
      </section>

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
                  {(proj.tech || "").split(',').map((tech, idx) => (
                    <span key={idx} className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded border border-slate-200">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
                      <input type="text" placeholder="Nama Anda" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2 pl-1">Email</label>
                      <input type="email" placeholder="Email Anda" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 pl-1">Pesan / Penawaran</label>
                    <textarea rows="4" placeholder="Tuliskan pesan Anda di sini..." className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all resize-none" required></textarea>
                  </div>
                  
                  <button type="submit" className="bg-[#10b981] text-[#0f172a] font-black text-lg px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 w-full mt-2">
                    Kirim Pesan Sekarang
                  </button>
                </form>
              </div>

              <div className="flex gap-6 mt-6 text-slate-500 font-bold tracking-widest text-sm uppercase justify-center pt-6 border-t border-slate-700/30">
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#10b981] transition">LinkedIn</a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-[#10b981] transition">GitHub</a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="hover:text-[#10b981] transition">Email</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}