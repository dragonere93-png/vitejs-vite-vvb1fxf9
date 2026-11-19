import { useState, useEffect } from 'react';
import {
  Sparkles, Unlock, EyeOff, Flame, ShieldCheck, Zap,
  Check, X, Crown, Film, Clock, ChevronDown,
  ChevronUp, Settings, ExternalLink, ArrowRight,
  MessageSquare, Palette, Type, DollarSign,
  Copy, RotateCcw, Plus, Trash2, CheckCircle2,
  BarChart3, Clapperboard, Users, Bell, Gift, AlertTriangle
} from 'lucide-react';

// ============================================================================
// IMPOSTA SU `false` QUANDO PUBBLICHI IL SITO PER NASCONDERE IL CUSTOMIZER
// ============================================================================
const ENABLE_OWNER_CUSTOMIZER = false;

// --- THEME PRESETS ---
type ThemeKey = 'cyberpunk' | 'crimson' | 'ocean' | 'emerald' | 'gold';

interface ThemePalette {
  name: string;
  swatch: string;
  primaryText: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  buttonGradient: string;
  buttonShadow: string;
  borderGlow: string;
  hoverBorder: string;
  glowTop: string;
  glowBottom: string;
  barGradient: string;
}

const THEMES: Record<ThemeKey, ThemePalette> = {
  cyberpunk: {
    name: 'Cyberpunk Pink',
    swatch: 'from-pink-500 to-purple-600',
    primaryText: 'text-pink-500',
    accentText: 'text-pink-400',
    badgeBg: 'bg-pink-500/20',
    badgeBorder: 'border-pink-500/40',
    buttonGradient: 'from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500',
    buttonShadow: 'shadow-[0_0_35px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.65)]',
    borderGlow: 'border-pink-500',
    hoverBorder: 'hover:border-pink-500',
    glowTop: 'bg-pink-600',
    glowBottom: 'bg-purple-600',
    barGradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
  },
  crimson: {
    name: 'Crimson Heat',
    swatch: 'from-red-500 to-orange-600',
    primaryText: 'text-red-500',
    accentText: 'text-rose-400',
    badgeBg: 'bg-red-500/20',
    badgeBorder: 'border-red-500/40',
    buttonGradient: 'from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500',
    buttonShadow: 'shadow-[0_0_35px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.65)]',
    borderGlow: 'border-red-500',
    hoverBorder: 'hover:border-red-500',
    glowTop: 'bg-red-600',
    glowBottom: 'bg-orange-600',
    barGradient: 'from-red-500 via-rose-500 to-orange-500',
  },
  ocean: {
    name: 'Electric Cyan',
    swatch: 'from-cyan-400 to-blue-600',
    primaryText: 'text-cyan-400',
    accentText: 'text-sky-400',
    badgeBg: 'bg-cyan-500/20',
    badgeBorder: 'border-cyan-500/40',
    buttonGradient: 'from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
    buttonShadow: 'shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.65)]',
    borderGlow: 'border-cyan-400',
    hoverBorder: 'hover:border-cyan-400',
    glowTop: 'bg-cyan-500',
    glowBottom: 'bg-blue-600',
    barGradient: 'from-cyan-400 via-sky-500 to-blue-500',
  },
  emerald: {
    name: 'Neon Matrix',
    swatch: 'from-emerald-400 to-teal-600',
    primaryText: 'text-emerald-400',
    accentText: 'text-teal-400',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40',
    buttonGradient: 'from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500',
    buttonShadow: 'shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.65)]',
    borderGlow: 'border-emerald-400',
    hoverBorder: 'hover:border-emerald-400',
    glowTop: 'bg-emerald-500',
    glowBottom: 'bg-teal-600',
    barGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
  },
  gold: {
    name: 'Royal VIP Gold',
    swatch: 'from-amber-400 to-yellow-600',
    primaryText: 'text-amber-400',
    accentText: 'text-yellow-400',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/40',
    buttonGradient: 'from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
    buttonShadow: 'shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.65)]',
    borderGlow: 'border-amber-400',
    hoverBorder: 'hover:border-amber-400',
    glowTop: 'bg-amber-500',
    glowBottom: 'bg-orange-600',
    barGradient: 'from-amber-400 via-yellow-400 to-orange-500',
  }
};

// --- TYPES ---
interface StatBox {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  icon: 'zap' | 'film' | 'reels' | 'sparkles';
}

interface TierFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  badge: string;
  price: string;
  originalPrice: string;
  description: string;
  ctaText: string;
  checkoutUrl: string;
  isPopular: boolean;
  popularBanner: string;
  features: TierFeature[];
}

interface CommunityCard {
  id: string;
  title: string;
  description: string;
  icon: 'gift' | 'message' | 'bell';
}

interface FaqItem {
  q: string;
  a: string;
}

interface PreviewGifItem {
  id: string;
  title: string;
  tag: string;
  duration: string;
  gifUrl: string;
  note: string;
}

type HubSection = 'discord' | 'vip' | 'reddit' | 'promo';

const DEFAULT_PREVIEW_GIFS: PreviewGifItem[] = [
  {
    id: 'gif-quick',
    title: 'Bratty Roommate',
    tag: 'Teasing kink',
    duration: '~1m Clip',
    gifUrl: '/TEASER2(1).mp4',
    note: 'You had this gamer girl roommate; there was only one computer in the house, and after a long day at work, you just wanted to relax and play. Unfortunately, she wanted to use it too, by any means...'
  },
  {
    id: 'gif-reels',
    title: 'Cheating Girlfriend',
    tag: 'Cheating kink',
    duration: '~1m Clip',
    gifUrl: '/CAPTIONVIBES - VIDEO 40 TRAILER(1).mp4',
    note: '"Baby I love you but, I can\'t have sex with you! You are too ugly and have such a small dick... you can watch me suck and ride your manly bully cock instead 😇"'
  },
  {
    id: 'gif-long',
    title: 'NNN Challenge',
    tag: 'Interactive',
    duration: '~1m Clip',
    gifUrl: '/SHORTVIDEO118(1).mp4',
    note: 'Interactive challenge: pick who you lose NNN to and see how long your streak survives when the pressure hits.'
  }
];

interface SiteConfig {
  // Brand & Copy
  brandPrefix: string;
  brandAccent: string;
  brandBadge: string;
  brandSubtext: string;
  heroTitleStart: string;
  heroTitleHighlight: string;
  heroTitleEnd: string;
  heroSubtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;

  // Free Discord Community Section
  communityBadge: string;
  communityTitle: string;
  communitySubtitle: string;
  communityCtaText: string;
  communityCtaSubtext: string;
  discordMembersLabel: string;

  // Top Urgency Bar
  urgencyBadge: string;
  urgencyText: string;
  urgencyCtaText: string;
  showUrgencyTimer: boolean;

  // Vault Stats Title & Goal
  statsTitle: string;
  goalTitle: string;
  goalBonusText: string;

  // Pricing Section Header & Bottom Banner
  pricingBadge: string;
  pricingTitle: string;
  pricingSubtitle: string;
  bottomBannerTitle: string;
  bottomBannerSubtitle: string;
  bottomBannerCta: string;

  // Reddit Tab Copy
  redditBadge: string;
  redditTitle: string;
  redditSubtitle: string;
  redditCtaText: string;
  redditSecondaryCtaText: string;
  redditCard1Title: string;
  redditCard1Desc: string;
  redditCard2Title: string;
  redditCard2Desc: string;
  redditCard3Title: string;
  redditCard3Desc: string;

  // Sponsor / Promo Tab Copy (4th Tab)
  promoBadge: string;
  promoTitle: string;
  promoSubtitle: string;
  promoCtaText: string;
  promoSecondaryCtaText: string;
  promoPaymentUrl: string;
  promoRule1Title: string;
  promoRule1Desc: string;
  promoRule2Title: string;
  promoRule2Desc: string;
  promoRule3Title: string;
  promoRule3Desc: string;
  promoSlotPrice: string;
  promoWhyTitle: string;
  promoWhy1: string;
  promoWhy2: string;
  promoWhy3: string;
  promoPaymentNoteTitle: string;
  promoPaymentNoteDesc: string;

  // Warning Banner Copy (Join Discord First)
  warningTitle: string;
  warningBody: string;
  warningCtaText: string;

  // GIF Previews Header Copy
  gifSectionBadge: string;
  gifSectionTitle: string;
  gifSectionSubtitle: string;
  gifCardCtaText: string;

  // FAQ & Footer
  faqTitle: string;
  faqSubtitle: string;
  footerTagline: string;
  redditUrl: string;
  redditLabel: string;

  // Numbers & Links
  vipCount: number;
  vipGoal: number;
  weeklyVisitors: string;
  weeklyVisitorsSuffix: string;
  spotsLeft: number;
  discordInviteUrl: string;
  defaultCheckoutUrl: string;

  // Visuals & Layout
  theme: ThemeKey;
  glowOpacity: number;
  cardStyle: 'rounded' | 'sharp' | 'pill';
  showUrgencyBar: boolean;
  showSocialToast: boolean;
  showGoalBar: boolean;
  showStatsBanner: boolean;
  showCommunitySection: boolean;
  showFaqSection: boolean;
}

// --- DEFAULT DATA ---
const DEFAULT_CONFIG: SiteConfig = {
  "brandPrefix": "Caption",
  "brandAccent": "Vibes",
  "brandBadge": "Official Hub",
  "brandSubtext": "r/CaptionVibesHub Community & Discord",
  "heroTitleStart": "Join The Official ",
  "heroTitleHighlight": "CaptionVibes",
  "heroTitleEnd": " Discord Hub.",
  "heroSubtitle": "You like my captions? You can find some FULL versions in my discord for FREE! plus some quick videos and CaptionVibes Reels!",
  "primaryCtaText": "Join Free Discord Server",
  "secondaryCtaText": "See Optional VIP Tiers",
  "communityBadge": "Free Discord Community",
  "communityTitle": "100% Free to Join",
  "communitySubtitle": "You like my Captions? You can find more Caption Videos in my discord, both for free and premium! Every week I increase the free vault with Exclusive Quick Videos + FULL length videos + REELS! ",
  "communityCtaText": "Enter Discord Now",
  "communityCtaSubtext": "Instant invite • No credit card needed",
  "discordMembersLabel": "1600+ Discord Members",
  "urgencyBadge": "⚡ VIP DISCOUNT",
  "urgencyText": "Only 21 spots left for the 25% DISCOUNT!",
  "urgencyCtaText": "View Tiers",
  "showUrgencyTimer": false,
  "statsTitle": "CAPTIONVIBES CURRENT VAULT:",
  "goalTitle": "50€ GIVE-AWAY (or 1 year of CaptionVibes Unlimited)",
  "goalBonusText": "At 100 VIPs, I'll give in give-away 50€! (or 1 year of CaptionVibes Unlimited)",
  "pricingBadge": "VIP Upgrades",
  "pricingTitle": "CAPTIONVIBES ",
  "pricingSubtitle": "Want to support my daily work and get access to more content? choose your plan",
  "bottomBannerTitle": "discord link",
  "bottomBannerSubtitle": "click here to join the discord server",
  "bottomBannerCta": "Join Free Discord",
  "redditBadge": "Official Subreddit",
  "redditTitle": "r/CaptionVibesHub",
  "redditSubtitle": "Browse recent caption posts, community updates, and thread discussions on Reddit — then jump into the free Discord server for weekly full drops and reels.",
  "redditCtaText": "Open r/CaptionVibesHub",
  "redditSecondaryCtaText": "Go to Discord",
  "redditCard1Title": "Daily Feed & Teasers",
  "redditCard1Desc": "7760 weekly Reddit visitors discover captions here before moving over to the Discord hub.",
  "redditCard2Title": "Full Versions on Discord",
  "redditCard2Desc": "Reddit posts highlight concepts and quick previews while full uploads and weekly drops live in Discord.",
  "redditCard3Title": "Optional VIP Support",
  "redditCard3Desc": "Want the full vault and reels archive? Switch to the VIP tab after joining Discord first.",
  "promoBadge": "Creator Sponsorships",
  "promoTitle": "Sponsored Caption Placements",
  "promoSubtitle": "New to making captions and want visibility in front of an active audience? Submit your clip — I publish it with full credits to your name/link.",
  "promoCtaText": "Pay & Submit Promo",
  "promoSecondaryCtaText": "Ask on Discord First",
  "promoPaymentUrl": "https://upgrade.chat/captionvibes/p/captionvibespromo",
  "promoRule1Title": "1. Quality & Vibe Fit",
  "promoRule1Desc": "Your video must match the hub's style, pacing, and rules. Low-effort or off-theme clips can be declined with no hard feelings.",
  "promoRule2Title": "2. Full Credits Included",
  "promoRule2Desc": "I post your video and include clear credits for your creator name or agreed link so viewers know who made it.",
  "promoRule3Title": "3. Limited Slots & No Guaranteed Reach",
  "promoRule3Desc": "Slots are capped so the feed never feels spammy. Publication and credits are guaranteed; algorithm reach, views, or conversions vary.",
  "promoSlotPrice": "€20 / Slot",
  "promoWhyTitle": "Why €20 Can Be Worth It for a New Caption Creator",
  "promoWhy1": "Active Reach Instead of Zero: Skip the cold start with ~14M total views, 400k–1.5M weekly views, ~1,600 Discord members, and nearly 1,000 Reddit followers.",
  "promoWhy2": "Direct Credit & Visibility: Your video is published with clear credits to your creator name or agreed link in front of viewers already into this format.",
  "promoWhy3": "Low-Friction Test: A €20 single slot lets newer creators test audience reaction and style fit without locking into expensive campaigns or guessing alone.",
  "promoPaymentNoteTitle": "How Payment Works (€20 Single Slot)",
  "promoPaymentNoteDesc": "DM me on Discord first to send your clip and credits for approval. Once approved, pay €20 via the checkout link to lock your slot before I publish.",
  "warningTitle": "⚠️ IMPORTANT: Join the Discord Server FIRST!",
  "warningBody": "You must join our free Discord server BEFORE upgrading so the bot can assign your VIP role automatically in 5 seconds. If you purchase before joining, you'll need to DM me privately on Discord so I can activate it manually (which can take anywhere from 10 minutes to 10 hours).",
  "warningCtaText": "Join Discord First",
  "gifSectionBadge": "Caption Clips (~1m Video / GIF)",
  "gifSectionTitle": "Vault Sneak Peeks",
  "gifSectionSubtitle": "~1m caption previews & loops • Full drops in Discord",
  "gifCardCtaText": "Watch full version on Discord",
  "faqTitle": "FAQ",
  "faqSubtitle": "Most common questions I get in private",
  "footerTagline": "18+ Adult Anime & Caption Community",
  "redditUrl": "https://reddit.com/r/CaptionVibesHub",
  "redditLabel": "r/CaptionVibesHub",
  "vipCount": 84,
  "vipGoal": 100,
  "weeklyVisitors": "7760",
  "weeklyVisitorsSuffix": "Weekly Reddit Visitors",
  "spotsLeft": 0,
  "discordInviteUrl": "https://discord.gg/captionvibes",
  "defaultCheckoutUrl": "https://discord.gg/captionvibes",
  "theme": "crimson",
  "glowOpacity": 0,
  "cardStyle": "rounded",
  "showUrgencyBar": true,
  "showSocialToast": true,
  "showGoalBar": true,
  "showStatsBanner": true,
  "showCommunitySection": true,
  "showFaqSection": true
};

const DEFAULT_STATS: StatBox[] = [
  {
    "id": "quick",
    "value": "145+",
    "label": "Quick Videos",
    "sublabel": "Fast-pace instant dopamine",
    "icon": "zap"
  },
  {
    "id": "long",
    "value": "42+",
    "label": "Long Videos",
    "sublabel": "Full-length uncut videos",
    "icon": "film"
  },
  {
    "id": "reels",
    "value": "900+",
    "label": "CaptionVibes Reels",
    "sublabel": "Exclusive vertical archive",
    "icon": "reels"
  },
  {
    "id": "daily",
    "value": "Daily",
    "label": "Daily Uploads",
    "sublabel": "Fresh drops in Discord",
    "icon": "sparkles"
  }
];

const DEFAULT_TIERS: PricingTier[] = [
  {
    "id": "tier-supporter",
    "name": "CaptionVibes Supporter",
    "badge": "Entry Tier",
    "price": "3.99",
    "originalPrice": "5.99",
    "description": "Support the hub and unlock VIP role + Quick Videos.",
    "ctaText": "Unlock Supporter",
    "checkoutUrl": "https://upgrade.chat/1529327614362128474/p/captionvibes",
    "isPopular": false,
    "popularBanner": "",
    "features": [
      {
        "text": "VIP role",
        "included": true
      },
      {
        "text": "CaptionVibes Quick Videos",
        "included": true
      },
      {
        "text": "CaptionVibes Full Long Videos",
        "included": false
      },
      {
        "text": "CaptionVibes Reels",
        "included": false
      },
      {
        "text": "CaptionVibes Vote",
        "included": false
      }
    ]
  },
  {
    "id": "tier-unlimited",
    "name": "CaptionVibes Unlimited",
    "badge": "Best Value",
    "price": "9.99",
    "originalPrice": "13.99",
    "description": "Full all-access pass to every video, reel, and community vote.",
    "ctaText": "Unlock Unlimited",
    "checkoutUrl": "https://upgrade.chat/1529327614362128474/p/2d165489-e89b-481b-82e0-d2bf1982dbf7",
    "isPopular": true,
    "popularBanner": "MOST POPULAR • ALL-ACCESS",
    "features": [
      {
        "text": "VIP role",
        "included": true
      },
      {
        "text": "CaptionVibes Quick Videos",
        "included": true
      },
      {
        "text": "CaptionVibes Full Long Videos",
        "included": true
      },
      {
        "text": "CaptionVibes Reels",
        "included": true
      },
      {
        "text": "CaptionVibes Vote",
        "included": true
      }
    ]
  },
  {
    "id": "tier-elite",
    "name": "CaptionVibes Elite",
    "badge": "Mid Tier",
    "price": "6.99",
    "originalPrice": "9.99",
    "description": "Unlock Quick Videos plus the full archive of Full Long Videos.",
    "ctaText": "Unlock Elite",
    "checkoutUrl": "https://upgrade.chat/1529327614362128474/p/40998f93-0851-4f70-a628-7400b3318b95",
    "isPopular": false,
    "popularBanner": "",
    "features": [
      {
        "text": "VIP role",
        "included": true
      },
      {
        "text": "CaptionVibes Quick Videos",
        "included": true
      },
      {
        "text": "CaptionVibes Full Long Videos",
        "included": true
      },
      {
        "text": "CaptionVibes Reels",
        "included": false
      },
      {
        "text": "CaptionVibes Vote",
        "included": false
      }
    ]
  }
];

const DEFAULT_COMMUNITY_CARDS: CommunityCard[] = [
  {
    "id": "card-1",
    "title": "Free WEEKLY Teasers & Drops",
    "description": "Get free public uploads, announcements, and uncensored previews that Reddit filters or buries in the algorithm.",
    "icon": "gift"
  },
  {
    "id": "card-2",
    "title": "Active Community & Polls",
    "description": "Chat with other fans, share ideas, suggest themes, and vote in community polls to shape upcoming videos.",
    "icon": "message"
  },
  {
    "id": "card-3",
    "title": "First to Know, Zero Spam",
    "description": "Pick your own notification roles, browse at your own pace, and only upgrade to VIP if and when you want more.",
    "icon": "bell"
  }
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    "q": "Do I have to pay to join the Discord server?",
    "a": "Not at all! Joining the CaptionVibes Discord is 100% free. You get access to public chat, free teasers, community polls, and drop notifications immediately. Upgrading to a VIP tier is completely optional. Free tiers still get as much content as I can give as a singular person :)"
  },
  {
    "q": "How fast do I get my VIP role on Discord if I decide to upgrade?",
    "a": "Instantly! Our automated Discord bot connects directly to your checkout. Within 5 seconds of upgrading, your private VIP channels unlock automatically on your Discord account."
  },
  {
    "q": "Is the billing 100% discreet and private?",
    "a": "Yes. Your bank or card statement will never mention NSFW, Anime, or CaptionVibes. It appears as a generic digital software/community subscription. Your Reddit username is never required."
  },
  {
    "q": "Can I cancel or downgrade anytime?",
    "a": "100%. There are zero lock-in contracts. You can manage or cancel your subscription with two clicks at any time."
  }
];

const RANDOM_NICKNAMES = [
  'DarkVibe_99', 'KawaiiHunter', 'NekoSenpai_', 'ShadowLurker', 'VoidWalker',
  'KuroNeko_', 'MidnightEcho', 'SoraVibes', 'NeonDrift', 'Riku_99',
  'VelvetPulse', 'Zed_x', 'LofiGhost', 'AstraKoi', 'Kaze_07',
  'PixelPhantom', 'NoxVibe', 'Hana_chan', 'CyberMochi', 'RoguePulse',
  'Akira_2k', 'Vexel_', 'Shiro_x', 'DriftKing_', 'Lumen_9',
  'KuroiSora', 'Taki_v', 'MisoSoup_', 'ZephyrX', 'Nyxx_',
  'Kaito_44', 'SableWolf', 'Yuki_01', 'ViperNeon', 'Onyx_77',
  'KiraVibe', 'Echo_Zero', 'Solstice_', 'Rin_Senpai', 'DuskRider',
  'Fuyu_x', 'Jett_98', 'Kurogane', 'NyxShadow', 'PockyLover',
  'Sora_88', 'MochiVibes', 'Valkyrie_', 'Kitsune_x', 'Zenith_0',
  'Aether_99', 'Tora_kun', 'ChibiRogue', 'Vortex_x', 'NekoByte',
  'Hoshi_7', 'Kuro_23', 'Riven_x', 'Sylph_', 'Mika_09',
  'Kage_V', 'NovaPulse', 'Shiba_99', 'Aoi_x', 'Rei_04',
  'KuroVibe', 'Satoshi_', 'Yoru_x', 'Blitz_77', 'Nora_v',
  'Kenshin_', 'Luka_02', 'Siren_x', 'Mako_99', 'Haru_x',
  'Zane_08', 'Tsubasa_', 'KoiFish_', 'VibeCheck_', 'SoraKuro',
  'Riku_x', 'Amane_', 'Kazu_77', 'Nori_x', 'Shinji_01',
  'Yumi_v', 'FrostByte_', 'Kuroi_9', 'Tetsuo_x', 'Mina_05',
  'Raiden_v', 'Suki_88', 'Nero_x', 'KuroTsuki', 'Ryuu_07',
  'Aki_Vibes', 'ZeroShift', 'Hinata_x', 'KuroFox_', 'LunaDrift'
];

const SOCIAL_PROOF_TEMPLATES = [
  { action: 'joined the Free Discord', note: 'Came from r/CaptionVibesHub', isVip: false },
  { action: 'joined the Free Discord', note: 'Browsing free weekly drops', isVip: false },
  { action: 'upgraded to CaptionVibes Unlimited', note: 'Instant Discord Role assigned', isVip: true },
  { action: 'upgraded to CaptionVibes Unlimited', note: 'Unlocked the full uncut archive', isVip: true },
  { action: 'upgraded to CaptionVibes Elite', note: 'Unlocked Full Long Videos', isVip: true },
  { action: 'upgraded to CaptionVibes Supporter', note: 'After hanging out in free chat', isVip: true },
  { action: 'upgraded to CaptionVibes Unlimited', note: 'Got full access to every exclusive drop', isVip: true },
];

const RECENT_TIMES = ['Just now', '1m ago', '2m ago', '3m ago', '4m ago', '6m ago', '8m ago', '11m ago', '15m ago'];

interface SocialToastEvent {
  user: string;
  action: string;
  time: string;
  note: string;
  isVip: boolean;
}

const createRandomToast = (prevUser?: string): SocialToastEvent => {
  let user = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
  if (user === prevUser) {
    user = RANDOM_NICKNAMES[(RANDOM_NICKNAMES.indexOf(user) + 1) % RANDOM_NICKNAMES.length];
  }
  const tpl = SOCIAL_PROOF_TEMPLATES[Math.floor(Math.random() * SOCIAL_PROOF_TEMPLATES.length)];
  const time = RECENT_TIMES[Math.floor(Math.random() * RECENT_TIMES.length)];
  return { user, action: tpl.action, time, note: tpl.note, isVip: tpl.isVip };
};

const STORAGE_KEY = 'captionvibes_builder_state_v13';
const PREV_STORAGE_KEY = 'captionvibes_builder_state_v12';

export default function App() {
  const getRawSaved = () => {
    if (!ENABLE_OWNER_CUSTOMIZER) return null;
    try {
      return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(PREV_STORAGE_KEY);
    } catch {
      return null;
    }
  };

  function loadSavedObj<T extends Record<string, any>>(key: 'config', fallback: T): T {
    try {
      const raw = getRawSaved();
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed[key]) return fallback;
      const merged = { ...fallback, ...parsed[key] };
      // Ripulisce eventuali placeholder o stringhe vuote su campi nuovi
      for (const k of Object.keys(merged)) {
        if (typeof merged[k] === 'string' && (merged[k].startsWith('{config.') || merged[k].trim() === '')) {
          if (fallback[k]) merged[k] = fallback[k];
        }
      }
      return merged;
    } catch {
      return fallback;
    }
  }

  function loadSavedArr<T>(key: 'stats' | 'tiers' | 'faqs' | 'communityCards' | 'previewGifs', fallback: T[]): T[] {
    try {
      const raw = getRawSaved();
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed[key]) && parsed[key].length > 0 ? parsed[key] : fallback;
    } catch {
      return fallback;
    }
  }

  const [config, setConfig] = useState<SiteConfig>(() => loadSavedObj('config', DEFAULT_CONFIG));
  const [stats, setStats] = useState<StatBox[]>(() => loadSavedArr('stats', DEFAULT_STATS));
  const [tiers, setTiers] = useState<PricingTier[]>(() => {
    const loaded = loadSavedArr('tiers', DEFAULT_TIERS);
    return loaded.map((t) => ({
      ...t,
      ctaText: t.ctaText.replace(/^Join\s+/i, 'Unlock '),
    }));
  });
  const [communityCards, setCommunityCards] = useState<CommunityCard[]>(() => loadSavedArr('communityCards', DEFAULT_COMMUNITY_CARDS));
  const [faqs, setFaqs] = useState<FaqItem[]>(() => loadSavedArr('faqs', DEFAULT_FAQS));

  // UI States
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 19 });
  const [currentToast, setCurrentToast] = useState<SocialToastEvent>(() => createRandomToast());
  const [showToast, setShowToast] = useState(true);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<HubSection>('discord');
  const [previewGifs, setPreviewGifs] = useState<PreviewGifItem[]>(() => {
    const loaded = loadSavedArr('previewGifs', DEFAULT_PREVIEW_GIFS);
    const oldTitles = ['Quick Caption Teaser #01', 'CaptionVibes Reel Preview', 'Full Vault Sneak Peek'];
    const oldNotes = [
      'Fast-paced caption sample — full drop inside Discord.',
      'Vertical reel snippet — more drops weekly.',
      'Preview of uncut & extended caption edits.'
    ];
    return loaded.map((item, idx) => {
      const def = DEFAULT_PREVIEW_GIFS[idx] || DEFAULT_PREVIEW_GIFS[0];
      const nextTitle = (!item.title || oldTitles.includes(item.title)) ? def.title : item.title;
      const nextTag = (!item.tag || ['Quick Videos', 'Reels Archive', 'Long & VIP'].includes(item.tag)) ? def.tag : item.tag;
      const nextNote = (!item.note || oldNotes.includes(item.note) || item.note === 'Cheating girlfriend') ? def.note : item.note;
      return {
        ...def,
        ...item,
        title: nextTitle,
        tag: nextTag,
        note: nextNote,
        gifUrl: item.gifUrl || def.gifUrl,
      };
    });
  });

  // Customizer States
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [visitorPreview, setVisitorPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'copy' | 'stats' | 'tiers' | 'faq' | 'export'>('style');
  const [editingTierId, setEditingTierId] = useState<string | null>('tier-unlimited');
  const [copiedFlag, setCopiedFlag] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, stats, tiers, communityCards, previewGifs, faqs }));
    } catch {
      // Ignore storage quota errors
    }
  }, [config, stats, tiers, communityCards, faqs]);

  // Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Social Proof Ticker Rotation (Random Nicknames)
  useEffect(() => {
    const toastInterval = setInterval(() => {
      setShowToast(false);
      setTimeout(() => {
        setCurrentToast((prev) => createRandomToast(prev.user));
        setShowToast(true);
      }, 600);
    }, 6500);
    return () => clearInterval(toastInterval);
  }, []);

  const theme = THEMES[config.theme] || THEMES.crimson;
  const formatTime = (num: number) => String(num).padStart(2, '0');
  const progressPercentage = Math.min(100, Math.round((config.vipCount / Math.max(1, config.vipGoal)) * 100));

  const radiusCard = config.cardStyle === 'sharp' ? 'rounded-md' : config.cardStyle === 'pill' ? 'rounded-[2rem]' : 'rounded-2xl';
  const radiusBtn = config.cardStyle === 'sharp' ? 'rounded-md' : config.cardStyle === 'pill' ? 'rounded-full' : 'rounded-xl';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // --- COMMUNITY CARDS HELPER ---
  const updateCommunityCard = (id: string, patch: Partial<CommunityCard>) => {
    setCommunityCards(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
  };

  const renderCommunityCardIcon = (icon: CommunityCard['icon']) => {
    switch (icon) {
      case 'gift':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#99A4FF] mb-3">
            <Gift className="w-5 h-5" />
          </div>
        );
      case 'message':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      case 'bell':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
            <Bell className="w-5 h-5" />
          </div>
        );
    }
  };

  // --- STAT BOX HELPER ---
  const updateStat = (id: string, patch: Partial<StatBox>) => {
    setStats(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const renderStatIcon = (icon: StatBox['icon']) => {
    switch (icon) {
      case 'zap':
        return <Zap className={`w-6 h-6 ${theme.primaryText}`} />;
      case 'film':
        return <Film className="w-6 h-6 text-purple-400" />;
      case 'reels':
        return <Clapperboard className="w-6 h-6 text-fuchsia-400" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-emerald-400" />;
    }
  };

  const statColorClass = (icon: StatBox['icon']) => {
    switch (icon) {
      case 'zap':
        return theme.accentText;
      case 'film':
        return 'text-purple-400';
      case 'reels':
        return 'text-fuchsia-400';
      case 'sparkles':
      default:
        return 'text-emerald-400';
    }
  };

  // --- TIERS CRUD HELPERS ---
  const updateTier = (id: string, patch: Partial<PricingTier>) => {
    setTiers(prev =>
      prev.map(t => {
        if (patch.isPopular && t.id !== id) {
          return { ...t, isPopular: false };
        }
        return t.id === id ? { ...t, ...patch } : t;
      })
    );
  };

  const updateTierFeature = (tierId: string, featIdx: number, patch: Partial<TierFeature>) => {
    setTiers(prev =>
      prev.map(t => {
        if (t.id !== tierId) return t;
        const nextFeats = t.features.map((f, idx) => (idx === featIdx ? { ...f, ...patch } : f));
        return { ...t, features: nextFeats };
      })
    );
  };

  const addTierFeature = (tierId: string) => {
    setTiers(prev =>
      prev.map(t =>
        t.id === tierId
          ? { ...t, features: [...t.features, { text: 'New tier perk included', included: true }] }
          : t
      )
    );
  };

  const removeTierFeature = (tierId: string, featIdx: number) => {
    setTiers(prev =>
      prev.map(t =>
        t.id === tierId
          ? { ...t, features: t.features.filter((_, idx) => idx !== featIdx) }
          : t
      )
    );
  };

  const addNewTier = () => {
    const newId = `tier-${Date.now()}`;
    const newTier: PricingTier = {
      id: newId,
      name: 'New VIP Tier',
      badge: 'Custom Tier',
      price: '29.99',
      originalPrice: '',
      description: 'Describe what members unlock in this tier.',
      ctaText: 'Join New Tier',
      checkoutUrl: config.defaultCheckoutUrl,
      isPopular: false,
      popularBanner: '',
      features: [
        { text: 'Instant automated Discord Role', included: true },
        { text: 'Full access to exclusive uploads', included: true },
      ],
    };
    setTiers(prev => [...prev, newTier]);
    setEditingTierId(newId);
  };

  const deleteTier = (id: string) => {
    if (tiers.length <= 1) return;
    setTiers(prev => prev.filter(t => t.id !== id));
    if (editingTierId === id) setEditingTierId(null);
  };

  // --- FAQ CRUD HELPERS ---
  const updateFaq = (idx: number, patch: Partial<FaqItem>) => {
    setFaqs(prev => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  };

  const addFaq = () => {
    setFaqs(prev => [...prev, { q: 'New Question?', a: 'Write your answer here.' }]);
  };

  const deleteFaq = (idx: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleResetAll = () => {
    setConfig(DEFAULT_CONFIG);
    setStats(DEFAULT_STATS);
    setTiers(DEFAULT_TIERS);
    setCommunityCards(DEFAULT_COMMUNITY_CARDS);
    setPreviewGifs(DEFAULT_PREVIEW_GIFS);
    setFaqs(DEFAULT_FAQS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const generateExportCode = () => {
    return `// Sostituisci DEFAULT_CONFIG, DEFAULT_STATS, DEFAULT_TIERS e DEFAULT_COMMUNITY_CARDS in src/App.tsx:
const DEFAULT_CONFIG: SiteConfig = ${JSON.stringify(config, null, 2)};

const DEFAULT_STATS: StatBox[] = ${JSON.stringify(stats, null, 2)};

const DEFAULT_TIERS: PricingTier[] = ${JSON.stringify(tiers, null, 2)};

const DEFAULT_COMMUNITY_CARDS: CommunityCard[] = ${JSON.stringify(communityCards, null, 2)};

const DEFAULT_PREVIEW_GIFS: PreviewGifItem[] = ${JSON.stringify(previewGifs, null, 2)};

const DEFAULT_FAQS: FaqItem[] = ${JSON.stringify(faqs, null, 2)};`;
  };

  const copyExportCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopiedFlag(true);
    setTimeout(() => setCopiedFlag(false), 2500);
  };

  const gridColsClass =
    tiers.length === 1
      ? 'lg:grid-cols-1 max-w-md mx-auto'
      : tiers.length === 2
      ? 'lg:grid-cols-2 max-w-4xl mx-auto'
      : tiers.length === 4
      ? 'lg:grid-cols-4'
      : 'lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100 font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div
        className={`fixed top-[-15%] left-[-10%] w-[520px] h-[520px] rounded-full ${theme.glowTop} blur-[150px] pointer-events-none z-0 transition-all duration-500`}
        style={{ opacity: config.glowOpacity / 100 }}
      />
      <div
        className={`fixed bottom-[-15%] right-[-10%] w-[620px] h-[620px] rounded-full ${theme.glowBottom} blur-[160px] pointer-events-none z-0 transition-all duration-500`}
        style={{ opacity: config.glowOpacity / 100 }}
      />

      {/* 1. OPTIONAL STICKY TOP URGENCY BAR */}
      {config.showUrgencyBar && (
        <div className="sticky top-0 z-40 bg-[#0d0914]/95 backdrop-blur-md border-b border-white/10 px-3 py-2 text-xs sm:text-sm">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-2 text-center">
            <div className="flex items-center gap-2 font-medium">
              {config.urgencyBadge && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r ${theme.barGradient} text-white animate-pulse`}>
                  {config.urgencyBadge}
                </span>
              )}
              <span className="text-slate-200">{config.urgencyText}</span>
            </div>
            <div className="flex items-center gap-3">
              {config.showUrgencyTimer && (
                <div className={`flex items-center gap-1.5 bg-black/50 border ${theme.badgeBorder} px-2.5 py-1 rounded-md font-mono text-xs ${theme.accentText}`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
                </div>
              )}
              {config.urgencyCtaText && (
                <button
                  onClick={() => scrollToSection('pricing-section')}
                  className={`hidden md:inline-flex items-center gap-1 text-xs font-bold ${theme.accentText} hover:text-white transition`}
                >
                  {config.urgencyCtaText} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION HEADER */}
      <header className="relative z-20 max-w-6xl mx-auto px-4 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 ${radiusBtn} bg-gradient-to-tr ${theme.barGradient} p-0.5 shadow-lg`}>
            <div className={`w-full h-full bg-[#0c0c14] ${radiusBtn} flex items-center justify-center font-black text-lg bg-clip-text text-transparent bg-gradient-to-r ${theme.barGradient}`}>
              {(config.brandPrefix[0] || 'C')}{(config.brandAccent[0] || 'V')}
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#07070c] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                {config.brandPrefix}<span className={theme.primaryText}>{config.brandAccent}</span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.badgeBg} ${theme.accentText} border ${theme.badgeBorder}`}>
                {config.brandBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{config.brandSubtext}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {config.showCommunitySection && (
            <button
              type="button"
              onClick={() => { setActiveSection('discord'); scrollToSection('hub-tabs'); }}
              className="text-xs sm:text-sm text-slate-300 hover:text-white transition font-medium"
            >
              Discord
            </button>
          )}
          <button
            type="button"
            onClick={() => { setActiveSection('vip'); scrollToSection('hub-tabs'); }}
            className="text-xs sm:text-sm text-slate-300 hover:text-white transition font-medium"
          >
            VIP Tiers
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('reddit'); scrollToSection('hub-tabs'); }}
            className="hidden sm:inline-block text-xs sm:text-sm text-slate-300 hover:text-white transition font-medium"
          >
            Reddit
          </button>
          <a
            href={config.discordInviteUrl}
            target="_blank"
            rel="noreferrer"
            className={`px-4 py-2 ${radiusBtn} text-xs sm:text-sm font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center gap-1.5 shadow-lg shadow-[#5865F2]/25 transition`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Join Discord</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION (DISCORD-FIRST, ZERO PRESSURE) */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-20 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 shadow-inner">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {config.discordMembersLabel}
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            {config.weeklyVisitors} {config.weeklyVisitorsSuffix}
          </span>
          <span className="text-white/20">|</span>
          <span className={`flex items-center gap-1.5 text-xs font-semibold ${theme.accentText}`}>
            <Crown className="w-3.5 h-3.5" />
            {config.vipCount} VIPs
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6">
          {config.heroTitleStart}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-pink-300 to-amber-200 drop-shadow-[0_0_24px_rgba(244,63,94,0.35)]">
            {config.heroTitleHighlight}
          </span>
          {config.heroTitleEnd}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {config.heroSubtitle}
        </p>

        {/* Primary CTA = Join Free Discord | Secondary CTA = Optional VIP Tiers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href={config.discordInviteUrl}
            target="_blank"
            rel="noreferrer"
            className={`w-full sm:w-auto px-8 py-4 ${radiusBtn} font-black text-base sm:text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-[0_0_35px_rgba(88,101,242,0.45)] hover:shadow-[0_0_50px_rgba(88,101,242,0.7)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group`}
          >
            <Users className="w-5 h-5" />
            <span>{config.primaryCtaText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            type="button"
            onClick={() => { setActiveSection('vip'); scrollToSection('hub-tabs'); }}
            className={`w-full sm:w-auto px-7 py-4 ${radiusBtn} font-bold text-base bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 transition flex items-center justify-center gap-2`}
          >
            <Crown className={`w-5 h-5 ${theme.accentText}`} />
            <span>{config.secondaryCtaText}</span>
          </button>
        </div>

        {/* Community Milestone Progress Bar */}
        {config.showGoalBar && (
          <div className={`max-w-md mx-auto bg-[#11111a]/90 border border-white/10 ${radiusCard} p-4 shadow-xl`}>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                {config.goalTitle}
              </span>
              <span className={theme.accentText}>{config.vipCount} / {config.vipGoal} VIPs</span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div
                className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full transition-all duration-500 relative`}
                style={{ width: `${progressPercentage}%` }}
              >
                <span className="absolute right-1 top-0 bottom-0 w-2 bg-white/60 blur-[2px] animate-pulse" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-left">
              🎁 <strong className="text-slate-200">Next Goal Bonus:</strong> {config.goalBonusText}
            </p>
          </div>
        )}
      </section>

      {/* 3. SECTION SWITCHER: DISCORD | VIP | REDDIT */}
      <section id="hub-tabs" className="relative z-10 max-w-6xl mx-auto px-4 pt-2 pb-12">
        <div className="max-w-2xl mx-auto mb-10">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#10101b] border border-white/10 ${radiusCard} shadow-2xl`}>
            <button
              type="button"
              onClick={() => setActiveSection('discord')}
              className={`py-3 px-3 ${radiusBtn} font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                activeSection === 'discord'
                  ? 'bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>DISCORD</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('vip')}
              className={`py-3 px-3 ${radiusBtn} font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                activeSection === 'vip'
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-white shadow-lg`
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Crown className="w-4 h-4 shrink-0" />
              <span>VIP</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('reddit')}
              className={`py-3 px-3 ${radiusBtn} font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                activeSection === 'reddit'
                  ? 'bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>REDDIT</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('promo')}
              className={`py-3 px-3 ${radiusBtn} font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                activeSection === 'promo'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>PROMO</span>
            </button>
          </div>
        </div>

        {/* VAULT STATS ALWAYS ACCESSIBLE & COMPACT ABOVE ACTIVE TAB */}
        {config.showStatsBanner && (
          <div className="mb-10">
            <div className="text-center mb-4">
              <h3 className={`text-xs sm:text-sm font-black uppercase tracking-[0.2em] ${theme.accentText}`}>
                {config.statsTitle}
              </h3>
            </div>
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 ${radiusCard} p-3 sm:p-5 backdrop-blur-xl`}>
              {stats.map((box) => (
                <div key={box.id} className={`p-3.5 ${radiusBtn} bg-black/40 border border-white/5 text-center`}>
                  <div className="text-xl sm:text-3xl font-black text-white mb-1 flex items-center justify-center gap-1.5">
                    {renderStatIcon(box.icon)}
                    <span>{box.value}</span>
                  </div>
                  <div className={`text-xs font-bold ${statColorClass(box.icon)} uppercase tracking-wider`}>
                    {box.label}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{box.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: DISCORD HUB + 3-4s GIF PREVIEWS */}
        {activeSection === 'discord' && (
          <div id="community-section" className="space-y-10">
            {config.showCommunitySection && (
              <div className={`${radiusCard} bg-gradient-to-br from-[#5865F2]/15 via-[#11111e] to-[#0c0c16] border border-[#5865F2]/35 p-6 sm:p-8 shadow-2xl`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                  <div className="max-w-2xl">
                    {config.communityBadge && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#99A4FF] text-xs font-bold uppercase tracking-wider mb-3">
                        <Users className="w-3.5 h-3.5" /> {config.communityBadge}
                      </div>
                    )}
                    <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
                      {config.communityTitle}
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {config.communitySubtitle}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <a
                      href={config.discordInviteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full sm:w-auto px-7 py-4 ${radiusBtn} font-black text-base bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-[0_0_30px_rgba(88,101,242,0.4)] flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5`}
                    >
                      <span>{config.communityCtaText}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {config.communityCtaSubtext && (
                      <p className="text-[11px] text-slate-400 text-center mt-2">
                        {config.communityCtaSubtext}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {communityCards.map((card) => (
                    <div key={card.id} className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                      {renderCommunityCardIcon(card.icon)}
                      <h3 className="font-bold text-white text-base mb-1">{card.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-4s GIF / IMAGE PREVIEW STRIP */}
            <div className={`${radiusCard} bg-[#10101b] border border-white/10 p-6 sm:p-8`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${theme.accentText}`}>
                    {config.gifSectionBadge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {config.gifSectionTitle}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {config.gifSectionSubtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {previewGifs.map((item) => (
                  <div key={item.id} className={`${radiusCard} bg-black/45 border border-white/10 overflow-hidden flex flex-col`}>
                    <div className="aspect-video bg-[#171726] relative flex items-center justify-center border-b border-white/10 overflow-hidden">
                      {item.gifUrl ? (
                        /(\.(mp4|webm|ogg|mov)(\?.*)?$)|(^data:video\/)/i.test(item.gifUrl) ? (
                          <video
                            src={item.gifUrl}
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.gifUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="text-center p-4">
                          <Clapperboard className={`w-7 h-7 ${theme.accentText} mx-auto mb-1.5 opacity-80`} />
                          <div className="text-xs font-bold text-slate-300">{item.duration} Slot</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Put /clip1.mp4 or GIF URL</div>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/75 border border-white/10 text-[10px] font-bold text-white">
                        {item.tag}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-slate-300">
                        {item.duration}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1.5">
                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <span className={`text-[11px] font-bold ${theme.accentText}`}>
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.note}</p>
                      </div>
                      <a
                        href={config.discordInviteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-3 inline-flex items-center gap-1 text-xs font-bold ${theme.accentText} hover:text-white transition`}
                      >
                        <span>{config.gifCardCtaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIP TIERS + MANDATORY JOIN DISCORD FIRST WARNING */}
        {activeSection === 'vip' && (
          <div id="pricing-section" className="space-y-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${theme.accentText} mb-2`}>
                <Crown className="w-4 h-4" /> {config.pricingBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                {config.pricingTitle}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {config.pricingSubtitle}
              </p>
            </div>

            {/* IMPORTANT WARNING: JOIN DISCORD FIRST */}
            <div className={`max-w-4xl mx-auto ${radiusCard} bg-amber-500/10 border-2 border-amber-500/70 p-5 sm:p-6 shadow-[0_0_35px_rgba(245,158,11,0.18)]`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-amber-400 mb-1">
                    ⚠️ IMPORTANT: Join the Discord Server FIRST!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    You <strong className="text-white underline">must join our free Discord server BEFORE upgrading</strong> so the bot can assign your VIP role automatically in 5 seconds.
                    If you purchase before joining, you&apos;ll need to <strong className="text-amber-300">DM me privately on Discord</strong> so I can activate it manually (which can take anywhere from <strong className="text-white">10 minutes to 10 hours</strong>).
                  </p>
                </div>
                <a
                  href={config.discordInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full sm:w-auto px-5 py-3 ${radiusBtn} font-black text-xs sm:text-sm bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#5865F2]/30 transition`}
                >
                  <span>{config.warningCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Dynamic Paid Tiers Grid */}
            <div className={`grid grid-cols-1 ${gridColsClass} gap-6 items-stretch`}>
              {tiers.map((tier) => {
                const displayPrice = tier.price;

                return (
                  <div
                    key={tier.id}
                    className={`${radiusCard} p-6 sm:p-8 flex flex-col justify-between relative transition ${
                      tier.isPopular
                        ? `bg-gradient-to-b from-[#1d1128] via-[#130d1c] to-[#0d0a14] border-2 ${theme.borderGlow} shadow-2xl transform lg:-translate-y-2`
                        : 'bg-[#12121e] border border-white/15 hover:border-white/25'
                    }`}
                  >
                    {tier.isPopular && tier.popularBanner && (
                      <div className="absolute -top-4 inset-x-0 flex justify-center pointer-events-none">
                        <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${theme.barGradient} text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap`}>
                          <Flame className="w-3.5 h-3.5 fill-white" />
                          {tier.popularBanner}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className={`flex items-center justify-between gap-2 mb-4 ${tier.isPopular ? 'mt-2' : ''}`}>
                        <span className={`text-base font-black uppercase tracking-wider flex items-center gap-1.5 ${tier.isPopular ? theme.accentText : 'text-white'}`}>
                          {tier.isPopular && <Crown className={`w-5 h-5 ${theme.accentText} shrink-0`} />}
                          {tier.name}
                        </span>
                        {tier.badge && (
                          <span className={`px-2.5 py-1 rounded text-[11px] font-bold shrink-0 ${
                            tier.isPopular
                              ? `${theme.badgeBg} ${theme.accentText} border ${theme.badgeBorder}`
                              : 'bg-white/5 text-slate-300 border border-white/10'
                          }`}>
                            {tier.badge}
                          </span>
                        )}
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-2.5 flex-wrap">
                          {tier.originalPrice && (
                            <span className="text-lg font-bold text-slate-500 line-through">
                              ${tier.originalPrice}
                            </span>
                          )}
                          <span className={`${tier.isPopular ? 'text-5xl' : 'text-4xl'} font-black text-white`}>
                            ${displayPrice}
                          </span>
                          <span className="text-slate-400 text-sm">/ month</span>
                        </div>
                        <p className={`text-xs mt-2 ${tier.isPopular ? `${theme.accentText} font-medium` : 'text-slate-400'}`}>
                          {tier.description}
                        </p>
                      </div>

                      <ul className="space-y-3.5 text-sm mb-8">
                        {tier.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className={`flex items-start gap-2.5 ${
                              feat.included
                                ? tier.isPopular
                                  ? 'text-white font-medium'
                                  : 'text-slate-200'
                                : 'text-slate-500 line-through'
                            }`}
                          >
                            {feat.included ? (
                              tier.isPopular ? (
                                <div className={`p-0.5 rounded-full bg-gradient-to-r ${theme.barGradient} text-white shrink-0 mt-0.5`}>
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <Check className={`w-4 h-4 ${theme.accentText} shrink-0 mt-0.5`} />
                              )
                            ) : (
                              <X className="w-4 h-4 text-rose-500/70 shrink-0 mt-0.5" />
                            )}
                            <span>{feat.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <a
                        href={tier.checkoutUrl || config.defaultCheckoutUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full py-3.5 ${radiusBtn} font-black text-sm sm:text-base flex items-center justify-center gap-2 transition ${
                          tier.isPopular
                            ? `bg-gradient-to-r ${theme.buttonGradient} text-white ${theme.buttonShadow} transform hover:scale-[1.01]`
                            : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                        }`}
                      >
                        <Unlock className="w-4 h-4" />
                        <span>{tier.ctaText}</span>
                      </a>
                      {tier.isPopular && (
                        <p className="text-[11px] text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Instant automated Discord unlock • Cancel anytime
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Free Discord Banner Underneath Pricing */}
            <div className={`${radiusCard} bg-[#10101c] border border-[#5865F2]/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-11 h-11 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#99A4FF] shrink-0 hidden sm:flex">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">{config.bottomBannerTitle}</h4>
                  <p className="text-xs text-slate-400">{config.bottomBannerSubtitle}</p>
                </div>
              </div>
              <a
                href={config.discordInviteUrl}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-2.5 ${radiusBtn} font-bold text-xs sm:text-sm bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center gap-1.5 shrink-0 transition`}
              >
                <span>{config.bottomBannerCta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: REDDIT HUB */}
        {activeSection === 'reddit' && (
          <div id="reddit-section" className="space-y-8">
            <div className={`${radiusCard} bg-gradient-to-br from-[#FF4500]/15 via-[#11111e] to-[#0c0c16] border border-[#FF4500]/35 p-6 sm:p-8 shadow-2xl`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  {config.redditBadge && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4500]/20 border border-[#FF4500]/40 text-[#FF8A5B] text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5" /> {config.redditBadge}
                    </div>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
                    {config.redditTitle}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {config.redditSubtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href={config.redditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-6 py-4 ${radiusBtn} font-black text-sm sm:text-base bg-[#FF4500] hover:bg-[#E03D00] text-white shadow-lg shadow-[#FF4500]/30 flex items-center justify-center gap-2 transition`}
                  >
                    <span>{config.redditCtaText}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {config.redditSecondaryCtaText && (
                    <button
                      type="button"
                      onClick={() => setActiveSection('discord')}
                      className={`px-5 py-4 ${radiusBtn} font-bold text-sm bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 flex items-center justify-center gap-1.5 transition`}
                    >
                      <span>{config.redditSecondaryCtaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                <div className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                  <h3 className="font-bold text-white text-sm mb-1">{config.redditCard1Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.redditCard1Desc}
                  </p>
                </div>
                <div className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                  <h3 className="font-bold text-white text-sm mb-1">{config.redditCard2Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.redditCard2Desc}
                  </p>
                </div>
                <div className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                  <h3 className="font-bold text-white text-sm mb-1">{config.redditCard3Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.redditCard3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* TAB 4: SPONSORSHIP / PROMO RULES */}
        {activeSection === 'promo' && (
          <div id="promo-section" className="space-y-8">
            <div className={`${radiusCard} bg-gradient-to-br from-amber-500/15 via-[#11111e] to-[#0c0c16] border border-amber-500/35 p-6 sm:p-8 shadow-2xl`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  {config.promoBadge && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                      <Zap className="w-3.5 h-3.5" /> {config.promoBadge}
                    </div>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
                    {config.promoTitle}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {config.promoSubtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href={config.promoPaymentUrl || "https://upgrade.chat/captionvibes/p/captionvibespromo"}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-6 py-4 ${radiusBtn} font-black text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition`}
                  >
                    <span>{config.promoCtaText}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {config.promoSecondaryCtaText && (
                    <a
                      href={config.discordInviteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-5 py-4 ${radiusBtn} font-bold text-sm bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 flex items-center justify-center gap-1.5 transition`}
                    >
                      <span>{config.promoSecondaryCtaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                <div className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                  <h3 className="font-bold text-white text-sm mb-1">{config.promoRule1Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.promoRule1Desc}
                  </p>
                </div>
                <div className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                  <h3 className="font-bold text-white text-sm mb-1">{config.promoRule2Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.promoRule2Desc}
                  </p>
                </div>
                <div className={`bg-black/40 border border-white/10 p-5 ${radiusCard}`}>
                  <h3 className="font-bold text-white text-sm mb-1">{config.promoRule3Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.promoRule3Desc}
                  </p>
                </div>
              </div>

              <div className={`mt-6 ${radiusCard} bg-black/45 border border-white/10 p-5`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="font-black text-white text-sm sm:text-base">
                    {config.promoWhyTitle || DEFAULT_CONFIG.promoWhyTitle}
                  </h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black w-fit">
                    {config.promoSlotPrice || DEFAULT_CONFIG.promoSlotPrice}
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>• {config.promoWhy1 || DEFAULT_CONFIG.promoWhy1}</li>
                  <li>• {config.promoWhy2 || DEFAULT_CONFIG.promoWhy2}</li>
                  <li>• {config.promoWhy3 || DEFAULT_CONFIG.promoWhy3}</li>
                </ul>
              </div>

              <div className={`mt-5 ${radiusCard} bg-black/50 border border-amber-500/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div>
                  <h4 className="font-bold text-amber-300 text-sm mb-0.5">{config.promoPaymentNoteTitle}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{config.promoPaymentNoteDesc}</p>
                </div>
                <a
                  href={config.promoPaymentUrl || "https://upgrade.chat/captionvibes/p/captionvibespromo"}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-4 py-2.5 ${radiusBtn} font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 flex items-center justify-center gap-1.5 shrink-0 transition`}
                >
                  <span>{config.promoCtaText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. FAQ SECTION */}
      {config.showFaqSection && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
              {config.faqTitle}
            </h2>
            <p className="text-slate-400 text-sm">
              {config.faqSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`${radiusCard} bg-[#10101a] border border-white/10 overflow-hidden transition`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-white hover:opacity-80 transition"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? <ChevronUp className={`w-5 h-5 ${theme.accentText} shrink-0`} /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#050509] py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{config.brandPrefix}<span className={theme.primaryText}>{config.brandAccent}</span></span>
            <span>•</span>
            <span>{config.footerTagline}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={config.discordInviteUrl} target="_blank" rel="noreferrer" className="hover:text-white transition">Discord Server</a>
            <span>•</span>
            <a href={config.redditUrl} target="_blank" rel="noreferrer" className="hover:text-white transition">{config.redditLabel}</a>
          </div>
        </div>
      </footer>

      {/* LIVE SOCIAL PROOF FLOATING TOAST (BIGGER & HIGH VISIBILITY) */}
      {config.showSocialToast && (
        <div
          className={`fixed bottom-5 left-5 z-30 w-[calc(100vw-2.5rem)] max-w-[360px] sm:max-w-[420px] bg-[#131324]/95 backdrop-blur-xl border-2 ${theme.borderGlow} ${radiusCard} p-4 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.9)] transition-all duration-500 pointer-events-auto ${
            showToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${radiusBtn} bg-gradient-to-br ${theme.barGradient} flex items-center justify-center shrink-0 shadow-lg`}>
              {currentToast.isVip ? (
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              ) : (
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-black text-sm sm:text-base text-white truncate">{currentToast.user}</span>
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {currentToast.time}
                </span>
              </div>
              <p className={`${theme.accentText} font-bold text-xs sm:text-sm leading-snug`}>{currentToast.action}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1">{currentToast.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VISUAL STUDIO EDITOR (5 SCHEDE)                                      */}
      {/* ==================================================================== */}
      {ENABLE_OWNER_CUSTOMIZER && (
        <div className="fixed bottom-4 right-4 z-50">
          {visitorPreview ? (
            <button
              onClick={() => setVisitorPreview(false)}
              title="Exit Visitor Preview"
              className="p-2.5 rounded-full bg-black/70 hover:bg-slate-900 text-slate-400 hover:text-white border border-white/15 backdrop-blur-md transition opacity-50 hover:opacity-100"
            >
              <Settings className="w-4 h-4" />
            </button>
          ) : !showCustomizer ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisitorPreview(true)}
                title="Hide button to preview as visitor"
                className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 shadow-xl backdrop-blur-md transition"
              >
                <EyeOff className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCustomizer(true)}
                className={`px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 ${theme.accentText} border ${theme.badgeBorder} shadow-2xl flex items-center gap-2 text-xs font-bold backdrop-blur-md transition`}
              >
                <Settings className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Visual Studio Editor</span>
              </button>
            </div>
          ) : (
            <div className="w-[94vw] sm:w-[460px] max-h-[85vh] bg-[#0f0f1a]/98 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-xs">
              {/* Studio Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Settings className={`w-4 h-4 ${theme.accentText}`} />
                  <span>CaptionVibes Studio</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Auto-Saved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetAll}
                    title="Reset everything to default"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowCustomizer(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs (6 tabs) */}
              <div className="grid grid-cols-6 border-b border-white/10 bg-black/25 text-[10px] font-bold">
                {[
                  { id: 'style', label: 'Stile', icon: Palette },
                  { id: 'copy', label: 'Testi', icon: Type },
                  { id: 'stats', label: 'Stats', icon: BarChart3 },
                  { id: 'tiers', label: 'Tiers', icon: DollarSign },
                  { id: 'faq', label: 'FAQ', icon: MessageSquare },
                  { id: 'export', label: 'Esporta', icon: Copy },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`py-2.5 flex flex-col items-center gap-1 border-b-2 transition ${
                        active
                          ? `${theme.borderGlow} text-white bg-white/5`
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Area */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                {/* TAB 1: STYLE */}
                {activeTab === 'style' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">Tema Colore</label>
                      <div className="grid grid-cols-5 gap-2">
                        {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                          <button
                            key={key}
                            onClick={() => setConfig({ ...config, theme: key })}
                            className={`p-1.5 rounded-xl border text-center transition ${
                              config.theme === key ? 'border-white bg-white/10 scale-105' : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className={`w-full h-6 rounded-lg bg-gradient-to-r ${THEMES[key].swatch} mb-1`} />
                            <span className="text-[9px] font-semibold text-slate-300 block truncate">{THEMES[key].name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">Stile Bordi & Bottoni</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['sharp', 'rounded', 'pill'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => setConfig({ ...config, cardStyle: style })}
                            className={`py-2 rounded-lg border font-bold capitalize transition ${
                              config.cardStyle === style
                                ? `${theme.borderGlow} ${theme.badgeBg} text-white`
                                : 'border-white/10 bg-black/30 text-slate-400 hover:text-white'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-300 uppercase tracking-wider">Intensità Neon Sfondo</span>
                        <span className={theme.accentText}>{config.glowOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={40}
                        value={config.glowOpacity}
                        onChange={(e) => setConfig({ ...config, glowOpacity: Number(e.target.value) })}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">Mostra / Nascondi Sezioni</label>
                      <div className="space-y-2">
                        {[
                          { key: 'showUrgencyBar', label: 'Barra Urgenza in alto (Timer)' },
                          { key: 'showGoalBar', label: 'Barra Obiettivo VIP (Hero)' },
                          { key: 'showCommunitySection', label: 'Sezione "Free Discord Community"' },
                          { key: 'showStatsBanner', label: 'Sezione "CaptionVibes Current Vault"' },
                          { key: 'showFaqSection', label: 'Sezione FAQ in fondo' },
                          { key: 'showSocialToast', label: 'Popup Notifiche in basso a sinistra' },
                        ].map((toggle) => (
                          <label key={toggle.key} className="flex items-center justify-between bg-black/30 border border-white/5 px-3 py-2 rounded-lg cursor-pointer hover:border-white/15">
                            <span className="text-slate-200">{toggle.label}</span>
                            <input
                              type="checkbox"
                              checked={Boolean(config[toggle.key as keyof SiteConfig])}
                              onChange={(e) => setConfig({ ...config, [toggle.key]: e.target.checked })}
                              className="w-4 h-4 accent-pink-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: COPY */}
                {activeTab === 'copy' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Brand (Parte 1)</label>
                        <input
                          type="text"
                          value={config.brandPrefix}
                          onChange={(e) => setConfig({ ...config, brandPrefix: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Brand (Colorata)</label>
                        <input
                          type="text"
                          value={config.brandAccent}
                          onChange={(e) => setConfig({ ...config, brandAccent: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Badge Header</label>
                        <input
                          type="text"
                          value={config.brandBadge}
                          onChange={(e) => setConfig({ ...config, brandBadge: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Membri Discord (Badge)</label>
                        <input
                          type="text"
                          value={config.discordMembersLabel}
                          onChange={(e) => setConfig({ ...config, discordMembersLabel: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Sottotitolo Logo (Header)</label>
                      <input
                        type="text"
                        value={config.brandSubtext}
                        onChange={(e) => setConfig({ ...config, brandSubtext: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Barra in Alto (Urgency Bar)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Badge (es. ⚡ VIP BONUS)</label>
                          <input
                            type="text"
                            value={config.urgencyBadge}
                            onChange={(e) => setConfig({ ...config, urgencyBadge: e.target.value })}
                            className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Testo Link Destra</label>
                          <input
                            type="text"
                            value={config.urgencyCtaText}
                            onChange={(e) => setConfig({ ...config, urgencyCtaText: e.target.value })}
                            className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Testo Centrale Barra</label>
                        <input
                          type="text"
                          value={config.urgencyText}
                          onChange={(e) => setConfig({ ...config, urgencyText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <label className="flex items-center justify-between bg-black/30 border border-white/5 px-3 py-1.5 rounded-lg cursor-pointer">
                        <span className="text-[11px] text-slate-200">Mostra Timer (02:47:19)</span>
                        <input
                          type="checkbox"
                          checked={config.showUrgencyTimer}
                          onChange={(e) => setConfig({ ...config, showUrgencyTimer: e.target.checked })}
                          className="w-4 h-4 accent-pink-500"
                        />
                      </label>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Titolo Hero (3 parti)</label>
                      <input
                        type="text"
                        value={config.heroTitleStart}
                        onChange={(e) => setConfig({ ...config, heroTitleStart: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.heroTitleHighlight}
                        onChange={(e) => setConfig({ ...config, heroTitleHighlight: e.target.value })}
                        className="w-full bg-black/50 border border-pink-500/40 rounded-lg px-2.5 py-1.5 text-pink-300 font-bold"
                      />
                      <input
                        type="text"
                        value={config.heroTitleEnd}
                        onChange={(e) => setConfig({ ...config, heroTitleEnd: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Sottotitolo Hero</label>
                      <textarea
                        rows={3}
                        value={config.heroSubtitle}
                        onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Bottone Primario (Discord)</label>
                        <input
                          type="text"
                          value={config.primaryCtaText}
                          onChange={(e) => setConfig({ ...config, primaryCtaText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Bottone Secondario (VIP)</label>
                        <input
                          type="text"
                          value={config.secondaryCtaText}
                          onChange={(e) => setConfig({ ...config, secondaryCtaText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Sezione Free Discord</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.communityBadge}
                          onChange={(e) => setConfig({ ...config, communityBadge: e.target.value })}
                          placeholder="Badge (es. Free Discord Community)"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.communityCtaText}
                          onChange={(e) => setConfig({ ...config, communityCtaText: e.target.value })}
                          placeholder="Testo bottone Discord"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={config.communityTitle}
                        onChange={(e) => setConfig({ ...config, communityTitle: e.target.value })}
                        placeholder="Titolo sezione Discord"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={config.communitySubtitle}
                        onChange={(e) => setConfig({ ...config, communitySubtitle: e.target.value })}
                        placeholder="Descrizione sezione Discord"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.communityCtaSubtext}
                        onChange={(e) => setConfig({ ...config, communityCtaSubtext: e.target.value })}
                        placeholder="Testo sotto il bottone"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-300"
                      />

                      <div className="pt-2 space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">I 3 Riquadri Discord</label>
                        {communityCards.map((card, i) => (
                          <div key={card.id} className="bg-black/40 border border-white/10 rounded-xl p-2.5 space-y-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Riquadro #{i + 1}</div>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => updateCommunityCard(card.id, { title: e.target.value })}
                              placeholder="Titolo riquadro"
                              className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-white font-bold"
                            />
                            <textarea
                              rows={2}
                              value={card.description}
                              onChange={(e) => updateCommunityCard(card.id, { description: e.target.value })}
                              placeholder="Descrizione riquadro"
                              className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Link Invito Discord Gratis</label>
                      <input
                        type="text"
                        value={config.discordInviteUrl}
                        onChange={(e) => setConfig({ ...config, discordInviteUrl: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Intestazione Sezione Prezzi</label>
                      <input
                        type="text"
                        value={config.pricingBadge}
                        onChange={(e) => setConfig({ ...config, pricingBadge: e.target.value })}
                        placeholder="Badge (es. Optional VIP Upgrades)"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.pricingTitle}
                        onChange={(e) => setConfig({ ...config, pricingTitle: e.target.value })}
                        placeholder="Titolo Prezzi"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={config.pricingSubtitle}
                        onChange={(e) => setConfig({ ...config, pricingSubtitle: e.target.value })}
                        placeholder="Sottotitolo Prezzi"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Banner Discord Sotto i Prezzi</label>
                      <input
                        type="text"
                        value={config.bottomBannerTitle}
                        onChange={(e) => setConfig({ ...config, bottomBannerTitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.bottomBannerSubtitle}
                        onChange={(e) => setConfig({ ...config, bottomBannerSubtitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.bottomBannerCta}
                        onChange={(e) => setConfig({ ...config, bottomBannerCta: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Warning Banner (Join Discord First)</label>
                      <input
                        type="text"
                        value={config.warningTitle}
                        onChange={(e) => setConfig({ ...config, warningTitle: e.target.value })}
                        placeholder="Titolo Warning"
                        className="w-full bg-black/50 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold"
                      />
                      <textarea
                        rows={3}
                        value={config.warningBody}
                        onChange={(e) => setConfig({ ...config, warningBody: e.target.value })}
                        placeholder="Testo Warning"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        value={config.warningCtaText}
                        onChange={(e) => setConfig({ ...config, warningCtaText: e.target.value })}
                        placeholder="Testo bottone Warning"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Sezione GIF / Preview (3–4s)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.gifSectionBadge}
                          onChange={(e) => setConfig({ ...config, gifSectionBadge: e.target.value })}
                          placeholder="Badge sezione GIF"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.gifCardCtaText}
                          onChange={(e) => setConfig({ ...config, gifCardCtaText: e.target.value })}
                          placeholder="Testo link card GIF"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={config.gifSectionTitle}
                        onChange={(e) => setConfig({ ...config, gifSectionTitle: e.target.value })}
                        placeholder="Titolo sezione GIF"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                      <input
                        type="text"
                        value={config.gifSectionSubtitle}
                        onChange={(e) => setConfig({ ...config, gifSectionSubtitle: e.target.value })}
                        placeholder="Sottotitolo sezione GIF"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-300"
                      />
                      {previewGifs.map((g, gIdx) => (
                        <div key={g.id} className="bg-black/40 border border-white/10 rounded-xl p-2.5 space-y-1.5">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">GIF Card #{gIdx + 1}</div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={g.title}
                              onChange={(e) => setPreviewGifs(prev => prev.map((item, i) => i === gIdx ? { ...item, title: e.target.value } : item))}
                              placeholder="Titolo GIF"
                              className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white font-bold"
                            />
                            <input
                              type="text"
                              value={g.tag}
                              onChange={(e) => setPreviewGifs(prev => prev.map((item, i) => i === gIdx ? { ...item, tag: e.target.value } : item))}
                              placeholder="Tag"
                              className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={g.duration}
                              onChange={(e) => setPreviewGifs(prev => prev.map((item, i) => i === gIdx ? { ...item, duration: e.target.value } : item))}
                              placeholder="3s GIF"
                              className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-slate-300"
                            />
                            <input
                              type="text"
                              value={g.gifUrl}
                              onChange={(e) => setPreviewGifs(prev => prev.map((item, i) => i === gIdx ? { ...item, gifUrl: e.target.value } : item))}
                              placeholder="URL o /clip1.mp4 / /gif1.gif"
                              className="col-span-2 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-md transition">
                              <span>Carica GIF dal PC</span>
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,image/gif,image/webp,image/png,image/jpeg"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const result = typeof reader.result === 'string' ? reader.result : '';
                                    if (!result) return;
                                    setPreviewGifs(prev =>
                                      prev.map((item, i) =>
                                        i === gIdx ? { ...item, gifUrl: result } : item
                                      )
                                    );
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                            {g.gifUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewGifs(prev =>
                                    prev.map((item, i) => (i === gIdx ? { ...item, gifUrl: '' } : item))
                                  )
                                }
                                className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
                              >
                                Rimuovi
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={g.note}
                            onChange={(e) => setPreviewGifs(prev => prev.map((item, i) => i === gIdx ? { ...item, note: e.target.value } : item))}
                            placeholder="Descrizione GIF"
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-slate-300"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Tab Promo / Sponsorships</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.promoBadge}
                          onChange={(e) => setConfig({ ...config, promoBadge: e.target.value })}
                          placeholder="Badge Promo"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.promoTitle}
                          onChange={(e) => setConfig({ ...config, promoTitle: e.target.value })}
                          placeholder="Titolo Promo"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={config.promoSubtitle}
                        onChange={(e) => setConfig({ ...config, promoSubtitle: e.target.value })}
                        placeholder="Descrizione Promo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.promoCtaText}
                          onChange={(e) => setConfig({ ...config, promoCtaText: e.target.value })}
                          placeholder="Bottone Pagamento"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.promoSecondaryCtaText}
                          onChange={(e) => setConfig({ ...config, promoSecondaryCtaText: e.target.value })}
                          placeholder="Bottone secondario"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={config.promoPaymentUrl}
                        onChange={(e) => setConfig({ ...config, promoPaymentUrl: e.target.value })}
                        placeholder="Link Pagamento / Checkout"
                        className="w-full bg-black/50 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-amber-200"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={config.promoRule1Title}
                          onChange={(e) => setConfig({ ...config, promoRule1Title: e.target.value })}
                          placeholder="Regola 1 titolo"
                          className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-white"
                        />
                        <input
                          type="text"
                          value={config.promoRule2Title}
                          onChange={(e) => setConfig({ ...config, promoRule2Title: e.target.value })}
                          placeholder="Regola 2 titolo"
                          className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-white"
                        />
                        <input
                          type="text"
                          value={config.promoRule3Title}
                          onChange={(e) => setConfig({ ...config, promoRule3Title: e.target.value })}
                          placeholder="Regola 3 titolo"
                          className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={config.promoRule1Desc}
                        onChange={(e) => setConfig({ ...config, promoRule1Desc: e.target.value })}
                        placeholder="Regola 1 testo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.promoRule2Desc}
                        onChange={(e) => setConfig({ ...config, promoRule2Desc: e.target.value })}
                        placeholder="Regola 2 testo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.promoRule3Desc}
                        onChange={(e) => setConfig({ ...config, promoRule3Desc: e.target.value })}
                        placeholder="Regola 3 testo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.promoSlotPrice}
                        onChange={(e) => setConfig({ ...config, promoSlotPrice: e.target.value })}
                        placeholder="Prezzo slot (es. €20 / Slot)"
                        className="w-full bg-black/50 border border-amber-500/40 rounded-lg px-2.5 py-1 text-amber-300 font-bold"
                      />
                      <input
                        type="text"
                        value={config.promoWhyTitle}
                        onChange={(e) => setConfig({ ...config, promoWhyTitle: e.target.value })}
                        placeholder="Titolo box 'Perché €20'"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={config.promoWhy1}
                        onChange={(e) => setConfig({ ...config, promoWhy1: e.target.value })}
                        placeholder="Motivo 1"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <textarea
                        rows={2}
                        value={config.promoWhy2}
                        onChange={(e) => setConfig({ ...config, promoWhy2: e.target.value })}
                        placeholder="Motivo 2"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <textarea
                        rows={2}
                        value={config.promoWhy3}
                        onChange={(e) => setConfig({ ...config, promoWhy3: e.target.value })}
                        placeholder="Motivo 3"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.promoPaymentNoteTitle}
                        onChange={(e) => setConfig({ ...config, promoPaymentNoteTitle: e.target.value })}
                        placeholder="Titolo box pagamento"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={config.promoPaymentNoteDesc}
                        onChange={(e) => setConfig({ ...config, promoPaymentNoteDesc: e.target.value })}
                        placeholder="Spiegazione pagamento"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Tab Reddit</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.redditBadge}
                          onChange={(e) => setConfig({ ...config, redditBadge: e.target.value })}
                          placeholder="Badge Reddit"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.redditTitle}
                          onChange={(e) => setConfig({ ...config, redditTitle: e.target.value })}
                          placeholder="Titolo Reddit"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={config.redditSubtitle}
                        onChange={(e) => setConfig({ ...config, redditSubtitle: e.target.value })}
                        placeholder="Descrizione Reddit"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.redditCtaText}
                          onChange={(e) => setConfig({ ...config, redditCtaText: e.target.value })}
                          placeholder="Bottone Reddit"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.redditSecondaryCtaText}
                          onChange={(e) => setConfig({ ...config, redditSecondaryCtaText: e.target.value })}
                          placeholder="Bottone secondario"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={config.redditCard1Title}
                          onChange={(e) => setConfig({ ...config, redditCard1Title: e.target.value })}
                          placeholder="Card 1 titolo"
                          className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-white"
                        />
                        <input
                          type="text"
                          value={config.redditCard2Title}
                          onChange={(e) => setConfig({ ...config, redditCard2Title: e.target.value })}
                          placeholder="Card 2 titolo"
                          className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-white"
                        />
                        <input
                          type="text"
                          value={config.redditCard3Title}
                          onChange={(e) => setConfig({ ...config, redditCard3Title: e.target.value })}
                          placeholder="Card 3 titolo"
                          className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={config.redditCard1Desc}
                        onChange={(e) => setConfig({ ...config, redditCard1Desc: e.target.value })}
                        placeholder="Card 1 testo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.redditCard2Desc}
                        onChange={(e) => setConfig({ ...config, redditCard2Desc: e.target.value })}
                        placeholder="Card 2 testo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                      <input
                        type="text"
                        value={config.redditCard3Desc}
                        onChange={(e) => setConfig({ ...config, redditCard3Desc: e.target.value })}
                        placeholder="Card 3 testo"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">Footer & Reddit</label>
                      <input
                        type="text"
                        value={config.footerTagline}
                        onChange={(e) => setConfig({ ...config, footerTagline: e.target.value })}
                        placeholder="Testo Footer"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.redditLabel}
                          onChange={(e) => setConfig({ ...config, redditLabel: e.target.value })}
                          placeholder="Testo link Reddit"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          value={config.redditUrl}
                          onChange={(e) => setConfig({ ...config, redditUrl: e.target.value })}
                          placeholder="URL Reddit"
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: STATS */}
                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Membri Discord (Badge Hero)</label>
                      <input
                        type="text"
                        value={config.discordMembersLabel}
                        onChange={(e) => setConfig({ ...config, discordMembersLabel: e.target.value })}
                        className="w-full bg-black/50 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-emerald-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Titolo Sezione Vault (sopra ai 4 box)</label>
                      <input
                        type="text"
                        value={config.statsTitle}
                        onChange={(e) => setConfig({ ...config, statsTitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">VIP Attivi</label>
                        <input
                          type="number"
                          value={config.vipCount}
                          onChange={(e) => setConfig({ ...config, vipCount: Number(e.target.value) })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Obiettivo VIP</label>
                        <input
                          type="number"
                          value={config.vipGoal}
                          onChange={(e) => setConfig({ ...config, vipGoal: Number(e.target.value) })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Posti Rimasti</label>
                        <input
                          type="number"
                          value={config.spotsLeft}
                          onChange={(e) => setConfig({ ...config, spotsLeft: Number(e.target.value) })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Visite/Settimana (Numero)</label>
                        <input
                          type="text"
                          value={config.weeklyVisitors}
                          onChange={(e) => setConfig({ ...config, weeklyVisitors: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Etichetta Visite Reddit (es. Weekly Reddit Visitors)</label>
                        <input
                          type="text"
                          value={config.weeklyVisitorsSuffix}
                          onChange={(e) => setConfig({ ...config, weeklyVisitorsSuffix: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Titolo Barra Obiettivo</label>
                        <input
                          type="text"
                          value={config.goalTitle}
                          onChange={(e) => setConfig({ ...config, goalTitle: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Testo Bonus Obiettivo</label>
                        <input
                          type="text"
                          value={config.goalBonusText}
                          onChange={(e) => setConfig({ ...config, goalBonusText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2.5">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">I 4 Box Statistiche</label>
                      {stats.map((box, i) => (
                        <div key={box.id} className="bg-black/40 border border-white/10 rounded-xl p-2.5 space-y-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Box #{i + 1}</div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={box.value}
                              onChange={(e) => updateStat(box.id, { value: e.target.value })}
                              placeholder="Numero"
                              className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white font-bold"
                            />
                            <input
                              type="text"
                              value={box.label}
                              onChange={(e) => updateStat(box.id, { label: e.target.value })}
                              placeholder="Titolo"
                              className="col-span-2 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                            />
                          </div>
                          <input
                            type="text"
                            value={box.sublabel}
                            onChange={(e) => updateStat(box.id, { sublabel: e.target.value })}
                            placeholder="Sottotitolo"
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: PAID TIERS */}
                {activeTab === 'tiers' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase">Tiers a Pagamento ({tiers.length})</span>
                      <button
                        onClick={addNewTier}
                        className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${theme.barGradient} text-white font-bold flex items-center gap-1`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Aggiungi Tier
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {tiers.map((tier) => {
                        const isEditing = editingTierId === tier.id;
                        return (
                          <div key={tier.id} className={`bg-black/40 border rounded-xl overflow-hidden ${tier.isPopular ? theme.borderGlow : 'border-white/10'}`}>
                            <div className="flex items-center justify-between px-3 py-2.5">
                              <button
                                onClick={() => setEditingTierId(isEditing ? null : tier.id)}
                                className="text-left font-bold text-white flex items-center gap-2 flex-1 truncate pr-2"
                              >
                                {tier.isPopular && <Crown className={`w-3.5 h-3.5 ${theme.accentText} shrink-0`} />}
                                <span className="truncate">{tier.name}</span>
                                <span className="text-slate-400 font-normal">(${tier.price})</span>
                              </button>
                              <div className="flex items-center gap-1">
                                {tiers.length > 1 && (
                                  <button
                                    onClick={() => deleteTier(tier.id)}
                                    title="Elimina Tier"
                                    className="p-1 text-slate-400 hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingTierId(isEditing ? null : tier.id)}
                                  className="p-1 text-slate-400 hover:text-white"
                                >
                                  {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="p-3 pt-2 border-t border-white/10 space-y-2.5 bg-black/25">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Nome Tier</label>
                                    <input
                                      type="text"
                                      value={tier.name}
                                      onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Badge Etichetta</label>
                                    <input
                                      type="text"
                                      value={tier.badge}
                                      onChange={(e) => updateTier(tier.id, { badge: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Prezzo ($)</label>
                                    <input
                                      type="text"
                                      value={tier.price}
                                      onChange={(e) => updateTier(tier.id, { price: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Prezzo Barrato (opz.)</label>
                                    <input
                                      type="text"
                                      value={tier.originalPrice}
                                      onChange={(e) => updateTier(tier.id, { originalPrice: e.target.value })}
                                      placeholder="es. 34.99"
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-0.5">Descrizione</label>
                                  <input
                                    type="text"
                                    value={tier.description}
                                    onChange={(e) => updateTier(tier.id, { description: e.target.value })}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Testo Bottone</label>
                                    <input
                                      type="text"
                                      value={tier.ctaText}
                                      onChange={(e) => updateTier(tier.id, { ctaText: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Link Checkout</label>
                                    <input
                                      type="text"
                                      value={tier.checkoutUrl}
                                      onChange={(e) => updateTier(tier.id, { checkoutUrl: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>
                                </div>

                                <label className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 cursor-pointer">
                                  <span className="text-[11px] font-bold text-slate-200">Evidenzia come "Più Popolare"</span>
                                  <input
                                    type="checkbox"
                                    checked={tier.isPopular}
                                    onChange={(e) => updateTier(tier.id, { isPopular: e.target.checked, popularBanner: tier.popularBanner || 'MOST POPULAR' })}
                                    className="w-4 h-4 accent-pink-500"
                                  />
                                </label>

                                {tier.isPopular && (
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Testo Nastro in alto</label>
                                    <input
                                      type="text"
                                      value={tier.popularBanner}
                                      onChange={(e) => updateTier(tier.id, { popularBanner: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-white"
                                    />
                                  </div>
                                )}

                                <div className="pt-2 border-t border-white/10 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Vantaggi inclusi / esclusi</span>
                                    <button
                                      onClick={() => addTierFeature(tier.id)}
                                      className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                                    >
                                      <Plus className="w-3 h-3" /> Aggiungi riga
                                    </button>
                                  </div>

                                  {tier.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => updateTierFeature(tier.id, fIdx, { included: !feat.included })}
                                        title="Clicca per cambiare tra Incluso (✓) ed Escluso (✗)"
                                        className={`p-1 rounded border shrink-0 ${
                                          feat.included
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                            : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                        }`}
                                      >
                                        {feat.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                      </button>
                                      <input
                                        type="text"
                                        value={feat.text}
                                        onChange={(e) => updateTierFeature(tier.id, fIdx, { text: e.target.value })}
                                        className="flex-1 bg-black/60 border border-white/15 rounded px-2 py-1 text-[11px] text-white"
                                      />
                                      <button
                                        onClick={() => removeTierFeature(tier.id, fIdx)}
                                        className="p-1 text-slate-500 hover:text-rose-400 shrink-0"
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
                  </div>
                )}

                {/* TAB 5: FAQ */}
                {activeTab === 'faq' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={config.faqTitle}
                        onChange={(e) => setConfig({ ...config, faqTitle: e.target.value })}
                        placeholder="Titolo Sezione FAQ"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                      <input
                        type="text"
                        value={config.faqSubtitle}
                        onChange={(e) => setConfig({ ...config, faqSubtitle: e.target.value })}
                        placeholder="Sottotitolo FAQ"
                        className="w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-300"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-[11px] font-bold text-slate-300 uppercase">Domande ({faqs.length})</span>
                      <button
                        onClick={addFaq}
                        className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${theme.barGradient} text-white font-bold flex items-center gap-1`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Aggiungi FAQ
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/10 rounded-xl p-2.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">FAQ #{idx + 1}</span>
                            <button
                              onClick={() => deleteFaq(idx)}
                              className="p-1 text-slate-400 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={faq.q}
                            onChange={(e) => updateFaq(idx, { q: e.target.value })}
                            placeholder="Domanda"
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-white font-bold"
                          />
                          <textarea
                            rows={2}
                            value={faq.a}
                            onChange={(e) => updateFaq(idx, { a: e.target.value })}
                            placeholder="Risposta"
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: EXPORT */}
                {activeTab === 'export' && (
                  <div className="space-y-3">
                    <p className="text-slate-300 leading-relaxed">
                      Tutte le modifiche vengono salvate in automatico nel browser. Quando sei pronto a <strong>pubblicare la versione definitiva</strong>:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400">
                      <li>Clicca <strong>Copia Configurazione</strong> qui sotto.</li>
                      <li>Incollala in <code className="text-pink-300">src/App.tsx</code> al posto dei blocchi <code className="text-pink-300">DEFAULT_*</code>.</li>
                      <li>Imposta <code className="text-emerald-400">ENABLE_OWNER_CUSTOMIZER = false</code> in riga 13.</li>
                    </ol>

                    <button
                      onClick={copyExportCode}
                      className={`w-full py-2.5 rounded-xl font-black text-white bg-gradient-to-r ${theme.buttonGradient} flex items-center justify-center gap-2 shadow-lg`}
                    >
                      {copiedFlag ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedFlag ? 'Copiato negli appunti!' : 'Copia Configurazione Pronta'}</span>
                    </button>

                    <pre className="bg-black/70 border border-white/10 rounded-xl p-2.5 text-[10px] text-slate-300 max-h-40 overflow-auto font-mono">
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
