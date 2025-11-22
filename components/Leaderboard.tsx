
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Region, User } from '../types';
import { REGIONS } from '../constants';
import { UserService } from '../storage';
import { 
  Trophy, 
  Crown, 
  ChevronLeft, 
  ChevronRight, 
  Globe2, 
  Target, 
  AlertCircle, 
  Triangle, 
  Circle, 
  Square, 
  X 
} from 'lucide-react';

interface Props {
  userRegion?: Region;
  t: (key: string) => string;
}

export const Leaderboard: React.FC<Props> = ({ userRegion, t }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'regional'>('regional');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<Region>(userRegion || Region.TURKEY);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('INITIALIZING SYSTEM');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Real data state
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Minimum artificial delay to show off the cool animation
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const dataPromise = UserService.getAllUsers();
      
      const [fetchedUsers] = await Promise.all([dataPromise, minDelay]);
      
      setUsers(fetchedUsers);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const texts = ['ESTABLISHING UPLINK', 'VERIFYING CREDENTIALS', 'SYNCHRONIZING DATA', 'DECRYPTING RECORDS'];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i]);
        i = (i + 1) % texts.length;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const filteredData = useMemo(() => {
    if (activeTab === 'global') {
      return [...users].sort((a, b) => b.mindshareScore - a.mindshareScore);
    } else {
      return users.filter(u => u.region === selectedRegionFilter)
        .sort((a, b) => b.mindshareScore - a.mindshareScore);
    }
  }, [activeTab, selectedRegionFilter, users]);

  const topThree = filteredData.slice(0, 3);
  const restOfList = filteredData.slice(3);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 sticky top-24 z-30 py-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="bg-black/40 p-1.5 rounded-xl border border-white/10 flex relative shrink-0">
          {/* Sliding Background for Tabs */}
          <motion.div 
            className="absolute top-1.5 bottom-1.5 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            initial={false}
            animate={{
                x: activeTab === 'regional' ? 0 : '100%',
                width: '50%'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          <button
            onClick={() => setActiveTab('regional')}
            className={`relative z-10 px-6 py-2.5 w-32 rounded-lg font-bold font-display text-sm tracking-widest transition-colors ${activeTab === 'regional' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {t('regional_tab')}
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`relative z-10 px-6 py-2.5 w-32 rounded-lg font-bold font-display text-sm tracking-widest transition-colors ${activeTab === 'global' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {t('global_tab')}
          </button>
        </div>

        {activeTab === 'regional' && (
          <div className="relative w-full md:w-auto group">
             {/* Left Arrow */}
             <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-blue-500 hover:border-blue-400 transition-all -ml-4 shadow-lg opacity-0 group-hover:opacity-100"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>

            {/* Scrollable Region List */}
            <div 
                ref={scrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto max-w-full md:max-w-2xl pb-2 md:pb-0 scrollbar-hide mask-image-fade scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {REGIONS.map(region => (
                <button
                    key={region.id}
                    onClick={() => setSelectedRegionFilter(region.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 whitespace-nowrap shrink-0 ${
                    selectedRegionFilter === region.id
                        ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:text-slate-200'
                    }`}
                >
                    <img src={region.image} alt={region.name} className={`w-5 h-4 object-cover rounded-sm transition-all ${selectedRegionFilter === region.id ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`} />
                    <span className="text-sm font-medium font-display uppercase">{region.name}</span>
                </button>
                ))}
            </div>

             {/* Right Arrow */}
             <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-blue-500 hover:border-blue-400 transition-all -mr-4 shadow-lg opacity-0 group-hover:opacity-100"
             >
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      {/* Prize Pool / Status Banner */}
      <div className="flex justify-center mb-12">
          {activeTab === 'regional' ? (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-6 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
            >
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-200 font-bold font-display tracking-widest text-sm">{t('top_3_reward')}</span>
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-6 py-2 rounded-full bg-slate-800/50 border border-slate-700"
            >
                <Globe2 className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300 font-bold font-display tracking-widest text-sm">{t('global_glory')}</span>
            </motion.div>
          )}
      </div>

      {isLoading ? (
        <div className="w-full min-h-[500px] flex flex-col items-center justify-center relative bg-[#0f172a]/40 rounded-3xl border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
           
           {/* Background Pulse */}
           <motion.div 
             className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"
             animate={{ opacity: [0.5, 0.8, 0.5] }}
             transition={{ duration: 3, repeat: Infinity }}
           />
           
           {/* Animated Grid Background */}
           <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />
           
           {/* Central Rotating HUD Ring */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full flex items-center justify-center">
                <motion.div 
                    className="absolute inset-0 border-t border-l border-blue-500/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                    className="absolute inset-4 border-b border-r border-purple-500/20 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
           </div>

           {/* Floating Shapes */}
           <div className="flex items-center justify-center gap-12 mb-12 z-10 relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
              
              {[
                { Icon: Triangle, color: 'text-green-400', shadow: 'shadow-green-500/50', delay: 0 },
                { Icon: Circle, color: 'text-red-400', shadow: 'shadow-red-500/50', delay: 0.2 },
                { Icon: X, color: 'text-blue-400', shadow: 'shadow-blue-500/50', delay: 0.4 },
                { Icon: Square, color: 'text-pink-400', shadow: 'shadow-pink-500/50', delay: 0.6 },
              ].map(({ Icon, color, shadow, delay }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: [0.4, 1, 0.4], 
                        scale: [1, 1.2, 1],
                        y: [0, -10, 0]
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: delay,
                        ease: "easeInOut"
                    }}
                    className="relative group"
                  >
                      <div className={`absolute inset-0 bg-current blur-xl opacity-20 ${color}`} />
                      <Icon className={`w-12 h-12 ${color} drop-shadow-[0_0_10px_currentColor]`} strokeWidth={2.5} />
                  </motion.div>
              ))}
           </div>
           
           {/* Loading Text & Bar */}
           <div className="flex flex-col items-center z-10 w-64">
               <AnimatePresence mode="wait">
                 <motion.h3 
                    key={loadingText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-display font-bold text-white tracking-[0.2em] text-center h-8 min-w-[280px]"
                 >
                    {loadingText}
                 </motion.h3>
               </AnimatePresence>
               
               <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div 
                     className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2 blur-[2px]"
                     animate={{ x: ['-100%', '200%'] }}
                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
               </div>
               
               <div className="mt-2 flex justify-between w-full text-[10px] font-mono text-slate-500">
                   <span>00.01.45</span>
                   <span>SECURE_NET</span>
               </div>
           </div>
        </div>
      ) : users.length === 0 ? (
          <div className="text-center py-20 opacity-50 bg-white/5 rounded-2xl border border-white/5">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-white mb-2">NO DATA FOUND</h3>
              <p className="text-slate-400">Be the first to register in this sector.</p>
          </div>
      ) : (
        <>
            {/* Podium Section */}
            {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-end mb-16 px-4 md:px-12">
                    {/* 2nd Place */}
                    <div className="order-2 md:order-1 flex justify-center">
                    {topThree[1] ? (
                        <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                        >
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-slate-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <img src={topThree[1].avatarUrl} className="relative w-20 h-20 rounded-full border-2 border-slate-400 object-cover" alt="" />
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs font-bold px-2 py-0.5 rounded border border-slate-600">#2</div>
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="font-bold text-lg text-slate-200">{topThree[1].discordUsername.split('#')[0]}</h3>
                                {activeTab === 'global' && (
                                    <div className="flex items-center justify-center gap-1 mt-1 mb-1">
                                        <img src={REGIONS.find(r => r.id === topThree[1].region)?.image} className="w-3 h-2 object-cover rounded-[1px]" alt="" />
                                        <span className="text-[10px] text-slate-400 uppercase">{topThree[1].region}</span>
                                    </div>
                                )}
                                <div className="mt-1 bg-slate-900/50 px-3 py-1 rounded border border-slate-700 text-slate-300 font-mono font-bold">
                                    {topThree[1].mindshareScore.toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    ) : <div className="w-20" />} 
                    </div>

                    {/* 1st Place */}
                    <div className="order-1 md:order-2 -mt-8 md:-mt-12 flex justify-center">
                    {topThree[0] && (
                        <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center relative z-10"
                        >
                            {/* Only show Golden Glow if Regional */}
                            {activeTab === 'regional' ? (
                                <div className="absolute -top-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none" />
                            ) : (
                                <div className="absolute -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                            )}
                            
                            <div className="relative group cursor-pointer">
                                {/* Crown only for Regional Prize Winner, maybe a Star for Global? */}
                                {activeTab === 'regional' ? (
                                    <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400 fill-yellow-400 animate-bounce" />
                                ) : (
                                    <Target className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 text-blue-400 animate-pulse" />
                                )}

                                <div className={`absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity ${activeTab === 'regional' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                <img src={topThree[0].avatarUrl} className={`relative w-32 h-32 rounded-full border-4 object-cover shadow-2xl ${activeTab === 'regional' ? 'border-yellow-400 shadow-yellow-500/20' : 'border-blue-400 shadow-blue-500/20'}`} alt="" />
                                
                                <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-black text-sm font-black px-3 py-0.5 rounded border uppercase tracking-widest shadow-lg ${activeTab === 'regional' ? 'bg-yellow-500 border-yellow-300' : 'bg-blue-500 border-blue-300'}`}>
                                    #1 {activeTab === 'regional' ? t('champion') : t('leader')}
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <h3 className="font-black text-2xl text-white tracking-wide">{topThree[0].discordUsername.split('#')[0]}</h3>
                                {activeTab === 'global' && (
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <img src={REGIONS.find(r => r.id === topThree[0].region)?.image} className="w-4 h-3 object-cover rounded-[2px]" alt="" />
                                        <span className="text-xs text-slate-400 uppercase tracking-wide">{topThree[0].region}</span>
                                    </div>
                                )}
                                <div className={`mt-3 border px-6 py-1.5 rounded-lg font-display font-bold text-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] ${activeTab === 'regional' ? 'bg-gradient-to-r from-yellow-900/40 to-yellow-600/40 border-yellow-500/50 text-yellow-200' : 'bg-gradient-to-r from-blue-900/40 to-blue-600/40 border-blue-500/50 text-blue-200'}`}>
                                    {topThree[0].mindshareScore.toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </div>

                    {/* 3rd Place */}
                    <div className="order-3 flex justify-center">
                    {topThree[2] ? (
                        <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                        >
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-orange-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <img src={topThree[2].avatarUrl} className="relative w-20 h-20 rounded-full border-2 border-orange-600 object-cover" alt="" />
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-900 text-orange-200 text-xs font-bold px-2 py-0.5 rounded border border-orange-700">#3</div>
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="font-bold text-lg text-slate-200">{topThree[2].discordUsername.split('#')[0]}</h3>
                                {activeTab === 'global' && (
                                    <div className="flex items-center justify-center gap-1 mt-1 mb-1">
                                        <img src={REGIONS.find(r => r.id === topThree[2].region)?.image} className="w-3 h-2 object-cover rounded-[1px]" alt="" />
                                        <span className="text-[10px] text-slate-400 uppercase">{topThree[2].region}</span>
                                    </div>
                                )}
                                <div className="mt-1 bg-slate-900/50 px-3 py-1 rounded border border-slate-700 text-slate-300 font-mono font-bold">
                                    {topThree[2].mindshareScore.toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    ) : <div className="w-20" />}
                    </div>
                </div>
            )}

            {/* List View - Floating Cards */}
            <div className="flex flex-col gap-3">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-display">
                    <div className="col-span-1">{t('rank')}</div>
                    <div className="col-span-5 md:col-span-6">{t('commander')}</div>
                    {activeTab === 'global' && <div className="col-span-2 text-center hidden md:block">{t('region')}</div>}
                    <div className={`col-span-6 md:col-span-3 text-right ${activeTab === 'global' ? 'md:col-span-3' : 'md:col-span-5'}`}>{t('mindshare')}</div>
                </div>

                <AnimatePresence mode='popLayout'>
                {restOfList.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group relative overflow-hidden"
                        whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgba(30, 58, 138, 0.2)",
                            transition: { duration: 0.2 }
                        }}
                    >
                        {/* Hover Highlight Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#3b82f6]" />
                        
                        {/* Hover Scanline */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out pointer-events-none" />

                        {/* Row Card */}
                        <div className="grid grid-cols-12 items-center p-4 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 cursor-default relative z-10">
                            
                            {/* Rank */}
                            <div className="col-span-1 font-mono text-slate-500 font-bold text-lg group-hover:text-blue-400 transition-colors duration-300 group-hover:scale-110 origin-left">
                                {index + 4}
                            </div>

                            {/* User Info */}
                            <div className="col-span-5 md:col-span-6 flex items-center gap-4">
                                <div className="relative">
                                    <img 
                                        src={user.avatarUrl} 
                                        className="w-10 h-10 rounded-full bg-slate-800 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ring-2 ring-transparent group-hover:ring-blue-500/50 group-hover:scale-110 relative z-10" 
                                        alt="" 
                                    />
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-200 group-hover:text-white transition-colors text-sm md:text-base group-hover:translate-x-1 transition-transform duration-300 font-display tracking-wide">
                                        {user.discordUsername}
                                    </span>
                                    <span className="text-xs text-slate-500 group-hover:text-blue-400/70 transition-colors font-mono">
                                        {user.twitterHandle}
                                    </span>
                                </div>
                            </div>

                            {/* Region Flag (Global Only) */}
                            {activeTab === 'global' && (
                                <div className="col-span-2 hidden md:flex justify-center">
                                    <div className="bg-black/30 p-1.5 rounded flex items-center gap-2 border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                        <img src={REGIONS.find(r => r.id === user.region)?.image} className="w-5 h-4 object-cover rounded-[2px]" alt="" />
                                        <span className="text-xs text-slate-400 group-hover:text-blue-300 font-display">{user.region.substring(0,3).toUpperCase()}</span>
                                    </div>
                                </div>
                            )}

                            {/* Score */}
                            <div className={`col-span-6 md:col-span-3 text-right ${activeTab === 'global' ? 'md:col-span-3' : 'md:col-span-5'}`}>
                                <span className="font-display font-bold text-lg md:text-xl text-blue-400 group-hover:text-blue-300 transition-colors tabular-nums tracking-wider group-hover:shadow-blue-500/50 text-glow-blue">
                                    {user.mindshareScore.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
        </>
      )}
    </div>
  );
};
