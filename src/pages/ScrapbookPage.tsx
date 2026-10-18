import { useState, useEffect } from 'react';
import {
  Heart, Camera, Calendar, Sparkles, Plus, Image as ImageIcon,
  Trash2, X, AlertCircle, PawPrint, Award, Bookmark, ArrowRight, ShieldCheck, MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { useUserProgress } from '@/hooks/useUserProgress';
import { SectionHeader } from '@/components/ui';

interface ScrapbookPageProps {
  onNavigate: (path: string) => void;
}

export interface Memory {
  id: string;
  pet_id: string;
  pet_name: string;
  title: string;
  category: 'birthday' | 'first_walk' | 'vet_visit' | 'milestone' | 'funny' | 'photo';
  date: string;
  description: string;
  photo_url: string | null;
  created_at: string;
}

const CATEGORY_META = {
  birthday: { label: 'Birthday & Adoption', color: 'text-amber-300 bg-amber-500/15 border-amber-500/30' },
  first_walk: { label: 'First Walk', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' },
  vet_visit: { label: 'First Vet Visit', color: 'text-blue-300 bg-blue-500/15 border-blue-500/30' },
  milestone: { label: 'Big Milestone', color: 'text-purple-300 bg-purple-500/15 border-purple-500/30' },
  funny: { label: 'Funny Memory', color: 'text-pink-300 bg-pink-500/15 border-pink-500/30' },
  photo: { label: 'Golden Moment', color: 'text-teal-300 bg-teal-500/15 border-teal-500/30' },
};

export function ScrapbookPage({ onNavigate }: ScrapbookPageProps) {
  const { session } = useAuth();
  const { pets } = usePets();
  const { checkAndAwardAchievements } = useUserProgress();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [petId, setPetId] = useState('');
  const [category, setCategory] = useState<Memory['category']>('milestone');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Load memories from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('petziq_pet_memories');
      if (raw) {
        setMemories(JSON.parse(raw));
      } else {
        // Sample starter memories if user has pets
        const initialSamples: Memory[] = [
          {
            id: 'sample-1',
            pet_id: pets[0]?.id || 'p-1',
            pet_name: pets[0]?.name || 'Companion',
            title: 'Welcome Home Day!',
            category: 'birthday',
            date: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            description: 'The first day you walked through our door and stole all of our hearts.',
            photo_url: null,
            created_at: new Date().toISOString(),
          },
          {
            id: 'sample-2',
            pet_id: pets[0]?.id || 'p-1',
            pet_name: pets[0]?.name || 'Companion',
            title: 'First Sunshine Walk in the Park',
            category: 'first_walk',
            date: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            description: 'Chasing squirrels and sniffing every single blade of grass with pure joy.',
            photo_url: null,
            created_at: new Date().toISOString(),
          },
        ];
        setMemories(initialSamples);
        localStorage.setItem('petziq_pet_memories', JSON.stringify(initialSamples));
      }
    } catch {
      // ignore
    }
  }, [pets]);

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenPet = pets.find((p) => p.id === petId) || pets[0];
    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      pet_id: chosenPet?.id || 'general',
      pet_name: chosenPet?.name || 'My Buddy',
      title: title.trim(),
      category,
      date,
      description: description.trim(),
      photo_url: photoPreview,
      created_at: new Date().toISOString(),
    };

    const updated = [newMemory, ...memories];
    setMemories(updated);
    localStorage.setItem('petziq_pet_memories', JSON.stringify(updated));

    // Dopamine achievement milestone trigger
    checkAndAwardAchievements({ memories: updated.length });

    // Reset & close
    setTitle('');
    setDescription('');
    setPhotoPreview(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    localStorage.setItem('petziq_pet_memories', JSON.stringify(updated));
  };

  const filteredMemories = selectedPetId === 'all'
    ? memories
    : memories.filter((m) => m.pet_id === selectedPetId);

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/25 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-300">
            <Heart className="h-3.5 w-3.5 fill-current" />
            The Emotional Side of Petziq
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-ink-50">
            Pet Memories Scrapbook
          </h1>
          <p className="mt-2 text-sm text-ink-300 max-w-xl leading-relaxed">
            A private timeline capturing every precious memory — first walk, birthdays, vet visits, silly quirks, and lifetime milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pets.length === 0 ? (
            <button
              onClick={() => onNavigate('/my-pets')}
              className="btn-primary flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold text-xs"
            >
              <PawPrint className="h-4 w-4" />
              Add Buddies
            </button>
          ) : (
            <button
              onClick={() => {
                if (pets.length > 0 && !petId) setPetId(pets[0].id);
                setIsAddModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold text-xs shadow-glow-blue"
            >
              <Plus className="h-4 w-4" />
              Add Memory
            </button>
          )}
        </div>
      </div>

      {/* Pet Filter pills if user has multiple pets */}
      {pets.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPetId('all')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              selectedPetId === 'all'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-white/[0.03] text-ink-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            All Buddies ({memories.length})
          </button>
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedPetId === pet.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-white/[0.03] text-ink-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {/* Empty State when no pets registered */}
      {pets.length === 0 ? (
        <div className="mt-16 mx-auto max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto mb-4">
            <PawPrint className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-ink-50">No Buddies Added Yet</h2>
          <p className="mt-2 text-xs text-ink-300 leading-relaxed">
            Your Scrapbook is waiting for your pet companion. Add your buddy to begin collecting their lifetime milestones, photos, and funny moments.
          </p>
          <button
            onClick={() => onNavigate('/my-pets')}
            className="btn-primary mt-6 mx-auto flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold text-xs"
          >
            <Plus className="h-4 w-4" />
            Add Buddies Now
          </button>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="mt-16 mx-auto max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-pink-500/10 text-pink-400 mx-auto mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-ink-50">Every Journey Begins with a Memory</h2>
          <p className="mt-2 text-xs text-ink-300 leading-relaxed">
            Capture your first walk, funny quirks, or birthday milestones. Keep them safe forever.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary mt-6 mx-auto flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold text-xs"
          >
            <Plus className="h-4 w-4" />
            Create First Milestone
          </button>
        </div>
      ) : (
        /* Timeline Grid */
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMemories.map((mem) => {
            const meta = CATEGORY_META[mem.category] || CATEGORY_META.milestone;
            return (
              <div
                key={mem.id}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 shadow-soft transition-all duration-300 hover:border-brand-500/30 hover:bg-white/[0.04]"
              >
                {/* Photo Preview if any */}
                {mem.photo_url && (
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4 bg-ink-900">
                    <img src={mem.photo_url} alt={mem.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-ink-400 font-mono">
                    <Calendar className="h-3 w-3" />
                    {mem.date}
                  </div>
                </div>

                <h2 className="mt-3 font-display text-lg font-bold text-ink-50 group-hover:text-brand-300 transition">
                  {mem.title}
                </h2>
                <p className="mt-1 text-xs font-semibold text-emerald-400">
                  {mem.pet_name}
                </p>

                {mem.description && (
                  <p className="mt-2.5 text-xs text-ink-300 leading-relaxed line-clamp-3">
                    {mem.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-ink-500">
                  <span className="flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="h-3 w-3 text-brand-400" />
                    Private Memory
                  </span>
                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    className="p-1 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Remove from Scrapbook"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-7 text-ink-50 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/20">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-ink-50">Add Pet Memory Milestone</h2>
                  <p className="text-xs text-ink-400">Chronicle a special moment in your buddy&apos;s life</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-ink-400 hover:text-white hover:bg-white/[0.06] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                  Which Pet Is This For?
                </label>
                <select
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                  className="input-field text-xs text-ink-200"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. First time swimming at the beach!"
                  required
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="input-field text-xs text-ink-200"
                  >
                    <option value="birthday">Birthday & Adoption</option>
                    <option value="first_walk">First Walk</option>
                    <option value="vet_visit">First Vet Visit</option>
                    <option value="milestone">Big Milestone</option>
                    <option value="funny">Funny Memory</option>
                    <option value="photo">Golden Moment Photo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field text-xs text-ink-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                  Story & Memories
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the joy, silly moments, or feelings..."
                  className="input-field text-xs resize-none"
                />
              </div>

              {/* Attach Photo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                  Attach Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {photoPreview && (
                    <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/20">
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-brand-300 hover:bg-white/[0.08] cursor-pointer transition">
                    <Camera className="h-4 w-4" />
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost flex-1 justify-center py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 justify-center py-2.5 text-xs bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold"
                >
                  Save to Scrapbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
