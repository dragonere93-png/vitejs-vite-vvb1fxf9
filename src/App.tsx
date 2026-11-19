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

  // Footer
  footerText: string;
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

  footerText: 'CaptionVibes · 18+ Adult Anime & Caption Hub',
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
const STORAGE_KEY = 'captionvibes_vertical_studio_v34';

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

  // Track unique site visit once per browser session
  useEffect(() => {
    try {
      const sessionKey = 'captionvibes_session_counted_v1';
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        setSiteViews((prev) => {
          const next = prev + 1;
          try {
            const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
            const prevObj = raw ? JSON.parse(raw) : {};
            localStorage.setItem(
              ANALYTICS_STORAGE_KEY,
              JSON.stringify({ ...prevObj, siteViews: next })
            );
          } catch {
            // ignore
          }
          return next;
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist clip views & likes whenever they change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const prevObj = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        ANALYTICS_STORAGE_KEY,
        JSON.stringify({ ...prevObj, siteViews, clips: clipStats })
      );
    } catch {
      // ignore
    }
  }, [siteViews, clipStats]);

  const trackVideoPlay = (clipId: string) => {
    const playedKey = `captionvibes_played_${clipId}`;
    try {
      if (sessionStorage.getItem(playedKey)) return;
      sessionStorage.setItem(playedKey, '1');
    } catch {
      // ignore
    }
    setClipStats((prev) => {
      const cur = prev[clipId] || { views: 0, likes: 0, liked: false };
      return {
        ...prev,
        [clipId]: { ...cur, views: cur.views + 1 },
      };
    });
  };

  const toggleClipLike = (clipId: string) => {
    setClipStats((prev) => {
      const cur = prev[clipId] || { views: 0, likes: 0, liked: false };
      const nextLiked = !cur.liked;
      return {
        ...prev,
        [clipId]: {
          ...cur,
          liked: nextLiked,
          likes: Math.max(0, cur.likes + (nextLiked ? 1 : -1)),
        },
      };
    });
  };
  const [iconError, setIconError] = useState<boolean>(false);
  const [bannerFallbackIdx, setBannerFallbackIdx] = useState<number>(0);
  const [bannerAllFailed, setBannerAllFailed] = useState<boolean>(false);

  // Notifications Toast states
  const [currentToast, setCurrentToast] = useState<SocialToastEvent>(() => createRandomToast());
  const [showToast, setShowToast] = useState<boolean>(true);
  const [toastDismissed, setToastDismissed] = useState<boolean>(false);

  // Studio Editor states
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [visitorPreview, setVisitorPreview] = useState<boolean>(false);
  const [editorTab, setEditorTab] = useState<EditorTab>('copy');
  const [editingTierId, setEditingTierId] = useState<string | null>('unlimited');
  const [copiedFlag, setCopiedFlag] = useState<boolean>(false);

  // Persist edits in localStorage when customizer is enabled
  useEffect(() => {
    if (!ENABLE_OWNER_CUSTOMIZER) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ config, vaultNumbers, previewClips, tiers, faqs })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [config, vaultNumbers, previewClips, tiers, faqs]);

  useEffect(() => {
    setIconError(false);
  }, [config.iconUrl]);

  useEffect(() => {
    setBannerFallbackIdx(0);
    setBannerAllFailed(false);
  }, [config.bannerUrl]);

  // Notifications cycle: visible 5.5s, hidden 12.5s
  useEffect(() => {
    if (!config.showNotifications || toastDismissed) return;
    let hideTimeout: number | undefined;
    let showTimeout: number | undefined;

    const scheduleNext = () => {
      hideTimeout = window.setTimeout(() => {
        setShowToast(false);
        showTimeout = window.setTimeout(() => {
          setCurrentToast((prev) => createRandomToast(prev.user));
          setShowToast(true);
          scheduleNext();
        }, 12500);
      }, 5500);
    };

    scheduleNext();
    return () => {
      if (hideTimeout !== undefined) window.clearTimeout(hideTimeout);
      if (showTimeout !== undefined) window.clearTimeout(showTimeout);
    };
  }, [config.showNotifications, toastDismissed]);

  const bannerCandidates = [
    config.bannerUrl,
    ...BANNER_FALLBACKS.filter((u) => u !== config.bannerUrl),
  ].filter(Boolean);
  const activeBannerSrc = bannerCandidates[bannerFallbackIdx] || '';

  const handleBannerError = () => {
    if (bannerFallbackIdx + 1 < bannerCandidates.length) {
      setBannerFallbackIdx((idx) => idx + 1);
    } else {
      setBannerAllFailed(true);
    }
  };

  const handleFileUpload = (file: File, field: 'iconUrl' | 'bannerUrl') => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        setConfig((prev) => ({ ...prev, [field]: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const safeClipIdx = featuredClipIdx < previewClips.length ? featuredClipIdx : 0;
  const featuredClip = previewClips[safeClipIdx];
  const progressPct = Math.min(100, Math.round((config.vipCurrent / Math.max(1, config.vipGoal)) * 100));
  const remainingVips = Math.max(0, config.vipGoal - config.vipCurrent);

  const openTabAndScroll = (tab: HubTab) => {
    setActiveTab(tab);
    window.setTimeout(() => {
      const el = document.getElementById('hub-tabs');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- EDITOR HELPERS ---
  const updateTier = (id: string, patch: Partial<PricingTier>) => {
    setTiers((prev) =>
      prev.map((t) => {
        if (patch.featured && t.id !== id) return { ...t, featured: false };
        return t.id === id ? { ...t, ...patch } : t;
      })
    );
  };

  const updateTierFeature = (tierId: string, featIdx: number, patch: Partial<TierFeature>) => {
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id !== tierId) return t;
        return {
          ...t,
          features: t.features.map((f, idx) => (idx === featIdx ? { ...f, ...patch } : f)),
        };
      })
    );
  };

  const addTierFeature = (tierId: string) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? { ...t, features: [...t.features, { text: 'New perk', included: true }] }
          : t
      )
    );
  };

  const removeTierFeature = (tierId: string, featIdx: number) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? { ...t, features: t.features.filter((_, idx) => idx !== featIdx) }
          : t
      )
    );
  };

  const handleResetAll = () => {
    setConfig(DEFAULT_CONFIG);
    setVaultNumbers(DEFAULT_VAULT_NUMBERS);
    setPreviewClips(DEFAULT_PREVIEW_CLIPS);
    setTiers(DEFAULT_PRICING_TIERS);
    setFaqs(DEFAULT_FAQS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const generateExportCode = () => {
    return `const DEFAULT_CONFIG: SiteConfig = ${JSON.stringify(config, null, 2)};

const DEFAULT_VAULT_NUMBERS: VaultNumber[] = ${JSON.stringify(vaultNumbers, null, 2)};

const DEFAULT_PREVIEW_CLIPS: PreviewClip[] = ${JSON.stringify(previewClips, null, 2)};

const DEFAULT_PRICING_TIERS: PricingTier[] = ${JSON.stringify(tiers, null, 2)};

const DEFAULT_FAQS: FaqItem[] = ${JSON.stringify(faqs, null, 2)};`;
  };

  const copyExportCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopiedFlag(true);
    window.setTimeout(() => setCopiedFlag(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0608] text-[#F5EFEF] font-sans antialiased selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* Clean Atmospheric Sunset Glow (melts naturally from the top banner) */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(220, 38, 38, 0.22) 0%, rgba(185, 28, 28, 0.09) 45%, rgba(10, 6, 8, 0) 80%)',
        }}
      />

      {/* HEADER — Compact & Mobile-Safe */}
      <header className="sticky top-0 z-40 bg-[#0A0608]/88 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <a href="#" className="flex items-center gap-2.5 min-w-0">
            <div
              className="relative w-10 h-10 rounded-full p-[1.5px] shrink-0 shadow-[0_0_16px_rgba(239,68,68,0.4)]"
              style={{ backgroundImage: 'linear-gradient(135deg, #F87171 0%, #DC2626 55%, #991B1B 100%)' }}
            >
              {config.iconUrl && !iconError ? (
                <img
                  src={config.iconUrl}
                  alt="CaptionVibes Official Icon"
                  onError={() => setIconError(true)}
                  className="w-full h-full rounded-full object-cover bg-[#150C0F]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#150C0F] flex items-center justify-center font-black text-xs text-red-400">
                  CV
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0608]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white truncate">
                  {config.brandPrefix}
                  <span className="text-red-400">{config.brandAccent}</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/35 shrink-0">
                  {config.ageBadge}
                </span>
              </div>
            </div>
          </a>

          <div className="flex items-center gap-4 shrink-0">
            <nav className="hidden sm:flex items-center gap-5 text-xs font-medium text-[#B8A8C0]">
              <button type="button" onClick={() => openTabAndScroll('vault')} className="hover:text-white transition cursor-pointer">
                Vault
              </button>
              <button type="button" onClick={() => openTabAndScroll('vip')} className="hover:text-white transition cursor-pointer">
                VIP
              </button>
              <button type="button" onClick={() => openTabAndScroll('promo')} className="hover:text-white transition cursor-pointer">
                Promo
              </button>
              <button type="button" onClick={() => scrollTo('faq')} className="hover:text-white transition cursor-pointer">
                FAQ
              </button>
            </nav>

            <a
              href={config.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#5865F2] hover:bg-[#4955D6] transition whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-[#5865F2]/25"
            >
              <span>Join Discord</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </header>

      {/* FULL-BLEED INTEGRATED BANNER (Melts seamlessly into the dark background) */}
      {config.showBanner && (
        <div className="relative z-10 w-full h-44 sm:h-56 md:h-64 overflow-hidden">
          {!bannerAllFailed && activeBannerSrc ? (
            <img
              src={activeBannerSrc}
              alt="CaptionVibes Official Banner"
              onError={handleBannerError}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-center px-4"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #1F090D 0%, #7F1D1D 42%, #DC2626 78%, #F87171 100%)',
              }}
            >
              <span className="text-2xl sm:text-4xl font-black tracking-[0.14em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
                CAPTIONVIBES
              </span>
            </div>
          )}
          {/* Top & Bottom smooth melt into #0A0608 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,6,8,0.5) 0%, rgba(10,6,8,0.05) 30%, rgba(10,6,8,0.4) 68%, #0A0608 100%)',
            }}
          />
          {/* Soft side vignettes on wide desktop screens */}
          <div
            className="pointer-events-none absolute inset-0 hidden sm:block"
            style={{
              background:
                'linear-gradient(90deg, #0A0608 0%, rgba(10,6,8,0) 18%, rgba(10,6,8,0) 82%, #0A0608 100%)',
            }}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* VERTICAL-FIRST MAIN COLUMN (MOBILE-NATIVE EXPERIENCE)                */}
      {/* ==================================================================== */}
      <main className={`relative z-10 max-w-3xl mx-auto px-4 pb-20 space-y-8 ${config.showBanner ? '-mt-10 sm:-mt-12' : 'pt-8'}`}>

        {/* 2. VERTICAL HERO BLOCK (Centered & Scannable on Phone) */}
        <section className="text-center space-y-5">
          {/* Classic Clean Live Metrics Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>{config.statDiscord}</span>
            </span>

            <span className="text-white/20">|</span>

            <span className="text-xs font-semibold text-slate-300">{config.statVault}</span>

            <span className="text-white/20">|</span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
              <Eye className="w-3.5 h-3.5" />
              <span>{siteViews.toLocaleString()} site views</span>
            </span>

            <span className="text-white/20">|</span>

            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <Crown className="w-3.5 h-3.5" />
              <span>{config.statVips}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-white max-w-2xl mx-auto">
            {config.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#BFB0C7] leading-relaxed max-w-xl mx-auto">
            {config.heroSubtitle}
          </p>

          {/* Vertical-friendly Full-width CTAs on Mobile, Side-by-side on Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1 max-w-md mx-auto">
            <a
              href={config.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-[#5865F2] hover:bg-[#4955D6] transition flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/30"
            >
              <span>{config.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => openTabAndScroll('vip')}
              className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-red-50 border border-red-500/45 hover:border-red-400/80 bg-[#1A0D10] hover:bg-[#261116] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{config.secondaryCtaText}</span>
            </button>
          </div>

          {/* Compact Giveaway Progress Bar */}
          <div className="max-w-md mx-auto pt-2 text-left bg-[#150B0E]/90 border border-white/[0.08] rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2 gap-2">
              <span className="text-[#D8C8DE] font-medium">{config.goalLabel}</span>
              <span className="text-red-400 font-bold shrink-0">
                {config.vipCurrent}/{config.vipGoal}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  backgroundImage: 'linear-gradient(90deg, #991B1B 0%, #DC2626 55%, #F87171 100%)',
                }}
              />
            </div>
            <p className="text-[11px] text-[#95849E] mt-1.5">
              {remainingVips} VIPs left to trigger the giveaway · {config.goalFooterNote}
            </p>
          </div>
        </section>

        {/* 3. 5-BUTTON HUB SWITCHER RIGHT BELOW HERO */}
        <section id="hub-tabs" className="space-y-6 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-[#150C0F] border border-white/[0.09] rounded-xl shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab('discord')}
              className={`py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'discord'
                  ? 'bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/35'
                  : 'text-[#C4B5BC] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>DISCORD</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vip')}
              style={
                activeTab === 'vip'
                  ? { backgroundImage: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)' }
                  : undefined
              }
              className={`py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'vip'
                  ? 'text-white shadow-md shadow-red-600/35'
                  : 'text-[#C4B5BC] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Crown className="w-4 h-4 shrink-0" />
              <span>VIP</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reddit')}
              className={`py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'reddit'
                  ? 'bg-[#FF4500] text-white shadow-md shadow-[#FF4500]/35'
                  : 'text-[#C4B5BC] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>REDDIT</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('promo')}
              style={
                activeTab === 'promo'
                  ? { backgroundImage: 'linear-gradient(90deg, #F59E0B 0%, #FACC15 100%)' }
                  : undefined
              }
              className={`py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'promo'
                  ? 'text-[#160B12] shadow-md shadow-amber-400/35'
                  : 'text-[#C4B5BC] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>PROMO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              style={
                activeTab === 'vault'
                  ? { backgroundImage: 'linear-gradient(90deg, #991B1B 0%, #DC2626 55%, #EF4444 100%)' }
                  : undefined
              }
              className={`col-span-2 sm:col-span-1 py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'vault'
                  ? 'text-white shadow-md shadow-red-600/35'
                  : 'text-[#C4B5BC] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Film className="w-4 h-4 shrink-0" />
              <span>VAULT</span>
            </button>
          </div>

          {/* TAB 1: DISCORD (Blue themed with blue outline) */}
          {activeTab === 'discord' && (
            <div className="rounded-2xl bg-gradient-to-br from-[#5865F2]/20 via-[#121329] to-[#0D0E1D] border-2 border-[#5865F2]/65 shadow-[0_0_40px_rgba(88,101,242,0.18)] p-5 sm:p-7 space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/45 text-xs font-semibold text-[#99A4FF]">
                  <Users className="w-3.5 h-3.5" />
                  {config.discordTabBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {config.discordTabTitle}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{config.discordTabSubtitle}</p>
                <div className="pt-1">
                  <a
                    href={config.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#5865F2] hover:bg-[#4955D6] shadow-lg shadow-[#5865F2]/35 transition inline-flex items-center justify-center gap-2"
                  >
                    <span>{config.discordTabCta}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[11px] text-[#99A4FF]/80 mt-2">{config.discordTabCtaSub}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t border-[#5865F2]/25">
                <div className="rounded-xl bg-[#0C0D1A]/85 border border-[#5865F2]/35 p-4 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#99A4FF]">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Free Weekly Drops</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Public full-length cuts, announcements, and uncensored previews that Reddit filters or buries.
                  </p>
                </div>
                <div className="rounded-xl bg-[#0C0D1A]/85 border border-[#5865F2]/35 p-4 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#99A4FF]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Community &amp; Polls</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Chat with 1,600+ fans, suggest ideas and themes, and vote in polls to shape upcoming videos.
                  </p>
                </div>
                <div className="rounded-xl bg-[#0C0D1A]/85 border border-[#5865F2]/35 p-4 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#99A4FF]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Zero Spam, Zero Pressure</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pick your own notification roles, browse freely, and upgrade to VIP only if and when you want more.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIP */}
          {activeTab === 'vip' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {config.vipTabTitle}
                </h2>
                <p className="text-sm text-[#B8A8C0] leading-relaxed max-w-xl mx-auto">
                  {config.vipTabSubtitle}
                </p>
              </div>

              {/* HIGH-VISIBILITY YELLOW WARNING BANNER */}
              <div className="rounded-2xl bg-yellow-400/15 border-2 border-yellow-400 p-4 sm:p-5 shadow-[0_0_32px_rgba(250,204,21,0.22)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 text-left">
                  <div className="w-11 h-11 rounded-xl bg-yellow-400/25 border border-yellow-400/60 flex items-center justify-center text-yellow-300 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm sm:text-base font-black uppercase tracking-wide text-yellow-300">
                      ⚠️ IMPORTANT: {config.vipReminderBold}!
                    </div>
                    <p className="text-xs sm:text-sm text-yellow-50/95 leading-relaxed">
                      You <strong className="text-white underline">must join the free Discord server BEFORE upgrading</strong> {config.vipReminderRest} Otherwise you&apos;ll need to DM me manually (10 min – 10 hours).
                    </p>
                  </div>
                  <a
                    href={config.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-yellow-400 hover:bg-yellow-300 text-[#140D05] shadow-lg shadow-yellow-400/25 transition flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Join Discord First</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Vertical-stacked on phone, clean 3-col on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`rounded-2xl p-5 flex flex-col justify-between transition ${
                      tier.featured
                        ? 'bg-[#1C0D12] border-2 border-red-500/75 shadow-[0_18px_50px_rgba(220,38,38,0.24)]'
                        : 'bg-[#150C0F] border border-white/[0.08]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <h3 className="text-base font-bold text-white">{tier.name}</h3>
                        {tier.featured && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundImage: 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)' }}
                          >
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1.5">
                          {tier.originalPrice && (
                            <span className="text-xs text-[#7E6D87] line-through">${tier.originalPrice}</span>
                          )}
                          <span className="text-3xl font-extrabold text-white tracking-tight">${tier.price}</span>
                          <span className="text-xs text-[#95849E]">/mo</span>
                        </div>
                        <p className="text-[11px] text-red-400 mt-1 font-medium">{tier.dailyNote}</p>
                        <p className="text-xs text-[#B2A1BC] mt-2 leading-relaxed">{tier.description}</p>
                      </div>

                      <ul className="space-y-2 text-xs mb-6 pt-4 border-t border-white/[0.07]">
                        {tier.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className={`flex items-center gap-2 ${
                              feat.included ? 'text-[#EAE1EE]' : 'text-[#63546C] line-through'
                            }`}
                          >
                            {feat.included ? (
                              <Check className={`w-3.5 h-3.5 shrink-0 ${tier.featured ? 'text-red-400' : 'text-[#B8A8C0]'}`} />
                            ) : (
                              <X className="w-3.5 h-3.5 shrink-0 text-[#594962]" />
                            )}
                            <span>{feat.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={tier.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        tier.featured
                          ? { backgroundImage: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)' }
                          : undefined
                      }
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5 ${
                        tier.featured
                          ? 'text-white hover:brightness-110 shadow-lg shadow-red-600/30'
                          : 'bg-white/[0.07] hover:bg-white/[0.12] text-white'
                      }`}
                    >
                      <span>{tier.ctaText}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REDDIT (Orange themed with orange outline) */}
          {activeTab === 'reddit' && (
            <div className="rounded-2xl bg-gradient-to-br from-[#FF4500]/20 via-[#1E1112] to-[#130A0C] border-2 border-[#FF4500]/65 shadow-[0_0_40px_rgba(255,69,0,0.18)] p-5 sm:p-7 space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4500]/20 border border-[#FF4500]/45 text-xs font-semibold text-[#FF8A5B]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Subreddit
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {config.redditTabTitle}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{config.redditTabSubtitle}</p>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href={config.redditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl text-sm font-semibold bg-[#FF4500] hover:bg-[#E03D00] text-white shadow-lg shadow-[#FF4500]/30 transition inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Open {config.redditLabel}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveTab('discord')}
                    className="px-5 py-3 rounded-xl text-sm font-semibold bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/15 transition cursor-pointer"
                  >
                    Go to Discord
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t border-[#FF4500]/25">
                <div className="rounded-xl bg-[#140B0C]/85 border border-[#FF4500]/35 p-4 space-y-1.5">
                  <h3 className="font-semibold text-[#FF9E75] text-sm">Daily Feed &amp; Teasers</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fresh concepts and short clips posted regularly for the Reddit community.
                  </p>
                </div>
                <div className="rounded-xl bg-[#140B0C]/85 border border-[#FF4500]/35 p-4 space-y-1.5">
                  <h3 className="font-semibold text-[#FF9E75] text-sm">Full Cuts on Discord</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Uncensored full-length versions and weekly drops live directly inside Discord.
                  </p>
                </div>
                <div className="rounded-xl bg-[#140B0C]/85 border border-[#FF4500]/35 p-4 space-y-1.5">
                  <h3 className="font-semibold text-[#FF9E75] text-sm">Optional VIP Archive</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Switch to the VIP tab after joining Discord if you want all 1,080+ videos and reels.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROMO (Yellow/Gold themed with yellow outline) */}
          {activeTab === 'promo' && (
            <div className="rounded-2xl bg-gradient-to-br from-amber-400/20 via-[#1D160E] to-[#130F09] border-2 border-amber-400/65 shadow-[0_0_40px_rgba(245,158,11,0.18)] p-5 sm:p-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/45 text-xs font-semibold text-amber-300">
                    <Zap className="w-3.5 h-3.5" />
                    Creator Sponsorships
                  </span>
                  <span className="text-xs font-bold text-amber-200 bg-amber-400/15 border border-amber-400/35 px-2.5 py-1 rounded-full">
                    {config.promoSlotPrice}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {config.promoTabTitle}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{config.promoTabSubtitle}</p>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href={config.promoCheckoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl text-sm font-bold text-[#160B12] shadow-lg shadow-amber-400/30 hover:brightness-105 transition inline-flex items-center justify-center gap-1.5"
                    style={{ backgroundImage: 'linear-gradient(90deg, #F59E0B 0%, #FACC15 100%)' }}
                  >
                    <span>Pay &amp; Lock Slot</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={config.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl text-sm font-semibold bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/15 transition text-center"
                  >
                    Ask on Discord First
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t border-amber-400/25">
                <div className="rounded-xl bg-[#151009]/85 border border-amber-400/35 p-4 space-y-1.5">
                  <h3 className="font-semibold text-amber-300 text-sm">1. Quality &amp; Vibe Fit</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your clip must match the hub&apos;s style, pacing, and rules. Off-theme clips can be declined before payment.
                  </p>
                </div>
                <div className="rounded-xl bg-[#151009]/85 border border-amber-400/35 p-4 space-y-1.5">
                  <h3 className="font-semibold text-amber-300 text-sm">2. Full Credits Included</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Published with clear credits to your creator name or agreed link in front of viewers already into this format.
                  </p>
                </div>
                <div className="rounded-xl bg-[#151009]/85 border border-amber-400/35 p-4 space-y-1.5">
                  <h3 className="font-semibold text-amber-300 text-sm">3. How Payment Works</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    DM me on Discord first with your clip for approval. Once approved, pay €20 via checkout to lock your slot.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VAULT (Red themed with red outline — Stats + Video Previews together) */}
          {activeTab === 'vault' && (
            <div className="rounded-2xl bg-gradient-to-br from-red-600/18 via-[#190B0E] to-[#110709] border-2 border-red-500/65 shadow-[0_0_40px_rgba(220,38,38,0.2)] p-5 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/45 text-xs font-semibold text-red-300">
                    <Film className="w-3.5 h-3.5" />
                    CaptionVibes Vault &amp; Previews
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Inside the Vault
                  </h2>
                </div>
                <a
                  href={config.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:brightness-110 transition inline-flex items-center justify-center gap-1.5 shrink-0"
                  style={{ backgroundImage: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 55%, #EF4444 100%)' }}
                >
                  <span>Full Vault on Discord</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Vault Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {vaultNumbers.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-[#12080A]/90 border border-red-500/35 p-3.5 text-center space-y-0.5"
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-[11px] font-semibold text-red-400">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.detail}</div>
                  </div>
                ))}
              </div>

              {/* Interactive Video Preview Player + Views & Likes */}
              <div className="rounded-2xl bg-[#0F0709] border border-red-500/30 overflow-hidden shadow-xl">
                <div className="aspect-video bg-black relative">
                  <video
                    key={featuredClip.src}
                    src={featuredClip.src}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    onPlay={() => trackVideoPlay(featuredClip.id)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base">{featuredClip.title}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300">
                          {featuredClip.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{featuredClip.note}</p>
                    </div>
                    <a
                      href={config.discordUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-red-400 hover:text-white transition whitespace-nowrap shrink-0 mt-0.5"
                    >
                      Full cut →
                    </a>
                  </div>

                  {/* Video Views Counter & Interactive Like Button */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-red-500/15">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Eye className="w-4 h-4 text-red-400" />
                      <span>
                        {(clipStats[featuredClip.id]?.views ?? 0).toLocaleString()} video views
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleClipLike(featuredClip.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 border transition cursor-pointer ${
                        clipStats[featuredClip.id]?.liked
                          ? 'bg-red-500/25 border-red-400 text-red-200 shadow-sm shadow-red-500/30'
                          : 'bg-white/[0.04] border-white/15 text-slate-200 hover:border-red-500/50 hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition ${
                          clipStats[featuredClip.id]?.liked ? 'fill-red-400 text-red-400 scale-110' : 'text-red-400'
                        }`}
                      />
                      <span>{(clipStats[featuredClip.id]?.likes ?? 0).toLocaleString()}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-red-500/20">
                    {previewClips.map((clip, idx) => {
                      const active = idx === safeClipIdx;
                      return (
                        <button
                          key={clip.id}
                          type="button"
                          onClick={() => setFeaturedClipIdx(idx)}
                          className={`px-3 py-2.5 rounded-lg text-left transition cursor-pointer flex items-center gap-2 ${
                            active
                              ? 'bg-red-500/20 text-white border border-red-500/60'
                              : 'bg-white/[0.03] text-slate-300 border border-transparent hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <Play className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-red-400' : 'opacity-50'}`} />
                          <span className="text-xs font-medium truncate">{clip.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 6. FAQ — Minimal Accordion */}
        <section id="faq" className="pt-4">
          <h2 className="text-xl font-bold text-white mb-4">FAQ</h2>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 font-medium text-sm sm:text-base text-white hover:text-red-400 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8E7D96] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 text-sm text-[#A897B2] leading-relaxed pr-6">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.07] py-7 px-4 text-xs text-[#8E7D96]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.iconUrl && !iconError && (
              <img src={config.iconUrl} alt="CaptionVibes" className="w-5 h-5 rounded-full object-cover" />
            )}
            <span>{config.footerText}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href={config.discordUrl} target="_blank" rel="noreferrer" className="hover:text-white transition">
              Discord
            </a>
            <a href={config.redditUrl} target="_blank" rel="noreferrer" className="hover:text-white transition">
              {config.redditLabel}
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING SOCIAL PROOF NOTIFICATIONS */}
      {config.showNotifications && !toastDismissed && (
        <div
          className={`fixed bottom-4 left-4 z-30 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[350px] bg-[#160B0F]/95 backdrop-blur-xl border border-red-500/40 rounded-2xl p-3.5 shadow-[0_14px_45px_rgba(0,0,0,0.85)] transition-all duration-500 ${
            showToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-5 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
              style={{
                backgroundImage: currentToast.isVip
                  ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 55%, #EF4444 100%)'
                  : 'linear-gradient(135deg, #5865F2 0%, #4348C6 100%)',
              }}
            >
              {currentToast.isVip ? (
                <Crown className="w-5 h-5 text-white" />
              ) : (
                <Users className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white truncate">{currentToast.user}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {currentToast.time}
                </span>
              </div>
              <p className="text-red-400 font-semibold text-xs leading-snug">{currentToast.action}</p>
              <p className="text-[11px] text-[#A897B2] truncate">{currentToast.note}</p>
            </div>
            <button
              type="button"
              onClick={() => setToastDismissed(true)}
              aria-label="Close notification"
              className="p-1 text-[#7E6D87] hover:text-white transition shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VISUAL STUDIO EDITOR                                                 */}
      {/* ==================================================================== */}
      {ENABLE_OWNER_CUSTOMIZER && (
        <div className="fixed bottom-4 right-4 z-50">
          {visitorPreview ? (
            <button
              type="button"
              onClick={() => setVisitorPreview(false)}
              title="Esci da Anteprima Visitatore"
              className="p-2.5 rounded-full bg-black/75 hover:bg-[#1B1226] text-[#B8A8C0] hover:text-white border border-white/15 backdrop-blur-md transition opacity-60 hover:opacity-100 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          ) : !showEditor ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVisitorPreview(true)}
                title="Nascondi editor per vedere come visitatore"
                className="p-2.5 rounded-full bg-[#150C0F]/95 hover:bg-[#241116] text-[#B8A8C0] hover:text-white border border-white/15 shadow-xl backdrop-blur-md transition cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowEditor(true)}
                className="px-4 py-2.5 rounded-full bg-[#150C0F]/95 hover:bg-[#241116] text-red-400 border border-red-500/40 shadow-2xl flex items-center gap-2 text-xs font-bold backdrop-blur-md transition cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Modifica Sito</span>
              </button>
            </div>
          ) : (
            <div className="w-[94vw] sm:w-[450px] max-h-[84vh] bg-[#140A0D]/98 backdrop-blur-xl border border-red-500/25 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.92)] flex flex-col overflow-hidden text-xs">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/35">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Settings className="w-4 h-4 text-red-400" />
                  <span>CaptionVibes Editor</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Auto-Saved
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    title="Ripristina tutto ai valori di default"
                    className="p-1.5 rounded-lg text-[#A897B2] hover:text-rose-400 hover:bg-white/5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    className="p-1.5 rounded-lg text-[#A897B2] hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editor Tabs */}
              <div className="grid grid-cols-6 border-b border-white/10 bg-black/25 text-[10px] font-bold">
                {(
                  [
                    { id: 'copy', label: 'Testi', icon: Type },
                    { id: 'media', label: 'Media', icon: ImageIcon },
                    { id: 'stats', label: 'Stats', icon: BarChart3 },
                    { id: 'tiers', label: 'VIP', icon: DollarSign },
                    { id: 'faq', label: 'FAQ', icon: MessageSquare },
                    { id: 'export', label: 'Esporta', icon: Copy },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = editorTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEditorTab(tab.id)}
                      className={`py-2.5 flex flex-col items-center gap-1 border-b-2 transition cursor-pointer ${
                        active
                          ? 'border-red-500 text-white bg-white/5'
                          : 'border-transparent text-[#9E8EA8] hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Editor Content */}
              <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
                {editorTab === 'copy' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#A897B2] mb-1">Brand Parte 1</label>
                        <input
                          type="text"
                          value={config.brandPrefix}
                          onChange={(e) => setConfig({ ...config, brandPrefix: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#A897B2] mb-1">Brand Colorata</label>
                        <input
                          type="text"
                          value={config.brandAccent}
                          onChange={(e) => setConfig({ ...config, brandAccent: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#A897B2] mb-1">Titolo Hero</label>
                      <input
                        type="text"
                        value={config.heroTitle}
                        onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#A897B2] mb-1">Sottotitolo Hero</label>
                      <textarea
                        rows={3}
                        value={config.heroSubtitle}
                        onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#A897B2] mb-1">Bottone Discord</label>
                        <input
                          type="text"
                          value={config.primaryCtaText}
                          onChange={(e) => setConfig({ ...config, primaryCtaText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#A897B2] mb-1">Bottone VIP</label>
                        <input
                          type="text"
                          value={config.secondaryCtaText}
                          onChange={(e) => setConfig({ ...config, secondaryCtaText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[10px] font-bold text-red-400 uppercase">Link Principali</label>
                      <input
                        type="text"
                        value={config.discordUrl}
                        onChange={(e) => setConfig({ ...config, discordUrl: e.target.value })}
                        placeholder="URL Discord"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.redditUrl}
                        onChange={(e) => setConfig({ ...config, redditUrl: e.target.value })}
                        placeholder="URL Reddit"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.promoCheckoutUrl}
                        onChange={(e) => setConfig({ ...config, promoCheckoutUrl: e.target.value })}
                        placeholder="URL Checkout Promo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>
                )}

                {editorTab === 'media' && (
                  <div className="space-y-3.5">
                    <div className="space-y-2.5">
                      <label className="block text-[10px] font-bold text-red-400 uppercase">Icona Ufficiale &amp; Banner GIF</label>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-[#A897B2]">Percorso Icona (es. /icon.jpg)</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={config.iconUrl}
                            onChange={(e) => setConfig({ ...config, iconUrl: e.target.value })}
                            className="flex-1 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                          />
                          <label className="px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500/35 text-red-300 font-bold cursor-pointer whitespace-nowrap">
                            Carica
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload(f, 'iconUrl');
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-[#A897B2]">Percorso Banner GIF (es. /banner.gif)</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={config.bannerUrl}
                            onChange={(e) => setConfig({ ...config, bannerUrl: e.target.value })}
                            className="flex-1 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                          />
                          <label className="px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500/35 text-red-300 font-bold cursor-pointer whitespace-nowrap">
                            Carica
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload(f, 'bannerUrl');
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <label className="flex items-center justify-between bg-black/35 border border-white/10 px-3 py-2 rounded-lg cursor-pointer">
                        <span className="text-white">Mostra Banner GIF in alto</span>
                        <input
                          type="checkbox"
                          checked={config.showBanner}
                          onChange={(e) => setConfig({ ...config, showBanner: e.target.checked })}
                          className="w-4 h-4 accent-red-500"
                        />
                      </label>

                      <label className="flex items-center justify-between bg-black/35 border border-white/10 px-3 py-2 rounded-lg cursor-pointer">
                        <span className="text-white">Mostra Notifiche Social Proof</span>
                        <input
                          type="checkbox"
                          checked={config.showNotifications}
                          onChange={(e) => {
                            setToastDismissed(false);
                            setConfig({ ...config, showNotifications: e.target.checked });
                          }}
                          className="w-4 h-4 accent-red-500"
                        />
                      </label>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2.5">
                      <label className="block text-[10px] font-bold text-red-400 uppercase">I 3 Video Preview</label>
                      {previewClips.map((clip, idx) => (
                        <div key={clip.id} className="bg-black/35 border border-white/10 rounded-xl p-2.5 space-y-1.5">
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              value={clip.title}
                              onChange={(e) =>
                                setPreviewClips((prev) =>
                                  prev.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c))
                                )
                              }
                              className="bg-black/60 border border-white/15 rounded px-2 py-1 text-white font-semibold"
                            />
                            <input
                              type="text"
                              value={clip.tag}
                              onChange={(e) =>
                                setPreviewClips((prev) =>
                                  prev.map((c, i) => (i === idx ? { ...c, tag: e.target.value } : c))
                                )
                              }
                              className="bg-black/60 border border-white/15 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <input
                            type="text"
                            value={clip.src}
                            onChange={(e) =>
                              setPreviewClips((prev) =>
                                prev.map((c, i) => (i === idx ? { ...c, src: e.target.value } : c))
                              )
                            }
                            placeholder="/video.mp4"
                            className="w-full bg-black/60 border border-white/15 rounded px-2 py-1 text-red-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editorTab === 'stats' && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-red-400 uppercase">Pillola Statistiche Hero</label>
                    <input
                      type="text"
                      value={config.statDiscord}
                      onChange={(e) => setConfig({ ...config, statDiscord: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      value={config.statVault}
                      onChange={(e) => setConfig({ ...config, statVault: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      value={config.statVips}
                      onChange={(e) => setConfig({ ...config, statVips: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                    />

                    <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#A897B2] mb-1">VIP Attuali</label>
                        <input
                          type="number"
                          value={config.vipCurrent}
                          onChange={(e) => setConfig({ ...config, vipCurrent: Number(e.target.value) })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#A897B2] mb-1">Obiettivo VIP</label>
                        <input
                          type="number"
                          value={config.vipGoal}
                          onChange={(e) => setConfig({ ...config, vipGoal: Number(e.target.value) })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[10px] font-bold text-red-400 uppercase">4 Numeri Vault</label>
                      {vaultNumbers.map((item, idx) => (
                        <div key={item.id} className="grid grid-cols-3 gap-1.5 bg-black/35 border border-white/10 p-2 rounded-lg">
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) =>
                              setVaultNumbers((prev) =>
                                prev.map((v, i) => (i === idx ? { ...v, value: e.target.value } : v))
                              )
                            }
                            className="bg-black/60 border border-white/15 rounded px-2 py-1 text-white font-bold"
                          />
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) =>
                              setVaultNumbers((prev) =>
                                prev.map((v, i) => (i === idx ? { ...v, label: e.target.value } : v))
                              )
                            }
                            className="col-span-2 bg-black/60 border border-white/15 rounded px-2 py-1 text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editorTab === 'tiers' && (
                  <div className="space-y-2.5">
                    {tiers.map((tier) => {
                      const isEditing = editingTierId === tier.id;
                      return (
                        <div
                          key={tier.id}
                          className={`bg-black/35 border rounded-xl overflow-hidden ${
                            tier.featured ? 'border-red-500/50' : 'border-white/10'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setEditingTierId(isEditing ? null : tier.id)}
                            className="w-full px-3 py-2.5 flex items-center justify-between text-left font-bold text-white cursor-pointer"
                          >
                            <span>
                              {tier.name} <span className="text-[#A897B2] font-normal">(${tier.price})</span>
                            </span>
                            {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {isEditing && (
                            <div className="p-3 pt-2 border-t border-white/10 space-y-2 bg-black/25">
                              <div className="grid grid-cols-3 gap-1.5">
                                <input
                                  type="text"
                                  value={tier.name}
                                  onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                                  className="bg-black/60 border border-white/15 rounded px-2 py-1 text-white font-semibold"
                                />
                                <input
                                  type="text"
                                  value={tier.price}
                                  onChange={(e) => updateTier(tier.id, { price: e.target.value })}
                                  className="bg-black/60 border border-white/15 rounded px-2 py-1 text-white"
                                />
                                <input
                                  type="text"
                                  value={tier.originalPrice}
                                  onChange={(e) => updateTier(tier.id, { originalPrice: e.target.value })}
                                  className="bg-black/60 border border-white/15 rounded px-2 py-1 text-white"
                                />
                              </div>
                              <input
                                type="text"
                                value={tier.checkoutUrl}
                                onChange={(e) => updateTier(tier.id, { checkoutUrl: e.target.value })}
                                className="w-full bg-black/60 border border-white/15 rounded px-2 py-1 text-red-400"
                              />
                              <div className="pt-1.5 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-[#A897B2] uppercase font-bold">Vantaggi</span>
                                  <button
                                    type="button"
                                    onClick={() => addTierFeature(tier.id)}
                                    className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Aggiungi
                                  </button>
                                </div>
                                {tier.features.map((f, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => updateTierFeature(tier.id, fIdx, { included: !f.included })}
                                      className={`p-1 rounded border cursor-pointer ${
                                        f.included
                                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                          : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                      }`}
                                    >
                                      {f.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    </button>
                                    <input
                                      type="text"
                                      value={f.text}
                                      onChange={(e) => updateTierFeature(tier.id, fIdx, { text: e.target.value })}
                                      className="flex-1 bg-black/60 border border-white/15 rounded px-2 py-1 text-white text-[11px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeTierFeature(tier.id, fIdx)}
                                      className="p-1 text-[#8E7D96] hover:text-rose-400 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {editorTab === 'faq' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-400 uppercase">Domande FAQ ({faqs.length})</span>
                      <button
                        type="button"
                        onClick={() => setFaqs((prev) => [...prev, { q: 'New question?', a: 'Answer here.' }])}
                        className="px-2.5 py-1 rounded-lg bg-red-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Aggiungi
                      </button>
                    </div>
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="bg-black/35 border border-white/10 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#A897B2] font-bold">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-[#8E7D96] hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) =>
                            setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, q: e.target.value } : f)))
                          }
                          className="w-full bg-black/60 border border-white/15 rounded px-2 py-1 text-white font-semibold"
                        />
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) =>
                            setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, a: e.target.value } : f)))
                          }
                          className="w-full bg-black/60 border border-white/15 rounded px-2 py-1 text-[#D8C8DE]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {editorTab === 'export' && (
                  <div className="space-y-3">
                    <p className="text-[#D8C8DE] leading-relaxed">
                      Quando sei pronto a rendere definitive le modifiche su GitHub:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[#A897B2]">
                      <li>Clicca <strong>Copia Configurazione</strong> qui sotto.</li>
                      <li>Incollala in <code className="text-red-400">src/App.tsx</code> al posto dei blocchi <code className="text-red-400">DEFAULT_*</code>.</li>
                      <li>Imposta <code className="text-emerald-400">ENABLE_OWNER_CUSTOMIZER = false</code> in riga 13.</li>
                    </ol>
                    <button
                      type="button"
                      onClick={copyExportCode}
                      className="w-full py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundImage: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)' }}
                    >
                      {copiedFlag ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedFlag ? 'Copiato negli appunti!' : 'Copia Configurazione Pronta'}</span>
                    </button>
                    <pre className="bg-black/70 border border-white/10 rounded-xl p-2.5 text-[10px] text-[#D8C8DE] max-h-40 overflow-auto font-mono">
                      {generateExportCode()}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
