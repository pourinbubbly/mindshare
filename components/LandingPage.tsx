
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Trophy, ArrowRight, X, Hash, AtSign, ShieldCheck, Cpu, Triangle, Circle, Square, Zap } from 'lucide-react';
import { REGIONS } from '../constants';
import { RegionConfig, LanguageCode } from '../types';

interface Props {
  onStart: () => void;
  language: LanguageCode;
  t: (key: string) => string;
}

// Custom X Logo Component for Landing Page
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Enhanced Animated Logo - High Fidelity PlayStation Style
const NexusLogo = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
    {/* Ambient Glow */}
    <motion.div
      className="absolute inset-0 bg-blue-600/20 rounded-full blur-[60px]"
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#475569" stopOpacity="0.8"/>
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rotating Outer Ring */}
      <motion.circle
        cx="100" cy="100" r="85"
        fill="none" stroke="#1e40af" strokeWidth="1" strokeOpacity="0.3"
        strokeDasharray="4 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Decorative Arc 1 */}
      <motion.circle
        cx="100" cy="100" r="75"
        fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
        variants={{
           hidden: { pathLength: 0, rotate: -90, opacity: 0 },
           visible: { pathLength: 0.6, rotate: 0, opacity: 1, transition: { duration: 1.5, ease: "circOut" } }
        }}
      />
      
      {/* Decorative Arc 2 (Opposite) */}
      <motion.circle
        cx="100" cy="100" r="75"
        fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
        variants={{
           hidden: { pathLength: 0, rotate: 90, opacity: 0 },
           visible: { pathLength: 0.25, rotate: 180, opacity: 1, transition: { duration: 1.5, ease: "circOut", delay: 0.2 } }
        }}
      />

      {/* Central Geometric Structure - Nexus Core */}
      <motion.path
        d="M100 40 L152 70 L152 130 L100 160 L48 130 L48 70 Z"
        fill="none" stroke="url(#metalGradient)" strokeWidth="1.5"
        variants={{
            hidden: { pathLength: 0, scale: 0.8, opacity: 0 },
            visible: { pathLength: 1, scale: 1, opacity: 1, transition: { duration: 1.2, delay: 0.4 } }
        }}
      />
      
      {/* Inner Diamond */}
      <motion.path
        d="M100 60 L135 100 L100 140 L65 100 Z"
        fill="rgba(30, 58, 138, 0.3)" stroke="#60a5fa" strokeWidth="2"
        variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, delay: 0.8 } }
        }}
      />

      {/* Pulsing Core */}
      <motion.circle
        cx="100" cy="100" r="8"
        fill="#ffffff"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Energy Ripples */}
      <motion.circle
        cx="100" cy="100" r="8"
        fill="none" stroke="#60a5fa" strokeWidth="1"
        animate={{ r: [8, 40], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
    
    {/* Floating PS Shapes Particles */}
    <div className="absolute inset-0 pointer-events-none">
        {[
            { Icon: Triangle, color: "text-green-400", x: 20, y: -40, delay: 0 },
            { Icon: Circle, color: "text-red-400", x: 40, y: 20, delay: 1 },
            { Icon: X, color: "text-blue-400", x: -40, y: 20, delay: 2 },
            { Icon: Square, color: "text-pink-400", x: -20, y: -20, delay: 3 }
        ].map((item, i) => (
            <motion.div
                key={i}
                className={`absolute left-1/2 top-1/2 ${item.color}`}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{ 
                    opacity: [0, 1, 0], 
                    x: item.x, 
                    y: item.y, 
                    scale: [0.5, 1, 0.5],
                    rotate: [0, 90, 180] 
                }}
                transition={{ duration: 4, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
            >
                <item.Icon size={12} strokeWidth={3} />
            </motion.div>
        ))}
    </div>
  </div>
);

// Interactive HUD Card Component
const SummaryCard = ({ icon, title, desc, extra, color, delay = 0 }: { icon: React.ReactNode, title: string, desc: string, extra?: React.ReactNode, color: 'blue' | 'purple' | 'yellow', delay?: number }) => {
    const colorStyles = {
        blue: { border: 'group-hover:border-blue-400', glow: 'from-blue-500/20', iconBg: 'bg-blue-500/10', text: 'group-hover:text-blue-300' },
        purple: { border: 'group-hover:border-purple-400', glow: 'from-purple-500/20', iconBg: 'bg-purple-500/10', text: 'group-hover:text-purple-300' },
        yellow: { border: 'group-hover:border-yellow-400', glow: 'from-yellow-500/20', iconBg: 'bg-yellow-500/10', text: 'group-hover:text-yellow-300' },
    };

    const style = colorStyles[color];

    return (
        <motion.div 
            className="group relative h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, type: "spring" }}
        >
             {/* Main Container */}
            <div className={`relative h-full bg-[#0f172a]/40 backdrop-blur-md border border-white/5 p-1 transition-all duration-300 hover:bg-[#0f172a]/60 hover:-translate-y-1`}>
                
                {/* Animated Corners */}
                <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 transition-all duration-300 ${style.border} group-hover:w-6 group-hover:h-6`} />
                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 transition-all duration-300 ${style.border} group-hover:w-6 group-hover:h-6`} />
                <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 transition-all duration-300 ${style.border} group-hover:w-6 group-hover:h-6`} />
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 transition-all duration-300 ${style.border} group-hover:w-6 group-hover:h-6`} />

                {/* Internal Content */}
                <div className="relative z-10 p-8 flex flex-col h-full overflow-hidden">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Hover Glow Flash */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className={`w-14 h-14 ${style.iconBg} border border-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                        {icon}
                    </div>
                    
                    <h3 className={`text-xl font-bold font-display text-white mb-3 uppercase tracking-wider transition-colors ${style.text}`}>
                        {title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                        {desc}
                    </p>
                    
                    <div className="mt-auto pt-4 relative z-10">
                        {extra}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const LandingPage: React.FC<Props> = ({ onStart, t }) => {
  const [showBriefing, setShowBriefing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig | null>(null);

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative z-10 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"
            animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
         />
         <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"
            animate={{ x: [0, -50, 0], y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
         />
      </div>

      <div className="max-w-7xl mx-auto text-center w-full relative z-10">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-10">
            <NexusLogo />
        </div>

        {/* Title Section */}
        <div className="relative inline-block mb-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-6xl md:text-9xl font-black font-display uppercase tracking-tighter text-white leading-[0.85] relative z-10">
                    Mindshare
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 mt-2 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        NEXUS
                    </span>
                </h1>
                
                {/* Decorative Lines under Title */}
                <div className="flex items-center justify-center gap-4 mt-6 opacity-50">
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-blue-500" />
                    <div className="flex gap-2">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                         <div className="w-1.5 h-1.5 bg-white rounded-full" />
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-blue-500" />
                </div>
            </motion.div>
        </div>
          
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light tracking-wide mb-20 text-center leading-relaxed"
        >
            {t('hero_subtitle')}
        </motion.p>

        {/* HUD Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 text-left max-w-6xl mx-auto px-4">
            <SummaryCard 
                icon={<Globe2 className="w-7 h-7 text-blue-400" />}
                title={t('step1_title')}
                desc={t('step1_desc')}
                color="blue"
                delay={0.6}
            />
            <SummaryCard 
                icon={<XLogo className="w-7 h-7 text-white fill-white" />}
                title={t('step2_title')}
                desc={t('step2_desc')}
                color="purple"
                delay={0.7}
                extra={
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 py-1 px-2 rounded border border-purple-500/20 uppercase tracking-wider animate-pulse">
                            UPLINK ACTIVE
                        </span>
                    </div>
                }
            />
            <SummaryCard 
                icon={<Trophy className="w-7 h-7 text-yellow-400" />}
                title={t('step3_title')}
                desc={t('step3_desc')}
                color="yellow"
                delay={0.8}
            />
        </div>

        {/* Primary CTA Button */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
            <button 
                onClick={onStart}
                className="group relative w-full sm:w-96 h-20 overflow-hidden bg-[#020617] clip-path-chamfer"
            >
                {/* Button Background Layers */}
                <div className="absolute inset-0 bg-blue-900/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Moving Stripes Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#3b82f6_10px,#3b82f6_11px)] group-hover:animate-[slide_20s_linear_infinite]" />

                {/* Glow Border */}
                <div className="absolute inset-0 border border-blue-500/30 group-hover:border-blue-400/80 transition-colors duration-300" />
                
                {/* Scanner Effect */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-white opacity-0 blur-[2px] z-20 transition-all duration-700 group-hover:left-[120%] -left-[20%] group-hover:opacity-100" />

                {/* Button Content */}
                <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
                    <div className="flex flex-col items-start text-left">
                        <span className="font-display font-black tracking-[0.2em] uppercase text-xl text-white group-hover:text-blue-100 transition-colors shadow-black drop-shadow-sm">
                            {t('enter_nexus')}
                        </span>
                        <div className="flex items-center gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]" />
                            <span className="text-[10px] font-mono uppercase text-blue-300 tracking-widest">System Ready</span>
                        </div>
                    </div>
                    
                    <div className="w-10 h-10 bg-blue-500/20 rounded-sm flex items-center justify-center border border-blue-400/30 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300 group-hover:rotate-90">
                        <ArrowRight className="w-5 h-5 text-blue-200 group-hover:text-white" />
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 p-1">
                    <div className="w-2 h-2 border-t border-r border-blue-400/50" />
                </div>
                <div className="absolute bottom-0 left-0 p-1">
                    <div className="w-2 h-2 border-b border-l border-blue-400/50" />
                </div>
            </button>

            <button 
                onClick={() => setShowBriefing(true)}
                className="group relative px-8 h-16 flex items-center gap-3 text-slate-400 hover:text-white transition-colors border-b border-transparent hover:border-white/20"
            >
                <Cpu className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <span className="font-display font-bold tracking-widest uppercase text-sm">{t('mission_data')}</span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </button>
        </motion.div>
      </div>

      {/* Mission Briefing Modal - High Tech Overlay */}
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
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-6xl bg-[#020617] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[85vh] md:h-[750px] overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glowing Borders */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    {/* Sidebar */}
                    <div className="w-full md:w-[300px] border-r border-white/10 bg-[#050a18] flex flex-col shrink-0 relative z-20">
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/10 to-transparent">
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
                                    <div className="relative w-10 h-7 shadow-sm shrink-0 overflow-hidden rounded-sm border border-white/10">
                                        <img src={r.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={r.name} />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-widest font-display truncate">{r.name}</span>
                                    
                                    {/* Scan Effect on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                                 </button>
                             ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow flex flex-col relative bg-[#0b1121] bg-opacity-95">
                         {/* Background Grid */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowBriefing(false)}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex-grow overflow-y-auto p-8 md:p-12 relative z-10 custom-scrollbar">
                            {selectedRegion ? (
                                <motion.div 
                                    key={selectedRegion.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-10"
                                >
                                    {/* Region Header */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-white/10 pb-8">
                                        <div className="w-40 h-24 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20 relative shrink-0 group">
                                            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10" />
                                            <img src={selectedRegion.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            
                                            {/* Corner brackets for flag */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50 z-20" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50 z-20" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                                                 <span className="text-green-500 font-mono text-xs tracking-widest uppercase">Sector Online</span>
                                            </div>
                                            <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter mb-2 drop-shadow-lg">{selectedRegion.name}</h2>
                                        </div>
                                    </div>

                                    {/* Intel Grid */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Mandatory Tags */}
                                        <div className="bg-blue-950/20 border border-blue-500/20 p-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                                            <div className="absolute -right-10 -top-10 text-blue-500/5 group-hover:text-blue-500/10 transition-colors transform rotate-12">
                                                <ShieldCheck className="w-48 h-48" />
                                            </div>
                                            
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-widest mb-6 relative z-10">
                                                <AtSign className="w-4 h-4" />
                                                {t('mandatory_targets')}
                                            </h4>
                                            
                                            <div className="flex flex-wrap gap-3 relative z-10">
                                                {selectedRegion.mentions.map((m, idx) => (
                                                    <motion.span 
                                                        key={m}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="px-4 py-2 bg-[#020617] border border-blue-500/40 text-blue-100 font-mono text-sm shadow-lg font-bold hover:bg-blue-500/20 cursor-default"
                                                    >
                                                        {m}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hashtags */}
                                        <div className="bg-purple-950/20 border border-purple-500/20 p-6 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                                            <div className="absolute -right-10 -top-10 text-purple-500/5 group-hover:text-purple-500/10 transition-colors transform rotate-12">
                                                <Hash className="w-48 h-48" />
                                            </div>

                                            <h4 className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest mb-6 relative z-10">
                                                <Hash className="w-4 h-4" />
                                                {t('tracking_signals')}
                                            </h4>
                                            <div className="flex flex-wrap gap-2 relative z-10">
                                                {selectedRegion.hashtags.map((h, idx) => (
                                                    <motion.span 
                                                        key={h} 
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                                        className="px-3 py-1 bg-[#020617] border border-purple-500/40 text-purple-100 font-mono text-xs hover:bg-purple-500/20 cursor-default"
                                                    >
                                                        {h}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rewards Section */}
                                    <div className="relative p-8 bg-gradient-to-r from-yellow-900/10 to-transparent border border-yellow-500/20 shadow-lg group hover:border-yellow-500/40 transition-colors">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/50 shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.2)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-shadow">
                                                <Trophy className="w-8 h-8 text-yellow-400" />
                                            </div>
                                            <div>
                                                <h5 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wide">OPERATIONAL YIELD</h5>
                                                <p className="text-slate-200 text-base leading-relaxed max-w-2xl font-medium">
                                                    {t('step3_desc')}
                                                    <span className="block mt-2 text-xs text-slate-400 font-mono uppercase tracking-widest flex items-center gap-2">
                                                        <Zap className="w-3 h-3 text-yellow-500" /> 
                                                        POOL INTEGRITY: <span className="text-green-400">ACTIVE</span>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                                    <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                                        <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                                        <Globe2 className="w-16 h-16 text-slate-500" />
                                    </div>
                                    <div className="max-w-md">
                                        <h3 className="text-3xl font-display font-bold text-white mb-3 uppercase tracking-widest">AWAITING SECTOR INPUT</h3>
                                        <p className="text-slate-400 font-mono text-sm">Select sector to decrypt protocols.</p>
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
                20px 0, 100% 0, 
                100% calc(100% - 20px), calc(100% - 20px) 100%, 
                0 100%, 0 20px
            );
        }
      `}</style>
    </div>
  );
};