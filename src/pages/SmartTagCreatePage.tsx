import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, PawPrint, Sprout, Save, Loader2, AlertCircle,
  Camera, X, Shield, Globe, Lock, Tag,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { useUserPlants } from '@/hooks/useUserPlants';
import { useSmartTags, type TagType } from '@/hooks/useSmartTags';
import { SmartTagPreview } from '@/components/SmartTagPreview';
import { supabase } from '@/lib/supabase';
import { useToasts, ToastContainer } from '@/components/Toast';

interface SmartTagCreatePageProps {
  onNavigate: (path: string) => void;
  editId?: string;
}

interface TagFormData {
  tagType: TagType;
  name: string;
  linkedPetId: string;
  linkedPlantId: string;
  // Pet fields
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  identificationNotes: string;
  foodInfo: string;
  exerciseInfo: string;
  groomingInfo: string;
  trainingInfo: string;
  behaviorInfo: string;
  generalCare: string;
  // Plant fields
  plantType: string;
  wateringInfo: string;
  sunlightInfo: string;
  soilInfo: string;
  fertilizerInfo: string;
  temperatureInfo: string;
  plantCareNotes: string;
  // Owner / Emergency
  ownerName: string;
  emergencyContact: string;
  contactPhone: string;
  contactEmail: string;
  // Visibility
  showOwnerName: boolean;
  showEmergencyContact: boolean;
  showContactPhone: boolean;
  showContactEmail: boolean;
  showIdentificationNotes: boolean;
  showFoodInfo: boolean;
  showExerciseInfo: boolean;
  showGroomingInfo: boolean;
  showTrainingInfo: boolean;
  showBehaviorInfo: boolean;
  showGeneralCare: boolean;
  showWateringInfo: boolean;
  showSunlightInfo: boolean;
  showSoilInfo: boolean;
  showFertilizerInfo: boolean;
  showTemperatureInfo: boolean;
  showPlantCareNotes: boolean;
}

const EMPTY_FORM: TagFormData = {
  tagType: 'pet',
  name: '',
  linkedPetId: '',
  linkedPlantId: '',
  species: '',
  breed: '',
  gender: '',
  dateOfBirth: '',
  identificationNotes: '',
  foodInfo: '',
  exerciseInfo: '',
  groomingInfo: '',
  trainingInfo: '',
  behaviorInfo: '',
  generalCare: '',
  plantType: '',
  wateringInfo: '',
  sunlightInfo: '',
  soilInfo: '',
  fertilizerInfo: '',
  temperatureInfo: '',
  plantCareNotes: '',
  ownerName: '',
  emergencyContact: '',
  contactPhone: '',
  contactEmail: '',
  showOwnerName: false,
  showEmergencyContact: false,
  showContactPhone: false,
  showContactEmail: false,
  showIdentificationNotes: true,
  showFoodInfo: true,
  showExerciseInfo: true,
  showGroomingInfo: true,
  showTrainingInfo: true,
  showBehaviorInfo: true,
  showGeneralCare: true,
  showWateringInfo: true,
  showSunlightInfo: true,
  showSoilInfo: true,
  showFertilizerInfo: true,
  showTemperatureInfo: true,
  showPlantCareNotes: true,
};

export function SmartTagCreatePage({ onNavigate, editId }: SmartTagCreatePageProps) {
  const { session } = useAuth();
  const { pets } = usePets();
  const { plants } = useUserPlants();
  const { createTag, updateTag, tags } = useSmartTags();
  const { toasts, dismiss, showToast } = useToasts();
  const [form, setForm] = useState<TagFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editId;
  const existingTag = isEditing ? tags.find((t) => t.id === editId) : null;

  // Load existing tag data when editing
  useEffect(() => {
    if (existingTag) {
      const details = (existingTag.tag_details ?? {}) as Record<string, string>;
      const vis = (existingTag.visibility ?? {}) as Record<string, boolean>;
      const owner = (existingTag.owner_info ?? {}) as Record<string, string>;

      setForm({
        tagType: existingTag.tag_type,
        name: existingTag.name,
        linkedPetId: existingTag.pet_id ?? '',
        linkedPlantId: existingTag.plant_id ?? '',
        species: details.species ?? '',
        breed: details.breed ?? '',
        gender: details.gender ?? '',
        dateOfBirth: details.date_of_birth ?? '',
        identificationNotes: details.identification_notes ?? '',
        foodInfo: details.food_info ?? '',
        exerciseInfo: details.exercise_info ?? '',
        groomingInfo: details.grooming_info ?? '',
        trainingInfo: details.training_info ?? '',
        behaviorInfo: details.behavior_info ?? '',
        generalCare: details.general_care ?? '',
        plantType: details.plant_type ?? '',
        wateringInfo: details.watering_info ?? '',
        sunlightInfo: details.sunlight_info ?? '',
        soilInfo: details.soil_info ?? '',
        fertilizerInfo: details.fertilizer_info ?? '',
        temperatureInfo: details.temperature_info ?? '',
        plantCareNotes: details.plant_care_notes ?? '',
        ownerName: owner.owner_name ?? '',
        emergencyContact: owner.emergency_contact ?? '',
        contactPhone: owner.contact_phone ?? '',
        contactEmail: owner.contact_email ?? '',
        showOwnerName: vis.show_owner_name ?? false,
        showEmergencyContact: vis.show_emergency_contact ?? false,
        showContactPhone: vis.show_contact_phone ?? false,
        showContactEmail: vis.show_contact_email ?? false,
        showIdentificationNotes: vis.show_identification_notes ?? true,
        showFoodInfo: vis.show_food_info ?? true,
        showExerciseInfo: vis.show_exercise_info ?? true,
        showGroomingInfo: vis.show_grooming_info ?? true,
        showTrainingInfo: vis.show_training_info ?? true,
        showBehaviorInfo: vis.show_behavior_info ?? true,
        showGeneralCare: vis.show_general_care ?? true,
        showWateringInfo: vis.show_watering_info ?? true,
        showSunlightInfo: vis.show_sunlight_info ?? true,
        showSoilInfo: vis.show_soil_info ?? true,
        showFertilizerInfo: vis.show_fertilizer_info ?? true,
        showTemperatureInfo: vis.show_temperature_info ?? true,
        showPlantCareNotes: vis.show_plant_care_notes ?? true,
      });
      setPhotoPreview(existingTag.photo_url);
    }
  }, [existingTag]);

  // Auto-fill from linked pet
  const handlePetSelect = (petId: string) => {
    setForm((prev) => ({ ...prev, linkedPetId: petId }));
    const pet = pets.find((p) => p.id === petId);
    if (pet) {
      setForm((prev) => ({
        ...prev,
        linkedPetId: petId,
        name: prev.name || pet.name,
        species: pet.species ?? '',
        breed: pet.breed ?? '',
        gender: pet.gender ?? '',
        dateOfBirth: pet.birth_date ?? '',
        identificationNotes: pet.notes ?? '',
      }));
      if (pet.photo_url) setPhotoPreview(pet.photo_url);
    }
  };

  // Auto-fill from linked plant
  const handlePlantSelect = (plantId: string) => {
    setForm((prev) => ({ ...prev, linkedPlantId: plantId }));
    const plant = plants.find((p) => p.id === plantId);
    if (plant) {
      setForm((prev) => ({
        ...prev,
        linkedPlantId: plantId,
        name: prev.name || plant.name,
        species: plant.species ?? '',
        wateringInfo: plant.watering_frequency ?? '',
        generalCare: plant.notes ?? '',
      }));
      if (plant.photo_url) setPhotoPreview(plant.photo_url);
    }
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

  const uploadPhoto = async (tagId: string): Promise<string | null> => {
    if (!photoFile || !session) return photoPreview;
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const path = `${session.user.id}/tags/${tagId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(path, photoFile);
    if (uploadError) return null;
    const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const buildTagDetails = () => ({
    species: form.species,
    breed: form.breed,
    gender: form.gender,
    date_of_birth: form.dateOfBirth,
    identification_notes: form.identificationNotes,
    food_info: form.foodInfo,
    exercise_info: form.exerciseInfo,
    grooming_info: form.groomingInfo,
    training_info: form.trainingInfo,
    behavior_info: form.behaviorInfo,
    general_care: form.generalCare,
    plant_type: form.plantType,
    watering_info: form.wateringInfo,
    sunlight_info: form.sunlightInfo,
    soil_info: form.soilInfo,
    fertilizer_info: form.fertilizerInfo,
    temperature_info: form.temperatureInfo,
    plant_care_notes: form.plantCareNotes,
  });

  const buildVisibility = () => ({
    show_owner_name: form.showOwnerName,
    show_emergency_contact: form.showEmergencyContact,
    show_contact_phone: form.showContactPhone,
    show_contact_email: form.showContactEmail,
    show_identification_notes: form.showIdentificationNotes,
    show_food_info: form.showFoodInfo,
    show_exercise_info: form.showExerciseInfo,
    show_grooming_info: form.showGroomingInfo,
    show_training_info: form.showTrainingInfo,
    show_behavior_info: form.showBehaviorInfo,
    show_general_care: form.showGeneralCare,
    show_watering_info: form.showWateringInfo,
    show_sunlight_info: form.showSunlightInfo,
    show_soil_info: form.showSoilInfo,
    show_fertilizer_info: form.showFertilizerInfo,
    show_temperature_info: form.showTemperatureInfo,
    show_plant_care_notes: form.showPlantCareNotes,
  });

  const buildOwnerInfo = () => ({
    owner_name: form.ownerName,
    emergency_contact: form.emergencyContact,
    contact_phone: form.contactPhone,
    contact_email: form.contactEmail,
  });

  const handleSave = async (status: 'draft' | 'ready') => {
    if (!form.name.trim()) {
      setError('Tag name is required.');
      return;
    }
    setSaving(true);
    setError(null);

    if (isEditing && editId) {
      // Preserve active status if tag is already active so QR remains live
      const finalStatus = existingTag?.status === 'active' ? 'active' : status;
      const { error: err } = await updateTag(editId, {
        name: form.name.trim(),
        status: finalStatus,
        tag_details: buildTagDetails(),
        visibility: buildVisibility(),
        owner_info: buildOwnerInfo(),
      });
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
      // Upload photo if changed
      if (photoFile) {
        const url = await uploadPhoto(editId);
        if (url) await updateTag(editId, { photo_url: url });
      }
      showToast('success', 'Smart Tag updated successfully!');
    } else {
      const { error: err, tag } = await createTag({
        tag_type: form.tagType,
        name: form.name.trim(),
        status,
        pet_id: form.linkedPetId || null,
        plant_id: form.linkedPlantId || null,
        tag_details: buildTagDetails(),
        visibility: buildVisibility(),
        owner_info: buildOwnerInfo(),
        photo_url: photoPreview,
      });
      if (err) {
        setError(err);
        setSaving(false);
        return;
      }
      if (photoFile && tag) {
        const url = await uploadPhoto(tag.id);
        if (url) await updateTag(tag.id, { photo_url: url });
      }
      showToast('success', 'Smart Tag created successfully!');
    }

    setSaving(false);
    onNavigate('/smart-tags');
  };

  if (!session) {
    return (
      <div className="container-px pt-10 pb-16 text-center">
        <p className="text-ink-400">Please sign in to create Smart Tags.</p>
        <button onClick={() => onNavigate('/smart-tags')} className="btn-primary mt-4">
          Go to Smart Tags
        </button>
      </div>
    );
  }

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <button
        onClick={() => onNavigate('/smart-tags')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-ink-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Smart Tags
      </button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="card-surface p-6 sm:p-8">
            <h1 className="font-display text-2xl font-bold text-ink-50">
              {isEditing ? 'Edit Smart Tag' : 'Create Smart Tag'}
            </h1>
            <p className="mt-1 text-sm text-ink-400">
              Fill in the details for your Smart Tag. Information marked as public will be visible when the QR code is scanned.
            </p>

            {/* Tag type selector */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, tagType: 'pet' }))}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  form.tagType === 'pet'
                    ? 'border-brand-500/40 bg-brand-500/10 text-brand-300'
                    : 'border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/[0.12]'
                }`}
              >
                <PawPrint className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Pet Tag</p>
                  <p className="text-xs opacity-60">For dogs, cats, etc.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, tagType: 'plant' }))}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  form.tagType === 'plant'
                    ? 'border-brand-500/40 bg-brand-500/10 text-brand-300'
                    : 'border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/[0.12]'
                }`}
              >
                <Sprout className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Plant Tag</p>
                  <p className="text-xs opacity-60">For houseplants, etc.</p>
                </div>
              </button>
            </div>

            {/* Link to existing pet/plant */}
            {form.tagType === 'pet' && pets.length > 0 && (
              <div className="mt-6">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Link to existing pet (optional)
                </label>
                <select
                  value={form.linkedPetId}
                  onChange={(e) => handlePetSelect(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a pet...</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.species}</option>
                  ))}
                </select>
              </div>
            )}

            {form.tagType === 'plant' && plants.length > 0 && (
              <div className="mt-6">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Link to existing plant (optional)
                </label>
                <select
                  value={form.linkedPlantId}
                  onChange={(e) => handlePlantSelect(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a plant...</option>
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.species ? ` — ${p.species}` : ''}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Photo */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-white/[0.08] bg-ink-900">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Tag" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-ink-400" />
                  )}
                </div>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-ink-50 shadow-lg"
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

            {/* Basic info */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Tag Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder={form.tagType === 'pet' ? 'e.g., Buddy\'s Tag' : 'e.g., Monstera Tag'}
                  required
                />
              </div>

              {form.tagType === 'pet' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Species</label>
                      <input value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="input-field" placeholder="Dog, Cat, etc." />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Breed</label>
                      <input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="input-field" placeholder="Golden Retriever" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Gender</label>
                      <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field" placeholder="Male / Female" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Date of Birth</label>
                      <input value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="input-field" placeholder="YYYY-MM-DD" />
                    </div>
                  </div>
                </>
              )}

              {form.tagType === 'plant' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">Plant Type</label>
                  <input value={form.plantType} onChange={(e) => setForm({ ...form, plantType: e.target.value })} className="input-field" placeholder="Indoor, Outdoor, Succulent, etc." />
                </div>
              )}
            </div>

            {/* Care information */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold text-ink-50">
                {form.tagType === 'pet' ? 'Pet Care Information' : 'Plant Care Information'}
              </h3>
              <p className="mt-1 text-xs text-ink-400">Each section can be toggled for public visibility.</p>

              {form.tagType === 'pet' ? (
                <div className="mt-4 space-y-4">
                  {[
                    { key: 'identificationNotes', label: 'Identification Notes', visKey: 'showIdentificationNotes', placeholder: 'Any identifying features, microchip info, etc.' },
                    { key: 'foodInfo', label: 'Food Information', visKey: 'showFoodInfo', placeholder: 'Diet, allergies, feeding schedule...' },
                    { key: 'exerciseInfo', label: 'Exercise Information', visKey: 'showExerciseInfo', placeholder: 'Walk schedule, activity level, etc.' },
                    { key: 'groomingInfo', label: 'Grooming Information', visKey: 'showGroomingInfo', placeholder: 'Grooming needs, last groomed, etc.' },
                    { key: 'trainingInfo', label: 'Training Information', visKey: 'showTrainingInfo', placeholder: 'Commands known, training status, etc.' },
                    { key: 'behaviorInfo', label: 'Behavior Information', visKey: 'showBehaviorInfo', placeholder: 'Temperament, fears, special behaviors...' },
                    { key: 'generalCare', label: 'General Care Notes', visKey: 'showGeneralCare', placeholder: 'Any other care information...' },
                  ].map((field) => (
                    <div key={field.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-ink-200">{field.label}</label>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, [field.visKey]: !prev[field.visKey as keyof TagFormData] }))}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                            form[field.visKey as keyof TagFormData]
                              ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                              : 'bg-white/[0.04] text-ink-400 border border-white/[0.06]'
                          }`}
                        >
                          {form[field.visKey as keyof TagFormData] ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {form[field.visKey as keyof TagFormData] ? 'Public' : 'Private'}
                        </button>
                      </div>
                      <textarea
                        value={form[field.key as keyof TagFormData] as string}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="input-field resize-none"
                        rows={2}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {[
                    { key: 'wateringInfo', label: 'Watering Information', visKey: 'showWateringInfo', placeholder: 'Watering schedule, amount, method...' },
                    { key: 'sunlightInfo', label: 'Sunlight Requirements', visKey: 'showSunlightInfo', placeholder: 'Direct, indirect, shade...' },
                    { key: 'soilInfo', label: 'Soil Information', visKey: 'showSoilInfo', placeholder: 'Soil type, pH, drainage needs...' },
                    { key: 'fertilizerInfo', label: 'Fertilizer Information', visKey: 'showFertilizerInfo', placeholder: 'Type, frequency, season...' },
                    { key: 'temperatureInfo', label: 'Temperature Information', visKey: 'showTemperatureInfo', placeholder: 'Ideal range, cold/heat tolerance...' },
                    { key: 'plantCareNotes', label: 'General Care Notes', visKey: 'showPlantCareNotes', placeholder: 'Any other care information...' },
                  ].map((field) => (
                    <div key={field.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-ink-200">{field.label}</label>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, [field.visKey]: !prev[field.visKey as keyof TagFormData] }))}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                            form[field.visKey as keyof TagFormData]
                              ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                              : 'bg-white/[0.04] text-ink-400 border border-white/[0.06]'
                          }`}
                        >
                          {form[field.visKey as keyof TagFormData] ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {form[field.visKey as keyof TagFormData] ? 'Public' : 'Private'}
                        </button>
                      </div>
                      <textarea
                        value={form[field.key as keyof TagFormData] as string}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="input-field resize-none"
                        rows={2}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Owner / Emergency info */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold text-ink-50">Owner / Emergency Information</h3>
              <p className="mt-1 text-xs text-ink-400">Optional. Control what appears publicly.</p>

              <div className="mt-4 space-y-4">
                {[
                  { key: 'ownerName', label: 'Owner Name', visKey: 'showOwnerName', placeholder: 'Your name' },
                  { key: 'emergencyContact', label: 'Emergency Contact', visKey: 'showEmergencyContact', placeholder: 'Emergency contact name' },
                  { key: 'contactPhone', label: 'Contact Phone', visKey: 'showContactPhone', placeholder: '+1 234 567 890' },
                  { key: 'contactEmail', label: 'Contact Email', visKey: 'showContactEmail', placeholder: 'email@example.com' },
                ].map((field) => (
                  <div key={field.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-ink-200">{field.label}</label>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, [field.visKey]: !prev[field.visKey as keyof TagFormData] }))}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                          form[field.visKey as keyof TagFormData]
                            ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                            : 'bg-white/[0.04] text-ink-400 border border-white/[0.06]'
                        }`}
                      >
                        {form[field.visKey as keyof TagFormData] ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {form[field.visKey as keyof TagFormData] ? 'Public' : 'Private'}
                      </button>
                    </div>
                    <input
                      value={form[field.key as keyof TagFormData] as string}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="input-field"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy summary */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <Shield className="h-5 w-5 shrink-0 text-brand-400" />
              <div>
                <p className="text-sm font-medium text-ink-200">Privacy Controls</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-400">
                  Only information you mark as Public will appear on the scanned tag page.
                  Private information is never exposed. Your authentication data, passwords,
                  and payment information are never stored in Smart Tags.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => handleSave('ready')}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEditing ? 'Save Changes' : 'Save Tag'}
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="btn-ghost"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-400">
              Live Preview
            </h3>
            <div className="card-surface p-6">
              <SmartTagPreview
                tagType={form.tagType}
                name={form.name}
                tagId={existingTag?.tag_id ?? 'PZ-XXXXXXXX'}
                photoUrl={photoPreview}
              />
            </div>

            {/* Coming Soon notice */}
            <div className="mt-4 rounded-2xl border border-ocean-500/20 bg-ocean-500/5 p-4 text-center">
              <Tag className="mx-auto h-5 w-5 text-ocean-400" />
              <p className="mt-2 text-sm font-semibold text-ocean-300">Physical Tag Coming Soon</p>
              <p className="mt-1 text-xs text-ink-400">
                Your tag data is saved and ready. Physical tags will be available for purchase soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
