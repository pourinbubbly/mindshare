
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Trophy, Twitter, ArrowRight, X, Hash, AtSign, ShieldCheck, Cpu } from 'lucide-react';
import { REGIONS } from '../constants';
import { RegionConfig, LanguageCode } from '../types';

interface Props {
  onStart: () => void;
  language: LanguageCode;
  t: (key: string) => string;
}

// Custom Logo Component to ensure visibility without external dependencies
const NexusLogo = () => (
  <svg 
    viewBox="0 0 200 200" 
    className="w-32 h-32 md:w-40 md:h-40 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Base Container */}
    <rect x="10" y="10" width="180" height="180" rx="36" fill="url(#logoGradient)" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.5" />
    
    {/* Inner Design */}
    <g filter="url(#glow)">
       {/* Central Diamond/Chip */}
       <path d="M100 50 L150 100 L100 150 L50 100 Z" fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinejoin="round" />
       
       {/* Core */}
       <circle cx="100" cy="100" r="12" fill="#ffffff" />
       
       {/* Circuit Lines */}
       <path d="M100 50 V 30" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
       <path d="M100 150 V 170" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
       <path d="M50 100 H 30" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
       <path d="M150 100 H 170" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
       
       {/* Accents */}
       <circle cx="100" cy="30" r="4" fill="#60a5fa" />
       <circle cx="100" cy="170" r="4" fill="#60a5fa" />
       <circle cx="30" cy="100" r="4" fill="#60a5fa" />
       <circle cx="170" cy="100" r="4" fill="#60a5fa" />
    </g>
  </svg>
);

export const LandingPage: React.FC<Props> = ({ onStart, t }) => {
  const [showBriefing, setShowBriefing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative z-10">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto text-center w-full"
      >
        {/* Hero Section */}
        <motion.div variants={item} className="mb-16 relative">
          {/* Decorative Lines */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -z-10 transform -translate-y-1/2" />
          
          <div className="flex justify-center mb-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative z-10"
              >
                  <NexusLogo />
              </motion.div>
          </div>

          <h1 className="text-6xl md:text-9xl font-black font-display uppercase tracking-tighter text-white mb-2 relative z-10 leading-[0.9]">
            Mindshare
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700 text-glow-blue" style={{ WebkitTextStroke: '1px rgba(59,130,246,0.3)' }}>
              NEXUS
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light tracking-wide mt-6 border-l-2 border-blue-500/50 pl-6 text-left md:text-center md:border-none md:pl-0">
            {t('hero_subtitle')}
          </p>
        </motion.div>

        {/* Summary Cards - HUD Style */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-left max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="group relative bg-[#0f172a]/60 backdrop-blur-md p-1 clip-path-chamfer transition-all duration-300 hover:bg-[#0f172a]/80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="h-full p-8 border border-white/5 bg-gradient-to-b from-transparent to-black/40 flex flex-col">
                    <div className="w-14 h-14 bg-blue-900/30 border border-blue-500/30 rounded-sm flex items-center justify-center mb-6 group-hover:border-blue-400 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                        <Globe2 className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white mb-3 uppercase tracking-wide group-hover:text-blue-200 transition-colors">
                        {t('step1_title')}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {t('step1_desc')}
                    </p>
                </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-[#0f172a]/60 backdrop-blur-md p-1 clip-path-chamfer transition-all duration-300 hover:bg-[#0f172a]/80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="h-full p-8 border border-white/5 bg-gradient-to-b from-transparent to-black/40 flex flex-col">
                    <div className="w-14 h-14 bg-purple-900/30 border border-purple-500/30 rounded-sm flex items-center justify-center mb-6 group-hover:border-purple-400 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <Twitter className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white mb-3 uppercase tracking-wide group-hover:text-purple-200 transition-colors">
                        {t('step2_title')}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {t('step2_desc')}
                        <span className="block mt-2 font-bold text-white bg-purple-500/10 py-1 px-2 rounded inline-block border border-purple-500/20">1 Impression = 1 Point</span>
                    </p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-[#0f172a]/60 backdrop-blur-md p-1 clip-path-chamfer transition-all duration-300 hover:bg-[#0f172a]/80 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="h-full p-8 border border-white/5 bg-gradient-to-b from-transparent to-black/40 flex flex-col">
                    <div className="w-14 h-14 bg-yellow-900/30 border border-yellow-500/30 rounded-sm flex items-center justify-center mb-6 group-hover:border-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                        <Trophy className="w-7 h-7 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white mb-3 uppercase tracking-wide group-hover:text-yellow-200 transition-colors">
                        {t('step3_title')}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {t('step3_desc')}
                    </p>
                </div>
            </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
                onClick={onStart}
                className="group relative w-64 h-16 bg-blue-600 hover:bg-blue-500 transition-all duration-300 overflow-hidden clip-path-chamfer"
            >
                <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
                    <span className="font-display font-black tracking-widest uppercase text-lg">{t('enter_nexus')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
                {/* Button Glitch/Scan Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-shimmer" />
            </button>

            <button 
                onClick={() => setShowBriefing(true)}
                className="group relative w-64 h-16 bg-transparent border border-white/20 hover:border-white/50 transition-all duration-300 clip-path-chamfer hover:bg-white/5"
            >
                <div className="absolute inset-0 flex items-center justify-center gap-3 text-slate-300 group-hover:text-white transition-colors">
                    <Cpu className="w-5 h-5" />
                    <span className="font-display font-bold tracking-widest uppercase text-sm">{t('mission_data')}</span>
                </div>
            </button>
        </motion.div>

      </motion.div>

      {/* Mission Briefing Modal - PlayStation Style Overlay */}
      <AnimatePresence>
        {showBriefing && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl"
                onClick={(e) => { if(e.target === e.currentTarget) setShowBriefing(false); }}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-6xl bg-[#020617] border border-white/10 rounded-sm shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[750px] overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decor Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500 z-20" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500 z-20" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 z-20" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500 z-20" />

                    {/* Sidebar */}
                    <div className="w-full md:w-[320px] border-r border-white/10 bg-[#050a18] flex flex-col shrink-0">
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent">
                            <h3 className="font-display font-bold text-lg text-white flex items-center gap-3 uppercase tracking-wider">
                                <Globe2 className="w-5 h-5 text-blue-400" />
                                Territories
                            </h3>
                        </div>
                        <div className="overflow-y-auto p-2 space-y-1 flex-grow custom-scrollbar">
                             {REGIONS.map(r => (
                                 <button
                                    key={r.id}
                                    onClick={() => setSelectedRegion(r)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-sm border-l-2 transition-all group relative overflow-hidden ${selectedRegion?.id === r.id ? 'bg-blue-900/20 border-blue-500 text-white' : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'}`}
                                 >
                                    <div className="relative w-10 h-7 shadow-sm shrink-0">
                                        <img src={r.image} className="w-full h-full object-cover rounded-sm opacity-80 group-hover:opacity-100" alt={r.name} />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-widest font-display truncate">{r.name}</span>
                                    
                                    {/* Hover Effect Line */}
                                    <div className={`absolute bottom-0 left-0 h-[1px] bg-blue-500 transition-all duration-300 ${selectedRegion?.id === r.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                 </button>
                             ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow flex flex-col relative bg-[#0b1121] bg-opacity-95">
                         {/* Inner Texture */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                        <button 
                            onClick={() => setShowBriefing(false)}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex-grow overflow-y-auto p-8 md:p-12 relative z-10">
                            {selectedRegion ? (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-white/10 pb-8">
                                        <div className="w-32 h-20 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20 relative shrink-0 group">
                                            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
                                            <img src={selectedRegion.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                                                 <span className="text-green-500 font-mono text-xs tracking-widest uppercase">Sector Online</span>
                                            </div>
                                            <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter mb-2">{selectedRegion.name}</h2>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Mandatory Tags */}
                                        <div className="bg-blue-950/40 border border-blue-500/20 p-6 relative overflow-hidden group hover:bg-blue-900/40 transition-colors shadow-lg">
                                            <div className="absolute -right-6 -top-6 text-blue-500/5 group-hover:text-blue-500/10 transition-colors">
                                                <ShieldCheck className="w-32 h-32" />
                                            </div>
                                            
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-widest mb-6 relative z-10">
                                                <AtSign className="w-4 h-4" />
                                                {t('mandatory_targets')}
                                            </h4>
                                            
                                            <div className="flex flex-wrap gap-3 relative z-10">
                                                {selectedRegion.mentions.map(m => (
                                                    <span key={m} className="px-4 py-2 bg-black/60 border border-blue-500/40 text-blue-100 font-mono text-sm shadow-md font-bold">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mt-4 text-xs text-slate-400 font-mono font-medium">
                                                * Systems scan for these specific handles. Missing tags = No points.
                                            </p>
                                        </div>

                                        {/* Hashtags */}
                                        <div className="bg-purple-950/40 border border-purple-500/20 p-6 relative overflow-hidden group hover:bg-purple-900/40 transition-colors shadow-lg">
                                            <div className="absolute -right-6 -top-6 text-purple-500/5 group-hover:text-purple-500/10 transition-colors">
                                                <Hash className="w-32 h-32" />
                                            </div>

                                            <h4 className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest mb-6 relative z-10">
                                                <Hash className="w-4 h-4" />
                                                {t('tracking_signals')}
                                            </h4>
                                            <div className="flex flex-wrap gap-2 relative z-10">
                                                {selectedRegion.hashtags.map(h => (
                                                    <span key={h} className="px-3 py-1 bg-black/60 border border-purple-500/40 text-purple-100 font-mono text-xs">
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rewards */}
                                    <div className="relative p-8 bg-gradient-to-r from-yellow-900/30 to-black/60 border border-yellow-500/30 shadow-lg">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/50 shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                                                <Trophy className="w-8 h-8 text-yellow-400" />
                                            </div>
                                            <div>
                                                <h5 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wide">Mission Bounty</h5>
                                                <p className="text-slate-200 text-base leading-relaxed max-w-2xl font-medium">
                                                    {t('step3_desc')}
                                                    <span className="block mt-2 text-xs text-slate-400 font-mono uppercase">Current Prize Pool Status: ACTIVE</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-60">
                                    <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-[pulse_4s_ease-in-out_infinite]">
                                        <Globe2 className="w-12 h-12 text-slate-500" />
                                    </div>
                                    <div className="max-w-md">
                                        <h3 className="text-3xl font-display font-bold text-white mb-3 uppercase tracking-widest">Awaiting Input</h3>
                                        <p className="text-slate-400 font-mono text-sm">Select a territory from the left panel to decrypt mission protocols.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for custom clip paths */}
      <style>{`
        .clip-path-chamfer {
            clip-path: polygon(
                15px 0, 100% 0, 
                100% calc(100% - 15px), calc(100% - 15px) 100%, 
                0 100%, 0 15px
            );
        }
      `}</style>
    </div>
  );
};
