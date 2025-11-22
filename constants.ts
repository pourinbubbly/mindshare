
import { Region, RegionConfig } from './types';

const GLOBAL_MENTIONS = ['@base', '@carv_official'];

export const REGIONS: RegionConfig[] = [
  { 
    id: Region.TURKEY, 
    name: 'Turkey', 
    flag: '🇹🇷', 
    emoji: '🇹🇷', 
    image: 'https://flagcdn.com/w320/tr.png',
    color: '#ef4444',
    hashtags: ['#CarvMindshare', '#CarvTurkey', '#NexusTR'],
    mentions: [...GLOBAL_MENTIONS, '@Carv_TR']
  },
  { 
    id: Region.UKRAINE, 
    name: 'Ukraine', 
    flag: '🇺🇦', 
    emoji: '🇺🇦', 
    image: 'https://flagcdn.com/w320/ua.png',
    color: '#3b82f6',
    hashtags: ['#CarvMindshare', '#CarvUA', '#NexusUkraine'],
    mentions: [...GLOBAL_MENTIONS]
  },
  { 
    id: Region.RUSSIA, 
    name: 'Russia', 
    flag: '🇷🇺', 
    emoji: '🇷🇺', 
    image: 'https://flagcdn.com/w320/ru.png',
    color: '#ef4444',
    hashtags: ['#CarvMindshare', '#CarvRU', '#NexusRussia'],
    mentions: [...GLOBAL_MENTIONS, '@Carv_RU']
  },
  { 
    id: Region.JAPAN, 
    name: 'Japan', 
    flag: '🇯🇵', 
    emoji: '🇯🇵', 
    image: 'https://flagcdn.com/w320/jp.png',
    color: '#f472b6',
    hashtags: ['#CarvMindshare', '#CarvJP', '#NexusJapan'],
    mentions: [...GLOBAL_MENTIONS]
  },
  { 
    id: Region.KOREA, 
    name: 'Korea', 
    flag: '🇰🇷', 
    emoji: '🇰🇷', 
    image: 'https://flagcdn.com/w320/kr.png',
    color: '#3b82f6',
    hashtags: ['#CarvMindshare', '#CarvKR', '#NexusKorea'],
    mentions: [...GLOBAL_MENTIONS, '@CARV_KR']
  },
  { 
    id: Region.INDONESIA, 
    name: 'Indonesia', 
    flag: '🇮🇩', 
    emoji: '🇮🇩', 
    image: 'https://flagcdn.com/w320/id.png',
    color: '#ef4444',
    hashtags: ['#CarvMindshare', '#CarvID', '#NexusIndo'],
    mentions: [...GLOBAL_MENTIONS, '@CARV_IDN']
  },
  { 
    id: Region.PHILIPPINES, 
    name: 'Philippines', 
    flag: '🇵🇭', 
    emoji: '🇵🇭', 
    image: 'https://flagcdn.com/w320/ph.png',
    color: '#facc15',
    hashtags: ['#CarvMindshare', '#CarvPH', '#NexusPH'],
    mentions: [...GLOBAL_MENTIONS]
  },
  { 
    id: Region.PERSIA, 
    name: 'Persia', 
    flag: '🇮🇷', 
    emoji: '🇮🇷', 
    image: 'https://flagcdn.com/w320/ir.png',
    color: '#22c55e',
    hashtags: ['#CarvMindshare', '#CarvIR', '#NexusPersia'],
    mentions: [...GLOBAL_MENTIONS, '@CarvPersian']
  },
  { 
    id: Region.AFRICA, 
    name: 'Africa', 
    flag: '🌍', 
    emoji: '🌍', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_the_African_Union.svg/320px-Flag_of_the_African_Union.svg.png',
    color: '#fb923c',
    hashtags: ['#CarvMindshare', '#CarvAfrica', '#NexusAfrica'],
    mentions: [...GLOBAL_MENTIONS]
  },
];
