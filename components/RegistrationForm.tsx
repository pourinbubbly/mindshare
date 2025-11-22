
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Region } from '../types';
import { REGIONS } from '../constants';
import { UserService, SessionService } from '../storage';
import { TwitterService } from '../twitter'; 
import { 
  Disc, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Hash, 
  AtSign, 
  Wifi, 
  ChevronRight,
  UserCircle2,
  AlertOctagon,
  Scan,
  Eye
} from 'lucide-react';

// Custom X Logo Component
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface Props {
  selectedRegion: Region;
  onBack: () => void;
  onComplete: () => void;
  t: (key: string) => string;
}

export const RegistrationForm: React.FC<Props> = ({ selectedRegion, onBack, onComplete, t }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [discordId, setDiscordId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>(['> SYSTEM_INIT...', '> WAITING_FOR_USER_INPUT...']);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Data from Backend Callback
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [realFollowers, setRealFollowers] = useState<number | null>(null);
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  
  const regionConfig = REGIONS.find(r => r.id === selectedRegion);

  const addLog = (text: string) => {
    setStatusLog(prev => [...prev.slice(-5), `> ${text}`]);
  };

  // CHECK FOR OAUTH CALLBACK PARAMS ON MOUNT
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'success') {
        const dId = params.get('discordId');
        const score = parseInt(params.get('score') || '0');
        const handle = params.get('twitterHandle');
        const avatar = params.get('avatarUrl');
        const followers = parseInt(params.get('followers') || '0');
        const region = params.get('region') as Region;

        if (dId) {
            setDiscordId(dId);
            setStep(2); // Move to Step 2 visually
            setPreviewImage(avatar);
            setRealFollowers(followers);
            setCalculatedPoints(score);
            
            addLog('OAUTH_CALLBACK_RECEIVED');
            addLog(`IDENTITY: ${handle}`);
            addLog(`IMPRESSIONS_SCANNED: ${score}`);
            addLog('FINALIZING_REGISTRATION...');

            // AUTO COMPLETE REGISTRATION
            handleFinalRegistration({
                id: crypto.randomUUID(),
                discordUsername: dId,
                twitterHandle: handle || '',
                region: region || selectedRegion,
                mindshareScore: score,
                rank: 0,
                avatarUrl: avatar || '',
                followersCount: followers
            });
        }
    } else if (status === 'error') {
        setStep(2);
        setError(params.get('message') || 'OAuth Failed');
        addLog('CRITICAL: OAUTH_CONNECTION_FAILED');
    }
  }, []);

  const handleDiscordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (discordId.length > 2) {
      setIsConnecting(true);
      // ASYNC: Check if user already exists via backend
      const exists = await UserService.checkDiscordExists(discordId);
      setIsConnecting(false);

      if (exists) {
          setError(t('discord_error_duplicate'));
          addLog('ERROR: IDENTITY_ALREADY_REGISTERED');
          return;
      }

      addLog(`IDENTITY_DETECTED: ${discordId}`);
      addLog('INITIATING_UPLINK_PROTOCOL...');
      setStep(2);
    }
  };

  // REAL OAUTH REDIRECT
  const handleTwitterOAuth = () => {
    setIsConnecting(true);
    addLog('INITIATING_SECURE_HANDSHAKE...');
    addLog('REDIRECTING_TO_X_AUTH_GATEWAY...');
    
    // Redirect browser to backend
    const authUrl = TwitterService.getAuthUrl(discordId, selectedRegion);
    window.location.href = authUrl;
  };

  const handleFinalRegistration = async (userData: any) => {
      try {
        await UserService.registerUser(userData);
        SessionService.saveSession({
            discordUsername: userData.discordUsername,
            region: userData.region
        });
        addLog('USER_REGISTERED_SUCCESSFULLY');
        setTimeout(() => {
            // Clear URL params
            window.history.replaceState({}, document.title, "/");
            onComplete();
        }, 2000);
      } catch (e) {
          setError("Registration Failed");
          addLog("ERROR: DB_WRITE_FAILED");
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
                            {realFollowers !== null && calculatedPoints === null ? (
                                <span className="text-green-400 flex items-center gap-1">
                                    <Scan className="w-3 h-3 animate-spin" />
                                    CALC...
                                </span>
                            ) : calculatedPoints !== null ? (
                                <span className="text-blue-400 font-bold text-sm flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {calculatedPoints.toLocaleString()}
                                </span>
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
        <div className="mt-4 glass-panel rounded-xl p-4 font-mono text-[10px] text-slate-400 border border-white/5 h-48 overflow-hidden flex flex-col justify-end relative bg-black/50">
             <div className="absolute top-2 right-3 text-[8px] text-slate-600">SYS_LOG_V3 (REAL)</div>
             {statusLog.map((log, i) => (
                 <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-1 ${log.includes('ERROR') || log.includes('WARNING') || log.includes('CRITICAL') ? 'text-red-400' : log.includes('SUCCESS') || log.includes('DETECTED') ? 'text-green-400' : log.includes('CALLBACK') || log.includes('IMPRESSIONS') ? 'text-yellow-400' : 'text-slate-400'}`}
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
                                        disabled={isConnecting}
                                        className={`w-full bg-black/40 border rounded-xl py-5 pl-14 pr-4 text-white text-lg font-mono placeholder-slate-600 focus:outline-none transition-all shadow-inner ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'}`}
                                        required
                                        autoFocus
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {discordId.length > 2 && !error && !isConnecting && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
                                        {isConnecting && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
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
                                disabled={isConnecting}
                                className="w-full py-5 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest font-display shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10">{isConnecting ? 'VERIFYING...' : t('init_protocol')}</span>
                                {!isConnecting && <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
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

                        {/* OAUTH BUTTON - REAL BACKEND REDIRECT */}
                        <div className="mt-auto">
                            <button 
                                type="button"
                                onClick={handleTwitterOAuth}
                                disabled={isConnecting}
                                className="w-full relative py-5 bg-black hover:bg-zinc-900 border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all uppercase tracking-widest font-display flex items-center justify-center gap-3 shadow-lg overflow-hidden group"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{t('scan_freq')}</span>
                                    </>
                                ) : (
                                    <>
                                        <XLogo className="w-5 h-5 text-white fill-white" />
                                        <span>Connect with X (OAuth)</span>
                                    </>
                                )}
                                
                                {isConnecting && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12 animate-[shimmer_1.5s_infinite]" />
                                )}
                            </button>
                            
                             {/* Help Text */}
                            <div className="mt-3 text-center">
                                <p className="text-[10px] text-slate-600 font-mono">
                                    SECURE_OAUTH_GATEWAY_V3
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
      </motion.div>
    </div>
  );
};
