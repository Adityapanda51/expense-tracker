import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-20 border-t border-slate-800/50 bg-slate-900 dark:bg-slate-950 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div 
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white">
                ExpenseTracker
              </h1>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              Empowering you to take control of your financial future with smart tracking, 
              real-time analytics, and a seamless modern experience.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <button 
                  key={social}
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  title={social}
                >
                  <span className="text-xs font-black">{social[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/expenses')} className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Transactions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/analytics')} className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Support</h4>
            <ul className="space-y-4">
              <li>
                <button className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-black text-slate-500">
            © {new Date().getFullYear()} ExpenseTracker Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
