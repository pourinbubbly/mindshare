
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Region } from '../types';
import { REGIONS } from '../constants';
import { UserService } from '../storage';
import { TwitterService } from '../twitter'; // Import Real Service
import { 
  Disc, 
  Twitter, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Hash, 
  AtSign, 
  Wifi, 
  ChevronRight,
  UserCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';

interface Props {
  selectedRegion: Region;
  onBack: () => void;
  onComplete: () => void;
  t: (key: string) => string;
}

export const RegistrationForm: React.FC<Props> = ({ selectedRegion, onBack, onComplete, t }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [discordId, setDiscordId] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>(['> SYSTEM_INIT...', '> WAITING_FOR_USER_INPUT...']);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for real user data preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [realFollowers, setRealFollowers] = useState<number | null>(null);
  
  const regionConfig = REGIONS.find(r => r.id === selectedRegion);

  const addLog = (text: string) => {
    setStatusLog(prev => [...prev.slice(-5), `> ${text}`]);
  };

  const handleDiscordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (discordId.length > 2) {
      // Check if user already exists
      if (UserService.checkDiscordExists(discordId)) {
          setError(t('discord_error_duplicate'));
          addLog('ERROR: IDENTITY_ALREADY_REGISTERED');
          return;
      }

      addLog(`IDENTITY_DETECTED: ${discordId}`);
      addLog('INITIATING_UPLINK_PROTOCOL...');
      setStep(2);
    }
  };

  const handleTwitterConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twitterHandle) return;

    setIsConnecting(true);
    addLog('INITIATING_SECURE_HANDSHAKE...');
    addLog('AUTHENTICATING_WITH_X_API_V2...');
    
    // REAL API CALL
    try {
        const userData = await TwitterService.getUserData(twitterHandle);

        if (userData && userData.data) {
            const { profile_image_url, public_metrics, username } = userData.data;
            const followers = public_metrics?.followers_count || 0;
            
            // Success Logic
            addLog(`SUCCESS: USER_FOUND @${username.toUpperCase()}`);
            addLog(`METRICS: ${followers} FOLLOWERS DETECTED`);
            addLog('DOWNLOADING_BIOMETRICS...'); // Profile Image
            
            // Update Preview
            if (profile_image_url) setPreviewImage(profile_image_url.replace('_normal', '_400x400')); // Get high res
            setRealFollowers(followers);
            
            // Calculate Mindshare based on REAL data
            // Base score 500 + 1 point per follower (capped or scaled) + random fluctuation
            const baseScore = 500;
            const influenceBonus = Math.min(followers * 0.5, 5000); // Cap influence bonus
            const calculatedScore = Math.floor(baseScore + influenceBonus + (Math.random() * 100));
            
            addLog(`CALCULATING_MINDSHARE: ${calculatedScore}`);

            // Wait a moment for visual effect
            setTimeout(() => {
                const newUser = {
                    id: crypto.randomUUID(),
                    discordUsername: discordId,
                    twitterHandle: `@${username}`,
                    region: selectedRegion,
                    mindshareScore: calculatedScore,
                    rank: 0,
                    avatarUrl: profile_image_url?.replace('_normal', '_400x400') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${discordId}`,
                    followersCount: followers
                };
                
                UserService.registerUser(newUser);
                addLog('USER_REGISTERED_SUCCESSFULLY');
                
                setTimeout(() => {
                    setIsConnecting(false);
                    onComplete();
                }, 800);
            }, 1500);

        } else {
            // API Worked but user not found or error
            throw new Error('User not found');
        }

    } catch (error) {
        addLog('ERROR: CONNECTION_FAILED_OR_USER_INVALID');
        addLog('FALLBACK_PROTOCOL_INITIATED...');
        console.error(error);
        
        // Fallback for demo purposes if API quota exceeded or CORS hard block (though Proxy helps)
        // We still register them but with base stats so the app doesn't break
        setTimeout(() => {
             const newUser = {
                id: crypto.randomUUID(),
                discordUsername: discordId,
                twitterHandle: twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`,
                region: selectedRegion,
                mindshareScore: 500, // No bonus
                rank: 0,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${discordId}`,
                followersCount: 0
            };
            UserService.registerUser(newUser);
            setIsConnecting(false);
            onComplete();
        }, 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    addLog(`COPIED: ${text}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10 flex flex-col md:flex-row gap-8 items-start">
      
      {/* LEFT PANEL: Identity Preview Card */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-1/3 sticky top-24"
      >
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 relative group">
            {/* ID Card Header */}
            <div className="h-32 relative overflow-hidden bg-slate-900">
                 <div className="absolute inset-0 opacity-50 mix-blend-overlay">
                    <img src={regionConfig?.image} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]" />
                 <div className="absolute top-4 right-4">
                    <img src={regionConfig?.image} className="w-8 h-6 rounded shadow-md border border-white/20" alt="Flag" />
                 </div>
            </div>

            {/* Avatar & Info */}
            <div className="px-6 pb-6 relative">
                <div className="w-24 h-24 rounded-2xl bg-black border-4 border-[#0f172a] shadow-xl -mt-12 mb-4 relative overflow-hidden flex items-center justify-center group-hover:border-blue-500/50 transition-colors duration-500">
                    {previewImage ? (
                        <img src={previewImage} alt="Avatar" className="w-full h-full object-cover" />
                    ) : discordId ? (
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${discordId}`} alt="Avatar" className="w-full h-full object-cover bg-slate-800" />
                    ) : (
                        <UserCircle2 className="w-12 h-12 text-slate-600" />
                    )}
                    
                    {/* Scan Line Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent w-full h-1/3 -translate-y-full animate-[scan_3s_ease-in-out_infinite]" />
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl font-display font-bold text-white tracking-wide truncate">
                        {discordId || 'UNKNOWN_USER'}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${discordId ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-600'}`} />
                        {discordId ? 'ID_VERIFIED' : 'NO_DATA'}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-slate-500 uppercase tracking-wider">{t('region')}</span>
                        <span className="text-blue-300 font-bold">{regionConfig?.name.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-slate-500 uppercase tracking-wider">Status</span>
                        <span className={`${step === 2 ? 'text-yellow-400' : 'text-slate-500'} font-bold`}>
                            {step === 2 ? 'LINKING...' : 'UNREGISTERED'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2">
                        <span className="text-slate-500 uppercase tracking-wider">{t('mindshare')}</span>
                        <span className="font-mono text-slate-600">
                            {realFollowers !== null ? (
                                <span className="text-green-400">CALCULATING...</span>
                            ) : '--'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blue-500/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blue-500/50" />
        </div>

        {/* System Log Terminal */}
        <div className="mt-4 glass-panel rounded-xl p-4 font-mono text-[10px] text-slate-400 border border-white/5 h-40 overflow-hidden flex flex-col justify-end relative bg-black/50">
             <div className="absolute top-2 right-3 text-[8px] text-slate-600">SYS_LOG_V2</div>
             {statusLog.map((log, i) => (
                 <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-green-400' : 'text-slate-400'}`}
                 >
                     {log}
                 </motion.div>
             ))}
             <div className="w-2 h-4 bg-green-500/50 animate-pulse mt-1" />
        </div>
      </motion.div>


      {/* RIGHT PANEL: Action Form */}
      <motion.div 
         initial={{ x: 50, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         className="w-full md:w-2/3"
      >
         <div className="glass-panel rounded-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden min-h-[500px] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" /> {t('abort')}
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{t('step_counter')} 0{step} / 02</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-grow flex flex-col justify-center"
                    >
                        <div className="mb-8">
                            <h1 className="text-4xl font-display font-bold text-white mb-3">{t('identity_uplink')}</h1>
                            <p className="text-slate-400 max-w-md">
                                {t('enter_discord')}
                            </p>
                        </div>

                        <form onSubmit={handleDiscordSubmit} className="space-y-6">
                            <div className="relative group">
                                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 ml-1">
                                    {t('codex_id')}
                                </label>
                                <div className="relative">
                                    <Disc className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-400'}`} />
                                    <input 
                                        type="text"
                                        value={discordId}
                                        onChange={(e) => {
                                            setDiscordId(e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="username#0000"
                                        className={`w-full bg-black/40 border rounded-xl py-5 pl-14 pr-4 text-white text-lg font-mono placeholder-slate-600 focus:outline-none transition-all shadow-inner ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'}`}
                                        required
                                        autoFocus
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {discordId.length > 2 && !error && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
                                    </div>
                                </div>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 flex items-center gap-2 text-red-400 text-sm font-medium pl-1"
                                    >
                                        <AlertOctagon className="w-4 h-4" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-5 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest font-display shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <span className="relative z-10">{t('init_protocol')}</span>
                                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-blue-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-grow flex flex-col h-full"
                    >
                        <div className="mb-4">
                            <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                                <Wifi className="w-8 h-8 text-blue-500 animate-pulse" />
                                {t('establish_link')}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {t('connect_x')}
                            </p>
                        </div>

                        {/* Objectives Panel */}
                        <div className="flex-grow space-y-3 mb-6">
                             {/* Mentions Objective */}
                             <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-500/20 rounded">
                                            <AtSign className="w-3 h-3 text-blue-400" />
                                        </div>
                                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">{t('mandatory_targets')}</h4>
                                    </div>
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">{t('required')}</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {regionConfig?.mentions.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => copyToClipboard(tag)}
                                            className="group/btn relative flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/10 transition-all active:scale-95"
                                        >
                                            <span className="font-mono text-xs text-blue-100">{tag}</span>
                                            {copiedText === tag ? (
                                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                            ) : (
                                                <Copy className="w-3 h-3 text-slate-500 group-hover/btn:text-white transition-colors" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                             </div>

                             {/* Hashtags Objective */}
                             <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-500/20 rounded">
                                            <Hash className="w-3 h-3 text-purple-400" />
                                        </div>
                                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">{t('tracking_signals')}</h4>
                                    </div>
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">{t('recommended')}</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {regionConfig?.hashtags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => copyToClipboard(tag)}
                                            className="group/btn relative flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/10 transition-all active:scale-95"
                                        >
                                            <span className="font-mono text-xs text-purple-100">{tag}</span>
                                            {copiedText === tag ? (
                                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                            ) : (
                                                <Copy className="w-3 h-3 text-slate-500 group-hover/btn:text-white transition-colors" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {/* Input Form for Twitter */}
                        <form onSubmit={handleTwitterConnect} className="mt-auto">
                            <div className="relative group mb-4">
                                <div className="relative">
                                    <Twitter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input 
                                        type="text"
                                        value={twitterHandle}
                                        onChange={(e) => setTwitterHandle(e.target.value)}
                                        placeholder="@yourhandle"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-14 pr-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#1DA1F2] focus:ring-1 focus:ring-[#1DA1F2]/50 transition-all shadow-inner"
                                        required
                                    />
                                    {/* Real data indicator */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                         <span className="text-[10px] text-green-500 bg-green-900/20 border border-green-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            API V2
                                         </span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isConnecting}
                                className="w-full relative py-5 bg-[#1DA1F2] hover:bg-[#1a91da] disabled:bg-[#1DA1F2]/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all uppercase tracking-widest font-display flex items-center justify-center gap-3 shadow-lg shadow-[#1DA1F2]/20 hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{t('scan_freq')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Twitter className="w-5 h-5 fill-white" />
                                        <span>{t('auth_scan')}</span>
                                    </>
                                )}
                                
                                {/* Scanning light effect */}
                                {isConnecting && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12 animate-[shimmer_1.5s_infinite]" />
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
      </motion.div>
    </div>
  );
};