import { useState, useEffect } from 'react';
import {
  Check, X, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, Play, Users,
  Crown, Sparkles, Zap, Gift, MessageSquare, Bell,
  Settings, EyeOff, RotateCcw, Copy, CheckCircle2,
  Type, BarChart3, DollarSign, Image as ImageIcon, Plus, Trash2, AlertTriangle, Film, Heart, Eye
} from 'lucide-react';

// ============================================================================
// IMPOSTA SU `false` QUANDO PUBBLICHI LA VERSIONE FINALE PER NASCONDERE L'EDITOR
// ============================================================================
const ENABLE_OWNER_CUSTOMIZER = true;

type HubTab = 'discord' | 'vip' | 'reddit' | 'promo' | 'vault';
type EditorTab = 'copy' | 'media' | 'stats' | 'tiers' | 'faq' | 'export';

interface SiteConfig {
  brandPrefix: string;
  brandAccent: string;
  ageBadge: string;
  iconUrl: string;
  bannerUrl: string;
  showBanner: boolean;
  showNotifications: boolean;

  // Live Stat Pill (Hero)
  statDiscord: string;
  statVault: string;
  statVips: string;

  // Hero Copy
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;

  // Giveaway Progress
  vipCurrent: number;
  vipGoal: number;
  goalLabel: string;
  goalFooterNote: string;

  // Links
  discordUrl: string;
  redditUrl: string;
  redditLabel: string;
  promoCheckoutUrl: string;

  // Discord Tab
  discordTabBadge: string;
  discordTabTitle: string;
  discordTabSubtitle: string;
  discordTabCta: string;
  discordTabCtaSub: string;

  // VIP Tab
  vipTabTitle: string;
  vipTabSubtitle: string;
  vipReminderBold: string;
  vipReminderRest: string;

  // Reddit Tab
  redditTabTitle: string;
  redditTabSubtitle: string;

  // Promo Tab
  promoSlotPrice: string;
  promoTabTitle: string;
  promoTabSubtitle: string;

  // Vault Tab Copy
  vaultTabBadge: string;
  vaultTabTitle: string;
  vaultTabCta: string;
  vaultFullCutLabel: string;
  vaultViewsSuffix: string;

  // Footer
  footerText: string;
  footerDiscordLabel: string;
}

interface VaultNumber {
  id: string;
  value: string;
  label: string;
  detail: string;
}

interface PreviewClip {
  id: string;
  title: string;
  tag: string;
  duration: string;
  src: string;
  note: string;
}

interface TierFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  dailyNote: string;
  description: string;
  ctaText: string;
  checkoutUrl: string;
  featured: boolean;
  features: TierFeature[];
}

interface FaqItem {
  q: string;
  a: string;
}

interface SocialToastEvent {
  user: string;
  action: string;
  time: string;
  note: string;
  isVip: boolean;
}

// --- DEFAULT DATA ---
const DEFAULT_CONFIG: SiteConfig = {
  brandPrefix: 'Caption',
  brandAccent: 'Vibes',
  ageBadge: '18+',
  iconUrl: '/icon.jpg',
  bannerUrl: '/banner.gif',
  showBanner: true,
  showNotifications: true,

  statDiscord: '1,600+ on Discord',
  statVault: '1,080+ content in vault',
  statVips: '84 VIPs',

  heroTitle: 'CAPTIONVIBES: Short and Long captioned videos',
  heroSubtitle:
    'Free full versions and weekly drops are posted in the Discord. If you want the entire private archive — quick edits, full long videos, and 900+ reels — VIP unlocks automatically in 5 seconds.',
  primaryCtaText: 'Join Free Discord',
  secondaryCtaText: 'View VIP Tiers',

  vipCurrent: 84,
  vipGoal: 100,
  goalLabel: '€50 giveaway (or 1 yr Unlimited) at 100 VIPs',
  goalFooterNote: '25% founding discount active',

  discordUrl: 'https://discord.gg/captionvibes',
  redditUrl: 'https://reddit.com/r/CaptionVibesHub',
  redditLabel: 'r/CaptionVibesHub',
  promoCheckoutUrl: 'https://upgrade.chat/captionvibes/p/captionvibespromo',

  discordTabBadge: 'Free Discord Community',
  discordTabTitle: '100% Free to Join',
  discordTabSubtitle:
    'You like my captions? You can find more caption videos in my Discord, both free and VIP. Every week I expand the free vault with exclusive quick videos, full-length uploads, and reels.',
  discordTabCta: 'Enter Discord Now',
  discordTabCtaSub: 'Instant invite · No card needed',

  vipTabTitle: 'VIP Vault Access',
  vipTabSubtitle:
    'Optional monthly plans to support daily uploads and unlock the full library. Discreet billing, cancel in two clicks.',
  vipReminderBold: 'Join the free Discord first',
  vipReminderRest: 'so the bot assigns your VIP role automatically in 5 seconds.',

  redditTabTitle: 'r/CaptionVibesHub',
  redditTabSubtitle:
    'Browse daily caption posts, teasers, and discussions on Reddit (7,760+ weekly visitors) — then jump into the free Discord server for full weekly drops and reels.',

  promoSlotPrice: '€20 / slot',
  promoTabTitle: 'Sponsored Caption Placements',
  promoTabSubtitle:
    'New to making captions and want visibility in front of an active audience (~14M total views, 1.5M+ weekly views across channels)? Submit your clip — I publish it with full credits to your name or link.',

  vaultTabBadge: 'CaptionVibes Vault & Previews',
  vaultTabTitle: 'Inside the Vault',
  vaultTabCta: 'Full Vault on Discord',
  vaultFullCutLabel: 'Full cut →',
  vaultViewsSuffix: 'video views',

  footerText: 'CaptionVibes · 18+ Adult Anime & Caption Hub',
  footerDiscordLabel: 'Discord',
};

const DEFAULT_VAULT_NUMBERS: VaultNumber[] = [
  { id: 'quick', value: '145+', label: 'Quick Videos', detail: 'Short, fast-paced edits' },
  { id: 'long', value: '42+', label: 'Full Long Videos', detail: 'Extended uncut stories' },
  { id: 'reels', value: '900+', label: 'CaptionVibes Reels', detail: 'Vertical private archive' },
  { id: 'daily', value: 'Daily', label: 'New Uploads', detail: 'Posted directly in Discord' },
];

const DEFAULT_PREVIEW_CLIPS: PreviewClip[] = [
  {
    id: 'bratty-roommate',
    title: 'Bratty Roommate',
    tag: 'Teasing',
    duration: '~1m',
    src: '/TEASER2(1).mp4',
    note: 'You had this gamer girl roommate; there was only one computer in the house, and after a long day at work, you just wanted to relax and play. Unfortunately, she wanted to use it too, by any means...',
  },
  {
    id: 'cheating-girlfriend',
    title: 'Cheating Girlfriend',
    tag: 'Cheating',
    duration: '~1m',
    src: '/CAPTIONVIBES - VIDEO 40 TRAILER(1).mp4',
    note: '"Baby I love you but, I can\'t have sex with you! You are too ugly and have such a small dick... you can watch me suck and ride your manly bully cock instead 😇"',
  },
  {
    id: 'nnn-challenge',
    title: 'NNN Challenge',
    tag: 'Interactive',
    duration: '~1m',
    src: '/SHORTVIDEO118(1).mp4',
    note: 'Interactive challenge: pick who you lose NNN to and see how long your streak survives when the pressure hits.',
  },
];

const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: 'supporter',
    name: 'Supporter',
    price: '3.99',
    originalPrice: '5.99',
    dailyNote: '$0.13 / day',
    description: 'Entry tier with VIP role and all 145+ Quick Videos.',
    ctaText: 'Get Supporter',
    checkoutUrl: 'https://upgrade.chat/1529327614362128474/p/captionvibes',
    featured: false,
    features: [
      { text: 'VIP role & private channels', included: true },
      { text: '145+ Quick Videos', included: true },
      { text: '42+ Full Long Videos', included: false },
      { text: '900+ CaptionVibes Reels', included: false },
      { text: 'Vote on upcoming videos', included: false },
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '9.99',
    originalPrice: '13.99',
    dailyNote: '$0.33 / day · Full archive',
    description: 'Everything in the vault — every long video, reel, quick cut, and community vote.',
    ctaText: 'Unlock Unlimited',
    checkoutUrl: 'https://upgrade.chat/1529327614362128474/p/2d165489-e89b-481b-82e0-d2bf1982dbf7',
    featured: true,
    features: [
      { text: 'VIP role & private channels', included: true },
      { text: '145+ Quick Videos', included: true },
      { text: '42+ Full Long Videos', included: true },
      { text: '900+ CaptionVibes Reels', included: true },
      { text: 'Vote on upcoming videos', included: true },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '6.99',
    originalPrice: '9.99',
    dailyNote: '$0.23 / day',
    description: 'Quick Videos plus the full library of 42+ Full Long Videos.',
    ctaText: 'Get Elite',
    checkoutUrl: 'https://upgrade.chat/1529327614362128474/p/40998f93-0851-4f70-a628-7400b3318b95',
    featured: false,
    features: [
      { text: 'VIP role & private channels', included: true },
      { text: '145+ Quick Videos', included: true },
      { text: '42+ Full Long Videos', included: true },
      { text: '900+ CaptionVibes Reels', included: false },
      { text: 'Vote on upcoming videos', included: false },
    ],
  },
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: 'Do I have to pay to join the Discord?',
    a: 'No. Joining the Discord server is completely free. You get public chat, weekly free full drops, quick teasers, and polls right away. VIP is optional.',
  },
  {
    q: 'How fast does my VIP role unlock?',
    a: 'About 5 seconds, as long as you join the free Discord server first. If you upgrade before joining, send me a DM on Discord and I will activate it manually (10 minutes to 10 hours).',
  },
  {
    q: 'Is billing discreet?',
    a: 'Yes. Your bank statement will not mention NSFW, Anime, or CaptionVibes — it appears as a standard digital subscription. No Reddit username required.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No lock-in contracts — you can cancel or change tier in two clicks whenever you want.',
  },
];

const RANDOM_NICKNAMES = [
  'DarkVibe_99', 'KawaiiHunter', 'NekoSenpai_', 'ShadowLurker', 'VoidWalker',
  'KuroNeko_', 'MidnightEcho', 'SoraVibes', 'NeonDrift', 'Riku_99',
  'VelvetPulse', 'Zed_x', 'LofiGhost', 'AstraKoi', 'Kaze_07',
  'PixelPhantom', 'NoxVibe', 'Hana_chan', 'CyberMochi', 'RoguePulse',
  'Akira_2k', 'Vexel_', 'Shiro_x', 'DriftKing_', 'Lumen_9',
  'KuroiSora', 'Taki_v', 'ZephyrX', 'Nyxx_', 'Kaito_44',
  'SableWolf', 'Yuki_01', 'Onyx_77', 'KiraVibe', 'Solstice_',
  'Rin_Senpai', 'DuskRider', 'Jett_98', 'NyxShadow', 'Sora_88',
  'MochiVibes', 'Valkyrie_', 'Kitsune_x', 'Aether_99', 'Riven_x',
  'Kage_V', 'NovaPulse', 'Aoi_x', 'Satoshi_', 'Yoru_x',
  'Nora_v', 'Siren_x', 'Haru_x', 'Zane_08', 'SoraKuro',
  'Amane_', 'Kazu_77', 'Yumi_v', 'Raiden_v', 'Nero_x', 'LunaDrift',
];

const SOCIAL_PROOF_TEMPLATES = [
  { action: 'joined the Free Discord', note: 'Came from r/CaptionVibesHub', isVip: false },
  { action: 'joined the Free Discord', note: 'Browsing free weekly drops', isVip: false },
  { action: 'unlocked Unlimited VIP', note: 'Instant 5s Discord role', isVip: true },
  { action: 'unlocked Unlimited VIP', note: 'Full 1,080+ video archive', isVip: true },
  { action: 'unlocked Elite VIP', note: 'Full Long Videos unlocked', isVip: true },
  { action: 'unlocked Supporter VIP', note: 'Upgraded after joining free chat', isVip: true },
];

const RECENT_TIMES = ['Just now', '1m ago', '2m ago', '4m ago', '6m ago', '9m ago', '12m ago'];

const createRandomToast = (prevUser?: string): SocialToastEvent => {
  let user = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
  if (user === prevUser) {
    user = RANDOM_NICKNAMES[(RANDOM_NICKNAMES.indexOf(user) + 1) % RANDOM_NICKNAMES.length];
  }
  const tpl = SOCIAL_PROOF_TEMPLATES[Math.floor(Math.random() * SOCIAL_PROOF_TEMPLATES.length)];
  const time = RECENT_TIMES[Math.floor(Math.random() * RECENT_TIMES.length)];
  return { user, action: tpl.action, time, note: tpl.note, isVip: tpl.isVip };
};

const BANNER_FALLBACKS = ['/banner.gif', '/standard(1).gif', '/banner.png', '/banner.jpg', '/standard(1).jpg'];
const GLOBAL_STATS_API_URL = 'https://captionvibes-api.dragonere93.workers.dev';
const STORAGE_KEY = 'captionvibes_vertical_studio_v36';

export default function App() {
  const loadSaved = () => {
    if (!ENABLE_OWNER_CUSTOMIZER) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = loadSaved();
    return saved?.config ? { ...DEFAULT_CONFIG, ...saved.config } : DEFAULT_CONFIG;
  });
  const [vaultNumbers, setVaultNumbers] = useState<VaultNumber[]>(() => {
    const saved = loadSaved();
    return Array.isArray(saved?.vaultNumbers) && saved.vaultNumbers.length > 0
      ? saved.vaultNumbers
      : DEFAULT_VAULT_NUMBERS;
  });
  const [previewClips, setPreviewClips] = useState<PreviewClip[]>(() => {
    const saved = loadSaved();
    return Array.isArray(saved?.previewClips) && saved.previewClips.length > 0
      ? saved.previewClips
      : DEFAULT_PREVIEW_CLIPS;
  });
  const [tiers, setTiers] = useState<PricingTier[]>(() => {
    const saved = loadSaved();
    return Array.isArray(saved?.tiers) && saved.tiers.length > 0
      ? saved.tiers
      : DEFAULT_PRICING_TIERS;
  });
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = loadSaved();
    return Array.isArray(saved?.faqs) && saved.faqs.length > 0
      ? saved.faqs
      : DEFAULT_FAQS;
  });

  // UI states
  const [featuredClipIdx, setFeaturedClipIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<HubTab>('discord');
  const [openFaq, setOpenFaq] = useState<number>(0);

  // Analytics & Likes (persistent locally + optional live Supabase/API endpoint)
  const ANALYTICS_STORAGE_KEY = 'captionvibes_analytics_v1';
  const [siteViews, setSiteViews] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.siteViews === 'number') return p.siteViews;
      }
    } catch {
      // ignore
    }
    return 1420;
  });

  const [clipStats, setClipStats] = useState<Record<string, { views: number; likes: number; liked: boolean }>>(() => {
    const defaults: Record<string, { views: number; likes: number; liked: boolean }> = {
      'bratty-roommate': { views: 618, likes: 94, liked: false },
      'cheating-girlfriend': { views: 842, likes: 137, liked: false },
      'nnn-challenge': { views: 529, likes: 78, liked: false },
    };
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.clips && typeof p.clips === 'object') {
          return { ...defaults, ...p.clips };
        }
      }
    } catch {
      // ignore
    }
    return defaults;
  });

  const syncGlobalStats = async (payload?: {
    type: 'site_view' | 'video_view' | 'toggle_like';
    clipId?: string;
    liked?: boolean;
  }) => {
    if (!GLOBAL_STATS_API_URL) return;
    try {
      const res = await fetch(GLOBAL_STATS_API_URL, {
        method: payload ? 'POST' : 'GET',
        headers: payload ? { 'Content-Type': 'application/json' } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
      });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.siteViews === 'number') {
        setSiteViews(data.siteViews);
      }
      if (data.clips && typeof data.clips === 'object') {
        setClipStats((prev) => {
          const merged = { ...prev };
          for (const [k, v] of Object.entries(data.clips as Record<string, { views?: number; likes?: number }>)) {
            const localCur = merged[k] || { views: 0, likes: 0, liked: false };
            merged[k] = {
              views: typeof v?.views === 'number' ? v.views : localCur.views,
              likes: typeof v?.likes === 'number' ? v.likes : localCur.likes,
              liked: localCur.liked,
            };
          }
          return merged;
        });
      }
    } catch {
      // Keep local fallback when offline or KV not bound yet
    }
  };

  // Track unique site visit once per browser session + sync with global KV worker
  useEffect(() => {
    let shouldIncrementSiteView = false;
    try {
      const sessionKey = 'captionvibes_session_counted_v1';
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        shouldIncrementSiteView = true;
      }
    } catch {
      shouldIncrementSiteView = true;
    }

    if (shouldIncrementSiteView) {
      setSiteViews((prev) => prev + 1);
      void syncGlobalStats({ type: 'site_view' });
    } else {
      void syncGlobalStats();
    }
  }, []);

  // Persist clip views & likes whenever they change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const prevObj = raw ? JSON.parse(raw) : {};
      localStorage.
