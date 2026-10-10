import { useState, useRef } from 'react';
import { Plus, PawPrint, Loader2, Trash2, Pencil, X, AlertCircle, Camera } from 'lucide-react';
import { usePets, type Pet } from '@/hooks/usePets';
import { useTaxonomySearch } from '@/hooks/useTaxonomySearch';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { EmptyState } from '@/components/ui';
import { useToasts, ToastContainer } from '@/components/Toast';

interface MyPetsPageProps {
  onNavigate: (path: string) => void;
  onRequireAuth: (label: string) => void;
}

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Fish', 'Hamster', 'Guinea Pig', 'Reptile', 'Ferret', 'Hedgehog', 'Chinchilla', 'Turtle', 'Other'];
const GENDER_OPTIONS = ['Male', 'Female', 'Unknown'];

interface PetForm {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  notes: string;
  animal_taxon_id: string;
}

const EMPTY_FORM: PetForm = { name: '', species: 'Dog', breed: '', age: '', gender: '', notes: '', animal_taxon_id: '' };

export function MyPetsPage({ onNavigate, onRequireAuth }: MyPetsPageProps) {
  const { session } = useAuth();
  const { pets, loading, addPet, updatePet, deletePet } = usePets();
  const { toasts, dismiss, showToast } = useToasts();
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [form, setForm] = useState<PetForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [taxonomyQuery, setTaxonomyQuery] = useState('');
  const { matches: taxonomyMatches, loading: taxonomyLoading } = useTaxonomySearch(taxonomyQuery, showForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    if (!session) { onRequireAuth('Add pets'); return; }
    setEditingPet(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview(null);
    setTaxonomyQuery('');
    setError(null);
    setShowForm(true);
  };

  const openEdit = (pet: Pet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? '',
      age: pet.age ?? '',
      gender: pet.gender ?? '',
      notes: pet.notes ?? '',
      animal_taxon_id: pet.animal_taxon_id ?? '',
    });
    setTaxonomyQuery(pet.breed || pet.species);
    setPhotoPreview(pet.photo_url ?? null);
    setPhotoFile(null);
    setError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setError(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setTaxonomyQuery('');
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

  const uploadPhoto = async (petId: string): Promise<string | null> => {
    if (!photoFile || !session) return editingPet?.photo_url ?? null;
    setUploadingPhoto(true);
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const path = `${session.user.id}/${petId}/profile-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(path, photoFile);
    setUploadingPhoto(false);
    if (uploadError) {
      console.error('Photo upload error:', uploadError.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Pet name is required.'); return; }
    setSaving(true);
    setError(null);

    const petData = {
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || null,
      age: form.age.trim() || null,
      gender: form.gender || null,
      birth_date: null,
      photo_url: null,
      notes: form.notes.trim() || null,
      animal_taxon_id: form.animal_taxon_id || null,
    };

    if (editingPet) {
      const { error: err } = await updatePet(editingPet.id, petData);
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
      if (photoFile) {
        const photoUrl = await uploadPhoto(editingPet.id);
        if (photoUrl) {
          await updatePet(editingPet.id, { photo_url: photoUrl });
        }
      }
      showToast('success', `${form.name} updated successfully!`);
      setSaving(false);
      closeForm();
    } else {
      const { error: err } = await addPet(petData);
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
      showToast('success', `${form.name} added to your pet family!`);
      setSaving(false);
      closeForm();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This will also remove all photos and activities for this pet.`)) return;
    const { error: err } = await deletePet(id);
    if (err) {
      showToast('error', `Could not delete: ${err}`);
    } else {
      showToast('success', `${name} removed from your pets.`);
    }
  };

  if (!session) {
    return (
      <div className="container-px pt-10 pb-16">
        <EmptyState
          icon={<PawPrint className="h-7 w-7" />}
          title="Sign in to manage your pets"
          description="Create an account or log in to add pets, track activities, and manage care."
          action={<button onClick={() => onRequireAuth('My Pets')} className="btn-primary">Sign In</button>}
        />
      </div>
    );
  }

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">My Pets</p>
          <h1 className="mt-2 section-title">Your pet family</h1>
          <p className="mt-2 text-ink-300">Manage your pets, add photos, track activities, and keep care notes.</p>
        </div>
        <button onClick={openAdd} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          Add Pet
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
                <div className="h-3 w-12 animate-pulse rounded-lg bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && pets.length === 0 && !showForm && (
        <div className="mt-8">
          <EmptyState
            icon={<PawPrint className="h-7 w-7" />}
            title="No pets yet"
            description="Add your first pet to start tracking care, activities, and reminders."
            action={<button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" />Add your first pet</button>}
          />
        </div>
      )}

      {!loading && pets.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div key={pet.id} className="card-surface group overflow-hidden transition hover:border-white/[0.10] hover:shadow-soft">
              <button onClick={() => onNavigate(`/my-pets/${pet.id}`)} className="block w-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-400">
                      <PawPrint className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </button>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink-50">{pet.name}</h3>
                  {pet.gender && (
                    <span className="chip text-xs">
                      {pet.gender === 'Female' ? '♀' : pet.gender === 'Male' ? '♂' : '?' }
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-ink-400">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                {pet.age && <p className="mt-1 text-xs text-ink-400">{pet.age}</p>}
                {pet.notes && <p className="mt-2 line-clamp-2 text-sm text-ink-300">{pet.notes}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => onNavigate(`/my-pets/${pet.id}`)} className="btn-ghost flex-1 text-sm">View Profile</button>
                  <button onClick={() => openEdit(pet)} className="rounded-xl border border-white/[0.08] p-2.5 text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(pet.id, pet.name)} className="rounded-xl border border-red-500/20 p-2.5 text-red-600 transition hover:bg-red-500/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
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
                <h2 className="font-display text-lg font-semibold text-ink-50">{editingPet ? 'Edit Pet' : 'Add a Pet'}</h2>
                <button onClick={closeForm} className="rounded-full p-2 text-ink-300 hover:bg-white/[0.06] hover:text-ink-50" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-white/[0.08] bg-ink-900">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Pet" className="h-full w-full object-cover" />
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Pet Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Buddy" required autoFocus />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Species *</label>
                    <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="input-field">
                      {SPECIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Gender</label>
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                      <option value="">Select...</option>
                      {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Breed</label>
                  <input value={form.breed} onChange={(e) => { setForm({ ...form, breed: e.target.value, animal_taxon_id: '' }); setTaxonomyQuery(e.target.value); }} className="input-field" placeholder="Golden Retriever" />
                  <p className="mt-1.5 text-xs text-ink-500">Optional: link this pet to a verified taxonomy record.</p>
                  {taxonomyQuery.trim().length >= 2 && (taxonomyLoading || taxonomyMatches.length > 0) && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900/90">
                      {taxonomyLoading && <p className="px-3 py-2 text-xs text-ink-400">Searching animal records...</p>}
                      {!taxonomyLoading && taxonomyMatches.map((match) => {
                        const label = match.common_name || match.scientific_name || 'Unnamed record';
                        return (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, breed: match.taxonomic_rank === 'breed' ? label : form.breed, species: match.taxonomic_rank === 'species' ? label : form.species, animal_taxon_id: match.id });
                              setTaxonomyQuery(label);
                            }}
                            className="block w-full px-3 py-2 text-left text-xs text-ink-200 transition hover:bg-white/[0.06]"
                          >
                            <span className="font-medium text-ink-50">{label}</span>
                            <span className="ml-2 text-ink-500">{match.taxonomic_rank}{match.scientific_name && match.common_name ? ` · ${match.scientific_name}` : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Age</label>
                  <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input-field" placeholder="3 years" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" rows={3} placeholder="Personality, health notes, care preferences..." />
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
                      <><Plus className="h-4 w-4" />{editingPet ? 'Save Changes' : 'Add Pet'}</>
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
