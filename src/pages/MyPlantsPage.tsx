import { useState, useRef } from 'react';
import { Plus, Sprout, Loader2, Trash2, Pencil, X, AlertCircle, Camera, Droplets, MapPin } from 'lucide-react';
import { useUserPlants, type UserPlant } from '@/hooks/useUserPlants';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase } from '@/lib/supabase';
import { EmptyState } from '@/components/ui';
import { useToasts, ToastContainer } from '@/components/Toast';

interface MyPlantsPageProps {
  onNavigate: (path: string) => void;
  onRequireAuth: (label: string) => void;
}

const CARE_LEVELS = ['Easy', 'Moderate', 'Advanced'];

interface PlantForm {
  name: string;
  species: string;
  care_level: string;
  watering_frequency: string;
  location: string;
  notes: string;
}

const EMPTY_FORM: PlantForm = {
  name: '',
  species: '',
  care_level: 'Easy',
  watering_frequency: '',
  location: '',
  notes: '',
};

export function MyPlantsPage({ onRequireAuth }: MyPlantsPageProps) {
  const { session } = useAuth();
  const { plants, loading, addPlant, updatePlant, deletePlant } = useUserPlants();
  const { checkAndAwardAchievements } = useUserProgress();
  const { toasts, dismiss, showToast } = useToasts();
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState<UserPlant | null>(null);
  const [form, setForm] = useState<PlantForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    if (!session) { onRequireAuth('Add plants'); return; }
    setEditingPlant(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (plant: UserPlant) => {
    setEditingPlant(plant);
    setForm({
      name: plant.name,
      species: plant.species ?? '',
      care_level: plant.care_level ?? 'Easy',
      watering_frequency: plant.watering_frequency ?? '',
      location: plant.location ?? '',
      notes: plant.notes ?? '',
    });
    setPhotoPreview(plant.photo_url ?? null);
    setPhotoFile(null);
    setError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setError(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB.');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (plantId: string): Promise<string | null> => {
    if (!photoFile || !session) return editingPlant?.photo_url ?? null;
    setUploadingPhoto(true);
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const path = `${session.user.id}/${plantId}/profile-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('plant-photos')
      .upload(path, photoFile);
    setUploadingPhoto(false);
    if (uploadError) {
      console.error('Photo upload error:', uploadError.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from('plant-photos').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Plant name is required.'); return; }
    setSaving(true);
    setError(null);

    const plantData = {
      name: form.name.trim(),
      species: form.species.trim() || null,
      care_level: form.care_level || null,
      watering_frequency: form.watering_frequency.trim() || null,
      location: form.location.trim() || null,
      photo_url: null,
      notes: form.notes.trim() || null,
    };

    if (editingPlant) {
      const { error: err } = await updatePlant(editingPlant.id, plantData);
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
      if (photoFile) {
        const photoUrl = await uploadPhoto(editingPlant.id);
        if (photoUrl) {
          await updatePlant(editingPlant.id, { photo_url: photoUrl });
        }
      }
      showToast('success', `${form.name} updated successfully!`);
      setSaving(false);
      closeForm();
    } else {
      const { error: err } = await addPlant(plantData);
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
      showToast('success', `${form.name} added to your plant collection! +50 XP Milestone Achieved!`);
      checkAndAwardAchievements({ plants: plants.length + 1 });
      setSaving(false);
      closeForm();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This action cannot be undone.`)) return;
    const { error: err } = await deletePlant(id);
    if (err) {
      showToast('error', `Could not delete: ${err}`);
    } else {
      showToast('success', `${name} removed from your plants.`);
    }
  };

  const careLevelColor = (level: string | null) => {
    if (level === 'Easy') return 'text-brand-300 bg-brand-500/10 border-brand-500/20';
    if (level === 'Moderate') return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
    if (level === 'Advanced') return 'text-red-600 bg-red-500/10 border-red-500/20';
    return 'text-ink-300 bg-white/[0.05] border-white/[0.08]';
  };

  if (!session) {
    return (
      <div className="container-px pt-10 pb-16">
        <EmptyState
          icon={<Sprout className="h-7 w-7" />}
          title="Sign in to manage your plants"
          description="Create an account or log in to build your personal plant collection."
          action={<button onClick={() => onRequireAuth('My Plants')} className="btn-primary">Sign In</button>}
        />
      </div>
    );
  }

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">My Plants</p>
          <h1 className="mt-2 section-title">Your plant collection</h1>
          <p className="mt-2 text-ink-300">Track your personal plants, care schedules, and growing notes.</p>
        </div>
        <button onClick={openAdd} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          Add Plant
        </button>
      </div>

      {loading && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface overflow-hidden">
              <div className="aspect-[4/3] animate-pulse bg-white/[0.05]" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-24 animate-pulse rounded-lg bg-white/[0.05]" />
                <div className="h-3 w-16 animate-pulse rounded-lg bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && plants.length === 0 && !showForm && (
        <div className="mt-8">
          <EmptyState
            icon={<Sprout className="h-7 w-7" />}
            title="No plants yet"
            description="Add your first plant to start tracking watering, care, and growth."
            action={<button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" />Add your first plant</button>}
          />
        </div>
      )}

      {!loading && plants.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <div key={plant.id} className="card-surface group overflow-hidden transition hover:border-white/[0.10] hover:shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
                {plant.photo_url ? (
                  <img src={plant.photo_url} alt={plant.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-400">
                    <Sprout className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink-50">{plant.name}</h3>
                  {plant.care_level && (
                    <span className={`chip shrink-0 border text-xs ${careLevelColor(plant.care_level)}`}>{plant.care_level}</span>
                  )}
                </div>
                {plant.species && <p className="mt-0.5 text-sm text-ink-400">{plant.species}</p>}
                {plant.watering_frequency && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-300">
                    <Droplets className="h-3.5 w-3.5 text-brand-400" />
                    {plant.watering_frequency}
                  </p>
                )}
                {plant.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {plant.location}
                  </p>
                )}
                {plant.notes && <p className="mt-2 line-clamp-2 text-sm text-ink-300">{plant.notes}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(plant)} className="btn-ghost flex-1 text-sm">
                    <Pencil className="h-3.5 w-3.5" />Edit
                  </button>
                  <button onClick={() => handleDelete(plant.id, plant.name)} className="rounded-xl border border-red-500/20 p-2.5 text-red-600 transition hover:bg-red-500/10" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 glass-light backdrop-blur-sm" onClick={closeForm} />
          <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="card-surface p-7">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink-50">{editingPlant ? 'Edit Plant' : 'Add a Plant'}</h2>
                <button onClick={closeForm} className="rounded-full p-2 text-ink-300 hover:bg-white/[0.06] hover:text-ink-50" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-white/[0.08] bg-ink-900">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Plant" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-ink-400" />
                      )}
                    </div>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                        className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-ink-50 shadow-lg"
                        aria-label="Remove photo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-medium text-brand-300 transition hover:text-brand-500"
                  >
                    {photoPreview ? 'Change photo' : 'Add a photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Plant Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="My Monstera" required autoFocus />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Species / Type</label>
                  <input value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="input-field" placeholder="Monstera deliciosa" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Care Level</label>
                    <select value={form.care_level} onChange={(e) => setForm({ ...form, care_level: e.target.value })} className="input-field">
                      {CARE_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Watering</label>
                    <input value={form.watering_frequency} onChange={(e) => setForm({ ...form, watering_frequency: e.target.value })} className="input-field" placeholder="Every 7 days" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="Living room window" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" rows={3} placeholder="Care tips, growth notes..." />
                </div>
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="submit" disabled={saving || uploadingPhoto} className="btn-primary flex-1">
                    {saving || uploadingPhoto ? (
                      <><Loader2 className="h-5 w-5 animate-spin" />{uploadingPhoto ? 'Uploading...' : 'Saving...'}</>
                    ) : (
                      <><Plus className="h-4 w-4" />{editingPlant ? 'Save Changes' : 'Add Plant'}</>
                    )}
                  </button>
                  <button type="button" onClick={closeForm} className="btn-ghost">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
