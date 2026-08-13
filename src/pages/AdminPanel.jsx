import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProfile, saveProfile, getProjects, saveProjects, getAchievements, saveAchievements, getGallery, saveGallery } from '../data';
import { Trash2, Plus, LogOut, ArrowLeft, Lock, User, Briefcase, Trophy, Image as ImageIcon, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import konfigurasi Firebase
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // KUNCI KEAMANAN: Hanya email ini yang diizinkan masuk
  const ADMIN_EMAIL = "akbariimam8@gmail.com";

  // States Data
  const [profile, setProfileState] = useState({});
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', desc: '', category: '', tech: '', image: '' });
  const [achievements, setAchievements] = useState([]);
  const [newAch, setNewAch] = useState({ title: '', year: '', desc: '' });
  const [gallery, setGallery] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '' });

  useEffect(() => {
    // Listener untuk mengecek apakah user sudah login dengan akun Google sebelumnya
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setIsAuthenticated(true);
          loadAllData();
        } else {
          // Jika yang login bukan Imam, langsung tendang keluar
          signOut(auth);
          toast.error("Akses Ditolak: Email tidak dikenali sebagai Admin.");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAllData = () => {
    setProfileState(getProfile());
    setProjects(getProjects());
    setAchievements(getAchievements());
    setGallery(getGallery());
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === ADMIN_EMAIL) {
        toast.success(`Selamat datang, ${result.user.displayName}!`);
      } else {
        await signOut(auth);
        toast.error("Akses Ditolak: Anda bukan Admin.");
      }
    } catch (error) {
      toast.error("Gagal login dengan Google.");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Berhasil Logout');
    } catch (error) {
      toast.error('Terjadi kesalahan saat logout.');
    }
  };

  // --- Handlers CRUD ---
  const handleSaveProfile = (e) => { e.preventDefault(); saveProfile(profile); toast.success('Profil Diperbarui!'); };

  const handleAddProject = (e) => {
    e.preventDefault();
    const updated = [...projects, { ...newProject, id: Date.now() }];
    setProjects(updated); saveProjects(updated);
    setNewProject({ title: '', desc: '', category: '', tech: '', image: '' }); toast.success('Proyek Ditambahkan!');
  };
  const handleDeleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated); saveProjects(updated); toast.success('Proyek Dihapus');
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    const updated = [...achievements, { ...newAch, id: Date.now() }];
    setAchievements(updated); saveAchievements(updated);
    setNewAch({ title: '', year: '', desc: '' }); toast.success('Prestasi Ditambahkan!');
  };
  const handleDeleteAchievement = (id) => {
    const updated = achievements.filter(a => a.id !== id);
    setAchievements(updated); saveAchievements(updated); toast.success('Prestasi Dihapus');
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    const updated = [...gallery, { ...newPhoto, id: Date.now() }];
    setGallery(updated); saveGallery(updated);
    setNewPhoto({ url: '', caption: '' }); toast.success('Foto Ditambahkan!');
  };
  const handleDeletePhoto = (id) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated); saveGallery(updated); toast.success('Foto Dihapus');
  };

  const InputStyle = "w-full bg-black/50 border border-gray-700 p-2.5 rounded text-sm focus:border-primary-green focus:outline-none";

  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-dark text-primary-green font-mono">Memeriksa Sesi Google...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-dark">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-8 rounded-2xl w-full max-w-md relative text-center">
          <Link to="/" className="absolute -top-12 left-0 text-text-muted hover:text-primary-green flex items-center gap-2 transition">
            <ArrowLeft size={16} /> Kembali ke Portofolio
          </Link>
          <div className="mb-8">
            <Lock size={40} className="mx-auto text-primary-green mb-4" />
            <h2 className="text-2xl font-bold">Admin Terkunci</h2>
            <p className="text-sm text-text-muted mt-2">Gunakan akun Google Anda untuk mengakses dashboard pengelola portofolio.</p>
          </div>
          
          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white text-black font-bold py-3 px-4 rounded transition flex items-center justify-center gap-3 hover:bg-gray-200"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark p-6 sm:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-primary-green/20">
          <div>
            <h1 className="text-3xl font-bold text-primary-green">Admin Dashboard</h1>
            <p className="text-xs text-text-muted mt-1">Kelola seluruh konten website Anda secara real-time</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="px-4 py-2 glass-panel rounded hover:bg-white/5 transition text-sm">Lihat Website</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-900/40 text-red-400 hover:text-white rounded transition text-sm"><LogOut size={16}/> Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* KOLOM KIRI */}
          <div className="space-y-10">
            {/* 1. PROFIL SECTION */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-green"><User size={20}/> Edit Profil & Sosmed</h2>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <input type="text" placeholder="Nama Lengkap" value={profile.name || ''} onChange={e => setProfileState({...profile, name: e.target.value})} className={InputStyle}/>
                <input type="text" placeholder="Jabatan / Role" value={profile.role || ''} onChange={e => setProfileState({...profile, role: e.target.value})} className={InputStyle}/>
                <textarea rows="3" placeholder="Bio Singkat" value={profile.bio || ''} onChange={e => setProfileState({...profile, bio: e.target.value})} className={InputStyle}></textarea>
                <input type="text" placeholder="URL Foto Profil" value={profile.avatar || ''} onChange={e => setProfileState({...profile, avatar: e.target.value})} className={InputStyle}/>
                <input type="email" placeholder="Email" value={profile.email || ''} onChange={e => setProfileState({...profile, email: e.target.value})} className={InputStyle}/>
                <input type="text" placeholder="Link LinkedIn" value={profile.linkedin || ''} onChange={e => setProfileState({...profile, linkedin: e.target.value})} className={InputStyle}/>
                <input type="text" placeholder="Link Instagram" value={profile.instagram || ''} onChange={e => setProfileState({...profile, instagram: e.target.value})} className={InputStyle}/>
                <input type="text" placeholder="Link GitHub" value={profile.github || ''} onChange={e => setProfileState({...profile, github: e.target.value})} className={InputStyle}/>
                <button type="submit" className="w-full bg-primary-green text-bg-dark font-bold py-2.5 rounded transition flex justify-center gap-2 mt-4 hover:bg-emerald-400"><Save size={18}/> Simpan Profil</button>
              </form>
            </div>

            {/* 3. PRESTASI SECTION */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-green"><Trophy size={20}/> Kelola Prestasi</h2>
              <form onSubmit={handleAddAchievement} className="flex gap-2 mb-6">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input required type="text" placeholder="Tahun (cth: 2026)" value={newAch.year} onChange={e=>setNewAch({...newAch, year: e.target.value})} className={`w-1/3 ${InputStyle}`}/>
                    <input required type="text" placeholder="Judul Prestasi" value={newAch.title} onChange={e=>setNewAch({...newAch, title: e.target.value})} className={`w-2/3 ${InputStyle}`}/>
                  </div>
                  <input required type="text" placeholder="Deskripsi Singkat" value={newAch.desc} onChange={e=>setNewAch({...newAch, desc: e.target.value})} className={InputStyle}/>
                </div>
                <button type="submit" className="bg-primary-green text-bg-dark p-3 rounded hover:bg-emerald-400 h-fit mt-auto"><Plus size={24}/></button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-primary-green">{ach.year} - <span className="text-white">{ach.title}</span></p>
                      <p className="text-xs text-text-muted line-clamp-1">{ach.desc}</p>
                    </div>
                    <button onClick={()=>handleDeleteAchievement(ach.id)} className="text-red-500 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-10">
            {/* 2. PROYEK SECTION */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-green"><Briefcase size={20}/> Kelola Proyek</h2>
              <form onSubmit={handleAddProject} className="space-y-2 mb-6">
                <input required type="text" placeholder="Judul Proyek" value={newProject.title} onChange={e=>setNewProject({...newProject, title: e.target.value})} className={InputStyle}/>
                <div className="flex gap-2">
                  <input required type="text" placeholder="Kategori" value={newProject.category} onChange={e=>setNewProject({...newProject, category: e.target.value})} className={`w-1/2 ${InputStyle}`}/>
                  <input required type="text" placeholder="Tech Stack" value={newProject.tech} onChange={e=>setNewProject({...newProject, tech: e.target.value})} className={`w-1/2 ${InputStyle}`}/>
                </div>
                <input required type="text" placeholder="URL Gambar" value={newProject.image} onChange={e=>setNewProject({...newProject, image: e.target.value})} className={InputStyle}/>
                <textarea required placeholder="Deskripsi Proyek" rows="2" value={newProject.desc} onChange={e=>setNewProject({...newProject, desc: e.target.value})} className={InputStyle}></textarea>
                <button type="submit" className="w-full bg-primary-green text-bg-dark font-bold py-2 rounded hover:bg-emerald-400">Tambah Proyek</button>
              </form>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {projects.map(proj => (
                  <div key={proj.id} className="bg-black/40 p-3 rounded border border-gray-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={proj.image} alt="" className="w-10 h-10 object-cover rounded" />
                      <div><p className="font-bold text-sm">{proj.title}</p><p className="text-xs text-text-muted">{proj.category}</p></div>
                    </div>
                    <button onClick={()=>handleDeleteProject(proj.id)} className="text-red-500 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. GALERI SECTION */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-green"><ImageIcon size={20}/> Kelola Galeri Dokumentasi</h2>
              <form onSubmit={handleAddPhoto} className="flex gap-2 mb-6">
                <div className="flex-1 space-y-2">
                  <input required type="text" placeholder="URL Foto Galeri" value={newPhoto.url} onChange={e=>setNewPhoto({...newPhoto, url: e.target.value})} className={InputStyle}/>
                  <input required type="text" placeholder="Caption / Keterangan Foto" value={newPhoto.caption} onChange={e=>setNewPhoto({...newPhoto, caption: e.target.value})} className={InputStyle}/>
                </div>
                <button type="submit" className="bg-primary-green text-bg-dark p-3 rounded hover:bg-emerald-400 h-fit mt-auto"><Plus size={24}/></button>
              </form>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                {gallery.map(photo => (
                  <div key={photo.id} className="relative group rounded overflow-hidden">
                    <img src={photo.url} alt="Galeri" className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button onClick={()=>handleDeletePhoto(photo.id)} className="bg-red-600 p-2 rounded-full text-white"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}