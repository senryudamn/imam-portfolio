import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md text-center">
        
        <div className="bg-[#10b981] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#10b981]/20">
          <Lock size={32} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2 tracking-wide">Admin Login</h1>
        <p className="text-slate-400 mb-8 text-sm">Enter your credentials to access dashboard</p>

        <form className="space-y-5 text-left" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5 pl-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#10b981] transition-colors" 
              placeholder="Enter username" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5 pl-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#10b981] transition-colors" 
              placeholder="Enter password" 
            />
          </div>
          <button className="w-full bg-[#10b981] hover:bg-emerald-500 text-white font-black tracking-wide py-4 rounded-xl transition-all mt-4 shadow-lg shadow-[#10b981]/20">
            Login
          </button>
        </form>

      </div>
      
      <Link to="/" className="mt-8 flex items-center gap-2 text-slate-400 hover:text-[#10b981] transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Portfolio
      </Link>
    </div>
  );
}