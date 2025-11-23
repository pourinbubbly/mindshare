
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Region } from '../types';
import { REGIONS } from '../constants';
import { Trophy, CheckCircle2, Loader2, Target } from 'lucide-react';

interface Props {
  onSelect: (region: Region) => void;
  t: (key: string) => string;
}

export const RegionSelector: React.FC<Props> = ({ onSelect, t }) => {
  const [selectedId, setSelectedId] = useState<Region | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (id: Region) => {
    if (selectedId) return; // Prevent multiple selections
    setSelectedId(id);
    
    // Delay navigation to show confirmation animation
    timeoutRef.current = setTimeout(() => {
      onSelect(id);
    }, 1000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          {t('select_region_title')}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {t('select_region_desc')}
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {REGIONS.map((region) => {
          const isSelected = selectedId === region.id;
          const isOtherSelected = selectedId !== null && !isSelected;

          return (
            <motion.button
              key={region.id}
              variants={item}
              onClick={() => handleSelect(region.id)}
              disabled={selectedId !== null}
              whileHover={selectedId === null ? { 
                scale: 1.02, 
                y: -4,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)",
                borderColor: "rgba(96, 165, 250, 0.4)",
                transition: { type: "spring", stiffness: 400, damping: 25 }
              } : {}}
              whileTap={selectedId === null ? { scale: 0.98 } : {}}
              animate={isSelected ? { 
                scale: 1.05, 
                borderColor: 'rgba(59, 130, 246, 0.8)',
                backgroundColor: 'rgba(30, 58, 138, 0.4)',
                boxShadow: "0 0 50px rgba(37, 99, 235, 0.4)"
              } : isOtherSelected ? {
                opacity: 0.5,
                scale: 0.95,
                filter: 'grayscale(100%)'
              } : {
                borderColor: "rgba(255, 255, 255, 0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36)"
              }}
              className={`group relative h-48 rounded-xl overflow-hidden p-6 text-left border backdrop-blur-md transition-all duration-300
                ${isSelected ? 'z-10' : ''}
              `}
            >
              {/* Background Watermark Image */}
              <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <img 
                  src={region.image} 
                  alt="" 
                  className="w-48 h-48 object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              {/* Hover Scanline Effect */}
              {!isSelected && (
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              )}

              {/* Selected Overlay Flash */}
              {isSelected && (
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-blue-400 mix-blend-overlay z-20"
                  />
              )}
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className={`w-16 h-12 rounded-lg overflow-hidden shadow-lg mb-4 border border-white/20 transform transition-transform duration-300 origin-left ${!selectedId && 'group-hover:scale-110 group-hover:border-blue-400/50'}`}>
                      <img 
                        src={region.image} 
                        alt={region.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isSelected && (
                       <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-[0_0_10px_#22c55e]"
                       >
                           <CheckCircle2 className="w-3 h-3 text-black" />
                       </motion.div>
                    )}
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/50 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                    >
                      <Loader2 className="w-3 h-3 animate-spin" />
                      INITIALIZING...
                    </motion.div>
                  )}
                </div>

                <div>
                  <h3 className={`text-2xl font-bold font-display transition-colors shadow-black drop-shadow-md flex items-center gap-2 ${isSelected ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}`}>
                    {region.name}
                    {isSelected && <Target className="w-5 h-5 animate-pulse text-blue-400" />}
                  </h3>
                  
                  <div className={`flex items-center gap-2 transition-colors mt-2 ${isSelected ? 'text-blue-200' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    <Trophy className={`w-4 h-4 ${!selectedId && 'group-hover:text-yellow-400 transition-colors'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('regional_prize')}</span>
                  </div>
                </div>
              </div>

              {/* Animated background gradient on hover */}
              <div 
                className={`absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-br from-blue-600/10 to-purple-600/20 ${!selectedId && 'group-hover:opacity-100'}`} 
              />
              
              {/* Scanline for selected state using Framer Motion */}
              {isSelected && (
                  <motion.div
                      initial={{ top: "-10%" }}
                      animate={{ top: "110%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-blue-400/20 to-transparent z-10 pointer-events-none"
                  />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};
