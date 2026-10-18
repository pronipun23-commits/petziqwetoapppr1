import { useState, useEffect } from 'react';
import {
  MessageCircle, Heart, Send, Sparkles, Shield, AlertCircle,
  Trophy, Crown, Star, Flame, Users, Bell, Trash2, Pin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useUserProgress } from '@/hooks/useUserProgress';

interface CommunityPageProps {
  onNavigate: (path: string) => void;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_rank: string;
  sender_xp: number;
  is_admin: boolean;
  is_announcement?: boolean;
  content: string;
  likes: number;
  liked_by_me?: boolean;
  timestamp: string;
}

// Security Regex to scrub IP addresses, home street addresses, and phone numbers from public chats
const IP_REGEX = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
const ADDRESS_KEYWORDS = /\b(flat no|apartment|h\.no|house no|street|sector|lane|pincode|pin code|road no|nagar|colony|zip code)\b/i;

export function filterPrivateData(text: string): { clean: string; censored: boolean } {
  let censored = false;
  let clean = text;

  if (IP_REGEX.test(clean)) {
    clean = clean.replace(IP_REGEX, '[Private IP removed]');
    censored = true;
  }
  if (PHONE_REGEX.test(clean)) {
    // Only flag if 10+ digits without accidental small numbers
    const digitsOnly = clean.replace(/\D/g, '');
    if (digitsOnly.length >= 10) {
      clean = clean.replace(PHONE_REGEX, '[Private Phone removed]');
      censored = true;
    }
  }
  if (ADDRESS_KEYWORDS.test(clean)) {
    clean = clean.replace(ADDRESS_KEYWORDS, '[Address detail removed]');
    censored = true;
  }

  return { clean, censored };
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const { session, profile } = useAuth();
  const { isAdmin } = useAdmin();
  const { progress, checkAndAwardAchievements } = useUserProgress();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Compute User Rank based on XP
  const userRank =
    progress.xp >= 1000
      ? 'Master Companion'
      : progress.xp >= 500
      ? 'Expert Keeper'
      : progress.xp >= 100
      ? 'Rising Keeper'
      : 'Novice Companion';

  // Load community chat without fake dummy datasets
  useEffect(() => {
    try {
      const raw = localStorage.getItem('petziq_community_messages');
      if (raw) {
        const parsed: ChatMessage[] = JSON.parse(raw);
        // Clean out any historical dummy records
        const realMessages = parsed.filter(
          (m) => m.id !== 'msg-1' && m.id !== 'msg-2' && m.sender_name !== 'Aarav & Bruno' && m.sender_name !== 'Ananya & Luna'
        );
        setMessages(realMessages);
        localStorage.setItem('petziq_community_messages', JSON.stringify(realMessages));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setWarning(null);

    // Apply strict privacy filtering
    const { clean, censored } = filterPrivateData(inputText);

    if (censored) {
      setWarning('For your safety, phone numbers, IP addresses, or home street locations have been filtered.');
    }

    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender_id: session?.user?.id || 'anon',
      sender_name: profile?.full_name || 'Pet Companion',
      sender_rank: isAdmin ? 'Petziq Admin' : userRank,
      sender_xp: progress.xp,
      is_admin: Boolean(isAdmin),
      is_announcement: Boolean(isAdmin && isAnnouncement),
      content: clean,
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    const updated = [newMessage, ...messages];
    setMessages(updated);
    localStorage.setItem('petziq_community_messages', JSON.stringify(updated));

    // Award community milestone XP
    checkAndAwardAchievements({ community: 1 });

    setInputText('');
    setIsAnnouncement(false);
  };

  const handleLike = (id: string) => {
    const updated = messages.map((m) => {
      if (m.id === id) {
        const liked = !m.liked_by_me;
        return {
          ...m,
          liked_by_me: liked,
          likes: liked ? m.likes + 1 : Math.max(0, m.likes - 1),
        };
      }
      return m;
    });
    setMessages(updated);
    localStorage.setItem('petziq_community_messages', JSON.stringify(updated));
  };

  const handleDeleteMessage = (id: string) => {
    if (!isAdmin) return;
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('petziq_community_messages', JSON.stringify(updated));
  };

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300">
            <MessageCircle className="h-3.5 w-3.5" />
            Cozy Pet Companion Lounge
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-ink-50">
            Connect With Other Pet Lovers
          </h1>
          <p className="mt-2 text-sm text-ink-300 max-w-xl leading-relaxed">
            A warm, safe corner for pet keepers to share funny quirks, milestones, and care wisdom. Privacy secured with automated address and contact filters.
          </p>
        </div>

        {/* User Rank Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Your Community Rank</p>
            <p className="text-xs sm:text-sm font-bold text-ink-50">{userRank}</p>
            <p className="text-[10px] text-emerald-400 font-mono">{progress.xp} XP Earned</p>
          </div>
        </div>
      </div>

      {/* Warning Alert if privacy filter caught something */}
      {warning && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {/* Send Message Card */}
      <div className="mt-8 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 sm:p-6 shadow-soft">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Share a Story or Question
            </label>
            {isAdmin && (
              <label className="flex items-center gap-2 text-xs text-brand-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnnouncement}
                  onChange={(e) => setIsAnnouncement(e.target.checked)}
                  className="rounded border-white/20 bg-ink-800 text-brand-500"
                />
                <Pin className="h-3.5 w-3.5" />
                Post as Official Announcement
              </label>
            )}
          </div>

          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tell us about a funny thing your pet did today, or ask advice from fellow keepers..."
            className="input-field text-sm resize-none"
            required
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-ink-500 flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-400" />
              Auto-moderated for personal privacy
            </span>
            <button
              type="submit"
              className="btn-primary py-2.5 px-5 text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-ink-950 flex items-center gap-1.5 shadow-glow-blue"
            >
              <Send className="h-3.5 w-3.5" />
              Post Message
            </button>
          </div>
        </form>
      </div>

      {/* Messages Feed */}
      <div className="mt-10 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl border p-5 sm:p-6 transition ${
              msg.is_announcement
                ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shadow-lg'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
            }`}
          >
            {msg.is_announcement && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-3">
                <Pin className="h-3 w-3" /> Official Announcement
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-ink-950 ${
                  msg.is_admin ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-brand-400 to-teal-400'
                }`}>
                  {msg.sender_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink-50 text-sm">{msg.sender_name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      msg.is_admin
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/[0.05] text-ink-300 border-white/10'
                    }`}>
                      {msg.sender_rank}
                    </span>
                    {!msg.is_admin && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        {msg.sender_xp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-ink-500 mt-0.5 font-mono">
                    {new Date(msg.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="p-1.5 text-ink-500 hover:text-red-400 transition"
                  title="Admin delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <p className="mt-3 text-xs sm:text-sm text-ink-200 leading-relaxed pl-13">
              {msg.content}
            </p>

            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-4 text-xs">
              <button
                onClick={() => handleLike(msg.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition ${
                  msg.liked_by_me
                    ? 'text-pink-400 bg-pink-500/15'
                    : 'text-ink-400 hover:text-pink-300 hover:bg-white/[0.04]'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${msg.liked_by_me ? 'fill-current' : ''}`} />
                <span>{msg.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
