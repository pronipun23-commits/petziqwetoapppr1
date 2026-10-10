import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, PawPrint, Plus, Trash2, Loader2, Camera, Activity, CheckSquare, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { EmptyState } from '@/components/ui';
import type { Pet } from '@/hooks/usePets';

interface PetDetailPageProps {
  petId: string;
  onNavigate: (path: string) => void;
}

interface PetPhoto {
  id: string;
  photo_url: string;
  caption: string | null;
}

interface PetActivity {
  id: string;
  activity_type: string;
  duration_minutes: number | null;
  notes: string | null;
  activity_date: string;
}

interface ChecklistItem {
  id: string;
  task_type: string;
  task_label: string;
  is_completed: boolean;
}

const ACTIVITY_TYPES = [
  { value: 'walk', label: 'Walk' },
  { value: 'play', label: 'Play' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'training', label: 'Training' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'other', label: 'Other' },
];

const CHECKLIST_TASKS = [
  { type: 'food', label: 'Food' },
  { type: 'water', label: 'Water' },
  { type: 'exercise', label: 'Exercise' },
  { type: 'grooming', label: 'Grooming' },
  { type: 'play', label: 'Play / Enrichment' },
];

type Tab = 'overview' | 'photos' | 'activity' | 'checklist';

export function PetDetailPage({ petId, onNavigate }: PetDetailPageProps) {
  const { session } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [activities, setActivities] = useState<PetActivity[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({ activity_type: 'walk', duration_minutes: '', notes: '' });
  const [savingActivity, setSavingActivity] = useState(false);

  const fetchPet = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('pets').select('*').eq('id', petId).maybeSingle();
    if (data) setPet(data);
    setLoading(false);
  }, [session, petId]);

  const fetchPhotos = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('pet_photos').select('id, photo_url, caption').eq('pet_id', petId).order('created_at', { ascending: false });
    if (data) setPhotos(data as PetPhoto[]);
  }, [session, petId]);

  const fetchActivities = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('pet_activities').select('id, activity_type, duration_minutes, notes, activity_date').eq('pet_id', petId).order('activity_date', { ascending: false }).limit(20);
    if (data) setActivities(data as PetActivity[]);
  }, [session, petId]);

  const fetchChecklist = useCallback(async () => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from('care_checklists').select('id, task_type, task_label, is_completed').eq('pet_id', petId).eq('completed_date', today);
    if (data) setChecklist(data as ChecklistItem[]);
  }, [session, petId]);

  useEffect(() => {
    fetchPet();
    fetchPhotos();
    fetchActivities();
    fetchChecklist();
  }, [fetchPet, fetchPhotos, fetchActivities, fetchChecklist]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${session.user.id}/${petId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('pet-photos').upload(path, file);
    if (uploadError) { setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(path);
    await supabase.from('pet_photos').insert({ pet_id: petId, photo_url: urlData.publicUrl });
    await fetchPhotos();
    setUploading(false);
  };

  const handleDeletePhoto = async (photoId: string, photoUrl: string) => {
    if (!confirm('Delete this photo?')) return;
    await supabase.from('pet_photos').delete().eq('id', photoId);
    const path = photoUrl.split('/pet-photos/')[1];
    if (path) await supabase.storage.from('pet-photos').remove([path]);
    fetchPhotos();
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSavingActivity(true);
    await supabase.from('pet_activities').insert({
      pet_id: petId,
      activity_type: activityForm.activity_type,
      duration_minutes: activityForm.duration_minutes ? parseInt(activityForm.duration_minutes) : null,
      notes: activityForm.notes.trim() || null,
    });
    setSavingActivity(false);
    setShowActivityForm(false);
    setActivityForm({ activity_type: 'walk', duration_minutes: '', notes: '' });
    fetchActivities();
  };

  const toggleChecklistTask = async (taskType: string, taskLabel: string) => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10);
    const existing = checklist.find((c) => c.task_type === taskType);
    if (existing) {
      const newVal = !existing.is_completed;
      await supabase.from('care_checklists').update({ is_completed: newVal, completed_at: newVal ? new Date().toISOString() : null }).eq('id', existing.id);
      setChecklist((prev) => prev.map((c) => c.id === existing.id ? { ...c, is_completed: newVal } : c));
      if (newVal) {
        await supabase.rpc('record_care_task', { p_user_id: session.user.id });
      }
    } else {
      const { data } = await supabase.from('care_checklists').insert({
        pet_id: petId,
        task_type: taskType,
        task_label: taskLabel,
        completed_date: today,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }).select('id, task_type, task_label, is_completed').single();
      if (data) {
        setChecklist((prev) => [...prev, data as ChecklistItem]);
        await supabase.rpc('record_care_task', { p_user_id: session.user.id });
      }
    }
  };

  const handleDeleteActivity = async (id: string) => {
    await supabase.from('pet_activities').delete().eq('id', id);
    fetchActivities();
  };

  if (loading) {
    return <div className="container-px pt-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>;
  }

  if (!pet) {
    return (
      <div className="container-px pt-20 pb-24 lg:pb-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-50">Pet not found</h1>
        <button onClick={() => onNavigate('/my-pets')} className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" />Back to My Pets</button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Activity }[] = [
    { id: 'overview', label: 'Overview', icon: PawPrint },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <button onClick={() => onNavigate('/my-pets')} className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-ink-50">
        <ArrowLeft className="h-4 w-4" />My Pets
      </button>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="card-surface overflow-hidden">
          <div className="aspect-square overflow-hidden bg-ink-900">
            {pet.photo_url ? (
              <img src={pet.photo_url} alt={pet.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-400"><PawPrint className="h-16 w-16" /></div>
            )}
          </div>
          <div className="p-5">
            <h1 className="font-display text-2xl font-semibold text-ink-50">{pet.name}</h1>
            <p className="mt-1 text-sm text-ink-400">{pet.species}{pet.breed ? ` \u00b7 ${pet.breed}` : ''}</p>
            {pet.age && <p className="mt-1 text-xs text-ink-400">{pet.age}</p>}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'bg-brand-500 text-white' : 'border border-white/[0.08] text-ink-300 hover:text-ink-50'}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === 'overview' && (
              <div className="card-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink-50">About {pet.name}</h3>
                {pet.notes ? <p className="mt-3 text-sm leading-relaxed text-ink-200">{pet.notes}</p> : <p className="mt-3 text-sm text-ink-400">No notes added yet.</p>}
                {pet.birth_date && <p className="mt-4 text-xs text-ink-400">Born: {new Date(pet.birth_date).toLocaleDateString()}</p>}
              </div>
            )}

            {tab === 'photos' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink-50">Photo Gallery</h3>
                  <label className="btn-primary cursor-pointer text-sm">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Camera className="h-4 w-4" />Add Photo</>}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
                {photos.length === 0 ? (
                  <EmptyState icon={<ImageIcon className="h-7 w-7" />} title="No photos yet" description="Upload photos to create a gallery for your pet." />
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((photo) => (
                      <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-white/[0.08]">
                        <img src={photo.photo_url} alt={photo.caption ?? pet.name} className="aspect-square w-full object-cover" loading="lazy" />
                        <button onClick={() => handleDeletePhoto(photo.id, photo.photo_url)} className="absolute right-2 top-2 rounded-full glass-light p-2 text-red-600 opacity-0 transition group-hover:opacity-100">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'activity' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink-50">Activity History</h3>
                  <button onClick={() => setShowActivityForm((v) => !v)} className="btn-primary text-sm"><Plus className="h-4 w-4" />Log Activity</button>
                </div>
                {showActivityForm && (
                  <form onSubmit={handleSaveActivity} className="mb-4 card-surface space-y-3 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select value={activityForm.activity_type} onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })} className="input-field">
                        {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <input type="number" value={activityForm.duration_minutes} onChange={(e) => setActivityForm({ ...activityForm, duration_minutes: e.target.value })} className="input-field" placeholder="Duration (min)" min="0" />
                    </div>
                    <input value={activityForm.notes} onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })} className="input-field" placeholder="Notes (optional)" />
                    <div className="flex gap-2">
                      <button type="submit" disabled={savingActivity} className="btn-primary">{savingActivity ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Activity'}</button>
                      <button type="button" onClick={() => setShowActivityForm(false)} className="btn-ghost">Cancel</button>
                    </div>
                  </form>
                )}
                {activities.length === 0 ? (
                  <EmptyState icon={<Activity className="h-7 w-7" />} title="No activities logged" description="Track walks, play sessions, training, and more." />
                ) : (
                  <div className="space-y-2">
                    {activities.map((a) => (
                      <div key={a.id} className="card-surface flex items-center justify-between p-4">
                        <div>
                          <span className="font-semibold text-ink-50 capitalize">{a.activity_type}</span>
                          {a.duration_minutes && <span className="ml-2 text-sm text-ink-400">{a.duration_minutes} min</span>}
                          {a.notes && <p className="mt-0.5 text-xs text-ink-400">{a.notes}</p>}
                          <p className="mt-0.5 text-xs text-ink-400">{new Date(a.activity_date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteActivity(a.id)} className="rounded-lg p-2 text-ink-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'checklist' && (
              <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-ink-50">Daily Care Checklist</h3>
                <p className="mb-4 text-sm text-ink-400">Today's tasks for {pet.name}</p>
                <div className="space-y-2">
                  {CHECKLIST_TASKS.map((task) => {
                    const item = checklist.find((c) => c.task_type === task.type);
                    const done = item?.is_completed ?? false;
                    return (
                      <button key={task.type} onClick={() => toggleChecklistTask(task.type, task.label)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${done ? 'border-brand-500/30 bg-brand-500/10' : 'border-white/[0.08] hover:border-white/[0.10]'}`}>
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${done ? 'border-brand-500 bg-brand-500 text-white' : 'border-white/[0.10]'}`}>
                          {done && <CheckSquare className="h-4 w-4" />}
                        </span>
                        <span className={`text-sm font-medium ${done ? 'text-brand-500' : 'text-ink-200'}`}>{task.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
