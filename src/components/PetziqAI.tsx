import { useCallback, useEffect, useRef, useState } from 'react';
import { usePets } from '@/hooks/usePets';
import { useUserPlants } from '@/hooks/useUserPlants';
import {
  AlertCircle,
  Bone,
  Check,
  Dog,
  Heart,
  Leaf,
  Loader2,
  Package,
  PawPrint,
  Puzzle,
  RefreshCw,
  Send,
  Shield,
  Sprout,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickAction {
  icon: typeof Dog;
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Bone, label: 'Feeding', prompt: 'Can you help me with a safe feeding and nutrition plan for my pet?' },
  { icon: Heart, label: 'Grooming', prompt: 'What grooming routine would you recommend for a pet?' },
  { icon: Dog, label: 'Exercise', prompt: 'How much exercise does a healthy pet usually need?' },
  { icon: Check, label: 'Training', prompt: 'What are some kind, practical training steps I can start today?' },
  { icon: Puzzle, label: 'Behavior', prompt: 'Help me understand a behavior my pet is showing.' },
  { icon: Package, label: 'Setup & supplies', prompt: 'What supplies do I need to set up well for a new pet?' },
  { icon: Leaf, label: 'Plant care', prompt: 'How can I improve the watering and light routine for my plant?' },
  { icon: Sprout, label: 'Choose plants', prompt: 'Which plants would suit my home and schedule best?' },
  { icon: PawPrint, label: 'Choose a pet', prompt: 'What should I consider when choosing a pet for my lifestyle?' },
  { icon: Tag, label: 'Smart Tags', prompt: 'What are Petziq Smart Tags and how do the public profiles work?' },
];

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "Welcome to Petziq AI. I can help with everyday pet care, feeding, grooming, exercise, behavior, setup and supplies, plant care, and choosing the right pet or plant for your home. What would you like to explore?",
};

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/petziq-ai`;
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export function PetziqAI() {
  const { pets } = usePets();
  const { plants } = useUserPlants();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, loading, error, scrollToBottom]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const requestMessages = [...messages, userMessage];
    setMessages(requestMessages);
    setInput('');
    setLoading(true);
    setError(null);
    setLastFailedPrompt(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          messages: requestMessages,
          petContext: pets.slice(0, 10).map((pet) => ({
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            age: pet.age,
            animal_taxon_id: pet.animal_taxon_id,
          })),
          plantContext: plants.slice(0, 10).map((plant) => ({
            name: plant.name,
            species: plant.species,
            care_level: plant.care_level,
            watering_frequency: plant.watering_frequency,
            location: plant.location,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('Petziq AI is busy right now. Please wait a moment and try again.');
        if (response.status === 401 || response.status === 403) throw new Error('Petziq AI is not available for this session yet. Please check the service configuration.');
        throw new Error(`Petziq AI could not respond (${response.status}).`);
      }

      const data: unknown = await response.json();
      const reply = typeof data === 'object' && data !== null && 'reply' in data
        ? (data as { reply?: unknown }).reply
        : null;

      if (typeof reply !== 'string' || !reply.trim()) {
        throw new Error('Petziq AI returned an empty response. Please try again.');
      }

      setMessages((previous) => [...previous, { role: 'assistant', content: reply }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Petziq AI is temporarily unavailable.');
      setLastFailedPrompt(trimmed);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, pets]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setError(null);
    setLastFailedPrompt(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close Petziq AI' : 'Open Petziq AI chat'}
        className="focus-ring fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 via-teal-400 to-ocean-400 text-white shadow-glow transition duration-300 hover:-translate-y-1 hover:shadow-glow-blue sm:bottom-6 sm:right-6"
      >
        {open ? <X className="h-6 w-6" strokeWidth={2.5} /> : <PawPrint className="h-7 w-7" strokeWidth={2.5} />}
        {!open && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-ink-950 bg-cyan-300" />}
      </button>

      {open && (
        <section
          aria-label="Petziq AI chat"
          className="fixed bottom-24 right-3 z-50 flex max-h-[calc(100dvh-7rem)] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-cyan-200/15 bg-ink-900/95 shadow-2xl backdrop-blur-2xl animate-scale-in origin-bottom-right sm:right-6 sm:w-[25rem]"
        >
          <header className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-ocean-950/80 via-ink-900 to-iris-950/50 px-4 py-4">
            <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-brand-400/80 via-teal-400/70 to-iris-400/70 text-white shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">Petziq AI</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                    Your care companion
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleClear} aria-label="Clear chat" className="focus-ring grid h-8 w-8 place-items-center rounded-xl text-ink-400 transition hover:bg-white/[0.07] hover:text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={() => setOpen(false)} aria-label="Close chat" className="focus-ring grid h-8 w-8 place-items-center rounded-xl text-ink-400 transition hover:bg-white/[0.07] hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="relative mt-3 max-w-xs text-xs leading-relaxed text-ink-300">Practical guidance for pets, plants, and thoughtful everyday care.</p>
          </header>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ minHeight: '190px', maxHeight: 'calc(100dvh - 20rem)' }}>
            {messages.map((message, index) => <MessageBubble key={`${message.role}-${index}`} message={message} />)}
            {loading && <TypingIndicator />}

            {messages.length === 1 && !loading && (
              <div className="space-y-2.5 pt-2">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">Start with a topic</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => void sendMessage(action.prompt)}
                      className="focus-ring flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2.5 text-left text-xs font-medium text-ink-200 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white disabled:opacity-50"
                      disabled={loading}
                    >
                      <action.icon className="h-4 w-4 shrink-0 text-cyan-200" />
                      <span className="truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="border-t border-rose-300/15 bg-rose-400/[0.07] px-4 py-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-rose-100">{error}</p>
                  {lastFailedPrompt && (
                    <button onClick={() => void sendMessage(lastFailedPrompt)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-200 hover:text-white">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-white/[0.08] bg-ink-950/60 p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.04] p-1.5 transition focus-within:border-cyan-300/35 focus-within:bg-white/[0.06]">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about care..."
                disabled={loading}
                className="focus-ring min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-ink-50 placeholder:text-ink-500 disabled:opacity-50"
                maxLength={500}
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 text-white transition hover:-translate-y-0.5 hover:shadow-glow disabled:pointer-events-none disabled:opacity-40">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={2.5} />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-ink-500">
              <Shield className="h-3 w-3" />
              Educational guidance only. Contact a qualified veterinarian for urgent concerns.
            </div>
          </form>
        </section>
      )}
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-up`}>
      {!isUser && (
        <div className="mr-2 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}
      <div className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isUser ? 'rounded-br-md bg-gradient-to-br from-brand-500 to-ocean-600 text-white shadow-glow-blue' : 'rounded-bl-md border border-white/[0.08] glass-light text-ink-100'}`}>
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in" aria-label="Petziq AI is typing">
      <div className="mr-2 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-white">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/[0.08] glass-light px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200" />
      </div>
    </div>
  );
}
