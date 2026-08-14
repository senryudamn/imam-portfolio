import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, Upload, User, Briefcase, Award, Image as ImageIcon, Save, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  // State untuk mengatur apakah user sudah login atau belum
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Simulasi proses Login dengan Google
  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulasi loading 1.5 detik seolah-olah sedang verifikasi akun Google
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoggingIn(false);
      toast.success('Berhasil login dengan Google!');
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.success('Berhasil logout.');
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Data berhasil disimpan! (Simulasi)');
  };

  // --- TAMPILAN JIKA BELUM LOGIN (HALAMAN LOGIN GOOGLE) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e293b]/80 backdrop-blur-md p-10 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md text-center"
        >
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            {/* Logo Google SVG */}
            <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 z"/>
                <path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 z"/>
                <path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 z"/>
                <path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,41.939 C -8.804,39.869 -11.514,38.739 -14.754,38.739 C -19.444,38.739 -23.494,41.439 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 z"/>
              </g>
            </svg>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-wide">Admin Access</h1>
          <p className="text-slate-400 mb-8 text-sm">Masuk untuk memperbarui konten portofolio Anda.</p>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold tracking-wide py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <span className="animate-pulse">Verifikasi Akun...</span>
            ) : (
              <>Lanjutkan dengan Google</>
            )}
          </button>
        </motion.div>
        
        <Link to="/" className="mt-8 flex items-center gap-2 text-slate-400 hover:text-[#10b981] transition-colors font-medium">
          <ArrowLeft size={16} /> Kembali ke Portofolio
        </Link>
      </div>
    );
  }

  // --- TAMPILAN JIKA SUDAH LOGIN (DASHBOARD ADMIN) ---
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
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Edit Profil Utama</h2>
                <button onClick={handleSave} className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-colors">
                  <Save size={18} /> Simpan Perubahan
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                {/* Upload Foto */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Foto Profil (ID Card)</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-40 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                      <ImageIcon className="text-slate-400" size={32} />
                    </div>
                    <div>
                      <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <Upload size={16} /> Pilih Foto Baru
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                      <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG. Max size: 2MB.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input type="text" defaultValue="Imam Akbari Majid" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Peran / Profesi</label>
                    <input type="text" defaultValue="S-1 Pendidikan Teknik Mekatronika" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Biodata Singkat</label>
                  <textarea rows="4" defaultValue="Mahasiswa di Universitas Negeri Yogyakarta. Terobsesi dengan otomasi, merakit sistem IoT..." className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" defaultValue="akbariimam8@gmail.com" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Link LinkedIn</label>
                    <input type="text" placeholder="https://linkedin.com/in/..." className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Link GitHub</label>
                    <input type="text" defaultValue="https://github.com/senryudamn" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PROJECTS (MOCKUP) */}
          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Manajemen Projects</h2>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Plus size={18} /> Tambah Project
                </button>
              </div>

              {/* Contoh Form Project */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-6 items-start relative overflow-hidden">
                <div className="w-40 h-28 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Upload className="text-white" size={24}/>
                  </div>
                  <img src="/api/placeholder/400/300" alt="placeholder" className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 space-y-3">
                  <input type="text" defaultValue="Smart Heliotropism System" className="w-full font-bold text-lg border-b border-slate-200 pb-1 focus:outline-none focus:border-[#10b981]" />
                  <textarea rows="2" className="w-full text-sm text-slate-600 border border-slate-200 rounded p-2 focus:outline-none focus:border-[#10b981]">Prototipe bunga matahari mekanis berbasis IoT...</textarea>
                  <input type="text" defaultValue="IoT, Arduino, ESP32" className="w-full text-xs font-mono text-[#10b981] border border-slate-200 rounded p-2 focus:outline-none focus:border-[#10b981]" />
                </div>
                <button className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={20}/></button>
              </div>
              <div className="text-center text-slate-500 text-sm mt-10">*(Ini adalah tampilan preview CMS)*</div>
            </motion.div>
          )}

          {/* TAB LAINNYA */}
          {(activeTab === 'achievements' || activeTab === 'gallery') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <Briefcase size={40} className="text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Panel {activeTab === 'achievements' ? 'Prestasi' : 'Galeri'}</h2>
              <p className="text-slate-500 max-w-sm">Siap untuk disambungkan dengan database sungguhan agar Anda dapat mengunggah dan mengelola data di sini.</p>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}