
import React, { useState } from 'react';
import { ViewState, Region, LanguageCode } from './types';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LandingPage } from './components/LandingPage';
import { RegionSelector } from './components/RegionSelector';
import { RegistrationForm } from './components/RegistrationForm';
import { Leaderboard } from './components/Leaderboard';
import { BrainCircuit, ChevronRight, AlertCircle, LogIn, Globe } from 'lucide-react';
import { LANGUAGES, getTranslation } from './translations';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
  const [hasChangedRegion, setHasChangedRegion] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setView('REGISTER');
  };

  const handleRegistrationComplete = () => {
    setView('LEADERBOARD');
  };

  const handleLogoClick = () => {
    setView('LANDING');
    setSelectedRegion(undefined);
  };

  const handleChangeRegion = () => {
    if (!hasChangedRegion) {
      setHasChangedRegion(true);
      setView('REGION_SELECT');
      setSelectedRegion(undefined);
    }
  };

  return (
    <div className="min-h-screen text-white relative selection:bg-blue-500 selection:text-white flex flex-col font-sans">
      <AnimatedBackground />

      {/* Navigation Bar */}
      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-[#020617]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center gap-3 group outline-none cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
              <BrainCircuit className="w-8 h-8 text-blue-500 relative z-10" />
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="font-display font-bold text-xl tracking-wider leading-none text-white group-hover:text-blue-200 transition-colors">CARV MINDSHARE</span>
              <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase group-hover:text-blue-400 transition-colors">Nexus Battleground</span>
            </div>
          </button>

          {/* Breadcrumbs - Desktop */}
          {view !== 'LANDING' && (
            <div className="hidden lg:flex items-center gap-4">
               <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${view === 'REGION_SELECT' ? 'text-white' : 'text-slate-600'}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {t('select_region')}
               </div>
               <ChevronRight className="w-4 h-4 text-slate-700" />
               <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${view === 'REGISTER' ? 'text-white' : 'text-slate-600'}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {t('identity_uplink')}
               </div>
               <ChevronRight className="w-4 h-4 text-slate-700" />
               <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${view === 'LEADERBOARD' ? 'text-white' : 'text-slate-600'}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {t('regional_tab')}
               </div>
            </div>
          )}

          <div className="flex items-center gap-4">
             {/* Language Selector */}
             <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <img 
                    src={LANGUAGES.find(l => l.code === language)?.image} 
                    alt={language}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-sm font-bold text-slate-200 uppercase">{language}</span>
                </button>

                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-white/5 transition-colors ${language === lang.code ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-slate-400'}`}
                        >
                          <img src={lang.image} alt={lang.code} className="w-5 h-5 rounded-full object-cover" />
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
             </div>

             {view === 'LANDING' && (
                <button onClick={() => setView('LEADERBOARD')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors hidden sm:block">
                    {t('view_standings')}
                </button>
             )}

             {view !== 'LANDING' && view !== 'LEADERBOARD' && (
                 <button onClick={() => setView('LEADERBOARD')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg uppercase tracking-widest hidden sm:block">
                     {t('skip_rankings')}
                 </button>
             )}
             
              {view === 'LEADERBOARD' && !hasChangedRegion && (
                 <button 
                    onClick={handleChangeRegion} 
                    className="group flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/30 hover:border-blue-500/60 px-4 py-2 rounded-lg uppercase tracking-widest bg-blue-500/10"
                 >
                     {selectedRegion ? (
                       <>
                         <span>{t('change_region')}</span>
                         <AlertCircle className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </>
                     ) : (
                       <>
                         <LogIn className="w-3 h-3" />
                         <span>{t('init_protocol')}</span>
                       </>
                     )}
                 </button>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10">
        {view === 'LANDING' && (
          <LandingPage onStart={() => setView('REGION_SELECT')} language={language} t={t} />
        )}

        {view === 'REGION_SELECT' && (
          <RegionSelector onSelect={handleRegionSelect} t={t} />
        )}

        {view === 'REGISTER' && selectedRegion && (
          <div className="flex-grow flex flex-col items-center justify-center p-4">
            <RegistrationForm 
              selectedRegion={selectedRegion} 
              onBack={() => setView('REGION_SELECT')}
              onComplete={handleRegistrationComplete}
              t={t}
            />
          </div>
        )}

        {view === 'LEADERBOARD' && (
          <Leaderboard userRegion={selectedRegion} t={t} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center relative z-10 bg-black/20 backdrop-blur-sm mt-auto">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
             <BrainCircuit className="w-4 h-4" />
             <span className="text-xs font-display tracking-widest">{t('system_online')}</span>
          </div>
          <p className="text-slate-600 text-xs">© 2025 MINDSHARE NEXUS. PROTOCOL V1.0</p>
      </footer>
    </div>
  );
};

export default App;
