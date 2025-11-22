
import React from 'react';
import { motion } from 'framer-motion';
import { Region, RegionConfig } from '../types';
import { REGIONS } from '../constants';
import { Trophy } from 'lucide-react';

interface Props {
  onSelect: (region: Region) => void;
  t: (key: string) => string;
}

export const RegionSelector: React.FC<Props> = ({ onSelect, t }) => {
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
        {REGIONS.map((region) => (
          <motion.button
            key={region.id}
            variants={item}
            onClick={() => onSelect(region.id)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-48 glass-panel rounded-xl overflow-hidden p-6 text-left transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            {/* Background Watermark Image */}
            <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              <img 
                src={region.image} 
                alt="" 
                className="w-48 h-48 object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-16 h-12 rounded-lg overflow-hidden shadow-lg mb-4 border border-white/20 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                  <img 
                    src={region.image} 
                    alt={region.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-display text-white group-hover:text-blue-400 transition-colors shadow-black drop-shadow-md">
                  {region.name}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors mt-2">
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t('regional_prize')}</span>
                </div>
              </div>
            </div>

            {/* Animated background gradient on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-transparent to-blue-600" 
            />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
