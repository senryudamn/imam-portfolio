import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, Upload, User, Briefcase, Award, Image as ImageIcon, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import Firebase (Menyesuaikan dengan struktur file Anda di src/firebase.js)
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // State Data
  const [profile, setProfile] = useState({ name: '', role: '', bio: '', email: '', linkedin: '', github: '', avatar: '' });
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cek Status Login & Ambil Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch Profile
      const profileSnap = await getDoc(doc(db, "portfolio", "profile"));
      if (profileSnap.exists()) setProfile(profileSnap.data());

      // Fetch Projects
      const projectSnap = await getDocs(collection(db, "projects"));
      setProjects(projectSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Achievements
      const achSnap = await getDocs(collection(db, "achievements"));
      setAchievements(achSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Gallery
      const galSnap = await getDocs(collection(db, "gallery"));
      setGallery(galSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Gagal menarik data dari database.");
      console.error(error);
    }
  };

  // --- AUTENTIKASI ---
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Login berhasil!");
    } catch (error) {
      toast.error("Gagal login dengan Google.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Berhasil logout.");
  };

  // --- FUNGSI CLOUDINARY UPLOAD ---
  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsUploading(false);
      return data.secure_url;
    } catch (error) {
      setIsUploading(false);
      toast.error("Gagal mengunggah gambar.");
      return null;
    }
  };

  // --- HANDLER PROFIL ---
  const handleSaveProfile = async () => {
    try {
      await setDoc(doc(db, "portfolio", "profile"), profile);
      toast.success("Profil berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan profil.");
    }
  };

  const handleProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading("Mengunggah foto...", { id: 'upload' });
    const url = await uploadToCloudinary(file);
    if (url) {
      setProfile({ ...profile, avatar: url });
      toast.success("Foto berhasil diunggah!", { id: 'upload' });
    }
  };

  // --- HANDLER PROJECTS ---
  const handleAddProject = () => {
    setProjects([{ isNew: true, tempId: Date.now(), title: '', desc: '', tech: '', category: 'Web Dev', image: '' }, ...projects]);
  };

  const handleSaveProject = async (proj) => {
    try {
      if (proj.isNew) {
        const { isNew, tempId, ...dataToSave } = proj;
        const docRef = await addDoc(collection(db, "projects"), dataToSave);
        setProjects(projects.map(p => p.tempId === proj.tempId ? { ...dataToSave, id: docRef.id } : p));
        toast.success("Project baru ditambahkan!");
      } else {
        const { id, ...dataToUpdate } = proj;
        await updateDoc(doc(db, "projects", id), dataToUpdate);
        toast.success("Project diperbarui!");
      }
    } catch (error) {
      toast.error("Gagal menyimpan project.");
    }
  };

  const handleDeleteProject = async (id, tempId) => {
    if (tempId) {
      setProjects(projects.filter(p => p.tempId !== tempId));
      return;
    }
    if (window.confirm("Yakin ingin menghapus project ini?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(p => p.id !== id));
        toast.success("Project dihapus.");
      } catch (error) {
        toast.error("Gagal menghapus project.");
      }
    }
  };

  const handleProjectImage = async (e, projId, tempId) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading("Mengunggah gambar...", { id: 'proj-img' });
    const url = await uploadToCloudinary(file);
    if (url) {
      setProjects(projects.map(p => (p.id === projId || p.tempId === tempId) ? { ...p, image: url } : p));
      toast.success("Gambar terunggah!", { id: 'proj-img' });
    }
  };

  // --- HANDLER ACHIEVEMENTS ---
  const handleAddAchievement = () => {
    setAchievements([{ isNew: true, tempId: Date.now(), year: '', title: '', desc: '' }, ...achievements]);
  };

  const handleSaveAchievement = async (ach) => {
    try {
      if (ach.isNew) {
        const { isNew, tempId, ...dataToSave } = ach;
        const docRef = await addDoc(collection(db, "achievements"), dataToSave);
        setAchievements(achievements.map(a => a.tempId === ach.tempId ? { ...dataToSave, id: docRef.id } : a));
        toast.success("Prestasi ditambahkan!");
      } else {
        const { id, ...dataToUpdate } = ach;
        await updateDoc(doc(db, "achievements", id), dataToUpdate);
        toast.success("Prestasi diperbarui!");
      }
    } catch (error) {
      toast.error("Gagal menyimpan prestasi.");
    }
  };

  const handleDeleteAchievement = async (id, tempId) => {
    if (tempId) {
      setAchievements(achievements.filter(a => a.tempId !== tempId));
      return;
    }
    if (window.confirm("Hapus prestasi ini?")) {
      await deleteDoc(doc(db, "achievements", id));
      setAchievements(achievements.filter(a => a.id !== id));
      toast.success("Prestasi dihapus.");
    }
  };

  // --- HANDLER GALLERY ---
  const handleAddGallery = () => {
    setGallery([{ isNew: true, tempId: Date.now(), url: '', caption: '' }, ...gallery]);
  };

  const handleSaveGallery = async (gal) => {
    try {
      if (gal.isNew) {
        const { isNew, tempId, ...dataToSave } = gal;
        const docRef = await addDoc(collection(db, "gallery"), dataToSave);
        setGallery(gallery.map(g => g.tempId === gal.tempId ? { ...dataToSave, id: docRef.id } : g));
        toast.success("Foto galeri ditambahkan!");
      } else {
        const { id, ...dataToUpdate } = gal;
        await updateDoc(doc(db, "gallery", id), dataToUpdate);
        toast.success("Galeri diperbarui!");
      }
    } catch (error) {
      toast.error("Gagal menyimpan galeri.");
    }
  };

  const handleDeleteGallery = async (id, tempId) => {
    if (tempId) {
      setGallery(gallery.filter(g => g.tempId !== tempId));
      return;
    }
    if (window.confirm("Hapus foto galeri ini?")) {
      await deleteDoc(doc(db, "gallery", id));
      setGallery(gallery.filter(g => g.id !== id));
      toast.success("Foto dihapus.");
    }
  };

  const handleGalleryImage = async (e, galId, tempId) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading("Mengunggah foto...", { id: 'gal-img' });
    const url = await uploadToCloudinary(file);
    if (url) {
      setGallery(gallery.map(g => (g.id === galId || g.tempId === tempId) ? { ...g, url: url } : g));
      toast.success("Foto terunggah!", { id: 'gal-img' });
    }
  };

  // --- TAMPILAN LOADING ---
  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><Loader2 className="animate-spin text-[#10b981]" size={48} /></div>;
  }

  // --- TAMPILAN LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1e293b]/80 backdrop-blur-md p-10 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md text-center">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 z"/><path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 z"/><path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 z"/><path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,41.939 C -8.804,39.869 -11.514,38.739 -14.754,38.739 C -19.444,38.739 -23.494,41.439 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 z"/></g></svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-wide">Admin Access</h1>
          <p className="text-slate-400 mb-8 text-sm">Masuk untuk memperbarui konten portofolio Anda.</p>
          <button onClick={handleLogin} className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold tracking-wide py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg">
            Lanjutkan dengan Google
          </button>
        </motion.div>
        <Link to="/" className="mt-8 flex items-center gap-2 text-slate-400 hover:text-[#10b981] transition-colors font-medium">
          <ArrowLeft size={16} /> Kembali ke Portofolio
        </Link>
      </div>
    );
  }

  // --- TAMPILAN DASHBOARD ADMIN ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0f172a] text-white flex flex-col min-h-[auto] md:min-h-screen shrink-0 relative z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black tracking-wider text-[#10b981]">IMAM.dev <span className="text-white text-sm font-normal">/ Admin</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-visible flex md:flex-col">
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'bg-[#10b981] text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <User size={18} /> Profil Utama
          </button>
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'bg-[#10b981] text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Briefcase size={18} /> Projects
          </button>
          <button onClick={() => setActiveTab('achievements')} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors whitespace-nowrap ${activeTab === 'achievements' ? 'bg-[#10b981] text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Award size={18} /> Prestasi
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors whitespace-nowrap ${activeTab === 'gallery' ? 'bg-[#10b981] text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ImageIcon size={18} /> Galeri Foto
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto">
          
          {/* ================= TAB PROFILE ================= */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Edit Profil Utama</h2>
                <button onClick={handleSaveProfile} className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-colors">
                  <Save size={18} /> Simpan Perubahan
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Foto Profil (ID Card)</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-40 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                      {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-400" size={32} />}
                    </div>
                    <div>
                      <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} 
                        Upload Foto Baru
                        <input type="file" className="hidden" accept="image/*" onChange={handleProfileImage} disabled={isUploading} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-[#10b981] focus:ring-1 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Peran / Profesi</label>
                    <input type="text" value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-[#10b981] focus:ring-1 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Biodata Singkat</label>
                  <textarea rows="4" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-[#10b981] focus:ring-1 outline-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Link LinkedIn</label>
                    <input type="text" value={profile.linkedin} onChange={(e) => setProfile({...profile, linkedin: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Link GitHub</label>
                    <input type="text" value={profile.github} onChange={(e) => setProfile({...profile, github: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#10b981]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB PROJECTS ================= */}
          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Manajemen Projects</h2>
                <button onClick={handleAddProject} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Plus size={18} /> Tambah Project
                </button>
              </div>

              {projects.map((proj) => (
                <div key={proj.id || proj.tempId} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-6 relative">
                  <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 shrink-0 overflow-hidden relative group flex items-center justify-center">
                    {proj.image ? <img src={proj.image} className="w-full h-full object-cover" alt="Project" /> : <ImageIcon className="text-slate-300" />}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                      <Upload size={24}/>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleProjectImage(e, proj.id, proj.tempId)} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <input type="text" placeholder="Judul Project" value={proj.title} onChange={(e) => setProjects(projects.map(p => (p.id === proj.id && p.tempId === proj.tempId) ? { ...p, title: e.target.value } : p))} className="w-full font-bold text-lg border-b border-slate-200 pb-1 focus:border-[#10b981] outline-none" />
                    <input type="text" placeholder="Kategori (Misal: IoT, Web Dev)" value={proj.category} onChange={(e) => setProjects(projects.map(p => (p.id === proj.id && p.tempId === proj.tempId) ? { ...p, category: e.target.value } : p))} className="w-full text-xs font-bold text-slate-500 border-b border-slate-200 pb-1 focus:border-[#10b981] outline-none uppercase tracking-wider" />
                    <textarea rows="2" placeholder="Deskripsi Singkat" value={proj.desc} onChange={(e) => setProjects(projects.map(p => (p.id === proj.id && p.tempId === proj.tempId) ? { ...p, desc: e.target.value } : p))} className="w-full text-sm text-slate-600 border border-slate-200 rounded p-2 focus:border-[#10b981] outline-none"></textarea>
                    <input type="text" placeholder="Teknologi (Misal: React, ESP32, Firebase)" value={proj.tech} onChange={(e) => setProjects(projects.map(p => (p.id === proj.id && p.tempId === proj.tempId) ? { ...p, tech: e.target.value } : p))} className="w-full text-xs font-mono text-[#10b981] border border-slate-200 rounded p-2 focus:border-[#10b981] outline-none" />
                  </div>

                  <div className="flex md:flex-col gap-3 justify-start items-center md:border-l border-slate-100 md:pl-4">
                    <button onClick={() => handleSaveProject(proj)} className="bg-[#10b981] hover:bg-emerald-600 text-white p-2.5 rounded-lg shadow transition-colors"><Save size={18}/></button>
                    <button onClick={() => handleDeleteProject(proj.id, proj.tempId)} className="bg-rose-100 hover:bg-rose-200 text-rose-600 p-2.5 rounded-lg transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ================= TAB PRESTASI ================= */}
          {activeTab === 'achievements' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Manajemen Prestasi</h2>
                <button onClick={handleAddAchievement} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Plus size={18} /> Tambah Prestasi
                </button>
              </div>

              {achievements.map((ach) => (
                <div key={ach.id || ach.tempId} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-4 flex gap-4 items-start">
                  <input type="text" placeholder="Tahun" value={ach.year} onChange={(e) => setAchievements(achievements.map(a => (a.id === ach.id && a.tempId === ach.tempId) ? { ...a, year: e.target.value } : a))} className="w-24 font-mono font-bold text-[#10b981] border border-slate-200 rounded p-2 text-center focus:border-[#10b981] outline-none" />
                  
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Judul Prestasi / Pengalaman" value={ach.title} onChange={(e) => setAchievements(achievements.map(a => (a.id === ach.id && a.tempId === ach.tempId) ? { ...a, title: e.target.value } : a))} className="w-full font-bold text-lg border-b border-slate-200 pb-1 focus:border-[#10b981] outline-none" />
                    <textarea rows="2" placeholder="Deskripsi Singkat" value={ach.desc} onChange={(e) => setAchievements(achievements.map(a => (a.id === ach.id && a.tempId === ach.tempId) ? { ...a, desc: e.target.value } : a))} className="w-full text-sm text-slate-600 border border-slate-200 rounded p-2 focus:border-[#10b981] outline-none"></textarea>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleSaveAchievement(ach)} className="bg-[#10b981] hover:bg-emerald-600 text-white p-2 rounded-lg shadow transition-colors"><Save size={16}/></button>
                    <button onClick={() => handleDeleteAchievement(ach.id, ach.tempId)} className="bg-rose-100 hover:bg-rose-200 text-rose-600 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ================= TAB GALLERY ================= */}
          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Galeri Foto</h2>
                <button onClick={handleAddGallery} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Plus size={18} /> Tambah Foto
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gallery.map((gal) => (
                  <div key={gal.id || gal.tempId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col relative">
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden relative group flex items-center justify-center mb-4">
                      {gal.url ? <img src={gal.url} className="w-full h-full object-cover" alt="Galeri" /> : <ImageIcon className="text-slate-300" />}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                        <Upload size={24}/>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGalleryImage(e, gal.id, gal.tempId)} />
                      </label>
                    </div>
                    
                    <input type="text" placeholder="Caption Foto" value={gal.caption} onChange={(e) => setGallery(gallery.map(g => (g.id === gal.id && g.tempId === gal.tempId) ? { ...g, caption: e.target.value } : g))} className="w-full text-sm font-medium border-b border-slate-200 pb-2 mb-4 focus:border-[#10b981] outline-none" />
                    
                    <div className="flex justify-end gap-2 mt-auto">
                      <button onClick={() => handleDeleteGallery(gal.id, gal.tempId)} className="bg-rose-100 hover:bg-rose-200 text-rose-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm"><Trash2 size={14}/> Hapus</button>
                      <button onClick={() => handleSaveGallery(gal)} className="bg-[#10b981] hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg shadow transition-colors flex items-center gap-1 text-sm font-bold"><Save size={14}/> Simpan</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}