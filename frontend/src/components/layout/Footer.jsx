import { Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#080c18] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-400">CRY Project Monitoring System</span>
            <span className="text-slate-600">|</span>
            <span>Child Rights and You</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Empowering grassroots child welfare initiatives with real-time ML intelligence</span>
          </div>

          <div className="text-slate-500">
            &copy; {new Date().getFullYear()} CRY India. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};

