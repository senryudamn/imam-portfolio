import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProfile, saveProfile, getProjects, saveProjects, getAchievements, saveAchievements, getGallery, saveGallery } from '../data';
import { Trash2, Plus, LogOut, ArrowLeft, Lock, User, Briefcase, Trophy, Image as ImageIcon, Save, UploadCloud, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const ADMIN_EMAIL = "akbariimam8@gmail.com";

  // States Data
  const [profile, setProfileState] = useState({});
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', desc: '', category: '', tech: '', image: '' });
  const [achievements, setAchievements] = useState([]);
  const [newAch, setNewAch] = useState({ title: '', year: '', desc: '' });
  const [gallery, setGallery] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '' });

  // Upload States (Untuk animasi loading saat upload foto)
  const [isUploading, setIsUploading] = useState({ profile: false, project: false, gallery: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setIsAuthenticated(true);
          loadAllData();
        } else {
          signOut(auth);
          toast.error("Akses Ditolak: Email tidak dikenali.");
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
        toast.success(`Selamat datang, Admin!`);
      } else {
        await signOut(auth);
        toast.error("Akses Ditolak.");
      }
    } catch (error) {
      toast.error("Gagal login dengan Google.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Berhasil Logout');
  };

  // --- FUNGSI UPLOAD CLOUDINARY ---
  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      toast.error("Konfigurasi Cloudinary belum diatur di .env");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      toast.error("Gagal mengunggah gambar!");
      return null;
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    const imageUrl = await uploadImageToCloudinary(file);
    
    if (imageUrl) {
      if (type === 'profile') setProfileState({ ...profile, avatar: imageUrl });
      if (type === 'project') setNewProject({ ...newProject, image: imageUrl });
      if (type === 'gallery') setNewPhoto({ ...newPhoto, url: imageUrl });
      toast.success("Gambar berhasil diunggah!");
    }
    setIsUploading(prev => ({ ...prev, [type]: false }));
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

  if (loadingAuth) return <div className="min-h-screen flex items-center justify-center bg-bg-dark text-primary-green font-mono">Memeriksa Sesi...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-dark">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-8 rounded-2xl w-full max-w-md relative text-center">
          <Link to="/" className="absolute -top-12 left-0 text-text-muted hover:text-primary-green flex items-center gap-2 transition"><ArrowLeft size={16} /> Kembali</Link>
          <div className="mb-8"><Lock size={40} className="mx-auto text-primary-green mb-4" /><h2 className="text-2xl font-bold">Admin Terkunci</h2></div>
          <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-bold py-3 px-4 rounded transition flex items-center justify-center gap-3 hover:bg-gray-200">
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
          <div><h1 className="text-3xl font-bold text-primary-green">Admin Dashboard</h1></div>
          <div className="flex gap-4">
            <Link to="/" className="px-4 py-2 glass-panel rounded hover:bg-white/5 transition text-sm">Lihat Website</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-900/40 text-red-400 hover:text-white rounded transition text-sm"><LogOut size={16}/> Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* KOLOM KIRI */}
          <div className="space-y-10">
            {/* 1. PROFIL */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-green"><User size={20}/> Edit Profil & Sosmed</h2>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <input type="text" placeholder="Nama Lengkap" value={profile.name || ''} onChange={e => setProfileState({...profile, name: e.target.value})} className={InputStyle}/>
                <textarea rows="3" placeholder="Bio Singkat" value={profile.bio || ''} onChange={e => setProfileState({...profile, bio: e.target.value})} className={InputStyle}></textarea>
                
                {/* Upload Foto Profil */}
                <div className="flex gap-2">
                  <input type="text" placeholder="URL Foto Profil" value={profile.avatar || ''} onChange={e => setProfileState({...profile, avatar: e.target.value})} className={InputStyle}/>
                  <label className="bg-primary-green/20 hover:bg-primary-green/40 text-primary-green border border-primary-green/50 p-2.5 rounded cursor-pointer flex items-center justify-center min-w-[48px]">
                    {isUploading.profile ? <Loader2 size={18} className="animate-spin"/> : <UploadCloud size={18}/>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'profile')} disabled={isUploading.profile}/>
                  </label>
                </div>
                
                <input type="text" placeholder="Link LinkedIn" value={profile.linkedin || ''} onChange={e => setProfileState({...profile, linkedin: e.target.value})} className={InputStyle}/>
                <button type="submit" className="w-full bg-primary-green text-bg-dark font-bold py-2.5 rounded transition flex justify-center gap-2 mt-4 hover:bg-emerald-400"><Save size={18}/> Simpan Profil</button>
              </form>
            </div>

            {/* 2. PRESTASI */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-green"><Trophy size={20}/> Kelola Prestasi</h2>
              <form onSubmit={handleAddAchievement} className="flex gap-2 mb-6">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input required type="text" placeholder="Tahun" value={newAch.year} onChange={e=>setNewAch({...newAch, year: e.target.value})} className={`w-1/3 ${InputStyle}`}/>
                    <input required type="text" placeholder="Judul Prestasi" value={newAch.title} onChange={e=>setNewAch({...newAch, title: e.target.value})} className={`w-2/3 ${InputStyle}`}/>
                  </div>
                  <input required type="text" placeholder="Deskripsi Singkat" value={newAch.desc} onChange={e=>setNewAch({...newAch, desc: e.target.value})} className={InputStyle}/>
                </div>
                <button type="submit" className="bg-primary-green text-bg-dark p-3 rounded hover:bg-emerald-400 h-fit mt-auto"><Plus size={24}/></button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between gap-3">
                    <div><p className="font-bold text-sm text-primary-green">{ach.year} - <span className="text-white">{ach.title}</span></p></div>
                    <button onClick={()=>handleDeleteAchievement(ach.id)} className="text-red-500 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-10">
            {/* 3. PROYEK */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-green"><Briefcase size={20}/> Kelola Proyek</h2>
              <form onSubmit={handleAddProject} className="space-y-2 mb-6">
                <input required type="text" placeholder="Judul Proyek" value={newProject.title} onChange={e=>setNewProject({...newProject, title: e.target.value})} className={InputStyle}/>
                <div className="flex gap-2">
                  <input required type="text" placeholder="Kategori" value={newProject.category} onChange={e=>setNewProject({...newProject, category: e.target.value})} className={`w-1/2 ${InputStyle}`}/>
                  <input required type="text" placeholder="Tech Stack" value={newProject.tech} onChange={e=>setNewProject({...newProject, tech: e.target.value})} className={`w-1/2 ${InputStyle}`}/>
                </div>
                
                {/* Upload Gambar Proyek */}
                <div className="flex gap-2">
                  <input required type="text" placeholder="URL Gambar" value={newProject.image} onChange={e=>setNewProject({...newProject, image: e.target.value})} className={InputStyle}/>
                  <label className="bg-primary-green/20 hover:bg-primary-green/40 text-primary-green border border-primary-green/50 p-2.5 rounded cursor-pointer flex items-center justify-center min-w-[48px]">
                    {isUploading.project ? <Loader2 size={18} className="animate-spin"/> : <UploadCloud size={18}/>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'project')} disabled={isUploading.project}/>
                  </label>
                </div>
                
                <textarea required placeholder="Deskripsi" rows="2" value={newProject.desc} onChange={e=>setNewProject({...newProject, desc: e.target.value})} className={InputStyle}></textarea>
                <button type="submit" className="w-full bg-primary-green text-bg-dark font-bold py-2 rounded hover:bg-emerald-400">Tambah Proyek</button>
              </form>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {projects.map(proj => (
                  <div key={proj.id} className="bg-black/40 p-3 rounded border flex items-center justify-between gap-4">
                    <p className="font-bold text-sm">{proj.title}</p>
                    <button onClick={()=>handleDeleteProject(proj.id)} className="text-red-500 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. GALERI */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-green"><ImageIcon size={20}/> Kelola Galeri</h2>
              <form onSubmit={handleAddPhoto} className="flex gap-2 mb-6">
                <div className="flex-1 space-y-2">
                  {/* Upload Foto Galeri */}
                  <div className="flex gap-2">
                    <input required type="text" placeholder="URL Foto" value={newPhoto.url} onChange={e=>setNewPhoto({...newPhoto, url: e.target.value})} className={InputStyle}/>
                    <label className="bg-primary-green/20 hover:bg-primary-green/40 text-primary-green border border-primary-green/50 p-2.5 rounded cursor-pointer flex items-center justify-center min-w-[48px]">
                      {isUploading.gallery ? <Loader2 size={18} className="animate-spin"/> : <UploadCloud size={18}/>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'gallery')} disabled={isUploading.gallery}/>
                    </label>
                  </div>
                  <input required type="text" placeholder="Caption" value={newPhoto.caption} onChange={e=>setNewPhoto({...newPhoto, caption: e.target.value})} className={InputStyle}/>
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