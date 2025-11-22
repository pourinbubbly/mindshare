
export enum Region {
  UKRAINE = 'Ukraine',
  TURKEY = 'Turkey',
  RUSSIA = 'Russia',
  AFRICA = 'Africa',
  KOREA = 'Korea',
  INDONESIA = 'Indonesia',
  PHILIPPINES = 'Philippines',
  JAPAN = 'Japan',
  PERSIA = 'Persia'
}

export type LanguageCode = 'en' | 'tr' | 'uk' | 'ru' | 'ja' | 'ko' | 'id' | 'fil' | 'fa';

export interface User {
  id: string;
  discordUsername: string;
  twitterHandle?: string;
  region: Region;
  mindshareScore: number;
  rank: number;
  avatarUrl: string;
  followersCount?: number; // Added for real data
}

export type ViewState = 'LANDING' | 'REGION_SELECT' | 'REGISTER' | 'LEADERBOARD';

export interface RegionConfig {
  id: Region;
  name: string;
  flag: string; // Short code or Emoji for list display
  emoji: string; // Full Emoji for background/visuals
  image: string; // URL for flag image
  color: string; // Tailwind color class equivalent hex
  hashtags: string[]; // Required hashtags for tracking
  mentions: string[]; // Required twitter handles (@)
}
